import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Gift, 
  TrendingUp, 
  Zap, 
  Star, 
  Trophy,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Sparkles,
  Flame,
  Award
} from "lucide-react";
import { formatTokenAmount, TOKEN_REWARDS, calculateTokenCost } from "@shared/types/tokens";

interface TokenBalance {
  current: number;
  totalEarned: number;
  totalSpent: number;
  pendingRewards: number;
}

interface RecentTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  timestamp: Date;
  source: string;
}

interface TokenRewardSystemProps {
  userId?: string;
  onTokenEarned?: (amount: number, source: string) => void;
  onTokenSpent?: (amount: number, purpose: string) => void;
}

export function TokenRewardSystem({ userId, onTokenEarned, onTokenSpent }: TokenRewardSystemProps) {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    current: 2450,
    totalEarned: 5200,
    totalSpent: 2750,
    pendingRewards: 500
  });

  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([
    {
      id: '1',
      type: 'earned',
      amount: 750,
      description: 'Platform Tutorial Completion',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      source: 'tutorial'
    },
    {
      id: '2',
      type: 'earned',
      amount: 1500,
      description: 'First Agent Deployment',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      source: 'achievement'
    },
    {
      id: '3',
      type: 'spent',
      amount: 150,
      description: 'CA$H Agent - Lead Processing',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      source: 'agent_usage'
    },
    {
      id: '4',
      type: 'earned',
      amount: 1000,
      description: 'Welcome Bonus',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      source: 'onboarding'
    }
  ]);

  const [availableRewards, setAvailableRewards] = useState(TOKEN_REWARDS.filter(reward => reward.isActive));

  const handleClaimReward = (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    if (reward) {
      const newTransaction: RecentTransaction = {
        id: Date.now().toString(),
        type: 'earned',
        amount: reward.tokenAmount,
        description: reward.name,
        timestamp: new Date(),
        source: reward.category
      };

      setTokenBalance(prev => ({
        ...prev,
        current: prev.current + reward.tokenAmount,
        totalEarned: prev.totalEarned + reward.tokenAmount,
        pendingRewards: Math.max(0, prev.pendingRewards - reward.tokenAmount)
      }));

      setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);

      if (onTokenEarned) {
        onTokenEarned(reward.tokenAmount, reward.category);
      }
    }
  };

  const getTransactionIcon = (type: string, source: string) => {
    if (type === 'earned') {
      switch (source) {
        case 'achievement':
          return <Trophy className="w-4 h-4 text-harmonix-gold" />;
        case 'tutorial':
          return <Star className="w-4 h-4 text-harmonix-gold" />;
        case 'onboarding':
          return <Gift className="w-4 h-4 text-harmonix-gold" />;
        default:
          return <ArrowUp className="w-4 h-4 text-green-400" />;
      }
    } else {
      return <ArrowDown className="w-4 h-4 text-red-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding':
        return <Gift className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'performance':
        return <TrendingUp className="w-5 h-5" />;
      case 'engagement':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Coins className="w-5 h-5" />;
    }
  };

  const agentTokenUsage = [
    { name: 'CA$H Agent', tokensUsed: 450, tasksCompleted: 9, efficiency: 95 },
    { name: 'Maya HR', tokensUsed: 240, tasksCompleted: 8, efficiency: 92 },
    { name: 'Virgil Brand', tokensUsed: 150, tasksCompleted: 2, efficiency: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Token Balance Overview */}
      <Card className="bg-gradient-to-r from-harmonix-night to-harmonix-cedar border-harmonix-gold">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-harmonix-gold mb-2">
                {formatTokenAmount(tokenBalance.current)}
              </div>
              <p className="text-harmonix-sage text-sm">Current Balance</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Coins className="w-4 h-4 text-harmonix-gold" />
                <span className="text-harmonix-gold text-xs">Available to Use</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatTokenAmount(tokenBalance.totalEarned)}
              </div>
              <p className="text-harmonix-sage text-sm">Total Earned</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs">All Time</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {formatTokenAmount(tokenBalance.totalSpent)}
              </div>
              <p className="text-harmonix-sage text-sm">Total Spent</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <ArrowDown className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs">Agent Usage</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatTokenAmount(tokenBalance.pendingRewards)}
              </div>
              <p className="text-harmonix-sage text-sm">Pending Rewards</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs">Ready to Claim</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Available Rewards */}
        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardHeader>
            <CardTitle className="text-harmonix-gold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Available Token Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableRewards.slice(0, 5).map((reward) => (
                <div 
                  key={reward.id}
                  className="flex items-center justify-between p-4 bg-harmonix-cedar/10 rounded-lg border border-harmonix-cedar"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-harmonix-gold/20 rounded-lg">
                      {getCategoryIcon(reward.category)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold">{reward.name}</h4>
                      <p className="text-harmonix-sage text-sm">{reward.description}</p>
                      <Badge className="bg-harmonix-cedar text-harmonix-sage text-xs mt-1">
                        {reward.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-harmonix-gold font-bold text-lg">
                      +{formatTokenAmount(reward.tokenAmount)}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleClaimReward(reward.id)}
                      className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 mt-2"
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      Claim
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardHeader>
            <CardTitle className="text-harmonix-gold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-harmonix-cedar/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type, transaction.source)}
                    <div>
                      <h4 className={`font-medium ${
                        transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}{formatTokenAmount(transaction.amount)}
                      </h4>
                      <p className="text-harmonix-sage text-sm">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-harmonix-sage text-xs">
                      {transaction.timestamp.toLocaleDateString()}
                    </p>
                    <p className="text-harmonix-sage text-xs">
                      {transaction.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Token Usage */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Agent Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {agentTokenUsage.map((agent, index) => (
              <div key={index} className="p-4 bg-harmonix-cedar/10 rounded-lg border border-harmonix-cedar">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-harmonix-gold">{agent.name}</h4>
                  <Badge className="bg-harmonix-gold text-harmonix-black">
                    {agent.efficiency}% efficient
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Tokens Used</span>
                    <span className="text-red-400">{agent.tokensUsed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Tasks Completed</span>
                    <span className="text-harmonix-gold">{agent.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-harmonix-sage">Avg Cost/Task</span>
                    <span className="text-harmonix-sage">{Math.round(agent.tokensUsed / agent.tasksCompleted)} tokens</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-harmonix-sage">Monthly Usage</span>
                    <span className="text-harmonix-gold">{Math.round((agent.tokensUsed / 2000) * 100)}%</span>
                  </div>
                  <Progress value={(agent.tokensUsed / 2000) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Economics Info */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Target className="w-5 h-5" />
            How Tokens Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-harmonix-gold font-semibold mb-3">Earning Tokens</h4>
              <ul className="space-y-2 text-harmonix-sage text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-harmonix-gold" />
                  Complete achievements and milestones
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-harmonix-gold" />
                  Deploy new agents and create workflows
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-harmonix-gold" />
                  Participate in tutorials and onboarding
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-harmonix-gold" />
                  Achieve ROI and performance targets
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-harmonix-gold font-semibold mb-3">Using Tokens</h4>
              <ul className="space-y-2 text-harmonix-sage text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  Power AI agent tasks and operations
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  Complex workflows use more tokens
                </li>
                <li className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-red-400" />
                  Efficient agents cost fewer tokens
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  Premium features and upgrades
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}