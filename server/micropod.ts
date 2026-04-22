import { Router, Request, Response } from "express";
import { db } from "./db";
import { podcastEpisodes, painPoints, industryProfiles } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { logger } from "./logger";
import { requireAuth, createSessionToken, validateSseToken, deleteSessionToken } from "./auth-utils";
import { createRateLimiter } from "./rate-limiter";
import { chatCompletion } from "./ai-client";
import { generateBlogSystemPrompt, JEREMY_VOICE_PROFILE } from "./jeremy-voice-profile";
import * as fs from "fs";
import * as path from "path";

const router = Router();

const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 20,
  concurrentLimit: 3,
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

router.post("/session-token", requireAuth, async (req: any, res) => {
  try {
    const token = await createSessionToken(req.authenticatedKey);
    res.json({ token });
  } catch (error) {
    logger.error("Error creating micropod session token", {}, error as Error);
    res.status(500).json({ error: "Failed to create session token" });
  }
});

router.get("/published", async (_req, res) => {
  try {
    const episodes = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.status, "published"))
      .orderBy(desc(podcastEpisodes.publishedAt));
    res.json(episodes);
  } catch (error) {
    logger.error("Failed to fetch published episodes", {}, error as Error);
    res.status(500).json({ error: "Failed to fetch published episodes" });
  }
});

router.get("/episodes", requireAuth, async (_req, res) => {
  try {
    const episodes = await db
      .select()
      .from(podcastEpisodes)
      .orderBy(desc(podcastEpisodes.createdAt));
    res.json(episodes);
  } catch (error) {
    logger.error("Failed to fetch episodes", {}, error as Error);
    res.status(500).json({ error: "Failed to fetch episodes" });
  }
});

router.get("/episodes/:id", requireAuth, async (req, res) => {
  try {
    const [episode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, parseInt(req.params.id)));
    if (!episode) return res.status(404).json({ error: "Episode not found" });
    res.json(episode);
  } catch (error) {
    logger.error("Failed to fetch episode", {}, error as Error);
    res.status(500).json({ error: "Failed to fetch episode" });
  }
});

router.post("/episodes", requireAuth, writeLimiter, async (req: Request, res: Response) => {
  try {
    const { title, description, topics, targetIndustryId, targetLength, sourceBlogPostId } = req.body;
    const slug = generateSlug(title || "untitled-episode");

    const existingEpisodes = await db.select({ id: podcastEpisodes.id }).from(podcastEpisodes);
    const episodeNumber = existingEpisodes.length + 1;

    const [episode] = await db
      .insert(podcastEpisodes)
      .values({
        title: title || "Untitled Episode",
        slug: `${slug}-${Date.now()}`,
        description,
        topics: topics || [],
        targetIndustryId,
        targetLength: targetLength || 7,
        sourceBlogPostId,
        episodeNumber,
        status: "draft",
      })
      .returning();
    res.json(episode);
  } catch (error) {
    logger.error("Failed to create episode", {}, error as Error);
    res.status(500).json({ error: "Failed to create episode" });
  }
});

router.put("/episodes/:id", requireAuth, writeLimiter, async (req: Request, res: Response) => {
  try {
    const { title, description, script, topics, targetLength, status, shortDescription } = req.body;
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (script !== undefined) updateData.script = script;
    if (topics !== undefined) updateData.topics = topics;
    if (targetLength !== undefined) updateData.targetLength = targetLength;
    if (status !== undefined) updateData.status = status;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;

    if (title) {
      updateData.slug = `${generateSlug(title)}-${Date.now()}`;
    }

    const [episode] = await db
      .update(podcastEpisodes)
      .set(updateData)
      .where(eq(podcastEpisodes.id, parseInt(req.params.id)))
      .returning();
    res.json(episode);
  } catch (error) {
    logger.error("Failed to update episode", {}, error as Error);
    res.status(500).json({ error: "Failed to update episode" });
  }
});

router.delete("/episodes/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(podcastEpisodes).where(eq(podcastEpisodes.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete episode", {}, error as Error);
    res.status(500).json({ error: "Failed to delete episode" });
  }
});

