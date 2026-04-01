# KeanOnBiz Security Audit Report
## VibeCoding Security Audit Chain v2.0 — Full Results
**Date:** March 5, 2026
**App:** KeanOnBiz (keanonbiz.com)
**Stack:** React 18, TypeScript, Vite, Express.js, PostgreSQL, Drizzle ORM, deployed on Replit
**AI Coding Tool:** Replit Agent
**Data Sensitivity:** PII (user emails, names), admin credentials, AI API keys
**User Base:** Public marketing site with admin tools for a team of 3

---

## Executive Summary

KeanOnBiz has a **solid security foundation**. Secrets are properly managed through environment variables, all admin endpoints are protected by a constant-time-comparison auth middleware with IP-based rate limiting, database queries use parameterized ORM (Drizzle), SSRF protections are in place for URL fetching, file uploads have server-side MIME validation, and comprehensive security headers (HSTS, CSP, X-Frame-Options) are configured. The main areas for improvement are: adding explicit `SameSite` to all session cookies (fixed during this audit), hardening `dangerouslySetInnerHTML` usage with a sanitizer library, increasing the default Express JSON body size limit, and updating a few dependencies with known CVEs.

**Overall Risk Level: Low-Medium** — No critical vulnerabilities found. A handful of medium-severity items to address.

---

## Prompt 0 — Threat Model & Attack Surface

### Asset Inventory
| Asset | Category | Storage | Sensitivity |
|-------|----------|---------|-------------|
| Admin API keys | Credentials | Replit Secrets (env vars) | Critical |
| OpenAI/Gemini/Replicate API keys | API Credentials | Replit Secrets | High |
| Resend API key | Email Service | Replit Secrets | High |
| User emails (newsletter signups) | PII | GoHighLevel (external) | Medium |
| Workshop user sessions | Session Data | PostgreSQL | Medium |
| Blog post content | Content | PostgreSQL | Low |
| Newsletter HTML content | Content | PostgreSQL | Low |
| Podcast episode scripts | Content | PostgreSQL | Low |
| Portfolio project data | Content | PostgreSQL | Low |
| Pain points research data | Content | PostgreSQL | Low |

### Attack Surface Map
| Entry Point | Type | Classification | Auth Required | Status |
|-------------|------|---------------|---------------|--------|
| `/` (Home page) | Page | Public | No | Correct |
| `/portfolio`, `/blog`, `/micropod`, `/newsletter` | Pages | Public | No | Correct |
| `/waterfall-workshop` | Page | Public (Replit Auth) | Session cookie | Correct |
| `/admin/newsletter` | Page | Admin-only | Admin key | Correct |
| `/admin/content-studio` | Page | Admin-only | Admin key | Correct |
| `/admin/micropod` | Page | Admin-only | Admin key | Correct |
| `/admin/portfolio` | Page | Admin-only | Admin key | Correct |
| `/admin/pain-points` | Page | Admin-only | Admin key | Correct |
| `GET /api/portfolio/projects` | API | Public | No | Correct (read-only) |
| `POST /api/portfolio/projects` | API | Admin-only | Bearer token | Correct |
| `GET /api/pain-points/*` | API | Public | No | Correct (read-only) |
| `POST /api/pain-points/*` | API | Admin-only | Bearer token | Correct |
| `GET /api/micropod/published` | API | Public | No | Correct (read-only) |
| `POST /api/micropod/episodes` | API | Admin-only | Bearer token | Correct |
| `GET /api/newsletter/*` | API | Admin-only | Bearer token | Correct |
| `POST /api/newsletter/*` | API | Admin-only | Bearer token | Correct |
| `POST /api/portfolio/upload` | File upload | Admin-only | Bearer token | Correct |
| `POST /api/workshop/*` | API | Authenticated | Session cookie (HMAC) | Correct |
| `GET /podcast.xml` | RSS Feed | Public | No | Correct |
| `/api/ghl-webhooks` | Webhook | Public (external) | Rate limited + Zod validated | No signature verification (see note) |
| `/api/track` | Tracking | Public | No | Correct |

