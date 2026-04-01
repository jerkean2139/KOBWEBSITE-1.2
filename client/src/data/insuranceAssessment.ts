export interface AssessmentOption {
  text: string;
  value: number;
  lifePenetration?: number;
  revenueMultiplier?: number;
}

export interface AssessmentQuestion {
  id: number;
  phase: 1 | 2;
  category: string;
  categoryIcon: string;
  question: string;
  helper: string;
  type: "radio" | "numeric";
  options?: AssessmentOption[];
  unit?: string;
  default?: number;
  min?: number;
  max?: number;
}

export const categories = [
  "Team Performance & Accountability",
  "Sales Process & Presentation",
  "Life & Health Production",
  "Team Culture & Psychology",
  "Owner Operations & Delegation",
  "Client Retention & Growth",
  "Sales Discipline & Systems",
  "Revenue & Opportunity",
] as const;

export type Category = (typeof categories)[number];

export const categoryIcons: Record<Category, string> = {
  "Team Performance & Accountability": "target",
  "Sales Process & Presentation": "presentation",
  "Life & Health Production": "heart-pulse",
  "Team Culture & Psychology": "users",
  "Owner Operations & Delegation": "briefcase",
  "Client Retention & Growth": "trending-up",
  "Sales Discipline & Systems": "clipboard-check",
  "Revenue & Opportunity": "dollar-sign",
};

