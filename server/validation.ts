import { z } from "zod";

export const newsletterCreateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
});

export const newsletterUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  tldr: z.string().max(5000).optional(),
  topTenItems: z.array(z.string()).max(20).optional(),
  htmlContent: z.string().max(500000).optional(),
  status: z.enum(["draft", "ready", "sent"]).optional(),
});

export const blogPostCreateSchema = z.object({
  title: z.string().min(1).max(500),
});

export const blogPostUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(200).optional(),
  content: z.string().max(500000).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string().max(100)).max(20).optional(),
  category: z.string().max(100).optional().nullable(),
});

export const workshopSessionUpdateSchema = z.object({
  currentStep: z.enum(["brain_dump", "sorting", "review", "summary"]).optional(),
  brainDumpItems: z.array(z.object({
    id: z.string(),
    text: z.string().max(1000),
    createdAt: z.string().optional(),
  })).max(100).optional(),
  onlyICanDoItems: z.array(z.object({
    id: z.string(),
    text: z.string().max(1000),
    createdAt: z.string().optional(),
  })).max(100).optional(),
  delegateSoonItems: z.array(z.object({
    id: z.string(),
    text: z.string().max(1000),
    createdAt: z.string().optional(),
  })).max(100).optional(),
  delegateNowItems: z.array(z.object({
    id: z.string(),
    text: z.string().max(1000),
    createdAt: z.string().optional(),
    priority: z.boolean().optional(),
    operations: z.boolean().optional(),
  })).max(100).optional(),
  priorityTasks: z.array(z.object({
    id: z.string(),
    text: z.string().max(1000),
    createdAt: z.string().optional(),
  })).max(10).optional(),
  status: z.enum(["in_progress", "completed"]).optional(),
  title: z.string().max(200).optional(),
});

export const workshopDonnaMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  currentStep: z.enum(["brain_dump", "sorting", "review", "summary"]).optional(),
});

export const emailSendSchema = z.object({
  to: z.string().email().max(254),
  newsletterId: z.number().int().positive(),
});

export const contentTopicSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  category: z.string().max(100).optional().nullable(),
  keywords: z.array(z.string().max(100)).max(20).optional(),
  priority: z.number().int().min(1).max(10).optional(),
  isActive: z.boolean().optional(),
});

export const youtubeChannelSchema = z.object({
  channelId: z.string().min(1).max(100),
  channelName: z.string().min(1).max(200),
  channelUrl: z.string().url().max(500),
  category: z.string().max(100).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const portfolioProjectCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().max(5000).optional().nullable(),
  replitUrl: z.string().url().max(500).optional().nullable(),
  githubUrl: z.string().url().max(500).optional().nullable(),
  liveUrl: z.string().url().max(500).optional().nullable(),
  category: z.enum(["website", "tool", "automation", "platform"]).optional(),
  techStack: z.array(z.string().max(100)).max(20).optional(),
  status: z.enum(["in_progress", "completed", "on_deck"]).optional(),
  featuredImage: z.string().max(500).optional().nullable(),
  clientName: z.string().max(200).optional().nullable(),
  clientIndustry: z.string().max(200).optional().nullable(),
  heroVideoUrl: z.string().url().max(500).optional().nullable(),
  caseStudy: z.object({
    tagline: z.string().max(500).optional(),
    problemStatement: z.string().max(5000).optional(),
    solutionOverview: z.string().max(5000).optional(),
    keyFeatures: z.array(z.string().max(500)).max(20).optional(),
    buildApproach: z.string().max(5000).optional(),
    challengesFaced: z.array(z.string().max(500)).max(20).optional(),
    lessonsLearned: z.array(z.string().max(500)).max(20).optional(),
    resultsAchieved: z.array(z.string().max(500)).max(20).optional(),
    clientTestimonial: z.string().max(2000).optional(),
    nextSteps: z.array(z.string().max(500)).max(10).optional(),
  }).optional().nullable(),
  milestones: z.array(z.object({
    id: z.string().max(50),
    title: z.string().max(200),
    description: z.string().max(1000),
    date: z.string(),
    mediaUrl: z.string().max(500).optional(),
    mediaType: z.enum(["image", "video"]).optional(),
    agentNotes: z.string().max(1000).optional(),
  })).max(50).optional(),
  mediaGallery: z.array(z.object({
    id: z.string().max(50),
    url: z.string().max(500),
    type: z.enum(["image", "video"]),
    caption: z.string().max(500),
    phase: z.string().max(100).optional(),
    timestamp: z.string().optional(),
  })).max(100).optional(),
});

