# **EmpireTitleService.com — Performance, SEO/AEO/GEO Execution Plan (Replit)**

**“You are allowed to be wrong, but you are not allowed to be vague.”**

**Targets**

* LCP ≤ 2.5s on 75th percentile mobile

* FCP ≤ 1.8s, TTI ≤ 3.8s, CLS ≤ 0.1, TBT ≤ 200ms

* HTML ≤ 50KB gzipped; JS ≤ 60KB gzipped on landing; CSS ≤ 35KB critical path

* Hero/LCP image decoded by 1.5s on median mobile

---

## **Phase 0 — Baseline & Budgets**

Add Lighthouse CI to the repo with budgets.

 `// lighthouse-budgets.json`  
`[`  
  `{`  
    `"path": "/*",`  
    `"resourceSizes": [`  
      `{"resourceType":"document","budget":60},`  
      `{"resourceType":"script","budget":60},`  
      `{"resourceType":"stylesheet","budget":35},`  
      `{"resourceType":"image","budget":250}`  
    `],`  
    `"timings": [`  
      `{"metric":"first-contentful-paint","budget":1800},`  
      `{"metric":"largest-contentful-paint","budget":2500},`  
      `{"metric":"total-blocking-time","budget":150},`  
      `{"metric":"cumulative-layout-shift","budget":0.1}`  
    `]`  
  `}`  
`]`

1. 

Add Web Vitals RUM to production to capture real users.

 `<script type="module">`  
  `import {onCLS,onFCP,onLCP,onTTFB} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js?module';`  
  `const send = (m)=>navigator.sendBeacon?.('/rum', JSON.stringify(m));`  
  `[onCLS,onFCP,onLCP,onTTFB].forEach(fn=>fn(send));`  
`</script>`

2. 

---

## **Phase 1 — Delivery & Hosting (Replit-aware)**

**Problem:** slow first byte / cold starts and no edge caching.

**Plan**

* Serve everything static where possible. Generate static HTML for top pages (Home, Locations, Services, Blog index, top blog posts). Avoid server-side rendering at request time.

* Put an edge cache/proxy in front of origin. Configure long TTL for hashed assets and short TTL (or stale-while-revalidate) for HTML. If you can’t add a proxy, at least:

  * Use strong caching and compression from Replit’s Node server.

  * Keep assets hashed to enable `Cache-Control: public, max-age=31536000, immutable`.

* Enable HTTP/2 or HTTP/3, Brotli, and ETag.

**Express snippet for Replit server**

`import express from "express";`  
`import compression from "compression";`  
`import path from "path";`

`const app = express();`

`app.use(compression({ level: 6 })); // Brotli via hosting or reverse proxy if available`

`// Security & perf headers`  
`app.use((req,res,next)=>{`  
  `res.set({`  
    `"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",`  
    `"Referrer-Policy": "strict-origin-when-cross-origin",`  
    `"X-Content-Type-Options": "nosniff",`  
    `"Permissions-Policy": "camera=(), geolocation=(), microphone=()",`  
    `"Cross-Origin-Opener-Policy": "same-origin",`  
    `"Cross-Origin-Resource-Policy": "same-origin",`  
    `"Cache-Control": req.path.endsWith(".html")`  
      `? "public, max-age=60, stale-while-revalidate=604800"`  
      `: "public, max-age=31536000, immutable"`  
  `});`  
  `next();`  
`});`

`app.use(express.static("dist", { extensions: ["html"] }));`

`app.listen(process.env.PORT || 3000);`

---

## **Phase 2 — HTML/CSS Critical Path**

**Goals:** inline just enough CSS to paint above-the-fold, delay the rest.

Generate critical CSS per route and inline it in `<head>`. Load the full stylesheet with `rel="preload"` then switch to `rel="stylesheet"`.

 `<style>/* critical.css output per page (≤ 14KB) */</style>`  
`<link rel="preload" as="style" href="/assets/app.abcd1234.css" onload="this.rel='stylesheet'">`  
`<noscript><link rel="stylesheet" href="/assets/app.abcd1234.css"></noscript>`

1.   
2. Remove unused CSS at build with PurgeCSS (or Tailwind’s built-in purge).

3. Avoid blocking imports in CSS (web fonts, @import). No `@import` at all.

