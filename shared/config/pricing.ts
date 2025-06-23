// Centralized pricing configuration to avoid discrepancies across pages
export const PRICING_CONFIG = {
  // Early bird settings
  EARLY_BIRD: {
    enabled: true,
    discount: 0.30, // 30% off
    maxCustomers: 280,
    currentCount: 47 // This would be dynamic in production
  },

  // Financing options
  FINANCING: {
    enabled: true,
    apr: 0.21, // 21% APR
    termMonths: 12,
    minDepositPercent: 15,
    maxDepositPercent: 33,
    defaultDepositPercent: 20
  },

  // Pricing tiers
  TIERS: {
    starter: {
      id: "starter",
      name: "Starter",
      description: "Perfect for small businesses beginning their automation journey",
      setupFee: { min: 4400, max: 6200 },
      monthlyMRR: { min: 800, max: 1200 },
      agents: { min: 1, max: 2 },
      features: [
        "1-2 AI Agents",
        "Basic integrations", 
        "Standard support",
        "SŌL brain access",
        "Monthly analytics",
        "Email automation"
      ],
      popular: false,
      stripeProductId: "prod_starter"
    },
    growth: {
      id: "growth", 
      name: "Growth",
      description: "Ideal for growing companies scaling operations",
      setupFee: { min: 8000, max: 12500 },
      monthlyMRR: { min: 3200, max: 4400 },
      agents: { min: 3, max: 5 },
      features: [
        "3-5 AI Agents",
        "Advanced integrations",
        "Priority support", 
        "Custom workflows",
        "Real-time analytics",
        "CRM automation",
        "Team collaboration"
      ],
      popular: true,
      stripeProductId: "prod_growth"
    },
    expansion: {
      id: "expansion",
      name: "Expansion", 
      description: "For established businesses ready for full automation",
      setupFee: { min: 15000, max: 18000 },
      monthlyMRR: { min: 6000, max: 6000 },
      agents: { min: 6, max: 10 },
      features: [
        "6-10 AI Agents",
        "Enterprise integrations",
        "Dedicated support",
        "Custom agent creation", 
        "Advanced analytics",
        "Multi-location support",
        "API access",
        "White-label options"
      ],
      popular: false,
      stripeProductId: "prod_expansion"
    },
    enterprise: {
      id: "enterprise",
      name: "Enterprise",
      description: "Complete automation ecosystem for large organizations", 
      setupFee: { min: 21500, max: 50000 },
      monthlyMRR: { min: 8000, max: 15000 },
      agents: { min: 10, max: 999 },
      features: [
        "Unlimited AI Agents",
        "Custom integrations",
        "24/7 dedicated support",
        "Agent marketplace access",
        "Custom SŌL brain",
        "Enterprise security", 
        "Multi-tenant setup",
        "Custom contracts"
      ],
      popular: false,
      stripeProductId: "prod_enterprise"
    }
  },

  // Marketplace agents
  MARKETPLACE_AGENTS: {
    cash: {
      id: 1,
      name: "CA$H",
      role: "Sales Strategist",
      price: 750,
      category: "Sales",
      description: "AI sales agent specialized in lead qualification and conversion"
    },
    virgil: {
      id: 2, 
      name: "Virgil",
      role: "Brand Strategist",
      price: 650,
      category: "Content",
      description: "Creative brand architect and content strategy specialist"
    },
    maya: {
      id: 3,
      name: "Maya", 
      role: "HR Coordinator",
      price: 550,
      category: "Operations",
      description: "Human resources automation and team coordination"
    }
  }
};

// Utility functions for pricing calculations
export const PricingUtils = {
  calculateTierPrice: (tierId: string, isEarlyBird: boolean = false) => {
    const tier = PRICING_CONFIG.TIERS[tierId as keyof typeof PRICING_CONFIG.TIERS];
    if (!tier) return null;

    const baseSetup = (tier.setupFee.min + tier.setupFee.max) / 2;
    const monthlyMRR = (tier.monthlyMRR.min + tier.monthlyMRR.max) / 2;
    
    const earlyBirdDiscount = isEarlyBird ? baseSetup * PRICING_CONFIG.EARLY_BIRD.discount : 0;
    const discountedSetup = baseSetup - earlyBirdDiscount;

    return {
      baseSetup,
      discountedSetup,
      monthlyMRR,
      earlyBirdDiscount
    };
  },

  calculateDeposit: (setupFee: number, depositPercent: number) => {
    const depositAmount = (setupFee * depositPercent) / 100;
    const remainingBalance = setupFee - depositAmount;
    
    return {
      depositAmount,
      remainingBalance,
      depositPercent
    };
  },

  calculateROI: (hoursWeekly: number, hourlyRate: number, timeSavingsPercent: number, monthlyMRR: number) => {
    const currentMonthlyCost = hoursWeekly * hourlyRate * 4.33; // avg weeks per month
    const savedHours = hoursWeekly * (timeSavingsPercent / 100);
    const monthlySavings = savedHours * hourlyRate * 4.33;
    const netMonthlySavings = monthlySavings - monthlyMRR;
    const yearlyROI = ((netMonthlySavings * 12) / monthlyMRR) * 100;

    return {
      currentMonthlyCost,
      monthlySavings,
      netMonthlySavings,
      yearlyROI,
      savedHours
    };
  },

  getFinancingTerms: (amount: number) => {
    const monthlyPayment = (amount * (PRICING_CONFIG.FINANCING.apr / 12)) / 
      (1 - Math.pow(1 + (PRICING_CONFIG.FINANCING.apr / 12), -PRICING_CONFIG.FINANCING.termMonths));
    
    const totalPayment = monthlyPayment * PRICING_CONFIG.FINANCING.termMonths;
    const totalInterest = totalPayment - amount;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      apr: PRICING_CONFIG.FINANCING.apr,
      termMonths: PRICING_CONFIG.FINANCING.termMonths
    };
  }
};

export default PRICING_CONFIG;