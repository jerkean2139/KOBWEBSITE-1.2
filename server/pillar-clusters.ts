export interface PillarCluster {
  pillar: string;
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  topicIds: number[];
  blogTopics: {
    title: string;
    angle: string;
    keywords: string[];
  }[];
}

export const PILLAR_CLUSTERS: PillarCluster[] = [
  {
    pillar: "pain",
    slug: "pain",
    name: "Pain",
    description: "The real problems business owners face: bottlenecks, burnout, broken systems, wasted time",
    keywords: ["bottlenecks", "burnout", "broken systems", "business pain", "founder frustration", "wasted time"],
    topicIds: [3, 7],
    blogTopics: [
      {
        title: "The Pressure Is Architectural, Not Emotional",
        angle: "Why mindset hacks fail without structural change",
        keywords: ["business pressure", "founder burnout", "structural thinking"]
      },
      {
        title: "You're Not Overwhelmed, You're Overloaded",
        angle: "The difference between feeling and architecture",
        keywords: ["overwhelm", "business overload", "founder stress"]
      },
      {
        title: "Why Your Team Keeps Asking You the Same Questions",
        angle: "The hidden cost of being the answer to everything",
        keywords: ["founder bottleneck", "team dependency", "knowledge gaps"]
      },
      {
        title: "The Insurance Agency Bottleneck Nobody Talks About",
        angle: "Why your agency is stuck at the same revenue for 3 years",
        keywords: ["agency growth", "insurance bottleneck", "scaling agency"]
      },
      {
        title: "Why You Feel Busy But Not Productive",
        angle: "The activity trap and how to escape it",
        keywords: ["busy vs productive", "activity trap", "real progress"]
      }
    ]
  },
  {
    pillar: "hope",
    slug: "hope",
    name: "Hope",
    description: "Practical solutions, step-by-step guides, tools, and systems that actually work",
    keywords: ["solutions", "how-to guides", "automation", "delegation", "tools", "systems"],
    topicIds: [1, 5, 9, 10],
    blogTopics: [
      {
        title: "Your First AI Employee",
        angle: "Setting up an AI agent that actually helps vs creates more work",
        keywords: ["AI agent", "AI assistant", "automation setup"]
      },
      {
        title: "The 3-Hour Rule for Delegation",
        angle: "If a task takes 3+ hours weekly, it must be delegated or automated",
        keywords: ["delegation framework", "time audit", "task management"]
      },
      {
        title: "AI Tools I Actually Use Daily",
        angle: "Practical AI stack for service business owners",
        keywords: ["AI tools", "productivity stack", "ChatGPT workflow"]
      },
      {
        title: "Client Retention is a System, Not a Strategy",
        angle: "Building automated touchpoints that feel personal",
        keywords: ["client retention", "insurance CRM", "customer lifecycle"]
      },
      {
        title: "Calendar Blocking for Owners, Not Employees",
        angle: "Why typical time-blocking fails for entrepreneurs",
        keywords: ["calendar blocking", "entrepreneur schedule", "time design"]
      }
    ]
  },
  {
    pillar: "philosophy",
    slug: "philosophy",
    name: "Philosophy",
    description: "The Manumation framework, core principles, and mindset shifts",
    keywords: ["Manumation Method", "philosophy", "principles", "mindset", "framework", "leadership"],
    topicIds: [3],
    blogTopics: [
      {
        title: "The Manumation Method Explained",
        angle: "Why manual first, automation second always wins",
        keywords: ["Manumation", "automation strategy", "process design"]
      },
      {
        title: "The Architect vs The Glue",
        angle: "Two modes of operating your business",
        keywords: ["business architect", "founder role", "business mode"]
      },
      {
        title: "What Coaching Actually Fixes",
        angle: "The gap between advice and implementation",
        keywords: ["business coaching", "implementation", "coaching ROI"]
      },
      {
        title: "When NOT to Automate",
        angle: "The hidden cost of premature automation",
        keywords: ["automation mistakes", "when to automate", "manual processes"]
      },
      {
        title: "Stop Being The Glue",
        angle: "Identifying and removing yourself as the bottleneck",
        keywords: ["founder bottleneck", "business architecture", "scaling"]
      }
    ]
  },
  {
    pillar: "proof",
    slug: "proof",
    name: "Proof",
    description: "Real results, case studies, and data-backed evidence from real businesses",
    keywords: ["case studies", "results", "proof", "transformation", "before and after", "data"],
    topicIds: [10],
    blogTopics: [
      {
        title: "The SOP That Saved My Sanity",
        angle: "How one documented process eliminated daily fires",
        keywords: ["SOP template", "business systems", "delegation checklist"]
      },
      {
        title: "The Time Audit That Changed Everything",
        angle: "How tracking one week exposed my real bottlenecks",
        keywords: ["time audit", "time tracking", "productivity analysis"]
      },
      {
        title: "The Monday Morning Systems Check",
        angle: "Weekly ritual to prevent operational drift",
        keywords: ["weekly review", "systems maintenance", "operations audit"]
      },
      {
        title: "The Quote-to-Close Automation Stack",
        angle: "Reducing quote turnaround from days to hours",
        keywords: ["quote automation", "insurance workflow", "closing ratio"]
      },
      {
        title: "Building Donna: My AI Routing Assistant",
        angle: "How I built an AI that triages my incoming requests",
        keywords: ["AI routing", "email automation", "virtual assistant"]
      }
    ]
  },
  {
    pillar: "vision",
    slug: "vision",
    name: "Vision",
    description: "The mission, the future, and what's possible when you lead instead of manage",
    keywords: ["vision", "mission", "future", "business freedom", "entrepreneurial vision"],
    topicIds: [7],
    blogTopics: [
      {
        title: "From Agency Owner to Agency Architect",
        angle: "The mindset shift that unlocks agency scale",
        keywords: ["agency owner", "insurance business model", "agency leadership"]
      },
      {
        title: "The Myth of Working Harder",
        angle: "Why effort without structure compounds chaos",
        keywords: ["hustle culture", "work smarter", "effort vs systems"]
      },
      {
        title: "Your Email Is Someone Else's To-Do List",
        angle: "Breaking free from reactive work patterns",
        keywords: ["email management", "reactive work", "proactive planning"]
      },
      {
        title: "The 90-Minute Focus Block Method",
        angle: "Deep work structure for scattered business owners",
        keywords: ["focus blocks", "deep work", "attention management"]
      },
      {
        title: "Why CSRs Are Overwhelmed",
        angle: "The missing layer between you and your team",
        keywords: ["CSR productivity", "agency delegation", "team systems"]
      }
    ]
  }
];

export function getPillarBySlug(slug: string): PillarCluster | undefined {
  return PILLAR_CLUSTERS.find(p => p.slug === slug);
}

export function getRandomBlogTopic(pillarSlug: string): PillarCluster["blogTopics"][0] | undefined {
  const pillar = getPillarBySlug(pillarSlug);
  if (!pillar) return undefined;
  const randomIndex = Math.floor(Math.random() * pillar.blogTopics.length);
  return pillar.blogTopics[randomIndex];
}

export function getAllBlogTopics(): Array<PillarCluster["blogTopics"][0] & { pillar: string }> {
  return PILLAR_CLUSTERS.flatMap(p => 
    p.blogTopics.map(topic => ({ ...topic, pillar: p.pillar }))
  );
}
