import { Router } from "express";
import { db } from "./db";
import { 
  youtubeChannels, 
  youtubeVideos, 
  contentTopics, 
  blogPosts, 
  blogMedia, 
  contentJobs,
  newsletters,
  researchSources,
  industryProfiles,
  painPoints
} from "@shared/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";
import { chatCompletion } from "./ai-client";
import { GoogleGenAI, Modality } from "@google/genai";
import Replicate from "replicate";
import { 
  generateBlogSystemPrompt, 
  selectImagePrompt,
  getTopicWeight,
  IMAGE_STYLE_CONFIG,
  BLOG_POST_CONFIG,
  NICHE_PRIORITY,
  JEREMY_VOICE_PROFILE
} from "./jeremy-voice-profile";
import { 
  aiGenerationLimiter, 
  trackConcurrentRequest, 
  releaseConcurrentRequest 
} from "./rate-limiter";
import { logger } from "./logger";

const router = Router();

// Path traversal protection - sanitize slugs for file operations
function sanitizeSlug(slug: string): string {
  return slug
    .replace(/[^a-zA-Z0-9-_]/g, '') // Only allow alphanumeric, dashes, underscores
    .replace(/\.\./g, '') // Remove path traversal attempts
    .slice(0, 100); // Limit length
}

// Gemini client for image generation (Nano Banana Pro)
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Replicate client for Flux LORA Pro image generation
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Leonardo AI API base URL
const LEONARDO_API_URL = "https://cloud.leonardo.ai/api/rest/v1";

// Image provider types
type ImageProvider = "gemini" | "leonardo" | "replicate";

// Generate image with selected provider
async function generateImageWithProvider(
  prompt: string,
  provider: ImageProvider,
  slug: string
): Promise<string> {
  const fs = await import("fs");
  const path = await import("path");
  
  // Sanitize slug to prevent path traversal
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug) {
    throw new Error("Invalid slug for image generation");
  }
  
  switch (provider) {
    case "gemini": {
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
              const imageName = `blog-${safeSlug}-${Date.now()}.png`;
              const imagePath = path.join(process.cwd(), "client", "public", "blog-images", imageName);
              
              await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
              await fs.promises.writeFile(imagePath, imageBuffer);
              return `/blog-images/${imageName}`;
            }
          }
        }
      }
      throw new Error("No image data in Gemini response");
    }
    
    case "leonardo": {
      // Create generation request
      const genResponse = await fetch(`${LEONARDO_API_URL}/generations`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${process.env.LEONARDO_API_KEY}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          height: 576,
          width: 1024,
          modelId: "aa77f04e-3eec-4034-9c07-d0f619684628", // Leonardo Kino XL
          prompt: prompt,
          num_images: 1,
          alchemy: true,
          presetStyle: "CINEMATIC",
          public: false
        })
      });
      
      const genData = await genResponse.json();
      const generationId = genData.sdGenerationJob?.generationId;
      
      if (!generationId) {
        throw new Error("Failed to start Leonardo generation");
      }
      
      // Poll for results (wait up to 60 seconds)
      for (let i = 0; i < 12; i++) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const resultResponse = await fetch(`${LEONARDO_API_URL}/generations/${generationId}`, {
          headers: {
            "accept": "application/json",
            "authorization": `Bearer ${process.env.LEONARDO_API_KEY}`
          }
        });
        
        const resultData = await resultResponse.json();
        const images = resultData.generations_by_pk?.generated_images;
        
        if (images && images.length > 0) {
          const imageUrl = images[0].url;
          
          // Download and save the image
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
          const imageName = `blog-${safeSlug}-${Date.now()}.png`;
          const imagePath = path.join(process.cwd(), "client", "public", "blog-images", imageName);
          
          await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
          await fs.promises.writeFile(imagePath, imageBuffer);
          return `/blog-images/${imageName}`;
        }
      }
      throw new Error("Leonardo generation timed out");
    }
    
    case "replicate": {
      // Use Flux Dev LORA model
      const output = await replicate.run(
        "black-forest-labs/flux-dev-lora",
        {
          input: {
            prompt: prompt,
            num_outputs: 1,
            aspect_ratio: "16:9",
            guidance_scale: 3.5,
            num_inference_steps: 28,
            output_format: "webp",
            output_quality: 90
          }
        }
      ) as string[];
      
      if (output && output.length > 0) {
        const imageUrl = output[0];
        
        // Download and save the image
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const imageName = `blog-${safeSlug}-${Date.now()}.webp`;
        const imagePath = path.join(process.cwd(), "client", "public", "blog-images", imageName);
        
        await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
        await fs.promises.writeFile(imagePath, imageBuffer);
        return `/blog-images/${imageName}`;
      }
      throw new Error("No image data in Replicate response");
    }
    
    default:
      throw new Error(`Unknown image provider: ${provider}`);
  }
}

// Two-Step Image Generation: Step 1 - Generate optimized image prompt
async function generateOptimizedImagePrompt(
  blogTitle: string,
  blogContent: string,
  keywords: string[],
  category: string
): Promise<{
  optimizedPrompt: string;
  visualConcept: string;
  moodDescription: string;
}> {
  // Defensive handling for missing or empty arrays
  const safeKeywords = Array.isArray(keywords) && keywords.length > 0 ? keywords : ["business", "automation"];
  const safeBlogContent = blogContent || "Business systems and automation strategies.";
  
  const promptGenerationRequest = `You are an expert visual director creating cinematic image prompts for business blog featured images.

BLOG CONTEXT:
Title: "${blogTitle}"
Category: ${category}
Keywords: ${safeKeywords.join(", ")}

CONTENT EXCERPT (for visual inspiration):
${safeBlogContent.slice(0, 1500)}...

BRAND VISUAL STYLE:
- Cinematic documentary photography style (think Roger Deakins or Emmanuel Lubezki)
- Real spaces, real tension, quiet moments of business reflection
- Muted earth tones with deep navy (#0f172a) and subtle warm copper accents
- Natural lighting, slight film grain, shallow depth of field
- NO stock photo aesthetic, NO people pointing at screens
- NO abstract tech blobs, NO corporate handshakes
- NO text overlays in the image

Create a detailed image generation prompt that:
1. Captures the emotional essence of the blog topic
2. Uses specific visual metaphors relevant to business/entrepreneurship
3. Includes lighting, composition, and mood details
4. Describes a single powerful moment, not a collage

Respond in JSON format:
{
  "optimizedPrompt": "Full detailed prompt for image generation (200-300 words, highly specific)",
  "visualConcept": "Brief 1-sentence description of the core visual idea",
  "moodDescription": "The emotional tone this image should evoke"
}`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: promptGenerationRequest }] }],
    });

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        optimizedPrompt: parsed.optimizedPrompt || "",
        visualConcept: parsed.visualConcept || "",
        moodDescription: parsed.moodDescription || ""
      };
    }
  } catch (error) {
    logger.error("Prompt generation error", {}, error as Error);
  }

  // Fallback to basic prompt
  return {
    optimizedPrompt: `Cinematic documentary style photograph capturing the essence of "${blogTitle}". Business setting with natural lighting, muted earth tones, subtle film grain. Focus on authentic human moment, no stock photo aesthetic. Deep shadows, warm highlights, shallow depth of field.`,
    visualConcept: `Business reflection moment for ${category}`,
    moodDescription: "Contemplative and authentic"
  };
}

