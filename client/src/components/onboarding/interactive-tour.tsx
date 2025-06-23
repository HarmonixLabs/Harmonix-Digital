import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ArrowRight, Target, CheckCircle } from "lucide-react";
import { SacredButton } from "@/components/ui/sacred-button";
import { FadeIn } from "@/components/ui/micro-animations";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'highlight' | 'click' | 'scroll';
}

interface InteractiveTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Harmonix',
    content: 'This quick tour will show you the key features to get started with AI automation.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'dashboard',
    title: 'Your Command Center',
    content: 'The dashboard shows your AI agents, performance metrics, and recent activity at a glance.',
    target: '[data-tour="dashboard"]',
    position: 'bottom',
    action: 'highlight'
  },
  {
    id: 'agents',
    title: 'My Agents',
    content: 'View and manage your deployed AI agents. Each agent handles specific business processes.',
    target: '[data-tour="my-agents"]',
    position: 'bottom',
    action: 'highlight'
  },
  {
    id: 'marketplace',
    title: 'Agent Marketplace',
    content: 'Discover and deploy new AI agents tailored to your industry and business needs.',
    target: '[data-tour="marketplace"]',
    position: 'bottom',
    action: 'highlight'
  },
  {
    id: 'tokens',
    title: 'Token Balance',
    content: 'Your token balance powers AI operations. Tokens are consumed when agents process tasks.',
    target: '[data-tour="tokens"]',
    position: 'left',
    action: 'highlight'
  },
  {
    id: 'chat',
    title: 'AI Assistant',
    content: 'Get help anytime with our contextual AI assistant. It understands where you are and what you need.',
    target: '[data-tour="chat-button"]',
    position: 'left',
    action: 'highlight'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content: 'You now know the basics. Ready to deploy your first AI agent and start automating?',
    target: 'body',
    position: 'bottom'
  }
];

export function InteractiveTour({ isActive, onComplete, onSkip }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      startTour();
    } else {
      setIsVisible(false);
      clearHighlight();
    }

    return () => {
      clearHighlight();
    };
  }, [isActive]);

  useEffect(() => {
    if (isVisible) {
      executeStepAction(tourSteps[currentStep]);
    }
  }, [currentStep, isVisible]);

  const startTour = () => {
    setCurrentStep(0);
    // Add tour overlay
    document.body.classList.add('tour-active');
  };

  const executeStepAction = (step: TourStep) => {
    clearHighlight();
    
    if (step.action === 'highlight' && step.target !== 'body') {
      const element = document.querySelector(step.target) as HTMLElement;
      if (element) {
        highlightElement(element);
        scrollToElement(element);
      }
    }
  };

  const highlightElement = (element: HTMLElement) => {
    setHighlightedElement(element);
    element.classList.add('tour-highlight');
    
    // Create spotlight effect
    const spotlight = document.createElement('div');
    spotlight.className = 'tour-spotlight';
    spotlight.style.position = 'fixed';
    spotlight.style.top = element.getBoundingClientRect().top - 10 + 'px';
    spotlight.style.left = element.getBoundingClientRect().left - 10 + 'px';
    spotlight.style.width = element.offsetWidth + 20 + 'px';
    spotlight.style.height = element.offsetHeight + 20 + 'px';
    spotlight.style.border = '2px solid #d7b76d';
    spotlight.style.borderRadius = '8px';
    spotlight.style.backgroundColor = 'rgba(215, 183, 109, 0.1)';
    spotlight.style.pointerEvents = 'none';
    spotlight.style.zIndex = '9999';
    spotlight.style.animation = 'tour-pulse 2s infinite';
    
    document.body.appendChild(spotlight);
    
    // Remove spotlight after animation
    setTimeout(() => {
      if (document.body.contains(spotlight)) {
        document.body.removeChild(spotlight);
      }
    }, 3000);
  };

  const scrollToElement = (element: HTMLElement) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  const clearHighlight = () => {
    if (highlightedElement) {
      highlightedElement.classList.remove('tour-highlight');
      setHighlightedElement(null);
    }
    
    // Remove any existing spotlights
    const spotlights = document.querySelectorAll('.tour-spotlight');
    spotlights.forEach(spotlight => {
      if (document.body.contains(spotlight)) {
        document.body.removeChild(spotlight);
      }
    });
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    clearHighlight();
    document.body.classList.remove('tour-active');
    setIsVisible(false);
    onComplete();
  };

  const skipTour = () => {
    clearHighlight();
    document.body.classList.remove('tour-active');
    setIsVisible(false);
    onSkip();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Tour Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      
      {/* Tour Tooltip */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <FadeIn>
          <div className="bg-harmonix-black/95 backdrop-blur-sm border border-harmonix-gold/30 rounded-lg p-6 max-w-md shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="harmonix-header-font text-lg text-white mb-1">
                  {currentTourStep.title}
                </h3>
                <Badge variant="outline" className="text-xs text-harmonix-gold border-harmonix-gold">
                  Step {currentStep + 1} of {tourSteps.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-harmonix-sage hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-harmonix-sage mb-6">
              {currentTourStep.content}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-harmonix-pine/30 rounded-full h-2">
                <div 
                  className="bg-harmonix-gold rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-harmonix-sage"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </SacredButton>

              {currentStep === tourSteps.length - 1 ? (
                <SacredButton
                  onClick={completeTour}
                  className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Tour
                </SacredButton>
              ) : (
                <SacredButton
                  onClick={handleNext}
                  className="bg-harmonix-gold text-harmonix-black hover:bg-harmonix-gold/90"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </SacredButton>
              )}
            </div>

            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-harmonix-sage hover:text-white text-xs"
              >
                Skip tour
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Add tour styles */}
      <style jsx global>{`
        .tour-active {
          overflow: hidden;
        }
        
        .tour-highlight {
          position: relative;
          z-index: 9999;
        }
        
        @keyframes tour-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(215, 183, 109, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(215, 183, 109, 0);
          }
        }
      `}</style>
    </>
  );
}