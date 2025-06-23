import { 
  Users, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  ShoppingCart, 
  Stethoscope,
  GraduationCap,
  Home,
  Wrench,
  PiggyBank,
  Scales,
  Zap
} from "lucide-react";

export interface DemoScenario {
  id: string;
  title: string;
  industry: string;
  description: string;
  useCase: string;
  agents: string[];
  expectedOutcomes: string[];
  demoData: {
    leadVolume: number;
    conversionRate: number;
    timeSaved: number;
    roiIncrease: number;
  };
  duration: number;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  icon: any;
  category: 'sales' | 'operations' | 'customer-service' | 'marketing' | 'enterprise';
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'saas-sales-automation',
    title: 'SaaS Sales Pipeline Automation',
    industry: 'SaaS / Technology',
    description: 'Automate lead qualification, follow-ups, and conversion tracking for a growing SaaS company with 50+ daily leads.',
    useCase: 'Transform raw website leads into qualified prospects with personalized outreach and intelligent scoring.',
    agents: ['Agent CA$H', 'Concierge Agent', 'Content Creation Agent'],
    expectedOutcomes: [
      'Increased lead conversion by 45%',
      'Reduced sales cycle by 8 days',
      'Automated 80% of initial outreach',
      'Improved lead scoring accuracy'
    ],
    demoData: {
      leadVolume: 127,
      conversionRate: 45,
      timeSaved: 32,
      roiIncrease: 180
    },
    duration: 12,
    complexity: 'Intermediate',
    icon: TrendingUp,
    category: 'sales'
  },
  {
    id: 'ecommerce-customer-service',
    title: 'E-commerce Customer Support',
    industry: 'E-commerce / Retail',
    description: 'Handle customer inquiries, process returns, and provide product recommendations with AI-powered support.',
    useCase: 'Provide 24/7 customer support with instant response times and personalized product recommendations.',
    agents: ['Concierge Agent', 'Agent CA$H', 'Content Creation Agent'],
    expectedOutcomes: [
      'Reduced response time to under 30 seconds',
      'Increased customer satisfaction by 35%',
      'Automated 75% of support tickets',
      'Generated additional $15K in upsells'
    ],
    demoData: {
      leadVolume: 89,
      conversionRate: 35,
      timeSaved: 24,
      roiIncrease: 125
    },
    duration: 8,
    complexity: 'Simple',
    icon: ShoppingCart,
    category: 'customer-service'
  },
  {
    id: 'real-estate-lead-generation',
    title: 'Real Estate Lead Generation',
    industry: 'Real Estate',
    description: 'Capture and nurture property leads with automated valuations, market insights, and personalized follow-ups.',
    useCase: 'Convert website visitors into qualified leads with instant property valuations and market analysis.',
    agents: ['Agent CA$H', 'Content Creation Agent', 'Social Media Agent'],
    expectedOutcomes: [
      'Generated 200+ qualified leads monthly',
      'Increased listing appointments by 60%',
      'Automated market analysis reports',
      'Improved client engagement by 90%'
    ],
    demoData: {
      leadVolume: 234,
      conversionRate: 60,
      timeSaved: 18,
      roiIncrease: 220
    },
    duration: 10,
    complexity: 'Intermediate',
    icon: Home,
    category: 'sales'
  },
  {
    id: 'consulting-proposal-automation',
    title: 'Consulting Proposal Automation',
    industry: 'Professional Services',
    description: 'Streamline proposal creation, client onboarding, and project management for consulting firms.',
    useCase: 'Generate custom proposals, automate client communication, and track project deliverables efficiently.',
    agents: ['Executive Assistant', 'Content Creation Agent', 'Project Manager Agent'],
    expectedOutcomes: [
      'Reduced proposal creation time by 70%',
      'Increased win rate by 25%',
      'Automated client onboarding process',
      'Improved project delivery tracking'
    ],
    demoData: {
      leadVolume: 45,
      conversionRate: 25,
      timeSaved: 40,
      roiIncrease: 165
    },
    duration: 15,
    complexity: 'Advanced',
    icon: Briefcase,
    category: 'operations'
  },
  {
    id: 'healthcare-appointment-management',
    title: 'Healthcare Appointment Management',
    industry: 'Healthcare',
    description: 'Manage patient appointments, send reminders, and handle insurance verification automatically.',
    useCase: 'Reduce no-shows, streamline scheduling, and improve patient communication with automated workflows.',
    agents: ['Concierge Agent', 'Booking Agent', 'HR Agent'],
    expectedOutcomes: [
      'Reduced no-shows by 50%',
      'Automated 90% of appointment confirmations',
      'Improved patient satisfaction scores',
      'Streamlined insurance verification'
    ],
    demoData: {
      leadVolume: 156,
      conversionRate: 50,
      timeSaved: 28,
      roiIncrease: 140
    },
    duration: 9,
    complexity: 'Intermediate',
    icon: Stethoscope,
    category: 'operations'
  },
  {
    id: 'startup-growth-acceleration',
    title: 'Startup Growth Acceleration',
    industry: 'Startup / Early Stage',
    description: 'Bootstrap growth with automated marketing, sales processes, and operational efficiency for resource-constrained startups.',
    useCase: 'Maximize growth potential with minimal resources through intelligent automation and AI-driven insights.',
    agents: ['Agent CA$H', 'Social Media Agent', 'Content Creation Agent', 'Executive Assistant'],
    expectedOutcomes: [
      'Increased monthly recurring revenue by 150%',
      'Automated entire marketing funnel',
      'Reduced operational overhead by 60%',
      'Accelerated product-market fit validation'
    ],
    demoData: {
      leadVolume: 89,
      conversionRate: 65,
      timeSaved: 45,
      roiIncrease: 280
    },
    duration: 18,
    complexity: 'Advanced',
    icon: Zap,
    category: 'enterprise'
  },
  {
    id: 'enterprise-hr-automation',
    title: 'Enterprise HR Automation',
    industry: 'Enterprise / Corporate',
    description: 'Automate recruitment, onboarding, performance tracking, and employee engagement for large organizations.',
    useCase: 'Scale HR operations efficiently while maintaining personalized employee experiences and compliance.',
    agents: ['HR Agent', 'Executive Assistant', 'Content Creation Agent'],
    expectedOutcomes: [
      'Reduced time-to-hire by 40%',
      'Automated 80% of onboarding tasks',
      'Improved employee satisfaction by 30%',
      'Streamlined performance review process'
    ],
    demoData: {
      leadVolume: 67,
      conversionRate: 40,
      timeSaved: 35,
      roiIncrease: 190
    },
    duration: 14,
    complexity: 'Advanced',
    icon: Users,
    category: 'operations'
  },
  {
    id: 'financial-services-compliance',
    title: 'Financial Services Compliance',
    industry: 'Financial Services',
    description: 'Automate compliance monitoring, risk assessment, and regulatory reporting for financial institutions.',
    useCase: 'Ensure regulatory compliance while reducing manual oversight and improving risk detection accuracy.',
    agents: ['Legal/Compliance Agent', 'Analyst Agent', 'Executive Assistant'],
    expectedOutcomes: [
      'Automated 95% of compliance checks',
      'Reduced regulatory risk by 70%',
      'Improved audit preparation time',
      'Enhanced fraud detection capabilities'
    ],
    demoData: {
      leadVolume: 23,
      conversionRate: 85,
      timeSaved: 52,
      roiIncrease: 245
    },
    duration: 16,
    complexity: 'Advanced',
    icon: PiggyBank,
    category: 'enterprise'
  }
];

export const getDemoScenariosByCategory = (category: string) => {
  return demoScenarios.filter(scenario => scenario.category === category);
};

export const getDemoScenarioById = (id: string) => {
  return demoScenarios.find(scenario => scenario.id === id);
};

export const getFeaturedDemoScenarios = () => {
  return demoScenarios.filter(scenario => 
    ['saas-sales-automation', 'ecommerce-customer-service', 'startup-growth-acceleration'].includes(scenario.id)
  );
};