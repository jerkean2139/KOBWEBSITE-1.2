import crypto from "node:crypto";
import { db } from "./db";
import { apiSessionTokens } from "@shared/schema";
import { eq, lt } from "drizzle-orm";
import { logger } from "./logger";

const ADMIN_KEY = process.env.NEWSLETTER_ADMIN_KEY;
const KIANNA_KEY = process.env.KIANNA_ADMIN_KEY;
const AUDREY_KEY = process.env.AUDREY_ADMIN_KEY;

export function getValidAdminKeys(): string[] {
  const keys: string[] = [];
  if (ADMIN_KEY) keys.push(ADMIN_KEY);
  if (KIANNA_KEY) keys.push(KIANNA_KEY);
  if (AUDREY_KEY) keys.push(AUDREY_KEY);
  return keys;
}

export function isValidAdminKey(token: string): boolean {
  const validKeys = getValidAdminKeys();
  for (const key of validKeys) {
    if (constantTimeCompare(token, key)) {
      return true;
    }
  }
  return false;
}

export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export function hashAdminKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function createSessionToken(adminKey: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  await db.insert(apiSessionTokens).values({
    token,
    adminKeyHash: hashAdminKey(adminKey),
    expiresAt,
  });
  
  return token;
}

export async function validateSseToken(token: string): Promise<boolean> {
  try {
    const [session] = await db
      .select()
      .from(apiSessionTokens)
      .where(eq(apiSessionTokens.token, token));
    
    if (!session) return false;
    
    if (new Date() > session.expiresAt) {
      await db.delete(apiSessionTokens).where(eq(apiSessionTokens.token, token));
      return false;
    }
    
    await db
      .update(apiSessionTokens)
      .set({ usedAt: new Date() })
      .where(eq(apiSessionTokens.token, token));
    
    return true;
  } catch (error) {
    logger.error("Error validating session token", {}, error as Error);
    return false;
  }
}

export async function deleteSessionToken(token: string): Promise<void> {
  try {
    await db.delete(apiSessionTokens).where(eq(apiSessionTokens.token, token));
  } catch (error) {
    logger.error("Error cleaning up session token", {}, error as Error);
  }
}

export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await db.delete(apiSessionTokens).where(lt(apiSessionTokens.expiresAt, new Date()));
  } catch (error) {
    logger.error("Error cleaning up expired tokens", {}, error as Error);
  }
}

export function createAuthMiddleware() {
  const failedAuthAttempts = new Map<string, { count: number; resetTime: number }>();
  const MAX_FAILED_ATTEMPTS = 5;
  const AUTH_WINDOW_MS = 15 * 60 * 1000;

  function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempt = failedAuthAttempts.get(ip);
    if (!attempt || now > attempt.resetTime) return true;
    return attempt.count < MAX_FAILED_ATTEMPTS;
  }

  function recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const attempt = failedAuthAttempts.get(ip);
    if (!attempt || now > attempt.resetTime) {
      failedAuthAttempts.set(ip, { count: 1, resetTime: now + AUTH_WINDOW_MS });
    } else {
      attempt.count++;
    }
  }

  function clearFailedAttempts(ip: string): void {
    failedAuthAttempts.delete(ip);
  }

  return function authMiddleware(req: any, res: any, next: any) {
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: "Too many failed authentication attempts. Try again later." });
    }
    
    const authHeader = req.headers.authorization;
    const providedKey = authHeader?.replace("Bearer ", "");
    
    if (!providedKey || !isValidAdminKey(providedKey)) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    clearFailedAttempts(clientIp);
    req.authenticatedKey = providedKey;
    next();
  };
}

export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (!isValidAdminKey(token)) {
    return res.status(403).json({ error: "Invalid token" });
  }
  req.authenticatedKey = token;
  next();
}

setInterval(cleanupExpiredTokens, 5 * 60 * 1000);