export const questions: AssessmentQuestion[] = [
  {
    id: 1,
    phase: 1,
    category: "Team Performance & Accountability",
    categoryIcon: "target",
    question: "Does every person on your team have specific, measurable monthly goals?",
    helper: "Not corporate goals — individual production targets they own.",
    type: "radio",
    options: [
      { text: "Yes — each person has clear numbers they track weekly", value: 0 },
      { text: "Sort of — we have team goals but not individual ones", value: 350 },
      { text: "We talk about goals but nothing is written down", value: 650 },
      { text: "No — we just try to hit the agency number", value: 950 },
    ],
  },
  {
    id: 2,
    phase: 1,
    category: "Team Performance & Accountability",
    categoryIcon: "target",
    question: "How does your team know if they're winning or losing on any given day?",
    helper: "Think scoreboard, dashboard, daily tracking…",
    type: "radio",
    options: [
      { text: "Real-time dashboard everyone can see (Red/Green system)", value: 0 },
      { text: "I review numbers with them weekly", value: 300 },
      { text: "They find out at the end of the month", value: 600 },
      { text: "They don't — I'm the only one watching numbers", value: 900 },
    ],
  },
  {
    id: 3,
    phase: 1,
    category: "Team Performance & Accountability",
    categoryIcon: "target",
    question: "When a team member misses their targets, what happens?",
    helper: "Accountability is the difference between a wish and a plan.",
    type: "radio",
    options: [
      { text: "Structured conversation with action plan within 48 hours", value: 0 },
      { text: "I mention it but there's no formal process", value: 400 },
      { text: "Nothing — I avoid confrontation", value: 750 },
      { text: "I didn't know they missed because we don't track individually", value: 1000 },
    ],
  },
  {
    id: 4,
    phase: 1,
    category: "Team Performance & Accountability",
    categoryIcon: "target",
    question: "How often do you review production data with your team?",
    helper: "By the 10th, 20th, and 30th — or never?",
    type: "radio",
    options: [
      { text: "3x/month with structured check-ins (10th/20th/30th)", value: 0 },
      { text: "Monthly at best", value: 250 },
      { text: "Quarterly when reports come in", value: 500 },
      { text: "Only when something goes wrong", value: 750 },
    ],
  },
  {
    id: 5,
    phase: 1,
    category: "Sales Process & Presentation",
    categoryIcon: "presentation",
    question: "When a new lead comes in, how fast does your team present a quote?",
    helper: "Speed-to-quote is the #1 predictor of close rate in insurance.",
    type: "radio",
    options: [
      { text: "Same day — we have a system for immediate presentation", value: 0 },
      { text: "Within 24-48 hours", value: 400 },
      { text: "It depends on who picks it up", value: 800 },
      { text: "We usually call them back when we get around to it", value: 1200 },
    ],
  },
  {
    id: 6,
    phase: 1,
    category: "Sales Process & Presentation",
    categoryIcon: "presentation",
    question: "Does your team present insurance as a value conversation or a price comparison?",
    helper: "If your team leads with price, you've already lost.",
    type: "radio",
    options: [
      { text: "Value-first — we do full gap audits and tell the client's story", value: 0 },
      { text: "We try, but most reps default to quoting price", value: 500 },
      { text: "Mostly price comparisons — that's what the client asks for", value: 900 },
      { text: "We just send quotes and hope for the best", value: 1300 },
    ],
  },
  {
    id: 7,
    phase: 1,
    category: "Sales Process & Presentation",
    categoryIcon: "presentation",
    question: "Do you have a structured follow-up process after quoting but before closing?",
    helper: "80% of sales happen between the 5th and 12th contact.",
    type: "radio",
    options: [
      { text: "Yes — structured personal follow-up sequence", value: 0 },
      { text: "Some reps follow up, but it's inconsistent", value: 450 },
      { text: "We follow up once, maybe twice", value: 800 },
      { text: "If they don't call back, we move on", value: 1100 },
    ],
  },
  {
    id: 8,
    phase: 1,
    category: "Sales Process & Presentation",
    categoryIcon: "presentation",
    question: "What happens when a prospect says 'I need to think about it'?",
    helper: "This is where deals die or get saved.",
    type: "radio",
    options: [
      { text: "We have trained responses and a same-day close process", value: 0 },
      { text: "We say 'okay' and hope they call back", value: 500 },
      { text: "We don't have a response — the rep freezes", value: 850 },
      { text: "Honestly, I don't know what my team says in that moment", value: 1100 },
    ],
  },
  {
    id: 9,
    phase: 1,
    category: "Life & Health Production",
    categoryIcon: "heart-pulse",
    question: "What percentage of your auto/fire clients also have a life policy with you?",
    helper: "The industry average for independent agencies is under 30%.",
    type: "radio",
    options: [
      { text: "Over 50% — we pivot on every conversation", value: 0, lifePenetration: 0.55 },
      { text: "30-50% — we try but it's inconsistent", value: 600, lifePenetration: 0.40 },
      { text: "Under 30% — life comes up occasionally", value: 1100, lifePenetration: 0.25 },
      { text: "I honestly don't know the number", value: 1500, lifePenetration: 0.15 },
    ],
  },
  {
    id: 10,
    phase: 1,
    category: "Life & Health Production",
    categoryIcon: "heart-pulse",
    question: "Does your team have a trained 'life pivot' they use on every call?",
    helper: "Not a pitch — a natural bridge from auto/fire to life.",
    type: "radio",
    options: [
      { text: "Yes — every team member has a practiced pivot", value: 0 },
      { text: "A couple people do it, but most skip it", value: 500 },
      { text: "We mention life sometimes but there's no system", value: 900 },
      { text: "Life production is basically an afterthought", value: 1300 },
    ],
  },
  {
    id: 11,
    phase: 1,
    category: "Life & Health Production",
    categoryIcon: "heart-pulse",
    question: "Are you actively cross-selling health and financial services?",
    helper: "These lines separate top-performing agencies from average ones.",
    type: "radio",
    options: [
      { text: "Yes — it's part of our review and onboarding process", value: 0 },
      { text: "Occasionally — when the client brings it up", value: 400 },
      { text: "Rarely — we don't feel confident in those products", value: 750 },
      { text: "Never — we stick to auto and fire", value: 1000 },
    ],
  },
  {
    id: 12,
    phase: 1,
    category: "Team Culture & Psychology",
    categoryIcon: "users",
    question: "If your top producer quit tomorrow, what would happen to your agency?",
    helper: "If one person leaving would tank your numbers, that's a structural problem.",
    type: "radio",
    options: [
      { text: "We'd adjust — no single person carries the agency", value: 0 },
      { text: "It would hurt but we'd recover in a month or two", value: 350 },
      { text: "It would seriously damage us for 3-6 months", value: 800 },
      { text: "It would be catastrophic — they ARE the agency", value: 1200 },
    ],
  },
  {
    id: 13,
    phase: 1,
    category: "Team Culture & Psychology",
    categoryIcon: "users",
    question: "How would you rate your team's confidence level right now?",
    helper: "Confidence drives production more than product knowledge.",
    type: "radio",
    options: [
      { text: "High — they believe in themselves and the agency", value: 0 },
      { text: "Mixed — some are confident, others are struggling", value: 400 },
      { text: "Low — there's a lot of self-doubt and hesitation", value: 750 },
      { text: "Toxic — negativity and drama are constant", value: 1100 },
    ],
  },
  {
    id: 14,
    phase: 1,
    category: "Team Culture & Psychology",
    categoryIcon: "users",
    question: "When there's conflict on your team, how do you handle it?",
    helper: "Unresolved conflict costs more than you think.",
    type: "radio",
    options: [
      { text: "Direct conversation with both parties within 24 hours", value: 0 },
      { text: "I address it eventually but often let it simmer", value: 350 },
      { text: "I avoid it and hope it resolves itself", value: 700 },
      { text: "Conflict is constant and I don't know how to fix it", value: 1000 },
    ],
  },
  {
    id: 15,
    phase: 1,
    category: "Team Culture & Psychology",
    categoryIcon: "users",
    question: "Does your team genuinely like working together?",
    helper: "Culture isn't a perk — it's a production multiplier.",
    type: "radio",
    options: [
      { text: "Yes — there's real camaraderie and mutual respect", value: 0 },
      { text: "Mostly — a few personality clashes but manageable", value: 300 },
      { text: "It's tense — people tolerate each other", value: 600 },
      { text: "It's toxic — I'm afraid someone is about to quit", value: 1000 },
    ],
  },
  {
    id: 16,
    phase: 1,
    category: "Owner Operations & Delegation",
    categoryIcon: "briefcase",
    question: "How many hours per week do YOU spend on tasks your team should handle?",
    helper: "Admin, quoting, scheduling, service work, putting out fires…",
    type: "radio",
    options: [
      { text: "Less than 5 — my team runs operations", value: 0 },
      { text: "5-15 hours — I still handle a lot of day-to-day", value: 500 },
      { text: "15-25 hours — I'm doing my job AND theirs", value: 1000 },
      { text: "25+ hours — I am the agency, they just help", value: 1500 },
    ],
  },
  {
    id: 17,
    phase: 1,
    category: "Owner Operations & Delegation",
    categoryIcon: "briefcase",
    question: "Are you operating as the CEO of your agency or as the top-producing agent?",
    helper: "There's a massive difference — and it determines your ceiling.",
    type: "radio",
    options: [
      { text: "CEO — I work ON the business, not IN it", value: 0 },
      { text: "Mostly CEO but I still produce a lot personally", value: 400 },
      { text: "More agent than CEO — I can't step away", value: 800 },
      { text: "100% agent — if I stop producing, we stop growing", value: 1200 },
    ],
  },
  {
    id: 18,
    phase: 1,
    category: "Owner Operations & Delegation",
    categoryIcon: "briefcase",
    question: "If you took a 2-week vacation, what would happen?",
    helper: "This is the ultimate test of your systems.",
    type: "radio",
    options: [
      { text: "Business runs smoothly — I've done it", value: 0 },
      { text: "Minor hiccups but mostly fine", value: 300 },
      { text: "Significant drop in production and service", value: 700 },
      { text: "It would basically stop — I can't leave", value: 1100 },
    ],
  },
  {
    id: 19,
    phase: 1,
    category: "Client Retention & Growth",
    categoryIcon: "trending-up",
    question: "What is your current client retention rate?",
    helper: "Every lost client costs 5-10x more to replace.",
    type: "radio",
    options: [
      { text: "95%+ — we have retention systems in place", value: 0 },
      { text: "90-95% — decent but we lose some we shouldn't", value: 500 },
      { text: "85-90% — noticeable churn every month", value: 900 },
      { text: "Below 85% or I don't know", value: 1300 },
    ],
  },
  {
    id: 20,
    phase: 1,
    category: "Client Retention & Growth",
    categoryIcon: "trending-up",
    question: "Do you have a structured outreach system for existing clients?",
    helper: "Not marketing blasts — personal, intentional contact.",
    type: "radio",
    options: [
      { text: "Yes — daily outreach buckets with tracked minimums", value: 0 },
      { text: "We do some outreach but it's not systematic", value: 400 },
      { text: "Only when it's time for renewal", value: 750 },
      { text: "No — we wait for them to call us", value: 1000 },
    ],
  },
  {
    id: 21,
    phase: 1,
    category: "Client Retention & Growth",
    categoryIcon: "trending-up",
    question: "How many referrals does your team generate per month?",
    helper: "Referrals are the highest-converting, lowest-cost leads.",
    type: "radio",
    options: [
      { text: "10+ per month with a referral system", value: 0 },
      { text: "5-10 but it's organic, no system", value: 350 },
      { text: "A few, unpredictably", value: 650 },
      { text: "Almost none — we don't ask", value: 900 },
    ],
  },
  {
    id: 22,
    phase: 1,
    category: "Sales Discipline & Systems",
    categoryIcon: "clipboard-check",
    question: "Do you have a single scoreboard showing daily/weekly/monthly production?",
    helper: "If your team can't see the score, they can't play to win.",
    type: "radio",
    options: [
      { text: "Yes — visible dashboard updated in real-time", value: 0 },
      { text: "I track it but the team doesn't see it regularly", value: 350 },
      { text: "We use carrier reports at month-end", value: 600 },
      { text: "No consistent tracking at all", value: 900 },
    ],
  },
  {
    id: 23,
    phase: 1,
    category: "Sales Discipline & Systems",
    categoryIcon: "clipboard-check",
    question: "Does your team have a documented process for handling the top 5 objections they hear every day?",
    helper: "'I need to think about it.' 'I'm happy with my current rate.' 'Just send me a quote.' — does your team know what to say?",
    type: "radio",
    options: [
      { text: "Yes — we've trained and role-played every common objection", value: 0 },
      { text: "A couple reps handle objections well, but most wing it", value: 450 },
      { text: "We don't have a formal objection-handling process", value: 800 },
      { text: "My team avoids pushback entirely — they just accept 'no'", value: 1200 },
    ],
  },
  {
    id: 24,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "What is your average annual premium per new auto/fire client?",
    helper: "Average across all new business this year.",
    type: "numeric",
    unit: "$/year",
    default: 1800,
    min: 0,
    max: 100000,
  },
  {
    id: 25,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "How many new policies does your agency write per month?",
    helper: "Across all lines — auto, fire, life, health.",
    type: "numeric",
    unit: "policies/month",
    default: 40,
    min: 0,
    max: 1000,
  },
  {
    id: 26,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "How many team members do you have (including yourself)?",
    helper: "Full-time equivalents.",
    type: "numeric",
    unit: "people",
    default: 4,
    min: 1,
    max: 100,
  },
  {
    id: 27,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "What is your average staff hourly cost?",
    helper: "Loaded cost (salary + benefits + overhead).",
    type: "numeric",
    unit: "$/hr",
    default: 25,
    min: 0,
    max: 500,
  },
  {
    id: 28,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "What would you estimate your hourly value is as the agency owner?",
    helper: "What should your time be worth when you're doing CEO-level work?",
    type: "numeric",
    unit: "$/hour",
    default: 150,
    min: 0,
    max: 1000,
  },
  {
    id: 29,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "How many hours/week do YOU spend on tasks your team should handle?",
    helper: "Admin, inbox, scheduling, quoting, putting out fires — things you shouldn't be doing.",
    type: "numeric",
    unit: "hrs/week",
    default: 15,
    min: 0,
    max: 80,
  },
  {
    id: 30,
    phase: 2,
    category: "Revenue & Opportunity",
    categoryIcon: "dollar-sign",
    question: "If you got 10 extra hours per week, what would you do with them?",
    helper: "This determines how we calculate your revenue upside.",
    type: "radio",
    options: [
      { text: "Close more deals and have better conversations", value: 0, revenueMultiplier: 1.3 },
      { text: "Build referral partnerships and community presence", value: 0, revenueMultiplier: 1.2 },
      { text: "Coach, train, and develop my team", value: 0, revenueMultiplier: 1.15 },
      { text: "Work on the business — strategy, growth, and planning", value: 0, revenueMultiplier: 1.1 },
    ],
  },
];

