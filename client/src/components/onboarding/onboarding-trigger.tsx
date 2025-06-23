import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingWizard } from "./onboarding-wizard";
import { HelpCircle, Play } from "lucide-react";

interface OnboardingTriggerProps {
  variant?: "button" | "help" | "tour";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OnboardingTrigger({ variant = "button", size = "md", className = "" }: OnboardingTriggerProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const buttonContent = {
    button: {
      icon: Play,
      text: "Take Platform Tour"
    },
    help: {
      icon: HelpCircle,
      text: "Help & Tour"
    },
    tour: {
      icon: Play,
      text: "Interactive Tour"
    }
  };

  const content = buttonContent[variant];
  const IconComponent = content.icon;

  return (
    <>
      <Button
        variant="outline"
        size={size}
        onClick={() => setShowOnboarding(true)}
        className={`border-harmony-gold text-harmony-gold hover:bg-harmony-gold hover:text-slate-900 ${className}`}
      >
        <IconComponent className="h-4 w-4 mr-2" />
        {content.text}
      </Button>

      {showOnboarding && (
        <OnboardingWizard 
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}