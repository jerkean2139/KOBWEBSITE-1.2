# KeanOnBiz Admin Operations Guide
## Your Day-to-Day Playbook for Managing Content and Systems

This guide is your go-to reference for actually running the content machine. It covers what to do, when to do it, and exactly how to do it — step by step.

---

## Table of Contents

1. [Your Weekly Schedule](#your-weekly-schedule)
2. [Logging In](#logging-in)
3. [Daily Operations: Content Studio](#daily-operations-content-studio)
4. [Bi-Weekly Operations: Newsletter Creator](#bi-weekly-operations-newsletter-creator)
5. [Weekly Operations: MicroPod Studio](#weekly-operations-micropod-studio)
6. [As Needed: Portfolio Admin](#as-needed-portfolio-admin)
7. [Weekly Review: Industry Intelligence](#weekly-review-industry-intelligence)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)
9. [Quality Standards](#quality-standards)
10. [Admin URL Quick Reference](#admin-url-quick-reference)

---

## Your Weekly Schedule

Here's the recommended rhythm for keeping the content machine running:

### Monday
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Review weekend research results | Industry Intelligence | 10 min |
| Morning | Generate 2-3 blog posts | Content Studio | 15 min |
| Morning | Review and approve yesterday's drafts | Content Studio | 10 min |

### Tuesday
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Generate 2-3 blog posts | Content Studio | 15 min |
| Afternoon | Review and approve drafts | Content Studio | 10 min |

### Wednesday
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Generate 2-3 blog posts | Content Studio | 15 min |
| Morning | Start podcast episode script | MicroPod Studio | 10 min |
| Afternoon | Review and approve blog drafts | Content Studio | 10 min |

### Thursday
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Generate 2-3 blog posts | Content Studio | 15 min |
| Morning | Edit and finalize podcast script | MicroPod Studio | 15 min |
| Afternoon | Generate podcast audio | MicroPod Studio | 5 min |

### Friday (Newsletter Week Only — Every Other Friday)
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Generate newsletter | Newsletter Creator | 5 min |
| Morning | Edit and review newsletter | Newsletter Creator | 15 min |
| Morning | Send test email, verify | Newsletter Creator | 5 min |
| Afternoon | Approve and send newsletter | Newsletter Creator | 2 min |

### Friday (Non-Newsletter Week)
| Time | Task | Tool | Est. Time |
|------|------|------|-----------|
| Morning | Review pain points database | Industry Intelligence | 10 min |
| Morning | Update portfolio projects | Portfolio Admin | As needed |
| Morning | Approve remaining blog drafts | Content Studio | 10 min |

---

## Logging In

All admin tools use the same admin key. You'll be asked for it when you first visit any admin page.

### Admin Users & Credentials

| User | Role | Secret Name (in Replit) | Access Level |
|------|------|-------------------------|--------------|
| Jeremy Kean | Owner / Primary Admin | `NEWSLETTER_ADMIN_KEY` | Full access to all 5 admin tools |
| Kianna | Team Admin | `KIANNA_ADMIN_KEY` | Full access to all 5 admin tools |
| Audrey | Team Admin | `AUDREY_ADMIN_KEY` | Full access to all 5 admin tools |

All three keys grant identical access. Each person uses their own key so we can track who made changes if needed.

**Where to find your key:** Ask Jeremy. Keys are stored in Replit Secrets and should never be shared in plaintext, pasted in chat, or saved in any document.

### How to Log In

1. Go to any admin URL (see [Quick Reference](#admin-url-quick-reference))
2. Enter your admin key in the login field
3. The key is saved for the session — you won't be asked again until you close the browser

If your key doesn't work, contact Jeremy.

---

## Daily Operations: Content Studio

**URL:** `/admin/content-studio`

### Generating a Blog Post

1. Click the **Generate** tab
2. Choose your settings:
   - **Author**: Usually Jeremy (default). Use Michelle, Marcus, or Sarah for variety.
   - **Length**: Medium (~1,200 words) is the sweet spot for most posts
   - **Style**: Rotate between Educational, Story-Driven, and Tactical How-To
   - **Content Pillar**: Match to the day's focus area
   - **Image Provider**: Leonardo gives the most consistent results
   - **Target Industry**: Pick one to ground the content in real pain points, or leave on "Auto-match" to let it figure it out from the pillar
3. Click **Generate**
4. Watch the progress bar — it takes 2-3 minutes
5. The post saves as a draft automatically

### Reviewing and Approving Posts

1. Click the **Approve** tab
2. You'll see all draft posts waiting for review
3. Click a post to see its quality checklist:
   - Green checks = good to go
   - Red X = needs fixing
4. Read through the post — look for:
   - Does the headline grab attention?
   - Does the content make sense and flow naturally?
   - Are there any factual errors or weird AI artifacts?
   - Is the image relevant and professional?
5. If it looks good, click **Approve & Publish**
6. If something's off, click **Edit** to fix it, or **Remix** to have the AI try again

### Fixing a Post Before Publishing

**Minor fixes (typos, awkward phrasing):**
1. Click the post in the **Posts** tab
2. Click **Edit**
3. Make your changes directly
4. Click **Save**
5. Go back to **Approve** and publish

**Major rewrites:**
1. Click the post in the **Posts** tab
2. Click **Remix Content** — the AI rewrites the whole article
3. Review the new version
4. Approve when satisfied

**Bad image:**
1. Click the post in the **Posts** tab
2. Click **Remix Image** — generates a fresh image
3. Review and approve

### Content Pillar Rotation Strategy

Aim for this weekly mix to keep content diverse:

| Day | Pillar | Why |
|-----|--------|-----|
| Monday | Business Operations | Start the week with practical systems content |
| Tuesday | AI & Automation | Tech-focused, appeals to forward-thinking audience |
| Wednesday | Insurance Agency / Industry-specific | Targeted content for core audience |
| Thursday | Time Management | Appeals to busy owners |
| Friday | Business Mindset | Inspirational, shareable content for the weekend |

### Industry Targeting Tips

When you select a **Target Industry**, the AI pulls real pain points from the database. This makes posts much more specific and valuable. Recommended industry rotation:

| Week | Primary Focus | Secondary |
|------|---------------|-----------|
| Week 1 | Insurance Agencies | Small Business Owners |
| Week 2 | Business Coaches | Marketing Agencies |
| Week 3 | Real Estate Agents | Home Service Companies |
| Week 4 | Title Companies | Small Business Owners |

---

## Bi-Weekly Operations: Newsletter Creator

**URL:** `/admin/newsletter`

### Generating a Newsletter

1. Click **Generate Newsletter** in the sidebar
2. The AI runs through 6 steps automatically (takes 3-5 minutes):
   - Researches trending topics + pulls real pain points from the database
   - Analyzes and ranks findings
   - Selects the Top 10 most valuable items
   - Writes each section in Jeremy's voice
   - Generates a header image
   - Saves as draft
3. Once complete, the newsletter appears in the sidebar

### Editing Before Sending

1. Click the newsletter in the sidebar
2. Click **Edit** to enter edit mode
3. You can change:
   - **Title** — This becomes the email subject line (make it compelling!)
   - **TL;DR** — The opening summary paragraph (word count shown, aim for 30-50 words)
   - **Individual Top 10 Items** — Click any item to edit its text
   - **Add items** — Click the + button to add a new item
   - **Remove items** — Click the trash icon next to any item
4. Click **Save** — the HTML email is regenerated with your changes

### Quality Checklist

Before sending, verify all checks are green:

| Check | What to Look For |
|-------|------------------|
| Title | Subject line is compelling, not generic |
| TL;DR | 20+ words, summarizes the key takeaway |
| Top Ten | All 10 items present and substantive |
| Header Image | Generated and looks professional |
| HTML Rendered | Email is properly formatted |

### Sending Process

1. **Always send a test first:**
   - Enter your email in the "Send Test" field
   - Click **Send Test**
   - Check your inbox — verify formatting, links work, images load
2. **If the test looks good:**
   - Click **Approve & Send**
   - The newsletter sends to all subscribers via Resend
   - Status changes to "Sent"

### Common Newsletter Edits

| Issue | Fix |
|-------|-----|
| Subject line too boring | Edit title to be more specific and intriguing |
| TL;DR too long | Trim to 2-3 punchy sentences |
| An item is weak | Replace it with a stronger insight, or delete and add a new one |
| Wrong tone | Edit the item text to sound more like Jeremy |

---

## Weekly Operations: MicroPod Studio

**URL:** `/admin/micropod`

### Generating a Podcast Script

1. Click the **Generate** tab
2. Fill in:
   - **Topic**: Be specific. "Why your best employee is your biggest risk" is better than "employee management"
   - **Target Length**: 5 min for quick bites, 7 min for standard, 10 min for deep dives
   - **Target Industry**: Picks pain points from that industry to ground the script
3. Click **Generate Script**
4. Watch the AI pipeline (2-3 minutes):
   - Research (pulls pain points)
   - Talking points generation
   - Full script writing in Jeremy's voice
   - Script review and quality scoring
5. Episode saves as draft

### Editing the Script

1. Go to the **Episodes** tab
2. Click the episode you want to edit
3. Click **Edit**
4. You can modify:
   - **Title** — Episode title for the podcast feed
   - **Description** — Episode description (shown in podcast apps)
   - **Script** — The full spoken-word text
5. Click **Save**

### Script Quality Tips

When reviewing a script, check for:

| Quality Check | What to Look For |
|---------------|------------------|
| Natural Speech | Does it sound like talking, not writing? |
| Short Sentences | No long, complex sentences |
| Pauses | Are there natural [PAUSE] markers? |
| Opening Hook | Does it grab attention in the first 15 seconds? |
| Call to Action | Does it end with a clear next step? |
| Pain Points | Does it reference real problems the audience faces? |

### Generating Audio

1. In the episode view, scroll to **Voice Synthesis**
2. Enter the **Voice ID** (Jeremy's cloned voice ID)
3. Select the **Model** (eleven_multilingual_v2 recommended)
4. Click **Generate Audio**
5. Wait for synthesis (1-3 minutes depending on script length)
6. Preview the audio using the built-in player
7. If the script was edited, click **Regenerate Audio** to update

### Publishing an Episode

1. Go to the **Approval** tab
2. Click the episode in the draft queue
3. Review the **7-point quality checklist**:
   - All items should show green
   - If any are red, go back and fix them
4. Listen to the audio one more time
5. Click **Approve & Publish**
6. The episode is now:
   - Live on the `/micropod` public page
   - Included in the `/podcast.xml` RSS feed
   - Available to podcast directories (Apple Podcasts, Spotify)

### Episode Topic Ideas

Pull from these sources:
- **Industry Intelligence**: High-severity pain points make great episode topics
- **Blog posts**: Adapt popular blog posts into spoken episodes
- **Client questions**: Common questions from coaching calls
- **Current events**: Business news through Jeremy's lens

---

## As Needed: Portfolio Admin

**URL:** `/admin/portfolio`

### Creating a New Project

1. Click **New Project** in the project list
2. **Basics tab** — Fill in the essentials:
   - Title and slug (slug auto-generates)
   - Status: "On Deck" for planned, "Building" for in-progress, "Deployed" for live
   - Category, tech stack, URLs
   - Upload a featured image (drag and drop or click)
3. **Case Study tab** — Tell the story:
   - Problem statement: What was the client dealing with?
   - Solution overview: What did we build?
   - Key features: List the main capabilities (use + to add items)
   - Results: What outcomes were achieved?
4. **Milestones tab** — Track the build journey:
   - Add milestones with dates and descriptions
   - Upload progress screenshots at each stage
5. **Gallery tab** — Showcase the work:
   - Upload screenshots and demo videos
   - Add captions and phase labels
6. Click **Save** (or **Create Project** for new projects)

### Updating an Existing Project

1. Click the project in the left sidebar
2. Make your changes in any tab
3. Click **Save Changes**

### When to Update Portfolio

| Trigger | Action |
|---------|--------|
| New project started | Create with "On Deck" status |
| Development begins | Change to "Building", add milestones |
| Major milestone hit | Add a milestone with screenshot |
| Project launches | Change to "Deployed", add results |
| Client gives testimonial | Add to Case Study tab |

---

## Weekly Review: Industry Intelligence

**URL:** `/admin/pain-points`

### Monday Morning Review (10 minutes)

1. Go to the **Dashboard** tab
2. Check:
   - Did the automated weekly research run? (Look at "Last Research" date)
   - How many new pain points were added?
   - Are there any industries with low coverage (< 8 pain points)?

### Reviewing Research Results

1. Go to the **Research** tab
2. Click the most recent research run
3. Expand the log to see what was found
4. Check if the AI added anything relevant

### Managing Pain Points

1. Go to the **Pain Points** tab
2. Filter by industry to focus on one at a time
3. For each pain point, verify:
   - **Title** is clear and specific
   - **Description** accurately describes the problem
   - **Severity** (1-10) is appropriate
   - **Manumation Angle** explains how we solve it
   - **Keywords** are relevant for content matching
4. Delete any that are duplicates or irrelevant
5. Add new ones from your own experience (click **Add Pain Point**)

### Adding Pain Points From Experience

The best pain points come from real conversations with clients. When you hear a client describe a problem:

1. Go to Industry Intelligence
2. Click **Add Pain Point**
3. Fill in:
   - **Industry**: Which sector?
   - **Category**: Operations, Sales, Marketing, Tech, or Hiring
   - **Title**: Short, specific description of the problem
   - **Description**: 2-3 sentences explaining the real impact
   - **Severity**: How business-threatening is this? (1 = minor annoyance, 10 = business killer)
   - **Keywords**: 3-5 search terms
   - **Manumation Angle**: How does Jeremy's approach solve this?
   - **Source**: Set to "Manual" (vs. "Research" for AI-found points)
4. Click **Save**

This pain point will now show up when Content Studio and Newsletter Creator generate content for that industry.

### Running Research Manually

If you want fresh pain points immediately (not waiting for Monday's automatic run):

1. Go to the **Research** tab
2. Click **Run Research Now**
3. The AI will research all active industries
4. Watch the progress — it takes 3-5 minutes
5. New pain points are added automatically (duplicates are skipped)

### Seeding the Database (First Time Only)

If the pain points database is empty:

1. Go to the **Dashboard** tab
2. Click **Seed Database**
3. This loads 56 pre-written pain points across 7 industries
4. Review and customize them to match Jeremy's perspective

---

## Troubleshooting Common Issues

### "My admin key doesn't work"

- Make sure you're using the correct key (check with Jeremy)
- Keys are case-sensitive — copy/paste to avoid typos
- Try refreshing the page and entering again

### "Blog post generation stopped midway"

- Refresh the page and check the Posts tab — it may have saved as a draft
- If not, generate again. The AI pipeline occasionally times out on busy servers.

### "Newsletter HTML looks broken"

- Click **Edit** and then **Save** — this regenerates the HTML
- If still broken, generate a new newsletter

### "Podcast audio won't generate"

- Check that the ElevenLabs API key is configured (the Voice Synthesis section will show a warning if not)
- Verify the Voice ID is correct
- If the script is very long (10+ minutes), it may take longer to synthesize

### "Pain points research found nothing new"

- This is normal if the database is comprehensive
- The AI skips duplicates, so a "0 new" result means your database is well-covered
- Try adding more specific search angles by editing industry descriptions

### "Images look weird or off-brand"

- Use **Remix Image** to generate a new one
- Leonardo AI generally produces the most consistent results
- If all providers give poor results, you can manually upload an image to replace it

### "I can't see my changes on the live site"

- Blog posts must be **published** (not just saved as draft) to appear
- Portfolio projects appear immediately after saving
- Podcast episodes must be **published** through the Approval workflow
- Newsletter changes are reflected in the next send

---

## Quality Standards

### Blog Posts — Before Publishing

- [ ] Headline is specific, compelling, and under 70 characters
- [ ] Opening paragraph hooks the reader (no generic introductions)
- [ ] Content provides actionable value (not just theory)
- [ ] At least one real example or story
- [ ] Clear call to action at the end
- [ ] Featured image is relevant and professional
- [ ] Meta description is compelling for search results
- [ ] Tags and content pillar are set correctly
- [ ] Word count is appropriate for the chosen length
- [ ] No AI artifacts ("As an AI...", "In conclusion...", etc.)

### Newsletter — Before Sending

- [ ] Subject line makes you want to open it
- [ ] TL;DR summarizes the key value in 2-3 sentences
- [ ] All 10 items are substantive and actionable
- [ ] Items span multiple industries/topics (not all the same theme)
- [ ] Test email received and looks good on desktop and mobile
- [ ] Links work (if any)
- [ ] Call to action is clear

### Podcast — Before Publishing

- [ ] Script sounds natural when read aloud (not like a blog post)
- [ ] Opening hook grabs attention in the first 15 seconds
- [ ] Pain points referenced are real and specific
- [ ] Ending has a clear call to action
- [ ] Audio quality is clear and natural-sounding
- [ ] Episode description is compelling
- [ ] Topics are tagged correctly

### Portfolio — Before Making Public

- [ ] Featured image uploaded and looks professional
- [ ] Description clearly explains what the project does
- [ ] Status accurately reflects current state
- [ ] Case study sections are filled in (at minimum: problem, solution, results)
- [ ] Tech stack is listed
- [ ] Live URL works (for deployed projects)

---

## Admin URL Quick Reference

| Tool | URL | Purpose |
|------|-----|---------|
| Content Studio | `/admin/content-studio` | Generate, edit, approve blog posts |
| Newsletter Creator | `/admin/newsletter` | Generate, edit, send newsletters |
| MicroPod Studio | `/admin/micropod` | Generate scripts, audio, publish podcast episodes |
| Portfolio Admin | `/admin/portfolio` | Manage case study projects |
| Industry Intelligence | `/admin/pain-points` | Manage pain points, run research |

### Public Pages That Display Admin Content

| Public Page | URL | Shows Content From |
|-------------|-----|--------------------|
| Blog | `/blog` | Content Studio (published posts) |
| Newsletter Archive | `/newsletter` | Newsletter Creator (sent newsletters) |
| Podcast | `/micropod` | MicroPod Studio (published episodes) |
| Portfolio | `/portfolio` | Portfolio Admin (all projects) |
| Case Studies | `/portfolio/{slug}` | Portfolio Admin (individual projects) |
| RSS Feed | `/podcast.xml` | MicroPod Studio (published episodes) |

### How Everything Connects

```
Industry Intelligence (Pain Points Database)
         │
         ├──────────────► Content Studio ──────► Blog Posts
         │                                         │
         ├──────────────► Newsletter Creator ──► Newsletters ──► Email via Resend
         │
         └──────────────► MicroPod Studio ──────► Podcast Episodes ──► RSS Feed
                                                                        │
Portfolio Admin ──────────────────────────────────► Portfolio/Case Studies
                                                                        │
                                                    All content drives ──► GoHighLevel
                                                    leads to                (CRM & Follow-up)
```

The pain points database is the foundation. It feeds real-world business problems into every piece of content we create, making everything more specific, valuable, and relevant to our target audience.
