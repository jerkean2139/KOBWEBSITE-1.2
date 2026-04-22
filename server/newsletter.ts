import { Router, json } from "express";
import { db } from "./db";
import { newsletters, researchSources, apiSessionTokens, painPoints, industryProfiles } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { chatCompletion } from "./ai-client";
import { Resend } from "resend";
import { GoogleGenAI, Modality } from "@google/genai";
import path from "path";
import fs from "fs";
import { 
  aiGenerationLimiter, 
  emailSendLimiter,
  trackConcurrentRequest, 
  releaseConcurrentRequest 
} from "./rate-limiter";
import { validateBody, newsletterCreateSchema, newsletterUpdateSchema, emailSendSchema, newsletterSourceSchema } from "./validation";
import { logger } from "./logger";
import { 
  isValidAdminKey, 
  createSessionToken, 
  validateSseToken, 
  deleteSessionToken,
  createAuthMiddleware 
} from "./auth-utils";

const router = Router();
router.use(json());

// SSRF protection - validate URLs comprehensively
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    
    const hostname = url.hostname.toLowerCase();
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') return false;
    if (hostname === '::1' || hostname === '[::1]') return false;
    if (hostname.endsWith('.local') || hostname.endsWith('.localhost')) return false;
    if (/^10\./.test(hostname)) return false;
    if (/^192\.168\./.test(hostname)) return false;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) return false;
    if (/^169\.254\./.test(hostname)) return false;
    if (/^127\./.test(hostname)) return false;
    if (hostname === '169.254.169.254') return false;
    if (hostname === 'metadata.google.internal') return false;
    if (hostname.includes('metadata') && hostname.includes('internal')) return false;
    
    return true;
  } catch {
    return false;
  }
}

const authMiddleware = createAuthMiddleware();

router.post("/session-token", authMiddleware, async (req: any, res) => {
  try {
    const token = await createSessionToken(req.authenticatedKey);
    res.json({ token });
  } catch (error) {
    logger.error("Error creating session token", { endpoint: "/api/session-token" }, error as Error);
    res.status(500).json({ error: "Failed to create session token" });
  }
});

router.use((req, res, next) => {
  if (req.path.includes("/auto-generate")) {
    return next();
  }
  authMiddleware(req, res, next);
});

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateNewsletterImage(title: string, tldr: string, newsletterId: number): Promise<string | null> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      logger.warn("GEMINI_API_KEY not set, skipping image generation");
      return null;
    }

    const prompt = `Create a professional, cinematic header image for a business newsletter.

NEWSLETTER CONTEXT:
Title: "${title}"
Summary: "${tldr}"

IMAGE REQUIREMENTS:
- Style: Modern business, cinematic documentary photography
- Mood: Professional, inspiring, forward-thinking
- Colors: Deep blues, warm amber/gold accents, clean whites
- Composition: Wide aspect ratio (16:9), suitable for email header
- Subject: Abstract business concept visualization OR professional workspace scene
- Avoid: Text, logos, watermarks, stock photo aesthetic, faces
- Quality: High resolution, crisp details, natural lighting

The image should evoke themes of business growth, automation, systems thinking, and professional success.`;

    const imageResponse = await gemini.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = imageResponse.candidates;
    if (candidates && candidates.length > 0) {
      const content = candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const imageBuffer = Buffer.from(part.inlineData.data, "base64");
            const imageName = `newsletter-${newsletterId}-${Date.now()}.png`;
            const imagePath = path.join(process.cwd(), "client", "public", "newsletter-images", imageName);
            
            await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
            await fs.promises.writeFile(imagePath, imageBuffer);
            return `/newsletter-images/${imageName}`;
          }
        }
      }
    }
    
    logger.warn("No image data in Gemini response");
    return null;
  } catch (error) {
    logger.error("Error generating newsletter image", { newsletterId }, error as Error);
    return null;
  }
}

router.get("/newsletters", authMiddleware, async (_req, res) => {
  try {
    const allNewsletters = await db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
    res.json(allNewsletters);
  } catch (error) {
    logger.error("Error fetching newsletters", { endpoint: "/api/newsletters" }, error as Error);
    res.status(500).json({ error: "Failed to fetch newsletters" });
  }
});