Use `content-visibility:auto` for below-the-fold sections; pair with `contain-intrinsic-size`.

 `.belowFold { content-visibility: auto; contain-intrinsic-size: 1px 800px; }`

4. 

---

## **Phase 3 — JavaScript Diet**

**Your numbers show CPU isn’t blocked; still, ship less.**

1. Zero JS on the home hero if possible. No front-end framework hydration above the fold.

Mark all scripts `defer`. Use `type="module"` and avoid legacy bundles. Example:

 `<script type="module" defer src="/assets/main.1234.js"></script>`

2.   
3. Code-split routes and components; lazy-load non-critical widgets (maps, chat, analytics) with `requestIdleCallback` or an IntersectionObserver.

4. Replace heavyweight UI libraries with native HTML/CSS where feasible.

5. Third-party scripts:

   * Load only on pages that truly need them.

   * Add `async` and lazy-load behind user interaction when possible.

   * Use `rel="preconnect"` to their hosts only if they’re guaranteed to load.

---

## **Phase 4 — Images: LCP Fixes First**

**Likely your biggest win.**

1. **Identify the LCP element** on the home and key landing pages. Make it:

   * A compressed, responsive image served as AVIF/WebP with `srcset` and `sizes`.

   * Preloaded and decoded early.

`<link rel="preload" as="image" href="/img/hero-1200.avif" imagesrcset="/img/hero-800.avif 800w, /img/hero-1200.avif 1200w, /img/hero-1600.avif 1600w" imagesizes="(max-width: 800px) 100vw, 1200px" fetchpriority="high">`  
`<picture>`  
  `<source type="image/avif" srcset="/img/hero-800.avif 800w, /img/hero-1200.avif 1200w, /img/hero-1600.avif 1600w" />`  
  `<source type="image/webp" srcset="/img/hero-800.webp 800w, /img/hero-1200.webp 1200w, /img/hero-1600.webp 1600w" />`  
  `<img src="/img/hero-1200.jpg" width="1200" height="720" alt="Title and closing services in Indiana and Ohio" decoding="async" fetchpriority="high">`  
`</picture>`

2. Add explicit `width` and `height` to every `<img>` to stabilize layout (your CLS is already good; keep it that way).

Lazy-load all non-critical images:

 `<img loading="lazy" decoding="async" ...>`

3.   
4. Sprite or inline critical SVG logos/icons.

Build-time image pipeline with Sharp.

 `// scripts/build-images.mjs`  
`import sharp from "sharp";`  
`const sizes = [480, 800, 1200, 1600];`  
`for (const file of ["hero.jpg","team.jpg"]) {`  
  `for (const w of sizes) {`  
    ``await sharp(`src/img/${file}`).resize(w).avif({quality:50}).toFile(`dist/img/${file.replace('.jpg','-'+w+'.avif')}`);``  
    ``await sharp(`src/img/${file}`).resize(w).webp({quality:60}).toFile(`dist/img/${file.replace('.jpg','-'+w+'.webp')}`);``  
  `}`  
`}`

5. 

---

## **Phase 5 — Fonts**

1. Prefer a system-UI stack or subset a single variable font. No more than 2 weights.

Self-host fonts; preload with `crossorigin`.

 `<link rel="preload" as="font" href="/fonts/Inter-var.woff2" type="font/woff2" crossorigin>`  
`<style>`  
`@font-face {`  
  `font-family: 'Inter';`  
  `src: url('/fonts/Inter-var.woff2') format('woff2');`  
  `font-display: swap;`  
  `font-weight: 100 900;`  
`}`  
`body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }`  
`</style>`

2. 

---

## **Phase 6 — Metadata, SEO/AEO/GEO**

1. Unique `<title>` and `<meta name="description">` per page. Keep titles ≤ 60 chars, descriptions 120–160 chars.

2. Canonical URLs. Only one canonical per page.

3. JSON-LD:

   * `Organization` on global pages

   * `LocalBusiness` per office with full NAP, hours, geo, sameAs

   * `Article` for blog posts (headline, author, datePublished, image)

   * `BreadcrumbList` site-wide

4. Open Graph and Twitter Card tags with valid image dimensions (≥ 1200×630).

Sitemap and robots:

 `# robots.txt`  
`User-agent: *`  
`Allow: /`  
`Sitemap: https://empiretitleservice.com/sitemap.xml`

