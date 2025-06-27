import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Coins, 
  Trophy, 
  Star, 
  Plus, 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft,
  History,
  Gem,
  Crown,
  Sparkles,
  Shield
} from 'lucide-react';

interface NFT {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  collection: string;
  price: number;
}

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'reward' | 'mint';
  amount: number;
  currency: 'HMX' | 'ETH';
  timestamp: string;
  description: string;
}

const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Agent CA$H Genesis',
    image: '💰',
    rarity: 'legendary',
    collection: 'Harmonix Agents',
    price: 0.5
  },
  {
    id: '2',
    name: 'Concierge Elite',
    image: '👸',
    rarity: 'epic',
    collection: 'Harmonix Agents',
    price: 0.3
  },
  {
    id: '3',
    name: 'Social Maven',
    image: '📱',
    rarity: 'rare',
    collection: 'Harmonix Agents',
    price: 0.2
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    amount: -500,
    currency: 'HMX',
    timestamp: '2 hours ago',
    description: 'Agent CA$H deployment'
  },
  {
    id: '2',
    type: 'reward',
    amount: 100,
    currency: 'HMX',
    timestamp: '1 day ago',
    description: 'Achievement reward: First Agent'
  },
  {
    id: '3',
    type: 'mint',
    amount: -0.1,
    currency: 'ETH',
    timestamp: '3 days ago',
    description: 'Minted Concierge Elite NFT'
  }
];

const RARITY_COLORS = {
  common: 'bg-slate-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const RARITY_ICONS = {
  common: Shield,
  rare: Sparkles,
  epic: Gem,
  legendary: Crown
};

export function WalletInterface() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);

  const tokenBalance = 2450;
  const ethBalance = 0.567;
  const portfolioValue = 1.234;

  const handleConnectWallet = () => {
    setIsConnected(true);
    // In real implementation, this would connect to Web3 wallet
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'sale': return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'reward': return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'mint': return <Sparkles className="w-4 h-4 text-blue-400" />;
      default: return <Coins className="w-4 h-4 text-slate-400" />;
    }
  };

  const getRarityIcon = (rarity: string) => {
    const Icon = RARITY_ICONS[rarity as keyof typeof RARITY_ICONS];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-600">
        <CardContent className="p-8 text-center">
          <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-emerald-100 mb-2">Connect Your Wallet</h3>
          <p className="text-slate-400 mb-6">
            Connect your Web3 wallet to manage tokens, NFTs, and agent royalties
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleConnectWallet}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect MetaMask
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
            >
              WalletConnect
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
            >
              Coinbase Wallet
            </Button>
          </div>
          
          <p className="text-slate-500 text-sm mt-4">
            New to Web3? <span className="text-emerald-400 cursor-pointer hover:underline">Learn more</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-emerald-100">My Wallet</CardTitle>
                <p className="text-slate-400 text-sm">0x742d...8f3a</p>
              </div>
            </div>
            
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Connected
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{tokenBalance.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">HMX Tokens</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{ethBalance}</div>
              <div className="text-slate-400 text-sm">ETH</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{portfolioValue}</div>
              <div className="text-slate-400 text-sm">Portfolio Value (ETH)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border-slate-600">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="nfts" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            NFTs ({mockNFTs.length})
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="rewards" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
          >
            Rewards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-emerald-100">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Tokens
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Stake HMX
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-emerald-100">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <div className="text-emerald-100 text-sm">{tx.description}</div>
                        <div className="text-slate-400 text-xs">{tx.timestamp}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-emerald-100">My NFT Collection</h3>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Mint New NFT
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockNFTs.map((nft) => (
              <Card key={nft.id} className="bg-slate-800/50 border-slate-600 hover:border-emerald-400/50 transition-colors">
                <CardContent className="p-4">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{nft.image}</div>
                    <h4 className="text-emerald-100 font-semibold">{nft.name}</h4>
                    <p className="text-slate-400 text-sm">{nft.collection}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`${RARITY_COLORS[nft.rarity]} text-white`}>
                      {getRarityIcon(nft.rarity)}
                      <span className="ml-1 capitalize">{nft.rarity}</span>
                    </Badge>
                    <div className="text-emerald-400 font-semibold">
                      {nft.price} ETH
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
                    >
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-emerald-100">Transaction History</h3>
            <Button 
              variant="outline" 
              className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
            >
              <History className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <Card className="bg-slate-800/50 border-slate-600">
            <CardContent className="p-0">
              <div className="space-y-0">
                {mockTransactions.map((tx, index) => (
                  <div 
                    key={tx.id} 
                    className={`p-4 flex items-center justify-between ${
                      index !== mockTransactions.length - 1 ? 'border-b border-slate-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <div className="text-emerald-100 font-medium">{tx.description}</div>
                        <div className="text-slate-400 text-sm">{tx.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-slate-700 text-slate-300 capitalize"
                      >
                        {tx.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-100 mb-2">Rewards Program</h3>
            <p className="text-slate-400 mb-6">
              Earn HMX tokens by using agents, referring friends, and participating in the community
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-600 text-center">
                <CardContent className="p-4">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-emerald-100 font-semibold">Agent Usage</h4>
                  <p className="text-slate-400 text-sm">Earn 10 HMX per hour</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-600 text-center">
                <CardContent className="p-4">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-emerald-100 font-semibold">Referrals</h4>
                  <p className="text-slate-400 text-sm">Earn 500 HMX per referral</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-600 text-center">
                <CardContent className="p-4">
                  <Gem className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-emerald-100 font-semibold">NFT Creation</h4>
                  <p className="text-slate-400 text-sm">Earn 1000 HMX per mint</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}