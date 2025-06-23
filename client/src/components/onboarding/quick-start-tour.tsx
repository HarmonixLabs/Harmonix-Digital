import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { 
  PlayCircle, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Settings, 
  BarChart3,
  Zap,
  Target,
  X
} from "lucide-react";

interface QuickStartTourProps {
  onClose: () => void;
  onComplete: () => void;
}

export function QuickStartTour({ onClose, onComplete }: QuickStartTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard",
      description: "This is your command center for managing AI agents and monitoring performance.",
      icon: BarChart3,
      highlight: "dashboard-overview",
      action: "Explore Dashboard"
    },
    {
      title: "Deploy Your First Agent",
      description: "Start with Agent CA$H to automate your sales pipeline and lead management.",
      icon: Users,
      highlight: "agent-deployment",
      action: "Deploy Agent"
    },
    {
      title: "Configure Integrations",
      description: "Connect your existing tools like CRM, email, and project management systems.",
      icon: Settings,
      highlight: "integrations",
      action: "Set Up Integrations"
    },
    {
      title: "Monitor Performance",
      description: "Track your agents' performance, token usage, and ROI metrics in real-time.",
      icon: Target,
      highlight: "analytics",
      action: "View Analytics"
    }
  ];

  const nextStep = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTour = () => {
    onClose();
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="harmonix-card-enhanced max-w-lg w-full relative">
        <Button
          onClick={skipTour}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-harmonix-sage-fade hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <HarmonixLogo size="md" variant="scenic" />
          </div>
          <CardTitle className="text-2xl text-white">Quick Start Tour</CardTitle>
          <div className="flex justify-center space-x-2 mt-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  completedSteps.includes(index)
                    ? 'bg-harmonix-regal-gold'
                    : index === currentStep
                    ? 'bg-harmonix-regal-gold/60'
                    : 'bg-harmonix-cedar-mist'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-harmonix-regal-gold/20 flex items-center justify-center mx-auto mb-4">
              <currentTourStep.icon className="w-8 h-8 text-harmonix-regal-gold" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {currentTourStep.title}
            </h3>
            
            <p className="text-harmonix-sage-fade mb-6">
              {currentTourStep.description}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center">
            <Badge variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              onClick={skipTour}
              variant="ghost"
              className="text-harmonix-sage-fade hover:text-white"
            >
              Skip Tour
            </Button>
            
            <Button
              onClick={nextStep}
              className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Tour
                </>
              ) : (
                <>
                  {currentTourStep.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Progress */}
          <div className="bg-harmonix-cedar-mist/20 rounded-full h-2">
            <div
              className="bg-harmonix-regal-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}