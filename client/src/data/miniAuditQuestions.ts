export interface AuditQuestion {
  id: string;
  question: string;
  fieldName: string;
  category: AuditCategory;
  options: { value: string; label: string; description?: string }[];
}

export type AuditCategory =
  | "Founder Dependency"
  | "Systems Maturity"
  | "Growth Readiness"
  | "Automation Potential";

export const CATEGORIES: AuditCategory[] = [
  "Founder Dependency",
  "Systems Maturity",
  "Growth Readiness",
  "Automation Potential",
];

// Score weights per answer — higher = more urgent need
export const SCORE_WEIGHTS: Record<string, Record<string, number>> = {
  weekly_hours: { under_40: 10, "40_50": 25, "50_60": 50, "60_plus": 100 },
  biggest_bottleneck: { me: 100, team: 60, systems: 80, leads: 40 },
  delegation_comfort: { very: 10, somewhat: 40, struggle: 70, never: 100 },
  annual_revenue: { under_250k: 20, "250k_500k": 40, "500k_1m": 70, "1m_plus": 100 },
  primary_goal: { scale: 60, freedom: 80, systems: 70, exit: 90 },
  automation_level: { none: 100, basic: 70, some: 40, advanced: 10 },
  team_size: { solo: 90, "2_5": 60, "6_15": 40, "16_plus": 20 },
  time_sink: { email: 50, meetings: 60, operations: 80, client_work: 40, admin: 70 },
  coaching_history: { never: 60, tried_failed: 80, currently: 20, past_success: 30 },
  urgency: { yesterday: 100, "30_days": 70, "90_days": 40, no_rush: 15 },
  ideal_hours: { under_20: 90, "20_30": 70, "30_40": 40, flexible: 20 },
};

// Which category each question contributes to
export const CATEGORY_MAP: Record<string, AuditCategory[]> = {
  weekly_hours: ["Founder Dependency"],
  biggest_bottleneck: ["Founder Dependency", "Systems Maturity"],
  delegation_comfort: ["Founder Dependency", "Growth Readiness"],
  annual_revenue: ["Growth Readiness"],
  primary_goal: ["Growth Readiness"],
  automation_level: ["Automation Potential", "Systems Maturity"],
  team_size: ["Growth Readiness", "Founder Dependency"],
  time_sink: ["Systems Maturity", "Automation Potential"],
  coaching_history: ["Growth Readiness"],
  urgency: ["Founder Dependency"],
  ideal_hours: ["Founder Dependency"],
};

