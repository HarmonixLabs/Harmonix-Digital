import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Bot, 
  Globe, 
  Coins, 
  Rocket, 
  Crown, 
  ArrowLeft, 
  Check, 
  Star,
  Brain,
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

export default function ServicePricing() {
  const [paymentType, setPaymentType] = useState<'full' | 'split'>('full');

  const aiAgents = [
    {
      name: "Sales Agent",
      description: "Inbound/outbound calls, lead nurturing, booking, follow-up",
      features: ["24/7 Lead Engagement", "CRM Integration", "Call Analytics", "Automated Follow-up"],
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      name: "HR Agent",
      description: "Intern onboarding, SOP training, applicant screening, team support",
      features: ["Applicant Screening", "Onboarding Automation", "Training Delivery", "Performance Tracking"],
      icon: <Users className="w-6 h-6" />
    },
    {
      name: "Concierge Agent",
      description: "Customer support, internal + external knowledge base",
      features: ["24/7 Support", "Knowledge Base", "Ticket Routing", "Satisfaction Tracking"],
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      name: "Social Media Agent",
      description: "Trend research, content calendar, post scheduling, UGC prep",
      features: ["Content Planning", "Auto Scheduling", "Trend Analysis", "Engagement Tracking"],
      icon: <Star className="w-6 h-6" />
    }
  ];

  const webServices = [
    {
      name: "Landing Page (AI-Optimized)",
      price: 800,
      features: ["AI-optimized copy", "Conversion tracking", "Mobile responsive", "SEO ready"],
      addon: { name: "Workflow Automation", price: 2100 }
    },
    {
      name: "Standard Website (3-9 pages)",
      price: 4400,
      features: ["CRM integration", "CMS setup", "Chatbot included", "SEO optimization"],
      addons: ["Agent integrations", "Web3 features", "Content bundles", "Brand design"]
    },
    {
      name: "Custom Website (10+ pages)",
      price: "Custom Quote",
      features: ["Unlimited pages", "Custom functionality", "Enterprise features", "Priority support"],
      addons: ["Complex integrations", "Custom AI features", "Advanced analytics"]
    }
  ];

  const blockchainServices = [
    {
      name: "Base Project",
      price: 7500,
      features: ["Token/Coin creation", "Wallet integration", "Basic smart contracts"]
    },
    {
      name: "Custom Full-Stack Build",
      price: "15,000 - 50,000",
      features: ["NFT systems", "DAO governance", "DeFi protocols", "Web3 apps"]
    }
  ];

  const launchpadTiers = [
    {
      name: "Paid-in-Full",
      price: 15000,
      discount: 0,
      features: [
        "Web Platform Build",
        "AI Agent Setup (choose from digital team)",
        "Blockchain Integration (if relevant)",
        "SOP & Exit System Design",
        "90-day Support",
        "Client Acquisition System",
        "Training & Onboarding"
      ]
    },
    {
      name: "Financing Option",
      price: 18000,
      discount: 0,
      features: [
        "All Paid-in-Full features",
        "Flexible payment terms",
        "Extended support period",
        "Priority implementation"
      ]
    }
  ];

  const calculateAgentPricing = (basePrice: number, withSOP: boolean = false) => {
    const finalPrice = withSOP ? 18000 : basePrice;
    if (paymentType === 'full') {
      return {
        total: finalPrice,
        upfront: finalPrice,
        milestone1: 0,
        completion: 0
      };
    } else {
      const increased = Math.round(finalPrice * 1.17);
      return {
        total: increased,
        upfront: Math.round(increased * 0.5),
        milestone1: Math.round(increased * 0.25),
        completion: Math.round(increased * 0.25)
      };
    }
  };

  const agentPricing = calculateAgentPricing(12500);
  const agentPricingWithSOP = calculateAgentPricing(12500, true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-jadeForest/10 to-charcoalDeep/5">
      <div className="container max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-jadeForest hover:text-jadeForest/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-jadeForest mb-4">Service Pricing</h1>
            <p className="text-lg text-charcoalDeep/70 max-w-2xl mx-auto">
              Comprehensive AI automation solutions to Build, Automate, and scale your business
            </p>
          </div>
        </div>

        <Tabs defaultValue="ai-agents" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="ai-agents" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="web-design" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Web Design
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="launchpad" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              The Launchpad
            </TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="ai-agents" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-jadeForest mb-4">AI Agents - Digital Team Members</h2>
              <p className="text-charcoalDeep/70 max-w-3xl mx-auto">
                Your business, staffed by AI. Each agent is a full-time specialist designed to automate and optimize your operations.
              </p>
            </div>

            {/* Payment Type Selector */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-jadeForest">Choose Your Payment Option</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card 
                    className={`cursor-pointer transition-all ${paymentType === 'full' ? 'ring-2 ring-jadeForest bg-jadeForest/5' : 'hover:bg-jadeForest/5'}`}
                    onClick={() => setPaymentType('full')}
                  >
                    <CardContent className="p-6 text-center">
                      <Badge className="mb-3 bg-goldenSovereign text-charcoalDeep">30% Early Bird Discount</Badge>
                      <h3 className="text-xl font-bold text-jadeForest mb-2">Full Payment</h3>
                      <p className="text-charcoalDeep/70 text-sm">Pay upfront and save significantly</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-all ${paymentType === 'split' ? 'ring-2 ring-jadeForest bg-jadeForest/5' : 'hover:bg-jadeForest/5'}`}
                    onClick={() => setPaymentType('split')}
                  >
                    <CardContent className="p-6 text-center">
                      <Badge variant="outline" className="mb-3">+17% Total Cost</Badge>
                      <h3 className="text-xl font-bold text-jadeForest mb-2">Split Payment</h3>
                      <p className="text-charcoalDeep/70 text-sm">50% upfront, 25% at milestone 1, 25% at completion</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Agent Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Base Installation */}
              <Card className="bg-white/90 backdrop-blur-sm border-jadeForest/20">
                <CardHeader>
                  <CardTitle className="text-jadeForest flex items-center gap-2">
                    <Bot className="w-6 h-6" />
                    Base Installation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-jadeForest">
                      ${agentPricing.total.toLocaleString()}
                    </div>
                    <p className="text-sm text-charcoalDeep/70">per agent</p>
                  </div>
                  
                  {paymentType === 'split' && (
                    <div className="bg-jadeForest/5 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upfront:</span>
                        <span className="font-medium">${agentPricing.upfront.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Milestone 1:</span>
                        <span className="font-medium">${agentPricing.milestone1.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completion:</span>
                        <span className="font-medium">${agentPricing.completion.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Agent deployment and configuration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Basic CRM integration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Standard prompt tuning
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* With SOP Mapping */}
              <Card className="bg-white/90 backdrop-blur-sm border-goldenSovereign/30 relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-goldenSovereign text-charcoalDeep">
                  Recommended
                </Badge>
                <CardHeader>
                  <CardTitle className="text-jadeForest flex items-center gap-2">
                    <Brain className="w-6 h-6" />
                    With SOP Mapping & Customization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-jadeForest">
                      ${agentPricingWithSOP.total.toLocaleString()}
                    </div>
                    <p className="text-sm text-charcoalDeep/70">per agent</p>
                  </div>
                  
                  {paymentType === 'split' && (
                    <div className="bg-goldenSovereign/10 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upfront:</span>
                        <span className="font-medium">${agentPricingWithSOP.upfront.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Milestone 1:</span>
                        <span className="font-medium">${agentPricingWithSOP.milestone1.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completion:</span>
                        <span className="font-medium">${agentPricingWithSOP.completion.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Complete SOP mapping and integration
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Advanced customization and training
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                      <Check className="w-4 h-4 text-jadeForest" />
                      Priority support and fine-tuning
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Maintenance */}
            <Card className="bg-gradient-to-r from-jadeForest/5 to-goldenSovereign/5">
              <CardHeader>
                <CardTitle className="text-jadeForest text-center">Monthly Maintenance & Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-jadeForest mb-4">$300 - $1,000/month</div>
                <p className="text-charcoalDeep/70 mb-4">3-month minimum commitment</p>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-jadeForest" />
                    AI Model Updates
                  </div>
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-jadeForest" />
                    Prompt Tuning
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-jadeForest" />
                    Performance Reports
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-jadeForest" />
                    Priority Support
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Agents */}
            <div>
              <h3 className="text-2xl font-bold text-jadeForest mb-6 text-center">Available AI Agents</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {aiAgents.map((agent, index) => (
                  <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-jadeForest mb-3">{agent.icon}</div>
                      <h4 className="font-bold text-jadeForest mb-2">{agent.name}</h4>
                      <p className="text-sm text-charcoalDeep/70 mb-4">{agent.description}</p>
                      <div className="space-y-1">
                        {agent.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-charcoalDeep/60">
                            <Check className="w-3 h-3 text-jadeForest" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Web Design Tab */}
          <TabsContent value="web-design" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-jadeForest mb-4">Web Design & Automation Services</h2>
              <p className="text-charcoalDeep/70 max-w-3xl mx-auto">
                Professional web solutions integrated with AI agents and automation systems.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {webServices.map((service, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-jadeForest">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-charcoalDeep">
                      {typeof service.price === 'number' ? `$${service.price.toLocaleString()}` : service.price}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                          <Check className="w-4 h-4 text-jadeForest" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {service.addon && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-jadeForest mb-2">Add-on Available:</p>
                        <p className="text-sm text-charcoalDeep/70">
                          {service.addon.name}: +${service.addon.price.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {service.addons && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-jadeForest mb-2">Available Add-ons:</p>
                        <div className="space-y-1">
                          {service.addons.map((addon, idx) => (
                            <p key={idx} className="text-xs text-charcoalDeep/60">• {addon}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Monthly Maintenance */}
            <Card className="bg-gradient-to-r from-jadeForest/5 to-goldenSovereign/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-jadeForest mb-4 text-center">Monthly Web Maintenance</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="font-bold text-jadeForest mb-2">Standard</h4>
                    <div className="text-2xl font-bold text-charcoalDeep mb-2">$200 - $400/month</div>
                    <p className="text-sm text-charcoalDeep/70">3-month minimum</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-bold text-jadeForest mb-2">Advanced</h4>
                    <div className="text-2xl font-bold text-charcoalDeep mb-2">$500 - $1,200/month</div>
                    <p className="text-sm text-charcoalDeep/70">With agents or blockchain</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-jadeForest mb-4">Blockchain & Fintech Services</h2>
              <p className="text-charcoalDeep/70 max-w-3xl mx-auto">
                Cutting-edge blockchain solutions including tokens, NFTs, smart contracts, and Web3 applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {blockchainServices.map((service, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-jadeForest">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-charcoalDeep">
                      {typeof service.price === 'number' ? `$${service.price.toLocaleString()}+` : `$${service.price}`}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                          <Check className="w-4 h-4 text-jadeForest" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Monthly Maintenance */}
            <Card className="bg-gradient-to-r from-jadeForest/5 to-goldenSovereign/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-jadeForest mb-4">Monthly Blockchain Maintenance</h3>
                <div className="text-2xl font-bold text-charcoalDeep mb-2">$1,000 - $2,500/month</div>
                <p className="text-charcoalDeep/70">Includes development updates, security monitoring, and performance optimization</p>
              </CardContent>
            </Card>

            {/* Services Offered */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-jadeForest">Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-bold text-jadeForest text-sm">Token/Coin Creation</h4>
                    <p className="text-xs text-charcoalDeep/70">Custom tokenomics and smart contracts</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-jadeForest text-sm">NFT Systems</h4>
                    <p className="text-xs text-charcoalDeep/70">Minting, trading, and marketplace solutions</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-jadeForest text-sm">DAO Governance</h4>
                    <p className="text-xs text-charcoalDeep/70">Decentralized organization tools</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* The Launchpad Tab */}
          <TabsContent value="launchpad" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-jadeForest mb-4">The Launchpad</h2>
              <p className="text-charcoalDeep/70 max-w-3xl mx-auto">
                Incubator program for founders ready to scale and exit. Complete AI-enhanced platform, SOPs, and exit preparation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {launchpadTiers.map((tier, index) => (
                <Card key={index} className={`bg-white/90 backdrop-blur-sm ${index === 0 ? 'border-goldenSovereign/30' : 'border-jadeForest/20'}`}>
                  <CardHeader>
                    <CardTitle className="text-jadeForest flex items-center gap-2">
                      <Crown className="w-6 h-6" />
                      {tier.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-charcoalDeep">
                      ${tier.price.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-charcoalDeep/70">
                          <Check className="w-4 h-4 text-jadeForest" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* What's Included */}
            <Card className="bg-gradient-to-r from-jadeForest/5 to-goldenSovereign/5">
              <CardHeader>
                <CardTitle className="text-jadeForest text-center">What's Included in The Launchpad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                    <h4 className="font-bold text-jadeForest text-sm mb-1">Web Platform</h4>
                    <p className="text-xs text-charcoalDeep/70">Complete build if needed</p>
                  </div>
                  <div className="text-center">
                    <Bot className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                    <h4 className="font-bold text-jadeForest text-sm mb-1">AI Agent Setup</h4>
                    <p className="text-xs text-charcoalDeep/70">Choose from digital team</p>
                  </div>
                  <div className="text-center">
                    <Coins className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                    <h4 className="font-bold text-jadeForest text-sm mb-1">Blockchain Integration</h4>
                    <p className="text-xs text-charcoalDeep/70">If relevant to business</p>
                  </div>
                  <div className="text-center">
                    <Rocket className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                    <h4 className="font-bold text-jadeForest text-sm mb-1">Exit Preparation</h4>
                    <p className="text-xs text-charcoalDeep/70">SOP & scale systems</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-jadeForest to-goldenSovereign text-white mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="mb-6 opacity-90">
              Get started with AI agents and automation solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-jadeForest hover:bg-white/90">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Try Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}