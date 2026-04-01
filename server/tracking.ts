import { Router } from "express";
import { logger } from "./logger";
import { z } from "zod";
import { createRateLimiter } from "./rate-limiter";

const router = Router();

const trackingRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  concurrentLimit: 5,
});

const assessmentTrackSchema = z.object({
  email: z.string().email().max(255),
  score: z.number().min(0).max(100),
  scoreLabel: z.string().max(50),
  answers: z.record(z.string(), z.string().max(100)),
  recommendedCall: z.string().max(50),
});

const pageViewSchema = z.object({
  sessionId: z.string().max(100),
  page: z.string().max(500),
  title: z.string().max(200),
  referrer: z.string().max(500).optional(),
  duration: z.number().min(0).max(86400).optional(),
});

const blogReadSchema = z.object({
  sessionId: z.string().max(100),
  slug: z.string().max(200),
  title: z.string().max(500),
  readPercentage: z.number().min(0).max(100),
  timeSpent: z.number().min(0).max(86400),
});

const newsletterSubscribeSchema = z.object({
  email: z.string().email().max(255),
  source: z.string().max(100),
  sessionId: z.string().max(100).optional(),
});

const workshopCompleteSchema = z.object({
  email: z.string().email().max(255).optional(),
  sessionId: z.string().max(100),
  taskCount: z.number().min(0).max(1000),
  delegateNowCount: z.number().min(0).max(1000),
  delegateSoonCount: z.number().min(0).max(1000),
});

function getRateLimitKey(req: any): string {
  return req.ip || req.headers["x-forwarded-for"] || "unknown";
}

router.post("/assessment", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = trackingRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = assessmentTrackSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const data = result.data;
    
    logger.info("Assessment completed", {
      endpoint: "/api/track/assessment",
      email: data.email,
      score: data.score,
      scoreLabel: data.scoreLabel,
      recommendedCall: data.recommendedCall,
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Assessment tracking failed", { endpoint: "/api/track/assessment" }, error as Error);
    res.status(500).json({ error: "Tracking failed" });
  }
});

router.post("/pageview", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = trackingRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = pageViewSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const data = result.data;
    
    logger.debug("Page view tracked", {
      endpoint: "/api/track/pageview",
      sessionId: data.sessionId,
      page: data.page,
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Pageview tracking failed", { endpoint: "/api/track/pageview" }, error as Error);
    res.status(500).json({ error: "Tracking failed" });
  }
});

router.post("/blog-read", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = trackingRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = blogReadSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const data = result.data;
    
    logger.info("Blog read tracked", {
      endpoint: "/api/track/blog-read",
      sessionId: data.sessionId,
      slug: data.slug,
      readPercentage: data.readPercentage,
      timeSpent: data.timeSpent,
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Blog read tracking failed", { endpoint: "/api/track/blog-read" }, error as Error);
    res.status(500).json({ error: "Tracking failed" });
  }
});

router.post("/newsletter-subscribe", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = trackingRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = newsletterSubscribeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const data = result.data;
    
    logger.info("Newsletter subscription tracked", {
      endpoint: "/api/track/newsletter-subscribe",
      email: data.email,
      source: data.source,
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Newsletter tracking failed", { endpoint: "/api/track/newsletter-subscribe" }, error as Error);
    res.status(500).json({ error: "Tracking failed" });
  }
});

router.post("/workshop-complete", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = trackingRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = workshopCompleteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid data" });
    }
    
    const data = result.data;
    
    logger.info("Workshop completion tracked", {
      endpoint: "/api/track/workshop-complete",
      email: data.email,
      sessionId: data.sessionId,
      taskCount: data.taskCount,
      delegateNowCount: data.delegateNowCount,
      delegateSoonCount: data.delegateSoonCount,
    });
    
    res.json({ success: true });
  } catch (error) {
    logger.error("Workshop tracking failed", { endpoint: "/api/track/workshop-complete" }, error as Error);
    res.status(500).json({ error: "Tracking failed" });
  }
});

export default router;
