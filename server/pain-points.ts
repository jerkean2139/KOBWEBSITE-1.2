import { Router } from "express";
import { db } from "./db";
import { industryProfiles, painPoints, researchRuns } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { logger } from "./logger";
import { requireAuth } from "./auth-utils";
import { createRateLimiter } from "./rate-limiter";
import { chatCompletion } from "./ai-client";

const router = Router();

const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  concurrentLimit: 5,
});

const readLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  concurrentLimit: 20,
});

router.get("/industries", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = readLimiter(`pp-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const industries = await db
      .select()
      .from(industryProfiles)
      .orderBy(industryProfiles.name);
    res.json(industries);
  } catch (error) {
    logger.error("Failed to fetch industries", { error });
    res.status(500).json({ error: "Failed to fetch industries" });
  }
});

router.post("/industries", requireAuth, writeLimiter, async (req, res) => {
  try {
    const { name, slug, description, targetPersona, status } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }
    const [industry] = await db
      .insert(industryProfiles)
      .values({ name, slug, description, targetPersona, status: status || "active" })
      .returning();
    res.json(industry);
  } catch (error) {
    logger.error("Failed to create industry", { error });
    res.status(500).json({ error: "Failed to create industry" });
  }
});

router.patch("/industries/:id", requireAuth, writeLimiter, async (req, res) => {
  try {
    const { name, slug, description, targetPersona, status } = req.body;
    const [industry] = await db
      .update(industryProfiles)
      .set({ name, slug, description, targetPersona, status, updatedAt: new Date() })
      .where(eq(industryProfiles.id, parseInt(req.params.id)))
      .returning();
    res.json(industry);
  } catch (error) {
    logger.error("Failed to update industry", { error });
    res.status(500).json({ error: "Failed to update industry" });
  }
});

router.delete("/industries/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(painPoints).where(eq(painPoints.industryId, id));
    await db.delete(industryProfiles).where(eq(industryProfiles.id, id));
    res.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete industry", { error });
    res.status(500).json({ error: "Failed to delete industry" });
  }
});

router.get("/pain-points", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = readLimiter(`pp-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const industryId = req.query.industryId ? parseInt(req.query.industryId as string) : undefined;
    const category = req.query.category as string | undefined;

    let query = db.select().from(painPoints).orderBy(desc(painPoints.severity));

    const conditions = [];
    if (industryId) conditions.push(eq(painPoints.industryId, industryId));
    if (category) conditions.push(eq(painPoints.category, category));

    let results;
    if (conditions.length > 0) {
      results = await db
        .select()
        .from(painPoints)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(desc(painPoints.severity));
    } else {
      results = await db
        .select()
        .from(painPoints)
        .orderBy(desc(painPoints.severity));
    }
    res.json(results);
  } catch (error) {
    logger.error("Failed to fetch pain points", { error });
    res.status(500).json({ error: "Failed to fetch pain points" });
  }
});

router.post("/pain-points", requireAuth, writeLimiter, async (req, res) => {
  try {
    const { industryId, category, title, description, severity, source, sourceUrl, keywords, manumationAngle } = req.body;
    if (!industryId || !title) {
      return res.status(400).json({ error: "industryId and title are required" });
    }
    const [point] = await db
      .insert(painPoints)
      .values({
        industryId,
        category: category || "operations",
        title,
        description,
        severity: severity || 5,
        source: source || "manual",
        sourceUrl,
        keywords: keywords || [],
        manumationAngle,
      })
      .returning();
    res.json(point);
  } catch (error) {
    logger.error("Failed to create pain point", { error });
    res.status(500).json({ error: "Failed to create pain point" });
  }
});

router.patch("/pain-points/:id", requireAuth, writeLimiter, async (req, res) => {
  try {
    const { industryId, category, title, description, severity, source, sourceUrl, keywords, manumationAngle } = req.body;
    const [point] = await db
      .update(painPoints)
      .set({ industryId, category, title, description, severity, source, sourceUrl, keywords, manumationAngle, updatedAt: new Date() })
      .where(eq(painPoints.id, parseInt(req.params.id)))
      .returning();
    res.json(point);
  } catch (error) {
    logger.error("Failed to update pain point", { error });
    res.status(500).json({ error: "Failed to update pain point" });
  }
});

router.delete("/pain-points/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(painPoints).where(eq(painPoints.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    logger.error("Failed to delete pain point", { error });
    res.status(500).json({ error: "Failed to delete pain point" });
  }
});

