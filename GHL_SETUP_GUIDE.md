# GoHighLevel Setup Guide for KeanOnBiz
## Easy Step-by-Step Instructions (5th Grade Level)

This guide shows you how to set up GoHighLevel to work with the KeanOnBiz website. Follow each step carefully!

---

## Part 1: Create Your Tags (Like Colored Stickers)

Tags are like putting colored stickers on contacts so you know where they came from.

### Step 1: Go to Tags
1. Log into GoHighLevel
2. Click **Settings** (the gear icon at the bottom left)
3. Click **Tags** on the left side menu
4. Click the **+ Add Tag** button

### Step 2: Create These Tags (One at a Time)
Click "+ Add Tag" and type each of these names. Pick a color you like for each one:

**Lead Source Tags (Where they came from):**
| Tag Name | Suggested Color |
|----------|-----------------|
| `Lead Source: Assessment` | Blue |
| `Lead Source: Newsletter` | Green |
| `Lead Source: Waterfall Workshop` | Purple |
| `Lead Source: Dirty Secret Coaching` | Orange |

**Booking Tags (What call they booked):**
| Tag Name | Suggested Color |
|----------|-----------------|
| `Booking: Quick Connect` | Yellow |
| `Booking: Strategy Session` | Red |
| `Booking: 1:1 Coaching` | Gold |

**Lead Score Tags (How hot they are):**
| Tag Name | Suggested Color |
|----------|-----------------|
| `Lead Score: Urgent Need` | Red |
| `Lead Score: High Priority` | Orange |
| `Lead Score: Room to Improve` | Blue |
| `Lead Score: On Track` | Green |

---

## Part 2: Create Custom Fields (Like Empty Boxes to Fill In)

Custom fields are like empty boxes on a form that get filled in automatically.

### Step 1: Go to Custom Fields
1. Click **Settings**
2. Click **Custom Fields** on the left side
3. Click **+ Add Field**

### Step 2: Create These Fields
For each one, click "+ Add Field" and fill in:

| Field Name | Field Type | Description |
|------------|-----------|-------------|
| `lead_score` | Number | Their assessment score (0-100) |
| `lead_score_label` | Single Line Text | Score label (Urgent Need, High Priority, etc.) |
| `recommended_call_type` | Single Line Text | Which call we suggest for them |
| `weekly_hours` | Single Line Text | How many hours they work |
| `biggest_bottleneck` | Single Line Text | Their main business problem |
| `delegation_comfort` | Single Line Text | How well they delegate |
| `annual_revenue` | Single Line Text | Their yearly revenue range |
| `primary_goal` | Single Line Text | What they want to achieve |
| `automation_level` | Single Line Text | How automated their business is |
| `assessment_date` | Date | When they took the assessment |

---

## Part 3: Connect Forms to Tags

Now we tell GHL to put the right sticker on people when they fill out forms.

### For the Assessment Form

1. Go to **Sites** → **Forms**
2. Find the form called "Assessment" (or look for form ID: `p7TQrdK8KZEQfC9JWtQT`)
3. Click on it to edit
4. Click **Settings** tab at the top
5. Scroll down to **Form Actions**
6. Click **+ Add Action**
7. Select **Add Tag**
8. Pick `Lead Source: Assessment`
9. Click **Save**

### For the Newsletter Form

1. Find form ID: `WeCKj6eththzMepQtObZ`
2. Add action → Add Tag → `Lead Source: Newsletter`
3. Save

### For the Waterfall Workshop Form

1. Find form ID: `zgCM4tgBuMifZyMfWfmH`
2. Add action → Add Tag → `Lead Source: Waterfall Workshop`
3. Save

### For the Dirty Secret Coaching Form

1. Find form ID: `BmNwodj0BwAaw5UlvZO0`
2. Add action → Add Tag → `Lead Source: Dirty Secret Coaching`
3. Save

---

## Part 4: Connect Calendars to Tags

### For Quick Connect Calendar

1. Go to **Calendars**
2. Find calendar ID: `exCGzR6pDrz2wfc2aoNt`
3. Click **Settings**
4. Find **Confirmation Actions** or **Booking Actions**
5. Add action → Add Tag → `Booking: Quick Connect`
6. Save

### For Strategy Session Calendar