export const questions: AuditQuestion[] = [
  {
    id: "hours",
    question: "How many hours per week are you working in your business?",
    fieldName: "weekly_hours",
    category: "Founder Dependency",
    options: [
      { value: "under_40", label: "Under 40 hours", description: "I've got a good handle on my time" },
      { value: "40_50", label: "40-50 hours", description: "Standard work week, manageable" },
      { value: "50_60", label: "50-60 hours", description: "Starting to feel the strain" },
      { value: "60_plus", label: "60+ hours", description: "I'm drowning and need help" },
    ],
  },
  {
    id: "business_type",
    question: "What best describes your business?",
    fieldName: "business_type",
    category: "Growth Readiness",
    options: [
      { value: "insurance_agency", label: "Insurance Agency", description: "I own or run an insurance agency" },
      { value: "coaching_consulting", label: "Coaching or Consulting", description: "I sell my expertise" },
      { value: "service_business", label: "Service Business", description: "I deliver a service to clients" },
      { value: "other", label: "Other", description: "Something else" },
    ],
  },
  {
    id: "bottleneck",
    question: "What's the biggest bottleneck in your business right now?",
    fieldName: "biggest_bottleneck",
    category: "Founder Dependency",
    options: [
      { value: "me", label: "Everything goes through me", description: "I'm the bottleneck for every decision" },
      { value: "team", label: "Team capacity", description: "My team is maxed out" },
      { value: "systems", label: "Lack of systems", description: "Things fall through the cracks" },
      { value: "leads", label: "Not enough leads", description: "I need more customers" },
    ],
  },
  {
    id: "delegation",
    question: "How comfortable are you with delegating tasks?",
    fieldName: "delegation_comfort",
    category: "Founder Dependency",
    options: [
      { value: "very", label: "Very comfortable", description: "I delegate regularly and effectively" },
      { value: "somewhat", label: "Somewhat comfortable", description: "I delegate but micromanage" },
      { value: "struggle", label: "I struggle with it", description: "I know I should but I can't let go" },
      { value: "never", label: "I do everything myself", description: "No one can do it like I can" },
    ],
  },
  {
    id: "team_size",
    question: "How many people work in your business (including you)?",
    fieldName: "team_size",
    category: "Growth Readiness",
    options: [
      { value: "solo", label: "Just me", description: "Solo operation" },
      { value: "2_5", label: "2-5 people", description: "Small team" },
      { value: "6_15", label: "6-15 people", description: "Growing team" },
      { value: "16_plus", label: "16+ people", description: "Established team" },
    ],
  },
  {
    id: "time_sink",
    question: "Where do most of your hours actually go?",
    fieldName: "time_sink",
    category: "Systems Maturity",
    options: [
      { value: "client_work", label: "Client-facing work", description: "Directly serving clients" },
      { value: "operations", label: "Operations & logistics", description: "Keeping the machine running" },
      { value: "admin", label: "Admin & busywork", description: "Emails, paperwork, data entry" },
      { value: "meetings", label: "Meetings & calls", description: "Internal team or vendor meetings" },
    ],
  },
  {
    id: "revenue",
    question: "What's your current annual revenue?",
    fieldName: "annual_revenue",
    category: "Growth Readiness",
    options: [
      { value: "under_250k", label: "Under $250K" },
      { value: "250k_500k", label: "$250K - $500K" },
      { value: "500k_1m", label: "$500K - $1M" },
      { value: "1m_plus", label: "$1M+" },
    ],
  },
  {
    id: "goal",
    question: "What's your primary goal for the next 12 months?",
    fieldName: "primary_goal",
    category: "Growth Readiness",
    options: [
      { value: "scale", label: "Scale revenue", description: "Grow the top line significantly" },
      { value: "freedom", label: "More time freedom", description: "Work less, live more" },
      { value: "systems", label: "Build better systems", description: "Create a business that runs without me" },
      { value: "exit", label: "Prepare to sell/exit", description: "Build enterprise value" },
    ],
  },
  {
    id: "automation",
    question: "How would you describe your current use of automation?",
    fieldName: "automation_level",
    category: "Automation Potential",
    options: [
      { value: "none", label: "What's automation?", description: "Everything is manual" },
      { value: "basic", label: "Basic tools only", description: "Email, maybe a CRM" },
      { value: "some", label: "Some automation", description: "A few processes are automated" },
      { value: "advanced", label: "Heavily automated", description: "We've automated most repetitive tasks" },
    ],
  },
  {
    id: "coaching",
    question: "Have you worked with a business coach or consultant before?",
    fieldName: "coaching_history",
    category: "Growth Readiness",
    options: [
      { value: "never", label: "Never", description: "First time considering it" },
      { value: "tried_failed", label: "Yes, but it didn't work", description: "Tried coaching, didn't get results" },
      { value: "past_success", label: "Yes, and it helped", description: "Had a good experience" },
      { value: "currently", label: "Currently working with one", description: "But looking for something different" },
    ],
  },
  {
    id: "urgency",
    question: "How urgently do you need things to change?",
    fieldName: "urgency",
    category: "Founder Dependency",
    options: [
      { value: "yesterday", label: "Yesterday", description: "I'm at a breaking point" },
      { value: "30_days", label: "Within 30 days", description: "I need momentum fast" },
      { value: "90_days", label: "Within 90 days", description: "I'm planning ahead" },
      { value: "no_rush", label: "No rush", description: "Just exploring options" },
    ],
  },
  {
    id: "ideal_hours",
    question: "In an ideal world, how many hours per week would you work?",
    fieldName: "ideal_hours",
    category: "Founder Dependency",
    options: [
      { value: "under_20", label: "Under 20", description: "I want to be mostly hands-off" },
      { value: "20_30", label: "20-30 hours", description: "Strategic involvement only" },
      { value: "30_40", label: "30-40 hours", description: "Normal week, just more focused" },
      { value: "flexible", label: "Flexible", description: "I just want to choose when" },
    ],
  },
];

export const TOTAL_QUESTIONS = questions.length;

