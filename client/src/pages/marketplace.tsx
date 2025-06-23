import { Navbar } from "@/components/layout/navbar";
import { AgentCard } from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Star, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";

export default function Marketplace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPerformance, setSelectedPerformance] = useState("all");

  const { data: agentTypes = [], isLoading } = useQuery({
    queryKey: ['/api/agent-types'],
  });

  const { data: userAgents = [] } = useQuery({
    queryKey: ['/api/agents'],
    enabled: !!user,
  });

  const deployAgentMutation = useMutation({
    mutationFn: async (agentTypeId: number) => {
      const agentType = agentTypes.find(type => type.id === agentTypeId);
      if (!agentType) throw new Error("Agent type not found");

      return apiRequest("POST", "/api/agents", {
        agentTypeId,
        name: agentType.name,
        customPrompt: "",
        isActive: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      toast({
        title: "Agent Deployed Successfully",
        description: "Your new AI agent is now active and ready to work.",
      });
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
