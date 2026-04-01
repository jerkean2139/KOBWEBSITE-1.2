# Kean on Biz - Personal Brand & Coaching Website

## Overview
Kean on Biz is a multi-page marketing website for Jeremy Kean's coaching and consulting business. It showcases his extensive business experience and service offerings, including 1:1 coaching, digital marketing, and a tech ecosystem. The site integrates with GoHighLevel for bookings and lead capture and features advanced tools like a Newsletter Creator, Content Studio, MicroPod Studio, Portfolio Admin, and Industry Intelligence for automated content generation and business insights, aiming to build a robust platform for audience engagement and content dissemination.

## User Preferences
Preferred communication style: Simple, everyday language.

## Marketing Plan Alignment (Go-Forward Plan, Feb 2026)
- **Primary Lead Magnet**: "Bottleneck Audit" (formerly "Assessment") at `/assessment`. Captures name, email, phone + diagnostic answers. Submits to GHL form `p7TQrdK8KZEQfC9JWtQT`. Returns a "Bottleneck Score" (0-100) with plan-aligned messaging.
- **Primary Booking CTA**: "Discovery Call" (unified from Intro/Strategy/Coaching). Points to `/jeremys-calendar-intro`. Strategy and Coaching sessions remain accessible but de-emphasized.
- **Funnel Flow**: Content → Bottleneck Audit → Automated Nurture (GHL-side SMS/email) → Discovery Call → Client → Community & Advocacy. Visualized in "How It Works" section on homepage.
- **Three-Brand Ecosystem**: KeanOnBiz (Front Door/Consulting) → Manumation (Framework/Book/Workshop) → Zenoflo (Engine/Software). Visualized on About page.
- **Content Pillars**: 5 pillars categorize all blog posts — Pain, Hope, Philosophy, Proof, Vision. Filterable on `/blog` page.
- **Social Channels**: LinkedIn (primary), Facebook, YouTube, Instagram. Links in footer and "Follow Jeremy" section on homepage.
- **Team Roles**: Jeremy (Voice+Closer), Kianna (Engine+Production), Gaven (Enforcer+KPIs), Taha (Foundation+Technical).

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript on Vite.
- **UI**: shadcn/ui (New York variant) and Tailwind CSS, supporting two color schemes and custom scroll animations. Site logo is inline CSS text (red/white), not PNG.
- **Brand Colors**: Logo uses red (`text-red-500`) for "KEAN" and white for "BIZ" — consistent across all pages.
- **Routing**: Wouter for client-side navigation across various pages and dynamic blog posts. All routes use `React.lazy()` + `Suspense` for route-level code splitting.
- **SEO**: Server-side meta tag injection, JSON-LD structured data (Person, Organization, ProfessionalService, ProfilePage, ContactPage, PodcastSeries, PodcastEpisode, Book, BreadcrumbList), dynamic sitemap and robots.txt, PWA manifest, and automated internal linking.
- **Accessibility**: WCAG-aligned contrast ratios (white/70+ on dark backgrounds), proper form labels with `aria-label`/`htmlFor`, `aria-live` regions for status messages, `aria-hidden` on decorative icons, mobile menu focus trap with Escape key support, visible breadcrumb navigation on subpages.
- **Images**: All large images converted to WebP (avatars, hero photos, blog images). Unused duplicates removed. `/public` directory optimized from 83MB to ~64MB.
- **LLM Discoverability**: `llms.txt` and `llms-full.txt` endpoints for AI crawler indexing (following llmstxt.org standard).

### Backend
- **Server**: Express.js, handling static files and API endpoints.
- **Admin Tools**:
    - **Newsletter Creator** (`/admin/newsletter`): AI-powered bi-weekly newsletter generation with SSE progress, email sending via Resend, edit/approve/send workflow with quality checklist.
    - **Content Studio** (`/admin/content-studio`): Automated blog post generation with industry targeting, AI review, remix, and approval workflow. Integrates with pain points database for grounded content.
    - **MicroPod Studio** (`/admin/micropod`): AI script generation for podcast episodes using Jeremy's voice profile, ElevenLabs voice synthesis (placeholder until API key provided), approval workflow with 7-point quality checklist, and episode management.
    - **Portfolio Admin** (`/admin/portfolio`): Full project management with tabbed interface (Basics, Case Study, Milestones, Gallery), drag-and-drop media uploads, and case study content editing.
    - **Industry Intelligence** (`/admin/pain-points`): Admin-managed pain point database for 7 target industries, weekly automated AI research pipeline, stats dashboard, and integration with Content Studio and Newsletter Creator.