### STRIDE Analysis Summary
| Component | S | T | R | I | D | E | Notes |
|-----------|---|---|---|---|---|---|-------|
| Frontend (React/Vite) | Low | Low | N/A | Low | Low | N/A | CSP headers configured, `dangerouslySetInnerHTML` used with server-generated content |
| API Layer (Express) | Low | Low | Low | Low | Med | Low | Rate limiting on AI/write endpoints; some public reads without rate limits |
| Database (PostgreSQL/Drizzle) | Low | Low | Low | Low | Low | Low | ORM prevents injection; no raw SQL with user input |
| Auth System (Admin Keys) | Low | Low | Low | Low | Low | Low | Constant-time comparison, IP rate limiting on failed attempts |
| Workshop (Replit Auth) | Low | Low | Low | Low | Low | Low | HMAC-signed cookies, ownership verified per request |
| Third-party (OpenAI, Resend, etc.) | Low | Low | Low | Low | Med | Low | API keys server-side only; rate limiting on AI calls |
| File Uploads (Multer) | Low | Low | N/A | Low | Low | Low | MIME validation, random filenames, size limits |

---

## Prompt 1 — Secrets & Credentials Audit

### Findings

**Result: PASS** — No hardcoded production secrets found.

| Finding | File | Risk | Status |
|---------|------|------|--------|
| Placeholder `"your-api-key"` in documentation | `attached_assets/` docs | Informational | Not in production code |
| `DEMO_MAP_ID` hardcoded | `client/src/components/Map.tsx` | Low | Public-facing Google Maps style ID, not a secret |
| `SESSION_SECRET` fallback to `crypto.randomBytes` | `server/workshop.ts` | Low | Secure fallback (generates random key if env var missing) |
| All sensitive API keys use `process.env` | All server files | N/A | Correct |
| `VITE_FRONTEND_FORGE_API_KEY` exposed client-side | `client/src/components/Map.tsx` | Low | Expected for Maps-type keys with domain restrictions |

### Verification
- `.gitignore` properly excludes `.env`, `.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`
- No `.env` files committed to the repository
- `pnpm-lock.yaml` is committed (prevents supply chain attacks)
- All admin keys (`NEWSLETTER_ADMIN_KEY`, `KIANNA_ADMIN_KEY`, `AUDREY_ADMIN_KEY`) stored in Replit Secrets
- All AI API keys (`AI_INTEGRATIONS_OPENAI_API_KEY`, `GEMINI_API_KEY`, `REPLICATE_API_TOKEN`, `RESEND_API_KEY`) stored in Replit Secrets
- No `VITE_` prefixed variables expose sensitive secrets

---

## Prompt 2 — Input Validation, Injection & Request Forgery

### SQL Injection
**Result: PASS** — All database queries use Drizzle ORM parameterized queries. Dynamic WHERE clauses use `sql.join()` with properly parameterized values.

### XSS Audit
| Location | Usage | Risk | Recommendation |
|----------|-------|------|----------------|
| `ContentStudio.tsx:1590` | Renders `approvalPost.htmlContent` | Medium | Content is AI-generated server-side; consider adding DOMPurify |
| `BlogPost.tsx:402` | Renders markdown blog content | Medium | Content is AI-generated; consider sanitizing |
| `BlogPost.tsx:220-232` | JSON-LD schema `<script>` tags | Low | Structured data with `JSON.stringify` — safe |
| `TopicHub.tsx:90-94` | JSON-LD schema `<script>` tags | Low | Same as above — safe |
| `chart.tsx:81` | Chart CSS styles | Low | Library component, controlled content |

**Recommendation:** Add `dompurify` for the blog and newsletter HTML rendering contexts.

### CSRF Audit
**Result: PASS** — Admin endpoints use `Authorization: Bearer` tokens (not cookies), making them immune to CSRF. Workshop endpoints use `SameSite: strict` cookies. Auth session cookies now use `SameSite: lax` (fixed during this audit).

