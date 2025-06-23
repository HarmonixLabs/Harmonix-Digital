import { pgTable, serial, varchar, text, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workflowSuggestions = pgTable("workflow_suggestions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // sales, marketing, operations, hr, finance
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // beginner, intermediate, advanced
  estimatedTimeToImplement: varchar("estimated_time", { length: 50 }), // "2-3 hours", "1 week"
  estimatedTimeSaved: varchar("estimated_time_saved", { length: 50 }), // "10 hours/week"
  roiEstimate: varchar("roi_estimate", { length: 50 }), // "300% in 6 months"
  requiredAgents: jsonb("required_agents").$type<string[]>().notNull(),
  optionalAgents: jsonb("optional_agents").$type<string[]>().default([]),
  integrations: jsonb("integrations").$type<string[]>().default([]),
  workflowSteps: jsonb("workflow_steps").$type<WorkflowStep[]>().notNull(),
  triggerConditions: jsonb("trigger_conditions").$type<TriggerCondition[]>().default([]),
  successMetrics: jsonb("success_metrics").$type<SuccessMetric[]>().default([]),
  implementationGuide: text("implementation_guide"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // 1-5, higher is more priority
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userWorkflowPreferences = pgTable("user_workflow_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  organizationId: integer("organization_id").notNull(),
  industry: varchar("industry", { length: 100 }),
  businessSize: varchar("business_size", { length: 50 }), // startup, small, medium, enterprise
  primaryGoals: jsonb("primary_goals").$type<string[]>().default([]),
  currentChallenges: jsonb("current_challenges").$type<string[]>().default([]),
  techStack: jsonb("tech_stack").$type<string[]>().default([]),
  automationExperience: varchar("automation_experience", { length: 20 }), // none, basic, intermediate, advanced
  preferredComplexity: varchar("preferred_complexity", { length: 20 }), // simple, moderate, complex
  timeAvailableForImplementation: varchar("time_available", { length: 50 }),
  budgetRange: varchar("budget_range", { length: 50 }),
  dismissedSuggestions: jsonb("dismissed_suggestions").$type<number[]>().default([]),
  implementedSuggestions: jsonb("implemented_suggestions").$type<number[]>().default([]),
  favoriteCategories: jsonb("favorite_categories").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type definitions for workflow components
export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  agentResponsible: string;
  estimatedDuration: string;
  dependencies: string[];
  automationLevel: "manual" | "semi-automated" | "fully-automated";
  integrationRequired?: string;
}

export interface TriggerCondition {
  type: "time" | "event" | "data" | "user-action";
  condition: string;
  description: string;
}

export interface SuccessMetric {
  metric: string;
  targetValue: string;
  timeframe: string;
  description: string;
}

// Zod schemas
export const insertWorkflowSuggestionSchema = createInsertSchema(workflowSuggestions);
export const insertUserWorkflowPreferencesSchema = createInsertSchema(userWorkflowPreferences);

export type WorkflowSuggestion = typeof workflowSuggestions.$inferSelect;
export type InsertWorkflowSuggestion = z.infer<typeof insertWorkflowSuggestionSchema>;
export type UserWorkflowPreferences = typeof userWorkflowPreferences.$inferSelect;
export type InsertUserWorkflowPreferences = z.infer<typeof insertUserWorkflowPreferencesSchema>;