router.post("/newsletters", authMiddleware, async (req, res) => {
  try {
    const validation = validateBody(newsletterCreateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const title = validation.data.title || "New Newsletter";
    const [newsletter] = await db.insert(newsletters).values({ title }).returning();
    res.json(newsletter);
  } catch (error) {
    logger.error("Error creating newsletter", { endpoint: "/api/newsletters" }, error as Error);
    res.status(500).json({ error: "Failed to create newsletter" });
  }
});

router.get("/newsletters/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    const sources = await db.select().from(researchSources).where(eq(researchSources.newsletterId, id));
    res.json({ ...newsletter, sources });
  } catch (error) {
    logger.error("Error fetching newsletter", { endpoint: "/api/newsletters/:id" }, error as Error);
    res.status(500).json({ error: "Failed to fetch newsletter" });
  }
});

router.post("/newsletters/:id/sources", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const validation = validateBody(newsletterSourceSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const { url, title, content } = validation.data;
    const [source] = await db.insert(researchSources).values({
      newsletterId: id,
      url,
      title,
      content,
    }).returning();
    res.json(source);
  } catch (error) {
    logger.error("Error adding source", { endpoint: "/api/newsletters/:id/sources" }, error as Error);
    res.status(500).json({ error: "Failed to add source" });
  }
});

router.post("/newsletters/:id/summarize", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sources = await db.select().from(researchSources).where(eq(researchSources.newsletterId, id));
    
    if (sources.length === 0) {
      return res.status(400).json({ error: "No sources to summarize. Add at least 10-40 sources for best results." });
    }

    const sourcesText = sources.map((s, i) => `[${i+1}] ${s.title}\nURL: ${s.url || 'N/A'}\nContent: ${s.content?.slice(0, 1000) || 'N/A'}`).join("\n\n---\n\n");

    const completion = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the lead content curator for Jeremy Kean's "Kean on Biz" biweekly newsletter.

TARGET AUDIENCE:
- Business coaches and consultants
- Insurance agency owners
- Entrepreneurs interested in AI and automation
- Business owners looking to scale with systems

CONTENT PRIORITIES:
1. AI & automation tools and strategies
2. GoHighLevel updates and tips
3. Business systems and SOPs
4. Coaching/consulting industry trends
5. Insurance industry technology
6. Time-saving automation workflows
7. Leadership and team building
8. Revenue growth strategies

TONE: Conversational, practical, no-fluff. Jeremy has 35 years of business experience - the newsletter should reflect wisdom and real-world application, not hype.`
        },
        {
          role: "user",
          content: `You have ${sources.length} research sources. Your job is to:

1. Analyze all sources for relevance to the target audience
2. Select the TOP 10 most valuable insights (mix of: AI/automation news, business strategy, tools, and trends)
3. Write a compelling TLDR that captures the overall theme
4. Each Top 10 item should be actionable and valuable - not just a headline, but WHY it matters

Sources to analyze:
${sourcesText}

Format your response as JSON:
{
  "tldr": "2-3 sentence executive summary of this issue's theme",
  "topTen": [
    "1. [Headline] - [Why it matters and what to do about it]",
    "2. [Headline] - [Why it matters and what to do about it]",
    ...
  ],
  "sourcesUsed": [1, 3, 5, 7, 12, 15, 18, 22, 28, 31]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.content || "{}");

    await db.update(newsletters)
      .set({ 
        tldr: result.tldr, 
        topTenItems: result.topTen,
        updatedAt: new Date()
      })
      .where(eq(newsletters.id, id));

    res.json(result);
  } catch (error) {
    logger.error("Error summarizing", { endpoint: "/api/newsletters/:id/summarize" }, error as Error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

router.post("/newsletters/:id/generate-html", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));
    
    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    const topTenItems = (newsletter.topTenItems as string[]) || [];
    
    const htmlContent = generateEmailHTML({
      title: newsletter.title,
      tldr: newsletter.tldr || "",
      topTen: topTenItems,
      headerImage: newsletter.headerImage,
    });

    await db.update(newsletters)
      .set({ htmlContent, updatedAt: new Date() })
      .where(eq(newsletters.id, id));

    res.json({ htmlContent });
  } catch (error) {
    logger.error("Error generating HTML", { endpoint: "/api/newsletters/:id/generate-html" }, error as Error);
    res.status(500).json({ error: "Failed to generate HTML" });
  }
});

