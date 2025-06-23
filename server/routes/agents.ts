import express from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../auth";

const router = express.Router();

// Deploy agent endpoint for enhanced marketplace
router.post("/deploy", isAuthenticated, async (req: any, res) => {
  try {
    const { agentId, name, monthlyPrice, setupType } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!agentId || !name || !monthlyPrice) {
      return res.status(400).json({ 
        message: "Missing required fields: agentId, name, monthlyPrice" 
      });
    }

    // Check if user already has this agent deployed
    const existingAgents = await storage.getUserAgents(userId);
    const alreadyDeployed = existingAgents.some(agent => 
      agent.name === name || agent.agentTypeId === agentId
    );

    if (alreadyDeployed) {
      return res.status(409).json({ 
        message: "Agent already deployed for this user" 
      });
    }

    // Create deployment record
    const deployment = await storage.createAgentDeployment({
      userId,
      agentId,
      name,
      monthlyPrice,
      setupType: setupType || "Base",
      status: "pending_payment",
      deployedAt: new Date(),
    });

    res.json({
      success: true,
      deployment,
      message: "Agent deployment initiated",
      checkoutUrl: `/checkout?agent=${agentId}&deployment=${deployment.id}`
    });

  } catch (error) {
    console.error("Agent deployment error:", error);
    res.status(500).json({ 
      message: "Failed to deploy agent",
      error: error.message 
    });
  }
});

// Get agent marketplace data
router.get("/marketplace", async (req, res) => {
  try {
    // Return enhanced agent data with creator economy features
    const marketplaceAgents = [
      {
        id: 1,
        name: "CA$H",
        role: "Sales Strategist", 
        category: "Sales",
        avatar: "💰",
        monthlyPrice: 750,
        timeSaved: "26+ hrs/week",
        integrations: ["GHL", "Slack", "Zapier", "HubSpot"],
        rating: 4.9,
        reviews: 147,
        tokenUsage: "Medium",
        status: "Available",
        creator: "0x742d35Cc6672C0532925a3b8D2A291E48e5C67F8",
        creatorName: "Harmonix Core",
        nftEnabled: true,
        royaltySplit: { creator: 70, platform: 20, nft: 10 },
        description: "Elite sales automation agent trained on 10,000+ successful funnels",
        useCases: ["Lead qualification", "Follow-up sequences", "CRM automation"],
        setupType: "Custom"
      },
      {
        id: 2,
        name: "Virgil",
        role: "Brand Strategist",
        category: "Content", 
        avatar: "🎨",
        monthlyPrice: 650,
        timeSaved: "22+ hrs/week",
        integrations: ["Notion", "Figma", "Slack", "Canva"],
        rating: 4.8,
        reviews: 89,
        tokenUsage: "High",
        status: "Available",
        creator: "0x8ba1f109551bD432803012645Hac136c1A346A47",
        creatorName: "Design Guild",
        nftEnabled: true,
        royaltySplit: { creator: 75, platform: 15, nft: 10 },
        description: "Master brand architect with deep aesthetic intelligence",
        useCases: ["Brand identity", "Content strategy", "Visual consistency"],
        setupType: "Base"
      },
      {
        id: 3,
        name: "Maya",
        role: "HR Coordinator",
        category: "Operations",
        avatar: "👥",
        monthlyPrice: 550,
        timeSaved: "18+ hrs/week", 
        integrations: ["BambooHR", "Slack", "Calendly", "Zoom"],
        rating: 4.7,
        reviews: 63,
        tokenUsage: "Low",
        status: "Available",
        creator: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
        creatorName: "People Ops Pro",
        nftEnabled: false,
        royaltySplit: { creator: 80, platform: 20, nft: 0 },
        description: "Streamlines recruitment, onboarding, and team coordination",
        useCases: ["Recruitment screening", "Onboarding workflows", "Performance tracking"],
        setupType: "Base"
      }
    ];

    res.json({ agents: marketplaceAgents });

  } catch (error) {
    console.error("Marketplace data error:", error);
    res.status(500).json({ 
      message: "Failed to fetch marketplace data",
      error: error.message 
    });
  }
});

