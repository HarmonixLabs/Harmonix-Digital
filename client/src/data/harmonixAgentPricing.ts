// Harmonix Agent Pricing Structure
// Based on the comprehensive pricing suite provided

export interface AgentPricingTier {
  id: string;
  name: string;
  role: string;
  monthlyPrice: number;
  setupFee: number;
  setupFeeWithPlan: number; // Waived with dashboard plan
  description: string;
  features: string[];
  integrations: string[];
  category: 'core' | 'specialized' | 'premium';
  creator: string;
  minimumCommitment?: string;
}

export interface DashboardPlan {
  id: string;
  name: string;
  monthlyFee: number;
  agentsIncluded: number;
  setupFeesWaived: boolean;
  dashboardAccess: boolean;
  additionalAgentPrice: number;
  features: string[];
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  type: 'one-time' | 'monthly' | 'per-agent';
  description: string;
}

// Core Agents Pricing (Base) - All by Harmonix Labs
export const CORE_AGENTS: AgentPricingTier[] = [
  {
    id: 'sol-brain',
    name: 'SŌL',
    role: 'Harmony Brain / Orchestrator',
    monthlyPrice: 350,
    setupFee: 1200,
    setupFeeWithPlan: 0,
    description: 'Central AI orchestration system that coordinates all your agents and provides intelligent insights',
    features: [
      'Agent Orchestration',
      'Intelligent Routing',
      'Performance Analytics',
      'Decision Making',
      'System Optimization',
      'Predictive Insights'
    ],
    integrations: ['All Harmonix Agents', 'CRM Systems', 'Analytics Platforms', 'Communication Tools'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '3 months'
  },
  {
    id: 'cash-agent',
    name: 'CA$H',
    role: 'Sales AI Closer / Lead Qualifier',
    monthlyPrice: 350,
    setupFee: 1000,
    setupFeeWithPlan: 0,
    description: 'Elite sales agent that qualifies leads, nurtures prospects, and closes deals with advanced CRM integration',
    features: [
      'Lead Qualification',
      'Sales Pipeline Management',
      'CRM Integration',
      'Loom Script Generation',
      'Follow-up Automation',
      'Revenue Optimization'
    ],
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'GoHighLevel', 'Calendly', 'Zoom'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '1 month'
  },
  {
    id: 'concierge-agent',
    name: 'Concierge',
    role: 'Client Success / CRM Agent',
    monthlyPrice: 300,
    setupFee: 900,
    setupFeeWithPlan: 0,
    description: 'Dedicated client success specialist ensuring optimal customer experience and retention',
    features: [
      'Client Onboarding',
      'Success Monitoring',
      'Retention Strategies',
      'Support Ticket Management',
      'Satisfaction Tracking',
      'Renewal Management'
    ],
    integrations: ['Zendesk', 'Intercom', 'Freshdesk', 'Slack', 'Microsoft Teams', 'Google Workspace'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '1 month'
  },
  {
    id: 'flow-agent',
    name: 'Flow',
    role: 'Process Optimizer / SOP Builder',
    monthlyPrice: 300,
    setupFee: 950,
    setupFeeWithPlan: 0,
    description: 'Process optimization specialist that creates and maintains standard operating procedures',
    features: [
      'Process Documentation',
      'SOP Creation',
      'Workflow Optimization',
      'Efficiency Analysis',
      'Automation Recommendations',
      'Training Materials'
    ],
    integrations: ['Process Street', 'Monday.com', 'Asana', 'Notion', 'Airtable', 'Zapier'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '1 month'
  },
  {
    id: 'kairos-agent',
    name: 'Kairos',
    role: 'Project Manager / Time Sync Agent',
    monthlyPrice: 280,
    setupFee: 800,
    setupFeeWithPlan: 0,
    description: 'Advanced project management agent with intelligent scheduling and resource optimization',
    features: [
      'Project Planning',
      'Resource Allocation',
      'Timeline Management',
      'Risk Assessment',
      'Progress Tracking',
      'Team Coordination'
    ],
    integrations: ['Jira', 'Trello', 'Asana', 'Microsoft Project', 'Google Calendar', 'Slack'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '1 month'
  },
  {
    id: 'echo-agent',
    name: 'Echo',
    role: 'Content / Storytelling / Social AI',
    monthlyPrice: 320,
    setupFee: 1000,
    setupFeeWithPlan: 0,
    description: 'Creative content specialist for social media, storytelling, and brand communication',
    features: [
      'Content Creation',
      'Social Media Management',
      'Brand Storytelling',
      'Content Calendar',
      'Engagement Analytics',
      'Trend Analysis'
    ],
    integrations: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'YouTube', 'TikTok', 'Buffer', 'Hootsuite'],
    category: 'core',
    creator: 'Harmonix Labs',
    minimumCommitment: '1 month'
  },
  {
    id: 'forge-agent',
    name: 'Forge',
    role: 'Developer / DevOps / AI Builder',
    monthlyPrice: 400,
    setupFee: 1500,
    setupFeeWithPlan: 0,
    description: 'Technical specialist for development, deployment, and AI system building',
    features: [
      'Code Generation',
      'DevOps Automation',
      'AI Model Training',
      'System Architecture',
      'Performance Monitoring',
      'Security Implementation'
    ],
    integrations: ['GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins'],
    category: 'premium',
    creator: 'Harmonix Labs',
    minimumCommitment: '3 months'
  }
];

// Dashboard Plans with Bundle Discounts
export const DASHBOARD_PLANS: DashboardPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyFee: 1200,
    agentsIncluded: 3,
    setupFeesWaived: true,
    dashboardAccess: true,
    additionalAgentPrice: 250,
    features: [
      '3 Agents Included',
      'Setup Fees Waived',
      'Dashboard Access',
      'Basic Analytics',
      'Email Support',
      'Monthly Reports'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyFee: 1950,
    agentsIncluded: 5,
    setupFeesWaived: true,
    dashboardAccess: true,
    additionalAgentPrice: 240,
    features: [
      '5 Agents Included',
      'Setup Fees Waived',
      'Full Dashboard Access',
      'Advanced Analytics',
      'Priority Support',
      'Weekly Reports',
      'Custom Integrations'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyFee: 3200,
    agentsIncluded: 8,
    setupFeesWaived: true,
    dashboardAccess: true,
    additionalAgentPrice: 220,
    features: [
      '8 Agents Included',
      'Setup Fees Waived',
      'Enterprise Dashboard',
      'Real-time Analytics',
      'Dedicated Support',
      'Daily Reports',
      'White-label Options',
      'API Access',
      'Custom Development'
    ]
  },
  {
    id: 'creator-sandbox',
    name: 'Creator Sandbox',
    monthlyFee: 300,
    agentsIncluded: 0,
    setupFeesWaived: false,
    dashboardAccess: true, // Limited
    additionalAgentPrice: 0,
    features: [
      'Creator Upload Access',
      'Limited Dashboard',
      'Agent Development Tools',
      'Testing Environment',
      'Community Support',
      'Revenue Sharing'
    ]
  }
];

// A La Carte Add-On Options
export const ADDON_SERVICES: AddOnService[] = [
  {
    id: 'nft-minting',
    name: 'Agent NFT Minting (w/ metadata)',
    price: 80,
    type: 'per-agent',
    description: 'Mint your agent as an NFT with full metadata and blockchain integration'
  },
  {
    id: 'dashboard-only',
    name: 'Dashboard Setup Only (no agents)',
    price: 350,
    type: 'one-time',
    description: 'Set up your dashboard without any agents included'
  },
  {
    id: 'white-labeling',
    name: 'Platform White-labeling',
    price: 2000,
    type: 'one-time',
    description: 'Custom white-label solution with your branding (starting price)'
  },
  {
    id: 'marketplace-listing',
    name: 'Creator Marketplace Activation',
    price: 150,
    type: 'per-agent',
    description: 'List your agent in the marketplace for public access'
  },
  {
    id: 'concierge-support',
    name: 'Concierge Onboarding Support (Live)',
    price: 180,
    type: 'monthly', // per hour in pricing doc
    description: 'Live onboarding support and training sessions'
  },
  {
    id: 'api-syncs',
    name: 'API Syncs (CRM, Calendars, GDrive)',
    price: 0, // Included in setup
    type: 'one-time',
    description: 'Included in setup fees - no additional cost'
  },
  {
    id: 'token-recharge',
    name: 'Recharge Wallet (HRMNY Top-Up)',
    price: 50, // Dynamic $50-$500+
    type: 'one-time',
    description: 'Top up your HRMNY token balance for agent operations'
  }
];

// Payment Methods
export const PAYMENT_METHODS = [
  {
    id: 'stripe',
    name: 'Stripe (Default)',
    description: 'Credit/Debit for Setup & Subscriptions',
    icon: '💳',
    default: true
  },
  {
    id: 'crypto',
    name: 'NowPay (BTC/ETH/Stable)',
    description: 'Optional via NowPayments Wallet',
    icon: '🪙',
    default: false
  },
  {
    id: 'invoice',
    name: 'Custom Invoicing',
    description: 'Enterprise only',
    icon: '💼',
    default: false,
    enterprise: true
  }
];

// Pricing Conditions
export const PRICING_CONDITIONS = [
  'Plans billed monthly (Net 0)',
  'Setup fees non-refundable',
  'Agent updates and optimizations included in monthly subscription',
  'All agents require an active fuel balance (HRMNY token) to run advanced tasks',
  'System will auto-prompt user to top up when low',
  'Minimum commitment varies by agent (1-3 months)',
  'Enterprise plans include custom development and white-label options'
];

// Helper function to calculate total cost scenarios
export const calculatePricingScenario = (
  scenario: 'single-agent' | 'dashboard-plan' | 'creator' | 'addon',
  agentId?: string,
  planId?: string
) => {
  switch (scenario) {
    case 'single-agent':
      if (!agentId) return null;
      const agent = CORE_AGENTS.find(a => a.id === agentId);
      if (!agent) return null;
      return {
        setupFee: agent.setupFee,
        monthlyFee: agent.monthlyPrice,
        accessLevel: 'Dashboard + Agent',
        total: agent.setupFee + agent.monthlyPrice
      };
      
    case 'dashboard-plan':
      if (!planId) return null;
      const plan = DASHBOARD_PLANS.find(p => p.id === planId);
      if (!plan) return null;
      return {
        setupFee: 0, // Waived
        monthlyFee: plan.monthlyFee,
        accessLevel: 'Full Dashboard',
        agentsIncluded: plan.agentsIncluded,
        total: plan.monthlyFee
      };
      
    case 'creator':
      const creatorPlan = DASHBOARD_PLANS.find(p => p.id === 'creator-sandbox');
      if (!creatorPlan) return null;
      return {
        setupFee: 150, // Marketplace listing
        monthlyFee: creatorPlan.monthlyFee,
        accessLevel: 'Marketplace + Royalties',
        total: 150 + creatorPlan.monthlyFee
      };
      
    default:
      return null;
  }
};