export const HALFWAY_QUESTION_ID = 11;
export const PHASE_TRANSITION_QUESTION_ID = 23;
export const TOTAL_QUESTIONS = 30;

export interface RiskLevel {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badge: string;
  quote: string;
}

export const riskLevels: RiskLevel[] = [
  {
    label: "Low Risk",
    color: "green",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    textColor: "text-green-500",
    badge: "✓",
    quote: "Small optimizations can still unlock thousands.",
  },
  {
    label: "Moderate Risk",
    color: "yellow",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-500",
    badge: "⚠",
    quote: "That's a team member's salary leaking out every year.",
  },
  {
    label: "High Risk",
    color: "orange",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-500",
    badge: "⚠",
    quote: "You're paying for coaching you're not getting — from the worst coach possible: nobody.",
  },
  {
    label: "Critical",
    color: "red",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    textColor: "text-red-500",
    badge: "🚨",
    quote: "Your agency is funding someone else's growth with your waste.",
  },
];

export function getRiskLevel(leakage: number): RiskLevel {
  if (leakage <= 2000) return riskLevels[0];
  if (leakage <= 5000) return riskLevels[1];
  if (leakage <= 10000) return riskLevels[2];
  return riskLevels[3];
}

export function getProgressText(currentQuestion: number, total: number): string {
  const pct = currentQuestion / total;
  if (currentQuestion === total) return "Last question!";
  if (pct >= 0.75) return "Almost there...";
  if (pct >= 0.5) return "Over halfway!";
  if (pct >= 0.25) return "Great progress!";
  return "Let's get started";
}