// Calculate overall score (0-100)
export function calculateOverallScore(answers: Record<string, string>): number {
  let total = 0;
  let count = 0;
  for (const [field, value] of Object.entries(answers)) {
    if (SCORE_WEIGHTS[field]?.[value] !== undefined) {
      total += SCORE_WEIGHTS[field][value];
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : 0;
}

// Calculate per-category scores
export function calculateCategoryScores(answers: Record<string, string>): Record<AuditCategory, number> {
  const sums: Record<AuditCategory, number> = {
    "Founder Dependency": 0,
    "Systems Maturity": 0,
    "Growth Readiness": 0,
    "Automation Potential": 0,
  };
  const counts: Record<AuditCategory, number> = { ...sums };

  for (const [field, value] of Object.entries(answers)) {
    const weight = SCORE_WEIGHTS[field]?.[value];
    const cats = CATEGORY_MAP[field];
    if (weight !== undefined && cats) {
      for (const cat of cats) {
        sums[cat] += weight;
        counts[cat]++;
      }
    }
  }

  const result = {} as Record<AuditCategory, number>;
  for (const cat of CATEGORIES) {
    result[cat] = counts[cat] > 0 ? Math.round(sums[cat] / counts[cat]) : 0;
  }
  return result;
}

// Generate template-based insights per category
export function getCategoryInsight(category: AuditCategory, score: number): string {
  if (category === "Founder Dependency") {
    if (score >= 70) return "Your business has a critical founder dependency — it likely stalls when you're unavailable. Every major decision routes through you.";
    if (score >= 50) return "You're carrying too much. Key decisions still route through you, but there's room to delegate if you build the right framework.";
    if (score >= 30) return "You've started to delegate, but there are still hidden dependencies that could become bottlenecks under pressure.";
    return "You've built a healthy level of independence from the business. Focus on maintaining it as you grow.";
  }
  if (category === "Systems Maturity") {
    if (score >= 70) return "Your operations run on tribal knowledge and manual effort. When someone leaves, their processes leave with them.";
    if (score >= 50) return "Some processes are documented, but critical workflows still depend on individual memory and habit.";
    if (score >= 30) return "You have a reasonable systems foundation. The next step is automating the repetitive pieces.";
    return "Your systems are well-built. Look for optimization opportunities rather than foundational gaps.";
  }
  if (category === "Growth Readiness") {
    if (score >= 70) return "You're ready to grow but your infrastructure can't support it — adding revenue would amplify existing problems.";
    if (score >= 50) return "Growth potential is there, but structural gaps need addressing first to avoid scaling the wrong things.";
    if (score >= 30) return "Your foundation is solid enough to grow strategically. Focus on the highest-leverage changes.";
    return "You're well-positioned for growth. The question is which lever to pull first.";
  }
  // Automation Potential
  if (score >= 70) return "Massive automation opportunity — most of your repetitive tasks could be handled by systems you don't have yet.";
  if (score >= 50) return "You've started automating but you're only scratching the surface. The ROI on the next layer is significant.";
  if (score >= 30) return "You have decent automation in place. Look for the manual processes hiding between your automated ones.";
  return "You're well-automated. Focus on connecting your systems rather than adding new ones.";
}

// Locked teasers for the full audit upsell
export function getLockedTeaser(category: AuditCategory): string {
  const teasers: Record<AuditCategory, string> = {
    "Founder Dependency": "The full audit maps your exact delegation chain and identifies which 3 tasks to offload first for maximum time recovery.",
    "Systems Maturity": "The full audit documents your critical workflows and builds a custom SOP implementation roadmap with timelines.",
    "Growth Readiness": "The full audit calculates your exact revenue ceiling and identifies the structural changes needed to break through it.",
    "Automation Potential": "The full audit identifies your top 5 automation opportunities with projected ROI and implementation cost.",
  };
  return teasers[category];
}

// Score label and severity
export function getScoreLabel(score: number): { label: string; color: string; message: string } {
  if (score >= 70) return {
    label: "Founder Bottleneck Detected",
    color: "oklch(0.65 0.20 25)",
    message: "You are the bottleneck. Your business runs on you, not because of you. Without intervention, you're heading toward burnout and your growth ceiling is locked.",
  };
  if (score >= 50) return {
    label: "Bottleneck Risk: High",
    color: "oklch(0.75 0.15 80)",
    message: "Your business has significant founder dependencies. Key processes still run through you, and your engine is showing cracks.",
  };
  if (score >= 30) return {
    label: "Bottleneck Risk: Moderate",
    color: "var(--primary)",
    message: "You've built a decent foundation, but there are hidden bottlenecks limiting your potential. A few strategic changes could unlock real freedom.",
  };
  return {
    label: "Engine Running Smooth",
    color: "oklch(0.65 0.18 155)",
    message: "Your business engine is well-built. Let's explore how to optimize what's already working and plan your next level.",
  };
}

// Recommended call based on score
export function getRecommendedCall(answers: Record<string, string>, score: number) {
  if (score >= 70 || answers.weekly_hours === "60_plus" || answers.biggest_bottleneck === "me") {
    return {
      type: "discovery",
      url: "/jeremys-calendar-intro",
      label: "Discovery Call with Jeremy",
      description: "You've got a founder bottleneck — and you can't fix a broken engine from inside it. Let's map your escape plan in 30 minutes.",
    };
  }
  if (score >= 40 || answers.primary_goal === "systems" || answers.primary_goal === "scale") {
    return {
      type: "discovery",
      url: "/jeremys-calendar-intro",
      label: "Discovery Call with Jeremy",
      description: "Your engine has untapped potential. Let's identify the bottlenecks holding you back and build a plan to break through.",
    };
  }
  return {
    type: "discovery",
    url: "/jeremys-calendar-intro",
    label: "Discovery Call with Jeremy",
    description: "Let's have a quick conversation to see where you stand and map out your next steps toward a business that runs without you.",
  };
}
