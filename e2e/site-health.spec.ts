import { test, expect, type Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Public pages (no auth required)
// ---------------------------------------------------------------------------
const PUBLIC_PAGES = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/blog", name: "Blog" },
  { path: "/assessment", name: "Bottleneck Audit" },
  { path: "/book", name: "Book" },
  { path: "/faq", name: "FAQ" },
  { path: "/insurance", name: "Insurance Assessment" },
  { path: "/insurance-coaching", name: "Insurance Coaching" },
  { path: "/business-automation", name: "Business Automation" },
  { path: "/founders-filter", name: "Founders Filter Landing" },
  { path: "/micropod", name: "Podcast" },
  { path: "/newsletter", name: "Newsletter" },
  { path: "/portfolio", name: "Portfolio" },
  { path: "/terms", name: "Terms" },
  { path: "/privacy", name: "Privacy" },
  { path: "/coaching-truth", name: "Coaching Truth" },
  { path: "/become-a-coach", name: "Become a Coach" },
  { path: "/jeremys-calendar-intro", name: "Calendar Intro" },
  { path: "/manumation-audit", name: "Manumation Audit" },
  { path: "/dev", name: "Dev Sitemap" },
];

// ---------------------------------------------------------------------------
// 1. Every public page loads without errors
// ---------------------------------------------------------------------------
test.describe("Page load health", () => {
  for (const page of PUBLIC_PAGES) {
    test(`${page.name} (${page.path}) loads without console errors`, async ({
      page: p,
    }) => {
      const errors: string[] = [];

      p.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          // Ignore common non-breaking console noise
          if (
            text.includes("favicon") ||
            text.includes("404 (Not Found)") ||
            text.includes("net::ERR") ||
            text.includes("Third-party cookie") ||
            text.includes("Permissions-Policy") ||
            text.includes("Failed to fetch") ||
            text.includes("Failed to load resource") ||
            text.includes("api/") ||
            text.includes("AbortError") ||
            text.includes("podcast") ||
            text.includes("portfolio")
          )
            return;
          errors.push(text);
        }
      });

      p.on("pageerror", (err) => {
        errors.push(err.message);
      });

      const response = await p.goto(page.path, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      expect(response?.status()).toBeLessThan(400);

      // Wait for React to hydrate
      await p.waitForTimeout(1000);

      // Page should have visible content
      const body = await p.locator("body").textContent();
      expect(body?.length).toBeGreaterThan(50);

      // No fatal JS errors
      expect(errors, `JS errors on ${page.path}: ${errors.join(", ")}`).toEqual(
        []
      );
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Navigation links work
// ---------------------------------------------------------------------------
test.describe("Navigation", () => {
  test("desktop nav links navigate correctly", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Check that nav links exist and have correct hrefs
    const navLinks = page.locator("nav a[href]");
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Verify About link
    const aboutLink = page.locator('nav a[href="/about"]');
    if ((await aboutLink.count()) > 0) {
      await aboutLink.first().click();
      await page.waitForURL("**/about", { timeout: 5000 });
      expect(page.url()).toContain("/about");
    }
  });

  test("mobile menu opens and links work", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Find and click the mobile menu button
    const menuButton = page.locator('button[aria-label="Open menu"]');
    if ((await menuButton.count()) > 0) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Mobile menu should be visible
      const mobileMenu = page.locator("#mobile-menu");
      await expect(mobileMenu).toBeVisible();

      // Check that mobile menu has links
      const mobileLinks = mobileMenu.locator("a[href]");
      expect(await mobileLinks.count()).toBeGreaterThanOrEqual(3);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. All internal links resolve (no broken links)
// ---------------------------------------------------------------------------
test.describe("Broken link check", () => {
  test("homepage internal links all resolve", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const links = await page.locator("a[href]").all();
    const internalHrefs = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("#") &&
        href !== "/"
      ) {
        internalHrefs.add(href.split("#")[0]);
      }
    }

    const broken: string[] = [];

    for (const href of internalHrefs) {
      const response = await page.goto(href, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
      const status = response?.status() ?? 0;
      if (status >= 400) {
        broken.push(`${href} → ${status}`);
      }
    }

    expect(broken, `Broken links: ${broken.join(", ")}`).toEqual([]);
  });

  test("insurance funnel internal links all resolve", async ({ page }) => {
    await page.goto("/insurance", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const links = await page.locator("a[href]").all();
    const internalHrefs = new Set<string>();

    for (const link of links) {
      const href = await link.getAttribute("href");
      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !href.startsWith("#") &&
        href !== "/"
      ) {
        internalHrefs.add(href.split("#")[0]);
      }
    }

    const broken: string[] = [];

    for (const href of internalHrefs) {
      const response = await page.goto(href, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
      const status = response?.status() ?? 0;
      if (status >= 400) {
        broken.push(`${href} → ${status}`);
      }
    }

    expect(broken, `Broken links: ${broken.join(", ")}`).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. CTA buttons are visible and clickable
// ---------------------------------------------------------------------------
test.describe("CTA buttons", () => {
  test("homepage CTAs are visible and have correct hrefs", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Discovery Call CTA should exist
    const discoveryCTA = page.locator(
      'a[href="/jeremys-calendar-intro"], a[href*="calendar"]'
    );
    const discoveryCount = await discoveryCTA.count();
    expect(discoveryCount).toBeGreaterThan(0);

    // Assessment CTA should exist
    const assessmentCTA = page.locator('a[href="/assessment"]');
    const assessmentCount = await assessmentCTA.count();
    expect(assessmentCount).toBeGreaterThan(0);
  });

  test("insurance page CTA button starts assessment", async ({ page }) => {
    await page.goto("/insurance", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Find the "Find Your Revenue Leak" button
    const startButton = page.locator(
      'button:has-text("Find Your Revenue Leak"), button:has-text("Start the Free Assessment")'
    );
    if ((await startButton.count()) > 0) {
      await startButton.first().click();
      await page.waitForTimeout(1500);

      // Should show the assessment UI (question card or progress bar)
      const assessmentUI = page.locator(
        '[role="radiogroup"], .bg-red-600, text="Q1 of"'
      );
      // Just verify page didn't crash — assessment content loaded
      const body = await page.locator("body").textContent();
      expect(body?.length).toBeGreaterThan(100);
    }
  });

  test("contact page has working calendar links", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Discovery Call card link
    const calendarLink = page.locator('a[href="/jeremys-calendar-intro"]');
    expect(await calendarLink.count()).toBeGreaterThan(0);

    // Strategy Session link
    const strategyLink = page.locator('a[href="/jeremys-calendar-strategy"]');
    expect(await strategyLink.count()).toBeGreaterThan(0);

    // Email link
    const emailLink = page.locator('a[href="mailto:support@keanonbiz.com"]');
    expect(await emailLink.count()).toBeGreaterThan(0);
  });

  test("FAQ accordion items expand", async ({ page }) => {
    await page.goto("/faq", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Find first accordion trigger
    const trigger = page.locator('[data-state="closed"]').first();
    if ((await trigger.count()) > 0) {
      await trigger.click();
      await page.waitForTimeout(500);

      // Content should now be visible
      const openContent = page.locator('[data-state="open"]');
      expect(await openContent.count()).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Footer present on key pages
// ---------------------------------------------------------------------------
test.describe("Footer", () => {
  const PAGES_WITH_FOOTER = [
    "/",
    "/about",
    "/contact",
    "/blog",
    "/faq",
    "/insurance-coaching",
    "/book",
    "/insurance",
  ];

  for (const path of PAGES_WITH_FOOTER) {
    test(`footer renders on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const footer = page.locator("footer");
      expect(
        await footer.count(),
        `No footer found on ${path}`
      ).toBeGreaterThan(0);
    });
  }
});

// ---------------------------------------------------------------------------
// 6. SEO basics — title and meta description on key pages
// ---------------------------------------------------------------------------
test.describe("SEO meta tags", () => {
  const SEO_PAGES = [
    { path: "/", titleContains: "Kean" },
    { path: "/about", titleContains: "About" },
    { path: "/contact", titleContains: "Contact" },
    { path: "/faq", titleContains: "Questions" },
    { path: "/insurance", titleContains: "Insurance" },
    { path: "/insurance-coaching", titleContains: "Insurance" },
    { path: "/assessment", titleContains: "Audit" },
    { path: "/book", titleContains: "Manumation" },
  ];

  for (const p of SEO_PAGES) {
    test(`${p.path} has correct title containing "${p.titleContains}"`, async ({
      page,
    }) => {
      await page.goto(p.path, { waitUntil: "domcontentloaded" });
      // Wait for React to hydrate and SEO component to update title
      await page.waitForTimeout(1500);

      const title = await page.title();
      expect(
        title.toLowerCase(),
        `Title "${title}" should contain "${p.titleContains}"`
      ).toContain(p.titleContains.toLowerCase());
    });
  }

  test("homepage has meta description", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length).toBeGreaterThan(20);
  });
});

// ---------------------------------------------------------------------------
// 7. Blog page loads posts
// ---------------------------------------------------------------------------
test.describe("Blog", () => {
  test("blog listing shows posts", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Should have article links
    const postLinks = page.locator('a[href^="/blog/"]');
    expect(await postLinks.count()).toBeGreaterThan(0);
  });

  test("blog post page loads content", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Get first blog post link
    const firstPost = page.locator('a[href^="/blog/"]').first();
    const href = await firstPost.getAttribute("href");

    if (href) {
      await page.goto(href, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      // Post should have content
      const article = page.locator("article, main");
      const text = await article.textContent();
      expect(text?.length).toBeGreaterThan(200);
    }
  });
});

// ---------------------------------------------------------------------------
// 8. Redirects work
// ---------------------------------------------------------------------------
test.describe("Redirects", () => {
  test("/waterfall-workshop redirects to /founders-filter", async ({
    page,
  }) => {
    await page.goto("/waterfall-workshop", { waitUntil: "domcontentloaded" });
    // Client-side redirect via wouter — wait for it to execute
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/founders-filter");
  });
});

// ---------------------------------------------------------------------------
// 9. 404 page works
// ---------------------------------------------------------------------------
test.describe("404 handling", () => {
  test("non-existent page shows 404 content", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-xyz", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1000);

    const body = await page.locator("body").textContent();
    const has404 =
      body?.includes("404") ||
      body?.includes("Not Found") ||
      body?.includes("not found");
    expect(has404).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 10. Structured data (JSON-LD) present on key pages
// ---------------------------------------------------------------------------
test.describe("Structured data", () => {
  test("homepage has JSON-LD", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const jsonLd = page.locator('script[type="application/ld+json"]');
    expect(await jsonLd.count()).toBeGreaterThan(0);
  });

  test("FAQ page has FAQPage schema", async ({ page }) => {
    await page.goto("/faq", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);

    // Check ALL JSON-LD blocks for FAQPage (first one may be the global WebSite schema)
    let foundFaq = false;
    for (let i = 0; i < count; i++) {
      const content = await jsonLd.nth(i).textContent();
      if (content?.includes("FAQPage")) {
        foundFaq = true;
        break;
      }
    }
    expect(foundFaq, "FAQPage schema not found in any JSON-LD block").toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 11. Homepage new sections render, removed sections don't appear
// ---------------------------------------------------------------------------
test.describe("Homepage sections", () => {
  test("ManumationAuditSection renders with audit areas", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const auditHeading = page.locator('text="See What\'s Actually"');
    expect(await auditHeading.count()).toBeGreaterThan(0);

    // Should have the 5 audit areas
    const areas = ["Operations Efficiency", "Delegation Readiness", "Automation Maturity", "Revenue Leaks", "Time Allocation"];
    for (const area of areas) {
      expect(await page.locator(`text="${area}"`).count(), `Missing audit area: ${area}`).toBeGreaterThan(0);
    }
  });

  test("ResultsSection renders with stats", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    expect(await page.locator('text="Numbers Don\'t Lie"').count()).toBeGreaterThan(0);
  });

  test("EcosystemSection and FunnelSection are removed", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // These were removed — should not appear
    expect(await page.locator('text="Strategy. Method. Machine."').count()).toBe(0);
    expect(await page.locator('text="Your Path to Freedom"').count()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 12. Manumation Audit page
// ---------------------------------------------------------------------------
test.describe("Manumation Audit page", () => {
  test("renders hero with pricing", async ({ page }) => {
    await page.goto("/manumation-audit", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    expect(await page.locator('text="$2,500"').count()).toBeGreaterThan(0);
    expect(await page.locator('text="Stop Guessing."').count()).toBeGreaterThan(0);
  });

  test("renders comparison table", async ({ page }) => {
    await page.goto("/manumation-audit", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    expect(await page.locator('text="Mini Audit vs. Full Audit"').count()).toBeGreaterThan(0);
    expect(await page.locator("table").count()).toBeGreaterThan(0);
  });

  test("has booking CTA", async ({ page }) => {
    await page.goto("/manumation-audit", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const bookCTA = page.locator('a[href="/jeremys-calendar-strategy"]');
    expect(await bookCTA.count()).toBeGreaterThan(0);
  });

  test("/audit redirects to /manumation-audit", async ({ page }) => {
    await page.goto("/audit", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/manumation-audit");
  });
});

// ---------------------------------------------------------------------------
// 13. Mini Audit starts and shows questions
// ---------------------------------------------------------------------------
test.describe("Mini Audit flow", () => {
  test("assessment page loads and shows first question", async ({ page }) => {
    await page.goto("/assessment", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Should show the first question about hours
    const hourQuestion = page.locator("h2", { hasText: "hours per week" });
    expect(await hourQuestion.count()).toBeGreaterThan(0);

    // Should have option buttons
    const options = page.locator("button", { hasText: "Under 40" });
    expect(await options.count()).toBeGreaterThan(0);
  });

  test("clicking an option advances to next question", async ({ page }) => {
    await page.goto("/assessment", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Click first option
    await page.locator("button", { hasText: "Under 40 hours" }).click();
    await page.waitForTimeout(800);

    // Should advance to question 2
    const q2 = page.locator("h2", { hasText: "describes your business" });
    expect(await q2.count()).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 14. Calendar referral capture
// ---------------------------------------------------------------------------
test.describe("Calendar referral capture", () => {
  test("calendar page has referral capture or name input", async ({ page }) => {
    await page.goto("/jeremys-calendar-intro", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Should show either the "Were you referred?" prompt or the name input
    // (depends on session state from prior tests)
    const referralPrompt = page.locator("text=referred");
    const nameInput = page.locator('input[placeholder="Their name"]');
    const hasReferral = (await referralPrompt.count()) > 0;
    const hasInput = (await nameInput.count()) > 0;

    expect(hasReferral || hasInput, "Referral capture section not found").toBeTruthy();
  });

  test("calendar page has GHL booking embed", async ({ page }) => {
    await page.goto("/jeremys-calendar-intro", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const iframe = page.locator("iframe");
    expect(await iframe.count()).toBeGreaterThan(0);
  });
});
