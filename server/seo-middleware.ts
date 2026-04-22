import { Request, Response, NextFunction } from "express";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { blogPosts } from "../client/src/data/blogPosts";

const BASE_URL = "https://keanonbiz.com";

const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'ref', 'source'
];

function normalizeCanonicalUrl(pathname: string, queryString?: string): string {
  let cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  
  if (queryString) {
    const params = new URLSearchParams(queryString);
    TRACKING_PARAMS.forEach(param => params.delete(param));
    const remainingParams = params.toString();
    if (remainingParams) {
      return `${BASE_URL}${cleanPath}?${remainingParams}`;
    }
  }
  
  return cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath}`;
}

interface PageMeta {
  title: string;
  description: string;
  image: string;
  type: "website" | "article";
  canonical: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const staticPageMeta: Record<string, Partial<PageMeta>> = {
  "/": {
    title: "Jeremy Kean | Business Coach & AI Automation Expert | KeanOnBiz",
    description: "Strategic coaching and AI-powered automation for insurance agencies and business owners. 35+ years experience, 100+ businesses helped. Transform your operations with The Manumation Method.",
    image: "/manumation-book-cover-new.png",
  },
  "/blog": {
    title: "Blog | Business Coaching & AI Automation Insights | KeanOnBiz",
    description: "Practical insights on business coaching, AI automation, delegation, and the Manumation Method. Real strategies for business owners who want to work smarter.",
    image: "/manumation-book-cover-new.png",
  },
  "/book": {
    title: "The Manumation Method Book | Jeremy Kean | KeanOnBiz",
    description: "Discover The Manumation Method - the strategic fusion of human ingenuity, AI Agents, and automated systems that transforms business experiences.",
    image: "/manumation-book-cover-new.png",
  },
  "/assessment": {
    title: "Free Mini Audit — Discover What's Holding You Back | KeanOnBiz",
    description: "Take the free 5-minute Mini Audit to score your business across 4 critical categories: Founder Dependency, Systems Maturity, Growth Readiness, and Automation Potential.",
    image: "/manumation-book-cover-new.png",
  },
  "/manumation-audit": {
    title: "The Manumation Audit — Deep Business Diagnostic | KeanOnBiz",
    description: "A comprehensive $2,500 business audit that identifies your exact revenue leaks, builds a custom automation blueprint, and gives you a 90-day implementation roadmap. Includes 1-on-1 strategy session with Jeremy Kean.",
    image: "/jeremy-about-photo.webp",
  },
  "/insurance": {
    title: "Insurance Agency Coaching | Revenue Leak Calculator | KeanOnBiz",
    description: "Find out how much your insurance agency is losing every month. Take the free Revenue Leak Calculator to identify gaps in team performance, sales process, and operations.",
    image: "/manumation-book-cover-new.png",
  },
  "/insurance-coaching": {
    title: "Insurance Agency Coaching | Grow Revenue & Build Systems | KeanOnBiz",
    description: "Strategic coaching for insurance agency owners. Fix your pipeline, automate renewals, build a team that runs without you, and break through your revenue ceiling. 35+ years experience.",
    image: "/jeremy-about-photo.webp",
  },
  "/business-automation": {
    title: "Business Automation Coaching | The Manumation Method | KeanOnBiz",
    description: "Systematize first, automate second. The Manumation Method helps business owners build operations that run without them. 35+ years experience, 100+ businesses transformed.",
    image: "/manumation-book-cover-new.png",
  },
  "/faq": {
    title: "Frequently Asked Questions | Business Coaching & AI Automation | KeanOnBiz",
    description: "Answers to common questions about business coaching, the Manumation Method, AI automation, insurance agency coaching, and getting started with Jeremy Kean.",
    image: "/manumation-book-cover-new.png",
  },
  "/founders-filter": {
    title: "The Founder's Filter | Delegation Tool | KeanOnBiz",
    description: "Free interactive tool to identify tasks you should delegate. Filter what to keep, what to hand off soon, and what to delegate immediately.",
    image: "/manumation-book-cover-new.png",
  },
  "/portfolio": {
    title: "The Build Gallery | AI-Powered Projects & Case Studies | KeanOnBiz",
    description: "Explore real projects built with AI-powered automation. Case studies, build logs, and results from the Zenoflo product suite helping businesses automate, delegate, and scale.",
    image: "/manumation-book-cover-new.png",
  },
  "/newsletter": {
    title: "Newsletter | Weekly Business Insights | KeanOnBiz",
    description: "Join the KeanOnBiz newsletter for weekly insights on business coaching, AI automation, and practical strategies for growth.",
    image: "/manumation-book-cover-new.png",
  },
  "/coaching-truth": {
    title: "The Truth About Coaching | Jeremy Kean | KeanOnBiz",
    description: "What most coaches won't tell you about business coaching. Honest insights from 35 years of experience.",
    image: "/manumation-book-cover-new.png",
  },
  "/become-a-coach": {
    title: "Become a Business Coach | Training Program | KeanOnBiz",
    description: "Learn how to become a business coach with Jeremy Kean's proven methodology and mentorship program.",
    image: "/manumation-book-cover-new.png",
  },
  "/micropod": {
    title: "MicroPod Podcast | Business Coaching Episodes | KeanOnBiz",
    description: "Listen to the MicroPod podcast by Jeremy Kean. Short-form episodes on business coaching, AI automation, delegation, and the Manumation Method for busy entrepreneurs.",
    image: "/manumation-book-cover-new.png",
  },
  "/terms": {
    title: "Terms of Service | KeanOnBiz",
    description: "Terms of service for KeanOnBiz coaching and automation services.",
    image: "/manumation-book-cover-new.png",
  },
  "/privacy": {
    title: "Privacy Policy | KeanOnBiz",
    description: "Privacy policy for KeanOnBiz. How we collect, use, and protect your information.",
    image: "/manumation-book-cover-new.png",
  },
  "/about": {
    title: "About Jeremy Kean | Business Coach & AI Automation Expert | KeanOnBiz",
    description: "Meet Jeremy Kean — 35+ years of business experience, 13 brands created, 100+ businesses helped. Business coach, AI automation expert, and author of The Manumation Method.",
    image: "/jeremy-about-photo.webp",
  },
  "/contact": {
    title: "Contact Jeremy Kean | Book a Call or Get in Touch | KeanOnBiz",
    description: "Get in touch with Jeremy Kean for business coaching, AI automation consulting, or partnership opportunities. Book a call, send an email, or connect on social media.",
    image: "/jeremy-about-photo.webp",
  },
  "/jeremys-calendar": {
    title: "Book a Call with Jeremy Kean | KeanOnBiz",
    description: "Schedule a strategy call with Jeremy Kean to discuss your business goals and how coaching can help.",
    image: "/jeremy-about-photo.webp",
  },
  "/jeremys-calendar-strategy": {
    title: "Strategy Session | Book with Jeremy Kean | KeanOnBiz",
    description: "Book a strategy session with Jeremy Kean to develop a clear plan for your business growth.",
    image: "/jeremy-about-photo.webp",
  },
  "/jeremys-calendar-coaching": {
    title: "Coaching Session | Book with Jeremy Kean | KeanOnBiz",
    description: "Schedule a 1:1 coaching session with Jeremy Kean for personalized business guidance.",
    image: "/jeremy-about-photo.webp",
  },
  "/jeremys-calendar-intro": {
    title: "Intro Call | Meet Jeremy Kean | KeanOnBiz",
    description: "Schedule an introductory call with Jeremy Kean to see if coaching is right for you.",
    image: "/jeremy-about-photo.webp",
  },
};

function getPageMeta(pathname: string, queryString?: string): PageMeta {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const canonical = normalizeCanonicalUrl(cleanPath, queryString);
  
  if (cleanPath.startsWith("/blog/topic/") && cleanPath.length > 12) {
    const pillar = cleanPath.replace("/blog/topic/", "");
    const pillarMeta: Record<string, { title: string; description: string }> = {
      "pain": { title: "Business Pain Points & Bottlenecks | KeanOnBiz", description: "Honest talk about the problems keeping business owners stuck: bottlenecks, wasted time, team friction, and the fires that never stop. From 35+ years of experience." },
      "hope": { title: "Business Solutions & How-To Guides | KeanOnBiz", description: "Actionable solutions for business owners: automation guides, delegation frameworks, tech stacks, and systems that actually work. Step-by-step from 35+ years of experience." },
      "philosophy": { title: "The Manumation Philosophy | KeanOnBiz", description: "The principles behind the Manumation Method: manual first, automation second, and the mindset shifts that transform how business owners lead and scale." },
      "proof": { title: "Case Studies & Results | KeanOnBiz", description: "Real results from real businesses: case studies, before-and-after transformations, and data proving what works. No theory — just proof." },
      "vision": { title: "Business Vision & Future | KeanOnBiz", description: "The future of business ownership: our mission to help 100 business owners break free, what's coming next, and the vision for a business that runs without you." },
    };
    const pMeta = pillarMeta[pillar];
    if (pMeta) {
      return {
        title: pMeta.title,
        description: pMeta.description,
        image: "/manumation-book-cover-new.png",
        type: "website",
        canonical,
      };
    }
  }

  if (cleanPath.startsWith("/blog/") && cleanPath.length > 6) {
    const slug = cleanPath.replace("/blog/", "");
    const post = blogPosts.find(p => p.slug === slug);
    
    if (post) {
      return {
        title: post.metaTitle || `${post.title} | KeanOnBiz`,
        description: post.metaDescription || post.excerpt,
        image: post.featuredImage.startsWith("http") ? post.featuredImage : post.featuredImage,
        type: "article",
        canonical,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        author: post.author.name,
      };
    }
  }
  
  if (cleanPath.startsWith("/portfolio/") && cleanPath.length > 11) {
    const slug = cleanPath.replace("/portfolio/", "");
    return {
      title: `${slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} | Zenoflo Portfolio | KeanOnBiz`,
      description: `Case study for ${slug.replace(/-/g, " ")} - built with AI-powered automation by Zenoflo.`,
      image: "/manumation-book-cover-new.png",
      type: "website",
      canonical,
    };
  }
  
  if (cleanPath.startsWith("/admin") || cleanPath === "/dev") {
    return {
      title: "Admin | KeanOnBiz",
      description: "Admin area",
      image: "/manumation-book-cover-new.png",
      type: "website",
      canonical,
      noindex: true,
    };
  }
  
  const staticMeta = staticPageMeta[cleanPath];
  if (staticMeta) {
    return {
      title: staticMeta.title || "KeanOnBiz",
      description: staticMeta.description || "",
      image: staticMeta.image || "/manumation-book-cover-new.png",
      type: "website",
      canonical,
    };
  }
  
  return {
    title: "Jeremy Kean | Business Coach & AI Automation Expert | KeanOnBiz",
    description: "Strategic coaching and AI-powered automation for insurance agencies and business owners.",
    image: "/manumation-book-cover-new.png",
    type: "website",
    canonical,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createSeoMiddleware(staticPath: string) {
  let htmlTemplate: string | null = null;
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/assets") ||
      req.path.includes(".") ||
      req.path === "/sitemap.xml" ||
      req.path === "/sitemap_index.xml" ||
      req.path === "/robots.txt" ||
      req.path === "/podcast.xml" ||
      req.path === "/llms.txt" ||
      req.path === "/llms-full.txt"
    ) {
      return next();
    }
    
    const indexPath = path.join(staticPath, "index.html");
    if (!existsSync(indexPath)) {
      return next();
    }
    
    if (!htmlTemplate) {
      htmlTemplate = readFileSync(indexPath, "utf-8");
    }
    
    const meta = getPageMeta(req.path, req.query ? new URLSearchParams(req.query as Record<string, string>).toString() : undefined);
    const imageUrl = meta.image.startsWith("http") ? meta.image : `${BASE_URL}${meta.image}`;
    
    let html = htmlTemplate;
    
    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${escapeHtml(meta.title)}</title>`
    );
    
    html = html.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`
    );
    
    html = html.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${meta.canonical}" />`
    );
    
    if (meta.noindex) {
      html = html.replace(
        /<meta name="robots" content="[^"]*" \/>/,
        `<meta name="robots" content="noindex, nofollow" />`
      );
      html = html.replace(
        /<meta name="googlebot" content="[^"]*" \/>/,
        `<meta name="googlebot" content="noindex, nofollow" />`
      );
    }
    
    html = html.replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${meta.canonical}" />`
    );
    html = html.replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escapeHtml(meta.title.replace(" | KeanOnBiz", ""))}" />`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escapeHtml(meta.description)}" />`
    );
    html = html.replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${imageUrl}" />`
    );
    html = html.replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${meta.type}" />`
    );
    
    html = html.replace(
      /<meta name="twitter:url" content="[^"]*" \/>/,
      `<meta name="twitter:url" content="${meta.canonical}" />`
    );
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escapeHtml(meta.title.replace(" | KeanOnBiz", ""))}" />`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`
    );
    html = html.replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${imageUrl}" />`
    );
    
    if (meta.type === "article" && meta.publishedTime) {
      const articleMeta = `
    <meta property="article:published_time" content="${meta.publishedTime}" />
    <meta property="article:modified_time" content="${meta.modifiedTime || meta.publishedTime}" />
    <meta property="article:author" content="${escapeHtml(meta.author || "Jeremy Kean")}" />`;
      
      html = html.replace(
        /<meta property="og:locale" content="en_US" \/>/,
        `<meta property="og:locale" content="en_US" />${articleMeta}`
      );
    }
    
    res.set("Content-Type", "text/html");
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(html);
  };
}