1. Find calendar ID: `uslCIRV9xwkJQlHC1Rl7`
2. Add tag: `Booking: Strategy Session`

### For 1:1 Coaching Calendar

1. Find calendar ID: `HDMThBdATyMVW7HFteZe`
2. Add tag: `Booking: 1:1 Coaching`

---

## Part 5: Set Up Webhooks (The Website Talks to GHL)

Webhooks let GHL tell the website when things happen.

### Step 1: Find Your Webhook URL
Your website webhook URLs are:
- Contact Created: `https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/contact-created`
- Appointment Booked: `https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/appointment-booked`
- Appointment Changed: `https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/appointment-status-changed`

### Step 2: Set Up in GHL
1. Go to **Settings** → **Webhooks**
2. Click **+ Add Webhook**
3. For "Contact Created":
   - Name: `KeanOnBiz Contact Created`
   - URL: Paste the contact-created URL from above
   - Events: Check `Contact Created`
4. Click **Save**
5. Repeat for the other webhooks

---

## Part 6: Create Your First Workflow (Automation Magic!)

A workflow is like a robot that does things automatically when something happens.

### Workflow 1: New Assessment Lead

**What it does:** When someone takes the assessment, this workflow:
- Adds a tag based on their score
- Sends them an email
- Sends them a text message
- Creates a task for Jeremy

### How to Build It:

1. Go to **Automation** → **Workflows**
2. Click **+ Create Workflow**
3. Name it: "New Assessment Lead"
4. Click **+ Add New Trigger**
5. Select **Form Submitted**
6. Pick your Assessment form
7. Click **Save Trigger**

Now add these steps (click the + below each step):

**Step 1: Wait 1 Minute**
- Action: Wait
- Time: 1 minute

**Step 2: Add Tag Based on Score**
- Action: If/Else (Condition)
- IF: Custom Field "lead_score" is greater than 70
  - THEN: Add Tag "Lead Score: Urgent Need"
- ELSE IF: Custom Field "lead_score" is greater than 50
  - THEN: Add Tag "Lead Score: High Priority"
- ELSE IF: Custom Field "lead_score" is greater than 30
  - THEN: Add Tag "Lead Score: Room to Improve"
- ELSE:
  - Add Tag "Lead Score: On Track"

**Step 3: Send Welcome Email**
- Action: Send Email
- Subject: "Your Assessment Results Are In!"
- Body: (Write a nice email thanking them)

**Step 4: Wait 1 Day**
- Action: Wait
- Time: 1 day

**Step 5: Send Follow-Up SMS**
- Action: Send SMS
- Message: "Hi {{contact.first_name}}! Just checking in about your assessment. Ready to chat about next steps?"

**Step 6: Create Task for Jeremy**
- Action: Create Task
- Title: "Follow up with {{contact.name}}"
- Assign to: Jeremy Kean
- Due: Today

8. Click **Publish** in the top right

---

### Workflow 2: Newsletter Welcome

1. Create new workflow named "Newsletter Welcome"
2. Trigger: Form Submitted → Newsletter form
3. Steps:
   - Send Email: "Welcome to the newsletter!"
   - Wait 3 days
   - Send Email: "Here's what you might have missed..."

---

### Workflow 3: Appointment Reminder

1. Create workflow named "Appointment Reminder"
2. Trigger: Appointment Booked
3. Steps:
   - Send SMS: "Your call with Jeremy is confirmed! See you {{appointment.start_time}}"
   - Wait until 1 day before appointment
   - Send Email: "Reminder: Your call is tomorrow"
   - Wait until 1 hour before
   - Send SMS: "See you in 1 hour! Here's your meeting link: {{appointment.meeting_location}}"

---

### Workflow 4: No-Show Follow Up

1. Create workflow named "No-Show Follow Up"
2. Trigger: Appointment Status Changed → Status = No Show
3. Steps:
   - Wait 30 minutes
   - Send SMS: "Sorry I missed you! Would you like to reschedule?"
   - Wait 1 day
   - Send Email: "Let's try again - here's my calendar link"

---

## Part 7: Create Your Pipeline (Track Leads Like a Game)

A pipeline shows you where each lead is in their journey.

### Step 1: Create the Pipeline
1. Go to **Opportunities** → **Pipelines**
2. Click **+ Create Pipeline**
3. Name it: "KeanOnBiz Leads"

