import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AchievementBadges } from "./achievement-badges";
import { GamifiedProgress } from "./gamified-progress";
import { InteractiveTutorial } from "./interactive-tutorial";
import { 
  Sparkles, 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Star,
  ChevronRight,
  Gift,
  Flame,
  Award
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  achievementId?: string;
  icon: React.ComponentType<any>;
}

interface GamifiedOnboardingProps {
  userId?: string;
  onComplete?: () => void;
  initialStep?: number;
}

export function GamifiedOnboarding({ userId, onComplete, initialStep = 0 }: GamifiedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [userXP, setUserXP] = useState(350); // Starting XP
  const [userLevel, setUserLevel] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<string>('');

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Harmonix',
      description: 'Complete your profile and learn about the platform',
      completed: true, // First step auto-completed
      xpReward: 100,
      achievementId: 'first-login',
      icon: Star
    },
    {
      id: 'profile-setup',
      title: 'Complete Your Profile',
      description: 'Add your business information and preferences',
      completed: false,
      xpReward: 150,
      achievementId: 'profile-complete',
      icon: Target
    },
    {
      id: 'platform-tour',
      title: 'Platform Tutorial',
      description: 'Take an interactive tour of Harmonix features',
      completed: false,
      xpReward: 200,
      icon: Sparkles
    },
    {
      id: 'first-agent',
      title: 'Deploy Your First Agent',
      description: 'Choose and deploy your first AI agent',
      completed: false,
      xpReward: 300,
      achievementId: 'first-agent',
      icon: Zap
    },
    {
      id: 'integration-setup',
      title: 'Connect Your Tools',
      description: 'Integrate with your existing business tools',
      completed: false,
      xpReward: 250,
      icon: Trophy
    },
    {
      id: 'workflow-creation',
      title: 'Create Your First Workflow',
      description: 'Build an automated workflow using your agent',
      completed: false,
      xpReward: 400,
      achievementId: 'first-automation',
      icon: Crown
    }
  ];

  const totalSteps = onboardingSteps.length;
  const completedCount = onboardingSteps.filter(step => step.completed || completedSteps.includes(step.id)).length;
  const progressPercentage = (completedCount / totalSteps) * 100;
  const totalXPAvailable = onboardingSteps.reduce((sum, step) => sum + step.xpReward, 0);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      const step = onboardingSteps.find(s => s.id === stepId);
      if (step) {
        setCompletedSteps([...completedSteps, stepId]);
        setUserXP(prev => prev + step.xpReward);
        
        // Show celebration for achievement
        if (step.achievementId) {
          setRecentAchievement(step.title);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
        
        // Auto-advance to next step
        const currentIndex = onboardingSteps.findIndex(s => s.id === stepId);
        if (currentIndex < onboardingSteps.length - 1) {
          setCurrentStep(currentIndex + 1);
        } else {
          // All steps completed
          if (onComplete) {
            onComplete();
          }
        }
      }
    }
  };

  const handleStartTutorial = (tutorialId: string) => {
    setCurrentTutorial(tutorialId);
    setShowTutorial(true);
  };

  const handleTutorialComplete = (tutorialId: string, xpEarned: number) => {
    setShowTutorial(false);
    setUserXP(prev => prev + xpEarned);
    
    if (tutorialId === 'platform-introduction') {
      handleStepComplete('platform-tour');
    }
  };

  const getStepStatus = (step: OnboardingStep, index: number) => {
    if (step.completed || completedSteps.includes(step.id)) {
      return 'completed';
    } else if (index === currentStep) {
      return 'current';
    } else if (index < currentStep) {
      return 'available';
    } else {
      return 'locked';
    }
  };

  const renderStepCard = (step: OnboardingStep, index: number) => {
    const status = getStepStatus(step, index);
    const IconComponent = step.icon;

    return (
      <Card 
        key={step.id}
        className={`relative transition-all duration-300 ${
          status === 'completed' 
            ? 'bg-harmonix-night border-harmonix-gold ring-2 ring-harmonix-gold/30' 
            : status === 'current'
              ? 'bg-harmonix-night border-harmonix-gold'
              : status === 'available'
                ? 'bg-harmonix-night border-harmonix-cedar hover:border-harmonix-sage cursor-pointer'
                : 'bg-harmonix-cedar/10 border-harmonix-cedar opacity-60'
        }`}
      >
        {/* Step Number Badge */}
        <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          status === 'completed'
            ? 'bg-harmonix-gold text-harmonix-black'
            : status === 'current'
              ? 'bg-harmonix-gold text-harmonix-black animate-pulse'
              : 'bg-harmonix-cedar text-harmonix-sage'
        }`}>
          {status === 'completed' ? '✓' : index + 1}
        </div>

        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${
              status === 'completed' 
                ? 'bg-harmonix-gold/20' 
                : status === 'current'
                  ? 'bg-harmonix-gold/20'
                  : 'bg-harmonix-cedar/20'
            }`}>
              <IconComponent className={`w-6 h-6 ${
                status === 'completed' || status === 'current'
                  ? 'text-harmonix-gold'
                  : 'text-harmonix-sage'
              }`} />
            </div>

            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${
                status === 'completed' || status === 'current'
                  ? 'text-harmonix-gold'
                  : 'text-harmonix-sage'
              }`}>
                {step.title}
              </h3>
              
              <p className="text-harmonix-sage text-sm mb-4">
                {step.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge className={`${
                  status === 'completed'
                    ? 'bg-harmonix-gold text-harmonix-black'
                    : 'bg-harmonix-cedar text-harmonix-sage'
                }`}>
                  +{step.xpReward} XP
                </Badge>

                {status === 'current' && (
                  <div className="flex gap-2">
                    {step.id === 'platform-tour' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartTutorial('platform-introduction')}
                        className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                      >
                        Start Tutorial
                      </Button>
                    )}
                    {step.id !== 'platform-tour' && (
                      <Button
                        size="sm"
                        onClick={() => handleStepComplete(step.id)}
                        className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}

                {status === 'completed' && (
                  <div className="flex items-center gap-1 text-harmonix-gold">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <Card className="w-full max-w-md mx-4 bg-gradient-to-r from-harmonix-gold/20 to-harmonix-night border-harmonix-gold">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-harmonix-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-harmonix-black" />
                </div>
                <h3 className="text-2xl font-bold text-harmonix-gold mb-2">Achievement Unlocked!</h3>
                <p className="text-harmonix-sage">{recentAchievement}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-harmonix-gold">
                <Sparkles className="w-5 h-5" />
                <span>+XP Earned</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-harmonix-night to-harmonix-cedar border-harmonix-gold">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Onboarding Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-harmonix-gold mb-2">
                {completedCount}/{totalSteps}
              </div>
              <p className="text-harmonix-sage text-sm">Steps Completed</p>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-harmonix-gold mb-2">
                {userXP.toLocaleString()}
              </div>
              <p className="text-harmonix-sage text-sm">XP Earned</p>
              <p className="text-harmonix-gold text-xs mt-1">
                {totalXPAvailable - userXP} XP remaining
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-harmonix-gold mb-2">
                Level {userLevel}
              </div>
              <p className="text-harmonix-sage text-sm">Current Level</p>
              <p className="text-harmonix-gold text-xs mt-1">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-harmonix-gold flex items-center gap-2">
          <Target className="w-6 h-6" />
          Your Journey Steps
        </h2>
        
        <div className="grid gap-4">
          {onboardingSteps.map((step, index) => renderStepCard(step, index))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-harmonix-night border-harmonix-cedar">
        <CardHeader>
          <CardTitle className="text-harmonix-gold flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleStartTutorial('platform-introduction')}
              className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 justify-start"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take Platform Tour
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/marketplace'}
              className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              Browse Agents
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Tutorial */}
      {showTutorial && (
        <InteractiveTutorial
          tutorialId={currentTutorial}
          onComplete={handleTutorialComplete}
          onSkip={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}