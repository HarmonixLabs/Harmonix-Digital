import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  X,
  Lightbulb,
  Target,
  Star,
  Zap
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  content: React.ReactNode;
  action?: 'click' | 'hover' | 'scroll' | 'input';
  completionCriteria?: string;
  hints?: string[];
  xpReward: number;
}

interface TutorialProps {
  tutorialId: string;
  onComplete?: (tutorialId: string, xpEarned: number) => void;
  onSkip?: (tutorialId: string) => void;
  autoStart?: boolean;
}

export function InteractiveTutorial({ tutorialId, onComplete, onSkip, autoStart = false }: TutorialProps) {
  const [isActive, setIsActive] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [tutorialData, setTutorialData] = useState<TutorialStep[]>([]);

  // Initialize tutorial data based on tutorialId
  useEffect(() => {
    const tutorials = {
      'platform-introduction': [
        {
          id: 'welcome',
          title: 'Welcome to Harmonix',
          description: 'Learn the basics of navigating your AI automation platform',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Welcome to Your Digital Transformation Journey!</h3>
              <p className="text-harmonix-sage">
                Harmonix is your AI-powered automation platform. You'll learn to deploy agents, 
                create workflows, and track ROI - all designed to save you time and increase efficiency.
              </p>
              <div className="flex items-center gap-2 text-harmonix-gold">
                <Star className="w-4 h-4" />
                <span className="text-sm">This tutorial will earn you 250 XP</span>
              </div>
            </div>
          ),
          xpReward: 50
        },
        {
          id: 'navigation',
          title: 'Platform Navigation',
          description: 'Explore the main navigation menu',
          target: '.navbar',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Master the Navigation</h3>
              <p className="text-harmonix-sage">
                The navigation bar contains all essential platform features:
              </p>
              <ul className="text-harmonix-sage text-sm space-y-2">
                <li>• <strong>Dashboard:</strong> Your control center</li>
                <li>• <strong>Marketplace:</strong> Browse and deploy agents</li>
                <li>• <strong>SŌL Brain:</strong> AI-powered assistance</li>
                <li>• <strong>My Agents:</strong> Manage your deployed agents</li>
              </ul>
            </div>
          ),
          action: 'hover',
          xpReward: 25
        },
        {
          id: 'sol-brain',
          title: 'Meet SŌL Brain',
          description: 'Discover your AI business consultant',
          target: '[href="/sol-brain"]',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Your AI Business Consultant</h3>
              <p className="text-harmonix-sage">
                SŌL Brain is your intelligent assistant that helps you:
              </p>
              <ul className="text-harmonix-sage text-sm space-y-2">
                <li>• Analyze your business needs</li>
                <li>• Recommend optimal agent configurations</li>
                <li>• Calculate potential ROI</li>
                <li>• Guide automation strategies</li>
              </ul>
              <p className="text-harmonix-gold text-sm">Click "SŌL Brain" in the navigation to continue</p>
            </div>
          ),
          action: 'click',
          completionCriteria: 'Navigate to SŌL Brain page',
          xpReward: 75
        },
        {
          id: 'marketplace',
          title: 'Agent Marketplace',
          description: 'Browse available AI agents',
          target: '[href="/marketplace"]',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Discover AI Agents</h3>
              <p className="text-harmonix-sage">
                The Marketplace is where you'll find specialized AI agents for every business function:
              </p>
              <ul className="text-harmonix-sage text-sm space-y-2">
                <li>• <strong>CA$H:</strong> Sales automation specialist</li>
                <li>• <strong>Maya:</strong> HR coordination expert</li>
                <li>• <strong>Virgil:</strong> Brand strategy advisor</li>
                <li>• And many more...</li>
              </ul>
            </div>
          ),
          action: 'click',
          hints: ['Look for the "Marketplace" link in the main navigation'],
          xpReward: 50
        },
        {
          id: 'dashboard',
          title: 'Command Center',
          description: 'Your operational dashboard',
          target: '[href="/dashboard"]',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Your Command Center</h3>
              <p className="text-harmonix-sage">
                The Dashboard provides real-time insights into:
              </p>
              <ul className="text-harmonix-sage text-sm space-y-2">
                <li>• Active agent performance</li>
                <li>• Time savings and ROI metrics</li>
                <li>• System health status</li>
                <li>• Quick action buttons</li>
              </ul>
            </div>
          ),
          action: 'click',
          xpReward: 50
        }
      ],

      'agent-deployment': [
        {
          id: 'select-agent',
          title: 'Choose Your First Agent',
          description: 'Select an agent that matches your business needs',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Selecting the Right Agent</h3>
              <p className="text-harmonix-sage">
                Start with an agent that addresses your most pressing business need:
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-harmonix-cedar/20 rounded-lg">
                  <h4 className="text-harmonix-gold font-semibold">Sales Teams</h4>
                  <p className="text-harmonix-sage text-sm">Choose CA$H for lead qualification and follow-up automation</p>
                </div>
                <div className="p-3 bg-harmonix-cedar/20 rounded-lg">
                  <h4 className="text-harmonix-gold font-semibold">Content Creators</h4>
                  <p className="text-harmonix-sage text-sm">Choose Virgil for brand strategy and content planning</p>
                </div>
                <div className="p-3 bg-harmonix-cedar/20 rounded-lg">
                  <h4 className="text-harmonix-gold font-semibold">Team Managers</h4>
                  <p className="text-harmonix-sage text-sm">Choose Maya for HR coordination and team management</p>
                </div>
              </div>
            </div>
          ),
          xpReward: 100
        },
        {
          id: 'deploy-process',
          title: 'Agent Deployment',
          description: 'Learn the deployment process',
          content: (
            <div className="space-y-4">
              <h3 className="text-harmonix-gold font-semibold">Deployment Process</h3>
              <p className="text-harmonix-sage">Agent deployment involves these steps:</p>
              <div className="space-y-2">
                {[
                  'Select agent from marketplace',
                  'Review pricing and features',
                  'Configure initial settings',
                  'Connect required integrations',
                  'Confirm deployment'
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-harmonix-gold text-harmonix-black rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-harmonix-sage text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
          xpReward: 75
        }
      ]
    };

    setTutorialData(tutorials[tutorialId as keyof typeof tutorials] || []);
  }, [tutorialId]);

  const currentTutorialStep = tutorialData[currentStep];
  const progress = tutorialData.length > 0 ? ((currentStep + 1) / tutorialData.length) * 100 : 0;
  const totalXP = tutorialData.reduce((sum, step) => sum + step.xpReward, 0);

  const handleNext = () => {
    if (currentStep < tutorialData.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentTutorialStep.id]);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    if (onComplete) {
      onComplete(tutorialId, totalXP);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    if (onSkip) {
      onSkip(tutorialId);
    }
  };

  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
      // Remove highlight after 3 seconds
      setTimeout(() => {
        element.classList.remove('tutorial-highlight');
      }, 3000);
    }
  };

  useEffect(() => {
    if (currentTutorialStep?.target) {
      highlightElement(currentTutorialStep.target);
    }
  }, [currentStep, currentTutorialStep]);

  if (!isActive || !currentTutorialStep) {
    return (
      <Button
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 right-6 bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90 z-50"
      >
        <Play className="w-4 h-4 mr-2" />
        Start Tutorial
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Card className="w-full max-w-2xl mx-4 bg-harmonix-night border-harmonix-gold">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-harmonix-gold flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {currentTutorialStep.title}
              </CardTitle>
              <p className="text-harmonix-sage text-sm mt-1">{currentTutorialStep.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-harmonix-sage hover:text-harmonix-gold"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-harmonix-sage">
                Step {currentStep + 1} of {tutorialData.length}
              </span>
              <span className="text-harmonix-gold">
                +{totalXP} XP Total
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[200px]">
            {currentTutorialStep.content}
          </div>

          {/* Action Required */}
          {currentTutorialStep.action && (
            <div className="p-4 bg-harmonix-cedar/20 rounded-lg border border-harmonix-cedar">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-harmonix-gold" />
                <span className="text-harmonix-gold font-semibold">Action Required</span>
              </div>
              <p className="text-harmonix-sage text-sm">
                {currentTutorialStep.completionCriteria || `Please ${currentTutorialStep.action} the highlighted element to continue.`}
              </p>
            </div>
          )}

          {/* Hints */}
          {currentTutorialStep.hints && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Button>
              
              {showHints && (
                <div className="p-3 bg-harmonix-gold/10 rounded-lg border border-harmonix-gold/30">
                  <ul className="text-harmonix-sage text-sm space-y-1">
                    {currentTutorialStep.hints.map((hint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-harmonix-gold">•</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-harmonix-cedar">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(0)}
                className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-harmonix-cedar text-harmonix-sage hover:bg-harmonix-cedar"
              >
                Skip Tutorial
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
              >
                {currentStep === tutorialData.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete (+{currentTutorialStep.xpReward} XP)
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS for tutorial highlighting */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 1001;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: rgba(215, 183, 109, 0.3);
          border: 2px solid #d7b76d;
          border-radius: 8px;
          animation: tutorial-pulse 2s infinite;
          pointer-events: none;
          z-index: -1;
        }
        
        @keyframes tutorial-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}