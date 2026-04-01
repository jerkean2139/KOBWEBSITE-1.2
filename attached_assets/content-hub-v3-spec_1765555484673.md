# Content Hub v3 - Product Spec and Build Guide

This file describes the architecture, data model, prompt design, and build instructions for **content-hub-v3**. It is written to be dropped into the repo (for example as `docs/spec.md`) and used with Replit Agent.

---

## 1. Product Overview

**Goal**  
Content Hub v3 turns a single structured onboarding into an entire 90 day content system:

- A 90 day social content calendar
- Supporting blog posts
- Nano Banana image prompts and generated images
- Two step video creation: Gemini writes the prompt and script, then a video provider creates the video

All of this is driven by carefully designed prompts that are fed with structured onboarding data, not freeform text.

**Key principles**

- Treat onboarding answers as structured data
- Use that data consistently across text, images, and video
- Keep prompts central, versioned, and deterministic
- Make the app multi tenant and self serve with Stripe subscriptions

---

## 2. Tech Stack and Architecture

### 2.1 High level architecture

The app is a Next.js SaaS with:

- Marketing site
- Authenticated app
- Stripe billing
- Onboarding wizard
- Generation APIs
- Database stored content and assets

No websockets are used. The frontend polls status endpoints for long running tasks.

### 2.2 Core technologies

- Framework
  - Next.js 14 with App Router
  - TypeScript

- UI
  - Tailwind CSS
  - shadcn UI for consistent components
  - Framer Motion for animations
  - Large brand characters as React components, generated from Nano Banana images

- Auth
  - NextAuth with credentials provider
  - Email plus password sign up and login

- Database and access
  - Postgres everywhere
  - Dev database on Neon
  - Production database on Railway
  - Node `pg` library with `pg Pool`, no ORM
  - Optional `pgvector` extension if we need vector search later

- AI
  - Gemini 3.0 Pro for all text generation
  - Nano Banana and Nano Banana Pro models for images via the Gemini image API
  - External video provider (for example Veo or similar) wrapped in a single `videoProvider` module

- Payments
  - Stripe subscription with a single plan at 13 USD per month

- Integration
  - Google Sheets and Google Drive for calendar export via a service account

### 2.3 Environments

- **Development**
  - Running in Replit
  - Database at Neon
  - Environment variable `DATABASE_URL_DEV`

- **Production**
  - Hosted on Vercel or Replit deployment
  - Database at Railway
  - Environment variable `DATABASE_URL`

The app chooses which connection string to use based on `NODE_ENV` and availability of `DATABASE_URL_DEV`.

---

## 3. Data Model

All data is scoped by `user_id` so multi tenant isolation is straightforward.

