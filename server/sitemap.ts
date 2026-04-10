import { Router } from "express";
import { db } from "./db";
import { blogPosts, portfolioProjects } from "@shared/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const router = Router();

const BASE_URL = "https://keanonbiz.com";

const STATIC_ROUTES = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/blog", changefreq: "daily", priority: "0.9" },
  { loc: "/blog/topic/pain", changefreq: "weekly", priority: "0.9" },
  { loc: "/blog/topic/hope", changefreq: "weekly", priority: "0.9" },
  { loc: "/blog/topic/philosophy", changefreq: "weekly", priority: "0.9" },
  { loc: "/blog/topic/proof", changefreq: "weekly", priority: "0.9" },
  { loc: "/blog/topic/vision", changefreq: "weekly", priority: "0.9" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/contact", changefreq: "monthly", priority: "0.8" },
  { loc: "/book", changefreq: "weekly", priority: "0.9" },
  { loc: "/assessment", changefreq: "monthly", priority: "0.9" },
  { loc: "/insurance", changefreq: "monthly", priority: "0.9" },
  { loc: "/insurance-coaching", changefreq: "monthly", priority: "0.9" },
  { loc: "/business-automation", changefreq: "monthly", priority: "0.9" },
  { loc: "/faq", changefreq: "monthly", priority: "0.8" },
  { loc: "/founders-filter", changefreq: "monthly", priority: "0.9" },
  { loc: "/portfolio", changefreq: "weekly", priority: "0.8" },
  { loc: "/jeremys-calendar", changefreq: "monthly", priority: "0.8" },
  { loc: "/jeremys-calendar-strategy", changefreq: "monthly", priority: "0.7" },
  { loc: "/jeremys-calendar-coaching", changefreq: "monthly", priority: "0.7" },
  { loc: "/jeremys-calendar-intro", changefreq: "monthly", priority: "0.7" },
  { loc: "/newsletter", changefreq: "weekly", priority: "0.8" },
  { loc: "/coaching-truth", changefreq: "monthly", priority: "0.8" },
  { loc: "/become-a-coach", changefreq: "weekly", priority: "0.7" },
  { loc: "/micropod", changefreq: "weekly", priority: "0.7" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
];

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Redirect old sitemap URL to new one
router.get("/sitemap_index.xml", (_req, res) => {
  res.redirect(301, "/sitemap.xml");
});

// Redirect old Waterfall Workshop URLs to The Founder's Filter
router.get("/waterfall-workshop", (_req, res) => {
  res.redirect(301, "/founders-filter");
});
router.get("/waterfall-workshop/start", (_req, res) => {
  res.redirect(301, "/founders-filter/start");
});

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const today = formatDate(new Date());

    const publishedPosts = await db
      .select({
        slug: blogPosts.slug,
        updatedAt: blogPosts.updatedAt,
        featuredImage: blogPosts.featuredImage,
        title: blogPosts.title,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));

    const publishedProjects = await db
      .select({
        slug: portfolioProjects.slug,
        updatedAt: portfolioProjects.updatedAt,
        featuredImage: portfolioProjects.featuredImage,
        title: portfolioProjects.title,
      })
      .from(portfolioProjects)
      .where(eq(portfolioProjects.status, "completed"));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    for (const route of STATIC_ROUTES) {
      xml += `  <url>
    <loc>${BASE_URL}${route.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    }

    for (const post of publishedPosts) {
      const lastmod = post.updatedAt ? formatDate(post.updatedAt) : today;
      xml += `  <url>
    <loc>${BASE_URL}/blog/${escapeXml(post.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;
      
      if (post.featuredImage) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(post.featuredImage)}</image:loc>
      <image:title>${escapeXml(post.title || "Blog post image")}</image:title>
    </image:image>`;
      }
      xml += `
  </url>
`;
    }

    for (const project of publishedProjects) {
      const lastmod = project.updatedAt ? formatDate(project.updatedAt) : today;
      xml += `  <url>
    <loc>${BASE_URL}/portfolio/${escapeXml(project.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`;
      
      if (project.featuredImage) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(project.featuredImage)}</image:loc>
      <image:title>${escapeXml(project.title || "Portfolio project image")}</image:title>
    </image:image>`;
      }
      xml += `
  </url>
`;
    }

    xml += `</urlset>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.send(xml);
  } catch (error) {
    logger.error("Failed to generate sitemap", { endpoint: "/sitemap.xml" }, error as Error);
    res.status(500).send("Failed to generate sitemap");
  }
});

router.get("/robots.txt", (_req, res) => {
  const robots = `# robots.txt for KeanOnBiz
# https://keanonbiz.com/

User-agent: *
Allow: /

# Block admin and utility paths
Disallow: /admin/
Disallow: /api/
Disallow: /dev
Disallow: /404
Disallow: /founders-filter/start

# Block common non-content paths
Disallow: /_next/
Disallow: /assets/
Disallow: /*.json$

# Allow important resources
Allow: /manifest.json
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.webp
Allow: /*.svg

# AI Crawler Access - Allow AI assistants to index content for better AEO/GEO
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Amazonbot
Allow: /

# Sitemap location
Sitemap: https://keanonbiz.com/sitemap.xml

# LLM Content Index
# See https://llmstxt.org/ for the llms.txt standard
# llms.txt: https://keanonbiz.com/llms.txt
# llms-full.txt: https://keanonbiz.com/llms-full.txt

# Crawl-delay for polite crawling
Crawl-delay: 1
`;

  res.set("Content-Type", "text/plain");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(robots);
});

router.get("/llms.txt", async (_req, res) => {
  let publishedPostsSlugs: { slug: string; title: string }[] = [];
  try {
    publishedPostsSlugs = await db
      .select({ slug: blogPosts.slug, title: blogPosts.title })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));
  } catch {}

  const staticBlogEntries = (await import("../client/src/data/blogPosts")).blogPosts;
  const allTitlesAndUrls = [
    ...staticBlogEntries.map(p => ({ title: p.title, url: `${BASE_URL}/blog/${p.slug}` })),
    ...publishedPostsSlugs
      .filter(p => !staticBlogEntries.find(s => s.slug === p.slug))
      .map(p => ({ title: p.title, url: `${BASE_URL}/blog/${p.slug}` })),
  ];

  const llmsTxt = `# KeanOnBiz - Jeremy Kean's Business Coaching & AI Automation Platform
# https://keanonbiz.com

> KeanOnBiz is the home of Jeremy Kean, a business coach and AI automation strategist with 35+ years of experience helping 100+ business owners transform their operations. The site covers business coaching, the Manumation Method (human + AI + automation), insurance agency growth, delegation frameworks, and practical AI tools for small businesses.

## About Jeremy Kean
Jeremy Kean is a business coach specializing in helping overwhelmed business owners build systems that run without them. His approach combines human ingenuity, AI agents, and automated workflows — a methodology he calls "The Manumation Method." He has particular expertise in insurance agency operations and GoHighLevel automation.

## Core Topics & Expertise
- The Manumation Method: Strategic fusion of human talent, AI agents, and automation
- Business Operations: SOPs, systems, processes, and workflow optimization
- AI & Automation: Practical AI tools, GoHighLevel, AI agents for small business
- Insurance Agency Growth: Agency-specific automation, CRM, lead generation, retention
- Business Mindset: Leadership, delegation psychology, breaking bottleneck patterns
- Time & Delegation: Delegation frameworks, time audits, productivity systems

## Key Pages
- Home: ${BASE_URL}/
- Blog: ${BASE_URL}/blog
- The Manumation Method Book: ${BASE_URL}/book
- Insurance Agency Coaching: ${BASE_URL}/insurance-coaching
- Business Automation Coaching: ${BASE_URL}/business-automation
- Revenue Leak Calculator: ${BASE_URL}/insurance
- Bottleneck Audit: ${BASE_URL}/assessment
- The Founder's Filter (Free Delegation Tool): ${BASE_URL}/founders-filter
- Portfolio & Build Gallery: ${BASE_URL}/portfolio
- FAQ: ${BASE_URL}/faq
- Book a Strategy Call: ${BASE_URL}/jeremys-calendar
- Newsletter: ${BASE_URL}/newsletter

## Content Pillars
- Pain: ${BASE_URL}/blog/topic/pain
- Hope: ${BASE_URL}/blog/topic/hope
- Philosophy: ${BASE_URL}/blog/topic/philosophy
- Proof: ${BASE_URL}/blog/topic/proof
- Vision: ${BASE_URL}/blog/topic/vision

## Blog Posts
${allTitlesAndUrls.map(p => `- [${p.title}](${p.url})`).join("\n")}

## Contact & Booking
- Strategy Session: ${BASE_URL}/jeremys-calendar-strategy
- Coaching Session: ${BASE_URL}/jeremys-calendar-coaching
- Intro Call: ${BASE_URL}/jeremys-calendar-intro

## Sitemap
- ${BASE_URL}/sitemap.xml
`;

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(llmsTxt);
});

router.get("/llms-full.txt", async (_req, res) => {
  const staticBlogEntries = (await import("../client/src/data/blogPosts")).blogPosts;

  const sections = staticBlogEntries.map(p => {
    const excerpt = p.content.slice(0, 800).replace(/\n{3,}/g, "\n\n");
    return `### ${p.title}
URL: ${BASE_URL}/blog/${p.slug}
Author: ${p.author.name}
Category: ${p.category}
Pillar: ${p.pillar || "general"}
Tags: ${p.tags.join(", ")}
Published: ${p.publishedAt}

${excerpt}...

FAQs:
${p.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
`;
  });

  const fullTxt = `# KeanOnBiz - Full Content Index
# https://keanonbiz.com
# This file provides expanded content for AI systems to better understand and cite this website.

> Jeremy Kean is a business coach and AI automation strategist. This file contains summaries of all published content on KeanOnBiz.

${sections.join("\n---\n\n")}
`;

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(fullTxt);
});

export default router;
