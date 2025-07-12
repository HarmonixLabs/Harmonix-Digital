import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  company: text("company"),
  avatar: text("avatar"),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  tokenBalance: integer("token_balance").notNull().default(0),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingData: text("onboarding_data"),
  // Stripe integration fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"), // active, canceled, past_due, etc.
  subscriptionTier: text("subscription_tier"), // starter, growth, expansion, enterprise
  paymentStatus: text("payment_status"), // paid, pending, failed
  // Referral system fields
  referralId: text("referral_id").unique(), // Unique referral code for this user
  referredBy: integer("referred_by").references(() => users.id), // Who referred this user
  referralCount: integer("referral_count").default(0).notNull(), // Number of successful referrals
  referralTokensEarned: integer("referral_tokens_earned").default(0).notNull(), // Total tokens earned from referrals
  referralDiscountPercent: integer("referral_discount_percent").default(0).notNull(), // Current MRR discount percentage (max 30%)
  hasUsedReferral: boolean("has_used_referral").default(false).notNull(), // If this user joined via referral
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Organizations table for multi-tenancy
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  planType: text("plan_type").notNull().default("free"), // free, pro, enterprise
  tokenQuota: integer("token_quota").notNull().default(1000),
  tokensUsed: integer("tokens_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Agent templates/types (Digital Team Members)
export const agentTypes = pgTable("agent_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // sales, hr, concierge, executive, sop, booking, content, marketing, finance, legal, analytics, innovation
  icon: text("icon").notNull(),
  basePrompt: text("base_prompt").notNull(),
  capabilities: json("capabilities").$type<string[]>().notNull().default([]),
  tokenCost: integer("token_cost").notNull().default(1),
  isLocked: boolean("is_locked").notNull().default(false),
  tier: text("tier").notNull().default("flagship"), // flagship, next-wave, specialized
  xpMultiplier: decimal("xp_multiplier", { precision: 3, scale: 2 }).notNull().default("1.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lead capture from agent interactions
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  businessName: text("business_name"),
  industry: text("industry"),
  jobTitle: text("job_title"),
  companySize: text("company_size"),
  agentId: text("agent_id").notNull(), // Which agent they interacted with
  interactionData: json("interaction_data").$type<{
    question: string;
    agentResponse: string;
    timestamp: string;
    sessionId?: string;
  }>().notNull(),
  ghlContactId: text("ghl_contact_id"), // GoHighLevel contact ID
  leadStatus: text("lead_status").notNull().default("new"), // new, contacted, qualified, converted
  leadSource: text("lead_source").notNull().default("agent_chat"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Agent NFT skins and marketplace
export const agentSkins = pgTable("agent_skins", {
  id: serial("id").primaryKey(),
  agentTypeId: integer("agent_type_id").references(() => agentTypes.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  skinData: json("skin_data").$type<{
    avatar: string;
    colorScheme: string;
    theme: string;
    animations?: string[];
  }>().notNull(),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  price: integer("price").notNull().default(0), // in Harmony tokens
  isLimited: boolean("is_limited").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User owned agent skins
export const userAgentSkins = pgTable("user_agent_skins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  agentSkinId: integer("agent_skin_id").references(() => agentSkins.id).notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow().notNull(),
});

// Deployed agents per organization (with gamification)
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  agentTypeId: integer("agent_type_id").references(() => agentTypes.id).notNull(),
  name: text("name").notNull(),
  customPrompt: text("custom_prompt"),
  isActive: boolean("is_active").notNull().default(true),
  tokensUsed: integer("tokens_used").notNull().default(0),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks/conversations
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  agentId: integer("agent_id").references(() => agents.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed
  input: json("input").$type<Record<string, any>>(),
  output: json("output").$type<Record<string, any>>(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Token transactions
export const tokenTransactions = pgTable("token_transactions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // purchase, usage, refund
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  taskId: integer("task_id").references(() => tasks.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NFTs/Collectibles
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  agentTypeId: integer("agent_type_id").references(() => agentTypes.id).notNull(),
  tokenId: text("token_id").notNull().unique(),
  metadata: json("metadata").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Platform services and offerings
export const platformServices = pgTable("platform_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // ai-agents, web-design, blockchain, launchpad, advisory
  description: text("description").notNull(),
  features: json("features").$type<string[]>().notNull().default([]),
  pricing: json("pricing").$type<{
    fullPayment: number;
    splitPayment: number;
    monthly?: number;
    setup?: number;
  }>().notNull(),
  benefits: json("benefits").$type<string[]>().notNull().default([]),
  targetAudience: text("target_audience").notNull(),
  deliveryTime: text("delivery_time"),
  requirements: json("requirements").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Platform capabilities and features
export const platformFeatures = pgTable("platform_features", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // agent-marketplace, workflow-automation, nft-integration, payment-processing, etc.
  description: text("description").notNull(),
  howItHelps: text("how_it_helps").notNull(),
  examples: json("examples").$type<string[]>().notNull().default([]),
  integrations: json("integrations").$type<string[]>().notNull().default([]),
  isCore: boolean("is_core").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ROI and success metrics
export const successMetrics = pgTable("success_metrics", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => platformServices.id),
  metricName: text("metric_name").notNull(),
  value: text("value").notNull(),
  description: text("description").notNull(),
  industry: text("industry"),
  timePeriod: text("time_period"), // monthly, quarterly, annually
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Referral tracking table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredUserId: integer("referred_user_id").references(() => users.id),
  referralCode: text("referral_code").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, completed, expired
  tokensAwarded: integer("tokens_awarded").default(0),
  discountApplied: integer("discount_applied").default(0), // Percentage
  referredEmail: text("referred_email"),
  referredCompany: text("referred_company"),
  referredIndustry: text("referred_industry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  agents: many(agents),
  tasks: many(tasks),
  tokenTransactions: many(tokenTransactions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  tasks: many(tasks),
  nfts: many(nfts),
  tokenTransactions: many(tokenTransactions),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralReceived: one(referrals, {
    fields: [users.referredBy],
    references: [referrals.referrerId],
    relationName: "referred"
  }),
}));

export const agentTypesRelations = relations(agentTypes, ({ many }) => ({
  agents: many(agents),
  nfts: many(nfts),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [agents.organizationId],
    references: [organizations.id],
  }),
  agentType: one(agentTypes, {
    fields: [agents.agentTypeId],
    references: [agentTypes.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  agent: one(agents, {
    fields: [tasks.agentId],
    references: [agents.id],
  }),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  tokenTransactions: many(tokenTransactions),
}));

export const tokenTransactionsRelations = relations(tokenTransactions, ({ one }) => ({
  organization: one(organizations, {
    fields: [tokenTransactions.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [tokenTransactions.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [tokenTransactions.taskId],
    references: [tasks.id],
  }),
}));

export const nftsRelations = relations(nfts, ({ one }) => ({
  user: one(users, {
    fields: [nfts.userId],
    references: [users.id],
  }),
  agentType: one(agentTypes, {
    fields: [nfts.agentTypeId],
    references: [agentTypes.id],
  }),
}));

// Referrals relations
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer"
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id],
    relationName: "referred"
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformServiceSchema = createInsertSchema(platformServices).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformFeatureSchema = createInsertSchema(platformFeatures).omit({
  id: true,
  createdAt: true,
});

export const insertSuccessMetricSchema = createInsertSchema(successMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type AgentType = typeof agentTypes.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type NFT = typeof nfts.$inferSelect;
export type InsertNft = z.infer<typeof insertNftSchema>;
export type PlatformService = typeof platformServices.$inferSelect;
export type InsertPlatformService = z.infer<typeof insertPlatformServiceSchema>;
export type PlatformFeature = typeof platformFeatures.$inferSelect;
export type InsertPlatformFeature = z.infer<typeof insertPlatformFeatureSchema>;
export type SuccessMetric = typeof successMetrics.$inferSelect;
export type InsertSuccessMetric = z.infer<typeof insertSuccessMetricSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
