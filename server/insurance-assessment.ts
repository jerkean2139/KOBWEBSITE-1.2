import { Router } from "express";
import rateLimit from "express-rate-limit";
import { logger } from "./logger";

const router = Router();

const captureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/capture", captureLimiter, async (req, res) => {
  try {
    const {
      email,
      leakage,
      potential,
      annualRecovery,
      costSaved,
      revenueGained,
      hoursRecovered,
      categoryBreakdown,
      answers,
    } = req.body;

    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    logger.info("Insurance assessment capture", {
      email: sanitizedEmail,
      leakage,
      potential,
      annualRecovery,
    });

    const ghlFormData = new URLSearchParams();
    ghlFormData.append("email", sanitizedEmail);
    ghlFormData.append("formId", "insurance_revenue_leak_calculator");
    ghlFormData.append("assessment_source", "revenue_leak_calculator");
    ghlFormData.append("assessment_date", new Date().toISOString());
    ghlFormData.append("monthly_leakage", String(leakage || 0));
    ghlFormData.append("monthly_recovery", String(potential || 0));
    ghlFormData.append("annual_recovery", String(annualRecovery || 0));
    ghlFormData.append("cost_saved", String(costSaved || 0));
    ghlFormData.append("revenue_gained", String(revenueGained || 0));
    ghlFormData.append("hours_recovered", String(hoursRecovered || 0));

    if (categoryBreakdown && typeof categoryBreakdown === "object") {
      Object.entries(categoryBreakdown).forEach(([cat, val]) => {
        const key = `category_${cat.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
        ghlFormData.append(key, String(Math.round(val as number)));
      });
    }

    if (answers && typeof answers === "object") {
      Object.entries(answers).forEach(([qId, val]) => {
        ghlFormData.append(`q${qId}`, String(val));
      });
    }

    let ghlSuccess = false;
    try {
      const ghlResp = await fetch(
        "https://services.leadconnectorhq.com/hooks/formSubmit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: ghlFormData.toString(),
          signal: AbortSignal.timeout(5000),
        }
      );
      if (ghlResp.ok) {
        ghlSuccess = true;
        logger.info("GHL form submission successful", { email: sanitizedEmail });
      } else {
        logger.warn("GHL form submission returned non-2xx", {
          email: sanitizedEmail,
          status: ghlResp.status,
        });
      }
    } catch (ghlError) {
      logger.warn("GHL form submission failed", {
        email: sanitizedEmail,
        error: (ghlError as Error).message,
      });
    }

    res.json({ success: true, ghlCaptured: ghlSuccess });
  } catch (error) {
    logger.error("Insurance assessment capture failed", {}, error as Error);
    res.status(500).json({ error: "Failed to capture assessment" });
  }
});

router.post("/email-results", captureLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    logger.info("Insurance assessment email results requested", {
      email: email.trim().toLowerCase(),
    });

    res.json({ success: true });
  } catch (error) {
    logger.error("Insurance assessment email results failed", {}, error as Error);
    res.status(500).json({ error: "Failed to send results" });
  }
});

export default router;
