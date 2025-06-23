import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Award, 
  CheckCircle, 
  Lock,
  Sparkles,
  Flame,
  Shield,
  Gem,
  Coins
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'welcome' | 'agent' | 'workflow' | 'roi' | 'social' | 'master';
  progress: number; // 0-100
  unlocked: boolean;
  unlockedAt?: Date;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  tokenReward: number;
  requirements?: string[];
}

interface AchievementBadgesProps {
  userId?: string;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

export function AchievementBadges({ userId, onAchievementUnlock }: AchievementBadgesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Initialize achievements data
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      // Welcome Category
      {
        id: 'first-login',
        title: 'Welcome to Harmonix',
        description: 'Complete your first login to the platform',
        category: 'welcome',
        progress: 100,
        unlocked: true,
        unlockedAt: new Date(),
        icon: Star,
        rarity: 'common',
        xpReward: 50,
        tokenReward: 1000
      },
      {
        id: 'profile-complete',
        title: 'Profile Master',
        description: 'Complete your profile with all required information',
        category: 'welcome',
        progress: 75,
        unlocked: false,
        icon: CheckCircle,
        rarity: 'common',
        xpReward: 100,
        tokenReward: 500,
        requirements: ['Add profile photo', 'Set company info', 'Connect phone number']
      },
      {
        id: 'onboarding-complete',
        title: 'Onboarding Champion',
        description: 'Complete the full platform onboarding experience',
        category: 'welcome',
        progress: 60,
        unlocked: false,
        icon: Trophy,
        rarity: 'rare',
        xpReward: 200,
        tokenReward: 750
      },

      // Agent Category
      {
        id: 'first-agent',
        title: 'Agent Summoner',
        description: 'Deploy your first AI agent',
        category: 'agent',
        progress: 0,
        unlocked: false,
        icon: Zap,
        rarity: 'common',
        xpReward: 150,
        tokenReward: 1500
      },
      {
        id: 'agent-trio',
        title: 'Triple Threat',
        description: 'Deploy 3 different AI agents',
        category: 'agent',
        progress: 0,
        unlocked: false,
        icon: Target,
        rarity: 'rare',
        xpReward: 300,
        tokenReward: 2000
      },
      {
        id: 'agent-master',
        title: 'Agent Master',
        description: 'Deploy 10 AI agents and achieve mastery',
        category: 'agent',
        progress: 0,
        unlocked: false,
        icon: Crown,
        rarity: 'epic',
        xpReward: 500,
        tokenReward: 3000
      },

      // Workflow Category
      {
        id: 'first-automation',
        title: 'Automation Apprentice',
        description: 'Create your first automated workflow',
        category: 'workflow',
        progress: 0,
        unlocked: false,
        icon: Sparkles,
        rarity: 'common',
        xpReward: 200,
        tokenReward: 1200
      },
      {
        id: 'workflow-wizard',
        title: 'Workflow Wizard',
        description: 'Create 5 successful automation workflows',
        category: 'workflow',
        progress: 0,
        unlocked: false,
        icon: Flame,
        rarity: 'rare',
        xpReward: 400,
        tokenReward: 2500
      },

      // ROI Category
      {
        id: 'first-savings',
        title: 'Time Saver',
        description: 'Save your first 10 hours using AI agents',
        category: 'roi',
        progress: 0,
        unlocked: false,
        icon: Award,
        rarity: 'common',
        xpReward: 250,
        tokenReward: 1500
      },
      {
        id: 'roi-achiever',
        title: 'ROI Achiever',
        description: 'Achieve $5,000 in documented time savings',
        category: 'roi',
        progress: 0,
        unlocked: false,
        icon: Shield,
        rarity: 'epic',
        xpReward: 600,
        tokenReward: 5000
      },

      // Master Category
      {
        id: 'harmonix-legend',
        title: 'Harmonix Legend',
        description: 'Unlock all other achievements and become a platform legend',
        category: 'master',
        progress: 0,
        unlocked: false,
        icon: Gem,
        rarity: 'legendary',
        xpReward: 1000,
        tokenReward: 10000
      }
    ];

    setAchievements(initialAchievements);
  }, []);

  const categories = [
    { id: 'all', label: 'All Achievements', count: achievements.length },
    { id: 'welcome', label: 'Welcome', count: achievements.filter(a => a.category === 'welcome').length },
    { id: 'agent', label: 'Agents', count: achievements.filter(a => a.category === 'agent').length },
    { id: 'workflow', label: 'Workflows', count: achievements.filter(a => a.category === 'workflow').length },
    { id: 'roi', label: 'ROI', count: achievements.filter(a => a.category === 'roi').length },
    { id: 'master', label: 'Master', count: achievements.filter(a => a.category === 'master').length }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-harmonix-gold';
      default: return 'bg-gray-500';
    }
  };

  const getRarityTextColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-harmonix-gold';
      default: return 'text-gray-400';
    }
  };

  const totalXP = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-harmonix-sage text-sm">Achievements Unlocked</p>
                <p className="text-2xl font-bold text-harmonix-gold">{unlockedCount}/{achievements.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-harmonix-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-harmonix-sage text-sm">Total XP Earned</p>
                <p className="text-2xl font-bold text-harmonix-gold">{totalXP.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-harmonix-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-harmonix-sage text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-harmonix-gold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
              </div>
              <Target className="w-8 h-8 text-harmonix-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold">Achievement Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-harmonix-gold text-harmonix-black" 
                  : "border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
                }
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className={showUnlockedOnly 
                ? "bg-harmonix-gold text-harmonix-black" 
                : "border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
              }
            >
              {showUnlockedOnly ? "Show All" : "Show Unlocked Only"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const IconComponent = achievement.icon;
          
          return (
            <Card 
              key={achievement.id} 
              className={`bg-harmonix-night border-harmonix-cedar relative overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? 'ring-2 ring-harmonix-gold hover:ring-harmonix-gold/70' 
                  : 'hover:border-harmonix-sage'
              }`}
            >
              {/* Rarity Indicator */}
              <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] ${getRarityColor(achievement.rarity)}`} />
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-harmonix-gold/20' : 'bg-harmonix-cedar/20'}`}>
                    {achievement.unlocked ? (
                      <IconComponent className="w-6 h-6 text-harmonix-gold" />
                    ) : (
                      <Lock className="w-6 h-6 text-harmonix-sage" />
                    )}
                  </div>
                  <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>

                <h3 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-harmonix-gold' : 'text-harmonix-sage'}`}>
                  {achievement.title}
                </h3>
                
                <p className="text-harmonix-sage text-sm mb-3">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-harmonix-sage">Progress</span>
                      <span className="text-harmonix-gold">{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                    
                    {achievement.requirements && (
                      <div className="mt-2">
                        <p className="text-xs text-harmonix-sage mb-1">Requirements:</p>
                        <ul className="text-xs text-harmonix-sage space-y-1">
                          {achievement.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-harmonix-sage rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-harmonix-cedar">
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs font-semibold ${getRarityTextColor(achievement.rarity)}`}>
                      +{achievement.xpReward} XP
                    </span>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-harmonix-gold" />
                      <span className="text-xs font-semibold text-harmonix-gold">
                        +{achievement.tokenReward} tokens
                      </span>
                    </div>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-harmonix-sage">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-harmonix-sage mx-auto mb-4" />
            <h3 className="text-harmonix-gold font-semibold mb-2">No Achievements Found</h3>
            <p className="text-harmonix-sage">
              {showUnlockedOnly 
                ? "You haven't unlocked any achievements in this category yet. Keep exploring!"
                : "No achievements match your current filter."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}