router.get("/episodes/:id/generate", async (req, res) => {
  const token = req.query.token as string;
  if (!token || !(await validateSseToken(token))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const episodeId = parseInt(req.params.id);
    const topic = req.query.topic as string || "";
    const targetLength = parseInt(req.query.targetLength as string) || 7;
    const industryId = req.query.industryId ? parseInt(req.query.industryId as string) : undefined;
    const blogPostId = req.query.blogPostId ? parseInt(req.query.blogPostId as string) : undefined;

    const [episode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, episodeId));

    if (!episode) {
      sendEvent("error", { message: "Episode not found" });
      res.end();
      return;
    }

    sendEvent("progress", { stage: "research", message: "Pulling industry pain points and research..." });

    let painPointContext = "";
    let industryName = "";

    if (industryId) {
      const [industry] = await db
        .select()
        .from(industryProfiles)
        .where(eq(industryProfiles.id, industryId));

      if (industry) {
        industryName = industry.name;
        const relevantPoints = await db
          .select()
          .from(painPoints)
          .where(eq(painPoints.industryId, industryId))
          .orderBy(desc(painPoints.severity))
          .limit(5);

        if (relevantPoints.length > 0) {
          painPointContext = `\n\nREAL INDUSTRY PAIN POINTS (${industry.name}):\n${relevantPoints
            .map(
              (p, i) =>
                `${i + 1}. ${p.title} (Severity: ${p.severity}/10)\n   ${p.description}\n   Manumation Angle: ${p.manumationAngle || "N/A"}`
            )
            .join("\n\n")}`;
        }
      }
    }

    if (!painPointContext) {
      const topPoints = await db
        .select()
        .from(painPoints)
        .orderBy(desc(painPoints.severity))
        .limit(5);

      if (topPoints.length > 0) {
        painPointContext = `\n\nREAL BUSINESS PAIN POINTS (cross-industry):\n${topPoints
          .map(
            (p, i) =>
              `${i + 1}. ${p.title} (Severity: ${p.severity}/10)\n   ${p.description}`
          )
          .join("\n\n")}`;
      }
    }

    let blogContext = "";
    if (blogPostId) {
      const { blogPosts } = await import("@shared/schema");
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, blogPostId));
      if (post && post.content) {
        blogContext = `\n\nSOURCE BLOG POST TO ADAPT:\nTitle: ${post.title}\nContent (first 2000 chars): ${post.content.slice(0, 2000)}`;
      }
    }

    sendEvent("progress", {
      stage: "research_complete",
      message: `Found ${painPointContext ? "relevant pain points" : "general context"} for research`,
    });

    sendEvent("progress", { stage: "talking_points", message: "Generating talking points..." });

    const talkingPointsResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a podcast research assistant for Jeremy Kean's MicroPod show. Generate detailed talking points for a ${targetLength}-minute episode.

The topic is: "${topic || episode.title}"
${industryName ? `Target industry: ${industryName}` : ""}
${painPointContext}
${blogContext}

Generate 5-8 talking points that:
1. Ground the episode in real business pain points
2. Follow Jeremy's style: empathy first, clarity second, direct truth last
3. Include specific examples and scenarios
4. Build toward a clear takeaway/action item

Return as JSON: { "talkingPoints": [{ "point": "...", "details": "...", "timeEstimate": "1-2 min" }], "suggestedTitle": "...", "suggestedDescription": "..." }`,
        },
        {
          role: "user",
          content: `Generate talking points for a ${targetLength}-minute MicroPod episode about: ${topic || episode.title}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const talkingPointsData = JSON.parse(talkingPointsResponse.content || "{}");

    sendEvent("progress", {
      stage: "talking_points_complete",
      message: `Generated ${talkingPointsData.talkingPoints?.length || 0} talking points`,
      data: talkingPointsData,
    });

    sendEvent("progress", { stage: "script_writing", message: "Writing spoken-word script in Jeremy's voice..." });

    const wordTarget = targetLength * 150;

    const scriptResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are writing a spoken-word podcast script AS Jeremy Kean for his MicroPod show.

${generateBlogSystemPrompt(topic || episode.title, industryName || "general")}

