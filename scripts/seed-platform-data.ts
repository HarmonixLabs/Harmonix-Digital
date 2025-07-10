import { db } from "../server/db.js";
import { platformServices, platformFeatures, successMetrics } from "../shared/schema.js";

const platformData = {
  services: [
    {
      name: "AI Agent Development",
      category: "ai-agents",
      description: "Custom AI agents for sales, customer service, operations, and specialized business functions",
      features: [
        "6 flagship agents (Sales, Concierge, HR, Social Media, Executive Assistant, Project Manager)",
        "Custom prompt engineering and training",
        "Multi-platform integration (CRM, email, chat, phone)",
        "Real-time performance analytics",
        "Continuous learning and optimization",
        "SŌL brain orchestration system"
      ],
      pricing: {
        fullPayment: 4400,
        splitPayment: 5148
      },
      benefits: [
        "24/7 automated operations",
        "300% increase in lead response time",
        "85% reduction in routine task overhead",
        "Seamless integration with existing workflows",
        "Scalable AI workforce"
      ],
      targetAudience: "Small to medium businesses looking to automate operations and scale efficiently",
      deliveryTime: "2-4 weeks",
      requirements: [
        "Access to existing CRM/business systems",
        "Clear definition of business processes to automate",
        "Team training on AI agent management"
      ]
    },
    {
      name: "Web Design & Automation",
      category: "web-design",
      description: "AI-optimized websites with integrated automation and lead capture systems",
      features: [
        "Landing page optimization",
        "Multi-page website development",
        "Integrated CRM and automation",
        "Mobile-responsive design",
        "SEO optimization",
        "Analytics dashboard"
      ],
      pricing: {
        fullPayment: 4400,
        splitPayment: 5148
      },
      benefits: [
        "40% higher conversion rates",
        "Automated lead capture and nurturing",
        "Professional brand presence",
        "Mobile-optimized for modern users"
      ],
      targetAudience: "Businesses needing professional web presence with automation capabilities",
      deliveryTime: "1-3 weeks",
      requirements: [
        "Brand assets and content",
        "Target audience definition",
        "Business goals and metrics"
      ]
    },
    {
      name: "The Launchpad Incubator",
      category: "launchpad",
      description: "90-day intensive program for business growth with AI integration and client acquisition systems",
      features: [
        "90-day guided program",
        "AI agent implementation",
        "Client acquisition system",
        "Business strategy development",
        "Weekly coaching sessions",
        "Community access"
      ],
      pricing: {
        fullPayment: 15000,
        splitPayment: 18000
      },
      benefits: [
        "Structured business growth plan",
        "Direct access to AI automation expertise",
        "Proven client acquisition methods",
        "Ongoing support and community"
      ],
      targetAudience: "Entrepreneurs and small businesses ready for rapid scaling",
      deliveryTime: "90 days",
      requirements: [
        "Commitment to 90-day program",
        "Existing business foundation",
        "Willingness to implement AI solutions"
      ]
    },
    {
      name: "AI Advisory Council",
      category: "advisory",
      description: "Ongoing strategic AI consultation and optimization services",
      features: [
        "Monthly strategy sessions",
        "AI implementation guidance",
        "Performance optimization",
        "Industry trend analysis",
        "Custom solution development",
        "Priority support"
      ],
      pricing: {
        fullPayment: 497,
        splitPayment: 497,
        monthly: 497
      },
      benefits: [
        "Expert AI strategy guidance",
        "Continuous optimization",
        "Industry insights and trends",
        "Custom solution development"
      ],
      targetAudience: "Established businesses looking for ongoing AI strategy and optimization",
      deliveryTime: "Ongoing monthly",
      requirements: [
        "Existing business operations",
        "Commitment to monthly engagement",
        "Openness to AI transformation"
      ]
    }
  ],
  features: [
    {
      name: "Agent Marketplace",
      category: "agent-marketplace",
      description: "Browse and deploy specialized AI agents for different business functions",
      howItHelps: "Access pre-built, tested AI agents that can be deployed instantly to handle specific business tasks, reducing development time and ensuring proven performance",
      examples: [
        "Deploy CA$H sales agent in 5 minutes",
        "Add GRACE customer service agent to existing support",
        "Scale operations with specialized workflow agents"
      ],
      integrations: ["Stripe", "GoHighLevel CRM", "OpenAI", "Webhook systems"]
    },
    {
      name: "SŌL Brain Orchestration",
      category: "ai-orchestration",
      description: "Central AI brain that coordinates multiple agents and optimizes workflows",
      howItHelps: "Ensures your AI agents work together seamlessly, preventing conflicts and optimizing resource allocation across your entire AI workforce",
      examples: [
        "Route customer inquiries to appropriate agents",
        "Coordinate sales and fulfillment processes",
        "Optimize agent performance based on real-time data"
      ],
      integrations: ["All platform agents", "Business intelligence tools", "Analytics dashboards"]
    },
    {
      name: "Real-time Analytics",
      category: "analytics",
      description: "Comprehensive dashboard showing agent performance, ROI, and business metrics",
      howItHelps: "Track the impact of your AI agents with detailed metrics, enabling data-driven decisions and continuous optimization",
      examples: [
        "Monitor lead conversion rates in real-time",
        "Track agent efficiency and cost savings",
        "Identify optimization opportunities"
      ],
      integrations: ["Google Analytics", "Business intelligence tools", "CRM systems"]
    },
    {
      name: "One-Click Deployment",
      category: "deployment",
      description: "Deploy agents instantly with pre-configured integrations and workflows",
      howItHelps: "Get started immediately without technical setup, allowing you to realize value from AI agents within minutes",
      examples: [
        "Deploy sales agent with CRM integration in 1 click",
        "Add customer service automation instantly",
        "Scale operations without technical delays"
      ],
      integrations: ["All major CRM systems", "Communication platforms", "Business tools"]
    }
  ],
  metrics: [
    {
      metricName: "Lead Response Time",
      value: "300% faster",
      description: "AI agents respond to leads within seconds instead of hours or days",
      industry: "Sales",
      timePeriod: "monthly"
    },
    {
      metricName: "Operational Efficiency",
      value: "85% reduction",
      description: "Dramatic reduction in time spent on routine tasks and administrative work",
      industry: "Operations",
      timePeriod: "quarterly"
    },
    {
      metricName: "Customer Satisfaction",
      value: "94% rating",
      description: "High customer satisfaction scores from consistent, intelligent service",
      industry: "Customer Service",
      timePeriod: "monthly"
    },
    {
      metricName: "Revenue Growth",
      value: "150% increase",
      description: "Average revenue growth for businesses implementing full AI agent suite",
      industry: "General",
      timePeriod: "annually"
    },
    {
      metricName: "Cost Savings",
      value: "$50,000+ saved",
      description: "Annual savings from automation and improved efficiency",
      industry: "Enterprise",
      timePeriod: "annually"
    }
  ]
};

async function seedPlatformData() {
  try {
    console.log("Starting platform data seeding...");

    // Clear existing data
    await db.delete(successMetrics);
    await db.delete(platformFeatures);
    await db.delete(platformServices);

    // Insert services
    for (const service of platformData.services) {
      await db.insert(platformServices).values(service);
    }
    console.log(`Inserted ${platformData.services.length} platform services`);

    // Insert features
    for (const feature of platformData.features) {
      await db.insert(platformFeatures).values(feature);
    }
    console.log(`Inserted ${platformData.features.length} platform features`);

    // Insert metrics
    for (const metric of platformData.metrics) {
      await db.insert(successMetrics).values(metric);
    }
    console.log(`Inserted ${platformData.metrics.length} success metrics`);

    console.log("Platform data seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding platform data:", error);
    throw error;
  }
}

// Run seeding if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPlatformData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { seedPlatformData };