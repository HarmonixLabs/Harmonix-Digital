import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  Rocket, 
  Users, 
  Settings, 
  PlayCircle,
  Calendar,
  MessageSquare,
  BarChart3
} from "lucide-react";

interface OnboardingCompletionProps {
  onboardingData: any;
  onContinueToDashboard: () => void;
}

export function OnboardingCompletion({ onboardingData, onContinueToDashboard }: OnboardingCompletionProps) {
  const [setupProgress, setSetupProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const { toast } = useToast();

  const setupTasks = [
    "Creating your organization profile",
    "Configuring selected AI agents", 
    "Setting up integrations",
    "Initializing workflows",
    "Preparing your dashboard",
    "Finalizing setup"
  ];

  useEffect(() => {
    // Simulate setup process
    let taskIndex = 0;
    const interval = setInterval(() => {
      if (taskIndex < setupTasks.length) {
        setCurrentTask(setupTasks[taskIndex]);
        setSetupProgress(((taskIndex + 1) / setupTasks.length) * 100);
        
        if (taskIndex > 0) {
          setCompletedTasks(prev => [...prev, setupTasks[taskIndex - 1]]);
        }
        
        taskIndex++;
      } else {
        setCompletedTasks(prev => [...prev, setupTasks[setupTasks.length - 1]]);
        setCurrentTask("Setup complete!");
        clearInterval(interval);
        
        // Show completion toast
        setTimeout(() => {
          toast({
            title: "Welcome to Harmonix!",
            description: "Your AI automation platform is ready to use.",
          });
        }, 1000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getRecommendedAgents = () => {
    const agentMap: Record<string, string> = {
      sales: "Agent CA$H",
      concierge: "Concierge Agent", 
      hr: "HR Agent",
      executive: "Executive Assistant",
      content: "Content Creation Agent",
      social: "Social Media Agent"
    };
    
    return onboardingData.selectedAgents.map((id: string) => agentMap[id] || id);
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (onboardingData.automationAreas.includes("Sales pipeline management")) {
      steps.push({
        icon: Users,
        title: "Deploy Agent CA$H",
        description: "Start automating your sales pipeline and lead management",
        action: "Deploy Now"
      });
    }
    
    if (onboardingData.integrations.includes("Go High Level")) {
      steps.push({
        icon: Settings,
        title: "Connect Go High Level",
        description: "Sync your CRM for seamless lead tracking and automation",
        action: "Configure"
      });
    }
    
    steps.push({
      icon: BarChart3,
      title: "Review Analytics",
      description: "Monitor your AI agent performance and ROI metrics",
      action: "View Dashboard"
    });
    
    return steps;
  };

  return (
    <div className="min-h-screen harmonix-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <HarmonixLogo size="lg" variant="scenic" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">
            {setupProgress === 100 ? "Welcome to Harmonix!" : "Setting Up Your Platform"}
          </h1>
          <p className="text-harmonix-sage-fade text-lg">
            {setupProgress === 100 
              ? "Your AI automation platform is ready to transform your business"
              : "We're configuring your personalized AI agents and workflows"
            }
          </p>
        </div>

        {/* Setup Progress */}
        {setupProgress < 100 && (
          <Card className="harmonix-card-enhanced">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center space-x-2">
                <Settings className="w-6 h-6 text-harmonix-regal-gold" />
                <span>Platform Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-harmonix-sage-fade mb-2">
                  <span>Progress</span>
                  <span>{Math.round(setupProgress)}%</span>
                </div>
                <Progress value={setupProgress} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-harmonix-regal-gold animate-spin" />
                  <span className="text-white font-medium">{currentTask}</span>
                </div>
                
                {completedTasks.map((task, index) => (
                  <div key={index} className="flex items-center space-x-3 opacity-75">
                    <CheckCircle className="w-5 h-5 text-harmonix-regal-gold" />
                    <span className="text-harmonix-sage-fade">{task}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Summary */}
        {setupProgress === 100 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Summary */}
            <Card className="harmonix-card-enhanced">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-harmonix-regal-gold" />
                  <span>Your Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-harmonix-regal-gold mb-2">Company Profile</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-harmonix-sage-fade">
                      <span className="text-white">Industry:</span> {onboardingData.industry}
                    </p>
                    <p className="text-harmonix-sage-fade">
                      <span className="text-white">Size:</span> {onboardingData.companySize}
                    </p>
                    <p className="text-harmonix-sage-fade">
                      <span className="text-white">Revenue:</span> {onboardingData.monthlyRevenue}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-harmonix-regal-gold mb-2">Selected Agents</h4>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedAgents().map((agent: string, index: number) => (
                      <Badge 
                        key={index}
                        className="bg-harmonix-regal-gold text-harmonix-deep-forest"
                      >
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-harmonix-regal-gold mb-2">Plan Tier</h4>
                  <Badge variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold">
                    {onboardingData.tier?.charAt(0).toUpperCase() + onboardingData.tier?.slice(1)}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-harmonix-regal-gold mb-2">Priority Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.primaryGoals.slice(0, 3).map((goal: string, index: number) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="border-harmonix-sage-fade text-harmonix-sage-fade text-xs"
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="harmonix-card-enhanced">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center space-x-2">
                  <Rocket className="w-6 h-6 text-harmonix-regal-gold" />
                  <span>Recommended Next Steps</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getNextSteps().map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-harmonix-cedar-mist/10 border border-harmonix-cedar-mist">
                    <step.icon className="w-5 h-5 text-harmonix-regal-gold mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">{step.title}</h5>
                      <p className="text-sm text-harmonix-sage-fade">{step.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold hover:text-harmonix-deep-forest"
                    >
                      {step.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {setupProgress === 100 && (
          <div className="text-center space-y-4">
            <Button
              onClick={onContinueToDashboard}
              className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold px-8 py-4 text-lg"
              size="lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Launch My Dashboard
            </Button>
            
            <div className="flex justify-center space-x-4 text-sm">
              <Button variant="ghost" className="text-harmonix-sage-fade hover:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Training Call
              </Button>
              <Button variant="ghost" className="text-harmonix-sage-fade hover:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}