export interface ScoringResult {
  phase1Leakage: number;
  costSaved: number;
  revenueGained: number;
  hoursRecovered: number;
  netMonthlySwing: number;
  annualRecovery: number;
  categoryBreakdown: Record<string, number>;
}

export function calculateScoring(answers: Record<number, number | string>): ScoringResult {
  let phase1Leakage = 0;
  const categoryBreakdown: Record<string, number> = {};

  for (const q of questions) {
    if (q.phase === 1 && q.type === "radio") {
      const answerValue = typeof answers[q.id] === "number" ? (answers[q.id] as number) : 0;
      phase1Leakage += answerValue;
      if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = 0;
      categoryBreakdown[q.category] += answerValue;
    }
  }

  const q24 = Number(answers[24]) || 1800;
  const q25 = Number(answers[25]) || 40;
  const q26 = Number(answers[26]) || 4;
  const q28 = Number(answers[28]) || 150;
  const q29 = Number(answers[29]) || 15;

  const q9Answer = answers[9];
  let lifePenetrationCurrent = 0.25;
  const q9Question = questions.find((q) => q.id === 9);
  if (q9Question?.options) {
    const selectedOption = q9Question.options.find((o) => o.value === q9Answer);
    if (selectedOption?.lifePenetration) {
      lifePenetrationCurrent = selectedOption.lifePenetration;
    }
  }

  let revenueMultiplier = 1.1;
  const q30Answer = answers[30];
  const q30Question = questions.find((q) => q.id === 30);
  if (q30Question?.options) {
    const selectedOption = q30Question.options.find((o) => o.text === q30Answer);
    if (selectedOption?.revenueMultiplier) {
      revenueMultiplier = selectedOption.revenueMultiplier;
    }
  }

  const q27 = Number(answers[27]) || 25;

  const scaledLeakage = phase1Leakage * 0.25;
  const scaledBreakdown: Record<string, number> = {};
  for (const key in categoryBreakdown) {
    scaledBreakdown[key] = categoryBreakdown[key] * 0.25;
  }
  const operationalRecovery = scaledLeakage * 0.40;
  const ownerTimeRecovery = q29 * q28 * 4.33 * 0.25;
  const staffEfficiencyRecovery = q26 * q27 * 4.33 * 0.08;
  const costSaved = operationalRecovery + ownerTimeRecovery + staffEfficiencyRecovery;

  const lifePenetrationGap = Math.max(0.5 - lifePenetrationCurrent, 0);
  const lifeRevenue = q25 * lifePenetrationGap * 800 / 12;
  const newBusinessAcceleration = (q25 * 0.10) * (q24 / 12);
  const baseRevenueGained = lifeRevenue + newBusinessAcceleration;
  const revenueGained = baseRevenueGained * revenueMultiplier;

  const hoursRecovered = Math.round(q29 * 0.6 * 10) / 10;

  const netMonthlySwing = costSaved + revenueGained;
  const annualRecovery = netMonthlySwing * 12;

  return {
    phase1Leakage: Math.round(scaledLeakage),
    costSaved: Math.round(costSaved),
    revenueGained: Math.round(revenueGained),
    hoursRecovered,
    netMonthlySwing: Math.round(netMonthlySwing),
    annualRecovery: Math.round(annualRecovery),
    categoryBreakdown: scaledBreakdown,
  };
}