### Step 2: Add These Stages
Click "+ Add Stage" for each one:

| Stage Name | Color | What It Means |
|------------|-------|--------------|
| New Lead | Gray | Just signed up |
| Engaged | Blue | Took assessment or workshop |
| Call Booked | Yellow | Has appointment scheduled |
| Call Completed | Orange | We talked to them |
| Proposal Sent | Purple | They're considering an offer |
| Won | Green | They became a client! |
| Lost | Red | Didn't work out |

### Step 3: Add Workflow to Move Leads
Create a workflow that:
- When someone books a call → Move to "Call Booked" stage
- When call is completed → Move to "Call Completed" stage

---

## Part 8: Test Everything!

### How to Test:
1. Open your website in a private/incognito window
2. Take the assessment using a test email (like yourname+test@gmail.com)
3. Check GHL to see if:
   - Contact was created
   - Tags were added
   - Custom fields were filled
   - Workflow started

### What to Look For:
- [ ] Contact appears in GHL
- [ ] Correct tags are attached
- [ ] Lead score shows in custom field
- [ ] Welcome email was sent
- [ ] Pipeline opportunity was created

---

## Quick Reference: All Form & Calendar IDs

| Item | GHL ID |
|------|--------|
| Assessment Form | `p7TQrdK8KZEQfC9JWtQT` |
| Newsletter Form | `WeCKj6eththzMepQtObZ` |
| Waterfall Workshop Form | `zgCM4tgBuMifZyMfWfmH` |
| Dirty Secret Coaching | `BmNwodj0BwAaw5UlvZO0` |
| Quick Connect Calendar | `exCGzR6pDrz2wfc2aoNt` |
| Strategy Session Calendar | `uslCIRV9xwkJQlHC1Rl7` |
| 1:1 Coaching Calendar | `HDMThBdATyMVW7HFteZe` |

---

## Quick Reference: Website Webhook URLs

Replace `YOUR-DOMAIN` with your actual Replit domain:

```
https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/contact-created
https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/appointment-booked
https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/appointment-status-changed
https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/opportunity-status-changed
https://YOUR-DOMAIN.replit.app/api/ghl-webhooks/contact-tag-added
```

---

## Need Help?

If something isn't working:
1. Double-check you spelled everything exactly right
2. Make sure you clicked "Save" after each change
3. Wait 5 minutes and try again (sometimes GHL takes time to update)
4. Check the workflow history to see if it ran

---

## Summary: What You Built

After completing this guide, your website will:

1. **Score Leads Automatically** - Every person who takes the assessment gets a score
2. **Tag People by Source** - You know exactly where each lead came from
3. **Recommend the Right Call** - High-score leads are directed to Strategy calls
4. **Send Welcome Messages** - Automatic emails and texts go out
5. **Remind About Appointments** - People get reminders before calls
6. **Follow Up on No-Shows** - Automatic outreach if someone misses their call
7. **Track Lead Progress** - See everyone's journey in the pipeline

You've got a Rolls Royce integration!

---

## Part 9: Understanding Website Tracking (What the Website Tells GHL)

The KeanOnBiz website automatically tracks what visitors do. This helps you understand your leads better!

### What Gets Tracked Automatically:

**1. Page Views**
- Every page someone visits gets recorded
- You can see how long they stayed on each page
- Great for knowing what content interests them

**2. Blog Reading**
- Which blog posts they read
- How far they scrolled (did they read the whole thing?)
- How long they spent reading

**3. Assessment Answers**
- Every answer they pick
- Their final score (0-100)
- The score label (Urgent Need, High Priority, etc.)
- Which call type we recommend for them

**4. Newsletter Signups**
- When they subscribed
- Where on the site they signed up from

**5. Waterfall Workshop Completions**
- When they finished the workshop
- How many tasks they identified
- How many tasks they want to delegate

---

## Part 10: Custom Fields for Tracking Data

To see all this data in GHL, you might want to add these extra custom fields:

### Step 1: Go to Custom Fields
1. Click **Settings**
2. Click **Custom Fields**
3. Click **+ Add Field**

### Step 2: Create These Additional Fields

