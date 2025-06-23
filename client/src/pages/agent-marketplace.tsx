import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  DollarSign, 
  Users, 
  MessageCircle, 
  Brain, 
  Briefcase, 
  TrendingUp,
  Shield,
  FileText,
  Calendar,
  BarChart,
  Zap,
  Star,
  Clock
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  pricing: {
    base: number;
    custom: number;
    maintenance: number;
  };
  features: string[];
  rating: number;
  deployments: number;
  setupTime: string;
  tags: string[];
}

export default function AgentMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const agents: Agent[] = [
    {
      id: "cashflow",
      name: "CA$HFLOW Sales Agent",
      description: "Complete lead-to-close automation with intelligent qualification, follow-up sequences, and CRM integration",
      icon: DollarSign,
      category: "Sales",
      pricing: { base: 12500, custom: 18000, maintenance: 800 },
      features: ["Lead Scoring", "Automated Follow-up", "CRM Integration", "Pipeline Management", "ROI Tracking"],
      rating: 4.9,
      deployments: 247,
      setupTime: "2-3 weeks",
      tags: ["bestseller", "high-roi", "proven"]
    },
    {
      id: "concierge",
      name: "Concierge Agent",
      description: "24/7 customer support automation with intelligent triage, knowledge base management, and seamless human handoff",
      icon: MessageCircle,
      category: "Customer Service",
      pricing: { base: 10000, custom: 15000, maintenance: 600 },
      features: ["24/7 Support", "Smart Triage", "Knowledge Base", "Escalation Management", "Multi-channel"],
      rating: 4.8,
      deployments: 189,
      setupTime: "1-2 weeks",
      tags: ["popular", "customer-favorite"]
    },
    {
      id: "executive-assistant",
      name: "Executive Assistant",
      description: "High-level administrative automation including calendar management, email prioritization, and strategic task coordination",
      icon: Briefcase,
      category: "Operations",
      pricing: { base: 11000, custom: 16500, maintenance: 700 },
      features: ["Calendar Management", "Email Prioritization", "Meeting Coordination", "Task Delegation", "Executive Reporting"],
      rating: 4.7,
      deployments: 156,
      setupTime: "2-3 weeks",
      tags: ["executive-grade", "time-saver"]
    },
    {
      id: "hr-agent",
      name: "HR Agent",
      description: "Complete human resources automation from recruitment and onboarding to performance management and compliance",
      icon: Users,
      category: "Human Resources",
      pricing: { base: 13000, custom: 19000, maintenance: 900 },
      features: ["Recruitment Automation", "Onboarding Workflows", "Performance Tracking", "Compliance Management", "Employee Insights"],
      rating: 4.6,
      deployments: 134,
      setupTime: "3-4 weeks",
      tags: ["compliance-ready", "scalable"]
    },
    {
      id: "social-media",
      name: "Social Media Agent",
      description: "Intelligent social media management with content creation, posting automation, and engagement optimization",
      icon: TrendingUp,
      category: "Marketing",
      pricing: { base: 9500, custom: 14000, maintenance: 550 },
      features: ["Content Creation", "Auto-posting", "Engagement Management", "Analytics", "Multi-platform"],
      rating: 4.5,
      deployments: 203,
      setupTime: "1-2 weeks",
      tags: ["creative", "growth-focused"]
    },
    {
      id: "project-manager",
      name: "Project Manager Agent",
      description: "Advanced project coordination with resource optimization, timeline prediction, and cross-team communication",
      icon: Calendar,
      category: "Operations",
      pricing: { base: 12000, custom: 17500, maintenance: 750 },
      features: ["Resource Planning", "Timeline Optimization", "Team Coordination", "Progress Tracking", "Risk Assessment"],
      rating: 4.8,
      deployments: 167,
      setupTime: "2-4 weeks",
      tags: ["enterprise-ready", "productivity"]
    },
    {
      id: "finance-agent",
      name: "Finance Agent",
      description: "Comprehensive financial management including budgeting, forecasting, expense tracking, and compliance reporting",
      icon: BarChart,
      category: "Finance",
      pricing: { base: 14000, custom: 20000, maintenance: 1000 },
      features: ["Budget Management", "Financial Forecasting", "Expense Automation", "Compliance Reporting", "Cash Flow Analysis"],
      rating: 4.7,
      deployments: 98,
      setupTime: "3-5 weeks",
      tags: ["financial-grade", "compliance"]
    },
    {
      id: "legal-compliance",
      name: "Legal & Compliance Agent",
      description: "Automated legal document management, compliance monitoring, and risk assessment for regulatory requirements",
      icon: Shield,
      category: "Legal",
      pricing: { base: 15000, custom: 22000, maintenance: 1100 },
      features: ["Document Management", "Compliance Monitoring", "Risk Assessment", "Regulatory Updates", "Contract Analysis"],
      rating: 4.6,
      deployments: 76,
      setupTime: "4-6 weeks",
      tags: ["legal-grade", "security-focused"]
    },
    {
      id: "content-creator",
      name: "Content Creation Agent",
      description: "AI-powered content generation for blogs, marketing materials, social media, and technical documentation",
      icon: FileText,
      category: "Marketing",
      pricing: { base: 8500, custom: 13000, maintenance: 500 },
      features: ["Blog Writing", "Marketing Copy", "Social Content", "Technical Docs", "SEO Optimization"],
      rating: 4.4,
      deployments: 312,
      setupTime: "1 week",
      tags: ["fast-setup", "creative", "volume"]
    }
  ];

  const categories = ["all", "Sales", "Marketing", "Operations", "Customer Service", "Human Resources", "Finance", "Legal"];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.deployments - a.deployments;
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.pricing.base - b.pricing.base;
      case "price-high":
        return b.pricing.base - a.pricing.base;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            <HarmonixLogo size="lg" variant="gold" className="justify-center mb-6" />
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
                Agent <span className="text-harmony-gold">Marketplace</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Discover and deploy specialized AI agents designed for every aspect of your business. 
                From sales automation to compliance management, build your intelligent team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search agents by name, feature, or capability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white focus:border-harmony-gold"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-400 mb-6">
            Showing {sortedAgents.length} of {agents.length} agents
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAgents.map((agent) => (
              <Card key={agent.id} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-harmony-gold/10 flex items-center justify-center">
                        <agent.icon className="h-6 w-6 text-harmony-gold" />
                      </div>
                      <div>
                        <Badge className="bg-harmony-green/20 text-harmony-green border-harmony-green/30 mb-1">
                          {agent.category}
                        </Badge>
                        {agent.tags.includes("bestseller") && (
                          <Badge className="bg-harmony-gold/20 text-harmony-gold border-harmony-gold/30 ml-1">
                            Bestseller
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-harmony-gold fill-current" />
                      <span className="text-sm font-semibold text-harmony-gold">{agent.rating}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-harmony-gold font-serif text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Key Features:</h4>
                    <div className="space-y-1">
                      {agent.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Zap className="w-3 h-3 text-harmony-gold" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {agent.features.length > 3 && (
                        <div className="text-sm text-gray-400">
                          +{agent.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="text-harmony-gold font-semibold">{agent.deployments}</div>
                      <div className="text-gray-400">Deployments</div>
                    </div>
                    <div>
                      <div className="text-harmony-gold font-semibold">{agent.setupTime}</div>
                      <div className="text-gray-400">Setup Time</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Base Installation:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Custom Setup:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.custom.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Monthly Maintenance:</span>
                      <span className="text-harmony-gold font-semibold">${agent.pricing.maintenance}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                      Deploy Agent
                    </Button>
                    <Button variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <Brain className="w-16 h-16 text-harmony-gold mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white font-serif mb-4">
              Need a Custom Agent Solution?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our SŌL brain can orchestrate multiple agents or create entirely custom solutions 
              for your unique business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90">
                  Request Custom Solution
                </Button>
              </Link>
              <Link href="/demo-deploy">
                <Button size="lg" variant="outline" className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10">
                  Try Demo First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}