router.get("/pain-points/for-content", async (req, res) => {
  const clientIp = req.ip || 'unknown';
  const rateCheck = readLimiter(`pp-read:${clientIp}`);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason || "Rate limit exceeded" });
  }
  try {
    const pillar = req.query.pillar as string | undefined;
    const industrySlug = req.query.industry as string | undefined;

    let industryIds: number[] = [];

    if (industrySlug) {
      const [industry] = await db
        .select()
        .from(industryProfiles)
        .where(eq(industryProfiles.slug, industrySlug));
      if (industry) industryIds = [industry.id];
    }

    const pillarToIndustryMap: Record<string, string[]> = {
      "pain": ["small-business-owners", "insurance-agencies", "business-coaches-consultants"],
      "hope": ["small-business-owners", "insurance-agencies", "marketing-agencies", "home-service-companies"],
      "philosophy": ["business-coaches-consultants", "small-business-owners"],
      "proof": ["small-business-owners", "insurance-agencies", "title-companies"],
      "vision": ["business-coaches-consultants", "small-business-owners", "real-estate-agents"],
    };

    if (pillar && !industrySlug) {
      const relevantSlugs = pillarToIndustryMap[pillar] || [];
      if (relevantSlugs.length > 0) {
        const industries = await db
          .select()
          .from(industryProfiles)
          .where(sql`${industryProfiles.slug} IN (${sql.join(relevantSlugs.map(s => sql`${s}`), sql`, `)})`);
        industryIds = industries.map(i => i.id);
      }
    }

    let results;
    if (industryIds.length > 0) {
      results = await db
        .select()
        .from(painPoints)
        .where(sql`${painPoints.industryId} IN (${sql.join(industryIds.map(id => sql`${id}`), sql`, `)})`)
        .orderBy(desc(painPoints.severity))
        .limit(10);
    } else {
      results = await db
        .select()
        .from(painPoints)
        .orderBy(desc(painPoints.severity))
        .limit(10);
    }

    res.json(results);
  } catch (error) {
    logger.error("Failed to fetch pain points for content", { error });
    res.status(500).json({ error: "Failed to fetch pain points" });
  }
});

router.get("/research-runs", requireAuth, async (_req, res) => {
  try {
    const runs = await db
      .select()
      .from(researchRuns)
      .orderBy(desc(researchRuns.runDate))
      .limit(20);
    res.json(runs);
  } catch (error) {
    logger.error("Failed to fetch research runs", { error });
    res.status(500).json({ error: "Failed to fetch research runs" });
  }
});

router.post("/research/run", requireAuth, async (req, res) => {
  try {
    const industries = await db
      .select()
      .from(industryProfiles)
      .where(eq(industryProfiles.status, "active"));

    if (industries.length === 0) {
      return res.status(400).json({ error: "No active industries to research" });
    }

    const [run] = await db
      .insert(researchRuns)
      .values({
        industriesSearched: industries.map(i => i.slug),
        status: "running",
        log: [{ timestamp: new Date().toISOString(), message: "Research run started", level: "info" }],
      })
      .returning();

    res.json({ runId: run.id, message: "Research run started" });

    executeResearchRun(run.id, industries).catch(err => {
      logger.error("Research run failed", { error: err, runId: run.id });
    });
  } catch (error) {
    logger.error("Failed to start research run", { error });
    res.status(500).json({ error: "Failed to start research run" });
  }
});

