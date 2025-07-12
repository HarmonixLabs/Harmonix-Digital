import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  DollarSign, 
  Zap, 
  Shield, 
  TrendingUp,
  Clock,
  Check,
  Sparkles,
  Crown,
  Bot,
  Brain,
  MessageSquare,
  BarChart,
  Target,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  Globe,
  ShoppingCart,
  CreditCard,
  Play
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: string;
  oneTimePrice: number;
  monthlyPrice: number;
  setupPrice: number;
  rating: number;
  reviews: number;
  deployments: number;
  features: string[];
  creator: {
    name: string;
    verified: boolean;
    avatar: string;
  };
  tags: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  nftPrice?: number;
  royaltyPercentage?: number;
  available?: boolean;
  integrations: string[];
  useCases: string[];
}

const MARKETPLACE_AGENTS: Agent[] = [
  {
    id: 'cash-flow-king',
    name: 'CA$H - Sales Agent',
    avatar: '💰',
    description: 'Elite sales automation agent that transforms leads into revenue with advanced CRM integration and personalized outreach.',
    category: 'Sales',
    oneTimePrice: 2499,
    monthlyPrice: 297,
    setupPrice: 199,
    rating: 4.9,
    reviews: 247,
    deployments: 1834,
    rarity: 'legendary',
    features: [
      'Advanced Lead Scoring',
      'Automated Follow-up Sequences',
      'CRM Integration (GoHighLevel, HubSpot)',
      'Revenue Analytics Dashboard',
      'Custom Sales Scripts',
      'A/B Testing Capabilities'
    ],
    creator: {
      name: 'Harmonix Core Team',
      verified: true,
      avatar: '🏆'
    },
    tags: ['Revenue', 'Automation', 'CRM', 'Analytics'],
    nftPrice: 4999,
    royaltyPercentage: 15,
    available: true,
    integrations: ['Stripe', 'GoHighLevel', 'HubSpot', 'Salesforce'],
    useCases: ['Lead Generation', 'Sales Automation', 'Revenue Optimization', 'Customer Onboarding']
  },
  {
    id: 'grace-concierge',
    name: 'GRACE - Customer Success',
    avatar: '🌟',
    description: 'Premium customer experience agent that handles support, onboarding, and retention with emotional intelligence.',
    category: 'Customer Support',
    oneTimePrice: 1999,
    monthlyPrice: 247,
    setupPrice: 149,
    rating: 4.8,
    reviews: 189,
    deployments: 1245,
    rarity: 'epic',
    features: [
      'Sentiment Analysis',
      'Multi-channel Support',
      'Customer Journey Mapping',
      'Retention Analytics',
      'Escalation Management',
      '24/7 Availability'
    ],
    creator: {
      name: 'Harmonix Core Team',
      verified: true,
      avatar: '🏆'
    },
    tags: ['Support', 'Retention', 'Experience', 'Analytics'],
    nftPrice: 3499,
    royaltyPercentage: 12,
    available: true,
    integrations: ['Zendesk', 'Intercom', 'Slack', 'Teams'],
    useCases: ['Customer Support', 'Onboarding', 'Retention', 'Feedback Collection']
  },
  {
    id: 'echo-content',
    name: 'ECHO - Content Creator',
    avatar: '✍️',
    description: 'Creative content generation agent specializing in brand-aligned marketing materials and social media content.',
    category: 'Marketing',
    oneTimePrice: 1799,
    monthlyPrice: 197,
    setupPrice: 99,
    rating: 4.7,
    reviews: 156,
    deployments: 892,
    rarity: 'rare',
    features: [
      'Brand Voice Analysis',
      'Multi-format Content',
      'SEO Optimization',
      'Social Media Scheduling',
      'Content Calendar',
      'Performance Tracking'
    ],
    creator: {
      name: 'Content Labs',
      verified: true,
      avatar: '📝'
    },
    tags: ['Content', 'Marketing', 'SEO', 'Social'],
    nftPrice: 2999,
    royaltyPercentage: 10,
    available: true,
    integrations: ['WordPress', 'Buffer', 'Hootsuite', 'Canva'],
    useCases: ['Content Creation', 'Social Media', 'SEO', 'Brand Marketing']
  },
  {
    id: 'flow-operations',
    name: 'FLOW - Operations Manager',
    avatar: '⚙️',
    description: 'Workflow optimization agent that streamlines business processes and automates repetitive tasks.',
    category: 'Operations',
    oneTimePrice: 2199,
    monthlyPrice: 267,
    setupPrice: 179,
    rating: 4.8,
    reviews: 203,
    deployments: 1567,
    rarity: 'epic',
    features: [
      'Process Automation',
      'Workflow Design',
      'Task Management',
      'Resource Optimization',
      'Performance Monitoring',
      'Integration Management'
    ],
    creator: {
      name: 'Harmonix Core Team',
      verified: true,
      avatar: '🏆'
    },
    tags: ['Automation', 'Efficiency', 'Processes', 'Management'],
    nftPrice: 3799,
    royaltyPercentage: 14,
    available: true,
    integrations: ['Zapier', 'Notion', 'Airtable', 'Monday.com'],
    useCases: ['Process Automation', 'Task Management', 'Workflow Design', 'Efficiency Optimization']
  },
  {
    id: 'kairos-analytics',
    name: 'KAIROS - Data Analyst',
    avatar: '📊',
    description: 'Advanced analytics agent that transforms raw data into actionable business insights and strategic recommendations.',
    category: 'Analytics',
    oneTimePrice: 2399,
    monthlyPrice: 287,
    setupPrice: 199,
    rating: 4.9,
    reviews: 178,
    deployments: 734,
    rarity: 'legendary',
    features: [
      'Predictive Analytics',
      'Real-time Dashboards',
      'Custom Reports',
      'Data Visualization',
      'Trend Analysis',
      'Automated Insights'
    ],
    creator: {
      name: 'Analytics Pro',
      verified: true,
      avatar: '📈'
    },
    tags: ['Analytics', 'Insights', 'Data', 'Reporting'],
    nftPrice: 4299,
    royaltyPercentage: 16,
    available: true,
    integrations: ['Google Analytics', 'Tableau', 'Power BI', 'Mixpanel'],
    useCases: ['Business Intelligence', 'Performance Tracking', 'Predictive Analysis', 'Strategic Planning']
  },
  {
    id: 'sol-orchestrator',
    name: 'SŌL - AI Orchestrator',
    avatar: '🧠',
    description: 'Master AI agent that coordinates and optimizes the performance of all other agents in your digital ecosystem.',
    category: 'AI Management',
    oneTimePrice: 3999,
    monthlyPrice: 497,
    setupPrice: 299,
    rating: 5.0,
    reviews: 89,
    deployments: 456,
    rarity: 'legendary',
    features: [
      'Agent Coordination',
      'Performance Optimization',
      'Intelligent Routing',
      'Resource Allocation',
      'Strategic Planning',
      'Ecosystem Monitoring'
    ],
    creator: {
      name: 'Harmonix Core Team',
      verified: true,
      avatar: '🏆'
    },
    tags: ['AI', 'Orchestration', 'Strategy', 'Optimization'],
    nftPrice: 7999,
    royaltyPercentage: 20,
    available: true,
    integrations: ['All Harmonix Agents', 'OpenAI', 'Claude', 'Custom APIs'],
    useCases: ['AI Strategy', 'Agent Management', 'Performance Optimization', 'Ecosystem Coordination']
  }
];

