import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SolBrain } from "@/components/sol-brain";
import { TokenMeter } from "@/components/token-meter";
import { 
  ChevronRight, 
  ChevronLeft, 
  TrendingUp, 
  Brain, 
  Sparkles, 
  Users, 
  Shield, 
  Zap,
  Play,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  action?: {
    label: string;
    handler: () => void;
  };
}

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Harmonix',
      description: 'Your AI automation platform with regal wisdom and trust',
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto">
            <SolBrain size="lg" animated={true} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Welcome to the <span className="text-harmony-gold">Future of Business Automation</span>
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Harmonix combines AI agents, blockchain technology, and spiritual wisdom 
              to help visionary businesses Build, Automate, and Exit through intelligent systems.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-harmony-gold text-slate-900">AI Agents</Badge>
              <Badge className="bg-teal-600 text-white">SŌL Brain</Badge>
              <Badge className="bg-purple-600 text-white">NFT Marketplace</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sol-brain',
      title: 'Meet SŌL - Your AI Orchestrator',
      description: 'The spiritual tech brain that coordinates all your agents',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-harmony-gold">The SŌL Brain Engine</h3>
              <p className="text-gray-300">
                SŌL (pronounced "soul") is our AI orchestration engine that coordinates 
                all your digital team members. Think of it as your spiritual tech conductor, 
                managing agent interactions with lotus protocol wisdom.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Orchestrates 12+ specialized agents</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Real-time task coordination</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Secure multi-tenant architecture</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <SolBrain size="lg" showAgentNodes={true} animated={true} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'agents',
      title: 'Your Digital Team Members',
      description: 'Meet the AI agents that will transform your business',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-harmony-gold text-center">
            12+ Specialized AI Agents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'CA$HFLOW', type: 'Sales Hunter', icon: TrendingUp, color: 'from-red-500 to-yellow-500' },
              { name: 'VIRGIL', type: 'Concierge', icon: Users, color: 'from-blue-500 to-teal-500' },
              { name: 'TALENT', type: 'HR Specialist', icon: Users, color: 'from-purple-500 to-pink-500' },
              { name: 'EXEC', type: 'Assistant', icon: Brain, color: 'from-green-500 to-emerald-500' },
              { name: 'SOCIAL', type: 'Media Manager', icon: Sparkles, color: 'from-orange-500 to-red-500' },
              { name: 'PROJECT', type: 'Manager', icon: CheckCircle, color: 'from-indigo-500 to-blue-500' }
            ].map((agent, index) => (
              <Card key={index} className="bg-slate-700/50 border-harmony-gold/30 hover:scale-105 transition-transform">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-harmony-gold">{agent.name}</h4>
                  <p className="text-xs text-gray-400">{agent.type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-gray-300">
            Each agent is specialized for specific business functions and can work independently or as part of coordinated workflows.
          </p>
        </div>
      )
    },
    {
      id: 'tokens',
      title: 'Token Economy & Usage',
      description: 'How the Harmony token system powers your automation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-harmony-gold">Harmony Token System</h3>
              <p className="text-gray-300">
                Every AI interaction uses Harmony tokens. Your organization gets a token quota 
                that recharges monthly, ensuring fair usage across all your team members.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Task Processing</span>
                  <span className="text-harmony-gold">50-200 tokens</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Agent Conversations</span>
                  <span className="text-harmony-gold">25-100 tokens</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-gray-300">Complex Workflows</span>
                  <span className="text-harmony-gold">100-500 tokens</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <TokenMeter used={1200} total={5000} size="lg" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nft-marketplace',
      title: 'NFT Agent Marketplace',
      description: 'Own, trade, and collect AI agents as unique NFTs',
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-harmony-gold text-center">
            Collectible AI Agent NFTs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Why Agent NFTs?</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">True ownership of AI capabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Trade agents in the marketplace</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Collectible rarity tiers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-harmony-gold" />
                  <span className="text-sm text-gray-300">Enhanced stats and abilities</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Rarity Levels</h4>
              <div className="space-y-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black w-full justify-center">
                  LEGENDARY - Ultimate Performance
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white w-full justify-center">
                  EPIC - Enhanced Abilities
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-400 to-teal-500 text-white w-full justify-center">
                  RARE - Improved Stats
                </Badge>
                <Badge className="bg-gray-500 text-white w-full justify-center">
                  COMMON - Standard Features
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Ready to Begin Your Journey',
      description: 'Your first steps to automation mastery',
      content: (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-harmony-gold">
            You're Ready to Transform Your Business
          </h3>
          <p className="text-gray-300 max-w-lg mx-auto">
            You now understand the power of Harmonix. Let's get you started with your first agent deployment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="bg-slate-700/50 border-harmony-gold/30">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-harmony-gold mb-2">Deploy CA$HFLOW</h4>
                <p className="text-xs text-gray-400">Start with our flagship sales agent</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-700/50 border-harmony-gold/30">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-harmony-gold mb-2">Mint Your First NFT</h4>
                <p className="text-xs text-gray-400">Own a collectible agent</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-700/50 border-harmony-gold/30">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-harmony-gold mb-2">Explore Marketplace</h4>
                <p className="text-xs text-gray-400">Discover all available agents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    markStepCompleted(currentStepData.id);
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 border-harmony-gold/30">
        <CardHeader className="border-b border-harmony-gold/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-harmony-gold">
                {currentStepData.title}
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                {currentStepData.description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={onSkip}
              className="text-gray-400 hover:text-white"
            >
              Skip Tour
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-harmony-gold">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Navigator */}
          <div className="flex justify-center space-x-2 mt-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-harmony-gold scale-125'
                    : index < currentStep
                    ? 'bg-teal-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                title={step.title}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="p-8 overflow-y-auto max-h-[60vh]">
          {currentStepData.content}
        </CardContent>
        
        <div className="p-6 border-t border-harmony-gold/20 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {currentStepData.action && (
              <Button
                variant="outline"
                onClick={currentStepData.action.handler}
                className="border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-slate-900"
              >
                <Play className="h-4 w-4 mr-2" />
                {currentStepData.action.label}
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="bg-harmony-gold text-slate-900 hover:bg-yellow-400"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Tour
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}