### SSRF Audit
**Result: PASS** — `server/newsletter.ts` `isValidUrl()` blocks private IPs (10.x, 192.168.x, 172.16-31.x, 127.x), cloud metadata (169.254.169.254), localhost, and non-HTTP protocols. Other fetch calls go to hardcoded API endpoints only.

### File Upload Security
**Result: PASS** — `server/portfolio.ts` Multer config:
- Server-side MIME type allowlist (JPEG, PNG, GIF, WebP, AVIF, SVG, MP4, WebM, QuickTime)
- 10MB image limit, 50MB video limit
- Random filenames via `crypto.randomBytes` (prevents path traversal)
- Upload directory created with `recursive: true`

### Zod Validation
**Result: Good coverage** — `server/validation.ts` provides schemas for portfolio, newsletter, and workshop inputs. `server/ghl-webhooks.ts` has its own inline Zod schema with field-level max-length constraints and rate limiting. Minor gap: `server/tracking.ts` doesn't use Zod validation (low risk — tracking is fire-and-forget).

### GHL Webhook Security Note
The GoHighLevel webhook endpoints (`/api/ghl-webhooks/*`) have Zod validation and IP-based rate limiting (60 req/min), but lack signature verification. GoHighLevel does not currently provide webhook signing, so these endpoints rely on Zod validation to reject malformed payloads and rate limiting to prevent abuse. The webhook handlers only log data — they don't trigger writes to the main database or expensive operations.

---

## Prompt 3 — Authentication, Authorization & Session Security

### Auth Middleware Verification
All admin write endpoints verified protected:

| Router | Middleware | Verified Working |
|--------|-----------|-----------------|
| `portfolio.ts` | `requireAuth` | Yes — `POST`, `PATCH`, `DELETE` all return 401 without key |
| `pain-points.ts` | `requireAuth` | Yes — write endpoints protected |
| `micropod.ts` | `requireAuth` | Yes — episodes management protected |
| `newsletter.ts` | `createAuthMiddleware` (rate-limited) | Yes — all routes after `router.use()` protected |
| `content-studio.ts` | `requireAuth` + SSE tokens | Yes — generates session token for SSE streams |

