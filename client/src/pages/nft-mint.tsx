import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Brain, 
  Star, 
  Lock, 
  Unlock,
  ExternalLink,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgentNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  mintPrice: number;
  totalSupply: number;
  currentSupply: number;
  agentType: string;
  abilities: string[];
  stats: {
    performance: number;
    efficiency: number;
    reliability: number;
  };
}

export default function NFTMint() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<AgentNFT | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const agentNFTs: AgentNFT[] = [
    {
      id: 'cash-001',
      name: 'CA$HFLOW Genesis',
      description: 'The original Sales Hunter. Red/black luxury techwear with diamond chain. First of the revenue generation series.',
      image: '/api/placeholder/400/600',
      rarity: 'legendary',
      mintPrice: 0.25,
      totalSupply: 100,
      currentSupply: 23,
      agentType: 'Sales',
      abilities: ['Lead Processing', 'CRM Integration', 'Loom Generation', 'Pipeline Management'],
      stats: {
        performance: 95,
        efficiency: 92,
        reliability: 98
      }
    },
    {
      id: 'concierge-001',
      name: 'VIRGIL Concierge',
      description: 'The digital guide with lotus wisdom. Orchestrates client experiences with spiritual tech elegance.',
      image: '/api/placeholder/400/600',
      rarity: 'epic',
      mintPrice: 0.18,
      totalSupply: 250,
      currentSupply: 67,
      agentType: 'Concierge',
      abilities: ['Client Guidance', 'Experience Design', 'Resource Coordination', 'Quality Assurance'],
      stats: {
        performance: 88,
        efficiency: 94,
        reliability: 96
      }
    },
    {
      id: 'hr-001',
      name: 'TALENT Recruiter',
      description: 'Elite talent acquisition specialist. Black suit with golden accents, designed for high-level recruitment.',
      image: '/api/placeholder/400/600',
      rarity: 'rare',
      mintPrice: 0.12,
      totalSupply: 500,
      currentSupply: 156,
      agentType: 'HR',
      abilities: ['Talent Sourcing', 'Interview Coordination', 'Candidate Assessment', 'Onboarding'],
      stats: {
        performance: 85,
        efficiency: 88,
        reliability: 91
      }
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-teal-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black';
      case 'epic': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-400 to-teal-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleMint = async (agent: AgentNFT) => {
    setIsMinting(true);
    setSelectedAgent(agent);

    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "NFT Minted Successfully!",
        description: `${agent.name} has been added to your collection.`,
      });

      // Here you would integrate with actual blockchain minting
      // Example: Thirdweb, Web3.js, or similar
      
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
      setSelectedAgent(null);
    }
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc4C0532A3a2b4D5c2B8B8a8b8a8b8a8b8');
    toast({
      title: "Contract Address Copied",
      description: "Smart contract address copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Agent NFT <span className="text-harmony-gold">Mint</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Own AI agents as collectible NFTs. Each token grants access to exclusive agent capabilities.
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live on Polygon</span>
            </div>
            <button 
              onClick={copyContractAddress}
              className="flex items-center space-x-2 hover:text-harmony-gold transition-colors"
            >
              <span>Contract: 0x742d...8b8a8b8</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Agent NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agentNFTs.map((agent) => (
            <Card key={agent.id} className="bg-slate-800/50 border-harmony-gold/30 overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className={`h-2 bg-gradient-to-r ${getRarityColor(agent.rarity)}`}></div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getRarityBadgeColor(agent.rarity)}>
                    {agent.rarity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-teal-400 text-teal-400">
                    #{agent.id}
                  </Badge>
                </div>
                
                <CardTitle className="text-harmony-gold">{agent.name}</CardTitle>
                <p className="text-sm text-gray-400">{agent.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Agent Image Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border border-harmony-gold/20">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-harmony-gold to-yellow-500 flex items-center justify-center">
                      {agent.agentType === 'Sales' && <TrendingUp className="h-8 w-8 text-slate-900" />}
                      {agent.agentType === 'Concierge' && <Brain className="h-8 w-8 text-slate-900" />}
                      {agent.agentType === 'HR' && <Users className="h-8 w-8 text-slate-900" />}
                    </div>
                    <p className="text-harmony-gold font-semibold">{agent.agentType} Agent</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Performance</span>
                    <span className="text-harmony-gold">{agent.stats.performance}%</span>
                  </div>
                  <Progress value={agent.stats.performance} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Efficiency</span>
                    <span className="text-teal-400">{agent.stats.efficiency}%</span>
                  </div>
                  <Progress value={agent.stats.efficiency} className="h-2" />
                </div>

                {/* Abilities */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Abilities</h4>
                  <div className="flex flex-wrap gap-1">
                    {agent.abilities.slice(0, 2).map((ability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                        {ability}
                      </Badge>
                    ))}
                    {agent.abilities.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                        +{agent.abilities.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Supply Info */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Minted</span>
                  <span className="text-gray-300">{agent.currentSupply} / {agent.totalSupply}</span>
                </div>
                <Progress value={(agent.currentSupply / agent.totalSupply) * 100} className="h-2" />

                {/* Mint Price & Button */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-harmony-gold">
                      {agent.mintPrice} ETH
                    </span>
                    <span className="text-sm text-gray-400">
                      ${(agent.mintPrice * 2400).toFixed(0)} USD
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleMint(agent)}
                    disabled={isMinting || agent.currentSupply >= agent.totalSupply}
                    className="w-full bg-harmony-gold text-slate-900 hover:bg-yellow-400 font-semibold"
                  >
                    {isMinting && selectedAgent?.id === agent.id ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Minting...</span>
                      </span>
                    ) : agent.currentSupply >= agent.totalSupply ? (
                      <span className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Sold Out</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Mint NFT</span>
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-harmony-gold/30">
            <CardContent className="p-6 text-center">
              <Unlock className="h-8 w-8 text-harmony-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Utility Access</h3>
              <p className="text-sm text-gray-400">
                Each NFT grants access to the corresponding AI agent's full capabilities and future updates.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-harmony-gold/30">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-harmony-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Rarity System</h3>
              <p className="text-sm text-gray-400">
                Different rarity levels provide enhanced stats, exclusive features, and collectible value.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-harmony-gold/30">
            <CardContent className="p-6 text-center">
              <ExternalLink className="h-8 w-8 text-harmony-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Marketplace Trading</h3>
              <p className="text-sm text-gray-400">
                Trade agents on OpenSea or our native marketplace. Each transfer maintains agent capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}