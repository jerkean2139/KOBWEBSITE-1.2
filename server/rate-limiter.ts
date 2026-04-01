interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  concurrentLimit?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const activeRequests = new Map<string, number>();

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, concurrentLimit = 2 } = config;

  return function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number; reason?: string } {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (activeRequests.get(key) && (activeRequests.get(key) || 0) >= concurrentLimit) {
      return { 
        allowed: false, 
        reason: `Too many concurrent requests. Max ${concurrentLimit} simultaneous requests allowed.` 
      };
    }

    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
        lastRequest: now,
      });
      return { allowed: true };
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return { 
        allowed: false, 
        retryAfter,
        reason: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      };
    }

    entry.count++;
    entry.lastRequest = now;
    return { allowed: true };
  };
}

export function trackConcurrentRequest(key: string): void {
  const current = activeRequests.get(key) || 0;
  activeRequests.set(key, current + 1);
}

export function releaseConcurrentRequest(key: string): void {
  const current = activeRequests.get(key) || 0;
  if (current <= 1) {
    activeRequests.delete(key);
  } else {
    activeRequests.set(key, current - 1);
  }
}

export const aiGenerationLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,
  concurrentLimit: 2,
});

export const emailSendLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 20,
  concurrentLimit: 1,
});

export const workshopDonnaLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 10,
  concurrentLimit: 1,
});

setInterval(() => {
  const now = Date.now();
  const keys = Array.from(rateLimitStore.keys());
  for (const key of keys) {
    const entry = rateLimitStore.get(key);
    if (entry && now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
