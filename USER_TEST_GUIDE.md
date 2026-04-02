# KeanOnBiz — User Test Guide & Funnel Audit

> **Date**: April 2, 2026
> **Version**: 1.2
> **Prepared for**: Jeremy Kean, Kianna, QA Testers

---

## Table of Contents

1. [Site Map & Route Inventory](#1-site-map--route-inventory)
2. [Funnel Diagrams](#2-funnel-diagrams)
3. [Insurance Revenue Leak Calculator — Full Test Script](#3-insurance-revenue-leak-calculator--full-test-script)
4. [Bottleneck Audit (General Assessment) — Test Script](#4-bottleneck-audit-general-assessment--test-script)
5. [Calendar / Booking Pages — Test Script](#5-calendar--booking-pages--test-script)
6. [Homepage — CTA & Flow Audit](#6-homepage--cta--flow-audit)
7. [Blog — Spot-Check 3 Posts](#7-blog--spot-check-3-posts)
8. [Newsletter Signup — Test Script](#8-newsletter-signup--test-script)
9. [API Endpoint Verification](#9-api-endpoint-verification)
10. [Known Issues & Inconsistencies](#10-known-issues--inconsistencies)
11. [Mobile / Responsive Checklist](#11-mobile--responsive-checklist)
12. [Accessibility Quick-Check](#12-accessibility-quick-check)

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
| POST | `/api/insurance-assessment/capture` | Email gate capture + GHL forward |
| POST | `/api/insurance-assessment/email-results` | Email results from results page |
| GET/POST | `/api/portfolio/*` | Portfolio CRUD |
| GET/POST | `/api/pain-points/*` | Pain points CRUD |
| GET/POST | `/api/micropod/*` | Podcast management |
| GET/POST | `/api/content-studio/*` | Blog content management |
| GET/POST | `/api/newsletter/*` | Newsletter management |
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
[Email Gate]  →  POST /api/insurance-assessment/capture  →  GHL webhook
   ↓ (submit email OR skip)
[Results Page]
   ├── Full results if email submitted
   └── Summary only if skipped
   ↓
CTA: "Book Your Strategy Call" → /jeremys-calendar-intro
   ↓
[CalendarIntro Page] — GHL booking widget (uslCIRV9xwkJQlHC1Rl7)
```

### Funnel B: General Bottleneck Audit

```
[Homepage / Nav / Blog CTAs]
   ↓
/assessment  (embedded GHL form p7TQrdK8KZEQfC9JWtQT)
   ↓
[GHL handles scoring, nurture emails/SMS]
   ↓
Discovery Call booking (GHL-side automation)
```

### Funnel C: Newsletter Signup

```
[Homepage footer newsletter form]
   ↓
POST to GHL form WeCKj6eththzMepQtObZ (client-side direct)
   ↓
GHL nurture sequence
```

### Funnel D: Content → Booking

```
/blog/:slug  (blog post with CTAs)
   ↓
CTA to /assessment OR /jeremys-calendar-intro
   ↓
(enters Funnel B or books directly)
```

---

## 3. Insurance Revenue Leak Calculator — Full Test Script

### Pre-Conditions
- Browser: Chrome (desktop) + Safari (mobile)
- Clear cache/cookies before starting

### Test 3A: Landing Page (`/insurance`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/insurance` | Landing page loads. Hero: "Stop Running Your Agency. Start Leading It." Red/dark theme. | |
| 2 | Verify Jeremy's avatar | Small round avatar with "Jeremy Kean / Agency Coach & CEO Sidekick" label | |
| 3 | Verify stats bar | Shows: $3.3K avg leak, 40% recovery, 3 min, 100% confidential | |
| 4 | Verify "Problems Nobody Talks About" section | 4 cards: accountability, sales, life production, owner dependency | |
| 5 | Verify "How It Works" section | 3 steps: Take Assessment → See Numbers → Build Plan | |
| 6 | Click "Find Your Revenue Leak" (hero CTA) | Scrolls/transitions to assessment quiz. URL stays `/insurance` or updates to `/insurance/assessment` | |
| 7 | Click "See How It Works" | Smooth scrolls to #how-it-works section | |
| 8 | Verify NO mentions of: State Farm, eCRM, NASFA, AI, automation | Landing page should only reference: systems, processes, discipline, training, coaching | |

### Test 3B: Assessment Quiz (Phase 1)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | After clicking CTA, quiz loads | 3-column layout: leakage sidebar (left), question card (center), progress sidebar (right) | |
| 2 | Progress bar shows | "Phase 1 of 2" with question counter | |
| 3 | Answer Q1 (radio question) | Auto-advances to Q2 after brief delay. Leakage counter updates. | |
| 4 | Click "Previous" on Q2 | Returns to Q1 with previous answer preserved | |
| 5 | Answer Q1-Q11 sequentially | Leakage counter climbs. Categories fill in progress sidebar. | |
| 6 | Answer Q12 | **Halfway interstitial** appears. Shows current leakage total. | |
| 7 | Click "Continue" on interstitial | Returns to Q13 | |
| 8 | Complete Q13-Q23 | **Phase transition interstitial** appears after Q23 | |
| 9 | Click "Continue" on phase transition | Phase 2 begins. Progress bar updates to "Phase 2 of 2" | |

### Test 3C: Assessment Quiz (Phase 2)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Q24 loads | Numeric input question (e.g., premium volume) | |
| 2 | Enter numeric value, click Next | Advances to Q25 | |
| 3 | Complete Q24-Q30 | After Q30, **Email Gate** screen appears | |

### Test 3D: Email Gate

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Email gate loads | Shows "Assessment Complete!" with green checkmark | |
| 2 | Verify leakage/potential display | Red "-$X,XXX leaking/mo" and green "+$X,XXX potential/mo" | |
| 3 | Enter invalid email (e.g., "test") | HTML5 validation prevents submit | |
| 4 | Enter valid email, click "See My Results" | Button shows "Sending..." → success → redirects to Results | |
| 5 | Verify API call | Network tab: POST to `/api/insurance-assessment/capture` with JSON body containing: email, leakage, potential, annualRecovery, costSaved, revenueGained, hoursRecovered, categoryBreakdown, answers | |
| 6 | Click "Skip — show me the summary only" | Goes to Results page but **without** full category breakdown | |

### Test 3E: Results Page

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Results load (email submitted path) | Big green "$X,XXX/mo" recovery potential at top | |
| 2 | Three summary cards | Red (leaking), Green (recovery), Blue (hours/wk) | |
| 3 | "Where You're Losing Money" section | Category bars with dollar amounts | |
| 4 | "Where You'd Gain It Back" section | Cost Savings + Revenue Gained columns | |
| 5 | "Your Answers at a Glance" accordion | Expandable. Shows all 30 answers. Worst answers highlighted red. | |
| 6 | Jeremy's pitch section | Dark card with personalized copy | |
| 7 | Testimonials | 3 testimonial cards (Beth P., Anissa V., Shelby F.) | |
| 8 | CTA button | "Book Your Strategy Call" → links to `/jeremys-calendar-intro` | |
| 9 | **No duplicate email form** | If email was submitted at gate, NO second email form appears. Instead: "A PDF copy of your results has been sent to your email." | |
| 10 | Results load (skipped email path) | Recovery potential shows, but category breakdown is **hidden** | |
| 11 | Email form appears (skip path) | "Email My Results" form appears below CTA since email wasn't captured | |

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
| 1 | Navigate to `/assessment` | Page loads with embedded GHL form | |
| 2 | Verify form captures: name, email, phone + diagnostic questions | GHL form ID: `p7TQrdK8KZEQfC9JWtQT` | |
| 3 | Submit form with test data | Form submits successfully. Confirmation message appears. | |
| 4 | Verify GHL receives submission | Check GHL dashboard for the test contact | |

---

## 5. Calendar / Booking Pages — Test Script

### Test 5A: Calendar Selector (`/jeremys-calendar`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/jeremys-calendar` | Page loads. Jeremy's photo (round, gold border). "Book with Jeremy" heading. | |
| 2 | Verify 3 session cards | Strategy (60 min), Coaching (60 min, "Clients Only" badge), Quick Connect (15-20 min) | |
| 3 | Click Strategy card | Navigates to `/jeremys-calendar-strategy` | |
| 4 | Click Coaching card | Navigates to `/jeremys-calendar-coaching` | |
| 5 | Click Quick Connect card | Navigates to `/jeremys-calendar-intro` | |
| 6 | "Not Sure?" section | CTA: "Schedule Quick Connect" → `/jeremys-calendar-intro` | |

### Test 5B: Strategy Call / CalendarIntro (`/jeremys-calendar-intro`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/jeremys-calendar-intro` | Dark page with red accents. Jeremy's photo (large, rectangular). | |
| 2 | Verify badge | "60 MINUTE STRATEGY SESSION" | |
| 3 | Verify headline | "Let's Build Your Recovery Plan" | |
| 4 | Stats row | 35+ Years, 60+ Coached, $4.2K Avg Recovery, 100% Confidential | |
| 5 | "What We'll Cover" checklist | 5 items including "Review your Revenue Leak Calculator results" | |
| 6 | Booking widget loads | GHL iframe with widget `uslCIRV9xwkJQlHC1Rl7` | |
| 7 | Testimonials section | 3 testimonials (Beth P., Agency Owner, Anissa V.) with star ratings | |
| 8 | Back links | "Back to Insurance Coaching" → `/insurance`, "Back to Home" → `/` | |

### Test 5C: Strategy & Working Sessions (`/jeremys-calendar-strategy`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Page loads | Blue/gold theme. "Strategy & Working Sessions" heading. | |
| 2 | Booking widget | Same widget ID `uslCIRV9xwkJQlHC1Rl7` | |
| 3 | Back link | "All Booking Options" → `/jeremys-calendar` | |

### Test 5D: 1:1 Coaching (`/jeremys-calendar-coaching`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Page loads | "Clients Only" gold badge. Blue/gold theme. | |
| 2 | Booking widget | **Different** widget ID: `HDMThBdATyMVW7HFteZe` | |
| 3 | Back link | "All Booking Options" → `/jeremys-calendar` | |

---

## 6. Homepage — CTA & Flow Audit

### Test 6A: Hero Section

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/` | Hero loads with Manumation book cover (floating animation on desktop) | |
| 2 | Primary CTA | "Take the Free Bottleneck Audit" → `/assessment` | |
| 3 | Book CTA (desktop) | "Get the Book" → `https://manumation.ai` (opens new tab) | |
| 4 | Book CTA (mobile) | Mobile book card with "Get the Book" → `https://manumation.ai` | |
| 5 | Social proof badges | "100+ Businesses Helped", "15+ Hours/Week Saved", "35 Years Experience" | |
| 6 | Quick testimonial (desktop) | Ryan Templeton testimonial with photo | |

### Test 6B: Services Section

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Scroll to "Choose Your Journey" | 3 cards: DIY, Do With You, Done For You | |
| 2 | Verify each CTA links correctly | DIY → book link, DWY → `/jeremys-calendar-intro`, DFY → `/jeremys-calendar-strategy` | |

### Test 6C: Newsletter Section (Footer Area)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Scroll to newsletter signup | Email input + Subscribe button | |
| 2 | Enter email + click Subscribe | Shows "You're subscribed! Check your inbox." | |
| 3 | Verify network request | POST to GHL form `WeCKj6eththzMepQtObZ` | |

---

## 7. Blog — Spot-Check 3 Posts

### Test 7A: Blog Index (`/blog`)

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | Navigate to `/blog` | Blog index loads with posts | |
| 2 | Content pillar filter | Filters available: Pain, Hope, Philosophy, Proof, Vision | |
| 3 | Click a pillar filter | Posts filter to that pillar only | |
| 4 | Click any post | Navigates to `/blog/:slug` | |

### Test 7B: Individual Blog Post

Pick 3 random blog posts and check:

| # | Check | Expected Result | Pass? |
|---|-------|-----------------|-------|
| 1 | Page loads without errors | No blank screen, no console errors | |
| 2 | Breadcrumbs present | Navigation breadcrumbs visible at top | |
| 3 | Content renders (no raw HTML) | Article body is properly formatted, images load | |
| 4 | CTAs present | Some form of CTA (assessment link, calendar link, or newsletter) | |
| 5 | SEO meta tags | Check page source: title, description, og:image present | |

---

## 8. Newsletter Signup — Test Script

| # | Step | Expected Result | Pass? |
|---|------|-----------------|-------|
| 1 | On homepage, scroll to newsletter form | Form visible with email input | |
| 2 | Submit with empty email | HTML5 validation prevents submit | |
| 3 | Submit with valid email | Shows success message. Network: POST to GHL. | |
| 4 | Navigate to `/newsletter` | Newsletter archive page loads | |

---

## 9. API Endpoint Verification

### 9A: Insurance Assessment Capture

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

**Expected**: `200 OK` with `{ "success": true, "ghlCaptured": true/false }`

**Rate limit**: 10 requests per 15-minute window.

### 9B: Insurance Email Results

```
POST /api/insurance-assessment/email-results
Content-Type: application/json

{ "email": "test@agency.com" }
```

**Expected**: `200 OK` with `{ "success": true }`

### 9C: Validation Tests

| Test | Input | Expected |
|------|-------|----------|
| Missing email | `{}` | 400: "A valid email is required" |
| Invalid email | `{"email": "notanemail"}` | 400: "A valid email is required" |
| Rate limit exceeded | 11 rapid requests | 429: "Too many submissions" |

---

## 10. Known Issues & Inconsistencies

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
| 6 | **Backend Server workflow status** | Workflow config | The "Backend Server" workflow shows as failed. The site may be running entirely via `pnpm dev` (the "Start application" workflow). Confirm which workflow should be active. |

---

## 11. Mobile / Responsive Checklist

Test on iPhone 12/13 size (390×844) and iPad (768×1024):

| # | Page | Check | Pass? |
|---|------|-------|-------|
| 1 | `/insurance` | Hero stacks vertically. CTA buttons full-width. Preview card hidden on mobile (lg:block). | |
| 2 | `/insurance` (quiz) | 3-column layout stacks: question card on top, sidebars below. Touch-friendly radio buttons. | |
| 3 | `/insurance` (results) | Cards stack. Counter animations work. Accordion expands. | |
| 4 | `/jeremys-calendar-intro` | Photo + text stack. Booking widget scrollable. | |
| 5 | `/` | Hero stacks. Mobile book card appears (lg:hidden). Nav hamburger works. | |
| 6 | `/blog` | Post cards stack. Filters wrap. | |
| 7 | Navigation | Hamburger menu opens/closes. Links work. Escape key closes menu. | |

---

## 12. Accessibility Quick-Check

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