export const testimonials = [
  {
    name: "Beth P.",
    role: "Agency Owner",
    quote: "I needed someone to turn me into a CEO, not just another agent. Jeremy did exactly that.",
    avatar: "BP",
  },
  {
    name: "Anissa V.",
    role: "Agency Owner",
    quote: "He's a game changer — a Swiss Army Knife for everything the industry doesn't teach you.",
    avatar: "AV",
  },
  {
    name: "Shelby F.",
    role: "Agency Owner",
    quote: "I feel more confident this year than I did last year. If there was a trophy to be won, you are absolutely the breadwinner.",
    avatar: "SF",
  },
];

export const interstitialCopy = {
  halfway: {
    title: "You're halfway there.",
    body: "Based on your answers so far, you're leaving more on the table than most agency owners realize.",
    cta: "Finish the assessment to unlock your personalized recovery plan.",
    buttonText: "Keep Going →",
  },
  phaseTransition: {
    body1: "That's what's slipping through the cracks in your agency every month.",
    body2: "Now let's see what your agency could look like with the right coaching, systems, and team training in place.",
    body3: "The next questions calculate your recovery potential — the revenue, time, and freedom you unlock when you stop being the firefighter and start being the CEO.",
    buttonText: "Show Me My Recovery Potential →",
  },
};

