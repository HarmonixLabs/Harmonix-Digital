import { storage } from "../storage";

export interface NFTAgentMetadata {
  agentId: string;
  agentName: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "founder";
  attributes: {
    efficiency: number;
    accuracy: number;
    speed: string;
    integrations: string[];
    specialization: string;
  };
  collection: string;
  maxSupply: number;
  currentSupply: number;
  royaltyPercentage: number;
}

export interface NFTMintRequest {
  userId: number;
  walletAddress: string;
  agentId: string;
  depositSessionId?: string;
  mintTrigger: "agent_deployment" | "package_deposit" | "founder_access";
}

export class NFTAgentService {
  
  private agentCollections: Record<string, NFTAgentMetadata> = {
    "CASH": {
      agentId: "CASH",
      agentName: "Agent CA$H",
      rarity: "legendary",
      attributes: {
        efficiency: 98,
        accuracy: 95,
        speed: "< 2s",
        integrations: ["Stripe", "GoHighLevel", "OpenAI GPT-4o"],
        specialization: "Revenue Generation"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 777,
      currentSupply: 0,
      royaltyPercentage: 15
    },
    "GRACE": {
      agentId: "GRACE",
      agentName: "GRACE Agent",
      rarity: "epic",
      attributes: {
        efficiency: 96,
        accuracy: 94,
        speed: "< 1s",
        integrations: ["Live Chat", "Support Desk", "Knowledge Base"],
        specialization: "Customer Experience"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 777,
      currentSupply: 0,
      royaltyPercentage: 12
    },
    "ECHO": {
      agentId: "ECHO",
      agentName: "ECHO Agent",
      rarity: "rare",
      attributes: {
        efficiency: 94,
        accuracy: 92,
        speed: "< 3s",
        integrations: ["Facebook", "Instagram", "LinkedIn", "Twitter"],
        specialization: "Social Media Management"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 777,
      currentSupply: 0,
      royaltyPercentage: 10
    },
    "FLOW": {
      agentId: "FLOW",
      agentName: "FLOW Agent",
      rarity: "epic",
      attributes: {
        efficiency: 97,
        accuracy: 96,
        speed: "< 2s",
        integrations: ["Zapier", "Make", "API Integrations"],
        specialization: "Process Automation"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 777,
      currentSupply: 0,
      royaltyPercentage: 13
    },
    "KAIROS": {
      agentId: "KAIROS",
      agentName: "KAIROS Agent",
      rarity: "rare",
      attributes: {
        efficiency: 95,
        accuracy: 97,
        speed: "< 2s",
        integrations: ["Asana", "Monday.com", "Slack", "Teams"],
        specialization: "Project Management"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 777,
      currentSupply: 0,
      royaltyPercentage: 11
    },
    "SOL": {
      agentId: "SOL",
      agentName: "SŌL Agent",
      rarity: "founder",
      attributes: {
        efficiency: 99,
        accuracy: 98,
        speed: "< 1s",
        integrations: ["All Agent Networks", "OpenAI GPT-4o", "Master Hub"],
        specialization: "AI Orchestration"
      },
      collection: "Harmonix Founder Mirror Agents",
      maxSupply: 280, // Limited founder collection
      currentSupply: 0,
      royaltyPercentage: 20
    }
  };

  /**
   * Trigger NFT mint after successful agent deployment or deposit
   */
  async triggerNFTMint(request: NFTMintRequest): Promise<{ success: boolean; nftData?: any; error?: string }> {
    try {
      // Validate wallet connection
      if (!this.isValidWalletAddress(request.walletAddress)) {
        return { success: false, error: "Invalid wallet address format" };
      }

      // Get agent metadata
      const agentMetadata = this.agentCollections[request.agentId.toUpperCase()];
      if (!agentMetadata) {
        return { success: false, error: "Agent not found in NFT collection" };
      }

      // Check supply limits
      if (agentMetadata.currentSupply >= agentMetadata.maxSupply) {
        return { success: false, error: "NFT collection sold out" };
      }

      // Prepare NFT metadata
      const nftMetadata = {
        name: `${agentMetadata.agentName} #${agentMetadata.currentSupply + 1}`,
        description: `Founder Mirror Agent NFT granting exclusive access to ${agentMetadata.agentName} and platform benefits`,
        image: `https://harmonix.repl.co/nft/${agentMetadata.agentId.toLowerCase()}-${agentMetadata.rarity}.png`,
        attributes: [
          {
            trait_type: "Agent Type",
            value: agentMetadata.agentName
          },
          {
            trait_type: "Rarity",
            value: agentMetadata.rarity
          },
          {
            trait_type: "Efficiency",
            value: agentMetadata.attributes.efficiency
          },
          {
            trait_type: "Accuracy", 
            value: agentMetadata.attributes.accuracy
          },
          {
            trait_type: "Response Speed",
            value: agentMetadata.attributes.speed
          },
          {
            trait_type: "Specialization",
            value: agentMetadata.attributes.specialization
          },
          {
            trait_type: "Collection",
            value: agentMetadata.collection
          },
          {
            trait_type: "Mint Number",
            value: agentMetadata.currentSupply + 1
          },
          {
            trait_type: "Max Supply",
            value: agentMetadata.maxSupply
          }
        ],
        external_url: "https://harmonix.repl.co",
        royalties: {
          percentage: agentMetadata.royaltyPercentage,
          recipient: "harmonix.eth" // Platform royalty wallet
        }
      };

      // In a real implementation, this would interact with the blockchain
      // For demo purposes, we'll simulate the minting process
      const nftData = await this.simulateNFTMint(request, agentMetadata, nftMetadata);

      // Update supply counter
      agentMetadata.currentSupply++;

      // Store NFT ownership record
      await this.storeNFTOwnership(request.userId, request.agentId, nftData);

      // Trigger GHL workflow for NFT bonus
      await this.notifyNFTMint(request, nftData);

      return { success: true, nftData };

    } catch (error) {
      console.error('NFT mint error:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Get NFT collection data for marketplace
   */
  getAgentCollections(): Record<string, NFTAgentMetadata> {
    return this.agentCollections;
  }

  /**
   * Get user's NFT collection
   */
  async getUserNFTs(userId: number): Promise<any[]> {
    // In a real implementation, this would query the blockchain
    // For demo purposes, query our internal records
    return await storage.getUserNFTs(userId);
  }

  /**
   * Check NFT access control for agent deployment
   */
  async hasNFTAccess(userId: number, agentId: string): Promise<boolean> {
    const userNFTs = await this.getUserNFTs(userId);
    return userNFTs.some(nft => nft.agentId === agentId.toUpperCase());
  }

  /**
   * Get NFT utility benefits
   */
  getNFTBenefits(rarity: string) {
    const benefits = {
      common: [
        "Agent deployment access",
        "5% platform fee discount",
        "Community forum access"
      ],
      rare: [
        "Agent deployment access",
        "10% platform fee discount", 
        "Priority support",
        "Beta feature access"
      ],
      epic: [
        "Agent deployment access",
        "15% platform fee discount",
        "Priority support",
        "Beta feature access",
        "Monthly strategy calls"
      ],
      legendary: [
        "Agent deployment access",
        "20% platform fee discount",
        "Dedicated success manager",
        "Beta feature access",
        "Monthly strategy calls",
        "Referral commission (5%)"
      ],
      founder: [
        "Lifetime agent access",
        "25% platform fee discount",
        "Dedicated success manager",
        "Alpha feature access",
        "Weekly founder calls",
        "Referral commission (10%)",
        "Revenue sharing (2%)"
      ]
    };

    return benefits[rarity as keyof typeof benefits] || benefits.common;
  }

  private isValidWalletAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  private async simulateNFTMint(request: NFTMintRequest, metadata: NFTAgentMetadata, nftMetadata: any) {
    // Simulate blockchain interaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      tokenId: metadata.currentSupply + 1,
      contractAddress: "0x742d35Cc6635C0532925a3b8D0f24A3FC2b6E8c8", // Demo contract
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      metadata: nftMetadata,
      owner: request.walletAddress,
      mintedAt: new Date().toISOString(),
      gasUsed: "0.0015 ETH",
      status: "confirmed"
    };
  }

  private async storeNFTOwnership(userId: number, agentId: string, nftData: any) {
    // Store in database for internal tracking
    const nftRecord = {
      userId,
      agentId: agentId.toUpperCase(),
      tokenId: nftData.tokenId,
      contractAddress: nftData.contractAddress,
      transactionHash: nftData.transactionHash,
      walletAddress: nftData.owner,
      mintedAt: new Date(),
      metadata: nftData.metadata
    };

    // In a real implementation, this would use a proper storage method
    console.log('NFT ownership stored:', nftRecord);
  }

  private async notifyNFTMint(request: NFTMintRequest, nftData: any) {
    try {
      const { ghlIntegration } = await import("../ghl-integration");
      
      // Find user email for GHL notification
      const user = await storage.getUser(request.userId);
      if (user?.email) {
        await ghlIntegration.addTags(user.email, [
          'nft_holder',
          `nft_${request.agentId.toLowerCase()}`,
          'founder_collection'
        ]);

        // Create opportunity for NFT bonus
        await ghlIntegration.createOpportunity({
          contactEmail: user.email,
          opportunityName: `NFT Agent Bonus - ${request.agentId.toUpperCase()}`,
          monetaryValue: 0,
          status: 'NFT Minted - Exclusive Access Granted'
        });
      }
    } catch (error) {
      console.error('GHL notification error for NFT mint:', error);
    }
  }
}

export const nftAgentService = new NFTAgentService();