import { Router, json } from "express";
import { storage } from "./storage";
import OpenAI from "openai";
import crypto from "node:crypto";
import { workshopDonnaLimiter } from "./rate-limiter";
import { validateBody, workshopSessionUpdateSchema, workshopDonnaMessageSchema } from "./validation";
import { logger } from "./logger";

const router = Router();
router.use(json());

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const ANONYMOUS_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000;

interface AnonymousToken {
  id: string;
  created: number;
  expires: number;
}

function generateAnonymousToken(): AnonymousToken {
  const now = Date.now();
  return {
    id: `anon_${crypto.randomBytes(16).toString("hex")}`,
    created: now,
    expires: now + ANONYMOUS_TOKEN_EXPIRY,
  };
}

function signToken(token: AnonymousToken): string {
  const payload = JSON.stringify(token);
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64");
}

function verifyToken(signedToken: string): AnonymousToken | null {
  try {
    const decoded = Buffer.from(signedToken, "base64").toString("utf-8");
    const lastDotIndex = decoded.lastIndexOf(".");
    if (lastDotIndex === -1) return null;
    
    const payload = decoded.slice(0, lastDotIndex);
    const signature = decoded.slice(lastDotIndex + 1);
    
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("hex");
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    
    const token: AnonymousToken = JSON.parse(payload);
    
    if (Date.now() > token.expires) {
      return null;
    }
    
    return token;
  } catch {
    return null;
  }
}

function getOrCreateAnonymousUser(req: any, res: any): string | null {
  const cookieToken = req.cookies?.["workshop_session"];
  
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) {
      return verified.id;
    }
  }
  
  const newToken = generateAnonymousToken();
  const signedToken = signToken(newToken);
  
  res.cookie("workshop_session", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ANONYMOUS_TOKEN_EXPIRY,
    path: "/api/workshop",
  });
  
  return newToken.id;
}

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

const DONNA_SYSTEM_PROMPT = `You are Donna, a warm, patient, and focused AI assistant helping business owners through The Founder's Filter. Your goal is to help them identify tasks they need to stop doing themselves.

Your personality:
- Warm but direct - you don't waste their time
- Patient with overwhelmed founders
- Encouraging but realistic
- You understand the mental burden of carrying too much

The workshop has these stages:
1. Brain Dump - Help them get everything out of their head
2. Sorting - Guide them to categorize tasks into: "Only I Can Do", "Delegate Soon", "Delegate NOW"
3. Review - Help them pick their top 1-3 priority items from "Delegate NOW"
4. Summary - Celebrate their progress and explain next steps

Key prompts you use:
- "What's one thing you keep telling yourself you'll delegate but haven't?"
- "If you had to take a week off tomorrow, what would break?"
- "What task do you hate doing but keep doing anyway?"
- "Which of these truly requires YOUR specific expertise?"
- "What could a trained person handle 80% of?"

Be concise. Keep responses to 2-3 sentences max unless they need more guidance.`;

