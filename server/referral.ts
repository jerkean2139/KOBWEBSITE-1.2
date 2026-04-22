import { Router } from "express";
import { z } from "zod";
import { logger } from "./logger";

const router = Router();

// Referral codes — hard-coded MVP. Add codes here as needed.
// Format: code → { partner name, optional expiration }
const REFERRAL_CODES = new Map<string, { partner: string; expires?: string }>([
  ["BETH2026", { partner: "Beth Prince" }],
  ["RYAN2026", { partner: "Ryan Templeton" }],
  ["JASON2026", { partner: "Jason Elkins" }],
  ["PARTNER", { partner: "General Partner" }],
]);

const validateSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase().trim()),
});

router.post("/validate", (req, res) => {
  try {
    const { code } = validateSchema.parse(req.body);
    const entry = REFERRAL_CODES.get(code);

    if (!entry) {
      res.json({ valid: false });
      return;
    }

    // Check expiration if set
    if (entry.expires && new Date(entry.expires) < new Date()) {
      res.json({ valid: false });
      return;
    }

    logger.info("Referral code validated", { code, partner: entry.partner });
    res.json({ valid: true, partnerName: entry.partner });
  } catch {
    res.json({ valid: false });
  }
});

export default router;
