# Ultimate SEO/AEO/GEO Setup Instructions for Replit Projects

## Use This in Your Initial Build Prompt

Copy this section into your Replit Agent prompt when starting a new website project:

---

### CRITICAL SEO/AEO/GEO REQUIREMENTS

This website MUST be built with enterprise-grade search optimization from day one. Implement ALL of the following:

#### 1. Server-Side Meta Tag Injection (NON-NEGOTIABLE)

Since Replit builds Single Page Applications (SPAs), you MUST create server-side middleware that injects correct meta tags BEFORE serving HTML. Without this, Google sees homepage meta tags on every page.

**Create `server/seo-middleware.ts`** that:
- Intercepts all HTML requests before static file serving
- Reads the route path and injects page-specific meta tags
- Handles: `<title>`, `<meta description>`, `<link rel="canonical">`, Open Graph tags, Twitter cards
- Returns `noindex, nofollow` for admin/API routes
- Adds article schema for blog posts (published_time, modified_time, author)

**Middleware order in Express:**
```
1. API routes
2. SEO middleware (injects meta tags)
3. Static file serving
```

#### 2. Dynamic Sitemap Generation

Create `/sitemap.xml` endpoint that:
- Queries database for published content (blog posts, products, pages)
- Only includes pages that actually exist (no 404s)
- Uses correct `<lastmod>` dates from database
- Includes image sitemap tags for featured images
- Sets appropriate priority (homepage 1.0, blog 0.8, etc.)