PODCAST-SPECIFIC RULES:
- This is SPOKEN WORD. Write exactly as Jeremy would speak.
- Use short sentences. Natural pauses. Conversational flow.
- Include [PAUSE] markers for dramatic beats.
- Include [BREATH] markers for natural pacing.
- No formal introductions. Start with a hook that grabs attention.
- Sign off naturally: "I'm Jeremy Kean. Build it once. Let it echo."
- Target approximately ${wordTarget} words (${targetLength} minutes at ~150 words/min).
- Use contractions naturally (you're, that's, I've, don't).
- Include rhetorical questions to engage the listener.
- Reference specific, real-world scenarios (not generic advice).

BANNED IN SPOKEN FORM:
${JEREMY_VOICE_PROFILE.bannedWords.slice(0, 15).join(", ")}

APPROVED PHRASES (use naturally):
${JEREMY_VOICE_PROFILE.approvedPhrases.join("\n")}

STRUCTURE:
1. Cold open hook (15-30 seconds)
2. Problem setup with empathy (1-2 minutes)
3. Core content with examples (${targetLength - 4} minutes)
4. Takeaway + soft CTA (1-2 minutes)`,
        },
        {
          role: "user",
          content: `Write a complete ${targetLength}-minute podcast script about: ${topic || episode.title}

TALKING POINTS TO COVER:
${talkingPointsData.talkingPoints?.map((tp: any, i: number) => `${i + 1}. ${tp.point}: ${tp.details}`).join("\n") || "General discussion"}

${painPointContext}
${blogContext}

Write the full script now. Make it sound like Jeremy talking to one person.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const script = scriptResponse.content || "";

    sendEvent("progress", {
      stage: "script_complete",
      message: `Script written (~${script.split(/\s+/).length} words)`,
    });

    sendEvent("progress", { stage: "script_review", message: "Reviewing script for flow and pacing..." });

    const reviewResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an audio content reviewer. Analyze this podcast script for:
1. Speech flow and natural pacing
2. Engagement hooks and transitions
3. Voice consistency with Jeremy Kean's brand
4. Appropriate length for a ${targetLength}-minute episode (~${wordTarget} words)
5. Any awkward phrasing that wouldn't sound natural when spoken

Return JSON: {
  "overallScore": 1-100,
  "flowScore": 1-100,
  "engagementScore": 1-100,
  "voiceScore": 1-100,
  "estimatedMinutes": number,
  "wordCount": number,
  "suggestions": ["..."],
  "strengths": ["..."]
}`,
        },
        {
          role: "user",
          content: `Review this podcast script:\n\n${script}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const reviewData = JSON.parse(reviewResponse.content || "{}");

    sendEvent("progress", {
      stage: "review_complete",
      message: `Script review: ${reviewData.overallScore}/100 overall`,
      data: reviewData,
    });

    const title = talkingPointsData.suggestedTitle || topic || episode.title;
    const description = talkingPointsData.suggestedDescription || "";

    await db
      .update(podcastEpisodes)
      .set({
        title,
        description,
        script,
        topics: talkingPointsData.talkingPoints?.map((tp: any) => tp.point) || [],
        targetLength,
        targetIndustryId: industryId,
        sourceBlogPostId: blogPostId,
        updatedAt: new Date(),
      })
      .where(eq(podcastEpisodes.id, episodeId));

    const [updatedEpisode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, episodeId));

    sendEvent("complete", {
      episode: updatedEpisode,
      review: reviewData,
      talkingPoints: talkingPointsData,
    });

    await deleteSessionToken(token);
  } catch (error) {
    logger.error("Script generation failed", {}, error as Error);
    sendEvent("error", { message: "Script generation failed" });
  }

  res.end();
});

router.get("/industries", async (_req, res) => {
  try {
    const industries = await db
      .select()
      .from(industryProfiles)
      .where(eq(industryProfiles.status, "active"))
      .orderBy(industryProfiles.name);
    res.json(industries);
  } catch (error) {
    logger.error("Failed to fetch industries for micropod", {}, error as Error);
    res.status(500).json({ error: "Failed to fetch industries" });
  }
});

