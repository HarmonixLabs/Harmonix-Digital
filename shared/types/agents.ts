// Enhanced agent types for Phase 1 marketplace system

export interface AgentFormData {
  basicInfo: {
    agentName: string;
    category: string;
    tagline: string;
    agentAvatar: string;
    agentType: string;
    monthlyMRR: number;
    setupFee: number;
    tokenUseEstimate: string;
  };
  performance: {
    avgTimeSaved: number;
    avgROI: number;
    toolIntegrations: string[];
    exampleUseCases: string[];
  };
  ownership: {
    creatorWalletAddress: string;
    nftMintToggle: boolean;
    nftName: string;
    royaltySplit: {
      creator: number;
      platform: number;
      investorSplit: number;
    };
  };
  customization: {
    description: string;
    prebuiltPrompts: string[];
    targetPersona: string;
    agentPreviewDemoLink: string;
    availableLanguages: string[];
  };
  visibility: {
    public: boolean;
    displayOnLeaderboard: boolean;
    featureInMarketplace: boolean;
  };
}

export interface MarketplaceAgent {
  id: number;
  name: string;
  role: string;
  category: string;
  avatar: string;
  monthlyPrice: number;
  timeSaved: string;
  integrations: string[];
  rating: number;
  reviews: number;
  tokenUsage: string;
  status: string;
  creator: string;
  creatorName: string;
  nftEnabled: boolean;
  royaltySplit: {
    creator: number;
    platform: number;
    nft: number;
  };
  description: string;
  useCases: string[];
  setupType: string;
}

export interface AgentDeployment {
  id: string;
  userId: string;
  agentId: number;
  name: string;
  monthlyPrice: number;
  setupType: string;
  status: "pending_payment" | "active" | "paused" | "cancelled";
  deployedAt: Date;
  lastBillingDate?: Date;
  nextBillingDate?: Date;
}

export interface CreatedAgent {
  id: string;
  creatorId: string;
  name: string;
  role: string;
  category: string;
  monthlyPrice: number;
  setupType: string;
  tokenUsage: string;
  timeSaved: number;
  avgROI: number;
  integrations: string[];
  useCases: string[];
  description: string;
  targetPersona: string;
  nftEnabled: boolean;
  nftName?: string;
  nftTokenId?: string;
  creatorWallet?: string;
  royaltySplit: {
    creator: number;
    platform: number;
    investorSplit: number;
  };
  isPublic: boolean;
  displayOnLeaderboard: boolean;
  status: "pending_review" | "approved" | "rejected" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface StripeConnectAccount {
  userId: string;
  stripeAccountId: string;
  accountStatus: "pending" | "active" | "restricted";
  onboardingCompleted: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoyaltyPayment {
  id: string;
  agentId: string;
  creatorId: string;
  deploymentId: string;
  amount: number;
  creatorShare: number;
  platformShare: number;
  nftHolderShare: number;
  paymentDate: Date;
  stripeTransferId?: string;
  status: "pending" | "completed" | "failed";
}