// Two-Step Image Generation: Step 2 - Generate image with Gemini Imagen 3
async function generateImageWithGeminiImagen(
  prompt: string,
  slug: string
): Promise<string> {
  const fs = await import("fs");
  const path = await import("path");
  
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug) {
    throw new Error("Invalid slug for image generation");
  }

  // Use Gemini 2.0 Flash for image generation with the optimized prompt
  const imageResponse = await gemini.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: [{ 
      role: "user", 
      parts: [{ 
        text: `Generate a high-quality featured image for a business blog post.

${prompt}

Additional requirements:
- Aspect ratio: 16:9 (landscape, suitable for blog featured image)
- Style: Cinematic, documentary photography
- Lighting: Natural, with warm golden hour quality
- Avoid: Text, logos, watermarks, stock photo aesthetic
- Resolution: High quality for web display` 
      }] 
    }],
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
          const imageName = `blog-${safeSlug}-${Date.now()}.png`;
          const imagePath = path.join(process.cwd(), "client", "public", "blog-images", imageName);
          
          await fs.promises.mkdir(path.dirname(imagePath), { recursive: true });
          await fs.promises.writeFile(imagePath, imageBuffer);
          return `/blog-images/${imageName}`;
        }
      }
    }
  }
  throw new Error("No image data in Gemini Imagen response");
}

// Enhanced two-step image generation pipeline
async function generateEnhancedImage(
  title: string,
  content: string,
  keywords: string[],
  category: string,
  provider: ImageProvider,
  slug: string,
  sendEvent?: (event: string, data: any) => void
): Promise<{ imageUrl: string; promptUsed: string; visualConcept: string }> {
  // Step 1: Generate optimized prompt using Gemini
  if (sendEvent) {
    sendEvent("progress", { stage: "image_prompt", message: "Generating optimized image prompt..." });
  }
  
  const { optimizedPrompt, visualConcept, moodDescription } = await generateOptimizedImagePrompt(
    title,
    content,
    keywords,
    category
  );

  if (sendEvent) {
    sendEvent("progress", { 
      stage: "image_prompt_complete", 
      message: `Visual concept: ${visualConcept}`,
      data: { visualConcept, moodDescription }
    });
  }

  // Step 2: Generate image with the optimized prompt
  if (sendEvent) {
    sendEvent("progress", { stage: "image_generate", message: `Creating image with ${provider}...` });
  }

  let imageUrl: string;
  
  if (provider === "gemini") {
    // Use enhanced Gemini pipeline for Gemini provider
    imageUrl = await generateImageWithGeminiImagen(optimizedPrompt, slug);
  } else {
    // Use standard provider for Leonardo and Replicate
    imageUrl = await generateImageWithProvider(optimizedPrompt, provider, slug);
  }

  return {
    imageUrl,
    promptUsed: optimizedPrompt,
    visualConcept
  };
}

