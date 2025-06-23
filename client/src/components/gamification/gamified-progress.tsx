import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Zap, 
  TrendingUp, 
  Target, 
  Award, 
  Flame,
  Crown,
  Sparkles,
  ChevronRight,
  Trophy
} from "lucide-react";

interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  levelTitle: string;
  levelDescription: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  xpRequired: number;
  completed: boolean;
  completedAt?: Date;
  icon: React.ComponentType<any>;
  reward?: string;
}

interface GamifiedProgressProps {
  userId?: string;
  onLevelUp?: (newLevel: number) => void;
  onMilestoneComplete?: (milestone: Milestone) => void;
}

export function GamifiedProgress({ userId, onLevelUp, onMilestoneComplete }: GamifiedProgressProps) {
  const [userLevel, setUserLevel] = useState<UserLevel>({
    currentLevel: 3,
    currentXP: 1250,
    xpToNextLevel: 750,
    totalXPForNextLevel: 2000,
    levelTitle: "Agent Apprentice",
    levelDescription: "You're learning the ways of AI automation"
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize milestones
  useEffect(() => {
    const initialMilestones: Milestone[] = [
      {
        id: 'first-100-xp',
        title: 'Getting Started',
        description: 'Earn your first 100 XP',
        xpRequired: 100,
        completed: true,
        completedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
        icon: Star,
        reward: 'Welcome Badge'
      },
      {
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        xpRequired: 2500,
        completed: false,
        icon: TrendingUp,
        reward: 'Special Profile Frame'
      },
      {
        id: 'first-agent',
        title: 'Agent Master',
        description: 'Deploy your first AI agent',
        xpRequired: 500,
        completed: true,
        completedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        icon: Zap,
        reward: 'Agent Summoner Title'
      },
      {
        id: 'workflow-creator',
        title: 'Workflow Wizard',
        description: 'Create 5 successful workflows',
        xpRequired: 1500,
        completed: false,
        icon: Sparkles,
        reward: 'Automation Expert Badge'
      },
      {
        id: 'roi-achiever',
        title: 'ROI Champion',
        description: 'Save $5,000 in time value',
        xpRequired: 3000,
        completed: false,
        icon: Award,
        reward: 'ROI Master Title'
      },
      {
        id: 'level-10',
        title: 'Harmonix Legend',
        description: 'Reach the legendary level 10',
        xpRequired: 10000,
        completed: false,
        icon: Crown,
        reward: 'Legendary Status + Exclusive Features'
      }
    ];

    setMilestones(initialMilestones);
  }, []);

  const levelTitles = [
    "Newcomer", "Explorer", "Learner", "Agent Apprentice", "Workflow Creator",
    "Automation Expert", "AI Strategist", "System Master", "Harmonix Elite", "Legend"
  ];

  const getXPForLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  const getLevelFromXP = (xp: number) => {
    let level = 1;
    let totalXP = 0;
    
    while (totalXP <= xp) {
      totalXP += getXPForLevel(level);
      if (totalXP > xp) break;
      level++;
    }
    
    return level;
  };

  const progressPercentage = ((userLevel.currentXP - (userLevel.totalXPForNextLevel - userLevel.xpToNextLevel)) / userLevel.xpToNextLevel) * 100;

  const nextMilestone = milestones
    .filter(m => !m.completed && m.xpRequired > userLevel.currentXP)
    .sort((a, b) => a.xpRequired - b.xpRequired)[0];

  const recentMilestones = milestones
    .filter(m => m.completed)
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 3);

  const handleClaimReward = (milestone: Milestone) => {
    // Handle reward claiming logic
    console.log(`Claiming reward for milestone: ${milestone.title}`);
    if (onMilestoneComplete) {
      onMilestoneComplete(milestone);
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress Card */}
      <Card className="bg-gradient-to-r from-harmonix-night to-harmonix-cedar border-harmonix-gold">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-harmonix-gold flex items-center gap-2">
                <Crown className="w-6 h-6" />
                Level {userLevel.currentLevel} - {userLevel.levelTitle}
              </CardTitle>
              <p className="text-harmonix-sage text-sm mt-1">{userLevel.levelDescription}</p>
            </div>
            <Badge className="bg-harmonix-gold text-harmonix-black text-lg px-3 py-1">
              {userLevel.currentXP.toLocaleString()} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-harmonix-sage">Progress to Level {userLevel.currentLevel + 1}</span>
              <span className="text-harmonix-gold font-semibold">
                {userLevel.xpToNextLevel} XP needed
              </span>
            </div>
            
            <div className="relative">
              <Progress value={progressPercentage} className="h-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-harmonix-black">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-harmonix-sage">
              <span>Level {userLevel.currentLevel}</span>
              <span>Level {userLevel.currentLevel + 1}: {levelTitles[userLevel.currentLevel] || "Master"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="bg-harmonix-night border-harmonix-cedar">
          <CardHeader>
            <CardTitle className="text-harmonix-gold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-harmonix-cedar/20 rounded-lg">
                <nextMilestone.icon className="w-6 h-6 text-harmonix-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-harmonix-gold">{nextMilestone.title}</h3>
                <p className="text-harmonix-sage text-sm">{nextMilestone.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress 
                    value={(userLevel.currentXP / nextMilestone.xpRequired) * 100} 
                    className="h-2 flex-1" 
                  />
                  <span className="text-xs text-harmonix-sage">
                    {userLevel.currentXP}/{nextMilestone.xpRequired} XP
                  </span>
                </div>
              </div>
              {nextMilestone.reward && (
                <div className="text-right">
                  <p className="text-xs text-harmonix-sage">Reward:</p>
                  <p className="text-sm text-harmonix-gold font-semibold">{nextMilestone.reward}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentMilestones.length > 0 ? (
            <div className="space-y-3">
              {recentMilestones.map((milestone) => {
                const IconComponent = milestone.icon;
                return (
                  <div key={milestone.id} className="flex items-center gap-4 p-3 bg-harmonix-cedar/10 rounded-lg">
                    <div className="p-2 bg-harmonix-gold/20 rounded-lg">
                      <IconComponent className="w-5 h-5 text-harmonix-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-harmonix-gold">{milestone.title}</h4>
                      <p className="text-harmonix-sage text-sm">{milestone.description}</p>
                      {milestone.completedAt && (
                        <p className="text-xs text-harmonix-sage mt-1">
                          Completed {milestone.completedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {milestone.reward && (
                      <Button 
                        size="sm"
                        onClick={() => handleClaimReward(milestone)}
                        className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                      >
                        <Award className="w-4 h-4 mr-1" />
                        Claimed
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Flame className="w-12 h-12 text-harmonix-sage mx-auto mb-4" />
              <h3 className="text-harmonix-gold font-semibold mb-2">No Recent Achievements</h3>
              <p className="text-harmonix-sage">Start completing tasks to earn your first milestone!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Milestones Overview */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Star className="w-5 h-5" />
            All Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const IconComponent = milestone.icon;
              const progress = Math.min((userLevel.currentXP / milestone.xpRequired) * 100, 100);
              
              return (
                <div 
                  key={milestone.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    milestone.completed 
                      ? 'bg-harmonix-gold/10 border-harmonix-gold/30' 
                      : 'bg-harmonix-cedar/10 border-harmonix-cedar'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    milestone.completed ? 'bg-harmonix-gold/20' : 'bg-harmonix-cedar/20'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      milestone.completed ? 'text-harmonix-gold' : 'text-harmonix-sage'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      milestone.completed ? 'text-harmonix-gold' : 'text-harmonix-sage'
                    }`}>
                      {milestone.title}
                    </h4>
                    <p className="text-harmonix-sage text-sm">{milestone.description}</p>
                    {!milestone.completed && (
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-xs text-harmonix-sage">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-harmonix-gold">
                      {milestone.xpRequired.toLocaleString()} XP
                    </p>
                    {milestone.reward && (
                      <p className="text-xs text-harmonix-sage">{milestone.reward}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}