export const portfolioProjectUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes").optional(),
  description: z.string().max(5000).optional().nullable(),
  replitUrl: z.string().url().max(500).optional().nullable(),
  githubUrl: z.string().url().max(500).optional().nullable(),
  liveUrl: z.string().url().max(500).optional().nullable(),
  category: z.enum(["website", "tool", "automation", "platform"]).optional(),
  techStack: z.array(z.string().max(100)).max(20).optional(),
  status: z.enum(["in_progress", "completed", "on_deck"]).optional(),
  featuredImage: z.string().max(500).optional().nullable(),
  clientName: z.string().max(200).optional().nullable(),
  clientIndustry: z.string().max(200).optional().nullable(),
  caseStudy: z.object({
    tagline: z.string().max(500).optional(),
    problemStatement: z.string().max(5000).optional(),
    solutionOverview: z.string().max(5000).optional(),
    keyFeatures: z.array(z.string().max(500)).max(20).optional(),
    buildApproach: z.string().max(5000).optional(),
    challengesFaced: z.array(z.string().max(500)).max(20).optional(),
    lessonsLearned: z.array(z.string().max(500)).max(20).optional(),
    resultsAchieved: z.array(z.string().max(500)).max(20).optional(),
    clientTestimonial: z.string().max(2000).optional(),
    nextSteps: z.array(z.string().max(500)).max(10).optional(),
  }).optional().nullable(),
  milestones: z.array(z.object({
    id: z.string().max(50),
    title: z.string().max(200),
    description: z.string().max(1000),
    date: z.string(),
    mediaUrl: z.string().max(500).optional(),
    mediaType: z.enum(["image", "video"]).optional(),
    agentNotes: z.string().max(1000).optional(),
  })).max(50).optional(),
  mediaGallery: z.array(z.object({
    id: z.string().max(50),
    url: z.string().max(500),
    type: z.enum(["image", "video"]),
    caption: z.string().max(500),
    phase: z.string().max(100).optional(),
    timestamp: z.string().optional(),
  })).max(100).optional(),
  heroVideoUrl: z.string().url().max(500).optional().nullable(),
});

export const portfolioImportSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().max(5000).optional().nullable(),
  replitUrl: z.string().url().max(500).optional().nullable(),
  githubUrl: z.string().url().max(500).optional().nullable(),
  liveUrl: z.string().url().max(500).optional().nullable(),
  category: z.enum(["website", "tool", "automation", "platform"]).optional(),
  techStack: z.array(z.string().max(100)).max(20).optional(),
  status: z.enum(["in_progress", "completed", "on_deck"]).optional(),
  featuredImage: z.string().max(500).optional().nullable(),
  clientName: z.string().max(200).optional().nullable(),
  clientIndustry: z.string().max(200).optional().nullable(),
  buildStartDate: z.string().optional().nullable(),
  buildEndDate: z.string().optional().nullable(),
  heroVideoUrl: z.string().url().max(500).optional().nullable(),
  caseStudy: z.object({
    tagline: z.string().max(500).optional(),
    problemStatement: z.string().max(5000).optional(),
    solutionOverview: z.string().max(5000).optional(),
    keyFeatures: z.array(z.string().max(500)).max(20).optional(),
    buildApproach: z.string().max(5000).optional(),
    challengesFaced: z.array(z.string().max(500)).max(20).optional(),
    lessonsLearned: z.array(z.string().max(500)).max(20).optional(),
    resultsAchieved: z.array(z.string().max(500)).max(20).optional(),
    clientTestimonial: z.string().max(2000).optional(),
    nextSteps: z.array(z.string().max(500)).max(10).optional(),
  }).optional().nullable(),
  milestones: z.array(z.object({
    id: z.string().max(50),
    title: z.string().max(200),
    description: z.string().max(1000),
    date: z.string(),
    mediaUrl: z.string().max(500).optional(),
    mediaType: z.enum(["image", "video"]).optional(),
    agentNotes: z.string().max(1000).optional(),
  })).max(50).optional(),
  mediaGallery: z.array(z.object({
    id: z.string().max(50),
    url: z.string().max(500),
    type: z.enum(["image", "video"]),
    caption: z.string().max(500),
    phase: z.string().max(100).optional(),
    timestamp: z.string().optional(),
  })).max(100).optional(),
});

export const snapshotCreateSchema = z.object({
  screenshotUrl: z.string().url().max(500).optional().nullable(),
  commitHash: z.string().max(50).optional().nullable(),
  commitMessage: z.string().max(500).optional().nullable(),
  aiSummary: z.string().max(2000).optional().nullable(),
  changeHighlights: z.array(z.string().max(500)).max(20).optional(),
});

export const newsletterSourceSchema = z.object({
  url: z.string().url().max(1000).optional().nullable(),
  title: z.string().max(500).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
});

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join(", ");
  return { success: false, error: `Validation failed: ${errors}` };
}