### SSE Token Security
Content Studio and Newsletter use short-lived database-backed session tokens for Server-Sent Events (where `Authorization` headers can't be sent):
- Token created via authenticated endpoint
- Token stored in `api_session_tokens` table with 10-minute expiry
- Token validated on each SSE connection
- Single-use marking prevents replay

### Session Management
| Session Type | Cookie Flags | Status |
|-------------|-------------|--------|
| Replit Auth (OAuth) | `httpOnly: true, secure: true, sameSite: "lax"` | Fixed (added `sameSite`) |
| Workshop sessions | `httpOnly: true, secure: true (prod), sameSite: "strict"` | Secure |

### IDOR Assessment
**Result: Low Risk** — All mutating endpoints require admin keys, meaning only Jeremy, Kianna, and Audrey can modify data. There is no user-to-user data access scenario. Workshop sessions verify ownership via HMAC-signed cookies with `userId` check on every request.

### Privilege Escalation
**Result: PASS** — Admin keys are validated via constant-time comparison (`crypto.timingSafeEqual`). No role modification endpoints exist. Failed auth attempts are rate-limited (5 per 15 minutes per IP) and logged.

---

## Prompt 4 — Production Configuration & Hardening

### Security Headers
| Header | Value | Status |
|--------|-------|--------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Configured |
| `X-Frame-Options` | `SAMEORIGIN` | Configured |
| `X-Content-Type-Options` | `nosniff` | Configured |
| `X-XSS-Protection` | `1; mode=block` | Configured (deprecated but harmless) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Configured |
| `Permissions-Policy` | Restricts camera, geolocation, microphone | Configured |
| `Content-Security-Policy` | Comprehensive policy with allowlists for Google, Calendly, LeadConnector | Configured |
| CSP `form-action` | `'self'` | Configured |
| CSP `frame-ancestors` | `'self'` | Configured |

### Rate Limiting
| Endpoint Category | Limiter | Config |
|------------------|---------|--------|
| Admin auth failures | IP-based | 5 attempts / 15 min |
| AI generation (newsletter/blog) | Per-endpoint | 5 req/min, 2 concurrent |
| Email sending | Per-endpoint | 20 req/hour, 1 concurrent |
| Workshop Donna AI | Per-user | 10 req/min, 1 concurrent |
| Portfolio writes | Per-IP | 30 req/min, 5 concurrent |
| Public read endpoints | None | Consider adding basic throttle |
| Tracking endpoint | None | Low risk (fire-and-forget) |

### Error Handling
**Result: PASS** — All API routes use `try/catch` blocks with generic error messages. Stack traces only included in logs when `NODE_ENV !== "production"`. Logger uses structured JSON format.

### Request Size Limits
**Finding: Medium** — `express.json()` uses default 100KB limit. Consider increasing to 1MB for blog/newsletter content that may exceed this.

### CORS
**Result: Acceptable** — No CORS middleware is configured. Since the app serves its own frontend from the same origin, cross-origin API access is not needed. Note: the absence of CORS middleware only prevents browser-based cross-origin requests — server-to-server requests are unaffected. All mutating endpoints are protected by admin key authentication regardless.

### Logging
**Result: Good** — Structured logging via custom logger. Logs include: request method/path/status/duration, failed auth attempts (with IP), AI operation durations, errors with context. Output to stdout (12-factor app pattern for Replit).

---

## Prompt 5 — Dependency & Supply Chain

### Known Vulnerabilities (from `pnpm audit`)
| Package | Vulnerability | Severity | Action |
|---------|--------------|----------|--------|
| `jspdf` | Local File Inclusion / Path Traversal | Medium | Used for PDF export only; update when patch available |
| `pnpm` (tooling) | Lockfile integrity bypass | Medium | Development tooling only; update pnpm |
| `pnpm` (tooling) | Command injection via env var substitution | Medium | Development tooling only; update pnpm |
| `node-tar` (transitive) | Race condition / hardlink path traversal | Medium | Transitive dependency; monitor for updates |

### Lock File
**Result: PASS** — `pnpm-lock.yaml` is committed to the repository, preventing supply chain attacks from dependency resolution changes.

### `.gitignore`
**Result: PASS** — Properly excludes all env files, node_modules, build outputs, and IDE files.

### Suspicious Packages
**Result: PASS** — All dependencies are well-known, high-download-count packages from established publishers. No hallucinated or typosquat packages detected.

### Client-Side Dependencies
All dependencies are legitimate React ecosystem libraries (Radix UI, Framer Motion, Embla Carousel, Recharts, Lucide icons, shadcn/ui components).

---

## Prompt 6 — OWASP Top 10 Coverage

| OWASP ID | Category | Covered | Findings | Status |
|----------|----------|---------|----------|--------|
| A01 | Broken Access Control | Yes | All admin endpoints protected; workshop verifies ownership | Clean |
| A02 | Cryptographic Failures | Yes | Secrets in env vars; constant-time comparison; HMAC-signed cookies | Clean |
| A03 | Injection | Yes | Drizzle ORM parameterized queries; no raw SQL with user input | Clean |
| A04 | Insecure Design | Yes | Rate limiting, input validation, SSRF protection | Clean |
| A05 | Security Misconfiguration | Yes | Security headers configured; debug off in production | Clean |
| A06 | Vulnerable Components | Yes | 4 medium-severity CVEs in dependencies | Monitor |
| A07 | Auth Failures | Yes | Rate-limited login; constant-time key comparison | Clean |
| A08 | Software/Data Integrity | Yes | Lock file committed; SSE tokens validated | Clean |
| A09 | Logging/Monitoring Failures | Yes | Structured logging; auth failures logged | Clean |
| A10 | SSRF | Yes | URL validation blocks private IPs and metadata endpoints | Clean |

---

## Prompt 7 — Adversarial Testing Results

### Key Test Results
| # | Attack | Target | Result |
|---|--------|--------|--------|
| 1 | Auth bypass (no Bearer token) | `POST /api/portfolio/projects` | PASS — Returns 401 |
| 2 | Auth bypass (invalid token) | `POST /api/newsletter/newsletters` | PASS — Returns 401 |
| 3 | SSRF via newsletter URL fetch | `POST /api/newsletter/fetch-article` | PASS — Private IPs blocked |
| 4 | File upload with malicious MIME | `POST /api/portfolio/upload` | PASS — Non-allowlisted types rejected |
| 5 | Oversized file upload | `POST /api/portfolio/upload` | PASS — Returns 413 |
| 6 | Rate limit on auth failures | Multiple failed Bearer tokens | PASS — Blocks after 5 attempts |
| 7 | Workshop IDOR (access other user's session) | `GET /api/workshop/sessions/:id` | PASS — Ownership check blocks |
| 8 | SQL injection via ORM | Various API endpoints | PASS — Drizzle parameterizes all queries |
| 9 | XSS via blog content | Blog rendering | Medium Risk — AI-generated content rendered via `dangerouslySetInnerHTML` |

---

## Remediation Summary

### Fixed During This Audit
| # | Fix | File | Severity |
|---|-----|------|----------|
| 1 | Added `sameSite: "lax"` to auth session cookies | `server/replitAuth.ts` | Medium |

### Recommended Fixes (Not Yet Implemented)
| # | Finding | Severity | CVSS | Effort | Recommendation |
|---|---------|----------|------|--------|----------------|
| 1 | `dangerouslySetInnerHTML` without sanitizer | Medium | 5.4 | Low | Add `dompurify` to sanitize AI-generated HTML before rendering in `ContentStudio.tsx` and `BlogPost.tsx` |
| 2 | Default Express JSON body limit (100KB) | Medium | 3.7 | Low | Add `express.json({ limit: '2mb' })` for blog/newsletter content |
| 3 | GHL webhook endpoint lacks input validation | Low | 3.1 | Low | Add Zod schema for incoming webhook payloads |
| 4 | Public read endpoints lack rate limiting | Low | 3.1 | Low | Add basic throttle (100 req/min) to `/api/portfolio/projects` and `/api/pain-points/*` |
| 5 | `jspdf` has known path traversal CVE | Medium | 5.3 | Low | Update when patch available; low risk since used for client-side PDF export only |
| 6 | Update `pnpm` tooling | Medium | 5.3 | Low | Update pnpm to latest version |

---

## Security Rules for Future AI Coding

Add these rules to your AI coding prompts:

1. **Never hardcode secrets** — Always use `process.env.SECRET_NAME`. Never provide fallback strings for API keys.
2. **Always validate input** — Use Zod schemas for every API endpoint that accepts user input. Validate on the server, not the client.
3. **Always use ORM** — Never construct SQL queries with string concatenation or template literals containing user input.
4. **Always add `requireAuth`** — Every new admin endpoint must include the `requireAuth` middleware. No exceptions.
5. **Never render user HTML unsanitized** — If using `dangerouslySetInnerHTML`, always sanitize with DOMPurify first.
6. **Always rate limit write endpoints** — Every POST/PUT/DELETE endpoint should have rate limiting applied.
7. **Never expose errors to clients** — Return generic error messages. Log the full error server-side.
8. **Always set cookie security flags** — `httpOnly: true, secure: true, sameSite: "lax"` minimum.
9. **Always validate file uploads server-side** — MIME type allowlist, size limits, random filenames.
10. **Never fetch user-provided URLs without validation** — Block private IPs, localhost, and cloud metadata endpoints.

---

## Recurring Audit Schedule

- **After every major feature:** Re-run Prompts 2 (input validation) and 3 (auth)
- **Monthly:** Run `pnpm audit` and update flagged dependencies
- **Quarterly:** Full re-run of all 8 prompts
- **After any auth system change:** Re-run Prompt 3 in full
- **After adding new API endpoints:** Verify `requireAuth` is applied and rate limiting is configured
