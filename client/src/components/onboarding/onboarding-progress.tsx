import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function OnboardingProgress({ currentStep, totalSteps, stepTitles }: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-harmonix-sage-fade">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                isCompleted
                  ? 'bg-harmonix-regal-gold border-harmonix-regal-gold'
                  : isCurrent
                  ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/20'
                  : 'border-harmonix-cedar-mist bg-harmonix-night-pine'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-harmonix-deep-forest" />
                ) : (
                  <span className={`text-xs font-bold ${
                    isCurrent ? 'text-harmonix-regal-gold' : 'text-harmonix-sage-fade'
                  }`}>
                    {stepNumber}
                  </span>
                )}
              </div>
              <span className={`text-xs text-center max-w-16 ${
                isCurrent ? 'text-harmonix-regal-gold' : 'text-harmonix-sage-fade'
              }`}>
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}