interface PurchaseModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

function PurchaseModal({ agent, isOpen, onClose }: PurchaseModalProps) {
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('subscription');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const createCheckoutMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/stripe/create-subscription', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Checkout Created",
        description: "Redirecting to payment...",
      });
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create checkout. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handlePurchase = () => {
    const checkoutData = {
      agentId: agent.id,
      tier: 'individual_agent',
      subscriptionTier: 'monthly',
      purchaseType
    };
    
    createCheckoutMutation.mutate(checkoutData);
  };

  const handleTryDemo = () => {
    setLocation(`/demo?agent=${agent.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{agent.avatar}</span>
            <div>
              <h3 className="text-xl font-bold">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Agent Details */}
          <div>
            <h4 className="font-semibold mb-2">About This Agent</h4>
            <p className="text-gray-600">{agent.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{agent.rating}</span>
              </div>
              <p className="text-xs text-gray-600">{agent.reviews} reviews</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span className="font-semibold">{agent.deployments}</span>
              </div>
              <p className="text-xs text-gray-600">deployments</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Crown className="w-4 h-4 text-purple-500 mr-1" />
                <span className="font-semibold capitalize">{agent.rarity}</span>
              </div>
              <p className="text-xs text-gray-600">rarity</p>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-3">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {agent.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="font-semibold mb-3">Integrations</h4>
            <div className="flex flex-wrap gap-2">
              {agent.integrations.map((integration, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {integration}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Pricing Options</h4>
            <Tabs value={purchaseType} onValueChange={(value: any) => setPurchaseType(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="one-time">One-Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscription" className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${agent.monthlyPrice}/month
                  </div>
                  <p className="text-sm text-gray-600">Includes updates & support</p>
                </div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Monthly updates & improvements
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Priority customer support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Cancel anytime
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="one-time" className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${agent.oneTimePrice}
                  </div>
                  <div className="text-sm text-gray-600">
                    + ${agent.setupPrice} setup fee
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Lifetime access to current version
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    6 months of updates included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Community support access
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleTryDemo}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Try Demo
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={createCheckoutMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {createCheckoutMutation.isPending ? 'Processing...' : 'Purchase Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EnhancedMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
  const { user } = useAuth();

  const categories = ['all', 'Sales', 'Customer Support', 'Marketing', 'Operations', 'Analytics', 'AI Management'];
  
  const filteredAgents = useMemo(() => {
    let filtered = MARKETPLACE_AGENTS.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      
      const matchesPrice = priceRange === 'all' || 
                          (priceRange === 'free' && agent.monthlyPrice === 0) ||
                          (priceRange === 'low' && agent.monthlyPrice > 0 && agent.monthlyPrice <= 200) ||
                          (priceRange === 'mid' && agent.monthlyPrice > 200 && agent.monthlyPrice <= 400) ||
                          (priceRange === 'high' && agent.monthlyPrice > 400);
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort agents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.deployments - a.deployments;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.monthlyPrice - b.monthlyPrice;
        case 'price-high':
          return b.monthlyPrice - a.monthlyPrice;
        case 'newest':
          return b.reviews - a.reviews; // Using reviews as proxy for newness
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowPurchaseModal(true);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI Agent Marketplace
          </h1>
          <p className="text-gray-600 mt-2">
            Discover and deploy specialized AI agents to transform your business operations
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="low">$1 - $200</SelectItem>
              <SelectItem value="mid">$201 - $400</SelectItem>
              <SelectItem value="high">$400+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card 
              key={agent.id} 
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
              onClick={() => handleAgentSelect(agent)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{agent.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {agent.category}
                      </Badge>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getRarityColor(agent.rarity)}`}></div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{agent.rating}</span>
                    <span className="text-gray-500">({agent.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{agent.deployments}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      ${agent.monthlyPrice}/mo
                    </div>
                    <div className="text-xs text-gray-500">
                      or ${agent.oneTimePrice} once
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Get Agent
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {agent.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
          </div>
        )}

        {/* Purchase Modal */}
        {selectedAgent && (
          <PurchaseModal
            agent={selectedAgent}
            isOpen={showPurchaseModal}
            onClose={() => {
              setShowPurchaseModal(false);
              setSelectedAgent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}