// Create new agent (for creators)
router.post("/create", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const agentData = req.body;

    // Validate creator permissions
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has creator permissions
    if (!user.isCreator && !user.isPremium) {
      return res.status(403).json({ 
        message: "Creator permissions required. Please upgrade your account." 
      });
    }

    // Validate agent data
    if (!agentData.basicInfo?.agentName || !agentData.basicInfo?.category) {
      return res.status(400).json({ 
        message: "Missing required agent information" 
      });
    }

    // Check monthly price minimum
    if (agentData.basicInfo.monthlyMRR < 444) {
      return res.status(400).json({ 
        message: "Minimum monthly price is $444" 
      });
    }

    // Create agent in database
    const newAgent = await storage.createAgent({
      creatorId: userId,
      name: agentData.basicInfo.agentName,
      role: agentData.basicInfo.tagline,
      category: agentData.basicInfo.category,
      monthlyPrice: agentData.basicInfo.monthlyMRR,
      setupType: agentData.basicInfo.agentType,
      tokenUsage: agentData.basicInfo.tokenUseEstimate,
      timeSaved: agentData.performance.avgTimeSaved,
      avgROI: agentData.performance.avgROI,
      integrations: agentData.performance.toolIntegrations,
      useCases: agentData.performance.exampleUseCases,
      description: agentData.customization.description,
      targetPersona: agentData.customization.targetPersona,
      nftEnabled: agentData.ownership.nftMintToggle,
      nftName: agentData.ownership.nftName,
      creatorWallet: agentData.ownership.creatorWalletAddress,
      royaltySplit: agentData.ownership.royaltySplit,
      isPublic: agentData.visibility.public,
      displayOnLeaderboard: agentData.visibility.displayOnLeaderboard,
      status: "pending_review"
    });

    // If NFT minting is enabled, trigger minting process
    if (agentData.ownership.nftMintToggle && agentData.ownership.creatorWalletAddress) {
      // TODO: Implement NFT minting logic here
      // This would integrate with the smart contract system
      console.log("NFT minting requested for agent:", newAgent.id);
    }

    res.json({
      success: true,
      agent: newAgent,
      message: "Agent created successfully",
      nftMinting: agentData.ownership.nftMintToggle
    });

  } catch (error) {
    console.error("Agent creation error:", error);
    res.status(500).json({ 
      message: "Failed to create agent",
      error: error.message 
    });
  }
});

// Get agent by slug (for CMS profiles)
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Convert slug back to agent name and find agent
    const agentName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // For now, return from our static data
    // In production, this would query the database
    const marketplaceAgents = [
      {
        id: 1,
        name: "CA$H",
        slug: "cash",
        role: "Sales Strategist",
        category: "Sales",
        avatar: "💰",
        monthlyPrice: 750,
        timeSaved: "26+ hrs/week",
        integrations: ["GHL", "Slack", "Zapier", "HubSpot"],
        rating: 4.9,
        reviews: 147,
        tokenUsage: "Medium",
        status: "Available",
        creator: "0x742d35Cc6672C0532925a3b8D2A291E48e5C67F8",
        creatorName: "Harmonix Core",
        nftEnabled: true,
        royaltySplit: { creator: 70, platform: 20, nft: 10 },
        description: "Elite sales automation agent trained on 10,000+ successful funnels. CA$H specializes in converting leads into high-value clients through intelligent sequence automation.",
        useCases: ["Lead qualification", "Follow-up sequences", "CRM automation", "Pipeline management", "Revenue optimization"],
        setupType: "Custom",
        longDescription: "CA$H is our flagship sales automation agent, designed to transform your sales process from manual effort into a high-converting machine. Built on analysis of over 10,000 successful sales funnels, CA$H understands the psychology of conversion and implements proven strategies automatically.",
        features: [
          "Intelligent lead scoring and qualification",
          "Automated follow-up sequences with perfect timing", 
          "CRM integration with real-time data sync",
          "Performance analytics and optimization",
          "Custom pipeline management"
        ],
        testimonials: [
          {
            name: "Sarah Chen",
            company: "TechStart Inc",
            quote: "CA$H increased our conversion rate by 340% in the first month. The ROI is incredible.",
            rating: 5
          }
        ]
      }
    ];

    const agent = marketplaceAgents.find(a => 
      a.slug === slug || a.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
    );

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ agent });

  } catch (error) {
    console.error("Agent profile error:", error);
    res.status(500).json({ 
      message: "Failed to fetch agent profile",
      error: error.message 
    });
  }
});

export default router;