| Field Name | Field Type | What It Shows |
|------------|-----------|---------------|
| `pages_viewed` | Multi Line Text | List of pages they visited |
| `blog_posts_read` | Multi Line Text | Blog posts they read |
| `time_on_site` | Number | Total seconds on website |
| `workshop_tasks_total` | Number | Total tasks in workshop |
| `workshop_delegate_now` | Number | Tasks marked "Delegate NOW" |
| `last_activity_date` | Date | When they last visited |

---

## Part 11: Advanced Workflow - Lead Scoring Updates

This workflow updates a lead's score based on their behavior over time.

### Workflow: Engagement Score Boost

**What it does:** When someone does something valuable (like reading blogs or completing the workshop), their lead score goes up!

### How to Build It:

1. Go to **Automation** → **Workflows**
2. Click **+ Create Workflow**
3. Name it: "Engagement Score Boost"

**Trigger Option 1: Webhook (Advanced)**
- Trigger: Inbound Webhook
- URL: Use the one GHL gives you
- This lets the website send updates directly

**Trigger Option 2: Tag Added**
- Trigger: Tag Added
- Tag: `Lead Source: Waterfall Workshop` or any tag that means high engagement

### Steps to Add:

**Step 1: Check Current Score**
- Action: If/Else
- IF: Custom Field "lead_score" exists
  - THEN: Continue to Step 2
- ELSE: Set lead_score to 20

**Step 2: Boost Score**
- Action: Update Contact Field
- Field: lead_score
- Value: Add 15 points to current value
- Note: GHL might need a formula or you may need to use a Math action

**Step 3: Update Score Label**
- Action: If/Else
- IF: lead_score is greater than 70
  - Update lead_score_label to "Urgent Need"
  - Add Tag "Lead Score: Urgent Need"
- ELSE IF: lead_score is greater than 50
  - Update lead_score_label to "High Priority"
  - Add Tag "Lead Score: High Priority"

**Step 4: Alert for Hot Leads**
- Action: If/Else
- IF: lead_score is greater than 80
  - Send Internal Notification to Jeremy
  - Message: "🔥 Hot Lead Alert! {{contact.name}} just hit score {{contact.lead_score}}!"

---

## Part 12: Workflow for Waterfall Workshop Completions

When someone finishes the Waterfall Workshop, they're a great lead!

### Workflow: Workshop Completed

1. Create workflow named "Workshop Completed"
2. Trigger: Form Submitted → Waterfall Workshop form
3. Steps:

**Step 1: Add Tags**
- Add Tag: `Lead Source: Waterfall Workshop`
- Add Tag: `Lead Score: High Priority`

**Step 2: Boost Lead Score**
- Update Custom Field: lead_score
- Add 25 points (workshop completers are engaged!)

**Step 3: Send Congratulations Email**
- Subject: "You Did It! Your Waterfall Workshop Results"
- Body: 
  ```
  Congratulations {{contact.first_name}}!
  
  You just completed the Waterfall Workshop and identified 
  tasks that are eating your time.
  
  The next step? Let's talk about getting those tasks 
  off your plate for good.
  
  Book a quick chat: [CALENDAR LINK]
  
  - Jeremy
  ```

**Step 4: Create High-Priority Task**
- Action: Create Task
- Title: "🎯 Workshop Complete: Follow up with {{contact.name}}"
- Priority: High
- Assign to: Jeremy
- Due: Today

**Step 5: Wait 2 Days**
- Action: Wait → 2 days

**Step 6: Send Follow-Up**
- Action: Send SMS
- Message: "Hey {{contact.first_name}}! How are those tasks from the Waterfall Workshop going? Ready to talk about delegation?"

---

## Part 13: Understanding Lead Score Levels

Here's what each score range means and how to handle them:

| Score | Label | What It Means | Best Action |
|-------|-------|---------------|-------------|
| 80-100 | Urgent Need | They're drowning and need help NOW | Call within 24 hours! |
| 60-79 | High Priority | Definite pain points, ready for solutions | Book strategy call |
| 40-59 | Room to Improve | Some issues, researching options | Nurture with content |
| 0-39 | On Track | Curious but not urgent | Keep in newsletter |

### How Scores Are Calculated:

The website scores leads based on 6 assessment questions:

1. **Weekly Hours Working** - More hours = higher need
2. **Biggest Bottleneck** - Some problems score higher
3. **Delegation Comfort** - Less comfort = more coaching needed
4. **Annual Revenue** - Higher revenue = more valuable lead
5. **Primary Goal** - Growth goals = higher priority
6. **Automation Level** - Less automated = more opportunity