router.get("/sessions", async (req: any, res: any) => {
  try {
    const userId = getOrCreateAnonymousUser(req, res);
    if (!userId) {
      return res.status(400).json({ message: "Failed to establish session" });
    }
    const sessions = await storage.getWorkshopSessions(userId);
    res.json(sessions);
  } catch (error) {
    logger.error("Error fetching workshop sessions", { endpoint: "/api/workshop/sessions" }, error as Error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

router.get("/sessions/:id", async (req: any, res: any) => {
  try {
    const userId = getOrCreateAnonymousUser(req, res);
    if (!userId) {
      return res.status(400).json({ message: "Failed to establish session" });
    }
    const session = await storage.getWorkshopSession(parseInt(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(session);
  } catch (error) {
    logger.error("Error fetching workshop session", { endpoint: "/api/workshop/sessions/:id" }, error as Error);
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

router.post("/sessions", async (req: any, res: any) => {
  try {
    const userId = getOrCreateAnonymousUser(req, res);
    if (!userId) {
      return res.status(400).json({ message: "Failed to establish session" });
    }
    
    // Privacy consent is required
    if (!req.body?.acceptPrivacy) {
      return res.status(400).json({ message: "Privacy consent is required" });
    }
    
    await storage.upsertUser({
      id: userId,
      email: null,
      firstName: "Workshop",
      lastName: "User",
      profileImageUrl: null,
    });
    
    const session = await storage.createWorkshopSession({
      userId,
      title: `Workshop - ${new Date().toLocaleDateString()}`,
      status: "in_progress",
      currentStep: "brain_dump",
      brainDumpItems: [],
      onlyICanDoItems: [],
      delegateSoonItems: [],
      delegateNowItems: [],
      priorityTasks: [],
      donnaConversation: [{
        role: "donna" as const,
        message: "Welcome to The Founder's Filter! I'm Donna, and I'm here to help you separate the work that truly needs YOU from everything that should flow to someone else. Let's start with a brain dump. What's one thing you keep telling yourself you'll delegate but haven't?",
        timestamp: new Date().toISOString(),
      }],
      privacyConsentAt: new Date(),
    });
    res.json(session);
  } catch (error) {
    logger.error("Error creating workshop session", { endpoint: "/api/workshop/sessions" }, error as Error);
    res.status(500).json({ message: "Failed to create session" });
  }
});

router.patch("/sessions/:id", async (req: any, res: any) => {
  try {
    const userId = getOrCreateAnonymousUser(req, res);
    if (!userId) {
      return res.status(400).json({ message: "Failed to establish session" });
    }
    const session = await storage.getWorkshopSession(parseInt(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const validation = validateBody(workshopSessionUpdateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const updated = await storage.updateWorkshopSession(parseInt(req.params.id), validation.data as any);
    res.json(updated);
  } catch (error) {
    logger.error("Error updating workshop session", { endpoint: "/api/workshop/sessions/:id" }, error as Error);
    res.status(500).json({ message: "Failed to update session" });
  }
});

router.post("/sessions/:id/donna", async (req: any, res: any) => {
  try {
    const userId = getOrCreateAnonymousUser(req, res);
    if (!userId) {
      return res.status(400).json({ message: "Failed to establish session" });
    }

    const rateCheck = workshopDonnaLimiter(`donna:${userId}`);
    if (!rateCheck.allowed) {
      return res.status(429).json({ 
        message: rateCheck.reason || "Too many requests. Please wait before asking Donna again." 
      });
    }

    const session = await storage.getWorkshopSession(parseInt(req.params.id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const validation = validateBody(workshopDonnaMessageSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }
    
    const { message, currentStep } = validation.data;
    const conversation = session.donnaConversation || [];

    const contextInfo = {
      currentStep,
      brainDumpCount: (session.brainDumpItems || []).length,
      onlyICanDoCount: (session.onlyICanDoItems || []).length,
      delegateSoonCount: (session.delegateSoonItems || []).length,
      delegateNowCount: (session.delegateNowItems || []).length,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DONNA_SYSTEM_PROMPT },
        { role: "system", content: `Current context: ${JSON.stringify(contextInfo)}` },
        ...conversation.map((msg: any) => ({
          role: msg.role === "donna" ? "assistant" : "user",
          content: msg.message,
        })) as any[],
        { role: "user", content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const donnaResponse = response.choices[0]?.message?.content || "Let's keep going. What else is on your mind?";

    const updatedConversation = [
      ...conversation,
      { role: "user" as const, message, timestamp: new Date().toISOString() },
      { role: "donna" as const, message: donnaResponse, timestamp: new Date().toISOString() },
    ];

    await storage.updateWorkshopSession(parseInt(req.params.id), {
      donnaConversation: updatedConversation,
    });

    res.json({ message: donnaResponse });
  } catch (error) {
    logger.error("Error getting Donna response", { endpoint: "/api/workshop/sessions/:id/donna" }, error as Error);
    res.status(500).json({ message: "Failed to get response" });
  }
});

export default router;
