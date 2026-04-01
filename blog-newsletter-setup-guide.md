# Blog + Newsletter System Setup Guide

Use this document when asking a developer (or AI agent) to build a blog and newsletter system on a new site. It covers what to ask for, what you'll need ready, and tips to get it right the first time.

---

## PART 1: Blog + Content Studio

### What to Ask For

"Build a blog system with an admin Content Studio that uses AI to generate, review, and publish blog posts. Blog posts should have title, content, featured image, SEO metadata (meta title, meta description), FAQs, categories/tags, and author info. The Content Studio should let me generate drafts with AI, edit them, and approve them before they go live on the public blog page."

### Blog Post Fields You Need

- Title
- URL slug (auto-generated from title)
- Meta title and meta description (for SEO)
- Excerpt (short summary for cards/previews)
- Full content (markdown or rich text)
- Featured image + alt text
- Author name, title, image, and bio
- Category and tags
- Published date
- Read time (auto-calculated)
- FAQs (question + answer pairs, for SEO structured data)
- Content pillar (optional — for organizing by theme)

### Content Studio Admin Features

- AI-powered draft generation (targeting specific industries or topics)
- Edit and revise drafts before publishing
- AI image generation for featured images (optional)
- Quality checklist before approval
- Approve/publish workflow
- Rate limiting on AI endpoints to control API costs

### What You Need Ready

| Item | Details |
|------|---------|
| OpenAI API key | For AI writing. Store as environment secret, never in code |
| Image generation API key | Leonardo AI or Replicate, if you want AI-generated images. Otherwise upload your own |
| PostgreSQL database | For storing published posts |
| Brand voice guidelines | Tone, vocabulary, target audience, content pillars |
| Target industries/topics | So the AI knows what to write about |
| Admin credentials | Username + secret key for accessing the admin tools |

### Public Blog Page Should Include

- Blog listing page with cards showing image, title, excerpt, date, read time
- Individual blog post pages with full content
- Category/tag filtering
- SEO: meta tags, JSON-LD structured data, Open Graph tags
- Breadcrumb navigation
- Related posts section
- Sitemap inclusion

---

## PART 2: Newsletter Creator

### What to Ask For

"Build a Newsletter Creator admin tool that uses AI to generate email newsletters from recent blog content, lets me edit and approve them, then sends them via Resend to my subscriber list. Include a newsletter signup form on the public site that captures emails to GoHighLevel."

### Newsletter Creator Admin Features

- AI-powered newsletter generation (pulls from recent blog posts)
- Edit content before sending
- Quality checklist before approval
- Send via Resend email service
- Preview before sending
- Rate limiting on send endpoints

### Newsletter Signup (Public Site)

- Email capture form (in footer, homepage, or dedicated section)
- Submits to GoHighLevel for lead capture and nurture sequences
- Success confirmation message
- "No spam / Unsubscribe anytime" trust signals

### What You Need Ready

| Item | Details |
|------|---------|
| OpenAI API key | For generating newsletter content |
| Resend API key | For sending emails (free tier: 100 emails/day) |
| Verified "from" email | Set up in Resend (e.g., newsletter@yourdomain.com) |
| GoHighLevel form ID | For the signup form to capture subscribers |
| Admin credentials | Username + secret key for accessing the admin tool |
| Brand voice guidelines | Same as blog — tone, vocabulary, audience |

---

## TIPS FOR GETTING IT RIGHT THE FIRST TIME

1. **Ask for admin authentication from day one** — These tools should never be publicly accessible. Use server-side auth with signed cookies, not just a password field.

2. **Ask for a quality checklist on both tools** — A simple list of checks before you can publish or send (e.g., "Title under 60 characters", "Featured image set", "At least 2 FAQs").

3. **Specify your content structure** — How many sections in a newsletter? What fields does a blog post need? Be specific up front.

4. **Request rate limiting on AI endpoints** — Prevents accidentally burning through API credits if something loops or gets hit repeatedly.

5. **Ask for SEO built in from the start** — Structured data (JSON-LD), meta tags, Open Graph, sitemap, breadcrumbs. Much harder to add later.

6. **Store all API keys as environment secrets** — Never hardcoded in the codebase.

7. **Ask for a "draft/approve" workflow** — Never let AI content go live without human review.

8. **Use WebP for all images** — Blog featured images, newsletter headers, everything. Keeps page loads fast.

9. **Ask for the blog to support your marketing funnel** — Internal links to your assessment/audit, calls to action, booking links.

10. **Request DOMPurify sanitization** — If blog content uses HTML rendering, sanitize it to prevent XSS attacks.

---

## INTEGRATION MAP

```
Blog + Content Studio
  |-- OpenAI ........... writes blog drafts
  |-- Leonardo/Replicate generates featured images (optional)
  |-- PostgreSQL ....... stores published posts
  |-- Admin Auth ....... protects the admin tools

Newsletter Creator
  |-- OpenAI ........... writes newsletter content
  |-- Resend ........... sends the emails
  |-- GoHighLevel ...... captures signups on the public site
  |-- PostgreSQL ....... stores newsletter history
  |-- Admin Auth ....... protects the admin tool
```

---

## COPY-PASTE PROMPT

Use this when starting a new project:

> Build a blog system with an AI Content Studio admin tool and a Newsletter Creator admin tool.
>
> **Blog:** Posts need title, slug, meta title, meta description, excerpt, full content, featured image with alt text, author info, category, tags, FAQs, and publish date. The Content Studio admin should let me generate drafts with OpenAI, edit them, review a quality checklist, and approve them before they appear on the public blog. The public blog page needs SEO (meta tags, JSON-LD, Open Graph, sitemap), category filtering, and related posts.
>
> **Newsletter:** The admin tool should generate newsletters from recent blog content using OpenAI, let me edit and approve them, then send via Resend. Include a newsletter signup form on the public site that submits to GoHighLevel. Add a quality checklist before sending.
>
> **Security:** Admin tools need server-side authentication with signed cookies. Rate limit all AI and email endpoints. Sanitize any HTML content with DOMPurify. Store all API keys as environment secrets.
>
> **I have ready:** OpenAI API key, Resend API key, GoHighLevel form ID, admin credentials, and brand voice guidelines.
