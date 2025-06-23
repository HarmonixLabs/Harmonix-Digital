// Harmonix Pricing Configuration
// This file defines the pricing structure, discounts, and business logic

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  setupMin: number;
  setupMax: number;
  mrrMin: number;
  mrrMax: number;
  agentsIncluded: number;
  features: string[];
  stripeProductId?: string;
  stripeSetupPriceId?: string;
  stripeMonthlyPriceId?: string;
  popular?: boolean;
  enterprise?: boolean;
}

export interface DiscountConfig {
  earlyBird: {
    percentage: number;
    maxCustomers: number;
    active: boolean;
  };
  platformDiscount: {
    percentage: number;
    description: string;
  };
  bulkDiscount: {
    thresholds: Array<{
      agentCount: number;
      discountPercentage: number;
    }>;
  };
}

export interface FinancingConfig {
  interestRate: number;
  termMonths: number;
  minimumAmount: number;
}

// Official Harmonix pricing tiers
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for solopreneurs and simple team integration",
    setupMin: 4400,
    setupMax: 6200,
    mrrMin: 800,
    mrrMax: 1200,
    agentsIncluded: 1,
    features: [
      "1 Core AI Agent",
      "Basic CRM Integration", 
      "Email Support",
      "Standard Templates",
      "Monthly Health Checks",
      "Community Access"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    description: "Growing teams with multi-function automation setups", 
    setupMin: 8000,
    setupMax: 12500,
    mrrMin: 3200,
    mrrMax: 4400,
    agentsIncluded: 5,
    features: [
      "3-5 AI Agents",
      "Advanced CRM Integration",
      "Priority Support", 
      "Custom Workflows",
      "Ongoing Training & Optimization",
      "SŌL Brain Coordination",
      "API Access"
    ],
    popular: true
  },
  {
    id: "expansion", 
    name: "Expansion",
    description: "Mid-sized operations automating complex workflows",
    setupMin: 15000,
    setupMax: 18000,
    mrrMin: 4800,
    mrrMax: 6400,
    agentsIncluded: 8,
    features: [
      "6-8 AI Agents",
      "Full Integration Suite",
      "Dedicated Support Manager",
      "Custom Agent Training",
      "Advanced Analytics Dashboard", 
      "White-label Options",
      "Multi-location Support",
      "Platform Discount (21-30% off future agents)"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise", 
    description: "Large teams with full-suite AI integration and SŌL Brain",
    setupMin: 21500,
    setupMax: 0, // Custom pricing
    mrrMin: 8000,
    mrrMax: 12000,
    agentsIncluded: 12,
    features: [
      "8-12+ AI Agents",
      "SŌL Brain Orchestration Included",
      "24/7 Premium Support",
      "Custom Development",
      "Enterprise Security",
      "On-premise Options", 
      "Dedicated Success Team",
      "Full Agent Concierge Service",
      "ROI Guarantee"
    ],
    enterprise: true
  }
];

// Discount configuration
export const DISCOUNT_CONFIG: DiscountConfig = {
  earlyBird: {
    percentage: 30,
    maxCustomers: 280,
    active: true
  },
  platformDiscount: {
    percentage: 25, // 21-30% range, using 25% average
    description: "Existing platform installation discount"
  },
  bulkDiscount: {
    thresholds: [
      { agentCount: 1, discountPercentage: 0 },
      { agentCount: 3, discountPercentage: 15 },
      { agentCount: 6, discountPercentage: 25 },
      { agentCount: 9, discountPercentage: 35 }
    ]
  }
};

// Financing configuration
export const FINANCING_CONFIG: FinancingConfig = {
  interestRate: 0.21, // 21% APR
  termMonths: 12,
  minimumAmount: 5000
};

// Individual agent pricing for marketplace
export interface AgentPricing {
  count: number;
  setupFeeRange: [number, number];
  monthlyFeeRange: [number, number];
}

export const AGENT_PRICING: AgentPricing[] = [
  {
    count: 1,
    setupFeeRange: [4400, 6200],
    monthlyFeeRange: [800, 1200]
  },
  {
    count: 3, // 3-5 agents
    setupFeeRange: [2600, 3200],
    monthlyFeeRange: [500, 900]
  },
  {
    count: 6, // 6-8 agents  
    setupFeeRange: [2000, 2400],
    monthlyFeeRange: [400, 700]
  },
  {
    count: 9, // 9-12 agents
    setupFeeRange: [1200, 2000], 
    monthlyFeeRange: [350, 600]
  }
];

// Utility functions for pricing calculations
export function calculateDiscountedPrice(
  basePrice: number,
  hasEarlyBird: boolean = false,
  hasPlatformDiscount: boolean = false,
  agentCount: number = 1
): number {
  let finalPrice = basePrice;
  
  // Apply early bird discount
  if (hasEarlyBird && DISCOUNT_CONFIG.earlyBird.active) {
    finalPrice *= (1 - DISCOUNT_CONFIG.earlyBird.percentage / 100);
  }
  
  // Apply platform discount
  if (hasPlatformDiscount) {
    finalPrice *= (1 - DISCOUNT_CONFIG.platformDiscount.percentage / 100);
  }
  
  // Apply bulk discount
  const applicableBulkDiscount = DISCOUNT_CONFIG.bulkDiscount.thresholds
    .filter(threshold => agentCount >= threshold.agentCount)
    .pop();
    
  if (applicableBulkDiscount) {
    finalPrice *= (1 - applicableBulkDiscount.discountPercentage / 100);
  }
  
  return Math.round(finalPrice);
}

export function calculateFinancedTotal(setupFee: number): {
  totalWithInterest: number;
  monthlyPayment: number;
} {
  const totalWithInterest = setupFee * (1 + FINANCING_CONFIG.interestRate);
  const monthlyPayment = totalWithInterest / FINANCING_CONFIG.termMonths;
  
  return {
    totalWithInterest: Math.round(totalWithInterest),
    monthlyPayment: Math.round(monthlyPayment)
  };
}

// Stripe product/price mapping (to be configured in Stripe dashboard)
export const STRIPE_CONFIG = {
  products: {
    starter: "prod_harmonix_starter",
    growth: "prod_harmonix_growth", 
    expansion: "prod_harmonix_expansion",
    enterprise: "prod_harmonix_enterprise"
  },
  prices: {
    starter_setup: "price_harmonix_starter_setup",
    starter_monthly: "price_harmonix_starter_monthly",
    growth_setup: "price_harmonix_growth_setup",
    growth_monthly: "price_harmonix_growth_monthly",
    expansion_setup: "price_harmonix_expansion_setup",
    expansion_monthly: "price_harmonix_expansion_monthly",
    enterprise_setup: "price_harmonix_enterprise_setup",
    enterprise_monthly: "price_harmonix_enterprise_monthly"
  }
};