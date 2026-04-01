# Post-Publish SEO Domination Checklist for KeanOnBiz.com

## Phase 1: Search Engine Submission (Day 1)

### Google Search Console
- [ ] Go to [Google Search Console](https://search.google.com/search-console)
- [ ] Add property: `https://keanonbiz.com`
- [ ] Verify via DNS TXT record or HTML file upload
- [ ] Submit sitemap: `https://keanonbiz.com/sitemap.xml`
- [ ] Request indexing for key pages:
  - Homepage
  - /blog
  - /book
  - /newsletter
  - /become-a-coach

### Bing Webmaster Tools
- [ ] Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [ ] Import from Google Search Console (easiest)
- [ ] Or add property manually and verify
- [ ] Submit sitemap

## Phase 2: Social Profiles & Consistency (Week 1)

### NAP Consistency (Name, Address, Phone)
Ensure consistent business info across all platforms:
- **Business Name**: KeanOnBiz / Jeremy Kean
- **Location**: Indiana, USA (Nationwide service)
- **Website**: https://keanonbiz.com
- **Email**: support@keanonbiz.com

### Social Profiles to Update/Create
- [ ] LinkedIn (Personal & Company page)
- [ ] Facebook Business Page
- [ ] Twitter/X
- [ ] YouTube Channel
- [ ] Instagram (if applicable)

Link all profiles to keanonbiz.com and use consistent branding.

## Phase 3: Business Directories (Week 1-2)

### High-Authority Citations
- [ ] Google Business Profile (already done)
- [ ] Yelp Business
- [ ] BBB (Better Business Bureau)
- [ ] Crunchbase
- [ ] AngelList (if applicable)

### Industry-Specific Directories
- [ ] Coaching directories (ICF, coaching.com)
- [ ] Business consulting directories
- [ ] Insurance industry directories

## Phase 4: Monitor & Optimize (Ongoing)

### Weekly Tasks
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor Core Web Vitals (should be green)
- [ ] Check for 404 errors and fix
- [ ] Review search queries and rankings

### Monthly Tasks
- [ ] Analyze top performing pages
- [ ] Identify new keyword opportunities
- [ ] Update sitemap if new pages added
- [ ] Request re-indexing for updated content

## Phase 5: Content & Link Building (Ongoing)

### Content Strategy
- [ ] Publish 2-4 blog posts per month
- [ ] Each post targets specific keywords
- [ ] Include internal links to services
- [ ] Add FAQ sections for featured snippets

### Link Building
- [ ] Guest posts on industry blogs
- [ ] Podcast appearances
- [ ] Speaking engagements
- [ ] PR mentions

## Technical Monitoring

### Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Tools to Use
- Google PageSpeed Insights
- GTmetrix
- Google Search Console (Core Web Vitals report)

## Security Review Summary

The following security measures have been implemented:

1. **Security Headers**: HSTS, CSP, X-Frame-Options, X-XSS-Protection
2. **Rate Limiting**: Failed auth attempts throttled (5 per 15 min)
3. **SSRF Protection**: Blocked private IPs, metadata services
4. **Path Traversal Protection**: Sanitized file paths
5. **Session Security**: SSE tokens cleaned up on close

## Quick Reference

- **Sitemap URL**: https://keanonbiz.com/sitemap.xml
- **Robots.txt**: https://keanonbiz.com/robots.txt
- **Google Analytics**: G-395WY11195
- **Schema Types**: ProfessionalService, Person, Book, FAQPage, BreadcrumbList
