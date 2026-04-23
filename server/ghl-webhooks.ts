import { Router } from "express";
import { logger } from "./logger";
import { z } from "zod";
import { createRateLimiter } from "./rate-limiter";

const router = Router();

const webhookRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  concurrentLimit: 10,
});

const ghlWebhookSchema = z.object({
  type: z.string().max(100).optional(),
  locationId: z.string().max(100).optional(),
  contact: z.object({
    id: z.string().max(100).optional(),
    email: z.string().max(255).optional(),
    phone: z.string().max(50).optional(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    tags: z.array(z.string().max(100)).max(50).optional(),
  }).optional(),
  appointment: z.object({
    id: z.string().max(100).optional(),
    calendarId: z.string().max(100).optional(),
    contactId: z.string().max(100).optional(),
    status: z.string().max(50).optional(),
    startTime: z.string().max(50).optional(),
    endTime: z.string().max(50).optional(),
    title: z.string().max(500).optional(),
  }).optional(),
  opportunity: z.object({
    id: z.string().max(100).optional(),
    name: z.string().max(200).optional(),
    status: z.string().max(50).optional(),
    pipelineId: z.string().max(100).optional(),
    stageId: z.string().max(100).optional(),
    monetaryValue: z.number().optional(),
  }).optional(),
}).passthrough();

function getRateLimitKey(req: any): string {
  return `ghl_${req.ip || req.headers["x-forwarded-for"] || "unknown"}`;
}

router.post("/contact-created", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = webhookRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = ghlWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid GHL webhook payload", { endpoint: "/api/ghl-webhooks/contact-created" });
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    const payload = result.data;
    
    logger.info("GHL Webhook: Contact created", {
      endpoint: "/api/ghl-webhooks/contact-created",
      contactId: payload.contact?.id,
      email: payload.contact?.email,
    });
    
    res.json({ received: true });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/contact-created" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.post("/appointment-booked", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = webhookRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = ghlWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid GHL webhook payload", { endpoint: "/api/ghl-webhooks/appointment-booked" });
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    const payload = result.data;
    
    logger.info("GHL Webhook: Appointment booked", {
      endpoint: "/api/ghl-webhooks/appointment-booked",
      appointmentId: payload.appointment?.id,
      calendarId: payload.appointment?.calendarId,
      status: payload.appointment?.status,
      startTime: payload.appointment?.startTime,
    });
    
    res.json({ received: true });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/appointment-booked" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.post("/appointment-status-changed", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = webhookRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = ghlWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid GHL webhook payload", { endpoint: "/api/ghl-webhooks/appointment-status-changed" });
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    const payload = result.data;
    
    logger.info("GHL Webhook: Appointment status changed", {
      endpoint: "/api/ghl-webhooks/appointment-status-changed",
      appointmentId: payload.appointment?.id,
      status: payload.appointment?.status,
    });
    
    res.json({ received: true });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/appointment-status-changed" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.post("/opportunity-status-changed", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = webhookRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = ghlWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid GHL webhook payload", { endpoint: "/api/ghl-webhooks/opportunity-status-changed" });
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    const payload = result.data;
    
    logger.info("GHL Webhook: Opportunity status changed", {
      endpoint: "/api/ghl-webhooks/opportunity-status-changed",
      opportunityId: payload.opportunity?.id,
      status: payload.opportunity?.status,
      stage: payload.opportunity?.stageId,
    });
    
    res.json({ received: true });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/opportunity-status-changed" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

router.post("/contact-tag-added", async (req, res) => {
  const rateLimitKey = getRateLimitKey(req);
  const { allowed, reason } = webhookRateLimiter(rateLimitKey);
  
  if (!allowed) {
    return res.status(429).json({ error: reason || "Rate limit exceeded" });
  }
  
  try {
    const result = ghlWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid GHL webhook payload", { endpoint: "/api/ghl-webhooks/contact-tag-added" });
      return res.status(400).json({ error: "Invalid payload" });
    }
    
    const payload = result.data;
    
    logger.info("GHL Webhook: Contact tag added", {
      endpoint: "/api/ghl-webhooks/contact-tag-added",
      contactId: payload.contact?.id,
      tags: payload.contact?.tags,
    });
    
    res.json({ received: true });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/contact-tag-added" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

const assessmentWebhookSchema = z.object({
  full_name: z.string().max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50),
  lead_score: z.number(),
  lead_score_label: z.string().max(100),
  recommended_call_type: z.string().max(100),
  assessment_source: z.string().max(100),
  assessment_date: z.string().max(100),
  contact: z.object({
    audit_business_type: z.string().max(100).optional(),
  }).optional(),
}).passthrough();

const assessmentWebhookRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  concurrentLimit: 5,
});

router.post("/assessment-completed", async (req, res) => {
  try {
    const rateLimitKey = req.ip || "unknown";
    const { allowed, reason } = assessmentWebhookRateLimiter(rateLimitKey);
    if (!allowed) {
      return res.status(429).json({ error: "Rate limited", reason });
    }

    const result = assessmentWebhookSchema.safeParse(req.body);
    if (!result.success) {
      logger.warn("Invalid assessment webhook payload", { endpoint: "/api/ghl-webhooks/assessment-completed" });
      return res.status(400).json({ error: "Invalid payload" });
    }

    const webhookResponse = await fetch(
      "https://services.leadconnectorhq.com/hooks/5yufDyfhuTKFx8nCQCP6/webhook-trigger/2cc0fbc2-7908-42f1-9abe-e78b8d5457d7",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      }
    );

    logger.info("GHL Webhook: Assessment completed", {
      endpoint: "/api/ghl-webhooks/assessment-completed",
      email: result.data.email,
      lead_score: result.data.lead_score,
      ghl_status: webhookResponse.status,
    });

    res.json({ success: true, ghlStatus: webhookResponse.status });
  } catch (error) {
    logger.error("GHL webhook error", { endpoint: "/api/ghl-webhooks/assessment-completed" }, error as Error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Generic form submission webhook — used by styled GHLForm component
const formSubmitSchema = z.object({
  formId: z.string().max(100),
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().default(""),
  source: z.string().max(100).optional().default("keanonbiz_website"),
});

router.post("/form-submit", async (req, res) => {
  try {
    const rateLimitKey = req.ip || "unknown";
    const { allowed, reason } = assessmentWebhookRateLimiter(rateLimitKey);
    if (!allowed) {
      return res.status(429).json({ error: "Rate limited", reason });
    }

    const result = formSubmitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const data = result.data;

    // Forward to GHL webhook for workflow automation
    try {
      await fetch(
        "https://services.leadconnectorhq.com/hooks/5yufDyfhuTKFx8nCQCP6/webhook-trigger/2cc0fbc2-7908-42f1-9abe-e78b8d5457d7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            submission_date: new Date().toISOString(),
          }),
        }
      );
    } catch (webhookError) {
      logger.error("GHL webhook failed for form-submit", {}, webhookError as Error);
    }

    logger.info("GHL form submitted via webhook", {
      endpoint: "/api/ghl-webhooks/form-submit",
      formId: data.formId,
      email: data.email,
      source: data.source,
    });

    res.json({ success: true });
  } catch (error) {
    logger.error("Form submit error", { endpoint: "/api/ghl-webhooks/form-submit" }, error as Error);
    res.status(500).json({ error: "Submit failed" });
  }
});

export default router;