export const resultsCopy = {
  heroSubheadline: "That's what's on the other side of the right coaching.",
  cards: {
    leaking: {
      title: "Money You're Losing",
      description: "From gaps in team performance, sales process, and operations",
    },
    recovery: {
      title: "Money You'd Recover",
      description: "With coaching, systems, and team training in place",
    },
    time: {
      title: "Time You'd Get Back",
      description: "Hours redirected from firefighting to CEO-level work",
    },
  },
  pitch: {
    headline: "Here's the thing — these aren't just numbers.",
    body: "Every dollar on this screen represents a real conversation your team isn't having, a client who's going to leave, or an hour you're spending on work that isn't moving the needle.",
    attribution: "I've helped insurance agency owners recover exactly these kinds of losses — not with corporate playbooks, but by coaching you and your entire team on the psychology, systems, and accountability that nobody else teaches.",
    signature: "— Jeremy Kean, CEO Sidekick",
  },
  cta: {
    primary: "Book a Free Strategy Call — Let's Build Your Recovery Plan",
    secondary: "Not ready to talk? Get your full results emailed to you.",
  },
};

export function getCategoryDiagnosis(category: string, score: number, maxPossible: number): string {
  const pct = maxPossible > 0 ? score / maxPossible : 0;

  const diagnoses: Record<string, string[]> = {
    "Team Performance & Accountability": [
      "Your accountability systems are strong — keep it up.",
      "Minor gaps in team tracking are costing you.",
      "Your team has no daily accountability system — they're flying blind.",
      "Critical accountability gap — nobody owns their numbers.",
    ],
    "Sales Process & Presentation": [
      "Your sales process is dialed in.",
      "Inconsistent follow-up is leaving deals on the table.",
      "Your team is leading with price instead of value.",
      "No structured sales process — deals are dying daily.",
    ],
    "Life & Health Production": [
      "Life production is a strength for your agency.",
      "Life pivot training could significantly boost revenue.",
      "Life production is significantly below potential.",
      "Massive revenue opportunity being missed in life and health.",
    ],
    "Team Culture & Psychology": [
      "Your team culture is healthy and productive.",
      "Some cultural friction is dragging down performance.",
      "Team confidence and culture need serious attention.",
      "Toxic culture is your biggest hidden cost.",
    ],
    "Owner Operations & Delegation": [
      "You're operating like a CEO — well delegated.",
      "You're still doing too much of the day-to-day.",
      "You're the bottleneck — delegation is critical.",
      "You ARE the agency — that's unsustainable.",
    ],
    "Client Retention & Growth": [
      "Strong retention and referral systems in place.",
      "Retention gaps are quietly eroding your book of business.",
      "You're losing clients you shouldn't be losing.",
      "No retention or referral systems — you're on a treadmill.",
    ],
    "Sales Discipline & Systems": [
      "Your sales discipline is excellent.",
      "Inconsistent tracking is hiding lost opportunities.",
      "No scoreboard and no objection training — fix this first.",
      "Sales discipline is almost nonexistent.",
    ],
  };

  const categoryDiagnoses = diagnoses[category] || [
    "Performing well.", "Room for improvement.", "Significant gaps.", "Critical issues.",
  ];

  if (pct <= 0.1) return categoryDiagnoses[0];
  if (pct <= 0.4) return categoryDiagnoses[1];
  if (pct <= 0.7) return categoryDiagnoses[2];
  return categoryDiagnoses[3];
}

export function getCategoryMaxScore(category: string): number {
  return questions
    .filter((q) => q.category === category && q.phase === 1 && q.type === "radio")
    .reduce((sum, q) => {
      const maxVal = q.options ? Math.max(...q.options.map((o) => o.value)) : 0;
      return sum + maxVal;
    }, 0);
}
