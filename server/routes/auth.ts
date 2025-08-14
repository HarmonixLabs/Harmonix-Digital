import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../storage";
import { setupAuth, isAuthenticated } from "../replitAuth";

export async function registerAuthRoutes(app: Express): Promise<void> {
  // Setup Replit Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get organization data
      const organization = user.organizationId ? 
        await storage.getOrganization(user.organizationId) : null;

      res.json({
        user: {
          ...user,
          name: user.firstName && user.lastName ? 
            `${user.firstName} ${user.lastName}` : user.email
        },
        organization
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard data endpoint
  app.get('/api/dashboard/data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.organizationId) {
        return res.status(404).json({ message: "User or organization not found" });
      }

      const [
        organization,
        agents,
        tasks,
        stats
      ] = await Promise.all([
        storage.getOrganization(user.organizationId),
        storage.getAgentsByOrganization(user.organizationId),
        storage.getTasksByOrganization(user.organizationId, 10),
        storage.getOrganizationStats(user.organizationId)
      ]);

      res.json({
        user: {
          ...user,
          name: user.firstName && user.lastName ? 
            `${user.firstName} ${user.lastName}` : user.email
        },
        organization,
        agents,
        recentTasks: tasks,
        stats: {
          ...stats,
          tokenUsagePercentage: organization ? 
            Math.round((organization.tokensUsed / organization.tokenQuota) * 100) : 0
        }
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Organization management for Founders
  app.patch('/api/organization', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.organizationId || user.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized - Admin access required" });
      }

      const updates = req.body;
      const updatedOrganization = await storage.updateOrganization(user.organizationId, updates);

      res.json({ organization: updatedOrganization });
    } catch (error) {
      console.error("Organization update error:", error);
      res.status(500).json({ message: "Failed to update organization" });
    }
  });

  // Agent management endpoints
  app.get('/api/agents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.organizationId) {
        return res.status(404).json({ message: "User or organization not found" });
      }

      const agents = await storage.getAgentsByOrganization(user.organizationId);
      res.json({ agents });
    } catch (error) {
      console.error("Agents fetch error:", error);
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  // Token management
  app.get('/api/tokens/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.organizationId) {
        return res.status(404).json({ message: "User or organization not found" });
      }

      const organization = await storage.getOrganization(user.organizationId);
      
      res.json({
        userBalance: user.tokenBalance,
        organizationQuota: organization?.tokenQuota || 0,
        organizationUsed: organization?.tokensUsed || 0,
        usagePercentage: organization ? 
          Math.round((organization.tokensUsed / organization.tokenQuota) * 100) : 0
      });
    } catch (error) {
      console.error("Token balance error:", error);
      res.status(500).json({ message: "Failed to fetch token balance" });
    }
  });
}