router.post("/newsletters/:id/send", authMiddleware, async (req, res) => {
  try {
    if (!resend) {
      return res.status(400).json({ error: "Resend API key not configured" });
    }

    const id = parseInt(req.params.id);
    const { testEmail } = req.body;
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));

    if (!newsletter || !newsletter.htmlContent) {
      return res.status(400).json({ error: "Newsletter not ready to send" });
    }

    const { data, error } = await resend.emails.send({
      from: "Jeremy Kean <newsletter@mail.keanonbiz.co>",
      to: testEmail ? [testEmail] : [],
      subject: newsletter.title,
      html: newsletter.htmlContent,
    });

    if (error) {
      logger.error("Resend error", { endpoint: "/api/newsletters/:id/send" }, new Error(error.message));
      return res.status(500).json({ error: error.message });
    }

    if (!testEmail) {
      await db.update(newsletters)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(newsletters.id, id));
    }

    res.json({ success: true, id: data?.id });
  } catch (error) {
    logger.error("Error sending newsletter", { endpoint: "/api/newsletters/:id/send" }, error as Error);
    res.status(500).json({ error: "Failed to send newsletter" });
  }
});

router.put("/newsletters/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, tldr, topTenItems } = req.body;
    
    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (tldr !== undefined) updateData.tldr = tldr;
    if (topTenItems !== undefined) updateData.topTenItems = topTenItems;
    
    const [updated] = await db.update(newsletters)
      .set(updateData)
      .where(eq(newsletters.id, id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    const topTen = (updated.topTenItems as string[]) || [];
    const htmlContent = generateEmailHTML({
      title: updated.title,
      tldr: updated.tldr || "",
      topTen,
      headerImage: updated.headerImage,
    });

    const [final] = await db.update(newsletters)
      .set({ htmlContent, updatedAt: new Date() })
      .where(eq(newsletters.id, id))
      .returning();
    
    res.json(final);
  } catch (error) {
    logger.error("Error updating newsletter", { endpoint: "/api/newsletters/:id" }, error as Error);
    res.status(500).json({ error: "Failed to update newsletter" });
  }
});

router.post("/newsletters/:id/approve", authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, id));

    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    const errors: string[] = [];
    if (!newsletter.title || newsletter.title === "New Newsletter") errors.push("Title is missing or default");
    const tldrWords = (newsletter.tldr || "").trim().split(/\s+/).filter(Boolean).length;
    if (tldrWords < 20) errors.push("TL;DR must be at least 20 words");
    const topTen = (newsletter.topTenItems as string[]) || [];
    if (topTen.length < 10) errors.push(`Need 10 Top Ten items (currently ${topTen.length})`);
    if (!newsletter.htmlContent) errors.push("HTML email not rendered");

    if (errors.length > 0) {
      return res.status(400).json({ error: "Checklist not met", errors });
    }

    const [updated] = await db.update(newsletters)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(newsletters.id, id))
      .returning();

    res.json(updated);
  } catch (error) {
    logger.error("Error approving newsletter", { endpoint: "/api/newsletters/:id/approve" }, error as Error);
    res.status(500).json({ error: "Failed to approve newsletter" });
  }
});

