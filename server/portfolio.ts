import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { db } from "./db";
import { portfolioProjects, projectSnapshots } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { logger } from "./logger";
import { requireAuth } from "./auth-utils";
import { createRateLimiter } from "./rate-limiter";
import { 
  validateBody, 
  portfolioProjectCreateSchema, 
  portfolioProjectUpdateSchema, 
  portfolioImportSchema,
  snapshotCreateSchema 
} from "./validation";

const router = Router();

const UPLOAD_DIR = path.resolve("public/uploads/portfolio");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const uniqueId = crypto.randomBytes(8).toString("hex");
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uniqueId}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    if (allAllowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${allAllowed.join(", ")}`));
    }
  },
  limits: {
    fileSize: MAX_VIDEO_SIZE,
  },
});

router.post("/upload", requireAuth, (req: any, res) => {
  const singleUpload = upload.single("file");
  singleUpload(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: "File too large. Images: 10MB max, Videos: 50MB max." });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(req.file.mimetype);
    if (isImage && req.file.size > MAX_IMAGE_SIZE) {
      fs.unlinkSync(req.file.path);
      return res.status(413).json({ error: "Image file too large. Maximum size is 10MB." });
    }

    const url = `/uploads/portfolio/${req.file.filename}`;
    const fileType = isImage ? "image" : "video";

    logger.info("Portfolio file uploaded", {
      filename: req.file.filename,
      type: fileType,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    res.json({
      url,
      filename: req.file.filename,
      type: fileType,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });
});

const portfolioWriteLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  concurrentLimit: 5,
});

const portfolioReadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  concurrentLimit: 20,
});

router.get("/projects", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = portfolioReadLimiter(`portfolio-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const projects = await db
      .select()
      .from(portfolioProjects)
      .orderBy(desc(portfolioProjects.updatedAt));
    
    res.json(projects);
  } catch (error) {
    logger.error("Failed to fetch portfolio projects", { endpoint: "/api/portfolio/projects" }, error as Error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/projects/:slug", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = portfolioReadLimiter(`portfolio-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const { slug } = req.params;
    const [project] = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.slug, slug));
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    logger.error("Failed to fetch project", { endpoint: "/api/portfolio/projects/:slug" }, error as Error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.get("/projects/:slug/snapshots", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = portfolioReadLimiter(`portfolio-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const { slug } = req.params;
    
    const [project] = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.slug, slug));
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const snapshots = await db
      .select()
      .from(projectSnapshots)
      .where(eq(projectSnapshots.projectId, project.id))
      .orderBy(desc(projectSnapshots.createdAt));
    
    res.json(snapshots);
  } catch (error) {
    logger.error("Failed to fetch snapshots", { endpoint: "/api/portfolio/projects/:slug/snapshots" }, error as Error);
    res.status(500).json({ error: "Failed to fetch snapshots" });
  }
});

router.post("/projects", requireAuth, async (req: any, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    const rateCheck = portfolioWriteLimiter(`portfolio:${clientIp}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
    }

    const validation = validateBody(portfolioProjectCreateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }

    const { title, slug, description, replitUrl, githubUrl, liveUrl, category, techStack, status, featuredImage, clientName, clientIndustry, heroVideoUrl, caseStudy, milestones, mediaGallery } = validation.data;
    
    const [project] = await db
      .insert(portfolioProjects)
      .values({
        title,
        slug,
        description,
        replitUrl,
        githubUrl,
        liveUrl,
        category: category || "website",
        techStack: techStack || [],
        status: status || "on_deck",
        featuredImage,
        clientName,
        clientIndustry,
        heroVideoUrl,
        caseStudy,
        milestones,
        mediaGallery,
      })
      .returning();
    
    res.json(project);
  } catch (error) {
    logger.error("Failed to create project", { endpoint: "/api/portfolio/projects" }, error as Error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.patch("/projects/:id", requireAuth, async (req: any, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    const rateCheck = portfolioWriteLimiter(`portfolio:${clientIp}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
    }

    const { id } = req.params;
    
    const validation = validateBody(portfolioProjectUpdateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const [project] = await db
      .update(portfolioProjects)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(portfolioProjects.id, parseInt(id)))
      .returning();
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    logger.error("Failed to update project", { endpoint: "/api/portfolio/projects/:slug" }, error as Error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.post("/projects/:identifier/snapshots", requireAuth, async (req: any, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    const rateCheck = portfolioWriteLimiter(`portfolio:${clientIp}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
    }

    const { identifier } = req.params;
    
    const validation = validateBody(snapshotCreateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const { screenshotUrl, commitHash, commitMessage, aiSummary, changeHighlights } = validation.data;
    
    const isNumeric = /^\d+$/.test(identifier);
    const [project] = await db
      .select()
      .from(portfolioProjects)
      .where(isNumeric 
        ? eq(portfolioProjects.id, parseInt(identifier))
        : eq(portfolioProjects.slug, identifier)
      );
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    const newVersion = (project.snapshotCount || 0) + 1;
    
    const [snapshot] = await db
      .insert(projectSnapshots)
      .values({
        projectId: project.id,
        screenshotUrl,
        commitHash,
        commitMessage,
        aiSummary,
        changeHighlights: changeHighlights || [],
        version: newVersion,
      })
      .returning();
    
    await db
      .update(portfolioProjects)
      .set({
        snapshotCount: newVersion,
        updatedAt: new Date(),
        featuredImage: screenshotUrl || project.featuredImage,
      })
      .where(eq(portfolioProjects.id, project.id));
    
    res.json(snapshot);
  } catch (error) {
    logger.error("Failed to create snapshot", { endpoint: "/api/portfolio/projects/:slug/snapshots" }, error as Error);
    res.status(500).json({ error: "Failed to create snapshot" });
  }
});

router.post("/import", requireAuth, async (req: any, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    const rateCheck = portfolioWriteLimiter(`portfolio:${clientIp}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
    }

    const validation = validateBody(portfolioImportSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    
    const data = validation.data;

    const [existing] = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.slug, data.slug));

    if (existing) {
      const [project] = await db
        .update(portfolioProjects)
        .set({
          title: data.title,
          description: data.description,
          replitUrl: data.replitUrl,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          status: data.status || existing.status,
          category: data.category || existing.category,
          featuredImage: data.featuredImage,
          techStack: data.techStack || existing.techStack,
          clientName: data.clientName,
          clientIndustry: data.clientIndustry,
          buildStartDate: data.buildStartDate ? new Date(data.buildStartDate) : null,
          buildEndDate: data.buildEndDate ? new Date(data.buildEndDate) : null,
          caseStudy: data.caseStudy,
          milestones: data.milestones,
          mediaGallery: data.mediaGallery,
          heroVideoUrl: data.heroVideoUrl,
          updatedAt: new Date(),
          completedAt: data.status === "completed" ? new Date() : null,
        })
        .where(eq(portfolioProjects.id, existing.id))
        .returning();
      
      return res.json({ action: "updated", project });
    }

    const [project] = await db
      .insert(portfolioProjects)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description,
        replitUrl: data.replitUrl,
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        status: data.status || "on_deck",
        category: data.category || "website",
        featuredImage: data.featuredImage,
        techStack: data.techStack || [],
        clientName: data.clientName,
        clientIndustry: data.clientIndustry,
        buildStartDate: data.buildStartDate ? new Date(data.buildStartDate) : null,
        buildEndDate: data.buildEndDate ? new Date(data.buildEndDate) : null,
        caseStudy: data.caseStudy,
        milestones: data.milestones,
        mediaGallery: data.mediaGallery,
        heroVideoUrl: data.heroVideoUrl,
      })
      .returning();

    res.json({ action: "created", project });
  } catch (error) {
    logger.error("Failed to import project", { endpoint: "/api/portfolio/import" }, error as Error);
    res.status(500).json({ error: "Failed to import project" });
  }
});

router.post("/seed-vybekoderz", requireAuth, async (_req: any, res) => {
  try {
    const listings = [
      {
        title: "PimpMyPrompt",
        slug: "pimpmyprompt",
        description: "An AI-powered prompt engineering tool that transforms basic prompts into optimized, high-performance prompts for any LLM. Users paste in a rough prompt, select their target model and use case, and get back a professionally structured prompt with system instructions, few-shot examples, and output formatting.",
        liveUrl: "https://pimpmyprompt.lol",
        status: "completed",
        category: "tool",
        clientName: "VybeKoderz",
        clientIndustry: "AI / Productivity",
        techStack: ["React", "TypeScript", "OpenAI API", "Tailwind CSS", "Node.js", "Vite"],
        buildStartDate: new Date("2025-01-28"),
        buildEndDate: new Date("2025-02-28"),
        caseStudy: {
          tagline: "Turn rough prompts into high-performance instructions for any LLM",
          problemStatement: "Most users paste unstructured, vague prompts into AI tools and get mediocre results back. The prompt engineering gap is real — better inputs mean dramatically better outputs, but most people don't know how to structure prompts for different models. Existing tools like PromptPerfect ($12K MRR) and Promptheus ($8K MRR) only optimize for a single model. No tool on the market handles multi-model prompt optimization, leaving 2.4 million prompt-heavy users underserved.",
          solutionOverview: "PimpMyPrompt is a prompt transformation engine that takes any rough prompt and restructures it into an optimized, professionally formatted prompt tailored to the user's target model — GPT-4, Claude, Gemini, or Llama. It generates system instructions, injects few-shot examples, adds output formatting, and scores the result. The entire transformation happens in under 3 seconds.",
          keyFeatures: [
            "Multi-model optimization — supports GPT-4, Claude, Gemini, and Llama with model-specific syntax",
            "System instruction generation — automatically creates context-setting instructions",
            "Few-shot example injection — adds relevant examples to improve output quality",
            "Output formatting — structures responses with headers, lists, and code blocks",
            "Use-case templates — pre-built templates for coding, writing, analysis, and creative work",
            "Prompt scoring — rates prompt quality before and after optimization"
          ],
          buildApproach: "Built in 30 days using vibe coding methodology — rapid prototyping with AI assistance, validated against competitor analysis. The build followed a 5-stage pipeline: ideation and market research, revenue validation, MVP development, marketing preparation, and production deployment. Every stage was documented with build logs for full transparency.",
          challengesFaced: [
            "Multi-model prompt syntax differences — each LLM has different optimal structures",
            "Balancing prompt structure vs. creative freedom — over-structured prompts can kill creativity",
            "Response time optimization — keeping transformations under 3 seconds at scale"
          ],
          lessonsLearned: [
            "Gap identification beats feature copying — finding what competitors DON'T do is more valuable than copying what they do",
            "SOPs should be written during build, not after — documenting as you go creates better operational handoffs",
            "Marketing plan needs to be baked in from day one — not bolted on at the end"
          ],
          resultsAchieved: [
            "Production deployed and fully operational — all systems green",
            "Response time under 3 seconds for all prompt transformations",
            "Targeting 2.4M prompt-heavy users across developer, writer, and business segments",
            "Complete launch package: SOPs, marketing plan, content calendar, and monitoring dashboard",
            "30-day content pipeline queued across LinkedIn, Twitter, and Reddit",
            "$45,000 valuation with projected $8,500/mo revenue by month 6"
          ],
          nextSteps: [
            "Scale user acquisition through content marketing pipeline",
            "Add team/enterprise tier with shared prompt libraries",
            "Build browser extension for in-context prompt optimization"
          ]
        },
        milestones: [
          {
            id: "pmp-1",
            title: "Idea Validated",
            description: "TAM estimated at 2.4M prompt-heavy users. Competitor gap identified: no tool handles multi-model optimization. Green-lit for build.",
            date: "2025-01-28"
          },
          {
            id: "pmp-2",
            title: "Competitor Analysis Complete",
            description: "PromptPerfect ($12K MRR), Promptheus ($8K MRR). Gap identified: no tool handles multi-model optimization. Revenue projections modeled.",
            date: "2025-02-03"
          },
          {
            id: "pmp-3",
            title: "Core Engine Built",
            description: "Core prompt transformation engine complete. Supports GPT-4, Claude, Gemini, Llama. Response time under 3 seconds.",
            date: "2025-02-14"
          },
          {
            id: "pmp-4",
            title: "Marketing Pipeline Ready",
            description: "Content calendar built — 30 days of LinkedIn, Twitter, and Reddit posts queued. Landing page A/B test running.",
            date: "2025-02-22"
          },
          {
            id: "pmp-5",
            title: "Production Launch",
            description: "Production deployment finalized. All systems green. Monitoring dashboard configured. SOPs written and delivered.",
            date: "2025-02-28"
          }
        ]
      },
      {
        title: "Pocket Note",
        slug: "pocket-note",
        description: "A fast, AI-enhanced note-taking app designed for people who think in fragments. Capture voice memos, quick text, screenshots, and links — then let AI organize, tag, summarize, and connect your notes into actionable threads. Built for creators, founders, and idea machines who lose great thoughts to bad systems.",
        liveUrl: "https://pocketnote.app",
        status: "in_progress",
        category: "tool",
        clientName: "VybeKoderz",
        clientIndustry: "Productivity / SaaS",
        techStack: ["React", "TypeScript", "OpenAI API", "Web Speech API", "PWA", "Tailwind CSS", "Node.js"],
        buildStartDate: new Date("2025-01-30"),
        caseStudy: {
          tagline: "Capture everything. Lose nothing. Let AI connect the dots.",
          problemStatement: "Creators, founders, and idea machines lose 3+ great ideas per week to bad capture systems. A survey of 200+ creators confirmed the core pain: context is lost between devices, voice notes get buried, and no existing tool combines voice + text + AI organization under $10/mo. Notion is too complex, Apple Notes is too simple, and everything else is too expensive.",
          solutionOverview: "Pocket Note is built for people who think in fragments. It captures voice memos, quick text, screenshots, and links from any device — then uses AI to organize, tag, summarize, and connect notes into actionable threads. The AI auto-tagging engine hits 94% accuracy, and the PWA shell makes it feel native on mobile without an app store download.",
          keyFeatures: [
            "Voice-to-text capture — speak your ideas and Pocket Note transcribes and organizes them",
            "AI auto-tagging — 94% accuracy in categorizing and connecting related notes",
            "Cross-device sync — capture from phone, tablet, or desktop with zero friction",
            "AI thread connection — automatically links related fragments into coherent threads",
            "Fragment-to-action workflows — turn scattered notes into structured to-do lists and project plans",
            "PWA for mobile — native app feel without the app store, works offline"
          ],
          buildApproach: "Problem validated with 200+ survey responses from creators and founders before writing a single line of code. Revenue target of $12K MRR validated against Notion, Mem, and Capacities pricing models. Currently in Stage 4 (Marketing Phase) — brand identity finalized, building content pipeline and launch strategy. Approximately 3 weeks from production launch.",
          challengesFaced: [
            "Voice-to-text accuracy in noisy environments — required custom noise filtering layer",
            "AI organization without over-categorizing — finding the right balance between structure and flexibility",
            "Making the PWA feel native — bridging the gap between web and native app experience"
          ],
          lessonsLearned: [
            "Survey validation before build saves months — 200+ responses confirmed the problem before any code was written",
            "Voice capture is the killer feature users didn't know they wanted — it tested highest in user research",
            "Pricing under $10/mo removes the comparison to Notion — different mental bucket for users"
          ],
          resultsAchieved: [
            "Core capture + AI organization engine complete and functional",
            "AI auto-tagging hitting 94% accuracy on test data",
            "Mobile responsive PWA shell complete — works offline",
            "Brand identity finalized — logo, color system, and tone of voice guide delivered",
            "Targeting 8.1M users in the productivity/note-taking space",
            "$32,000 current valuation, projected $12,000/mo revenue by month 6"
          ],
          nextSteps: [
            "Complete marketing phase — content pipeline and launch strategy",
            "Final QA, payment integration, and SOP documentation",
            "Production launch targeting ~3 weeks out"
          ]
        },
        milestones: [
          {
            id: "pn-1",
            title: "Idea Green-lit",
            description: "Competitor gap identified: no tool combines voice + text + AI organization under $10/mo. Concept validated for build.",
            date: "2025-01-30"
          },
          {
            id: "pn-2",
            title: "User Research Complete",
            description: "Survey of 200+ creators and founders complete. 73% of respondents lose 3+ ideas per week to bad capture. Top pain point: context loss between devices.",
            date: "2025-02-08"
          },
          {
            id: "pn-3",
            title: "MVP Engine Built",
            description: "AI auto-tagging engine hitting 94% accuracy. Voice-to-text capture integrated. PWA shell complete and responsive on mobile.",
            date: "2025-02-18"
          },
          {
            id: "pn-4",
            title: "Brand Identity Delivered",
            description: "Brand identity finalized. Logo, color system, and tone of voice guide delivered. Starting content creation and launch strategy.",
            date: "2025-02-26"
          }
        ]
      },
      {
        title: "MenuMoney",
        slug: "menumoney",
        description: "An AI-powered menu optimization engine for restaurant owners. Upload your menu, and MenuMoney analyzes pricing against local competitors, food cost benchmarks, and pricing psychology to recommend what to price higher, what to cut, what to rename, and where you're leaving money on the table. Turns a $2 price tweak into thousands in monthly margin.",
        liveUrl: "https://menumoney.io",
        status: "on_deck",
        category: "tool",
        clientName: "VybeKoderz",
        clientIndustry: "Restaurant / AI Analytics",
        techStack: ["React", "TypeScript", "OpenAI API", "Data Analytics", "Pricing Psychology", "Node.js"],
        buildStartDate: new Date("2025-01-25"),
        caseStudy: {
          tagline: "Turn a $2 price tweak into thousands in monthly margin.",
          problemStatement: "Restaurant owners leave money on the table with menus priced by gut feel. They don't have access to competitive pricing data, food cost benchmarks, or pricing psychology insights without hiring expensive consultants. The average independent restaurant operates on 3-5% margins, and a single mispriced item can cost thousands per month. With 1M+ restaurants in the US alone, this is a massive, underserved market.",
          solutionOverview: "MenuMoney is an AI-powered menu optimization engine. Restaurant owners upload their menu — PDF, photo, or manual entry — and MenuMoney analyzes every item against local competitor pricing, food cost benchmarks, and pricing psychology research. It recommends what to price higher, what to cut, what to rename for higher perceived value, and exactly where margin is being lost. The $2 price tweak framing makes ROI instantly tangible.",
          keyFeatures: [
            "Menu upload + OCR — supports PDFs, photos, and manual entry for any menu format",
            "Local competitor pricing analysis — benchmarks against nearby restaurants in the same category",
            "Food cost benchmarking — compares ingredient costs against industry standards",
            "Pricing psychology recommendations — applies anchoring, decoy pricing, and charm pricing principles",
            "Margin impact projections — shows exactly how much revenue each recommended change adds",
            "Rename suggestions — recommends menu item names that increase perceived value and order rates"
          ],
          buildApproach: "Currently in Stage 1 — Research & Ideation. Market research is complete, competitor analysis is done, and the ideal customer profile is defined. Revenue projections model $18K MRR by month 6. This is the earliest stage listing with the lowest entry point, meaning the most upside for early believers. The restaurant industry is massively underserved by AI tools.",
          challengesFaced: [
            "Menu format standardization — restaurants use everything from handwritten menus to professional PDFs",
            "Local competitor data sourcing — building reliable pricing data for local markets",
            "Restaurant owner tech adoption curve — the target audience isn't traditionally tech-forward"
          ],
          lessonsLearned: [
            "Restaurant industry is underserved by AI tools — huge opportunity with low competition",
            "Pricing psychology is the hook that sells the tool — owners understand 'make more money' better than 'AI optimization'",
            "The $2 price tweak framing makes ROI instantly tangible — specific beats vague every time"
          ],
          resultsAchieved: [
            "Market research completed — 1M+ restaurants in target market identified",
            "Competitor analysis done — no direct AI menu pricing tool exists at this price point",
            "Ideal customer profile defined — independent restaurant owners doing $500K-$2M annual revenue",
            "Revenue projections modeled — $18,000/mo projected revenue by month 6",
            "$8,000 current valuation at Stage 1 — lowest entry point of any listing"
          ],
          nextSteps: [
            "Complete validation phase — revenue modeling and marketability scoring",
            "Begin MVP build — core menu analysis engine",
            "Develop local competitor data pipeline"
          ]
        },
        milestones: [
          {
            id: "mm-1",
            title: "Concept Researched",
            description: "Restaurant industry AI gap identified. 1M+ target market confirmed. No direct competitor offering AI menu pricing optimization at an accessible price point.",
            date: "2025-01-25"
          },
          {
            id: "mm-2",
            title: "Market Analysis Complete",
            description: "Competitor analysis, ideal customer profile, and revenue projections finalized. $18K MRR target validated. Green-lit for validation phase.",
            date: "2025-02-10"
          }
        ]
      }
    ];

    const results = [];
    for (const listing of listings) {
      const [existing] = await db
        .select()
        .from(portfolioProjects)
        .where(eq(portfolioProjects.slug, listing.slug));

      const completedAt = listing.status === "completed" && listing.buildEndDate
        ? listing.buildEndDate
        : listing.status === "completed" ? new Date() : null;

      if (existing) {
        const [project] = await db
          .update(portfolioProjects)
          .set({
            ...listing,
            updatedAt: new Date(),
            completedAt,
          })
          .where(eq(portfolioProjects.id, existing.id))
          .returning();
        results.push({ action: "updated", slug: listing.slug, id: project.id });
      } else {
        const [project] = await db
          .insert(portfolioProjects)
          .values({
            ...listing,
            completedAt,
          })
          .returning();
        results.push({ action: "created", slug: listing.slug, id: project.id });
      }
    }

    logger.info("VybeKoderz portfolio seeded", { results });
    res.json({ success: true, results });
  } catch (error) {
    logger.error("Failed to seed VybeKoderz portfolio", {}, error as Error);
    res.status(500).json({ error: "Failed to seed portfolio" });
  }
});

router.delete("/projects/:id", requireAuth, async (req: any, res) => {
  try {
    const clientIp = req.ip || 'unknown';
    const rateCheck = portfolioWriteLimiter(`portfolio:${clientIp}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
    }

    const { id } = req.params;
    
    await db.delete(projectSnapshots).where(eq(projectSnapshots.projectId, parseInt(id)));
    
    const [project] = await db
      .delete(portfolioProjects)
      .where(eq(portfolioProjects.id, parseInt(id)))
      .returning();
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete project", { endpoint: "/api/portfolio/projects/:slug" }, error as Error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
