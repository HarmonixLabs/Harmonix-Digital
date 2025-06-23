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
  avatar: text("avatar"),
  organizationId: integer("organization_id").references(() => organizations.id),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  tokenBalance: integer("token_balance").notNull().default(0),
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
