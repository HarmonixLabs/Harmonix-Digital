import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Gift, Users, Coins, Percent, Copy, Share2, Trophy } from "lucide-react";

interface ReferralStats {
  referralLink: string | null;
  referralCount: number;
  tokensEarned: number;
  currentDiscount: number;
  maxDiscount: number;
  referredUsers: Array<{
    id: number;
    name: string;
    email: string;
    createdAt: string;
  }>;
  nextReward: {
    tokens: number;
    discountIncrease: number;
  };
}

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/referral/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch referral stats:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard",
      });
    }
  };

  const shareReferralLink = () => {
    if (stats?.referralLink && navigator.share) {
      navigator.share({
        title: 'Join Harmonix Digital',
        text: 'Join me on Harmonix and get 250 bonus tokens + 10% off your first month!',
        url: stats.referralLink
      }).catch(console.error);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Unable to load referral data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Referral Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Referral Rewards
              </CardTitle>
              <CardDescription>
                Invite friends and unlock bonus tokens, exclusive NFTs, and up to 30% off monthly pricing
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Level {Math.floor(stats.referralCount / 5) + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Referral Link */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Your unique invite link:</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-muted p-3 rounded-lg font-mono text-sm truncate">
                {stats.referralLink || "Generating your link..."}
              </div>
              <Button 
                size="sm" 
                onClick={copyReferralLink}
                disabled={!stats.referralLink}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              {navigator.share && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={shareReferralLink}
                  disabled={!stats.referralLink}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.tokensEarned}</p>
                <p className="text-xs text-muted-foreground">Tokens Earned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Percent className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">-{stats.currentDiscount}%</p>
                <p className="text-xs text-muted-foreground">MRR Discount</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress to Next Reward */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Progress to Max Discount</p>
              <span className="text-sm text-muted-foreground">
                {stats.currentDiscount}% / {stats.maxDiscount}%
              </span>
            </div>
            <Progress 
              value={(stats.currentDiscount / stats.maxDiscount) * 100} 
              className="h-2"
            />
            {stats.currentDiscount < stats.maxDiscount && (
              <p className="text-xs text-muted-foreground">
                Next referral: +{stats.nextReward.tokens} tokens, 
                {stats.nextReward.discountIncrease > 0 && ` +${stats.nextReward.discountIncrease}% discount`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      {stats.referredUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Your Referral Champions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.referredUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
              {stats.referredUsers.length > 5 && (
                <p className="text-sm text-center text-muted-foreground pt-2">
                  And {stats.referredUsers.length - 5} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6 text-center space-y-3">
          <h3 className="text-lg font-semibold">🚀 Spread the Harmony</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Every person you refer gets 250 bonus tokens and 10% off their first month. 
            You'll earn 500 tokens and stack up to 30% off your monthly subscription!
          </p>
          <div className="flex gap-4 justify-center pt-2">
            <Button size="sm" variant="outline" onClick={copyReferralLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            {navigator.share && (
              <Button size="sm" onClick={shareReferralLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}