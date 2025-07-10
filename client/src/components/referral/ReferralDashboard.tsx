import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Copy, Users, Coins, Percent, TrendingUp, Award } from "lucide-react";

interface ReferralStats {
  referralCode: string;
  referralCount: number;
  tokensEarned: number;
  currentDiscountPercent: number;
  referralLink: string;
  referredUsers: Array<{
    id: number;
    name: string;
    email: string;
    createdAt: string;
  }>;
  nextMilestone: {
    referralsNeeded: number;
    reward: string;
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
      toast({
        title: "Error",
        description: "Failed to load referral stats",
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

  const shareOnSocial = (platform: string) => {
    if (!stats?.referralLink) return;
    
    const message = "Join me on Harmonix AI and get 250 bonus tokens + 10% off your first month! 🚀";
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(stats.referralLink);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Main Referral Card */}
      <Card className="border-jade-forest/20 bg-gradient-to-br from-background to-jade-forest/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="w-6 h-6 text-gold" />
            Harmony Rise Loop - Referral Rewards
          </CardTitle>
          <CardDescription>
            Invite friends and earn tokens, discounts, and exclusive perks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Referral Link Section */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Your unique invite link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-background rounded text-sm font-mono truncate">
                {stats.referralLink}
              </code>
              <Button onClick={copyReferralLink} size="sm" variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Social Share Buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareOnSocial('twitter')}
                className="text-xs"
              >
                Twitter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareOnSocial('linkedin')}
                className="text-xs"
              >
                LinkedIn
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => shareOnSocial('whatsapp')}
                className="text-xs"
              >
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-jade-forest/10">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-jade-forest" />
                </div>
                <p className="text-3xl font-bold">{stats.referralCount}</p>
                <p className="text-sm text-muted-foreground">Referrals</p>
              </CardContent>
            </Card>

            <Card className="border-jade-forest/10">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-2">
                  <Coins className="w-8 h-8 text-gold" />
                </div>
                <p className="text-3xl font-bold">{stats.tokensEarned}</p>
                <p className="text-sm text-muted-foreground">Tokens Earned</p>
              </CardContent>
            </Card>

            <Card className="border-jade-forest/10">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-2">
                  <Percent className="w-8 h-8 text-jade-forest" />
                </div>
                <p className="text-3xl font-bold">-{stats.currentDiscountPercent}%</p>
                <p className="text-sm text-muted-foreground">MRR Discount</p>
              </CardContent>
            </Card>
          </div>

          {/* Next Milestone */}
          {stats.nextMilestone.referralsNeeded > 0 && (
            <Card className="mt-4 border-gold/20 bg-gold/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gold" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.nextMilestone.referralsNeeded} more referral{stats.nextMilestone.referralsNeeded > 1 ? 's' : ''} to {stats.nextMilestone.reward}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reward Info */}
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="text-jade-forest">📣</span>
              Each friend you refer gets <strong>250 bonus tokens</strong> and <strong>10% off</strong> their first month
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gold">🎁</span>
              You earn <strong>500 tokens</strong> and <strong>5% off monthly pricing</strong> (up to 30% max)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referred Users List */}
      {stats.referredUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Referral Network</CardTitle>
            <CardDescription>
              People who joined Harmonix through your invite link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.referredUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-jade-forest font-medium">+500 tokens</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {stats.referredUsers.length > 5 && (
                <p className="text-sm text-center text-muted-foreground">
                  And {stats.referredUsers.length - 5} more...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}