router.post("/fetch-article", authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }
    
    // SSRF protection
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid or blocked URL" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KeanOnBiz/1.0)"
      }
    });
    const html = await response.text();
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    
    let content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    res.json({ title, content });
  } catch (error) {
    logger.error("Error fetching article", { endpoint: "/api/fetch-article" }, error as Error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Automated newsletter generation with streaming progress (SSE - auth via session token)
router.get("/newsletters/:id/auto-generate", authMiddleware, async (req, res) => {
  // Validate session token (short-lived, not the admin key)
  const sessionToken = req.query.token as string;
  const isValidToken = await validateSseToken(sessionToken);
  if (!isValidToken) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  
  const id = parseInt(req.params.id);
  
  // Set up SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (stage: string, message: string, data?: any) => {
    res.write(`data: ${JSON.stringify({ stage, message, data })}\n\n`);
  };

  const rateLimitKey = `newsletter:${sessionToken}`;
  const rateCheck = aiGenerationLimiter(rateLimitKey);
  if (!rateCheck.allowed) {
    sendEvent("error", rateCheck.reason || "Rate limit exceeded");
    res.end();
    return;
  }

  trackConcurrentRequest(rateLimitKey);
  
  req.on("close", async () => {
    await deleteSessionToken(sessionToken);
    releaseConcurrentRequest(rateLimitKey);
  });

  try {
    // Stage 1: Starting
    sendEvent("starting", "Initializing newsletter generation...");
    await new Promise(r => setTimeout(r, 500));

    // Stage 2: Pull real industry pain points from the database
    sendEvent("researching", "Pulling industry pain points from database...");

    let painPointContext = "";
    let painPointCount = 0;
    try {
      const industries = await db.select().from(industryProfiles).where(eq(industryProfiles.status, "active"));
      const topPainPoints = await db
        .select()
        .from(painPoints)
        .orderBy(desc(painPoints.severity))
        .limit(25);

      if (topPainPoints.length > 0) {
        const industryMap = new Map(industries.map(i => [i.id, i.name]));
        painPointCount = topPainPoints.length;
        painPointContext = `\n\nREAL INDUSTRY PAIN POINTS FROM OUR DATABASE (use these as grounding for more targeted content):\n${topPainPoints.map((pp, i) => `${i + 1}. [${industryMap.get(pp.industryId) || "General"}] ${pp.title} (severity: ${pp.severity}/10) - ${pp.description || ""}${pp.manumationAngle ? ` | Manumation angle: ${pp.manumationAngle}` : ""}`).join("\n")}`;
      }
    } catch (ppError) {
      logger.warn("Failed to fetch pain points for newsletter research, continuing without them", { error: ppError });
    }

    sendEvent("researching", `Loaded ${painPointCount} real pain points. Scanning latest trends...`);
    await new Promise(r => setTimeout(r, 500));

    // Stage 2b: Research - AI generates trending topics grounded in real pain points
    sendEvent("researching", "Generating research items grounded in real industry data...");
    
    const researchCompletion = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a business intelligence analyst. Generate 30 realistic, current research items that would appear in industry news sources.

Focus areas:
- AI & automation tools (ChatGPT updates, Claude, automation platforms)
- GoHighLevel news and tips
- Business coaching industry trends
- Insurance agency technology
- CRM and marketing automation
- Workflow automation and SOPs
- Leadership and scaling businesses

For each item, provide a realistic title and 1-2 sentence summary as if from a real article.

IMPORTANT: Ground your research in real-world pain points that business owners actually face. At least 8-10 of your items should directly address or relate to the specific pain points provided below. Reference concrete problems and solutions rather than generic trends.${painPointContext}`
        },
        {
          role: "user",
          content: `Generate 30 research items for this week's newsletter. Mix of:
- 8 AI/automation news items (tie to real automation pain points where possible)
- 6 GoHighLevel/CRM updates
- 6 business coaching insights (ground in real coaching pain points)
- 5 insurance industry tech items (address real agency pain points)
- 5 general business strategy items

Format as JSON array:
{
  "items": [
    {"title": "...", "summary": "...", "category": "ai|ghl|coaching|insurance|strategy"}
  ]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const researchData = JSON.parse(researchCompletion.content || "{}");
    const items = researchData.items || [];
    
    sendEvent("researching", `Found ${items.length} trending topics (grounded in ${painPointCount} real pain points)`, { count: items.length, painPointCount });
    await new Promise(r => setTimeout(r, 500));

    // Save research items to database
    for (const item of items) {
      await db.insert(researchSources).values({
        newsletterId: id,
        title: item.title,
        content: item.summary,
        url: null
      });
    }

    sendEvent("analyzing", `Saved ${items.length} sources. Now ranking for relevance...`);
    await new Promise(r => setTimeout(r, 500));

    // Stage 3: Ranking and selecting Top 10
    sendEvent("ranking", "AI is selecting the Top 10 most valuable insights...");
    
    const sourcesText = items.map((s: any, i: number) => 
      `[${i+1}] ${s.title} (${s.category})\n${s.summary}`
    ).join("\n\n");

    const summaryCompletion = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the lead content curator for Jeremy Kean's "Kean on Biz" biweekly newsletter.

TARGET AUDIENCE:
- Business coaches and consultants
- Insurance agency owners
- Entrepreneurs interested in AI and automation
- Business owners looking to scale with systems

TONE: Conversational, practical, no-fluff. Jeremy has 35 years of business experience.

IMPORTANT: Prioritize items that address real pain points our audience faces. When writing "why it matters," connect insights to specific operational problems business owners deal with daily. Make every item actionable and grounded in reality, not hype.${painPointContext}`
        },
        {
          role: "user",
          content: `From these ${items.length} research items, select the TOP 10 most valuable for our audience. Prioritize items that directly address real industry pain points and offer practical solutions.

Research items:
${sourcesText}

Format response as JSON:
{
  "tldr": "2-3 sentence theme for this newsletter issue",
  "topTen": [
    "1. [Headline] - [Why it matters and what to do about it]",
    ...10 items total
  ]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(summaryCompletion.content || "{}");
    
    sendEvent("ranking", "Selected Top 10 insights!", { topTen: result.topTen });
    await new Promise(r => setTimeout(r, 500));

    // Stage 4: Generate newsletter title
    sendEvent("writing", "Creating newsletter title and TLDR...");
    
    const titleCompletion = await chatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Based on this TLDR, generate a catchy newsletter title (max 60 chars):

TLDR: ${result.tldr}

Just respond with the title, nothing else.`
        }
      ]
    });

    const generatedTitle = titleCompletion.content?.trim() || "This Week in Business & AI";

    // Update newsletter in database
    await db.update(newsletters)
      .set({
        title: generatedTitle,
        tldr: result.tldr,
        topTenItems: result.topTen,
        updatedAt: new Date()
      })
      .where(eq(newsletters.id, id));

    sendEvent("writing", "Newsletter content ready!", { title: generatedTitle, tldr: result.tldr });
    await new Promise(r => setTimeout(r, 500));

    // Stage 5: Generate header image with Gemini
    sendEvent("image", "Generating header image with Gemini...");
    
    let headerImageUrl: string | null = null;
    try {
      headerImageUrl = await generateNewsletterImage(generatedTitle, result.tldr, id);
      if (headerImageUrl) {
        await db.update(newsletters)
          .set({ headerImage: headerImageUrl, updatedAt: new Date() })
          .where(eq(newsletters.id, id));
        sendEvent("image", "Header image generated!", { imageUrl: headerImageUrl });
      } else {
        sendEvent("image", "Skipped image generation (no API key or error)");
      }
    } catch (imageError) {
      logger.warn("Newsletter image generation failed, continuing without image", { newsletterId: id });
      sendEvent("image", "Image generation skipped, continuing...");
    }
    await new Promise(r => setTimeout(r, 500));

    // Stage 6: Generate HTML
    sendEvent("finalizing", "Generating email template...");
    
    const htmlContent = generateEmailHTML({
      title: generatedTitle,
      tldr: result.tldr,
      topTen: result.topTen,
      headerImage: headerImageUrl
    });

    await db.update(newsletters)
      .set({ htmlContent, updatedAt: new Date() })
      .where(eq(newsletters.id, id));

    sendEvent("complete", "Newsletter ready!", { 
      title: generatedTitle,
      tldr: result.tldr,
      topTen: result.topTen,
      htmlContent,
      headerImage: headerImageUrl
    });

    res.end();
  } catch (error) {
    logger.error("Auto-generate error", { endpoint: "/api/newsletters/:id/auto-generate" }, error as Error);
    sendEvent("error", "Failed to generate newsletter: " + (error as Error).message);
    res.end();
  }
});

function generateEmailHTML({ title, tldr, topTen, headerImage }: { title: string; tldr: string; topTen: string[]; headerImage?: string | null }) {
  const baseUrl = "https://keanonbiz.com";
  const headerImageHtml = headerImage 
    ? `
          <!-- Header Image -->
          <tr>
            <td style="padding: 0;">
              <img src="${baseUrl}${headerImage}" alt="${title}" style="width: 100%; height: auto; display: block; border-radius: 8px 8px 0 0;" />
            </td>
          </tr>` 
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <h1 style="margin: 0; color: #3b82f6; font-size: 28px; font-weight: bold;">KEAN<span style="color: #94a3b8; font-weight: normal;">ON</span>BIZ</h1>
            </td>
          </tr>
          ${headerImageHtml}
          <!-- Title -->
          <tr>
            <td style="padding: 40px 30px 20px;">
              <h2 style="margin: 0; color: #ffffff; font-size: 32px; line-height: 1.3;">${title}</h2>
            </td>
          </tr>
          
          <!-- TLDR -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #1e3a5f; border-radius: 12px; padding: 24px; border-left: 4px solid #FFD700;">
                <p style="margin: 0 0 8px; color: #FFD700; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">TL;DR</p>
                <p style="margin: 0; color: #e2e8f0; font-size: 16px; line-height: 1.6;">${tldr}</p>
              </div>
            </td>
          </tr>
          
          <!-- Top 10 -->
          <tr>
            <td style="padding: 0 30px 40px;">
              <h3 style="margin: 0 0 20px; color: #3b82f6; font-size: 20px;">Top 10 Things You Need to Know</h3>
              ${topTen.map((item, i) => `
              <div style="margin-bottom: 16px; padding: 16px; background-color: #172554; border-radius: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 15px; line-height: 1.5;">${item}</p>
              </div>
              `).join('')}
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <a href="https://keanonbiz.com/jeremys-calendar" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">Book a Strategy Call</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">Jeremy Kean | Kean on Biz</p>
              <p style="margin: 0; color: #475569; font-size: 12px;">
                <a href="https://keanonbiz.com" style="color: #3b82f6; text-decoration: none;">keanonbiz.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default router;