async function executeResearchRun(runId: number, industries: Array<{ id: number; name: string; slug: string; targetPersona: string | null }>) {
  const logEntries: Array<{ timestamp: string; message: string; level: string }> = [];
  let totalFindings = 0;
  let newPainPointsAdded = 0;

  const addLog = (message: string, level = "info") => {
    logEntries.push({ timestamp: new Date().toISOString(), message, level });
  };

  try {
    for (const industry of industries) {
      addLog(`Researching: ${industry.name}`);

      const existingPoints = await db
        .select()
        .from(painPoints)
        .where(eq(painPoints.industryId, industry.id));

      const existingTitles = existingPoints.map(p => p.title.toLowerCase());

      const searchQueries = [
        `${industry.name} biggest challenges 2026`,
        `${industry.name} owners struggling with operations`,
        `${industry.name} automation pain points`,
        `${industry.name} common business problems and solutions`,
        `What keeps ${industry.name.toLowerCase()} owners up at night`,
      ];

      addLog(`Running ${searchQueries.length} search queries for ${industry.name}`);

      const completion = await chatCompletion({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a business research analyst specializing in the ${industry.name} industry. Your job is to identify the most pressing operational pain points that business owners in this sector face today.

For context, we already have these pain points documented:
${existingPoints.map(p => `- ${p.title}`).join("\n")}

Your task: Identify 5-8 NEW pain points that are NOT already in our database. Focus on:
- Day-to-day operational friction
- Revenue leaks from manual processes
- Technology gaps or tool sprawl
- Hiring, retention, and team management issues
- Customer experience breakdowns
- Compliance and regulatory overhead

For each pain point, provide:
1. A concise title (max 80 chars)
2. A detailed description (2-3 sentences explaining the real impact)
3. Category: operations, sales, marketing, tech, or hiring
4. Severity: 1-10 (10 = business-threatening)
5. Keywords: 3-5 search terms related to this pain point
6. Manumation Angle: How Jeremy Kean's Manumation Method (blending human ingenuity with AI and automation) specifically addresses this problem

Return ONLY valid JSON array. No markdown formatting.`,
          },
          {
            role: "user",
            content: `Research the current challenges facing ${industry.name} (target persona: ${industry.targetPersona || "business owner/operator"}). Identify 5-8 new, specific pain points. Consider these search angles:\n${searchQueries.join("\n")}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      try {
        const content = completion.content || "{}";
        const parsed = JSON.parse(content);
        const findings = parsed.painPoints || parsed.pain_points || parsed.findings || [];

        totalFindings += findings.length;

        for (const finding of findings) {
          const isDuplicate = existingTitles.some(
            (t) => t === finding.title?.toLowerCase() || t.includes(finding.title?.toLowerCase()?.slice(0, 30) || "")
          );

          if (!isDuplicate && finding.title) {
            await db.insert(painPoints).values({
              industryId: industry.id,
              category: finding.category || "operations",
              title: finding.title,
              description: finding.description || "",
              severity: Math.min(10, Math.max(1, finding.severity || 5)),
              source: "research",
              keywords: finding.keywords || [],
              manumationAngle: finding.manumationAngle || finding.manumation_angle || "",
            });
            newPainPointsAdded++;
            addLog(`Added: "${finding.title}" (${industry.name})`);
          } else {
            addLog(`Skipped duplicate: "${finding.title}"`, "warn");
          }
        }

        addLog(`Completed ${industry.name}: ${findings.length} found, ${findings.length - (totalFindings - newPainPointsAdded)} new`);
      } catch (parseError) {
        addLog(`Failed to parse AI response for ${industry.name}`, "error");
      }
    }

    await db
      .update(researchRuns)
      .set({
        status: "completed",
        totalFindings,
        newPainPointsAdded,
        log: logEntries,
      })
      .where(eq(researchRuns.id, runId));

    addLog(`Research run completed: ${totalFindings} findings, ${newPainPointsAdded} new pain points added`);
  } catch (error) {
    addLog(`Research run failed: ${error}`, "error");
    await db
      .update(researchRuns)
      .set({ status: "failed", log: logEntries })
      .where(eq(researchRuns.id, runId));
  }
}

router.post("/seed", requireAuth, async (_req, res) => {
  try {
    const existingIndustries = await db.select().from(industryProfiles);
    if (existingIndustries.length > 0) {
      return res.status(400).json({ error: "Database already seeded. Delete existing data first." });
    }

    const seedData = getSeedData();

    for (const industry of seedData) {
      const [created] = await db
        .insert(industryProfiles)
        .values({
          name: industry.name,
          slug: industry.slug,
          description: industry.description,
          targetPersona: industry.targetPersona,
        })
        .returning();

      for (const point of industry.painPoints) {
        await db.insert(painPoints).values({
          industryId: created.id,
          category: point.category,
          title: point.title,
          description: point.description,
          severity: point.severity,
          source: "manual",
          keywords: point.keywords,
          manumationAngle: point.manumationAngle,
        });
      }
    }

    res.json({ success: true, message: `Seeded ${seedData.length} industries with pain points` });
  } catch (error) {
    logger.error("Failed to seed pain points", { error });
    res.status(500).json({ error: "Failed to seed data" });
  }
});

function getSeedData() {
  return [
    {
      name: "Insurance Agencies",
      slug: "insurance-agencies",
      description: "Independent and captive insurance agencies handling P&C, life, health, and commercial lines",
      targetPersona: "Insurance agency owner or principal managing 3-25 staff with $1M-$10M in premium volume",
      painPoints: [
        {
          category: "operations",
          title: "Manual Policy Renewal Processing",
          description: "Staff manually tracks renewal dates, pulls policy data, and contacts clients one by one. A 500-policy book means 40+ renewals monthly, each requiring 15-30 minutes of manual work.",
          severity: 9,
          keywords: ["policy renewals", "renewal tracking", "retention rate", "policy lapse"],
          manumationAngle: "Automated renewal pipeline that triggers 90/60/30-day touchpoints, pulls carrier data, and routes to the right CSR with pre-built renewal packages.",
        },
        {
          category: "operations",
          title: "Carrier Appointment and Compliance Tracking",
          description: "Tracking appointment statuses, continuing education requirements, and compliance deadlines across multiple carriers creates administrative overhead that pulls producers away from selling.",
          severity: 7,
          keywords: ["carrier appointments", "compliance", "CE tracking", "licensing"],
          manumationAngle: "Centralized compliance dashboard with automated deadline alerts, CE tracking, and carrier appointment status monitoring.",
        },
        {
          category: "sales",
          title: "Cross-Selling and Account Rounding Gaps",
          description: "Most agencies leave massive revenue on the table by not systematically identifying cross-sell opportunities. A client with auto-only could be home, umbrella, and life.",
          severity: 8,
          keywords: ["cross-selling", "account rounding", "revenue per client", "multi-policy"],
          manumationAngle: "AI-driven account analysis that identifies coverage gaps and triggers personalized cross-sell campaigns through the client's preferred communication channel.",
        },
        {
          category: "tech",
          title: "AMS Data Entry and Duplicate Records",
          description: "CSRs spend 2-3 hours daily entering data into the agency management system. Duplicate client records, incomplete fields, and data migration issues compound over time.",
          severity: 8,
          keywords: ["AMS", "data entry", "duplicate records", "agency management system"],
          manumationAngle: "Automated data capture from carrier downloads, email parsing, and form submissions that populates the AMS without manual entry.",
        },
        {
          category: "hiring",
          title: "CSR Turnover and Training Costs",
          description: "The average CSR stays 18-24 months. Each replacement costs $15-25K in recruiting, training, and lost productivity. Knowledge walks out the door with every departure.",
          severity: 8,
          keywords: ["CSR turnover", "employee retention", "training costs", "onboarding"],
          manumationAngle: "SOPs and documented processes that capture institutional knowledge, plus AI-assisted training that gets new hires productive in weeks instead of months.",
        },
        {
          category: "sales",
          title: "Quoting Process Takes Too Long",
          description: "Getting competitive quotes across multiple carriers requires logging into each portal separately, entering the same data repeatedly, and manually comparing results.",
          severity: 9,
          keywords: ["quoting", "comparative rater", "quote speed", "carrier portals"],
          manumationAngle: "Streamlined quoting workflow using comparative raters and automated data population across carrier portals, cutting quote time by 60%.",
        },
        {
          category: "marketing",
          title: "No Systematic Referral Engine",
          description: "Most agencies get referrals passively. There is no automated system to ask happy clients for referrals at the right moment or to reward consistent referrers.",
          severity: 7,
          keywords: ["referrals", "client acquisition", "word of mouth", "referral program"],
          manumationAngle: "Automated referral program triggered by positive service interactions (claims settled, renewals processed) with tracking and reward fulfillment.",
        },
        {
          category: "operations",
          title: "Claims Follow-Up Communication Gaps",
          description: "After a claim is filed, clients hear nothing for weeks. The agency has no automated status updates, leading to frustrated calls and damaged relationships.",
          severity: 7,
          keywords: ["claims", "client communication", "status updates", "customer service"],
          manumationAngle: "Automated claims status pipeline that proactively updates clients at each stage and escalates stalled claims to the right team member.",
        },
      ],
    },
    {
      name: "Business Coaches & Consultants",
      slug: "business-coaches-consultants",
      description: "Independent business coaches, consultants, and advisors serving entrepreneurs and small business owners",
      targetPersona: "Solo or small-team business coach earning $100K-$500K annually, serving 10-50 active clients",
      painPoints: [
        {
          category: "operations",
          title: "Client Implementation Gap",
          description: "Coaches deliver great strategy, but 70%+ of clients fail to implement. The bottleneck isn't the advice—it's the client's operational capacity to execute while running their business.",
          severity: 10,
          keywords: ["implementation", "client results", "execution gap", "accountability"],
          manumationAngle: "Give coaches the ability to provide operational systems alongside strategy. When clients have automated workflows handling their day-to-day, they actually have time to implement coaching recommendations.",
        },
        {
          category: "sales",
          title: "Scaling Past 1:1 Time-for-Money",
          description: "Most coaches hit a ceiling at $200-300K because their model depends on personal time. Group programs feel diluted, and productizing knowledge is overwhelming.",
          severity: 9,
          keywords: ["scaling", "leverage", "group coaching", "passive income", "productize"],
          manumationAngle: "Build a systems-first coaching practice where AI handles onboarding, progress tracking, and routine accountability, freeing the coach to serve more clients without sacrificing quality.",
        },
        {
          category: "marketing",
          title: "Inconsistent Lead Generation",
          description: "Revenue swings between feast and famine because lead gen stops when the coach is busy delivering. No consistent pipeline means constant anxiety about the next client.",
          severity: 9,
          keywords: ["lead generation", "pipeline", "feast or famine", "client acquisition"],
          manumationAngle: "Automated lead nurture system that runs in the background—content distribution, email sequences, and follow-up campaigns that generate qualified leads even during busy delivery periods.",
        },
        {
          category: "operations",
          title: "No Standardized Client Onboarding",
          description: "Each new client gets a slightly different experience. No intake form, no welcome sequence, no clear expectations. This leads to scope creep and unclear outcomes.",
          severity: 7,
          keywords: ["onboarding", "client experience", "intake process", "scope creep"],
          manumationAngle: "Automated onboarding pipeline: intake forms, welcome sequences, goal-setting frameworks, and clear deliverable timelines that set every client up for success.",
        },
        {
          category: "tech",
          title: "Tool Sprawl and Tech Stack Chaos",
          description: "Coaches use 8-12 disconnected tools (Zoom, Calendly, Stripe, email, CRM, Kajabi, etc.). Data lives everywhere, nothing talks to each other, and time is wasted switching between platforms.",
          severity: 8,
          keywords: ["tech stack", "tool sprawl", "integration", "all-in-one platform"],
          manumationAngle: "Consolidate onto a single platform (Zenoflo/GHL) where booking, billing, email, CRM, courses, and communication all live in one place with automated workflows between them.",
        },
        {
          category: "operations",
          title: "Content Creation Overwhelm",
          description: "Coaches know they need to create content to attract clients, but writing blogs, social posts, emails, and podcasts on top of client delivery is unsustainable.",
          severity: 8,
          keywords: ["content creation", "content marketing", "social media", "thought leadership"],
          manumationAngle: "AI-powered content pipeline that drafts blog posts, newsletters, and social content in the coach's voice. The coach reviews and approves rather than creating from scratch.",
        },
        {
          category: "sales",
          title: "No Systematic Referral or Partner Strategy",
          description: "Referrals happen accidentally. Coaches don't have a structured program to incentivize referrals from clients, peers, or complementary service providers.",
          severity: 6,
          keywords: ["referrals", "partnerships", "affiliate", "strategic alliances"],
          manumationAngle: "Automated partner/referral program with tracking, attribution, and reward fulfillment. Build a network of referring partners with systems that make referring easy.",
        },
        {
          category: "operations",
          title: "Client Results Tracking is Manual or Nonexistent",
          description: "Without objective metrics, coaches can't prove ROI. Testimonials are collected ad hoc, and there's no system to track client progress against goals.",
          severity: 7,
          keywords: ["results tracking", "ROI", "client outcomes", "testimonials", "metrics"],
          manumationAngle: "Automated progress tracking dashboard where clients log milestones. The system captures wins for testimonials and flags at-risk clients before they disengage.",
        },
      ],
    },
    {
      name: "Marketing Agencies",
      slug: "marketing-agencies",
      description: "Digital marketing agencies, social media agencies, and advertising firms serving SMBs",
      targetPersona: "Agency owner managing 5-20 employees with 15-50 active client accounts",
      painPoints: [
        {
          category: "operations",
          title: "Scope Creep Eats Profit Margins",
          description: "Clients constantly ask for 'one more thing.' Without clear boundaries and documented scope, agencies end up doing 40% more work than they're paid for.",
          severity: 9,
          keywords: ["scope creep", "profit margins", "project management", "client expectations"],
          manumationAngle: "Automated scope tracking tied to project management. When deliverables exceed the SOW, the system flags it and generates a change order automatically.",
        },
        {
          category: "operations",
          title: "Client Reporting Overhead",
          description: "Building monthly reports for 20+ clients takes 40-60 hours per month. Each client wants a custom format, and pulling data from 5+ platforms per client is tedious.",
          severity: 8,
          keywords: ["client reporting", "analytics", "monthly reports", "data aggregation"],
          manumationAngle: "Automated report generation that pulls data from all platforms, generates narrative summaries using AI, and delivers branded reports on schedule.",
        },
        {
          category: "hiring",
          title: "Finding and Retaining Specialists",
          description: "Good SEO people, paid media buyers, and designers are expensive and in demand. Agencies lose talent to in-house roles that pay more and offer stability.",
          severity: 8,
          keywords: ["hiring", "talent retention", "specialists", "team building"],
          manumationAngle: "Build SOPs and systems that reduce dependency on individual specialists. When the process is documented and partially automated, new hires get productive faster.",
        },
        {
          category: "tech",
          title: "Campaign Attribution Confusion",
          description: "Proving which campaigns actually drove revenue is nearly impossible with multi-touch attribution. Clients question ROI, and agencies can't definitively prove their value.",
          severity: 8,
          keywords: ["attribution", "ROI", "campaign performance", "conversion tracking"],
          manumationAngle: "Unified tracking and attribution system that connects ad spend to actual revenue, giving both the agency and client clear visibility into what's working.",
        },
        {
          category: "operations",
          title: "Client Onboarding Takes Weeks",
          description: "New client onboarding involves gathering access to 10+ platforms, understanding brand guidelines, reviewing past campaigns, and setting up tracking. It often takes 2-4 weeks.",
          severity: 7,
          keywords: ["onboarding", "client setup", "access management", "brand guidelines"],
          manumationAngle: "Automated onboarding workflow with self-service access forms, automated platform setup checklists, and AI-assisted brand guideline extraction.",
        },
        {
          category: "sales",
          title: "Proposal Process is Time-Consuming",
          description: "Custom proposals for each prospect take 5-10 hours. Most agencies have no template system and recreate proposals from scratch, losing deals to faster competitors.",
          severity: 7,
          keywords: ["proposals", "sales process", "closing rate", "RFP"],
          manumationAngle: "AI-powered proposal generator that creates custom proposals from templates, pulling relevant case studies and pricing automatically based on the prospect's industry and needs.",
        },
        {
          category: "sales",
          title: "Retainer Churn is Unpredictable",
          description: "Clients leave after 3-6 months because they don't understand the value being delivered or because results take longer than expected. No early warning system exists.",
          severity: 8,
          keywords: ["churn", "client retention", "retainer", "lifetime value"],
          manumationAngle: "Automated health scoring system that tracks engagement, satisfaction signals, and results velocity. Flags at-risk accounts before the cancellation conversation.",
        },
        {
          category: "operations",
          title: "Internal Communication and Task Tracking",
          description: "With multiple clients, deadlines, and team members, things fall through the cracks. Slack messages get lost, Asana tasks get stale, and client requests disappear.",
          severity: 7,
          keywords: ["project management", "task tracking", "internal communication", "deadlines"],
          manumationAngle: "Centralized project management with automated task creation from client requests, deadline tracking with escalation, and daily digest summaries.",
        },
      ],
    },
    {
      name: "Real Estate Agents",
      slug: "real-estate-agents",
      description: "Residential and commercial real estate agents, teams, and small brokerages",
      targetPersona: "Real estate agent or team leader closing 20-100+ transactions annually",
      painPoints: [
        {
          category: "sales",
          title: "Lead Follow-Up Falls Through the Cracks",
          description: "The average agent has 50-200 leads in their pipeline but only contacts each one 1-2 times before giving up. 80% of sales happen after the 5th contact.",
          severity: 10,
          keywords: ["lead follow-up", "pipeline", "speed to lead", "nurturing"],
          manumationAngle: "Automated multi-channel follow-up sequences (text, email, voicemail drops) that nurture leads for months until they're ready to act, without the agent lifting a finger.",
        },
        {
          category: "operations",
          title: "Transaction Coordination Chaos",
          description: "Each deal involves 15-25 steps, multiple parties (lender, title, inspector, appraiser), and tight deadlines. One missed step can kill a deal.",
          severity: 9,
          keywords: ["transaction coordination", "closing process", "deadlines", "deal management"],
          manumationAngle: "Automated transaction pipeline that tracks every step, sends reminders to all parties, and escalates when deadlines are at risk.",
        },
        {
          category: "tech",
          title: "CRM Data Rot and Inconsistency",
          description: "Contact information goes stale fast. Agents have leads in their phone, email, CRM, and sticky notes. No single source of truth means missed opportunities.",
          severity: 7,
          keywords: ["CRM", "data management", "contact database", "data hygiene"],
          manumationAngle: "Centralized CRM with automated data enrichment, duplicate detection, and cross-platform sync so every contact is current and accessible.",
        },
        {
          category: "marketing",
          title: "Post-Close Client Nurture is Nonexistent",
          description: "After closing, most agents never contact the client again until they accidentally run into them. Meanwhile, that client refers friends to whoever they last heard from.",
          severity: 8,
          keywords: ["post-close", "client retention", "sphere of influence", "repeat business"],
          manumationAngle: "Automated post-close nurture: anniversary emails, market updates, home value reports, and seasonal check-ins that keep the agent top-of-mind for referrals.",
        },
        {
          category: "operations",
          title: "Showing Scheduling and Feedback Collection",
          description: "Coordinating showings across multiple listings, collecting buyer feedback, and reporting back to sellers is a time-consuming manual process.",
          severity: 6,
          keywords: ["showings", "scheduling", "buyer feedback", "listing management"],
          manumationAngle: "Automated showing scheduler with feedback surveys sent immediately after each showing, compiled into seller reports automatically.",
        },
        {
          category: "operations",
          title: "Commission Tracking and Accounting",
          description: "Tracking commissions across deals, splits with brokerages and teams, referral fees, and expenses requires manual spreadsheet work prone to errors.",
          severity: 6,
          keywords: ["commission", "accounting", "expenses", "financial tracking"],
          manumationAngle: "Automated commission calculator tied to the deal pipeline that tracks splits, referral fees, and expenses, providing real-time P&L visibility.",
        },
        {
          category: "marketing",
          title: "Social Media Content is Generic",
          description: "Agents post the same 'Just Listed' and 'Just Sold' content as everyone else. No strategy for differentiation, market commentary, or educational content.",
          severity: 7,
          keywords: ["social media", "content strategy", "personal brand", "differentiation"],
          manumationAngle: "AI-generated content calendar with market-specific insights, neighborhood guides, and educational content that positions the agent as a local expert.",
        },
        {
          category: "sales",
          title: "No Systematic Market Analysis Process",
          description: "Pulling CMAs and market analysis for clients takes 1-2 hours per property. Agents avoid doing them proactively because of the time investment.",
          severity: 6,
          keywords: ["CMA", "market analysis", "property valuation", "comparative analysis"],
          manumationAngle: "Automated market analysis generation using MLS data with AI-written narrative summaries, delivered proactively to sphere contacts to drive listing conversations.",
        },
      ],
    },
    {
      name: "Title Companies",
      slug: "title-companies",
      description: "Title insurance companies, settlement agencies, and escrow services handling residential and commercial closings",
      targetPersona: "Title company owner or branch manager processing 50-300 closings per month",
      painPoints: [
        {
          category: "operations",
          title: "Manual Document Chasing",
          description: "Every closing requires documents from 5-8 parties (buyer, seller, lender, agents, HOA). Staff spends hours daily emailing, calling, and following up on missing docs.",
          severity: 9,
          keywords: ["document management", "closing documents", "follow-up", "file completion"],
          manumationAngle: "Automated document request and follow-up system that tracks what's been received, sends reminders to the right parties, and escalates overdue items.",
        },
        {
          category: "operations",
          title: "Closing Timeline Communication Breakdowns",
          description: "All parties need constant updates on where the transaction stands. Without a centralized system, title companies field 20+ calls daily asking 'Where are we?'",
          severity: 8,
          keywords: ["status updates", "communication", "transaction timeline", "customer service"],
          manumationAngle: "Automated status portal where all parties can check real-time progress. Milestone notifications sent automatically as the file moves through each stage.",
        },
        {
          category: "operations",
          title: "Compliance and Regulatory Tracking",
          description: "TRID timelines, CFPB requirements, and state-specific regulations create a compliance minefield. Missing a single deadline can delay or kill a deal.",
          severity: 9,
          keywords: ["compliance", "TRID", "CFPB", "regulatory", "closing deadlines"],
          manumationAngle: "Automated compliance calendar tied to each file that tracks every regulatory deadline and triggers alerts before anything is missed.",
        },
        {
          category: "operations",
          title: "Title Search and Examination Delays",
          description: "Title searches can uncover liens, easements, or ownership issues that require additional research. Manual examination processes create bottlenecks.",
          severity: 7,
          keywords: ["title search", "examination", "liens", "encumbrances", "ownership"],
          manumationAngle: "Streamlined title search workflow with automated red-flag detection and templated resolution procedures for common issues.",
        },
        {
          category: "operations",
          title: "Fee Calculation and HUD/CD Errors",
          description: "Preparing Closing Disclosures and settlement statements with accurate fees, prorations, and adjustments is error-prone. Mistakes require re-disclosure and delay closing.",
          severity: 8,
          keywords: ["closing disclosure", "settlement statement", "fee calculation", "HUD"],
          manumationAngle: "Automated fee calculation engine with built-in validation rules that catches common errors before documents are generated.",
        },
        {
          category: "marketing",
          title: "No Systematic Agent Relationship Building",
          description: "Title companies depend on real estate agent referrals but have no system for nurturing those relationships beyond occasional lunches and drop-bys.",
          severity: 7,
          keywords: ["agent relationships", "referrals", "B2B marketing", "relationship management"],
          manumationAngle: "Automated agent nurture program: closing anniversary notifications, market data sharing, co-branded content, and systematic touchpoints.",
        },
        {
          category: "operations",
          title: "Post-Closing Follow-Up and Policy Delivery",
          description: "After closing, the policy needs to be delivered, recordings confirmed, and final documents distributed. This 'last mile' often gets deprioritized and delayed.",
          severity: 6,
          keywords: ["post-closing", "policy delivery", "recording", "document distribution"],
          manumationAngle: "Automated post-closing workflow that tracks recording confirmation, generates and delivers policies, and sends final document packages to all parties.",
        },
        {
          category: "hiring",
          title: "Closer and Processor Training Takes Months",
          description: "New closers need 3-6 months to become fully productive. Knowledge is tribal, processes are undocumented, and experienced staff are too busy to train properly.",
          severity: 7,
          keywords: ["training", "onboarding", "closer", "processor", "knowledge management"],
          manumationAngle: "Documented SOPs with AI-assisted training modules. New hires follow guided workflows that teach them the process while they're doing the work.",
        },
      ],
    },
    {
      name: "Small Business Owners",
      slug: "small-business-owners",
      description: "General small business owners across industries with 1-50 employees facing common operational challenges",
      targetPersona: "Business owner doing $250K-$5M in revenue, wearing multiple hats, feeling overwhelmed by daily operations",
      painPoints: [
        {
          category: "operations",
          title: "Wearing All the Hats",
          description: "Owner is the CEO, marketer, salesperson, HR department, and janitor. No dedicated roles means everything gets 60% attention and nothing gets 100%.",
          severity: 10,
          keywords: ["overwhelm", "wearing all hats", "delegation", "time management"],
          manumationAngle: "The Founder's Filter: identify everything on your plate, filter what only you can do vs. what can be delegated or automated, then build systems to handle the rest.",
        },
        {
          category: "hiring",
          title: "Hiring-Firing Roller Coaster",
          description: "Hire in panic when overwhelmed, fire when revenue dips. No documented roles, no onboarding system, no way to evaluate if someone is actually performing.",
          severity: 8,
          keywords: ["hiring", "firing", "employee management", "team building"],
          manumationAngle: "Build role scorecards with clear KPIs, documented SOPs for every position, and structured onboarding that gets new hires productive in weeks.",
        },
        {
          category: "operations",
          title: "Cash Flow Unpredictability",
          description: "Revenue spikes and dips with no forecasting. Invoices go out late, collections are inconsistent, and the owner can't plan beyond next month.",
          severity: 9,
          keywords: ["cash flow", "forecasting", "invoicing", "collections", "revenue"],
          manumationAngle: "Automated invoicing and collections pipeline with payment reminders, late fee automation, and AI-assisted cash flow forecasting based on pipeline data.",
        },
        {
          category: "operations",
          title: "No Documented Processes",
          description: "Everything lives in the owner's head. If they get sick, go on vacation, or get hit by a bus, the business grinds to a halt.",
          severity: 9,
          keywords: ["SOPs", "documentation", "processes", "business continuity"],
          manumationAngle: "SOP creation system that captures processes as they happen. Record a process once, turn it into a documented, delegatable procedure with checklists and accountability.",
        },
        {
          category: "tech",
          title: "Tech Stack Overwhelm and Shiny Object Syndrome",
          description: "Paying for 15 different tools, using 30% of each one's features, and constantly switching to the next 'best' solution. Data is fragmented across all of them.",
          severity: 7,
          keywords: ["tech stack", "software overload", "integration", "consolidation"],
          manumationAngle: "Tech stack audit and consolidation onto an integrated platform. Stop paying for 15 tools when one configured correctly does the work of 10.",
        },
        {
          category: "operations",
          title: "Time Management and Priority Confusion",
          description: "Every day feels urgent. No system for distinguishing what's actually important from what's just loud. The owner reacts to fires instead of building proactively.",
          severity: 8,
          keywords: ["time management", "priorities", "urgent vs important", "planning"],
          manumationAngle: "CEO Calendar Audit: reclaim 10+ hidden hours per week by eliminating, automating, or delegating tasks that don't require the owner's unique abilities.",
        },
        {
          category: "operations",
          title: "Delegation Fear and Control Issues",
          description: "The owner tried delegating before and it didn't work, so they pulled everything back. Now they're trapped doing $15/hour work because they don't trust anyone else.",
          severity: 9,
          keywords: ["delegation", "trust", "control", "micromanagement", "letting go"],
          manumationAngle: "The 5-Minute Delegation Rule: start with low-risk tasks, build trust through verification systems, and gradually expand until the business runs without you in every decision.",
        },
        {
          category: "sales",
          title: "Growth Plateau with No Clear Path Forward",
          description: "Revenue has been flat for 1-3 years. The owner works harder but gets the same results. They know something needs to change but don't know what.",
          severity: 8,
          keywords: ["growth plateau", "scaling", "stagnation", "breakthrough"],
          manumationAngle: "The 3-Phase Business Bottleneck Audit: map every process, identify the exact friction points preventing growth, and build a 90-day roadmap to break through.",
        },
      ],
    },
    {
      name: "Home Service Companies",
      slug: "home-service-companies",
      description: "HVAC, plumbing, electrical, roofing, landscaping, cleaning, and other home service businesses",
      targetPersona: "Home service business owner with 5-30 field technicians doing $500K-$5M in revenue",
      painPoints: [
        {
          category: "operations",
          title: "Scheduling and Dispatch Chaos",
          description: "Coordinating 10-20 technicians across 30+ daily jobs with varying skill levels, equipment needs, and geographic zones is a logistical nightmare.",
          severity: 9,
          keywords: ["scheduling", "dispatch", "route optimization", "field service"],
          manumationAngle: "Automated dispatch system with skill-based routing, geographic optimization, and real-time schedule adjustments when jobs run long or cancel.",
        },
        {
          category: "operations",
          title: "Estimate-to-Invoice Gaps",
          description: "Jobs get completed but invoices don't go out for days or weeks. Change orders happen in the field but never make it into the billing system.",
          severity: 8,
          keywords: ["invoicing", "billing", "estimates", "change orders", "collections"],
          manumationAngle: "Mobile-first workflow where technicians close out jobs on-site, triggering automatic invoice generation and payment collection before they leave.",
        },
        {
          category: "marketing",
          title: "Review Management is Reactive",
          description: "The company has 50 reviews while competitors have 500. No system to ask happy customers for reviews, and negative reviews go unanswered for weeks.",
          severity: 8,
          keywords: ["reviews", "reputation management", "Google reviews", "online reputation"],
          manumationAngle: "Automated review request triggered after job completion, with sentiment detection that routes negative feedback to management before it goes public.",
        },
        {
          category: "sales",
          title: "Seasonal Demand Swings",
          description: "Slammed in summer/winter, dead in spring/fall (HVAC example). No system for smoothing revenue across seasons or building recurring maintenance revenue.",
          severity: 7,
          keywords: ["seasonal demand", "maintenance plans", "recurring revenue", "demand smoothing"],
          manumationAngle: "Automated maintenance agreement program with seasonal outreach campaigns that build predictable recurring revenue to smooth out demand cycles.",
        },
        {
          category: "operations",
          title: "Crew Communication and Job Notes",
          description: "Information about the job doesn't make it from the office to the field or from one technician visit to the next. Customers repeat themselves every time.",
          severity: 7,
          keywords: ["crew communication", "job notes", "field service", "customer history"],
          manumationAngle: "Centralized job history with mobile access. Every tech sees the full customer and property history before arriving, with notes from previous visits.",
        },
        {
          category: "operations",
          title: "Parts and Inventory Tracking",
          description: "Technicians carry parts on their trucks with no real-time inventory system. Parts go missing, reorders are late, and jobs get delayed waiting for materials.",
          severity: 6,
          keywords: ["inventory", "parts management", "supply chain", "truck stock"],
          manumationAngle: "Mobile inventory management with usage tracking per job, automatic reorder triggers, and truck stock auditing.",
        },
        {
          category: "marketing",
          title: "No Follow-Up for Repeat Business",
          description: "Customer gets their AC fixed and never hears from the company again until it breaks next time. Meanwhile, a competitor's mailer arrives the following spring.",
          severity: 8,
          keywords: ["follow-up", "repeat business", "customer retention", "seasonal marketing"],
          manumationAngle: "Automated customer lifecycle marketing: seasonal maintenance reminders, equipment age-based replacement campaigns, and anniversary check-ins.",
        },
        {
          category: "sales",
          title: "Pricing Inconsistency Across Technicians",
          description: "Different techs quote different prices for the same job. No flat-rate pricing book, no standardized estimating process, leading to customer confusion and margin erosion.",
          severity: 7,
          keywords: ["pricing", "flat rate", "estimating", "profit margins"],
          manumationAngle: "Standardized digital price book with automated estimate generation. Every tech quotes the same price for the same job, with built-in margin protection.",
        },
      ],
    },
  ];
}

function scheduleWeeklyResearch() {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
  nextMonday.setHours(6, 0, 0, 0);

  const msUntilNextMonday = nextMonday.getTime() - now.getTime();

  setTimeout(() => {
    runWeeklyResearch();
    setInterval(runWeeklyResearch, 7 * 24 * 60 * 60 * 1000);
  }, msUntilNextMonday);

  logger.info(`Weekly pain points research scheduled for ${nextMonday.toISOString()}`);
}

async function runWeeklyResearch() {
  try {
    const industries = await db
      .select()
      .from(industryProfiles)
      .where(eq(industryProfiles.status, "active"));

    if (industries.length === 0) return;

    const [run] = await db
      .insert(researchRuns)
      .values({
        industriesSearched: industries.map(i => i.slug),
        status: "running",
        log: [{ timestamp: new Date().toISOString(), message: "Automated weekly research started", level: "info" }],
      })
      .returning();

    await executeResearchRun(run.id, industries);
    logger.info("Weekly pain points research completed", { runId: run.id });
  } catch (error) {
    logger.error("Weekly pain points research failed", { error });
  }
}

scheduleWeeklyResearch();

export default router;