- **Interactive Tools**:
    - **The Founder's Filter**: A free interactive tool (formerly "Waterfall Workshop") utilizing Replit Auth for user authentication, allowing business owners to identify and categorize tasks for delegation with AI assistance (Donna AI - OpenAI gpt-4o) and session persistence to PostgreSQL. URL: `/founders-filter` (landing) and `/founders-filter/start` (app). Old `/waterfall-workshop` URLs redirect automatically.
    - **Revenue Leak Calculator** (`/insurance`): A 30-question interactive assessment for insurance agency owners. Calculates monthly revenue leakage from coaching/process/team gaps using a two-phase flow: Phase 1 (Q1-23 radio) measures losses across 7 categories, Phase 2 (Q24-30 numeric + radio) calculates recovery potential. Features: 3-column layout with animated leakage counter, risk level escalation (green→yellow→orange→red), auto-advance radio questions, interstitial screens, email gate before full results, category-by-category breakdown, and booking CTA. All carrier-agnostic (no State Farm references). Red/white/black theme. Client-side scoring only.

### AI Integration
- **OpenAI**: Utilized for content curation, summarization, research, writing, SEO, AI agent reviews, pain point research, and podcast script generation.
- **Image Generation**: Gemini Nano Banana, Leonardo AI Kino XL, and Replicate Flux LORA for generating header and featured images.
- **ElevenLabs**: Text-to-speech voice synthesis for MicroPod podcast episodes (API key pending).
- **Jeremy Voice Profile**: A comprehensive configuration guiding AI content generation to match Jeremy's specific tone, vocabulary, and content structure, including rules for tone sequencing, rhythm, canon vocabulary, and niche priority weighting.

### Portfolio — VybeKoderz Tool Showcase
- Three tools seeded as portfolio projects with PR-style case study write-ups:
  - **PimpMyPrompt** (`/portfolio/pimpmyprompt`): AI prompt optimization tool, Stage 5 (Deployed), $45K valuation
  - **Pocket Note** (`/portfolio/pocket-note`): AI note-taking platform, Stage 4 (Building), $32K valuation
  - **MenuMoney** (`/portfolio/menumoney`): AI menu pricing tool, Stage 1 (On Deck), $8K valuation
- Each has full case study content (challenge, solution, features, results, milestones, lessons learned)
- Seed endpoint: `POST /api/portfolio/seed-vybekoderz` (admin-only, idempotent upsert by slug)

### Database
- **Schema**: Defined in `shared/schema.ts` for managing newsletters, blog posts, content topics, media, portfolio projects, snapshots, podcast episodes, industry profiles, pain points, and research runs.

### Key Routes
- **Public**: `/`, `/about`, `/contact`, `/portfolio`, `/portfolio/:slug`, `/micropod`, `/blog`, `/newsletter`, `/assessment`, `/book`, `/founders-filter`, `/insurance`
- **Admin**: `/admin/newsletter`, `/admin/content-studio`, `/admin/micropod`, `/admin/portfolio`, `/admin/pain-points`
- **API**: `/api/portfolio`, `/api/pain-points`, `/api/micropod`, `/api/content-studio`, `/api/newsletter`, `/podcast.xml` (RSS feed)

### Performance
- Route-level code splitting via `React.lazy()` + `Suspense` for all pages in `App.tsx`.
- WebP-optimized images with explicit width/height attributes to prevent CLS.
- Lazy loading, optimized scroll animations, and mobile-first responsive design.
- Reusable `Breadcrumbs` component (`client/src/components/Breadcrumbs.tsx`) used on BlogPost, TopicHub, CaseStudy, Podcast, About, and Contact pages.

### Security Architecture
- **Security Audit**: Full VibeCoding Security Audit Chain v2.0 completed — results in `SECURITY_AUDIT_REPORT.md`. Overall risk: Low-Medium.
- **Secrets Management**: Admin keys stored as Replit secrets; no browser-based credential storage.
- **Authentication**: Server-issued signed httpOnly cookies (with `sameSite: lax`) for workshops; server-side validation for admin tools.
- **Rate Limiting**: Implemented for AI, email, Donna AI, portfolio write/read, and pain points write/read endpoints.
- **XSS Protection**: DOMPurify sanitization on all `dangerouslySetInnerHTML` usage (ContentStudio, BlogPost).
- **Input Validation**: Zod schemas for all API inputs, including URL validation with SSRF protection and path traversal protection.
- **CSP Headers**: Configured with `form-action 'self'` and `frame-ancestors 'self'`, and proper allowlists.

## External Dependencies

### Third-Party Services
- **GoHighLevel**: Integrated for booking widgets, newsletter signups, and assessment tools.
- **Google Fonts**: Inter and Playfair Display.
- **Umami Analytics**: Privacy-focused analytics solution.
- **Resend**: For email sending from the Newsletter Creator.
- **ElevenLabs**: Voice synthesis for podcast episodes (pending API key).

### UI Libraries & Frameworks
- **Radix UI Primitives**: For accessible UI components.
- **Framer Motion**: For advanced animations.
- **Embla Carousel**: For touch-enabled carousels.
- **Multer**: For file upload handling (portfolio media).

### Development & Build Tools
- **Vite**: For frontend tooling.
- **TypeScript**: For type safety.
- **Prettier**: For code formatting.
- **ESBuild**: For server-side bundling.

### Styling Dependencies
- **Tailwind CSS Ecosystem**: Core framework, animation utilities, and conditional class name utilities.
