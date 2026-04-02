# KeanOnBiz — User Test Guide & Funnel Audit

> **Date**: April 2, 2026
> **Version**: 1.2
> **Prepared for**: Jeremy Kean, Kianna, QA Testers
>
> **Audit Execution Summary**:
> - All public pages verified: 200 OK (15+ pages tested via HTTP)
> - All API endpoints tested: `/api/health`, `/api/track/*` (5 endpoints), `/api/insurance-assessment/*` (2 endpoints), `/api/portfolio/projects`
> - Validation tested: Missing email → 400, Invalid email → 400 (confirmed)
> - CTA audit: 80+ CTAs across 18 page sections — all code-verified PASS
> - Blog posts: 3 posts deep-tested, all load correctly (200 OK)
> - Screenshots captured: `/`, `/insurance`, `/blog`, `/jeremys-calendar`
> - Items marked MANUAL: Founder's Filter (requires Replit Auth), GHL form submissions (requires GHL dashboard), rate limit testing
> - 6 Known Issues documented (4 confirmed, 2 needs-confirmation)

---

## Table of Contents

1. [Site Map & Route Inventory](#1-site-map--route-inventory)
2. [Funnel Diagrams](#2-funnel-diagrams)
3. [Insurance Revenue Leak Calculator — Full Test Script](#3-insurance-revenue-leak-calculator--full-test-script)
4. [Bottleneck Audit (General Assessment) — Test Script](#4-bottleneck-audit-general-assessment--test-script)
5. [Calendar / Booking Pages — Test Script](#5-calendar--booking-pages--test-script)
6. [Founder's Filter — Test Script](#6-founders-filter--test-script)
7. [Homepage — CTA & Flow Audit](#7-homepage--cta--flow-audit)
8. [Site-Wide CTA Audit Matrix](#8-site-wide-cta-audit-matrix)
9. [Blog Content Map & 3-Post QA](#9-blog-content-map--3-post-qa)
10. [Newsletter Signup — Test Script](#10-newsletter-signup--test-script)
11. [API Endpoint Verification (Full)](#11-api-endpoint-verification-full)
12. [Known Issues & Inconsistencies](#12-known-issues--inconsistencies)
13. [Mobile / Responsive Checklist](#13-mobile--responsive-checklist)
14. [Accessibility Quick-Check](#14-accessibility-quick-check)

---

## 1. Site Map & Route Inventory

### Public Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Main landing, Manumation book promo, Bottleneck Audit CTA |
| `/about` | About | Jeremy's story, three-brand ecosystem |
| `/contact` | Contact | Contact form |
| `/insurance` | Insurance Landing + Assessment | Revenue Leak Calculator (landing → quiz) |
| `/insurance/assessment` | Insurance Assessment (alias) | Same page as `/insurance` |
| `/assessment` | Bottleneck Audit | General business assessment (GHL form `p7TQrdK8KZEQfC9JWtQT`) |
| `/blog` | Blog Index | All posts with content-pillar filtering |
| `/blog/:slug` | Blog Post | Individual blog article |
| `/blog/topic/:pillar` | Topic Hub | Posts filtered by content pillar |
| `/newsletter` | Newsletter Archive | Past newsletters |
| `/micropod` | Podcast | MicroPod episodes |
| `/book` | Manumation Book | Book promo page |
| `/founders-filter` | Founder's Filter Landing | Interactive task-delegation tool (landing) |
| `/founders-filter/start` | Founder's Filter App | The actual interactive tool |
| `/portfolio` | Portfolio | VybeKoderz tool showcase |
| `/portfolio/:slug` | Case Study | Individual project case study |
| `/become-a-coach` | Manumation Coach | Coach recruitment page |
| `/coaching-truth` | Dirty Secret of Coaching | Content/marketing page |
| `/terms` | Terms of Service | Legal |
| `/privacy` | Privacy Policy | Legal |

### Calendar / Booking Pages

| Route | Page | Widget ID | Duration |
|-------|------|-----------|----------|
| `/jeremys-calendar` | Session Selector | N/A (links to sub-pages) | N/A |
| `/jeremys-calendar-intro` | Strategy Call (Insurance CTA) | `uslCIRV9xwkJQlHC1Rl7` | 60 min |
| `/jeremys-calendar-strategy` | Strategy & Working Sessions | `uslCIRV9xwkJQlHC1Rl7` | 60 min |
| `/jeremys-calendar-coaching` | 1:1 Coaching (Clients Only) | `HDMThBdATyMVW7HFteZe` | 60 min |

### Admin Pages

| Route | Page |
|-------|------|
| `/admin/newsletter` | Newsletter Creator |
| `/admin/content-studio` | Content Studio |
| `/admin/micropod` | MicroPod Studio |
| `/admin/portfolio` | Portfolio Admin |
| `/admin/pain-points` | Industry Intelligence |

### Redirects

| Old URL | Redirects To |
|---------|-------------|
| `/waterfall-workshop` | `/founders-filter` |
| `/waterfall-workshop/start` | `/founders-filter/start` |

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Health check (returns `{"status":"ok"}`) |
| POST | `/api/track/assessment` | Track assessment completion |
| POST | `/api/track/pageview` | Track page views |
| POST | `/api/track/blog-read` | Track blog read events |
| POST | `/api/track/newsletter-subscribe` | Track newsletter signups |
| POST | `/api/track/workshop-complete` | Track workshop completions |
| POST | `/api/insurance-assessment/capture` | Email gate capture + GHL forward |
| POST | `/api/insurance-assessment/email-results` | Email results from results page (stub) |
| GET/POST | `/api/portfolio/*` | Portfolio CRUD |
| GET/POST | `/api/pain-points/*` | Pain points CRUD (admin auth required) |
| GET/POST | `/api/micropod/*` | Podcast management (admin auth required) |
| GET/POST | `/api/content-studio/*` | Blog content management (admin auth required) |
| GET/POST | `/api/newsletter/*` | Newsletter management (admin auth required) |
| GET | `/podcast.xml` | Podcast RSS feed |

---

## 2. Funnel Diagrams

### Funnel A: Insurance Revenue Leak Calculator

```
[Traffic Source]
   ↓
/insurance  (Landing page — "Stop Running Your Agency. Start Leading It.")
   ↓
[Click "Find Your Revenue Leak"]
   ↓
/insurance/assessment  (30-question quiz, 2 phases)
   ↓
Phase 1: Q1–Q23 (radio questions, leakage counter builds)
   ↓ halfway interstitial at Q12
Phase 2: Q24–Q30 (numeric + radio, recovery calculation)
   ↓ phase-transition interstitial
[Email Gate]
   → POST /api/insurance-assessment/capture
   → Server forwards to GHL: https://services.leadconnectorhq.com/hooks/formSubmit
   → formId: "insurance_revenue_leak_calculator"
   ↓ (submit email OR skip)
[Results Page]
   ├── Full results if email submitted
   └── Summary only if skipped
   ↓
CTA: "Book Your Strategy Call" → /jeremys-calendar-intro
   ↓
[CalendarIntro Page]
   → GHL booking widget ID: uslCIRV9xwkJQlHC1Rl7
   → Embed script: https://link.msgsndr.com/js/form_embed.js
```

### Funnel B: General Bottleneck Audit

```
[Homepage / Nav / Blog CTAs]
   ↓
/assessment
   → Embedded GHL form ID: p7TQrdK8KZEQfC9JWtQT
   → Captures: name, email, phone + diagnostic questions
   ↓
[GHL handles scoring, nurture emails/SMS]
   ↓
Discovery Call booking (GHL-side automation)
```

### Funnel C: Newsletter Signup

```
[Homepage footer newsletter form]
   ↓
Client-side POST to GHL:
   → URL: https://api.leadconnectorhq.com/widget/form/WeCKj6eththzMepQtObZ
   → Form ID: WeCKj6eththzMepQtObZ
   → Content-Type: application/x-www-form-urlencoded
   ↓
GHL nurture sequence
```

### Funnel D: Founder's Filter

```
[Traffic Source / Nav / Blog]
   ↓
/founders-filter  (Landing page — "The Founder's Filter")
   ↓
[Click "Start The Founder's Filter Now"]
   ↓
/founders-filter/start  (Interactive app — Replit Auth login → Donna AI session)
   ↓
Task categorization: Keep / Delegate Today / Delegate This Quarter
   ↓
Session persistence to PostgreSQL
   ↓
PDF export of delegation plan
   ↓
CTA: Book a call → /jeremys-calendar or /jeremys-calendar-intro
```

### Funnel E: Direct Booking

```
[Any page with booking CTA]
   ↓
/jeremys-calendar  (Session selector — no embedded widget, links to sub-pages)
   ↓
   ├── Strategy & Working Sessions → /jeremys-calendar-strategy
   │   → GHL widget ID: uslCIRV9xwkJQlHC1Rl7
   │   → Embed script: https://link.msgsndr.com/js/form_embed.js
   │
   ├── 1:1 Coaching (Clients Only) → /jeremys-calendar-coaching
   │   → GHL widget ID: HDMThBdATyMVW7HFteZe  (DIFFERENT widget)
   │   → Embed script: https://link.msgsndr.com/js/form_embed.js
   │
   └── Quick Connect → /jeremys-calendar-intro
       → GHL widget ID: uslCIRV9xwkJQlHC1Rl7  (SAME as Strategy)
       → Embed script: https://link.msgsndr.com/js/form_embed.js
```

### Funnel F: Content → Booking

```
/blog/:slug  (blog post with inline CTAs + sidebar)
   ↓
Inline links to /assessment, /insurance, related posts
Sidebar CTAs: Manumation book, AI Agents toolkit, Book a Call → /jeremys-calendar
   ↓
(enters Funnel A, B, or E)
```

---

## 3. Insurance Revenue Leak Calculator — Full Test Script

### Pre-Conditions
- Browser: Chrome (desktop) + Safari (mobile)
- Clear cache/cookies before starting

### Test 3A: Landing Page (`/insurance`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/insurance` | Landing page loads. Hero: "Stop Running Your Agency. Start Leading It." Red/dark theme. | PASS |
| 2 | Verify Jeremy's avatar | Small round avatar with "Jeremy Kean / Agency Coach & CEO Sidekick" label | PASS |
| 3 | Verify stats bar | Shows: $3.3K avg leak, 40% recovery, 3 min, 100% confidential | PASS |
| 4 | Verify "Problems Nobody Talks About" section | 4 cards: accountability, sales, life production, owner dependency | PASS |
| 5 | Verify "How It Works" section | 3 steps: Take Assessment → See Numbers → Build Plan | PASS |
| 6 | Click "Find Your Revenue Leak" (hero CTA) | Scrolls/transitions to assessment quiz. URL stays `/insurance` or updates to `/insurance/assessment` | PASS |
| 7 | Click "See How It Works" | Smooth scrolls to #how-it-works section | PASS |
| 8 | Verify NO mentions of: State Farm, eCRM, NASFA, AI, automation | Landing page should only reference: systems, processes, discipline, training, coaching | PASS |

### Test 3B: Assessment Quiz (Phase 1)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | After clicking CTA, quiz loads | 3-column layout: leakage sidebar (left), question card (center), progress sidebar (right) | PASS (code-verified) |
| 2 | Progress bar shows | "Phase 1 of 2" with question counter | PASS (code-verified) |
| 3 | Answer Q1 (radio question) | Auto-advances to Q2 after brief delay. Leakage counter updates. | PASS (code-verified) |
| 4 | Click "Previous" on Q2 | Returns to Q1 with previous answer preserved | PASS (code-verified) |
| 5 | Answer Q1-Q11 sequentially | Leakage counter climbs. Categories fill in progress sidebar. | PASS (code-verified) |
| 6 | Answer Q12 | **Halfway interstitial** appears. Shows current leakage total. | PASS (code-verified) |
| 7 | Click "Continue" on interstitial | Returns to Q13 | PASS (code-verified) |
| 8 | Complete Q13-Q23 | **Phase transition interstitial** appears after Q23 | PASS (code-verified) |
| 9 | Click "Continue" on phase transition | Phase 2 begins. Progress bar updates to "Phase 2 of 2" | PASS (code-verified) |

### Test 3C: Assessment Quiz (Phase 2)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Q24 loads | Numeric input question (e.g., premium volume) | PASS (code-verified) |
| 2 | Enter numeric value, click Next | Advances to Q25 | PASS (code-verified) |
| 3 | Complete Q24-Q30 | After Q30, **Email Gate** screen appears | PASS (code-verified) |

### Test 3D: Email Gate

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Email gate loads | Shows "Assessment Complete!" with green checkmark | PASS (code-verified) |
| 2 | Verify leakage/potential display | Red "-$X,XXX leaking/mo" and green "+$X,XXX potential/mo" | PASS (code-verified) |
| 3 | Enter invalid email (e.g., "test") | HTML5 validation prevents submit | PASS (code-verified) |
| 4 | Enter valid email, click "See My Results" | Button shows "Sending..." → success → redirects to Results | PASS (code-verified) |
| 5 | Verify API call | Network tab: POST to `/api/insurance-assessment/capture` with JSON body containing: email, leakage, potential, annualRecovery, costSaved, revenueGained, hoursRecovered, categoryBreakdown, answers | PASS (API tested: 200 OK) |
| 6 | Click "Skip — show me the summary only" | Goes to Results page but **without** full category breakdown | PASS (code-verified) |

### Test 3E: Results Page

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Results load (email submitted path) | Big green "$X,XXX/mo" recovery potential at top | PASS (code-verified) |
| 2 | Three summary cards | Red (leaking), Green (recovery), Blue (hours/wk) | PASS (code-verified) |
| 3 | "Where You're Losing Money" section | Category bars with dollar amounts | PASS (code-verified) |
| 4 | "Where You'd Gain It Back" section | Cost Savings + Revenue Gained columns | PASS (code-verified) |
| 5 | "Your Answers at a Glance" accordion | Expandable. Shows all 30 answers. Worst answers highlighted red. | PASS (code-verified) |
| 6 | Jeremy's pitch section | Dark card with personalized copy | PASS (code-verified) |
| 7 | Testimonials | 3 testimonial cards (Beth P., Anissa V., Shelby F.) | PASS (code-verified) |
| 8 | CTA button | "Book Your Strategy Call" → links to `/jeremys-calendar-intro` | PASS (code-verified) |
| 9 | **No duplicate email form** | If email was submitted at gate, NO second email form appears. Instead: "A PDF copy of your results has been sent to your email." | PASS (code-verified) — but see Known Issue #3: no actual PDF/email sent |
| 10 | Results load (skipped email path) | Recovery potential shows, but category breakdown is **hidden** | PASS (code-verified) |
| 11 | Email form appears (skip path) | "Email My Results" form appears below CTA since email wasn't captured | PASS (code-verified) |

### Test 3F: Scoring Sanity Check

Use these test inputs to verify scoring math:

**Conservative Agency (expect LOW leakage)**:
- Answer "0" or lowest-impact option on all Q1-Q23
- Q24: 50 (policies/month)
- Q25: 200 (household count)
- Q26-Q30: conservative values

Expected: Monthly leakage under $1,500. Recovery under $2,000/mo.

**Struggling Agency (expect HIGH leakage)**:
- Answer highest-impact option on all Q1-Q23
- Q24: 20 (policies/month)
- Q25: 500 (household count)
- Q26-Q30: concerning values

Expected: Monthly leakage $5,000–$10,000+. Recovery $3,000–$8,000/mo.

Scoring formulas to verify:
- `scaledLeakage = phase1Leakage * 0.25`
- `operationalRecovery = scaledLeakage * 0.40`
- `ownerTimeRecovery = q29 * q28 * 4.33 * 0.25`
- `staffEfficiencyRecovery = q26 * q27 * 4.33 * 0.08`
- `costSaved = operationalRecovery + ownerTimeRecovery + staffEfficiencyRecovery`
- `lifeRevenue = q25 * lifePenetrationGap * 800 / 12`
- `newBusinessAcceleration = (q25 * 0.10) * (q24 / 12)`
- `revenueGained = (lifeRevenue + newBusinessAcceleration) * revenueMultiplier`
- `hoursRecovered = q29 * 0.6`

---

## 4. Bottleneck Audit (General Assessment) — Test Script

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/assessment` | Page loads with embedded GHL form | PASS (200 OK) |
| 2 | Verify form captures: name, email, phone + diagnostic questions | GHL form ID: `p7TQrdK8KZEQfC9JWtQT` | PASS (code-verified) |
| 3 | Submit form with test data | Form submits successfully. Confirmation message appears. | MANUAL (requires GHL test) |
| 4 | Verify GHL receives submission | Check GHL dashboard for the test contact | MANUAL (requires GHL access) |

---

## 5. Calendar / Booking Pages — Test Script

### Test 5A: Calendar Selector (`/jeremys-calendar`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/jeremys-calendar` | Page loads. Jeremy's photo (round, gold border). "Book with Jeremy" heading. | PASS (screenshot verified) |
| 2 | Verify 3 session cards | Strategy (60 min), Coaching (60 min, "Clients Only" badge), Quick Connect (15-20 min) | PASS (screenshot verified) — see Known Issue #1: Quick Connect shows 15-20 min but links to 60-min page |
| 3 | Click Strategy card | Navigates to `/jeremys-calendar-strategy` | PASS (code-verified) |
| 4 | Click Coaching card | Navigates to `/jeremys-calendar-coaching` | PASS (code-verified) |
| 5 | Click Quick Connect card | Navigates to `/jeremys-calendar-intro` | PASS (code-verified) |
| 6 | "Not Sure?" section | CTA: "Schedule Quick Connect" → `/jeremys-calendar-intro` | PASS (code-verified) |

### Test 5B: Strategy Call / CalendarIntro (`/jeremys-calendar-intro`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/jeremys-calendar-intro` | Dark page with red accents. Jeremy's photo (large, rectangular). | PASS (200 OK) |
| 2 | Verify badge | "60 MINUTE STRATEGY SESSION" | PASS (code-verified) |
| 3 | Verify headline | "Let's Build Your Recovery Plan" | PASS (code-verified) |
| 4 | Stats row | 35+ Years, 60+ Coached, $4.2K Avg Recovery, 100% Confidential | PASS (code-verified) |
| 5 | "What We'll Cover" checklist | 5 items including "Review your Revenue Leak Calculator results" | PASS (code-verified) |
| 6 | Booking widget loads | GHL iframe with widget `uslCIRV9xwkJQlHC1Rl7` | PASS (code-verified) |
| 7 | Testimonials section | 3 testimonials (Beth P., Agency Owner, Anissa V.) with star ratings | PASS (code-verified) |
| 8 | Back links | "Back to Insurance Coaching" → `/insurance`, "Back to Home" → `/` | PASS (code-verified) |

### Test 5C: Strategy & Working Sessions (`/jeremys-calendar-strategy`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Page loads | Blue/gold theme. "Strategy & Working Sessions" heading. | PASS (200 OK) |
| 2 | Booking widget | Same widget ID `uslCIRV9xwkJQlHC1Rl7` | PASS (code-verified) |
| 3 | Back link | "All Booking Options" → `/jeremys-calendar` | PASS (code-verified) |

### Test 5D: 1:1 Coaching (`/jeremys-calendar-coaching`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Page loads | "Clients Only" gold badge. Blue/gold theme. | PASS (200 OK) |
| 2 | Booking widget | **Different** widget ID: `HDMThBdATyMVW7HFteZe` | PASS (code-verified) |
| 3 | Back link | "All Booking Options" → `/jeremys-calendar` | PASS (code-verified) |

---

## 6. Founder's Filter — Test Script

### Test 6A: Landing Page (`/founders-filter`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/founders-filter` | Landing page loads. Dark gradient. "The Founder's Filter" heading. Jeremy's photo. | PASS (200 OK) |
| 2 | Verify "Free 59-Minute Session" badge | Amber badge at top | PASS (code-verified) |
| 3 | Verify headline copy | "Stop drowning in tasks that aren't yours to carry." | PASS (code-verified) |
| 4 | Click "Start The Founder's Filter Now" | Navigates to `/founders-filter/start` | PASS (code-verified) |
| 5 | GHL form embed script loads | Script from `link.msgsndr.com/js/form_embed.js` present in DOM | PASS (code-verified) |

### Test 6B: Interactive App (`/founders-filter/start`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/founders-filter/start` | App loads. Replit Auth login prompt appears (if not authenticated). | MANUAL (requires Replit Auth) |
| 2 | Authenticate via Replit Auth | Session starts. Donna AI ready. | MANUAL (requires Replit Auth) |
| 3 | Enter a task description | Donna AI categorizes: Keep / Delegate Today / Delegate This Quarter | MANUAL (requires auth + OpenAI) |
| 4 | Add multiple tasks | Tasks accumulate in the session. Categories fill. | MANUAL (requires auth + OpenAI) |
| 5 | Session persistence | Refresh page — tasks should persist (PostgreSQL storage). | MANUAL (requires auth) |
| 6 | PDF export | Download delegation plan as PDF. | MANUAL (requires auth) |

### Test 6C: Redirect Compatibility

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/waterfall-workshop` | Redirects to `/founders-filter` | PASS (code-verified: redirect in App.tsx) |
| 2 | Navigate to `/waterfall-workshop/start` | Redirects to `/founders-filter/start` | PASS (code-verified: redirect in App.tsx) |

---

## 7. Homepage — CTA & Flow Audit

### Test 7A: Hero Section

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/` | Hero loads with Manumation book cover (floating animation on desktop) | PASS (screenshot verified) |
| 2 | Primary CTA | "Take the Free Bottleneck Audit" → `/assessment` | PASS (code-verified) |
| 3 | Book CTA (desktop) | "Get the Book" → `https://manumation.ai` (opens new tab) | PASS (code-verified) |
| 4 | Book CTA (mobile) | Mobile book card with "Get the Book" → `https://manumation.ai` | PASS (code-verified) |
| 5 | Social proof badges | "100+ Businesses Helped", "15+ Hours/Week Saved", "35 Years Experience" | PASS (code-verified) |
| 6 | Quick testimonial (desktop) | Ryan Templeton testimonial with photo | PASS (code-verified) |

### Test 7B: Services Section

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Scroll to "Choose Your Journey" | 3 cards: DIY, Do With You, Done For You | PASS (code-verified) |
| 2 | Verify each CTA links correctly | DIY → book link, DWY → `/jeremys-calendar-intro`, DFY → `/jeremys-calendar-strategy` | PASS (code-verified) |

### Test 7C: Newsletter Section (Footer Area)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Scroll to newsletter signup | Email input + Subscribe button | PASS (code-verified) |
| 2 | Enter email + click Subscribe | Shows "You're subscribed! Check your inbox." | PASS (code-verified) — see Known Issue #4: always shows success even on error |
| 3 | Verify network request | POST to GHL form `WeCKj6eththzMepQtObZ` | PASS (code-verified) |

---

## 8. Site-Wide CTA Audit Matrix

Every CTA on every public page, with destination, expected behavior, and verification status.

**Legend**: PASS = code-verified destination/behavior matches; MANUAL = requires browser interaction to confirm.

### Navigation (all pages)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| KEAN ON BIZ logo | `/` | Navigate home | PASS |
| About | `/about` | Navigate | PASS |
| Services | `/#services` | Scroll to section (on homepage) or navigate to `/#services` | PASS |
| Blog | `/blog` | Navigate | PASS |
| Contact | `/contact` | Navigate | PASS |

### Homepage (`/`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Take the Free Bottleneck Audit | `/assessment` | Navigate (primary hero CTA) | PASS |
| Get the Book (desktop) | `https://manumation.ai` | New tab | PASS |
| Get the Book (mobile card) | `https://manumation.ai` | New tab | PASS |
| Manumation ecosystem card | `https://manumation.ai/coming-soon` | New tab | PASS |
| Zenoflo ecosystem card | `https://zenoflo.com` | New tab | PASS |
| DIY card CTA | Manumation book link | New tab | PASS |
| DWY card CTA | `/jeremys-calendar-intro` | Navigate | PASS |
| DFY card CTA | `/jeremys-calendar-strategy` | Navigate | PASS |
| How It Works step 4: "Book a Call" | `/jeremys-calendar-intro` | Navigate | PASS |
| "Take the Bottleneck Audit" (multiple) | `/assessment` | Navigate (appears in services + CTA section) | PASS |
| Subscribe (newsletter form) | GHL `WeCKj6eththzMepQtObZ` | POST to GHL | PASS — see Known Issue #4 |
| PocketCoach.one CTA | `https://pocketcoach.one` | New tab | PASS |
| Kingdom Legacy CTA | `https://www.kingdomlegacyministries.org` | New tab | PASS |
| LinkedIn / Facebook / YouTube / Instagram | Social profiles | New tab | PASS |
| Footer: Schedule a Call | `/jeremys-calendar-intro` | Navigate | PASS |
| Footer: Terms / Privacy | `/terms`, `/privacy` | Navigate | PASS |

### About (`/about`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Book a Call | `/jeremys-calendar` | Navigate | PASS |
| Take Free Bottleneck Audit | `/assessment` | Navigate | PASS |
| Manumation card | `https://manumation.ai/coming-soon` | New tab | PASS |
| Zenoflo card | `https://zenoflo.com` | New tab | PASS |

### Contact (`/contact`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Strategy Call card | `/jeremys-calendar-intro` | Navigate | PASS |
| Working Session card | `/jeremys-calendar-strategy` | Navigate | PASS |
| Coaching Call card | `/jeremys-calendar-coaching` | Navigate | PASS |
| Take Free Bottleneck Audit | `/assessment` | Navigate | PASS |
| Email link | `mailto:support@keanonbiz.com` | Open mail client | PASS |
| LinkedIn | `https://linkedin.com/in/jeremykean` | New tab | PASS |

### Insurance (`/insurance`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Find Your Revenue Leak (hero) | Starts assessment quiz | In-page transition | PASS |
| See How It Works | `#how-it-works` | Smooth scroll | PASS |
| Find Out What You're Losing (mid-page) | Starts assessment quiz | In-page transition | PASS |

### Insurance Results Page

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Book Your Strategy Call | `/jeremys-calendar-intro` | Navigate | PASS |
| Email My Results (if skipped gate) | POST `/api/insurance-assessment/email-results` | Ajax call | PASS — stub, see Known Issue #2 |

### CalendarIntro (`/jeremys-calendar-intro`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Back to Insurance Coaching | `/insurance` | Navigate | PASS |
| Back to Home | `/` | Navigate | PASS |

### Calendar Selector (`/jeremys-calendar`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Strategy & Working Sessions card | `/jeremys-calendar-strategy` | Navigate | PASS |
| 1:1 Coaching Call card | `/jeremys-calendar-coaching` | Navigate | PASS |
| Quick Connect card | `/jeremys-calendar-intro` | Navigate | PASS — see Known Issue #1 |
| "Schedule Quick Connect" (bottom) | `/jeremys-calendar-intro` | Navigate | PASS |
| Back to Home | `/` | Navigate | PASS |

### CalendarStrategy (`/jeremys-calendar-strategy`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| All Booking Options | `/jeremys-calendar` | Navigate | PASS |
| Back to Home | `/` | Navigate | PASS |

### CalendarCoaching (`/jeremys-calendar-coaching`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| All Booking Options | `/jeremys-calendar` | Navigate | PASS |
| Back to Home | `/` | Navigate | PASS |

### Podcast (`/micropod`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| RSS Feed link | `/podcast.xml` | New tab | PASS |
| Apple Podcasts | `https://podcasts.apple.com` | New tab (placeholder) | PASS |
| Spotify | `https://open.spotify.com` | New tab (placeholder) | PASS |
| Book a Call | `/jeremys-calendar` | Navigate | PASS |
| Manumation | `https://manumation.ai/coming-soon` | New tab | PASS |
| Footer: Blog, MicroPod, Book a Call | Various internal links | Navigate | PASS |

### Newsletter (`/newsletter`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Subscribe Free | GHL newsletter form | POST to GHL | PASS |
| Footer: Home, Blog, MicroPod | Internal links | Navigate | PASS |
| Footer: Book a Call | `/jeremys-calendar` | Navigate | PASS |
| Footer: Terms / Privacy | `/terms`, `/privacy` | Navigate | PASS |

### Portfolio (`/portfolio`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Project cards (GitHub link) | External GitHub URL | New tab | PASS |
| Project cards (Live link) | External live URL | New tab | PASS |
| Back to Home | `/` | Navigate | PASS |

### Founder's Filter Landing (`/founders-filter`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Start The Founder's Filter Now | `/founders-filter/start` | Navigate | PASS |

### Terms (`/terms`) & Privacy (`/privacy`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Email link | `mailto:support@keanonbiz.com` | Open mail client | PASS |

### Blog Index (`/blog`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Pillar filter links | `/blog/topic/:pillar` | Navigate | PASS |
| Post cards | `/blog/:slug` | Navigate | PASS |
| Footer: Book a Call | `/jeremys-calendar` | Navigate | PASS |
| Footer: Manumation / Zenoflo | External sites | New tab | PASS |

### Blog Post (`/blog/:slug`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Inline content links | Various `/blog/:slug` cross-links | Navigate | PASS |
| Sidebar: Get the Book | `https://manumation.ai` | New tab | PASS |
| Sidebar: Book a Call | `/jeremys-calendar` | Navigate | PASS |
| Share buttons | LinkedIn / Twitter / Facebook share | New tab | PASS |
| Related posts | `/blog/:slug` | Navigate | PASS |

### Book (`/book`)

| CTA Text | Destination | Behavior | Status |
|----------|-------------|----------|--------|
| Get the Book | `https://manumation.ai` | New tab | PASS |
| Take the Assessment | `/assessment` | Navigate | PASS |
| Book a Call | `/jeremys-calendar` | Navigate | PASS |

---

## 9. Blog Content Map & 3-Post QA

### Blog Content Pillars → Funnel Mapping

| Pillar | Target Funnel | Insurance-Relevant? |
|--------|---------------|---------------------|
| Pain | Insurance Funnel A (via `/insurance`) + Bottleneck Audit B | Yes — agency pain points |
| Hope | Bottleneck Audit B → Discovery Call | Some posts |
| Philosophy | Brand awareness → Book → Audit | General |
| Proof | Social proof → Booking (Funnel E) | Some posts |
| Vision | Book promo → Manumation site | General |

### Insurance-Relevant Blog Posts (feed Funnel A)

| Slug | Title Area | Links To |
|------|-----------|----------|
| `insurance-agency-tech-stack-7-tools-save-time` | Tech stack for agencies | Inline links to other posts |
| `automate-insurance-renewals-without-losing-personal-touch` | Renewal automation | Cross-links to assessment |
| `insurance-agency-lead-generation-ai-powered-funnels` | Lead gen for agencies | Cross-links |
| `insurance-agency-bottleneck-nobody-talks-about` | Agency bottleneck (key funnel post) | Referenced by 5+ other posts |
| `insurance-agency-client-retention-strategies-2026` | Client retention | Cross-links |
| `ai-automation-for-insurance-agencies-complete-guide-2026` | AI for agencies | Related to insurance tech stack |

### 3-Post Deep QA

**Post 1: `insurance-agency-bottleneck-nobody-talks-about`**

| # | Check | Expected Result | Pass? |
|---|-------|-----------------|-------|
| 1 | Navigate to `/blog/insurance-agency-bottleneck-nobody-talks-about` | Page loads. No blank screen. | PASS — 200 OK |
| 2 | Breadcrumbs | Shows: Home > Blog > [Post Title] | PASS (code-verified) |
| 3 | Content renders properly | No raw HTML. Images load. Markdown formatted. | PASS (code-verified) |
| 4 | Inline cross-links work | Links to other blog posts navigate correctly | PASS (code-verified) |
| 5 | Sidebar CTAs present | Book CTA, "Book a Call" link visible | PASS (code-verified) |
| 6 | SEO meta tags | `<title>`, `<meta name="description">`, `og:image` present in page source | PASS (code-verified) |
| 7 | Share buttons work | LinkedIn/Twitter/Facebook share links generate correct URLs | PASS (code-verified) |
| 8 | Related posts display | 3 related post cards at bottom | PASS (code-verified) |

**Post 2: `90-day-operations-overhaul-transform-business-one-quarter`**

| # | Check | Expected Result | Pass? |
|---|-------|-----------------|-------|
| 1 | Navigate to `/blog/90-day-operations-overhaul-transform-business-one-quarter` | Page loads | PASS — 200 OK |
| 2 | Breadcrumbs | Home > Blog > [Post Title] | PASS (code-verified) |
| 3 | Content renders | Properly formatted. Internal links work. | PASS (code-verified) |
| 4 | Cross-links to Manumation Method | Link to `/blog/manumation-method-five-pillars` works | PASS (code-verified) |
| 5 | Sidebar CTAs | Present and functional | PASS (code-verified) |
| 6 | SEO tags | Title, description, OG image present | PASS (code-verified) |

**Post 3: `manumation-method-five-pillars`**

| # | Check | Expected Result | Pass? |
|---|-------|-----------------|-------|
| 1 | Navigate to `/blog/manumation-method-five-pillars` | Page loads | PASS — 200 OK |
| 2 | Breadcrumbs | Home > Blog > [Post Title] | PASS (code-verified) |
| 3 | Content renders | Properly formatted. The 5 pillars are clearly structured. | PASS (code-verified) |
| 4 | Most cross-linked post | This slug is referenced by 10+ other posts — verify it loads correctly since it's a critical node | PASS — loads without error |
| 5 | Sidebar CTAs | Book CTA links to `manumation.ai`, Call CTA links to `/jeremys-calendar` | PASS (code-verified) |
| 6 | SEO tags | Title, description, OG image present | PASS (code-verified) |

---

## 10. Newsletter Signup — Test Script

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | On homepage, scroll to newsletter form | Form visible with email input | PASS (code-verified) |
| 2 | Submit with empty email | HTML5 validation prevents submit | PASS (code-verified: `required` attr) |
| 3 | Submit with valid email | Shows success message. Network: POST to GHL. | PASS (code-verified) — see Known Issue #4 |
| 4 | Navigate to `/newsletter` | Newsletter archive page loads | PASS (200 OK) |

---

## 11. API Endpoint Verification (Full)

### 11A: Health & Tracking Endpoints

| Method | Endpoint | Expected Response | Pass? |
|--------|----------|-------------------|-------|
| GET | `/api/health` | 200 OK with status JSON | PASS — `{"status":"ok","timestamp":"..."}` |
| POST | `/api/track/assessment` | 200 OK — logs assessment start/completion | PASS — 200 with valid Zod payload |
| POST | `/api/track/pageview` | 200 OK — logs page view | PASS — 200 with valid Zod payload |
| POST | `/api/track/blog-read` | 200 OK — logs blog read event | PASS — 200 with valid Zod payload |
| POST | `/api/track/newsletter-subscribe` | 200 OK — logs newsletter subscription | PASS — 200 with valid Zod payload |
| POST | `/api/track/workshop-complete` | 200 OK — logs workshop completion | PASS — 200 with valid Zod payload |

### 11B: Public Endpoints (Non-API)

| Method | Endpoint | Expected Response | Pass? |
|--------|----------|-------------------|-------|
| GET | `/sitemap.xml` | Valid XML sitemap with all public URLs | PASS — 200, valid XML |
| GET | `/sitemap_index.xml` | 301 redirect → `/sitemap.xml` | MANUAL (redirect check) |
| GET | `/robots.txt` | Text file with crawl rules, `Sitemap: https://keanonbiz.com/sitemap.xml` | PASS — 200, includes Disallow /admin/ |
| GET | `/llms.txt` | LLM-readable site summary (llmstxt.org standard) | PASS — 200 |
| GET | `/llms-full.txt` | Extended LLM-readable content | PASS — 200 |
| GET | `/podcast.xml` | Valid RSS feed for MicroPod episodes | PASS — 200, valid RSS XML |

### 11C: Insurance Assessment Capture

```
POST /api/insurance-assessment/capture
Content-Type: application/json

{
  "email": "test@agency.com",
  "leakage": 3200,
  "potential": 4500,
  "annualRecovery": 54000,
  "costSaved": 2000,
  "revenueGained": 2500,
  "hoursRecovered": 12,
  "categoryBreakdown": {"Team Management": 800, "Sales Process": 1200},
  "answers": {"1": 3, "2": 2, "3": 4}
}
```

**Result**: PASS — `200 OK` with `{"success":true,"ghlCaptured":false}` (GHL webhook not configured in dev — returns false; will be true in production with the webhook URL).

**Rate limit**: 10 requests per 15-minute window.

### 11D: Insurance Email Results

```
POST /api/insurance-assessment/email-results
Content-Type: application/json

{ "email": "test@agency.com" }
```

**Result**: PASS — `200 OK` with `{"success":true}` (stub endpoint — see Known Issue #2: no actual email sent)

### 11E: Validation Tests

| Test | Input | Expected |
|------|-------|----------|
| Missing email | `{}` | 400: "A valid email is required" | PASS — 400 returned |
| Invalid email | `{"email": "notanemail"}` | 400: "A valid email is required" | PASS — 400 returned |
| Rate limit exceeded | 11 rapid requests | 429: "Too many submissions" | MANUAL (not tested to avoid hitting limit) |

### 11F: Other API Endpoints (Smoke Tests)

| Method | Endpoint | Expected | Auth Required? |
|--------|----------|----------|----------------|
| GET | `/api/portfolio/projects` | JSON array of portfolio projects | No | PASS — 200 |
| GET | `/api/pain-points/industries` | JSON array of industry profiles | Admin key | PASS — 401 without auth (expected) |
| GET | `/api/micropod/episodes` | JSON array of podcast episodes | Admin key | PASS — 401 without auth (expected) |
| GET | `/api/content-studio/topics` | JSON array of content topics | Admin key | MANUAL |
| GET | `/api/newsletter/newsletters` | JSON array of newsletters | Admin key | MANUAL |

---

## 12. Known Issues & Inconsistencies

### HIGH Priority — Confirmed (verified in source code)

| # | Issue | Location | Impact | Notes |
|---|-------|----------|--------|-------|
| 1 | **Calendar.tsx "Quick Connect" mismatch** | `client/src/pages/Calendar.tsx` lines 28-34 | Card shows "Quick Connect / 15-20 min" but the CalendarIntro page it links to says "60 minute strategy session" and "Strategy Call". Users expect a quick 15-min call but land on a 60-min booking page. | Should update Calendar.tsx intro card to say "Strategy Call / 60 min" OR create a separate 15-min booking widget. |

### MEDIUM Priority — Confirmed

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 2 | **email-results endpoint is a stub** | `server/insurance-assessment.ts` lines 105-122 | The `/api/insurance-assessment/email-results` endpoint accepts an email but doesn't actually send anything. It logs and returns `{ success: true }`. No Resend integration yet. |
| 3 | **"A PDF copy of your results has been sent"** | `client/src/components/InsuranceAssessment/ResultsPage.tsx` line 359 | Message claims a PDF was sent to email, but no PDF generation or email sending exists. |
| 4 | **Newsletter form always shows success** | `client/src/pages/Home.tsx` lines 37-45 | The `catch` block in `NewsletterForm.handleSubmit` sets `status = "success"` even on network errors. Users see "You're subscribed!" regardless of whether GHL received the submission. |

### Needs Confirmation (may be intentional)

| # | Issue | Location | Notes |
|---|-------|----------|-------|
| 5 | **CalendarStrategy uses same widget as CalendarIntro** | Both pages embed `uslCIRV9xwkJQlHC1Rl7` | Both "Strategy & Working Sessions" and the insurance-funnel "Strategy Call" book the exact same GHL calendar. Verify with Jeremy: are these meant to be different meeting types? |
| 6 | **Backend Server dependency** | Workflow config | The "Backend Server" workflow requires `express-rate-limit` (installed during audit). Both workflows should be running: "Start application" (Vite on port 5000) proxies API calls to "Backend Server" (Express on port 3001). If backend fails, all `/api/*` calls return 500. |

---

## 13. Mobile / Responsive Checklist

Test on iPhone 12/13 size (390×844) and iPad (768×1024):

| # | Page | Check | Pass? |
|---|------|-------|-------|
| 1 | `/insurance` | Hero stacks vertically. CTA buttons full-width. Preview card hidden on mobile (lg:block). | |
| 2 | `/insurance` (quiz) | 3-column layout stacks: question card on top, sidebars below. Touch-friendly radio buttons. | |
| 3 | `/insurance` (results) | Cards stack. Counter animations work. Accordion expands. | |
| 4 | `/jeremys-calendar-intro` | Photo + text stack. Booking widget scrollable. | |
| 5 | `/` | Hero stacks. Mobile book card appears (lg:hidden). Nav hamburger works. | |
| 6 | `/blog` | Post cards stack. Filters wrap. | |
| 7 | `/founders-filter` | Landing stacks. Jeremy's photo + text responsive. CTA button full-width. | |
| 8 | Navigation | Hamburger menu opens/closes. Links work. Escape key closes menu. | |

---

## 14. Accessibility Quick-Check

| # | Check | How to Test | Pass? |
|---|-------|-------------|-------|
| 1 | Form labels | Inspect email inputs: all have `aria-label` or `<label htmlFor>` | |
| 2 | Color contrast | Use Chrome DevTools → Rendering → Emulate "forced-colors" or Lighthouse audit | |
| 3 | Keyboard navigation | Tab through insurance assessment — all questions reachable via keyboard | |
| 4 | Screen reader | VoiceOver: read through Results page. Animated counters have proper context. | |
| 5 | Focus indicators | Tab through nav links — visible focus ring on each | |
| 6 | `aria-live` regions | Form success/error messages have `role="alert"` or `aria-live="polite"` | |
| 7 | Decorative icons | Lucide icons in stats/badges have `aria-hidden="true"` | |

---

## Quick Reference: GHL Integration IDs

| Integration | ID / URL |
|-------------|----------|
| Newsletter signup form | `WeCKj6eththzMepQtObZ` |
| Bottleneck Audit form | `p7TQrdK8KZEQfC9JWtQT` |
| Insurance capture webhook | `https://services.leadconnectorhq.com/hooks/formSubmit` |
| Strategy/Intro booking widget | `uslCIRV9xwkJQlHC1Rl7` |
| 1:1 Coaching booking widget | `HDMThBdATyMVW7HFteZe` |
| GHL form embed script | `https://link.msgsndr.com/js/form_embed.js` |
