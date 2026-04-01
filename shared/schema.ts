import { pgTable, text, serial, timestamp, json, integer, boolean, varchar, index, jsonb } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ============================================
// AUTH TABLES (Replit Auth)
// ============================================

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ============================================
// WATERFALL WORKSHOP TABLES
// ============================================

export const workshopSessions = pgTable("workshop_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed
  brainDumpItems: json("brain_dump_items").$type<Array<{
    id: string;
    text: string;
    createdAt: string;
  }>>(),
  onlyICanDoItems: json("only_i_can_do_items").$type<Array<{
    id: string;
    text: string;
    sortedAt: string;
  }>>(),
  delegateSoonItems: json("delegate_soon_items").$type<Array<{
    id: string;
    text: string;
    sortedAt: string;
  }>>(),
  delegateNowItems: json("delegate_now_items").$type<Array<{
    id: string;
    text: string;
    sortedAt: string;
    isPriority: boolean;
    operationsFlag: boolean;
  }>>(),
  priorityTasks: json("priority_tasks").$type<string[]>(), // IDs of top 1-3 delegate NOW items
  donnaConversation: json("donna_conversation").$type<Array<{
    role: "donna" | "user";
    message: string;
    timestamp: string;
  }>>(),
  currentStep: text("current_step").default("brain_dump"), // brain_dump, sorting, review, summary
  privacyConsentAt: timestamp("privacy_consent_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type WorkshopSession = typeof workshopSessions.$inferSelect;
export type InsertWorkshopSession = typeof workshopSessions.$inferInsert;

// ============================================
// NEWSLETTER TABLES (existing)
// ============================================

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("draft"),
  tldr: text("tldr"),
  topTenItems: json("top_ten_items").$type<string[]>(),
  htmlContent: text("html_content"),
  headerImage: text("header_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export const researchSources = pgTable("research_sources", {
  id: serial("id").primaryKey(),
  newsletterId: serial("newsletter_id").references(() => newsletters.id),
  url: text("url"),
  title: text("title"),
  content: text("content"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterRelations = relations(newsletters, ({ many }) => ({
  sources: many(researchSources),
}));

export const researchSourceRelations = relations(researchSources, ({ one }) => ({
  newsletter: one(newsletters, {
    fields: [researchSources.newsletterId],
    references: [newsletters.id],
  }),
}));

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;
export type ResearchSource = typeof researchSources.$inferSelect;
export type InsertResearchSource = typeof researchSources.$inferInsert;

// ============================================
// CONTENT STUDIO TABLES (new)
// ============================================

export const youtubeChannels = pgTable("youtube_channels", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull().unique(),
  channelName: text("channel_name").notNull(),
  channelUrl: text("channel_url").notNull(),
  category: text("category"),
  isActive: boolean("is_active").default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const youtubeVideos = pgTable("youtube_videos", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").references(() => youtubeChannels.id),
  videoId: text("video_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at"),
  duration: text("duration"),
  viewCount: integer("view_count"),
  relevanceScore: integer("relevance_score"),
  topics: json("topics").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentTopics = pgTable("content_topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category"),
  priority: integer("priority").default(0),
  keywords: json("keywords").$type<string[]>(),
  geoFocus: text("geo_focus"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  headline: text("headline"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  excerpt: text("excerpt"),
  content: text("content"),
  htmlContent: text("html_content"),
  featuredImage: text("featured_image"),
  featuredImageAlt: text("featured_image_alt"),
  structuredData: json("structured_data").$type<Record<string, any>>(),
  faqs: json("faqs").$type<Array<{question: string, answer: string}>>(),
  tags: json("tags").$type<string[]>(),
  category: text("category"),
  geoFocus: text("geo_focus"),
  internalLinks: json("internal_links").$type<string[]>(),
  externalLinks: json("external_links").$type<string[]>(),
  youtubeVideoIds: json("youtube_video_ids").$type<string[]>(),
  status: text("status").notNull().default("draft"),
  topicId: integer("topic_id").references(() => contentTopics.id),
  reusedNewsletterId: integer("reused_newsletter_id").references(() => newsletters.id),
  aiPromptUsed: text("ai_prompt_used"),
  seoScore: integer("seo_score"),
  readabilityScore: integer("readability_score"),
  wordCount: integer("word_count"),
  aiReview: json("ai_review").$type<{
    overallScore: number;
    copyScore: number;
    seoScore: number;
    imageScore: number;
    suggestions: Array<{
      category: string;
      priority: "high" | "medium" | "low";
      issue: string;
      suggestion: string;
    }>;
    improvedTitle?: string;
    improvedMetaDescription?: string;
    improvedImagePrompt?: string;
  }>(),
  imageProvider: text("image_provider"),
  authorName: text("author_name"),
  authorTitle: text("author_title"),
  authorImage: text("author_image"),
  authorBio: text("author_bio"),
  pillar: text("pillar"),
  postLength: text("post_length"),
  postStyle: text("post_style"),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogMedia = pgTable("blog_media", {
  id: serial("id").primaryKey(),
  blogPostId: integer("blog_post_id").references(() => blogPosts.id),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  source: text("source"),
  license: text("license"),
  isGenerated: boolean("is_generated").default(false),
  generationPrompt: text("generation_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// PODCAST TABLES
// ============================================

export const podcastEpisodes = pgTable("podcast_episodes", {
  id: serial("id").primaryKey(),
  episodeNumber: integer("episode_number"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  script: text("script"),
  audioUrl: text("audio_url"),
  audioDuration: integer("audio_duration"), // in seconds
  audioFileSize: integer("audio_file_size"), // in bytes for RSS
  thumbnailUrl: text("thumbnail_url"),
  transcript: text("transcript"),
  topics: json("topics").$type<string[]>(),
  targetIndustryId: integer("target_industry_id"),
  targetLength: integer("target_length"), // target minutes (5, 7, 10)
  sourceBlogPostId: integer("source_blog_post_id"),
  guestName: text("guest_name"),
  guestTitle: text("guest_title"),
  guestImage: text("guest_image"),
  riversideRecordingId: text("riverside_recording_id"),
  status: text("status").notNull().default("draft"), // draft, approved, published
  publishedAt: timestamp("published_at"),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentJobs = pgTable("content_jobs", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  targetDate: timestamp("target_date"),
  topicId: integer("topic_id").references(() => contentTopics.id),
  blogPostId: integer("blog_post_id").references(() => blogPosts.id),
  newsletterId: integer("newsletter_id").references(() => newsletters.id),
  config: json("config").$type<Record<string, any>>(),
  result: json("result").$type<Record<string, any>>(),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const youtubeChannelRelations = relations(youtubeChannels, ({ many }) => ({
  videos: many(youtubeVideos),
}));

export const youtubeVideoRelations = relations(youtubeVideos, ({ one }) => ({
  channel: one(youtubeChannels, {
    fields: [youtubeVideos.channelId],
    references: [youtubeChannels.id],
  }),
}));

export const blogPostRelations = relations(blogPosts, ({ one, many }) => ({
  topic: one(contentTopics, {
    fields: [blogPosts.topicId],
    references: [contentTopics.id],
  }),
  reusedNewsletter: one(newsletters, {
    fields: [blogPosts.reusedNewsletterId],
    references: [newsletters.id],
  }),
  media: many(blogMedia),
}));

export const blogMediaRelations = relations(blogMedia, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [blogMedia.blogPostId],
    references: [blogPosts.id],
  }),
}));

export const contentJobRelations = relations(contentJobs, ({ one }) => ({
  topic: one(contentTopics, {
    fields: [contentJobs.topicId],
    references: [contentTopics.id],
  }),
  blogPost: one(blogPosts, {
    fields: [contentJobs.blogPostId],
    references: [blogPosts.id],
  }),
  newsletter: one(newsletters, {
    fields: [contentJobs.newsletterId],
    references: [newsletters.id],
  }),
}));

// ============================================
// PORTFOLIO TABLES
// ============================================

export interface CaseStudyMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  agentNotes?: string;
}

export interface CaseStudyMedia {
  id: string;
  url: string;
  type: "image" | "video";
  caption: string;
  phase?: string;
  timestamp?: string;
}

export interface CaseStudyContent {
  tagline?: string;
  problemStatement?: string;
  solutionOverview?: string;
  keyFeatures?: string[];
  buildApproach?: string;
  challengesFaced?: string[];
  lessonsLearned?: string[];
  resultsAchieved?: string[];
  clientTestimonial?: string;
  nextSteps?: string[];
}

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  replitUrl: text("replit_url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, on_deck
  category: text("category").default("website"), // website, tool, automation, platform
  featuredImage: text("featured_image"),
  techStack: json("tech_stack").$type<string[]>(),
  snapshotCount: integer("snapshot_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  clientName: text("client_name"),
  clientIndustry: text("client_industry"),
  buildStartDate: timestamp("build_start_date"),
  buildEndDate: timestamp("build_end_date"),
  caseStudy: json("case_study").$type<CaseStudyContent>(),
  milestones: json("milestones").$type<CaseStudyMilestone[]>(),
  mediaGallery: json("media_gallery").$type<CaseStudyMedia[]>(),
  heroVideoUrl: text("hero_video_url"),
});

export const projectSnapshots = pgTable("project_snapshots", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => portfolioProjects.id).notNull(),
  screenshotUrl: text("screenshot_url"),
  commitHash: text("commit_hash"),
  commitMessage: text("commit_message"),
  aiSummary: text("ai_summary"),
  changeHighlights: json("change_highlights").$type<string[]>(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioProjectRelations = relations(portfolioProjects, ({ many }) => ({
  snapshots: many(projectSnapshots),
}));

export const projectSnapshotRelations = relations(projectSnapshots, ({ one }) => ({
  project: one(portfolioProjects, {
    fields: [projectSnapshots.projectId],
    references: [portfolioProjects.id],
  }),
}));

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;
export type ProjectSnapshot = typeof projectSnapshots.$inferSelect;
export type InsertProjectSnapshot = typeof projectSnapshots.$inferInsert;

// ============================================
// INDUSTRY PAIN POINTS TABLES
// ============================================

export const industryProfiles = pgTable("industry_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  targetPersona: text("target_persona"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const painPoints = pgTable("pain_points", {
  id: serial("id").primaryKey(),
  industryId: integer("industry_id").references(() => industryProfiles.id).notNull(),
  category: text("category").notNull().default("operations"),
  title: text("title").notNull(),
  description: text("description"),
  severity: integer("severity").notNull().default(5),
  source: text("source").notNull().default("manual"),
  sourceUrl: text("source_url"),
  keywords: json("keywords").$type<string[]>(),
  manumationAngle: text("manumation_angle"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const researchRuns = pgTable("research_runs", {
  id: serial("id").primaryKey(),
  runDate: timestamp("run_date").defaultNow().notNull(),
  industriesSearched: json("industries_searched").$type<string[]>(),
  totalFindings: integer("total_findings").default(0),
  newPainPointsAdded: integer("new_pain_points_added").default(0),
  status: text("status").notNull().default("running"),
  log: json("log").$type<Array<{ timestamp: string; message: string; level: string }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const industryProfileRelations = relations(industryProfiles, ({ many }) => ({
  painPoints: many(painPoints),
}));

export const painPointRelations = relations(painPoints, ({ one }) => ({
  industry: one(industryProfiles, {
    fields: [painPoints.industryId],
    references: [industryProfiles.id],
  }),
}));

export type IndustryProfile = typeof industryProfiles.$inferSelect;
export type InsertIndustryProfile = typeof industryProfiles.$inferInsert;
export type PainPoint = typeof painPoints.$inferSelect;
export type InsertPainPoint = typeof painPoints.$inferInsert;
export type ResearchRun = typeof researchRuns.$inferSelect;
export type InsertResearchRun = typeof researchRuns.$inferInsert;

// ============================================
// API SESSION TOKENS (for SSE connections)
// ============================================

export const apiSessionTokens = pgTable("api_session_tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  adminKeyHash: varchar("admin_key_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  usedAt: timestamp("used_at"),
});

export type ApiSessionToken = typeof apiSessionTokens.$inferSelect;
export type InsertApiSessionToken = typeof apiSessionTokens.$inferInsert;

// ============================================
// TYPE EXPORTS
// ============================================

export type YoutubeChannel = typeof youtubeChannels.$inferSelect;
export type InsertYoutubeChannel = typeof youtubeChannels.$inferInsert;
export type YoutubeVideo = typeof youtubeVideos.$inferSelect;
export type InsertYoutubeVideo = typeof youtubeVideos.$inferInsert;
export type ContentTopic = typeof contentTopics.$inferSelect;
export type InsertContentTopic = typeof contentTopics.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type BlogMedia = typeof blogMedia.$inferSelect;
export type InsertBlogMedia = typeof blogMedia.$inferInsert;
export type ContentJob = typeof contentJobs.$inferSelect;
export type InsertContentJob = typeof contentJobs.$inferInsert;
export type PodcastEpisode = typeof podcastEpisodes.$inferSelect;
export type InsertPodcastEpisode = typeof podcastEpisodes.$inferInsert;