// AI Agent Reviewer - analyzes content for quality improvements
async function runAIReview(content: {
  title: string;
  metaDescription: string;
  article: string;
  imageDescription: string;
  faqs: any[];
  keywords: string[];
}): Promise<{
  overallScore: number;
  copyScore: number;
  seoScore: number;
  imageScore: number;
  suggestions: {
    category: string;
    priority: "high" | "medium" | "low";
    issue: string;
    suggestion: string;
  }[];
  improvedTitle?: string;
  improvedMetaDescription?: string;
  improvedImagePrompt?: string;
}> {
  const reviewPrompt = `You are an expert content reviewer specializing in SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization). 

Analyze this blog post and provide detailed feedback:

TITLE: ${content.title}
META DESCRIPTION: ${content.metaDescription}
KEYWORDS: ${content.keywords.join(", ")}
IMAGE DESCRIPTION: ${content.imageDescription}

ARTICLE CONTENT:
${content.article.slice(0, 4000)}...

FAQs:
${content.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

Evaluate and score (0-100) these areas:
1. COPY QUALITY: Hook strength, readability, persuasiveness, call-to-action effectiveness, voice consistency
2. SEO PERFORMANCE: Title tag optimization, meta description, keyword density, header structure, internal linking opportunities
3. AEO/GEO OPTIMIZATION: FAQ quality for featured snippets, structured data readiness, conversational query targeting
4. IMAGE RELEVANCE: How well the image description matches the content and will attract clicks

Provide your response as JSON:
{
  "overallScore": number,
  "copyScore": number,
  "seoScore": number,
  "imageScore": number,
  "suggestions": [
    {
      "category": "copy" | "seo" | "aeo" | "image",
      "priority": "high" | "medium" | "low",
      "issue": "specific problem identified",
      "suggestion": "actionable improvement"
    }
  ],
  "improvedTitle": "optional better title if score < 80",
  "improvedMetaDescription": "optional better meta if score < 80",
  "improvedImagePrompt": "optional better image prompt if score < 80"
}`;

  const reviewResponse = await chatCompletion({
    model: "gpt-4o",
    messages: [{ role: "user", content: reviewPrompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(reviewResponse.content || "{}");
}

import { 
  requireAuth, 
  createSessionToken, 
  validateSseToken, 
  deleteSessionToken 
} from "./auth-utils";

router.post("/session-token", requireAuth, async (req: any, res) => {
  try {
    const token = await createSessionToken(req.authenticatedKey);
    res.json({ token });
  } catch (error) {
    logger.error("Error creating session token", { endpoint: "/api/content-studio/session-token" }, error as Error);
    res.status(500).json({ error: "Failed to create session token" });
  }
});

// ============================================
// YOUTUBE CHANNELS
// ============================================

router.get("/channels", requireAuth, async (req, res) => {
  try {
    const channels = await db.select().from(youtubeChannels).orderBy(youtubeChannels.channelName);
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

router.post("/channels/seed", requireAuth, async (req, res) => {
  const channelList = [
    { channelId: "jonathanmast_withai", channelName: "Jonathan Mast - With AI", channelUrl: "https://www.youtube.com/@jonathanmast_withai", category: "AI" },
    { channelId: "VALUETAINMENT", channelName: "Valuetainment", channelUrl: "https://www.youtube.com/@VALUETAINMENT", category: "Business" },
    { channelId: "91DayAITransformationPodcast", channelName: "91 Day AI Transformation", channelUrl: "https://www.youtube.com/@91DayAITransformationPodcast", category: "AI" },
    { channelId: "JeremyMiner", channelName: "Jeremy Miner", channelUrl: "https://www.youtube.com/@JeremyMiner", category: "Sales" },
    { channelId: "crewAIInc", channelName: "CrewAI", channelUrl: "https://www.youtube.com/@crewAIInc", category: "AI" },
    { channelId: "highlevelfreaks", channelName: "HighLevel Freaks", channelUrl: "https://www.youtube.com/@highlevelfreaks", category: "GoHighLevel" },
    { channelId: "ghlking", channelName: "GHL King", channelUrl: "https://www.youtube.com/@ghlking", category: "GoHighLevel" },
    { channelId: "jonocatliff", channelName: "Jono Catliff", channelUrl: "https://www.youtube.com/@jonocatliff", category: "GoHighLevel" },
    { channelId: "PickaxeAI", channelName: "Pickaxe AI", channelUrl: "https://www.youtube.com/@PickaxeAI", category: "AI" },
    { channelId: "gohighlevel", channelName: "GoHighLevel", channelUrl: "https://www.youtube.com/@gohighlevel", category: "GoHighLevel" },
    { channelId: "aiwithbrandon", channelName: "AI with Brandon", channelUrl: "https://www.youtube.com/@aiwithbrandon", category: "AI" },
    { channelId: "TylerReedAI", channelName: "Tyler Reed AI", channelUrl: "https://www.youtube.com/@TylerReedAI", category: "AI" },
    { channelId: "hlprotools", channelName: "HL Pro Tools", channelUrl: "https://www.youtube.com/@hlprotools", category: "GoHighLevel" },
    { channelId: "TypingMind", channelName: "TypingMind", channelUrl: "https://www.youtube.com/@TypingMind", category: "AI" },
    { channelId: "ItsKeaton", channelName: "Its Keaton", channelUrl: "https://www.youtube.com/@ItsKeaton", category: "AI" },
    { channelId: "LiamOttley", channelName: "Liam Ottley", channelUrl: "https://www.youtube.com/@LiamOttley", category: "AI" },
    { channelId: "MastersAIAutomation", channelName: "Masters AI Automation", channelUrl: "https://www.youtube.com/@MastersAIAutomation", category: "AI" },
    { channelId: "neilpatel", channelName: "Neil Patel", channelUrl: "https://www.youtube.com/@neilpatel", category: "Marketing" },
    { channelId: "garyvee", channelName: "GaryVee", channelUrl: "https://www.youtube.com/@garyvee", category: "Business" },
    { channelId: "JuliaMcCoy", channelName: "Julia McCoy", channelUrl: "https://www.youtube.com/@JuliaMcCoy", category: "Content" },
    { channelId: "AlexHormozi", channelName: "Alex Hormozi", channelUrl: "https://www.youtube.com/@AlexHormozi", category: "Business" },
    { channelId: "MeetKevin", channelName: "Meet Kevin", channelUrl: "https://www.youtube.com/@MeetKevin", category: "Business" },
    { channelId: "BrandonMulrenin", channelName: "Brandon Mulrenin", channelUrl: "https://www.youtube.com/@BrandonMulrenin", category: "Sales" },
    { channelId: "ThinkMediaTV", channelName: "Think Media", channelUrl: "https://www.youtube.com/@ThinkMediaTV", category: "Content" },
    { channelId: "AnikSingal", channelName: "Anik Singal", channelUrl: "https://www.youtube.com/@AnikSingal", category: "Business" },
  ];

  try {
    for (const channel of channelList) {
      await db.insert(youtubeChannels)
        .values(channel)
        .onConflictDoNothing();
    }
    res.json({ success: true, count: channelList.length });
  } catch (error) {
    logger.error("Error seeding channels", { endpoint: "/api/content-studio/channels/seed" }, error as Error);
    res.status(500).json({ error: "Failed to seed channels" });
  }
});

// ============================================
// CONTENT TOPICS
// ============================================

router.get("/topics", requireAuth, async (req, res) => {
  try {
    const topics = await db.select().from(contentTopics).orderBy(desc(contentTopics.priority));
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

router.post("/topics/seed", requireAuth, async (req, res) => {
  const topicList = [
    { name: "AI Automation for Business", slug: "ai-automation-business", category: "AI", priority: 10, keywords: ["AI", "automation", "business efficiency", "AI agents", "workflow automation"] },
    { name: "GoHighLevel Tips & Tricks", slug: "gohighlevel-tips", category: "GoHighLevel", priority: 9, keywords: ["GoHighLevel", "GHL", "CRM", "marketing automation", "lead management"] },
    { name: "Business Coaching Strategies", slug: "business-coaching-strategies", category: "Coaching", priority: 8, keywords: ["business coaching", "mentorship", "leadership", "scaling business"] },
    { name: "Sales & Closing Techniques", slug: "sales-closing-techniques", category: "Sales", priority: 8, keywords: ["sales", "closing", "NEPQ", "objection handling", "consultative selling"] },
    { name: "Insurance Agency Growth", slug: "insurance-agency-growth", category: "Insurance", priority: 7, keywords: ["insurance agency", "agency growth", "insurance marketing", "client retention"] },
    { name: "Content Marketing & SEO", slug: "content-marketing-seo", category: "Marketing", priority: 7, keywords: ["SEO", "content marketing", "blogging", "organic traffic", "AEO"] },
    { name: "Entrepreneurship Mindset", slug: "entrepreneurship-mindset", category: "Mindset", priority: 6, keywords: ["entrepreneur", "mindset", "productivity", "time management", "work-life balance"] },
    { name: "Digital Marketing Trends", slug: "digital-marketing-trends", category: "Marketing", priority: 6, keywords: ["digital marketing", "social media", "paid ads", "funnel building"] },
    { name: "AI Tools & Software Reviews", slug: "ai-tools-reviews", category: "AI", priority: 5, keywords: ["AI tools", "software review", "productivity tools", "ChatGPT", "Claude"] },
    { name: "Building Systems That Scale", slug: "systems-that-scale", category: "Operations", priority: 9, keywords: ["systems", "SOPs", "delegation", "scaling", "operations"] },
  ];

  try {
    for (const topic of topicList) {
      await db.insert(contentTopics)
        .values(topic)
        .onConflictDoNothing();
    }
    res.json({ success: true, count: topicList.length });
  } catch (error) {
    logger.error("Error seeding topics", { endpoint: "/api/content-studio/topics/seed" }, error as Error);
    res.status(500).json({ error: "Failed to seed topics" });
  }
});

// ============================================
// BLOG POSTS
// ============================================

router.get("/blog-posts", requireAuth, async (req, res) => {
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

router.get("/blog-posts/:id", requireAuth, async (req, res) => {
  try {
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, parseInt(req.params.id)));
    if (post.length === 0) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

router.post("/blog-posts", requireAuth, async (req, res) => {
  try {
    const [post] = await db.insert(blogPosts).values({
      slug: req.body.slug || `draft-${Date.now()}`,
      title: req.body.title || "Untitled Draft",
      status: "draft",
    }).returning();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

router.patch("/blog-posts/:id", requireAuth, async (req, res) => {
  try {
    const [post] = await db.update(blogPosts)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(blogPosts.id, parseInt(req.params.id)))
      .returning();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

router.put("/blog-posts/:id", requireAuth, async (req, res) => {
  try {
    const updateData: any = { updatedAt: new Date() };
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.content && req.body.content.trim()) {
      updateData.content = req.body.content;
      updateData.htmlContent = req.body.content;
      const words = req.body.content.trim().split(/\s+/).filter((w: string) => w.length > 0);
      updateData.wordCount = words.length;
    }
    if (req.body.metaDescription !== undefined) updateData.metaDescription = req.body.metaDescription;
    
    const [post] = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, parseInt(req.params.id)))
      .returning();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

router.post("/blog-posts/:id/publish", requireAuth, async (req, res) => {
  try {
    const [post] = await db.update(blogPosts)
      .set({ 
        status: "published", 
        publishedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(blogPosts.id, parseInt(req.params.id)))
      .returning();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to publish blog post" });
  }
});

// ============================================
// REMIX (Regenerate) CONTENT OR IMAGE
// ============================================

// SSE endpoints need special auth handling since EventSource can't send headers
router.get("/blog-posts/:id/remix", async (req, res) => {
  // Validate session token (short-lived, not the admin key)
  const sessionToken = req.query.token as string;
  const isValidToken = await validateSseToken(sessionToken);
  if (!isValidToken) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  
  const postId = parseInt(req.params.id);
  const remixType = req.query.type as "content" | "image";
  const imageProvider = (req.query.imageProvider as ImageProvider) || "gemini";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Get existing post
    const [existingPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
    if (!existingPost) {
      sendEvent("error", { message: "Post not found" });
      return res.end();
    }

    if (remixType === "image") {
      sendEvent("progress", { stage: "image", message: `Regenerating image with ${imageProvider}...` });
      
      const slug = existingPost.slug || `remix-${Date.now()}`;
      const canonicalPrompt = selectImagePrompt(existingPost.title || "", (existingPost.tags as string[]) || []);
      
      const imagePrompt = `${canonicalPrompt.prompt}

Additional context:
Topic: "${existingPost.title}"
Scene suggestion: ${existingPost.featuredImageAlt || "A quiet moment of business reflection"}

Style requirements:
- Cinematic documentary photography style
- Real spaces, real tension, quiet moments
- Muted earth tones with deep navy (#0f172a) and subtle warm accents
- Natural lighting, slight film grain
- NO stock photo aesthetic, NO people pointing at screens
- NO text in the image

${IMAGE_STYLE_CONFIG.negativePrompt ? `Avoid: ${IMAGE_STYLE_CONFIG.negativePrompt}` : ""}`;

      try {
        const newImageUrl = await generateImageWithProvider(imagePrompt, imageProvider, slug);
        
        const [updatedPost] = await db.update(blogPosts)
          .set({ 
            featuredImage: newImageUrl,
            imageProvider: imageProvider,
            updatedAt: new Date() 
          })
          .where(eq(blogPosts.id, postId))
          .returning();
        
        sendEvent("progress", { stage: "complete", message: "Image regenerated successfully!" });
        sendEvent("complete", { post: updatedPost });
      } catch (imgError) {
        logger.error("Image remix error", { endpoint: "/api/content-studio/blog-posts/:id/remix" }, imgError as Error);
        sendEvent("error", { message: "Failed to regenerate image" });
      }
      
    } else if (remixType === "content") {
      sendEvent("progress", { stage: "writing", message: "Remixing article content..." });
      
      // Get topic if linked
      let topic = null;
      if (existingPost.topicId) {
        const [t] = await db.select().from(contentTopics).where(eq(contentTopics.id, existingPost.topicId));
        topic = t;
      }
      
      const topicName = topic?.name || existingPost.title || "Business Systems";
      const niche = topic?.category || "general";
      const systemPrompt = generateBlogSystemPrompt(topicName, niche);
      const articlePrompt = `${systemPrompt}

You are rewriting this blog post with fresh perspective while maintaining the same topic.

EXISTING TOPIC: "${existingPost.title}"
${topic ? `CATEGORY: ${topic.category}\nKEYWORDS: ${(topic.keywords as string[])?.join(", ")}` : ""}

EXISTING STRUCTURE (use as guide, but vary the examples and angle):
${existingPost.content?.slice(0, 500)}...

REQUIREMENTS:
- Target: 1,200-1,600 words (1,800 max hard stop)
- Fresh opening hook (different scenario or moment)
- Same core teaching, different examples
- Maintain Jeremy's voice: calm, grounded, rhythmic
- End with soft contextual CTA

Write the complete article in markdown format with ## for headers:`;

      try {
        const articleResponse = await chatCompletion({
          model: "gpt-4o",
          messages: [{ role: "user", content: articlePrompt }],
        });

        const newContent = articleResponse.content || "";
        const wordCount = newContent.split(/\s+/).length;

        const [updatedPost] = await db.update(blogPosts)
          .set({ 
            content: newContent,
            htmlContent: newContent,
            wordCount,
            updatedAt: new Date() 
          })
          .where(eq(blogPosts.id, postId))
          .returning();

        sendEvent("progress", { stage: "complete", message: "Content remixed successfully!" });
        sendEvent("complete", { post: updatedPost });
      } catch (contentError) {
        logger.error("Content remix error", { endpoint: "/api/content-studio/blog-posts/:id/remix" }, contentError as Error);
        sendEvent("error", { message: "Failed to remix content" });
      }
    } else {
      sendEvent("error", { message: "Invalid remix type. Use 'content' or 'image'." });
    }
    
    res.end();
  } catch (error) {
    logger.error("Remix error", { endpoint: "/api/content-studio/blog-posts/:id/remix" }, error as Error);
    sendEvent("error", { message: "Remix failed" });
    res.end();
  }
});

// ============================================
// AI BLOG GENERATION
// ============================================

// Configuration types for blog generation
type PostLength = "short" | "medium" | "long";
type PostStyle = "educational" | "story" | "tactical";
type PostAuthor = "jeremy" | "michelle" | "marcus" | "sarah";
type PostPillar = "pain" | "hope" | "philosophy" | "proof" | "vision";

const AUTHOR_PROFILES: Record<PostAuthor, { name: string; title: string; image: string; bio: string }> = {
  jeremy: {
    name: "Jeremy Kean",
    title: "Business Coach & Automation Strategist",
    image: "/jeremy-about-photo.jpg",
    bio: "35 years of business experience across insurance, technology, and coaching. Creator of the Manumation Method."
  },
  michelle: {
    name: "Michelle Davis",
    title: "Team Performance Coach",
    image: "/avatars/michelle-davis.png",
    bio: "Former HR director who now helps small business owners build teams that don't depend on heroes. Believes great companies create great systems, not just great hires."
  },
  marcus: {
    name: "Marcus Rivera",
    title: "Operations & Productivity Coach",
    image: "/avatars/marcus-rivera.png",
    bio: "Former operations director who now helps small business owners reclaim their time through smarter systems. Believes in simple math over complex strategies."
  },
  sarah: {
    name: "Sarah Chen",
    title: "AI Tools & Automation Specialist",
    image: "/avatars/sarah-chen.png",
    bio: "Former software engineer who now helps small businesses implement AI without the overwhelm. Believes automation should feel like magic, not homework."
  }
};

const LENGTH_WORD_TARGETS: Record<PostLength, { min: number; max: number; description: string }> = {
  short: { min: 600, max: 900, description: "a focused, quick-read blog post" },
  medium: { min: 1000, max: 1400, description: "a standard blog post with moderate depth" },
  long: { min: 1800, max: 2200, description: "an in-depth, comprehensive guide" }
};

const STYLE_PROMPTS: Record<PostStyle, string> = {
  educational: "Focus on teaching a concept clearly. Use examples, break down complex ideas, and ensure the reader learns something actionable.",
  story: "Lead with a narrative or anecdote. Use a story arc to illustrate the main point. Make it personal and relatable before pivoting to the lesson.",
  tactical: "Provide step-by-step, actionable guidance. Use numbered steps, checklists, or clear instructions. Minimize theory, maximize practical application."
};

router.get("/blog-posts/:id/generate", async (req: any, res) => {
  // Validate session token (short-lived, not the admin key)
  const sessionToken = req.query.token as string;
  const isValidToken = await validateSseToken(sessionToken);
  if (!isValidToken) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  
  const postId = parseInt(req.params.id);
  const topicId = req.query.topicId ? parseInt(req.query.topicId as string) : null;
  const imageProvider = (req.query.imageProvider as ImageProvider) || "gemini";
  const targetIndustry = (req.query.targetIndustry as string) || "";
  
  // New configuration parameters
  const authorKey = (req.query.author as PostAuthor) || "jeremy";
  const lengthKey = (req.query.length as PostLength) || "medium";
  const styleKey = (req.query.style as PostStyle) || "educational";
  const pillarKey = (req.query.pillar as PostPillar) || "pain";
  
  const authorProfile = AUTHOR_PROFILES[authorKey] || AUTHOR_PROFILES.jeremy;
  const lengthConfig = LENGTH_WORD_TARGETS[lengthKey] || LENGTH_WORD_TARGETS.medium;
  const stylePrompt = STYLE_PROMPTS[styleKey] || STYLE_PROMPTS.educational;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const rateLimitKey = `content-studio:${sessionToken}`;
  const rateCheck = aiGenerationLimiter(rateLimitKey);
  if (!rateCheck.allowed) {
    sendEvent("error", { message: rateCheck.reason || "Rate limit exceeded" });
    res.end();
    return;
  }

  trackConcurrentRequest(rateLimitKey);
  
  // Clean up session token when connection closes
  req.on("close", async () => {
    await deleteSessionToken(sessionToken);
    releaseConcurrentRequest(rateLimitKey);
  });

  try {
    sendEvent("progress", { stage: "starting", message: `Generating: ${authorProfile.name} | ${lengthKey} | ${styleKey} | ${pillarKey}` });

    // Get topic if provided
    let topic = null;
    if (topicId) {
      const [t] = await db.select().from(contentTopics).where(eq(contentTopics.id, topicId));
      topic = t;
    }

    // Fetch existing posts in the same pillar for internal linking and content gap awareness
    const existingPillarPosts = await db.select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      pillar: blogPosts.pillar,
    }).from(blogPosts).where(
      and(
        eq(blogPosts.pillar, pillarKey),
        eq(blogPosts.status, "published")
      )
    );

    // Fetch cross-pillar posts for broader internal linking
    const crossPillarPosts = await db.select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      pillar: blogPosts.pillar,
    }).from(blogPosts).where(
      eq(blogPosts.status, "published")
    );
    const crossPillarList = crossPillarPosts
      .filter(p => p.pillar !== pillarKey)
      .slice(0, 15)
      .map(p => `- "${p.title}" → /blog/${p.slug} (${p.pillar})`)
      .join("\n");

    const pillarPostsList = existingPillarPosts.map(p => `- "${p.title}" → /blog/${p.slug}`).join("\n");
    const pillarPostCount = existingPillarPosts.length;

    // Fetch relevant pain points from the database
    let painPointsContext = "";
    try {
      const pillarToIndustryMap: Record<string, string[]> = {
        "pain": ["small-business-owners", "insurance-agencies", "business-coaches-consultants"],
        "hope": ["small-business-owners", "insurance-agencies", "marketing-agencies", "home-service-companies"],
        "philosophy": ["business-coaches-consultants", "small-business-owners"],
        "proof": ["small-business-owners", "insurance-agencies", "title-companies"],
        "vision": ["business-coaches-consultants", "small-business-owners", "real-estate-agents"],
      };

      let relevantIndustryIds: number[] = [];

      if (targetIndustry) {
        const [industry] = await db
          .select()
          .from(industryProfiles)
          .where(eq(industryProfiles.slug, targetIndustry));
        if (industry) relevantIndustryIds = [industry.id];
      }

      if (relevantIndustryIds.length === 0) {
        const relevantSlugs = pillarToIndustryMap[pillarKey] || [];
        if (relevantSlugs.length > 0) {
          const industries = await db
            .select()
            .from(industryProfiles)
            .where(sql`${industryProfiles.slug} IN (${sql.join(relevantSlugs.map(s => sql`${s}`), sql`, `)})`);
          relevantIndustryIds = industries.map(i => i.id);
        }
      }

      let relevantPainPoints;
      if (relevantIndustryIds.length > 0) {
        relevantPainPoints = await db
          .select()
          .from(painPoints)
          .where(sql`${painPoints.industryId} IN (${sql.join(relevantIndustryIds.map(id => sql`${id}`), sql`, `)})`)
          .orderBy(desc(painPoints.severity))
          .limit(5);
      } else {
        relevantPainPoints = await db
          .select()
          .from(painPoints)
          .orderBy(desc(painPoints.severity))
          .limit(5);
      }

      if (relevantPainPoints.length > 0) {
        painPointsContext = `\nREAL-WORLD INDUSTRY PAIN POINTS (use these as foundation for the article):
${relevantPainPoints.map((pp, i) => `${i + 1}. "${pp.title}" (Severity: ${pp.severity}/10)
   - ${pp.description}
   - Manumation angle: ${pp.manumationAngle || "N/A"}
   - Keywords: ${Array.isArray(pp.keywords) ? pp.keywords.join(", ") : "N/A"}`).join("\n")}

IMPORTANT: Ground your content in these REAL pain points that actual business owners face. Reference specific problems, not generic insights. Make the content feel targeted and relevant to practitioners in this space.`;
        sendEvent("progress", { stage: "pain_points", message: `Found ${relevantPainPoints.length} relevant industry pain points` });
      }
    } catch (painPointError) {
      logger.error("Failed to fetch pain points for content generation", {}, painPointError as Error);
    }

    // Step 1: Research trending content
    sendEvent("progress", { stage: "research", message: `Researching topics (${pillarPostCount} existing posts in ${pillarKey})...` });
    
    // Determine niche weight for prioritization - use pillar if no topic
    const nicheCategory = topic?.category || pillarKey;
    
    const researchPrompt = `You are researching content for "Kean on Biz" - The Manumation Method.

BRAND CONTEXT:
- Jeremy helps service-based business owners escape being "The Glue" (the bottleneck holding everything together)
- Core philosophy: "The founder is the system. Pressure comes from missing structure, not lack of effort."
- Primary audiences: Financial Services (Insurance, Mortgage, Wealth), Real Estate Agents, Coaches/Consultants
- Key concepts: Manumation (Manual + Automation), Zenoflo (CRM platform), Donna (AI routing assistant)

${topic ? `FOCUS AREA: ${topic.name}\nKEYWORDS: ${(topic.keywords as string[])?.join(", ")}\nCATEGORY: ${topic.category}` : `CONTENT PILLAR: ${pillarKey}\nGenerate content about ${pillarKey.replace(/-/g, " ")} for service-based business owners.`}

AUTHOR: ${authorProfile.name} (${authorProfile.title})
WRITING STYLE: ${styleKey.toUpperCase()} - ${stylePrompt}
TARGET LENGTH: ${lengthConfig.description} (${lengthConfig.min}-${lengthConfig.max} words)

TOPIC CLUSTER CONTEXT:
This post belongs to the "${pillarKey.replace(/-/g, " ")}" pillar hub at /blog/topic/${pillarKey}
${pillarPostCount > 0 ? `There are ${pillarPostCount} existing posts in this pillar:\n${pillarPostsList}\n\nIMPORTANT: Choose a topic angle that DOES NOT duplicate these existing posts. Fill content gaps in this pillar.` : `This pillar has no published posts yet. Choose a foundational topic that anchors this content cluster.`}
${painPointsContext}

Research and provide:
1. A compelling, direct blog post title (60 chars max) - NO corporate buzzwords like "unlock", "elevate", "transform"
2. A meta description (155 chars max) that sounds human, not marketing copy
3. 5-6 sections following this structure:
   - Hook/Opening (lived moment, specific scenario)
   - Problem Reframed (the real issue beneath the symptom)
   - Why Effort Failed (working harder didn't work)
   - Missing Structure (where the architecture broke)
   - The Architectural Fix (one clear system solution)
   - Soft Exit (earned takeaway)
4. 3 FAQs that real business owners would actually ask
5. 5 SEO keywords (include variations, not just exact matches)
6. Image scene description for cinematic/documentary style (real spaces, quiet moments, no stock photo vibes)
7. 3-5 KEY STATISTICS with sources that support the article's claims (include specific numbers, percentages, or data points from reputable sources like industry reports, studies, or surveys)
8. VISUAL ELEMENTS PLAN - describe 1-2 infographic or chart concepts that would explain key concepts visually (e.g., "flowchart showing automation ROI", "comparison table before/after automation")

Format your response as JSON:
{
  "title": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "sections": ["...", "..."],
  "faqs": [{"question": "...", "answer": "..."}],
  "keywords": ["...", "..."],
  "imageDescription": "...",
  "targetNiche": "financial_services|real_estate|coaches|general",
  "statistics": [
    {"stat": "70% of small businesses...", "source": "Source Name, Year", "context": "Use in section X"}
  ],
  "visualElements": [
    {"type": "infographic|chart|comparison|flowchart", "description": "...", "data_points": ["point1", "point2"]}
  ],
  "citations": [
    {"title": "Report/Study Name", "publisher": "Organization", "year": "2024", "url_hint": "searchable terms"}
  ]
}`;

    const researchResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: researchPrompt }],
      response_format: { type: "json_object" },
    });

    const research = JSON.parse(researchResponse.content || "{}");
    sendEvent("progress", { stage: "research_complete", message: `Topic: ${research.title}`, data: research });

    // Step 2: Generate the full article
    sendEvent("progress", { stage: "writing", message: "Writing the full article with SEO optimization..." });

    // Generate the full Jeremy voice system prompt
    const jeremyVoicePrompt = generateBlogSystemPrompt(research.title, nicheCategory);
    
    // Defensive parsing of research data - ensure arrays exist
    const safeStatistics = Array.isArray(research.statistics) ? research.statistics : [];
    const safeVisualElements = Array.isArray(research.visualElements) ? research.visualElements : [];
    const safeCitations = Array.isArray(research.citations) ? research.citations : [];
    const safeKeywords = Array.isArray(research.keywords) ? research.keywords : [];
    
    // Format statistics for the article prompt
    const statsSection = safeStatistics.length > 0 
      ? `\nKEY STATISTICS TO INCORPORATE (cite sources inline):
${safeStatistics.map((s: any, i: number) => `${i+1}. "${s.stat || ''}" — ${s.source || 'Industry research'}${s.context ? ` (${s.context})` : ""}`).join("\n")}`
      : "";
    
    // Format visual element suggestions
    const visualSection = safeVisualElements.length > 0
      ? `\nVISUAL ELEMENT PLACEHOLDERS - Add markdown placeholders for these:
${safeVisualElements.map((v: any, i: number) => `${i+1}. [${v.type?.toUpperCase() || "INFOGRAPHIC"}]: ${v.description || 'Visual aid'}`).join("\n")}
Format as: <!-- VISUAL: [type] - [description] -->`
      : "";

    // Format citations for reference
    const citationsSection = safeCitations.length > 0
      ? `\nCITATIONS TO REFERENCE:
${safeCitations.map((c: any) => `- ${c.title || 'Source'} (${c.publisher || 'N/A'}, ${c.year || '2024'})`).join("\n")}`
      : "";

    const articlePrompt = `${jeremyVoicePrompt}

---

NOW WRITE THIS ARTICLE:

Title: ${research.title}
Author: ${authorProfile.name}
Sections: ${research.sections?.join(", ")}
Target Keywords: ${research.keywords?.join(", ")}
Target Niche: ${research.targetNiche || nicheCategory}
Content Pillar: ${pillarKey}
${statsSection}
${visualSection}
${citationsSection}

WRITING STYLE: ${styleKey.toUpperCase()}
${stylePrompt}

TARGET LENGTH: ${lengthConfig.min}-${lengthConfig.max} words
Write ${lengthConfig.description}. Adjust section depth and examples accordingly.

INTERNAL LINKING (CRITICAL FOR SEO - MUST INCLUDE 3-5 INTERNAL LINKS):
- This post belongs to the "${pillarKey.replace(/-/g, " ")}" topic cluster
- Link to the pillar hub page: [${pillarKey.replace(/-/g, " ")}](/blog/topic/${pillarKey})
${pillarPostCount > 0 ? `- MUST link to 2-3 of these same-pillar posts where relevant:\n${pillarPostsList}` : `- Since this is the first post in this pillar, link back to the pillar hub page at least once`}
${crossPillarList ? `- ALSO link to 1-2 cross-pillar posts where relevant:\n${crossPillarList}` : ""}
- Use descriptive anchor text, NOT "click here" or "read more"
- SITE PAGES to link where contextually natural:
  * /assessment — "Take the free Bottleneck Audit" or "See where your systems are leaking"
  * /founders-filter — "Try The Founder's Filter" or "Identify tasks to delegate"
  * /book — "The Manumation Method book" or "Read the book"
  * /jeremys-calendar — "Book a strategy call" (ONLY as soft CTA at end)
  * /blog — "Browse more articles" or link to full blog index

ADDITIONAL CONTEXT:
- Primary keyword should appear in: first 100 words, one H2 header, 1-2 natural mentions
- Use synonyms and variations rather than exact keyword repetition
- INTEGRATE STATISTICS naturally into the narrative (don't just list them)
- Include inline citations when referencing data (e.g., "According to [Source], X% of businesses...")
- Add visual element placeholders where infographics/charts would enhance understanding
- Sign off at the end with "— ${authorProfile.name.split(" ")[0]}" (first name only)
- Reference The Manumation Method, Zenoflo, or Donna only where natural
- If relevant, use one of these war stories briefly:
  * The Crockpot/Lemonade Pitcher story (grinding manually to save a business)
  * The DTG Printer disaster (going wide instead of deep)
  * The Georgia Business story (dysfunction feeling normal)

END WITH:
A soft, earned CTA. Examples:
- "If this sounds familiar, take the free Bottleneck Audit to see where your systems are leaking."
- "The Manumation Method was built for exactly this. When you're ready to stop being the glue, the door is open."

DO NOT use: "Book a call now", "Schedule today", or any hard-sell language.

Write the complete article in markdown format with ## for headers:`;

    const articleResponse = await chatCompletion({
      model: "gpt-4o",
      messages: [{ role: "user", content: articlePrompt }],
    });

    const articleContent = articleResponse.content || "";
    sendEvent("progress", { stage: "writing_complete", message: "Article written with statistics and citations" });

    // Generate slug early for use in image naming
    const slug = research.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);

    // Step 3: Generate featured image using enhanced two-step pipeline
    const providerNames: Record<ImageProvider, string> = {
      gemini: "Gemini Imagen (2-step)",
      leonardo: "Leonardo Kino XL",
      replicate: "Replicate Flux LORA"
    };
    sendEvent("progress", { stage: "image", message: `Generating featured image with ${providerNames[imageProvider]}...` });
    
    let featuredImageUrl = "";
    let imagePromptUsed = "";
    let visualConcept = "";
    try {
      // Use enhanced two-step image generation pipeline
      const imageResult = await generateEnhancedImage(
        research.title || "Business Automation Insights",
        articleContent,
        safeKeywords,
        nicheCategory,
        imageProvider,
        slug,
        sendEvent
      );
      
      featuredImageUrl = imageResult.imageUrl;
      imagePromptUsed = imageResult.promptUsed;
      visualConcept = imageResult.visualConcept;
      
      sendEvent("progress", { 
        stage: "image_complete", 
        message: `Featured image generated with ${providerNames[imageProvider]}`,
        data: { visualConcept, promptLength: imagePromptUsed.length }
      });
    } catch (imageError) {
      logger.error("Image generation error", { endpoint: "/api/content-studio/blog-posts/:id/generate" }, imageError as Error);
      sendEvent("progress", { stage: "image_skipped", message: "Image generation skipped (will use placeholder)" });
    }

    // Step 4: Search for relevant YouTube videos from followed channels
    sendEvent("progress", { stage: "youtube", message: "Finding relevant YouTube videos..." });
    
    let relevantVideos: string[] = [];
    try {
      const channelList = await db.select().from(youtubeChannels).where(eq(youtubeChannels.isActive, true));
      
      const videoSearchPrompt = `Given these YouTube channels and their categories:
${channelList.map(c => `- ${c.channelName} (${c.category})`).join("\n")}

And this blog post topic: "${research.title}"
Keywords: ${research.keywords?.join(", ")}

Suggest 2-3 YouTube video search queries that would find relevant videos from these types of channels. Keep queries short and specific.

Format as JSON array: ["query1", "query2", "query3"]`;

      const videoSearchResponse = await chatCompletion({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: videoSearchPrompt }],
        response_format: { type: "json_object" },
      });

      const searchQueries = JSON.parse(videoSearchResponse.content || "[]");
      sendEvent("progress", { stage: "youtube_complete", message: `Video suggestions: ${Array.isArray(searchQueries) ? searchQueries.slice(0, 3).join(", ") : "Generated"}` });
    } catch (ytError) {
      logger.error("YouTube search error", { endpoint: "/api/content-studio/blog-posts/:id/generate" }, ytError as Error);
      sendEvent("progress", { stage: "youtube_skipped", message: "YouTube search skipped" });
    }

    // Step 5: Generate structured data
    sendEvent("progress", { stage: "seo", message: "Generating structured data and SEO elements..." });

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": research.title,
      "description": research.metaDescription,
      "author": {
        "@type": "Person",
        "name": "Jeremy Kean",
        "url": "https://keanonbiz.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "KeanOnBiz",
        "logo": {
          "@type": "ImageObject",
          "url": "https://keanonbiz.com/kean-on-biz-logo-blue.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": `https://keanonbiz.com/blog/${slug}`
    };

    // Step 6: Run AI Agent Review
    sendEvent("progress", { stage: "review", message: "AI Agent reviewing content for SEO/AEO/GEO optimization..." });
    
    let aiReview = null;
    try {
      aiReview = await runAIReview({
        title: research.title,
        metaDescription: research.metaDescription,
        article: articleContent,
        imageDescription: research.imageDescription || "",
        faqs: research.faqs || [],
        keywords: research.keywords || []
      });
      sendEvent("progress", { 
        stage: "review_complete", 
        message: `AI Review Score: ${aiReview.overallScore}/100 (Copy: ${aiReview.copyScore}, SEO: ${aiReview.seoScore}, Image: ${aiReview.imageScore})`,
        data: aiReview
      });
    } catch (reviewError) {
      logger.error("AI Review error", { endpoint: "/api/content-studio/blog-posts/:id/generate" }, reviewError as Error);
      sendEvent("progress", { stage: "review_skipped", message: "AI Review skipped" });
    }

    // Step 7: Save the blog post
    sendEvent("progress", { stage: "saving", message: "Saving blog post..." });

    const wordCount = articleContent.split(/\s+/).length;

    // Calculate niche weight for tracking
    const nicheWeight = topic ? getTopicWeight(topic.category || "") : NICHE_PRIORITY.tier3.weight;
    
    const [updatedPost] = await db.update(blogPosts)
      .set({
        slug,
        title: research.title,
        headline: research.title,
        metaTitle: research.metaTitle || research.title,
        metaDescription: research.metaDescription,
        content: articleContent,
        htmlContent: articleContent,
        faqs: research.faqs,
        tags: research.keywords,
        structuredData,
        featuredImage: featuredImageUrl || null,
        featuredImageAlt: research.imageDescription,
        youtubeVideoIds: relevantVideos.length > 0 ? relevantVideos : null,
        topicId: topicId,
        wordCount,
        status: "draft",
        updatedAt: new Date(),
        aiReview: aiReview,
        imageProvider: imageProvider,
        authorName: authorProfile.name,
        authorTitle: authorProfile.title,
        authorImage: authorProfile.image,
        authorBio: authorProfile.bio,
        pillar: pillarKey,
        postLength: lengthKey,
        postStyle: styleKey,
      })
      .where(eq(blogPosts.id, postId))
      .returning();

    sendEvent("progress", { stage: "complete", message: "Blog post generated and reviewed successfully!" });
    sendEvent("complete", { post: updatedPost, review: aiReview });
    releaseConcurrentRequest(rateLimitKey);
    res.end();

  } catch (error) {
    logger.error("Blog generation error", { endpoint: "/api/content-studio/blog-posts/:id/generate" }, error as Error);
    sendEvent("error", { message: "Failed to generate blog post" });
    releaseConcurrentRequest(rateLimitKey);
    res.end();
  }
});

// ============================================
// CONTENT JOBS
// ============================================

router.get("/jobs", requireAuth, async (req, res) => {
  try {
    const jobs = await db.select().from(contentJobs).orderBy(desc(contentJobs.createdAt)).limit(50);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.post("/jobs", requireAuth, async (req, res) => {
  try {
    const [job] = await db.insert(contentJobs).values({
      type: req.body.type,
      status: "pending",
      targetDate: req.body.targetDate ? new Date(req.body.targetDate) : null,
      topicId: req.body.topicId,
      config: req.body.config,
    }).returning();
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job" });
  }
});

// ============================================
// BATCH BLOG GENERATION (for seeding content)
// ============================================

router.get("/batch-generate", async (req, res) => {
  // Validate session token (short-lived, not the admin key)
  const sessionToken = req.query.token as string;
  const isValidToken = await validateSseToken(sessionToken);
  if (!isValidToken) {
    return res.status(401).json({ error: "Invalid or expired session token" });
  }
  
  const count = parseInt(req.query.count as string) || 25;
  const months = parseInt(req.query.months as string) || 3;
  const imageProvider = (req.query.imageProvider as ImageProvider) || "gemini";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  
  // Clean up session token when connection closes
  req.on("close", async () => {
    await deleteSessionToken(sessionToken);
  });

  try {
    sendEvent("progress", { stage: "starting", message: `Starting batch generation of ${count} posts over ${months} months...` });

    // Get all topics for variety
    const topics = await db.select().from(contentTopics);
    if (topics.length === 0) {
      sendEvent("error", { message: "No content topics found. Please seed topics first." });
      res.end();
      return;
    }

    // Generate random dates spread over the past X months
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - months);
    
    const generateRandomDate = () => {
      const start = startDate.getTime();
      const end = now.getTime();
      return new Date(start + Math.random() * (end - start));
    };

    const generatedPosts: any[] = [];

    for (let i = 0; i < count; i++) {
      const postNum = i + 1;
      const backdatedDate = generateRandomDate();
      const topic = topics[i % topics.length]; // Cycle through topics
      
      sendEvent("progress", { 
        stage: "batch_item", 
        current: postNum, 
        total: count, 
        message: `Generating post ${postNum}/${count}: ${topic.name}...` 
      });

      try {
        // Create placeholder post
        const [newPost] = await db.insert(blogPosts).values({
          slug: `post-${Date.now()}-${i}`,
          title: "Generating...",
          status: "draft",
          createdAt: backdatedDate,
          updatedAt: backdatedDate,
        }).returning();

        // Step 1: Research
        sendEvent("progress", { stage: "research", current: postNum, message: `[${postNum}/${count}] Researching content for: ${topic.name}` });
        
        const nicheCategory = topic.category || "general";
        
        const researchPrompt = `You are researching content for Jeremy Kean's "Kean on Biz" - The Manumation Method.

BRAND CONTEXT:
- Jeremy helps service-based business owners escape being "The Glue" (the bottleneck holding everything together)
- Core philosophy: "The founder is the system. Pressure comes from missing structure, not lack of effort."
- Primary audiences: Financial Services (Insurance, Mortgage, Wealth), Real Estate Agents, Coaches/Consultants
- Key concepts: Manumation (Manual + Automation), Zenoflo (CRM platform), Donna (AI routing assistant)

FOCUS AREA: ${topic.name}
KEYWORDS: ${(topic.keywords as string[])?.join(", ")}
CATEGORY: ${topic.category}

POST NUMBER: ${postNum} of ${count} - Make this unique from other posts on similar topics.

Research and provide:
1. A compelling, direct blog post title (60 chars max) - NO corporate buzzwords like "unlock", "elevate", "transform"
2. A meta description (155 chars max) that sounds human, not marketing copy
3. 5-6 sections following this structure:
   - Hook/Opening (lived moment, specific scenario)
   - Problem Reframed (the real issue beneath the symptom)
   - Why Effort Failed (working harder didn't work)
   - Missing Structure (where the architecture broke)
   - The Architectural Fix (one clear system solution)
   - Soft Exit (earned takeaway)
4. 3 FAQs that real business owners would actually ask
5. 5 SEO keywords (include variations, not just exact matches)
6. Image scene description for cinematic/documentary style (real spaces, quiet moments, no stock photo vibes)

Format your response as JSON:
{
  "title": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "sections": ["...", "..."],
  "faqs": [{"question": "...", "answer": "..."}],
  "keywords": ["...", "..."],
  "imageDescription": "...",
  "targetNiche": "financial_services|real_estate|coaches|general"
}`;

        const researchResponse = await chatCompletion({
          model: "gpt-4o",
          messages: [{ role: "user", content: researchPrompt }],
          response_format: { type: "json_object" },
        });

        const research = JSON.parse(researchResponse.content || "{}");
        
        // Step 2: Write article
        sendEvent("progress", { stage: "writing", current: postNum, message: `[${postNum}/${count}] Writing article: ${research.title}` });
        
        const jeremyVoicePrompt = generateBlogSystemPrompt(research.title, nicheCategory);
        
        const articlePrompt = `${jeremyVoicePrompt}

---

NOW WRITE THIS ARTICLE:

Title: ${research.title}
Sections: ${research.sections?.join(", ")}
Target Keywords: ${research.keywords?.join(", ")}
Target Niche: ${research.targetNiche || nicheCategory}

ADDITIONAL CONTEXT:
- Primary keyword should appear in: first 100 words, one H2 header, 1-2 natural mentions
- Use synonyms and variations rather than exact keyword repetition
- Reference The Manumation Method, Zenoflo, or Donna only where natural
- If relevant, use one of these war stories briefly:
  * The Crockpot/Lemonade Pitcher story (grinding manually to save a business)
  * The DTG Printer disaster (going wide instead of deep)
  * The Georgia Business story (dysfunction feeling normal)

END WITH:
A soft, earned CTA. Examples:
- "If this sounds familiar, take the free Bottleneck Audit to see where your systems are leaking."
- "The Manumation Method was built for exactly this. When you're ready to stop being the glue, the door is open."

DO NOT use: "Book a call now", "Schedule today", or any hard-sell language.

Write the complete article in markdown format with ## for headers:`;

        const articleResponse = await chatCompletion({
          model: "gpt-4o",
          messages: [{ role: "user", content: articlePrompt }],
        });

        const articleContent = articleResponse.content || "";
        
        const slug = research.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 60);

        // Step 3: Generate image
        sendEvent("progress", { stage: "image", current: postNum, message: `[${postNum}/${count}] Generating image...` });
        
        let featuredImageUrl = "";
        try {
          const canonicalPrompt = selectImagePrompt(research.title, research.keywords || []);
          
          const imagePrompt = `${canonicalPrompt.prompt}

Additional context for this specific article:
Topic: "${research.title}"
Scene suggestion: ${research.imageDescription || "A quiet moment of business reflection"}

Style requirements:
- Cinematic documentary photography style
- Real spaces, real tension, quiet moments
- Muted earth tones with deep navy (#0f172a) and subtle warm accents
- Natural lighting, slight film grain
- NO stock photo aesthetic, NO people pointing at screens, NO abstract tech blobs
- NO text in the image

${IMAGE_STYLE_CONFIG.negativePrompt ? `Avoid: ${IMAGE_STYLE_CONFIG.negativePrompt}` : ""}`;

          featuredImageUrl = await generateImageWithProvider(imagePrompt, imageProvider, slug);
        } catch (imageError) {
          logger.error(`Image generation error for post ${postNum}`, { endpoint: "/api/content-studio/batch-generate" }, imageError as Error);
        }

        // Step 4: AI Review (simplified for batch)
        sendEvent("progress", { stage: "review", current: postNum, message: `[${postNum}/${count}] Running AI review...` });
        
        let aiReview = null;
        try {
          aiReview = await runAIReview({
            title: research.title,
            metaDescription: research.metaDescription,
            article: articleContent,
            imageDescription: research.imageDescription || "",
            faqs: research.faqs || [],
            keywords: research.keywords || []
          });
        } catch (reviewError) {
          logger.error(`AI Review error for post ${postNum}`, { endpoint: "/api/content-studio/batch-generate" }, reviewError as Error);
        }

        // Save the completed post with backdated timestamp
        const wordCount = articleContent.split(/\s+/).filter(Boolean).length;
        const nicheWeight = getTopicWeight(topic.category || "");
        
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": research.title,
          "description": research.metaDescription,
          "author": {
            "@type": "Person",
            "name": "Jeremy Kean",
            "url": "https://keanonbiz.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "KeanOnBiz",
            "logo": {
              "@type": "ImageObject",
              "url": "https://keanonbiz.com/kean-on-biz-logo-blue.png"
            }
          },
          "datePublished": backdatedDate.toISOString(),
          "dateModified": backdatedDate.toISOString(),
          "mainEntityOfPage": `https://keanonbiz.com/blog/${slug}`
        };

        const [updatedPost] = await db.update(blogPosts)
          .set({
            slug,
            title: research.title,
            headline: research.title,
            metaTitle: research.metaTitle || research.title,
            metaDescription: research.metaDescription,
            content: articleContent,
            htmlContent: articleContent,
            faqs: research.faqs,
            tags: research.keywords,
            structuredData,
            featuredImage: featuredImageUrl || null,
            featuredImageAlt: research.imageDescription,
            topicId: topic.id,
            wordCount,
            status: "published", // Publish backdated posts directly
            createdAt: backdatedDate,
            updatedAt: backdatedDate,
            aiReview: aiReview,
            imageProvider: imageProvider,
          })
          .where(eq(blogPosts.id, newPost.id))
          .returning();

        generatedPosts.push({
          id: updatedPost.id,
          title: updatedPost.title,
          date: backdatedDate.toISOString().split('T')[0],
          score: aiReview?.overallScore || null
        });

        sendEvent("progress", { 
          stage: "item_complete", 
          current: postNum, 
          total: count,
          message: `[${postNum}/${count}] Completed: ${research.title} (Score: ${aiReview?.overallScore || 'N/A'})`,
          post: {
            id: updatedPost.id,
            title: updatedPost.title,
            date: backdatedDate.toISOString().split('T')[0]
          }
        });

      } catch (postError) {
        logger.error(`Error generating post ${postNum}`, { endpoint: "/api/content-studio/batch-generate" }, postError as Error);
        sendEvent("progress", { 
          stage: "item_error", 
          current: postNum, 
          message: `[${postNum}/${count}] Error generating post - continuing to next...` 
        });
      }

      // Small delay between posts to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    sendEvent("progress", { stage: "complete", message: `Batch generation complete! Generated ${generatedPosts.length} posts.` });
    sendEvent("complete", { posts: generatedPosts, count: generatedPosts.length });
    res.end();

  } catch (error) {
    logger.error("Batch generation error", { endpoint: "/api/content-studio/batch-generate" }, error as Error);
    sendEvent("error", { message: "Batch generation failed" });
    res.end();
  }
});

// ============================================
// DASHBOARD STATS
// ============================================

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
    const [publishedCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.status, "published"));
    const [draftsCount] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(eq(blogPosts.status, "draft"));
    const [channelsCount] = await db.select({ count: sql<number>`count(*)` }).from(youtubeChannels);
    const [topicsCount] = await db.select({ count: sql<number>`count(*)` }).from(contentTopics);

    const pillarDistribution = await db.select({
      pillar: blogPosts.pillar,
      count: sql<number>`count(*)`,
    }).from(blogPosts).groupBy(blogPosts.pillar);

    const pillarStats: Record<string, number> = {};
    for (const row of pillarDistribution) {
      pillarStats[row.pillar || "unassigned"] = Number(row.count);
    }

    res.json({
      totalPosts: Number(postsCount.count),
      publishedPosts: Number(publishedCount.count),
      draftPosts: Number(draftsCount.count),
      youtubeChannels: Number(channelsCount.count),
      contentTopics: Number(topicsCount.count),
      pillarDistribution: pillarStats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
