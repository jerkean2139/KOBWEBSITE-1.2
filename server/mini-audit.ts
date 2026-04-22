import { Router } from "express";
import { z } from "zod";
import { logger } from "./logger";
import { createRateLimiter } from "./rate-limiter";

const router = Router();

const submitRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  concurrentLimit: 5,
});

const submitSchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().default(""),
  lead_score: z.number().min(0).max(100),
  lead_score_label: z.string().max(100),
  recommended_call_type: z.string().max(50),
  category_scores: z.record(z.string(), z.number()).optional(),
  answers: z.record(z.string(), z.string()).optional(),
});

router.post("/submit", async (req, res) => {
  try {
    const rateLimitKey = req.ip || "unknown";
    const { allowed, reason } = submitRateLimiter(rateLimitKey);
    if (!allowed) {
      return res.status(429).json({ error: "Rate limited", reason });
    }

    const result = submitSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid mini-audit payload", { endpoint: "/api/mini-audit/submit" });
      return res.status(400).json({ error: "Invalid payload" });
    }

    const data = result.data;

    // Trigger GHL webhook for workflow automation
    try {
      const webhookResponse = await fetch(
        "https://services.leadconnectorhq.com/hooks/5yufDyfhuTKFx8nCQCP6/webhook-trigger/2cc0fbc2-7908-42f1-9abe-e78b8d5457d7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            assessment_source: "keanonbiz_mini_audit",
            assessment_date: new Date().toISOString(),
            category_scores_json: data.category_scores ? JSON.stringify(data.category_scores) : undefined,
          }),
        }
      );

      logger.info("Mini Audit submitted", {
        endpoint: "/api/mini-audit/submit",
        email: data.email,
        lead_score: data.lead_score,
        ghl_status: webhookResponse.status,
      });
    } catch (webhookError) {
      logger.error("GHL webhook failed for mini-audit", { endpoint: "/api/mini-audit/submit" }, webhookError as Error);
    }

    // Track internally
    try {
      // Reuse existing tracking infrastructure if available
      logger.info("Mini Audit completed", {
        endpoint: "/api/mini-audit/submit",
        email: data.email,
        score: data.lead_score,
        label: data.lead_score_label,
        category_scores: data.category_scores,
      });
    } catch {
      // Non-critical
    }

    res.json({ success: true });
  } catch (error) {
    logger.error("Mini audit submit error", { endpoint: "/api/mini-audit/submit" }, error as Error);
    res.status(500).json({ error: "Submit failed" });
  }
});

export default router;
