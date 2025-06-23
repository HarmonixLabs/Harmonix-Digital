import { 
  users, organizations, agents, agentTypes, tasks, tokenTransactions, nfts,
  type User, type InsertUser, type Organization, type InsertOrganization,
  type Agent, type InsertAgent, type AgentType, type Task, type InsertTask,
  type TokenTransaction, type InsertTokenTransaction, type NFT, type InsertNft
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sum, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Organizations
  getOrganization(id: number): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization>;

  // Agent Types
  getAgentTypes(): Promise<AgentType[]>;
  getAgentType(id: number): Promise<AgentType | undefined>;

  // Agents
  getAgentsByOrganization(organizationId: number): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, updates: Partial<InsertAgent>): Promise<Agent>;
  deleteAgent(id: number): Promise<void>;

  // Tasks
  getTasksByOrganization(organizationId: number, limit?: number): Promise<Task[]>;
  getTasksByAgent(agentId: number, limit?: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task>;

  // Token Transactions
  getTokenTransactionsByOrganization(organizationId: number, limit?: number): Promise<TokenTransaction[]>;
  createTokenTransaction(transaction: InsertTokenTransaction): Promise<TokenTransaction>;

  // NFTs
  getNftsByUser(userId: number): Promise<NFT[]>;
  createNft(nft: InsertNft): Promise<NFT>;

  // Analytics
  getOrganizationStats(organizationId: number): Promise<{
    totalAgents: number;
    totalTasks: number;
    tokensUsed: number;
    tokensRemaining: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org || undefined;
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(insertOrg).returning();
    return org;
  }

  async updateOrganization(id: number, updates: Partial<InsertOrganization>): Promise<Organization> {
    const [org] = await db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  async getAgentTypes(): Promise<AgentType[]> {
    return await db.select().from(agentTypes).orderBy(agentTypes.category, agentTypes.name);
  }

  async getAgentType(id: number): Promise<AgentType | undefined> {
    const [agentType] = await db.select().from(agentTypes).where(eq(agentTypes.id, id));
    return agentType || undefined;
  }

  async getAgentsByOrganization(organizationId: number): Promise<Agent[]> {
    return await db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, organizationId))
      .orderBy(desc(agents.createdAt));
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: number, updates: Partial<InsertAgent>): Promise<Agent> {
    const [agent] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return agent;
  }

  async deleteAgent(id: number): Promise<void> {
    await db.delete(agents).where(eq(agents.id, id));
  }

  async getTasksByOrganization(organizationId: number, limit = 50): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.organizationId, organizationId))
      .orderBy(desc(tasks.createdAt))
      .limit(limit);
  }

  async getTasksByAgent(agentId: number, limit = 50): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.agentId, agentId))
      .orderBy(desc(tasks.createdAt))
      .limit(limit);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async getTokenTransactionsByOrganization(organizationId: number, limit = 50): Promise<TokenTransaction[]> {
    return await db
      .select()
      .from(tokenTransactions)
      .where(eq(tokenTransactions.organizationId, organizationId))
      .orderBy(desc(tokenTransactions.createdAt))
      .limit(limit);
  }

  async createTokenTransaction(insertTransaction: InsertTokenTransaction): Promise<TokenTransaction> {
    const [transaction] = await db.insert(tokenTransactions).values(insertTransaction).returning();
    return transaction;
  }

  async getNftsByUser(userId: number): Promise<NFT[]> {
    return await db
      .select()
      .from(nfts)
      .where(eq(nfts.userId, userId))
      .orderBy(desc(nfts.createdAt));
  }

  async createNft(insertNft: InsertNft): Promise<NFT> {
    const [nft] = await db.insert(nfts).values(insertNft).returning();
    return nft;
  }

  async getOrganizationStats(organizationId: number): Promise<{
    totalAgents: number;
    totalTasks: number;
    tokensUsed: number;
    tokensRemaining: number;
  }> {
    const org = await this.getOrganization(organizationId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const [agentCount] = await db
      .select({ count: count() })
      .from(agents)
      .where(and(eq(agents.organizationId, organizationId), eq(agents.isActive, true)));

    const [taskCount] = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.organizationId, organizationId));

    return {
      totalAgents: agentCount?.count || 0,
      totalTasks: taskCount?.count || 0,
      tokensUsed: org.tokensUsed,
      tokensRemaining: org.tokenQuota - org.tokensUsed,
    };
  }
}

export const storage = new DatabaseStorage();