5.   
6. Location pages: one page per city/county targeted. Include service area copy, driving directions, embedded map only when needed (lazy-load), and consistent NAP.

---

## **Phase 7 — Accessibility & UX**

* Proper landmarks: `<header> <nav> <main> <footer>`.

* Alt text on all images; descriptive, not keyword soup.

Color contrast ≥ 4.5:1, visible focus, reduced motion support:

 `@media (prefers-reduced-motion: reduce) {`  
  `* { animation: none !important; transition: none !important; }`  
`}`

* 

---

## **Phase 8 — Security & Integrity**

CSP with strict defaults; allow self and specific asset hosts only.

 `Content-Security-Policy:`  
  `default-src 'self';`  
  `img-src 'self' data:;`  
  `script-src 'self';`  
  `style-src 'self' 'unsafe-inline';`  
  `font-src 'self';`  
  `connect-src 'self';`

*   
* Subresource Integrity for any third-party CDNs you truly must use.

---

## **Phase 9 — Build/Deploy Pipeline**

**Repo layout**

`/src`  
  `/pages        # static HTML or templates`  
  `/styles       # CSS source (Tailwind or vanilla)`  
  `/scripts      # JS modules, code-split`  
  `/img          # source images`  
  `/fonts`  
`/scripts        # build scripts (images, critical CSS)`  
`/dist           # deployable bundle`

**NPM scripts**

`{`  
  `"scripts": {`  
    `"clean": "rimraf dist",`  
    `"images": "node scripts/build-images.mjs",`  
    `"css": "postcss src/styles/main.css -o dist/assets/app.css --env production",`  
    `"crit": "critters dist/*.html", // or use Penthouse for per-route critical CSS`  
    `"html": "node scripts/build-html.mjs", // static render pages`  
    `"minify": "html-minifier-terser --input-dir dist --output-dir dist --collapse-whitespace --minify-css true --minify-js true --file-ext html",`  
    `"build": "npm run clean && npm run html && npm run css && npm run images && npm run minify",`  
    `"serve": "node server.js",`  
    `"ci": "lighthouse-ci autorun --upload.target=temporary-public-storage"`  
  `}`  
`}`

---

## **Phase 10 — Monitoring & Regression Guards**

* Run Lighthouse CI on every PR with the budgets above.

* Store Web Vitals RUM and alert when LCP p75 \> 2.5s for 3 consecutive days.

* Track 404s, Core Web Vitals, and sitemap coverage. Fix broken internal links immediately.

---

## **Triage Checklist for Your Snapshot**

* Replace hero/LCP image with AVIF/WebP, responsive `srcset`, and `fetchpriority="high"`.

* Inline route-specific critical CSS; delay full CSS.

* Remove any render-blocking CSS `@import` or large icon libraries.

* Eliminate non-critical scripts from the home page; defer all others.

* Add strong caching and Brotli; hashed filenames for assets.

* Convert top pages to static HTML to avoid origin cold starts.

* Preload fonts or switch to system stack; limit weights.

* Lazy-load all below-the-fold images and embeds.

* Confirm HTTP/2 or HTTP/3 is active; keep connections warm with `preconnect` only where it pays off.

* Validate JSON-LD for Organization, LocalBusiness per office, and Article on blogs.

---

## **Acceptance Criteria**

* Mobile p75: LCP ≤ 2.5s, FCP ≤ 1.8s, TTI ≤ 3.8s, CLS ≤ 0.1, TBT ≤ 150ms.

* Home page total JS ≤ 60KB gzipped; CSS critical ≤ 14KB inline; total CSS ≤ 35KB.

* No unused CSS \> 10%.

* All images responsive and modern formats; no images \> 250KB on mobile.

* Budgets enforced in CI; build fails if exceeded.

---

### **Why your numbers look like that (plain English)**

* **LCP 13s:** the main above-the-fold image or hero is heavy and not prioritized, plus the origin is slow to deliver first bytes when it spins up.

* **FCP/TTI \~12–13s:** styles and the first paint are delayed by network and CSS delivery; JavaScript isn’t blocking, but nothing useful renders until the big assets arrive.

* **TBT/CLS good:** at least you’re not torturing CPUs or shuffling layouts. Keep that streak alive.

Ship this plan, and your site stops feeling like dial-up in a thunderstorm.