---

## Part 14: Setting Up Smart Booking Recommendations

Based on their score, the website recommends different call types:

| Score Range | Recommended Call | Calendar to Use |
|-------------|------------------|-----------------|
| 70+ | Strategy Session | `uslCIRV9xwkJQlHC1Rl7` |
| 40-69 | Quick Connect | `exCGzR6pDrz2wfc2aoNt` |
| Below 40 | Newsletter (no call) | N/A |

### Workflow: Route to Right Calendar

1. Create workflow named "Smart Booking Router"
2. Trigger: Form Submitted → Assessment

**Step 1: Check Score**
- Action: If/Else
- IF: lead_score is greater than or equal to 70
  - Send Email with Strategy Session link
  - Subject: "Let's Talk Strategy - Book Your Session"
- ELSE IF: lead_score is greater than or equal to 40
  - Send Email with Quick Connect link
  - Subject: "Quick Chat? Here's My Calendar"
- ELSE:
  - Send Email with valuable content
  - Subject: "Here's Something That Might Help"

---

## Part 15: Testing Your Tracking Setup

### Test 1: Page View Tracking
1. Open your website in incognito mode
2. Visit 3-4 different pages
3. Take the assessment with test email
4. Check GHL - you should see the contact's activity

### Test 2: Blog Reading
1. Read a blog post for at least 30 seconds
2. Scroll to the bottom
3. Take assessment
4. Check if blog data appears in GHL

### Test 3: Lead Score
1. Take assessment with different answers
2. Check that lead_score custom field has a value
3. Verify the correct tag was applied

### Test 4: Workshop
1. Complete the Waterfall Workshop
2. Check that workshop data appears in GHL
3. Verify the workflow triggered

### Checklist:
- [ ] Page views are being tracked
- [ ] Lead scores appear in custom fields
- [ ] Correct score tags are applied
- [ ] Workshop completions trigger workflow
- [ ] Smart booking emails have right calendar links

---

## Troubleshooting Tracking Issues

**Problem: Scores aren't showing up**
- Check that custom fields are created with exact names
- Wait 5 minutes - data syncs can be delayed
- Check workflow history for errors

**Problem: Wrong tags are being added**
- Review your If/Else conditions in workflows
- Make sure score ranges don't overlap
- Check that field names match exactly

**Problem: Webhook not receiving data**
- Verify webhook URL is correct
- Check that webhook is active in GHL
- Look at GHL webhook logs for errors

**Problem: Emails not sending**
- Check that email templates exist
- Verify sending domain is set up
- Look at workflow execution logs

---

## Complete Field Reference

Here's every custom field the website can send:

| Field | Type | From | Description |
|-------|------|------|-------------|
| lead_score | Number | Assessment | 0-100 score |
| lead_score_label | Text | Assessment | Human-readable label |
| recommended_call_type | Text | Assessment | quick-connect/strategy/coaching |
| weekly_hours | Text | Assessment Q1 | Their work hours |
| biggest_bottleneck | Text | Assessment Q2 | Main pain point |
| delegation_comfort | Text | Assessment Q3 | Delegation ability |
| annual_revenue | Text | Assessment Q4 | Revenue range |
| primary_goal | Text | Assessment Q5 | Main objective |
| automation_level | Text | Assessment Q6 | Current automation |
| assessment_date | Date | Assessment | When completed |
| workshop_tasks_total | Number | Workshop | Total tasks identified |
| workshop_delegate_now | Number | Workshop | Urgent delegation items |
| pages_viewed | Text | Tracking | Page visit history |
| blog_posts_read | Text | Tracking | Blog engagement |

---

## You're Done! 🎉

Your KeanOnBiz website now has enterprise-level tracking that:

1. **Scores Every Lead** - Know instantly who's hot and who's not
2. **Tracks Behavior** - See what pages they visit and content they consume
3. **Routes Intelligently** - Send people to the right call type
4. **Automates Follow-Up** - Never let a lead slip through the cracks
5. **Alerts You to Hot Leads** - Get notified when someone's score goes high
6. **Nurtures Cold Leads** - Keep them engaged with content

This is the Rolls Royce of GHL integrations!