Create `/robots.txt` endpoint that:
- Allows all crawlers by default
- Blocks: /admin/*, /api/*, /dev/*, any internal tools
- Points to sitemap: `Sitemap: https://yourdomain.com/sitemap.xml`
- Add `sitemap_index.xml` redirect if migrating from old sitemap

**AI Crawler Access (AEO/GEO Critical):**
```
# Allow AI assistants to index content for better AEO/GEO
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
```
Note: Some sites may want to `Disallow` to prevent AI training data usage.

#### 3. Canonical URL Strategy

Every page MUST have a unique canonical URL:
- Homepage: `https://domain.com/`
- Blog listing: `https://domain.com/blog`
- Blog post: `https://domain.com/blog/[slug]`
- Product: `https://domain.com/products/[slug]`
- NEVER have two pages with the same canonical
- Remove trailing slashes except for homepage

**Canonical URL Normalization:**
Strip tracking parameters from canonical URLs:
```typescript
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'ref', 'source'
];

function normalizeCanonicalUrl(path: string): string {
  const url = new URL(path, BASE_URL);
  TRACKING_PARAMS.forEach(param => url.searchParams.delete(param));
  const cleanPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
  const queryString = url.searchParams.toString();
  return queryString ? `${BASE_URL}${cleanPath}?${queryString}` : `${BASE_URL}${cleanPath}`;
}
```

**Pagination Handling:**
- `/blog?page=2` → canonical should point to `/blog` with `<link rel="prev">` / `<link rel="next">`
- WWW vs non-WWW: Enforce one version consistently via redirect rules

#### 4. Structured Data (Schema.org JSON-LD)

Add to homepage `<head>`:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization", // or "LocalBusiness", "ProfessionalService"
  "name": "Business Name",
  "url": "https://domain.com",
  "logo": "https://domain.com/logo.png",
  "description": "...",
  "founder": { "@type": "Person", "name": "...", "jobTitle": "..." },
  "sameAs": ["https://linkedin.com/...", "https://twitter.com/..."]
}
```

Add to blog posts:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-15",
  "image": "https://domain.com/blog-image.jpg",
  "publisher": { "@type": "Organization", "name": "...", "logo": {...} }
}
```

Add FAQPage schema if page has FAQ section:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": { "@type": "Answer", "text": "Answer text" }
    }
  ]
}
```

Add BreadcrumbList for navigation hierarchy.

**Video Schema for Rich Results:**
If pages contain videos, add VideoObject schema:
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video Title",
  "description": "Video description for search results",
  "thumbnailUrl": "https://domain.com/video-thumb.jpg",
  "uploadDate": "2024-01-15",
  "contentUrl": "https://domain.com/video.mp4",
  "embedUrl": "https://youtube.com/embed/VIDEO_ID",
  "duration": "PT10M30S"
}
```
Why: Video carousels dominate SERPs in 2024-2025.

**Service Schema for Businesses:**
```json
{
  "@type": "Service",
  "serviceType": "Business Coaching",
  "provider": { "@type": "Organization", "name": "..." },
  "areaServed": { "@type": "Country", "name": "United States" },
  "offers": {
    "@type": "Offer",
    "price": "Contact for pricing",
    "priceCurrency": "USD"
  }
}
```

#### 5. Core Web Vitals Optimization

**LCP (Largest Contentful Paint < 2.5s):**
- Preload hero images: `<link rel="preload" as="image" href="..." fetchpriority="high">`
- Use WebP/AVIF formats with fallbacks
- Lazy load below-fold images: `loading="lazy"`
- Use proper image dimensions to prevent layout shift

**CLS (Cumulative Layout Shift < 0.1):**
- Always set width/height on images
- Reserve space for dynamic content
- No font flashing: preload critical fonts

**INP (Interaction to Next Paint < 200ms):**
- Defer non-critical JavaScript
- Use `loading="lazy"` for iframes
- Debounce user input handlers

#### 6. Technical SEO Checklist

**Page Speed:**
- Enable gzip/brotli compression
- Cache static assets: `Cache-Control: public, max-age=31536000, immutable`
- Use CDN for static files
- Minify CSS/JS in production

**HTTP/2 Preconnect & DNS-Prefetch Hints:**
Add to `<head>` to reduce DNS lookup time for third-party resources:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
<link rel="dns-prefetch" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://widgets.leadconnectorhq.com" />
<link rel="preconnect" href="https://link.msgsndr.com" />
```

**Security Headers (Trust Signals):**
Google considers security as a ranking factor. Add these headers:
```typescript
app.use((req, res, next) => {
  res.set({
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ..."
  });
  next();
});
```
Test at: https://securityheaders.com - Target: A+ grade

**Accessibility:**
- All images have descriptive alt text
- Proper heading hierarchy (one H1 per page)
- Skip navigation link for screen readers
- ARIA labels on interactive elements

**Mobile:**
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Responsive design (no horizontal scroll)
- Touch targets minimum 48x48px
- Font size minimum 16px

#### 7. AEO (Answer Engine Optimization) for AI Assistants

Structure content so AI assistants (ChatGPT, Claude, Perplexity) can extract answers:

**Content Format:**
- Lead with a direct answer in first paragraph
- Use definition-style formatting: "X is..." or "The purpose of X is..."
- Include concise bullet points for key facts
- Add FAQ sections with question/answer format
- Use tables for comparative data

**Entity Optimization:**
- Clearly state WHO the business/person is
- Define WHAT services/products are offered
- Specify WHERE (location/service area)
- Explain WHY this solution is different

**Structured Summaries:**
- Add `<article>` tags around main content
- Use semantic HTML (`<main>`, `<section>`, `<aside>`)
- Include meta description that answers the primary query

#### 8. GEO (Generative Engine Optimization) for AI Search

Optimize for AI-powered search engines (Google SGE, Bing Chat, Perplexity):

**Citation Optimization:**
- Include authoritative statements AI can cite
- Add statistics with sources
- Use quotable sentences (10-30 words)
- Create definitive statements: "The best way to..." or "The key to..."

**Expertise Signals (E-E-A-T):**
- Author bio with credentials on every article
- "About" page with verifiable experience
- Link to authoritative external sources
- Include case studies with specific numbers

**Enhanced E-E-A-T Schema:**
Add credentials and trust signals to Person schema:
```json
{
  "@type": "Person",
  "name": "Author Name",
  "jobTitle": "Business Coach & Expert",
  "sameAs": ["https://linkedin.com/in/author", "https://twitter.com/author"],
  "knowsAbout": ["Topic 1", "Topic 2", "Topic 3"],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Experience",
      "name": "35+ Years Business Leadership"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Author",
      "name": "Author of Published Book"
    }
  ],
  "award": "Helped 100+ businesses"
}
```

**Entity Salience Scoring:**
- Primary entity (business name): 1-2% keyword density
- Secondary entities (products/services): 0.5-1%
- Use variations (synonyms) to avoid keyword stuffing

**Content Depth:**
- Cover topics comprehensively (2000+ words for pillar content)
- Answer related questions within the same article
- Use internal linking between related content
- Create topic clusters with pillar pages

**Freshness Signals:**
- Display "Last updated" date on content
- Actually update content regularly
- Add current year references where relevant
- Remove outdated information

#### 9. Meta Tag Templates

**Homepage:**
```html
<title>Brand Name | Primary Keyword | What You Do</title>
<meta name="description" content="[Value proposition in 155 chars]. [Social proof]. [CTA hint]." />
```

**Blog Post:**
```html
<title>How to [Achieve Result] | Brand Name</title>
<meta name="description" content="Learn [specific benefit]. [What reader will discover]. [Expertise signal]." />
```

**Product/Service Page:**
```html
<title>[Product Name] - [Key Benefit] | Brand Name</title>
<meta name="description" content="[Product description]. [Key feature]. [Who it's for]. [Price/CTA if applicable]." />
```

#### 10. Required File Structure

```
/server
  /seo-middleware.ts    # Server-side meta injection
  /sitemap.ts           # Dynamic XML sitemap
  
/client
  /index.html           # Base HTML with default meta (server replaces)
  /components
    /SEO.tsx            # Client-side meta updates (for SPA navigation)
    
/public
  /robots.txt           # (or serve dynamically)
  /manifest.json        # PWA manifest
  /favicon.ico
  /og-image.png         # Default Open Graph image (1200x630)
```

#### 11. Testing Before Launch

Run these checks:
1. Google PageSpeed Insights - Target 90+ mobile
2. Google Rich Results Test - Verify structured data
3. Google Mobile-Friendly Test
4. Screaming Frog crawl - Check for broken links, missing meta
5. View source on every page type - Verify server renders correct meta
6. Test with `curl` - Ensure meta tags appear without JavaScript

#### 12. Post-Launch SEO

After deploying:
1. Submit sitemap to Google Search Console
2. Request indexing of key pages
3. Set up Bing Webmaster Tools
4. Monitor Core Web Vitals in GSC
5. Check Index Coverage report weekly for first month

---

## Quick Reference: Server-Side SEO Middleware Pattern

```typescript
// server/seo-middleware.ts
export function createSeoMiddleware(staticPath: string) {
  return (req, res, next) => {
    // Skip API routes, static files, sitemap
    if (req.path.startsWith("/api") || req.path.includes(".")) {
      return next();
    }
    
    // Read HTML template
    const html = readFileSync(path.join(staticPath, "index.html"), "utf-8");
    
    // Get page-specific meta based on route
    const meta = getPageMeta(req.path);
    
    // Replace meta tags
    const modifiedHtml = html
      .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
      .replace(/<link rel="canonical".*?\/>/, `<link rel="canonical" href="${meta.canonical}" />`)
      .replace(/<meta name="description".*?\/>/, `<meta name="description" content="${meta.description}" />`)
      // ... replace all og: and twitter: tags
    
    res.send(modifiedHtml);
  };
}
```

---

## Key Metrics to Hit

| Metric | Target | Tool to Measure | Priority |
|--------|--------|-----------------|----------|
| PageSpeed Mobile | 90+ | PageSpeed Insights | 🔴 Critical |
| First Contentful Paint | < 1.8s | PageSpeed Insights | 🔴 Critical |
| LCP | < 2.5s | Core Web Vitals | 🔴 Critical |
| CLS | < 0.1 | Core Web Vitals | 🔴 Critical |
| INP | < 200ms | Core Web Vitals | 🔴 Critical |
| Schema Validation | 100% | Rich Results Test | 🟠 High |
| Mobile Usability | Pass | Google Search Console | 🟠 High |
| Unique Canonicals | 100% | Screaming Frog | 🟠 High |
| Security Headers | A+ | SecurityHeaders.com | 🟡 Medium |
| Accessibility Score | 95+ | Lighthouse | 🟡 Medium |
| HTTPS | Required | Browser | 🔴 Critical |

---

## Common Mistakes to Avoid

1. **SPA without server-side meta** - Google sees same meta on all pages
2. **Hardcoded sitemap** - Gets stale, causes 404 errors
3. **Missing canonical tags** - Duplicate content penalties
4. **Same title/description everywhere** - No keyword targeting
5. **No structured data** - Missing rich snippets
6. **Slow images** - Kills Core Web Vitals
7. **Missing alt text** - Accessibility and image SEO failure
8. **No robots.txt** - Wasted crawl budget on admin pages
9. **Client-side only rendering** - AI engines can't read content
10. **No mobile optimization** - Mobile-first indexing fails

---

## Copy-Paste Prompt Addition

Add this to the END of any Replit Agent website prompt:

```
IMPORTANT SEO REQUIREMENTS:
- Implement server-side SEO middleware for meta tag injection
- Create dynamic sitemap.xml and robots.txt endpoints
- Add JSON-LD structured data (Organization, Article, FAQPage)
- Ensure unique canonical URLs for every page
- Optimize Core Web Vitals (preload hero images, lazy load below fold)
- Use semantic HTML (article, section, main, aside)
- Include noindex on admin/utility pages
- Structure content for AI answer extraction (lead with direct answers)
- Add author bios with credentials on articles
- Test with curl to verify server renders correct meta tags
```
