import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Crown, Gem, Star, Filter, Search } from "lucide-react";

export default function NFTMarketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");

  // Mock NFT agent skins data
  const agentSkins = [
    {
      id: 1,
      name: "Diamond Chain CA$H",
      agentType: "CA$H Sales Agent",
      description: "Luxury techwear with diamond chain and gold glow animations",
      rarity: "legendary",
      price: 5000,
      isLimited: true,
      editions: 50,
      currentOwners: 12,
      avatar: "cash_diamond",
      colorScheme: "red-black-gold",
      animations: ["gold_glow", "chain_sparkle"]
    },
    {
      id: 2,
      name: "Street Executive CA$H",
      agentType: "CA$H Sales Agent", 
      description: "Classic CA$H look with red suit and confident stance",
      rarity: "rare",
      price: 1500,
      isLimited: false,
      editions: 500,
      currentOwners: 89,
      avatar: "cash_classic",
      colorScheme: "red-black",
      animations: ["confident_lean"]
    },
    {
      id: 3,
      name: "Premium Concierge",
      agentType: "Concierge Agent",
      description: "Professional blue theme with service excellence animations",
      rarity: "rare", 
      price: 1200,
      isLimited: false,
      editions: 300,
      currentOwners: 67,
      avatar: "concierge_premium",
      colorScheme: "blue-cyan",
      animations: ["welcoming_gesture"]
    },
    {
      id: 4,
      name: "Talent Scout",
      agentType: "HR Agent",
      description: "Modern HR professional with purple accent themes",
      rarity: "common",
      price: 500,
      isLimited: false,
      editions: 1000,
      currentOwners: 234,
      avatar: "hr_scout",
      colorScheme: "purple-pink", 
      animations: ["interview_ready"]
    },
    {
      id: 5,
      name: "Golden Executive",
      agentType: "Executive Assistant",
      description: "Luxury gold theme for high-level executive tasks",
      rarity: "epic",
      price: 3000,
      isLimited: true,
      editions: 100,
      currentOwners: 23,
      avatar: "exec_golden",
      colorScheme: "gold-black",
      animations: ["authority_pose", "golden_aura"]
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500 text-black';
      case 'epic': return 'bg-purple-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="h-3 w-3" />;
      case 'epic': return <Gem className="h-3 w-3" />;
      case 'rare': return <Star className="h-3 w-3" />;
      default: return null;
    }
  };

  const filteredSkins = agentSkins.filter(skin => {
    const matchesSearch = skin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skin.agentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || skin.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">NFT Marketplace Access</h1>
            <p className="text-gray-400 mb-6">Please log in to access agent NFT skins</p>
            <Button className="bg-harmony-gold hover:bg-yellow-500 text-harmony-dark">
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Agent NFT <span className="harmony-gold">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Collect unique skins and cosmetics for your AI agents. Each NFT grants exclusive visual themes, 
            animations, and status benefits within the Harmonix ecosystem.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search agent skins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="rare">Rare</SelectItem>
              <SelectItem value="epic">Epic</SelectItem>
              <SelectItem value="legendary">Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NFT Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkins.map((skin) => (
            <Card key={skin.id} className="border-gray-800 overflow-hidden card-hover">
              <div className="relative">
                <div className={`h-48 bg-gradient-to-br ${
                  skin.colorScheme === 'red-black-gold' ? 'from-red-500 via-black to-yellow-500' :
                  skin.colorScheme === 'red-black' ? 'from-red-500 to-black' :
                  skin.colorScheme === 'blue-cyan' ? 'from-blue-500 to-cyan-500' :
                  skin.colorScheme === 'purple-pink' ? 'from-purple-500 to-pink-500' :
                  skin.colorScheme === 'gold-black' ? 'from-yellow-500 to-black' :
                  'from-gray-500 to-gray-700'
                } flex items-center justify-center relative overflow-hidden`}>
                  
                  {/* Agent Icon */}
                  <TrendingUp className="h-16 w-16 text-white opacity-80" />
                  
                  {/* Special Effects for CA$H Diamond */}
                  {skin.name.includes('Diamond') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent animate-pulse"></div>
                  )}
                  
                  {/* Rarity Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold flex items-center space-x-1 ${getRarityColor(skin.rarity)}`}>
                    {getRarityIcon(skin.rarity)}
                    <span>{skin.rarity.toUpperCase()}</span>
                  </div>
                  
                  {/* Limited Edition Badge */}
                  {skin.isLimited && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      LIMITED
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">{skin.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{skin.agentType}</p>
                  <p className="text-xs text-gray-500">{skin.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Price:</span>
                    <span className="harmony-gold font-bold">{skin.price.toLocaleString()} HMX</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Owners:</span>
                    <span>{skin.currentOwners}/{skin.editions}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-harmony-gold hover:bg-yellow-500 text-harmony-dark font-semibold">
                    Purchase NFT
                  </Button>
                  <Button variant="outline" size="sm" className="w-full border-gray-600 text-gray-400 hover:border-harmony-gold hover:text-harmony-gold">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No agent skins found matching your criteria.</p>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold harmony-gold mb-2">5</div>
              <div className="text-gray-400">Unique Skins Available</div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold harmony-gold mb-2">425</div>
              <div className="text-gray-400">Total Owners</div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold harmony-gold mb-2">12.5K</div>
              <div className="text-gray-400">Trading Volume (HMX)</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}