### 3.1 Tables

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'creator',  -- single MVP plan
  status TEXT NOT NULL,                  -- 'active', 'past_due', 'canceled', etc
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questionnaires (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,  -- for example 'Q2 2026 Content Calendar'
  business_name TEXT,
  business_type TEXT,
  industry TEXT,
  target_audience JSONB,
  main_offer TEXT,
  positioning TEXT,
  brand_voice JSONB,
  goals JSONB,
  platforms JSONB,
  posting_frequency JSONB,
  content_themes JSONB,
  examples JSONB,
  raw_answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE calendars (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  questionnaire_id UUID REFERENCES questionnaires(id),
  title TEXT,
  status TEXT NOT NULL,      -- 'queued', 'generating', 'ready', 'failed'
  gemini_model TEXT,         -- for example 'gemini-3.0-pro'
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost_usd DECIMAL,
  google_sheet_id TEXT,
  google_sheet_url TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  calendar_id UUID REFERENCES calendars(id),
  day_index INTEGER,   -- 1..90
  date DATE,
  time TIME,
  platform TEXT,       -- instagram, tiktok, etc
  post_type TEXT,      -- educational, story, promotion, etc
  phase TEXT,          -- awareness, consideration, conversion
  hook TEXT,
  body TEXT,
  hashtags TEXT,
  image_brief TEXT,
  cta TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  calendar_id UUID REFERENCES calendars(id),
  slug TEXT,
  title TEXT,
  outline JSONB,
  content_md TEXT,
  generated_from JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  calendar_id UUID REFERENCES calendars(id),
  post_id UUID REFERENCES posts(id),
  blog_post_id UUID REFERENCES blog_posts(id),
  type TEXT,        -- 'image' or 'video'
  provider TEXT,    -- 'nano_banana' or a video provider id
  url TEXT,
  prompt TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Content profile type

In code, onboarding answers are collected into a typed object. Example TypeScript type:

```ts
export type ContentProfile = {
  businessName: string
  industry: string
  audience: {
    description: string
    pains: string[]
    desires: string[]
  }
  offer: {
    mainOffer: string
    pricePoint: string
    differentiator: string
  }
  brandVoice: {
    toneAdjectives: string[]
    readingLevel: string
    allowedPhrases: string[]
    forbiddenPhrases: string[]
  }
  goals: {
    primary: string
    secondary: string[]
    timeframeDays: number
  }
  platforms: string[]
  postingCadencePerWeek: number
  pillarThemes: string[]
  exampleContentLinks: string[]
}
```

This `ContentProfile` is passed to all prompt builders. Prompts should not depend on raw freeform strings when it can be avoided.

---

## 4. Prompt Design

This section defines the core prompts that drive the product.

### 4.1 Social calendar prompt (90 days)

**Role**  
Gemini 3.0 Pro, acting as a senior content strategist.

**System prompt template**

```text
You are a senior content strategist for online businesses.

You will receive a structured JSON object called profile that describes a business, its audience, offer, brand voice, goals, platforms and content pillars.

Your task:

1. Design a ninety day content strategy that moves the audience from awareness to conversion in a clear narrative.
2. Generate exactly ninety short form content posts that can be used across the requested platforms.

Output rules:

- Respond as valid JSON.
- Return an array called posts with exactly 90 objects.
- Each object must have:
  - day: integer from 1 to 90
  - platform: string from the profile.platforms list
  - phase: one of "awareness", "consideration", "conversion"
  - post_type: one of "educational", "story", "engagement", "social proof", "offer"
  - hook: short scroll stopping first line
  - body: full post text
  - hashtags: a string of 5 to 12 hashtags, aligned with industry and pillar theme
  - image_brief: one sentence visual description for an image generator
  - cta: short call to action that matches the phase
  - notes: implementation notes for the creator

Strategy rules:

- Use the goals in profile.goals to shape which phases get more content.
- Use pillar themes in profile.pillarThemes as recurring series.
- Respect the brandVoice tone adjectives and forbidden phrases.
- Vary format and angle so the feed feels fresh, not repetitive.

Now wait for the JSON input "profile" and then generate the posts.
```

**Usage**

- System prompt as above
- User message is the stringified `ContentProfile` as `profile`

The API handler parses the JSON response and writes rows into `posts` tied to a `calendar` row.

### 4.2 Blog post prompt

**Role**  
Gemini 3.0 Pro, acting as a long form content writer.

**Prompt template**

```text
You are a content marketer who writes long form blog posts that support a ninety day content calendar.

Input:

- profile: a JSON object with business, audience, offer, brandVoice, goals and pillarThemes.
- topic: a short string naming the blog topic.
- intent: one of "awareness", "consideration", "conversion".
- target_word_count: integer such as 1200.

Output:

Respond as valid JSON with:

{
  "title": "string",
  "slug": "kebab-case-string",
  "outline": [ "H2 section title", "H2 section title", ... ],
  "content_markdown": "full blog post in markdown, with H2 and H3 headings, and occasional bullet lists"
}

Rules:

- Write in the tone described by profile.brandVoice.
- Use concrete examples from the industry and audience description.
- Include one simple story that feels personal and relatable.
- End with a strong call to action that matches the intent.
```

The backend can call this three to five times per calendar to produce anchor posts and then store them in `blog_posts`.

### 4.3 Nano Banana image prompt

Nano Banana and Nano Banana Pro are Gemini compatible image models. We provide a consistent style prompt and insert the per post `image_brief`.

**Prompt template**

```text
Create a high resolution illustration for a content marketing post.

Brand style:
- Palette of saturated blues and purples with soft gradients.
- Friendly large mascot character that represents a creative entrepreneur.
- Modern flat shading with subtle 3D depth and soft lighting.
- Clean background with a few abstract shapes, no clutter.

Scene description:
- {image_brief from the post}

Technical preferences:
- Aspect ratio 9:16 for social posts.
- No watermarks or text banners.
- Make sure the character expression matches the emotion of the post.
```

The backend uses this prompt with the Nano Banana model, then stores the resulting image URL or file reference in `assets` with `type = 'image'` and `provider = 'nano_banana'`.

### 4.4 Video prompt and script (two step flow)

Video is created in two steps.

#### Step 1: Gemini video prompt and script

```text
You are a creative director who writes prompts for an AI video generator.

Input:
- profile: JSON business profile.
- post: one object from the 90 day calendar with hook, body, phase and platform.
- max_duration_seconds: integer, such as 30.

Output:

Respond as valid JSON:

{
  "video_prompt": "human readable description of the video scene",
  "script": "voiceover script in plain text",
  "aspect_ratio": "9:16" or "16:9",
  "duration_seconds": number
}

Rules:

- The video should make sense for the platform in post.platform.
- The script should match the brand voice and goal in profile.goals.
- The video_prompt should include camera style, pacing, and visual motifs, but no model specific keywords.
```

#### Step 2: Video provider call

The backend calls `videoProvider.createVideo` with the JSON from Step 1. That module hides the details of a specific provider and returns a video URL or ID that is stored in `assets` with `type = 'video'` and an appropriate `provider` value.

The client polls a status endpoint until the `assets` row for that post has a ready video.

---

## 5. API Flow

### 5.1 Generation flow summary

1. User completes onboarding wizard and submits to `/api/generate-calendar`
2. Backend writes `questionnaires` row and `calendars` row with status `queued`
3. Backend calls Gemini with social calendar prompt and profile
4. Backend parses JSON and writes 90 `posts`
5. Backend kicks off secondary tasks for:
   - Blog generation
   - Nano Banana image generation
   - Video prompt and video generation
   - Google Sheets export
6. Calendar status moves through `generating` and then `ready`

All long running work is tracked via the `calendars` and `assets` tables. The frontend polls for status.

### 5.2 Example routes

- `POST /api/auth/register`  
- `POST /api/auth/login`  
- `GET /api/me`  
- `GET /api/calendars`  
- `POST /api/generate-calendar`  
- `GET /api/calendars/:id`  
- `PATCH /api/posts/:id`  
- `POST /api/calendars/:id/blogs`  
- `POST /api/posts/:id/video`  

Stripe and webhooks sit under `/api/stripe/*` and auth is wired via NextAuth route handlers.

---

## 6. UI Notes

### 6.1 Marketing site

- Dark theme with blue and purple gradients
- Large animated mascot on the hero section using Framer Motion
- Clear headline such as:
  - "90 days of content in 10 minutes"
- Primary call to action to start with the 13 dollar per month plan
- Secondary section that shows a fake preview of a 90 day calendar with a simple horizontal scroll

### 6.2 App UI

- Light background for readability
- Blue and purple accent colors
- Dashboard that shows:
  - Button to create a new calendar
  - List of previous calendars with status
  - Count of blog posts and assets

- Calendar detail page:
  - Table for posts with filters by platform, phase, and date
  - Thumbnail column for images and videos
  - Inline editing for text, hashtags, and CTAs

- Blog detail page:
  - Markdown rendering of `content_md`
  - Simple editor or "Open in external editor" workflow

---

## 7. Environment Variables

Example `.env.example`

```bash
# Databases
DATABASE_URL_DEV=postgres://dev-user:dev-pass@neon-host/dev-db
DATABASE_URL=postgres://prod-user:prod-pass@railway-host/prod-db

# Auth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_CREATOR=price_...

# Gemini and Google
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "...", ...}'
```

---

## 8. Replit Agent Build Prompt

Use the following prompt in Replit Agent to scaffold and maintain the project.

```text
You are building content-hub-v3, a multi tenant AI content platform.

The app should do four things:

1. Capture onboarding answers about a business and its content strategy.
2. Generate a 90 day social content calendar with Gemini 3.0 Pro.
3. Generate supporting blog posts based on that calendar.
4. Generate AI images with Nano Banana and video prompts with Gemini that are passed to an external video provider.

Stack requirements:

- Next.js 14 App Router with TypeScript.
- Tailwind CSS and shadcn for UI.
- Framer Motion for animations.
- NextAuth with credentials provider for auth.
- Node pg client for database access, not Prisma.
- Postgres as the database.
- pgvector extension support in the database if needed.
- No websockets. Use polling on the client for progress.
- Stripe for a single subscription plan at 13 USD per month.
- Gemini 3.0 Pro for text, Nano Banana image models for images.
- Generic videoProvider module for external video generation.

Database environments:

- Dev: Neon Postgres connection, used when NODE_ENV is development and when running in Replit.
- Prod: Railway Postgres connection, used when NODE_ENV is production.

Use environment variables:

- DATABASE_URL_DEV for Neon.
- DATABASE_URL for Railway.
- GEMINI_API_KEY.
- STRIPE_SECRET_KEY.
- STRIPE_WEBHOOK_SECRET.
- GOOGLE_SERVICE_ACCOUNT_JSON for Sheets and Drive.
- NEXTAUTH_SECRET.
- NEXTAUTH_URL.
- NEXT_PUBLIC_APP_URL.

Data model:

Implement tables using SQL migrations and the pg library.

- users
- sessions
- subscriptions
- questionnaires
- calendars
- posts
- blog_posts
- assets

Each table must have a user_id column to enforce multi tenant scoping.

Backend:

- Create a database module that exports a pg Pool and helper functions.
- Add repository modules for users, calendars, posts, blog_posts and assets.
- Use pgvector only if you need semantic search later. For now, keep prompts deterministic.

Auth:

- NextAuth credentials provider for email and password.
- Store hashed passwords in users using bcrypt.
- Protect all routes under /app/dashboard, /app/new-calendar and /app/calendars/** so only logged in users can access them.

Stripe:

- Single plan called "Creator" at 13 dollars per month.
- Use Stripe Checkout for subscription.
- Implement a webhook route to update the subscriptions table on subscription events.
- Gate access to generation routes based on an active subscription.

Onboarding UI:

- Build an onboarding wizard at /app/new-calendar.
- Collect a structured ContentProfile object with 8 to 10 steps.
- Save the questionnaire in the database and then call an internal API route to trigger generation.

Generation flow:

1. API route to generate a 90 day calendar:
   - Reads the questionnaire profile from the database.
   - Calls a helper function that sends the social calendar prompt and profile JSON to Gemini 3.0 Pro.
   - Parses the JSON response and inserts 90 posts into the posts table.
   - For each post, prepares a Nano Banana image prompt and stores it as image_brief.
   - Creates a calendar row with status fields and timestamps.
   - Starts background tasks for images, blogs and videos.

2. API route to generate blog posts:
   - For a given calendar, pick 3 to 5 pillar themes.
   - For each one, call Gemini 3.0 Pro with the blog prompt template.
   - Save the result in blog_posts.

3. Image generation:
   - Implement a helper that calls the Gemini image API with Nano Banana models.
   - Build a consistent prompt around brand style and the image_brief from a post.
   - Store image URLs in assets.

4. Video generation:
   - Implement a helper that asks Gemini to write video_prompt, script, aspect_ratio and duration for a given post.
   - Call videoProvider.createVideo with that data so it hits an external video API.
   - Store the video URL in assets and mark status as ready.

Progress tracking:

- Calendars table tracks status: queued, generating, ready, failed.
- Assets table tracks images and videos per post.
- The frontend polls a status endpoint every few seconds after a generation is started.

Google Sheets:

- Implement a googleSheets helper:
  - createCalendarSpreadsheet(calendar, posts, blogPosts)
  - Creates a sheet with:
    - Content Calendar tab.
    - Blog Ideas tab with titles and links.
    - Summary tab that explains the strategy.
  - Uses service account credentials from GOOGLE_SERVICE_ACCOUNT_JSON.

UI style:

- Marketing site:
  - Dark background with blue and purple gradients.
  - Large animated mascot character, implemented as a React component that uses Framer Motion.
  - Hero section that explains "90 days of content in 10 minutes".
  - Clear call to action to subscribe for 13 USD per month.

- App UI:
  - Light background, clean and readable.
  - Blue and purple as accent colors.
  - Dashboard with cards that show recent calendars, blog posts and asset counts.
  - Calendar detail page with an editable table of posts and thumbnails for images and videos.

Routing:

- / page: marketing.
- /pricing page: plan details.
- /register page: sign up.
- /login page: sign in.
- /app/dashboard page: main dashboard, protected.
- /app/new-calendar page: onboarding wizard, protected.
- /app/calendars/[id] page: calendar detail, protected.
- /app/blog/[id] page: blog post detail or editor, protected.

Quality:

- Keep configuration in separate modules in lib.
- Make sure all database queries use parameterized queries to avoid injection.
- Validate request payloads in API routes.
- Add simple logging for AI calls and external API errors.
```

---

## 9. Example Blog Content

You can use the following as a starter blog post for your own site.

### Why your next content system should write its own prompts

Most marketers do not struggle with ideas. They struggle with translation.

They know their customer. They know their offer. They even know the tone they want to use. Where it all falls apart is the moment they sit in front of a blank planner and try to turn that knowledge into ninety days of content, plus images, plus videos, plus the occasional long form blog post that makes them sound like a real authority.

That translation step is what kills consistency.

Content Hub v3 exists to remove that step. You answer questions once and the system does the translation for you. It is not a generic chatbot. It is a prompt engine that has been calibrated for a single job: turn your business profile into a quarter of content without making you write a single clever prompt.

Under the hood, it treats your answers as data. Your niche, your audience, your offer, even the phrases you never want to see in your copy. All of it is stored as a structured profile. That profile is then fed into a library of handcrafted prompts that talk to Gemini 3.0 Pro for text, Nano Banana for images, and a dedicated video model for short form video.

You never see the prompts. You only see the results.

The system starts by building a ninety day narrative that makes sense for your goal. Launching a new product in six weeks. Re pitching an evergreen offer. Nurturing an audience that has gone cold. Different goals create different arcs. The calendar knows when to educate, when to entertain, when to show proof, and when to ask for the sale.

From there, it branches out. The same profile that shaped your calendar is used to generate anchor blog posts that live on your site. The same brand rules that keep your captions on voice are passed into Nano Banana, so your images look like part of the same world. When you are ready for video, Gemini writes the prompt and script, then a best in class video model turns it into something you can post without touching an editing timeline.

The result feels less like a tool and more like a system.

You are still in charge. You can edit posts, tweak headlines, and rewrite calls to action. You can regenerate individual items that do not quite land. But you are no longer spending your energy on filling cells. You are spending it on decisions that move the needle.

That is what a content hub should do. Not give you another blank screen. Give you a starting point that is already ninety percent of the way there.
