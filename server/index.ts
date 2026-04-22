import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import newsletterRouter from "./newsletter";
import contentStudioRouter from "./content-studio";
import portfolioRouter from "./portfolio";
import sitemapRouter from "./sitemap";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import workshopRouter from "./workshop";
import trackingRouter from "./tracking";
import ghlWebhooksRouter from "./ghl-webhooks";
import painPointsRouter from "./pain-points";
import micropodRouter, { handlePodcastRss } from "./micropod";
import insuranceAssessmentRouter from "./insurance-assessment";
import referralRouter from "./referral";
import miniAuditRouter from "./mini-audit";
import { logger, withRequestLogging } from "./logger";
import { createSeoMiddleware } from "./seo-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable gzip compression
  app.use(compression({ level: 6 }));

  // Parse JSON bodies
  app.use(express.json({ limit: "2mb" }));
  
  // Parse cookies for workshop session tokens
  app.use(cookieParser());

  // Request logging
  app.use(withRequestLogging);

  // Health check endpoint for Railway
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Workshop API routes - BEFORE auth setup so session middleware doesn't block anonymous users
  app.use("/api/workshop", workshopRouter);

  // Portfolio API routes - PUBLIC (before auth setup)
  app.use("/api/portfolio", portfolioRouter);

  // Tracking API routes - PUBLIC (no auth required)
  app.use("/api/track", trackingRouter);

  // Pain Points API routes - PUBLIC reads, auth required for writes
  app.use("/api/pain-points", painPointsRouter);

  // MicroPod Studio API routes
  app.use("/api/micropod", micropodRouter);

  // Podcast RSS feed (public)
  app.get("/podcast.xml", handlePodcastRss);

  // GHL Webhook routes - PUBLIC (called by GoHighLevel)
  app.use("/api/ghl-webhooks", ghlWebhooksRouter);

  // Insurance Assessment API routes - PUBLIC
  app.use("/api/insurance-assessment", insuranceAssessmentRouter);

  // Referral validation - PUBLIC
  app.use("/api/referral", referralRouter);

  // Mini Audit API - PUBLIC
  app.use("/api/mini-audit", miniAuditRouter);

  // Set up authentication (applies session middleware to routes after this)
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      logger.error("Error fetching user", { endpoint: "/api/auth/user" }, error as Error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Content Studio API routes (must be before newsletter to avoid newsletter auth middleware intercepting)
  app.use("/api/content-studio", contentStudioRouter);

  // Newsletter API routes
  app.use("/api", newsletterRouter);

  // Security & performance headers
  app.use((req, res, next) => {
    res.set({
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Resource-Policy": "same-origin",
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://assets.calendly.com https://link.msgsndr.com https://widgets.leadconnectorhq.com https://beta.leadconnectorhq.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://www.google-analytics.com https://api.openai.com https://api.anthropic.com https://*.leadconnectorhq.com wss://*.leadconnectorhq.com",
        "frame-src 'self' https://link.msgsndr.com https://assets.calendly.com https://www.youtube.com https://player.vimeo.com https://*.leadconnectorhq.com",
        "media-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'"
      ].join("; ")
    });
    
    // Cache control based on file type
    if (req.path.match(/\.(js|css|woff2|woff|ttf|eot)$/)) {
      res.set("Cache-Control", "public, max-age=31536000, immutable");
    } else if (req.path.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/)) {
      res.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else if (req.path.endsWith(".html") || req.path === "/") {
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=604800");
    }
    
    next();
  });

  // RUM endpoint for Web Vitals (accepts beacons, doesn't need to do anything)
  app.post("/rum", express.json(), (req, res) => {
    res.status(204).send();
  });

  // Dynamic sitemap and robots.txt (must be before static file serving)
  app.use(sitemapRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "..", "dist", "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // SEO middleware - injects correct meta tags for each route (server-side)
  // Must be before static middleware to handle SPA routes properly
  app.use(createSeoMiddleware(staticPath));

  app.use("/uploads", express.static(path.resolve("public/uploads")));
  app.use(express.static(staticPath));

  const port = parseInt(process.env.PORT || "3001", 10);

  server.listen(port, "0.0.0.0", () => {
    logger.info(`Server started`, { port, env: process.env.NODE_ENV || "development" });
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server", {}, error);
  process.exit(1);
});
