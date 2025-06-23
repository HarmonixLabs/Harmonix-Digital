import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Star, TrendingUp, Zap, Wallet, DollarSign, Award, Clock, Users, Bot, Brain } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Enhanced agent data with creator economy features
const enhancedAgentTypes = [
  {
    id: 1,
    name: "CA$H",
    role: "Sales Strategist", 
    category: "Sales",
    avatar: "💰",
    monthlyPrice: 750,
    timeSaved: "26+ hrs/week",
    integrations: ["GHL", "Slack", "Zapier", "HubSpot"],
    rating: 4.9,
    reviews: 147,
    tokenUsage: "Medium",
    status: "Available",
    creator: "0x742d35Cc6672C0532925a3b8D2A291E48e5C67F8",
    creatorName: "Harmonix Core",
    nftEnabled: true,
    royaltySplit: { creator: 70, platform: 20, nft: 10 },
    description: "Elite sales automation agent trained on 10,000+ successful funnels",
    useCases: ["Lead qualification", "Follow-up sequences", "CRM automation"],
    setupType: "Custom"
  },
  {
    id: 2,
    name: "Virgil",
    role: "Brand Strategist",
    category: "Content", 
    avatar: "🎨",
    monthlyPrice: 650,
    timeSaved: "22+ hrs/week",
    integrations: ["Notion", "Figma", "Slack", "Canva"],
    rating: 4.8,
    reviews: 89,
    tokenUsage: "High",
    status: "Available",
    creator: "0x8ba1f109551bD432803012645Hac136c1A346A47",
    creatorName: "Design Guild",
    nftEnabled: true,
    royaltySplit: { creator: 75, platform: 15, nft: 10 },
    description: "Master brand architect with deep aesthetic intelligence",
    useCases: ["Brand identity", "Content strategy", "Visual consistency"],
    setupType: "Base"
  },
  {
    id: 3,
    name: "Maya",
    role: "HR Coordinator",
    category: "Operations",
    avatar: "👥",
    monthlyPrice: 550,
    timeSaved: "18+ hrs/week", 
    integrations: ["BambooHR", "Slack", "Calendly", "Zoom"],
    rating: 4.7,
    reviews: 63,
    tokenUsage: "Low",
    status: "Available",
    creator: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    creatorName: "People Ops Pro",
    nftEnabled: false,
    royaltySplit: { creator: 80, platform: 20, nft: 0 },
    description: "Streamlines recruitment, onboarding, and team coordination",
    useCases: ["Recruitment screening", "Onboarding workflows", "Performance tracking"],
    setupType: "Base"
  }
];

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPerformance, setSelectedPerformance] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // Enhanced filtering logic
  const filteredAgents = enhancedAgentTypes.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    const matchesPerformance = selectedPerformance === "all" || 
                              (selectedPerformance === "high" && parseInt(agent.timeSaved) >= 20) ||
                              (selectedPerformance === "medium" && parseInt(agent.timeSaved) >= 15) ||
                              (selectedPerformance === "low" && parseInt(agent.timeSaved) < 15);
    
    return matchesSearch && matchesCategory && matchesPerformance;
  });

  // Sort agents based on selected criteria
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "rating": return b.rating - a.rating;
      case "price-low": return a.monthlyPrice - b.monthlyPrice;
      case "price-high": return b.monthlyPrice - a.monthlyPrice;
      case "newest": return b.id - a.id;
      case "popular": return b.reviews - a.reviews;
      default: return 0;
    }
  });

  const deployAgentMutation = useMutation({
    mutationFn: async (agentId: number) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }
      
      const agent = enhancedAgentTypes.find(a => a.id === agentId);
      if (!agent) throw new Error("Agent not found");

      return apiRequest("POST", "/api/agents/deploy", {
        agentId,
        name: agent.name,
        monthlyPrice: agent.monthlyPrice,
        setupType: agent.setupType,
      });
    },
    onSuccess: (data, agentId) => {
      const agent = enhancedAgentTypes.find(a => a.id === agentId);
      toast({
        title: "Redirecting to Checkout",
        description: `Setting up deployment for ${agent?.name}...`,
      });
      // Redirect to checkout with agent pre-selected
      window.location.href = `/checkout?agent=${agentId}`;
    },
    onError: (error: any) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredAgents = agentTypes.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAgentIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      executive: "👔",
      hr: "👥", 
      sales: "📈",
      sop: "📋",
      concierge: "🎯",
      booking: "📅"
    };
    return iconMap[category] || "🤖";
  };

  const getPerformanceColor = (category: string) => {
    const colorMap: Record<string, string> = {
      executive: "from-teal-500 to-blue-600",
      hr: "from-purple-500 to-pink-600",
      sales: "from-orange-500 to-red-600",
      sop: "from-gray-500 to-gray-700",
      concierge: "from-green-500 to-emerald-600",
      booking: "from-yellow-500 to-orange-500"
    };
    return colorMap[category] || "from-blue-500 to-purple-600";
  };

  const generatePerformanceMetrics = (id: number) => {
    // Generate consistent but varied metrics based on agent ID
    const base = 45 + (id * 7) % 30;
    return {
      performance: `+${base + 10}%`,
      royalty: `${5 + (id * 3) % 8}%`
    };
  };

  const isAgentDeployed = (agentTypeId: number) => {
    return userAgents.some(agent => agent.agentTypeId === agentTypeId);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-400 mb-4">Please log in to access the marketplace.</p>
              <Button>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Agent <span className="harmony-gold">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300">Discover and deploy specialized AI agents for your business needs</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search agents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-harmony-slate border-gray-800 focus:border-harmony-gold"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-harmony-slate border-gray-800 focus:border-harmony-gold">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sales">Sales & Marketing</SelectItem>
              <SelectItem value="hr">HR & Recruiting</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="sop">Operations</SelectItem>
              <SelectItem value="concierge">Customer Service</SelectItem>
              <SelectItem value="booking">Booking & Scheduling</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
            <SelectTrigger className="w-48 bg-harmony-slate border-gray-800 focus:border-harmony-gold">
              <SelectValue placeholder="All Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="high">High Performance</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="new">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Featured Agents Banner */}
        <Card className="card-hover border-gray-800 mb-8 bg-gradient-to-r from-harmony-gold/10 to-harmony-teal/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-harmony-gold rounded-xl flex items-center justify-center">
                  <Star className="text-harmony-dark" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Featured This Week</h3>
                  <p className="text-gray-400">High-performance agents with proven track records</p>
                </div>
              </div>
              <Badge variant="outline" className="border-harmony-gold text-harmony-gold">
                <TrendingUp size={14} className="mr-1" />
                Trending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Agent Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="card-hover border-gray-800">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="w-20 h-20 bg-gray-700 rounded-xl mx-auto"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-800 rounded w-full"></div>
                    <div className="h-8 bg-gray-700 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAgents.map((agentType) => {
              const metrics = generatePerformanceMetrics(agentType.id);
              const isDeployed = isAgentDeployed(agentType.id);
              
              return (
                <Card key={agentType.id} className="card-hover border-gray-800 relative group">
                  <CardContent className="p-6">
                    <div className="absolute top-4 right-4 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      {metrics.performance} • {metrics.royalty}
                    </div>
                    
                    <div className="flex justify-center mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${getPerformanceColor(agentType.category)} rounded-xl flex items-center justify-center text-white text-2xl`}>
                        {getAgentIcon(agentType.category)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-center">{agentType.name}</h3>
                    <p className="text-sm text-gray-400 mb-4 text-center line-clamp-2">
                      {agentType.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Token Cost:</span>
                        <span className="harmony-gold">{agentType.tokenCost} per use</span>
                      </div>
                      {agentType.capabilities && agentType.capabilities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {agentType.capabilities.slice(0, 2).map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {agentType.capabilities.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agentType.capabilities.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {agentType.isLocked ? (
                      <Button 
                        className="w-full bg-gray-600 text-gray-400 cursor-not-allowed" 
                        disabled
                      >
                        🔒 Unlock Required
                      </Button>
                    ) : isDeployed ? (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        disabled
                      >
                        ✓ Deployed
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-harmony-gold hover:bg-yellow-500 text-harmony-dark font-semibold"
                        onClick={() => deployAgentMutation.mutate(agentType.id)}
                        disabled={deployAgentMutation.isPending}
                      >
                        {deployAgentMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-harmony-dark border-t-transparent rounded-full animate-spin" />
                            Deploying...
                          </div>
                        ) : (
                          <>
                            <Zap size={16} className="mr-2" />
                            Deploy
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="card-hover border-gray-800">
            <CardContent className="p-12 text-center">
              <Search size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or browse all categories.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedPerformance("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