router.get("/stats", requireAuth, async (_req, res) => {
  try {
    const allEpisodes = await db.select().from(podcastEpisodes);
    const drafts = allEpisodes.filter((e) => e.status === "draft");
    const approved = allEpisodes.filter((e) => e.status === "approved");
    const published = allEpisodes.filter((e) => e.status === "published");

    res.json({
      total: allEpisodes.length,
      drafts: drafts.length,
      approved: approved.length,
      published: published.length,
    });
  } catch (error) {
    logger.error("Failed to fetch micropod stats", {}, error as Error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.post("/episodes/:id/synthesize", requireAuth, writeLimiter, async (req: Request, res: Response) => {
  try {
    const episodeId = parseInt(req.params.id);
    const { voiceId, modelId } = req.body;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });
    }

    const selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    if (!selectedVoiceId) {
      return res.status(400).json({ error: "No voice ID provided. Set ELEVENLABS_VOICE_ID or pass voiceId in request." });
    }

    const selectedModel = modelId || "eleven_multilingual_v2";

    const [episode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, episodeId));

    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
    }

    if (!episode.script || episode.script.trim().length < 50) {
      return res.status(400).json({ error: "Episode script is too short or missing. Generate a script first." });
    }

    const cleanScript = episode.script
      .replace(/\[PAUSE\]/gi, "...")
      .replace(/\[BREATH\]/gi, " ")
      .replace(/\[.*?\]/g, "");

    logger.info("Starting ElevenLabs synthesis", { episodeId, voiceId: selectedVoiceId, model: selectedModel });

    const elevenLabsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: cleanScript,
        model_id: selectedModel,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!elevenLabsRes.ok) {
      const errorText = await elevenLabsRes.text();
      logger.error("ElevenLabs API error", { status: elevenLabsRes.status, error: errorText });
      return res.status(502).json({ error: `ElevenLabs API error: ${elevenLabsRes.status}`, details: errorText });
    }

    const audioBuffer = Buffer.from(await elevenLabsRes.arrayBuffer());
    const audioDir = path.join(process.cwd(), "public", "audio", "micropod");
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filename = `episode-${episodeId}-${Date.now()}.mp3`;
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, audioBuffer);

    const audioUrl = `/audio/micropod/${filename}`;
    const audioFileSize = audioBuffer.length;

    const wordCount = cleanScript.split(/\s+/).length;
    const estimatedDuration = Math.round((wordCount / 150) * 60);

    if (episode.audioUrl) {
      const oldFilePath = path.join(process.cwd(), "public", episode.audioUrl);
      if (fs.existsSync(oldFilePath)) {
        try { fs.unlinkSync(oldFilePath); } catch {}
      }
    }

    const [updatedEpisode] = await db
      .update(podcastEpisodes)
      .set({
        audioUrl,
        audioFileSize,
        audioDuration: estimatedDuration,
        updatedAt: new Date(),
      })
      .where(eq(podcastEpisodes.id, episodeId))
      .returning();

    logger.info("Audio synthesis complete", { episodeId, audioUrl, fileSize: audioFileSize });

    res.json({
      success: true,
      episode: updatedEpisode,
      audioUrl,
      fileSize: audioFileSize,
      estimatedDuration,
    });
  } catch (error) {
    logger.error("Audio synthesis failed", {}, error as Error);
    res.status(500).json({ error: "Audio synthesis failed" });
  }
});

router.post("/episodes/:id/publish", requireAuth, writeLimiter, async (req: Request, res: Response) => {
  try {
    const episodeId = parseInt(req.params.id);
    const [episode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, episodeId));

    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
    }

    const checks: { key: string; label: string; passed: boolean }[] = [
      { key: "title", label: "Title present", passed: !!episode.title && episode.title.trim().length > 0 },
      { key: "description", label: "Description > 50 chars", passed: !!episode.description && episode.description.length > 50 },
      { key: "script", label: "Script > 500 words", passed: !!episode.script && episode.script.split(/\s+/).length > 500 },
      { key: "audio", label: "Audio generated", passed: !!episode.audioUrl },
      { key: "duration", label: "Duration > 0", passed: !!episode.audioDuration && episode.audioDuration > 0 },
      { key: "topics", label: "Topics assigned", passed: !!episode.topics && Array.isArray(episode.topics) && episode.topics.length > 0 },
      { key: "transcript", label: "Transcript present", passed: !!episode.transcript && episode.transcript.trim().length > 0 },
    ];

    const allPassed = checks.every((c) => c.passed);
    const { force } = req.body || {};

    if (!allPassed && !force) {
      return res.status(400).json({
        error: "Episode does not pass all quality checks",
        checks,
        passedCount: checks.filter((c) => c.passed).length,
        totalCount: checks.length,
      });
    }

    const [updated] = await db
      .update(podcastEpisodes)
      .set({
        status: "published",
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(podcastEpisodes.id, episodeId))
      .returning();

    res.json({ episode: updated, checks });
  } catch (error) {
    logger.error("Failed to publish episode", {}, error as Error);
    res.status(500).json({ error: "Failed to publish episode" });
  }
});

