# GoHighLevel Integration Prompt for Replit Agent

Copy and paste this prompt when starting a new project that needs GoHighLevel integration:

---

## THE PROMPT:

```
Create a comprehensive "Rolls Royce" GoHighLevel integration for this project with the following components:

## 1. Lead Scoring System
- Build a lead scoring algorithm (0-100 scale) based on user actions
- Score labels: "Urgent Need" (80+), "High Priority" (60-79), "Room to Improve" (40-59), "On Track" (0-39)
- Pass scores to GHL via custom fields: lead_score, lead_score_label, recommended_call_type
- Route leads to appropriate calendar/offer based on their score

## 2. Behavioral Tracking Hooks
Create reusable tracking hooks that can be used throughout the app:
- usePageTracking(pageName) - tracks page views with duration
- useBlogReadTracking(slug, title) - tracks content consumption with scroll depth
- trackFormSubmit(formName, data) - tracks form completions
- trackButtonClick(buttonName, context) - tracks CTA engagement

## 3. Server-Side Tracking API
Build tracking endpoints with:
- Rate limiting (30 requests/minute per IP)
- Zod schema validation on all inputs
- Endpoints for: assessment completion, page views, content reads, form submissions, key actions

## 4. GHL Webhook Endpoints
Create webhook receivers for GHL events:
- /api/ghl-webhooks/contact-created
- /api/ghl-webhooks/appointment-booked
- /api/ghl-webhooks/appointment-status-changed
- /api/ghl-webhooks/opportunity-status-changed
- /api/ghl-webhooks/contact-tag-added

Each endpoint needs: rate limiting (60/min), Zod validation, structured logging

## 5. GHL Setup Guide Document
After building the integration, create a comprehensive GHL_SETUP_GUIDE.md written at a 5th-grade reading level that covers:

### Part 1: Tags to Create
- Lead source tags (where they came from)
- Booking tags (what call they booked)
- Lead score tags (how hot they are)
- Include color suggestions and exact naming

### Part 2: Custom Fields to Create
- All fields the website will populate
- Field types (Number, Text, Date, etc.)
- What each field stores

### Part 3: Form-to-Tag Connections
- Step-by-step for each form
- Include form IDs from this project
- How to add automatic tagging

### Part 4: Calendar-to-Tag Connections
- Step-by-step for each calendar
- Include calendar IDs from this project
- Booking confirmation actions

### Part 5: Webhook Setup
- List all webhook URLs for this project
- Step-by-step GHL webhook configuration
- Which events to subscribe to

### Part 6-8: Workflow Templates
Provide copy-paste workflow instructions for:
- New Lead Welcome (email + SMS sequence)
- Appointment Reminders (1 day, 1 hour before)
- No-Show Follow Up (automated recovery)
- Lead Score Tag Assignment (If/Else logic)

### Part 9: Behavioral Tracking Explanation
- What the website tracks automatically
- How data flows to GHL
- What they'll see in contact records

### Part 10-12: Advanced Workflows
- Engagement score boosting
- Smart booking recommendations based on score
- Workshop/course completion automation

### Part 13-14: Score Levels & Routing
- Score range definitions
- Recommended actions per level
- Which calendar for which score

### Part 15: Testing Checklist
- Step-by-step testing procedures
- What to verify in GHL
- Troubleshooting common issues

### Reference Tables
- All Form & Calendar IDs in one place
- All Webhook URLs
- All Custom Fields with types
- Field-to-source mapping

## 6. Documentation Updates
Update replit.md with:
- GHL integration section
- All tracking endpoints
- All webhook endpoints  
- Form/Calendar ID reference table
- Link to the setup guide

## Key Requirements:
- All tracking must be non-blocking (don't slow down the user experience)
- Use session-based tracking (generate session IDs client-side)
- Include proper error handling that fails silently on tracking errors
- Make the setup guide so simple a non-technical team member can follow it
- Include plenty of tables, checklists, and step-by-step numbered instructions
- Test all endpoints work before completing
```

---

## CUSTOMIZATION NOTES:

Before using this prompt, gather this info about your project:

1. **Entry Points** - List all forms, quizzes, calendars in your app
2. **Lead Sources** - Where do leads come from? (homepage, blog, ads, etc.)
3. **Call Types** - What booking options exist? (discovery, strategy, coaching, etc.)
4. **Key Actions** - What actions indicate high intent? (downloads, video views, tool usage)
5. **Scoring Criteria** - What makes a lead "hot"? (revenue, urgency, problem type)

---

## EXAMPLE PROJECT-SPECIFIC ADDITIONS:

For a coaching business:
```
Additional tracking for:
- Free workshop completions
- Resource downloads
- Video watch time
- Quiz results
```

For an e-commerce business:
```
Additional tracking for:
- Cart abandonment
- Product views
- Wishlist additions
- Purchase history
```

For a SaaS product:
```
Additional tracking for:
- Trial signups
- Feature usage
- Onboarding completion
- Upgrade intent signals
```

---

## WHAT YOU'LL GET:

After using this prompt, your project will have:

1. **Lead Scoring** - Every visitor gets a score based on their behavior
2. **Behavioral Tracking** - Know what pages they visit, content they consume
3. **Smart Routing** - Send high-score leads to strategy calls, lower scores to quick chats
4. **Automated Follow-Up** - Workflows that nurture leads automatically
5. **Hot Lead Alerts** - Get notified when someone's engagement spikes
6. **Team-Ready Guide** - Documentation anyone can follow to set up GHL

This is enterprise-level marketing automation that typically costs $10k+ to implement!
