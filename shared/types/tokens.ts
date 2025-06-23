export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  source: 'achievement' | 'milestone' | 'tutorial' | 'agent_usage' | 'purchase' | 'referral' | 'daily_bonus';
  description: string;
  metadata?: {
    achievementId?: string;
    agentId?: string;
    tutorialId?: string;
    milestoneId?: string;
  };
  createdAt: Date;
}

export interface UserTokenBalance {
  userId: string;
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  lastUpdated: Date;
}

export interface TokenReward {
  id: string;
  name: string;
  description: string;
  tokenAmount: number;
  trigger: 'achievement_unlock' | 'milestone_complete' | 'tutorial_finish' | 'first_login' | 'agent_deploy' | 'workflow_create';
  category: 'onboarding' | 'engagement' | 'achievement' | 'performance';
  isActive: boolean;
}

export interface AgentTokenCost {
  agentId: string;
  baseTokensPerTask: number;
  complexityMultiplier: number;
  monthlyTokenAllowance: number;
}

export const TOKEN_REWARDS: TokenReward[] = [
  // Onboarding Rewards
  {
    id: 'welcome_bonus',
    name: 'Welcome Bonus',
    description: 'Starting tokens for new users',
    tokenAmount: 1000,
    trigger: 'first_login',
    category: 'onboarding',
    isActive: true
  },
  {
    id: 'profile_complete',
    name: 'Profile Master',
    description: 'Complete your profile setup',
    tokenAmount: 500,
    trigger: 'achievement_unlock',
    category: 'onboarding',
    isActive: true
  },
  {
    id: 'tutorial_completion',
    name: 'Learning Champion',
    description: 'Complete platform tutorial',
    tokenAmount: 750,
    trigger: 'tutorial_finish',
    category: 'onboarding',
    isActive: true
  },
  {
    id: 'first_agent_deploy',
    name: 'Agent Summoner',
    description: 'Deploy your first AI agent',
    tokenAmount: 1500,
    trigger: 'agent_deploy',
    category: 'achievement',
    isActive: true
  },
  {
    id: 'workflow_creator',
    name: 'Automation Architect',
    description: 'Create your first workflow',
    tokenAmount: 2000,
    trigger: 'workflow_create',
    category: 'achievement',
    isActive: true
  },

  // Milestone Rewards
  {
    id: 'level_up_tier1',
    name: 'Rising Star',
    description: 'Reach level 5',
    tokenAmount: 1000,
    trigger: 'milestone_complete',
    category: 'achievement',
    isActive: true
  },
  {
    id: 'level_up_tier2',
    name: 'Platform Expert',
    description: 'Reach level 10',
    tokenAmount: 2500,
    trigger: 'milestone_complete',
    category: 'achievement',
    isActive: true
  },
  {
    id: 'agent_master',
    name: 'Agent Master',
    description: 'Deploy 5 different agents',
    tokenAmount: 3000,
    trigger: 'achievement_unlock',
    category: 'performance',
    isActive: true
  },
  {
    id: 'roi_achiever',
    name: 'ROI Champion',
    description: 'Save $5,000 in documented time value',
    tokenAmount: 5000,
    trigger: 'achievement_unlock',
    category: 'performance',
    isActive: true
  }
];

export const AGENT_TOKEN_COSTS: Record<string, AgentTokenCost> = {
  'cash-agent': {
    agentId: 'cash-agent',
    baseTokensPerTask: 50,
    complexityMultiplier: 1.2,
    monthlyTokenAllowance: 2000
  },
  'maya-hr': {
    agentId: 'maya-hr',
    baseTokensPerTask: 30,
    complexityMultiplier: 1.0,
    monthlyTokenAllowance: 1500
  },
  'virgil-brand': {
    agentId: 'virgil-brand',
    baseTokensPerTask: 75,
    complexityMultiplier: 1.5,
    monthlyTokenAllowance: 2500
  },
  'sop-agent': {
    agentId: 'sop-agent',
    baseTokensPerTask: 40,
    complexityMultiplier: 1.1,
    monthlyTokenAllowance: 1800
  }
};

export const calculateTokenCost = (agentId: string, taskComplexity: 'simple' | 'medium' | 'complex' = 'medium'): number => {
  const agentCost = AGENT_TOKEN_COSTS[agentId];
  if (!agentCost) return 50; // Default cost

  const complexityMultipliers = {
    simple: 0.8,
    medium: 1.0,
    complex: 1.5
  };

  return Math.round(agentCost.baseTokensPerTask * complexityMultipliers[taskComplexity] * agentCost.complexityMultiplier);
};

export const formatTokenAmount = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
};