router.post("/episodes/:id/approve", requireAuth, writeLimiter, async (req: Request, res: Response) => {
  try {
    const episodeId = parseInt(req.params.id);
    const [episode] = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.id, episodeId));

    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
    }

    const [updated] = await db
      .update(podcastEpisodes)
      .set({
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(podcastEpisodes.id, episodeId))
      .returning();

    res.json({ episode: updated });
  } catch (error) {
    logger.error("Failed to approve episode", {}, error as Error);
    res.status(500).json({ error: "Failed to approve episode" });
  }
});

router.get("/voice-config", requireAuth, async (_req, res) => {
  res.json({
    hasApiKey: !!process.env.ELEVENLABS_API_KEY,
    defaultVoiceId: process.env.ELEVENLABS_VOICE_ID || "",
    availableModels: [
      { id: "eleven_multilingual_v2", name: "Multilingual v2 (Recommended)" },
      { id: "eleven_monolingual_v1", name: "English v1" },
      { id: "eleven_turbo_v2_5", name: "Turbo v2.5 (Faster)" },
      { id: "eleven_turbo_v2", name: "Turbo v2 (Fastest)" },
    ],
  });
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatRfc2822(date: Date): string {
  return date.toUTCString();
}

export async function handlePodcastRss(_req: Request, res: Response) {
  try {
    const siteUrl = "https://keanonbiz.com";
    const episodes = await db
      .select()
      .from(podcastEpisodes)
      .where(eq(podcastEpisodes.status, "published"))
      .orderBy(desc(podcastEpisodes.publishedAt));

    const items = episodes
      .map((ep) => {
        const pubDate = ep.publishedAt || ep.createdAt;
        const audioUrl = ep.audioUrl ? `${siteUrl}${ep.audioUrl.startsWith("/") ? "" : "/"}${ep.audioUrl}` : "";
        const guid = `${siteUrl}/micropod/${ep.slug}`;
        const duration = ep.audioDuration ? formatDuration(ep.audioDuration) : "00:00";
        const fileSize = ep.audioFileSize || 0;

        return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description || "")}</description>
      <itunes:summary>${escapeXml(ep.description || "")}</itunes:summary>
      <itunes:episode>${ep.episodeNumber || 1}</itunes:episode>
      <itunes:author>Jeremy Kean</itunes:author>
      <itunes:duration>${duration}</itunes:duration>
      ${audioUrl ? `<enclosure url="${escapeXml(audioUrl)}" length="${fileSize}" type="audio/mpeg" />` : ""}
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${formatRfc2822(new Date(pubDate))}</pubDate>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MicroPod by Jeremy Kean</title>
    <link>${siteUrl}/micropod</link>
    <atom:link href="${siteUrl}/podcast.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <copyright>&#xA9; ${new Date().getFullYear()} Jeremy Kean / KeanOnBiz</copyright>
    <description>Short, sharp episodes on business automation, leadership, and the Manumation Method. Hosted by Jeremy Kean — 35+ years helping business owners build systems that breathe.</description>
    <itunes:author>Jeremy Kean</itunes:author>
    <itunes:owner>
      <itunes:name>Jeremy Kean</itunes:name>
      <itunes:email>support@keanonbiz.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${siteUrl}/og-image.png" />
    <itunes:category text="Business">
      <itunes:category text="Entrepreneurship" />
    </itunes:category>
    <itunes:category text="Technology" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <image>
      <url>${siteUrl}/og-image.png</url>
      <title>MicroPod by Jeremy Kean</title>
      <link>${siteUrl}/micropod</link>
    </image>
${items}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
    res.send(rss);
  } catch (error) {
    logger.error("Failed to generate podcast RSS feed", {}, error as Error);
    res.status(500).send("Failed to generate RSS feed");
  }
}

export default router;
