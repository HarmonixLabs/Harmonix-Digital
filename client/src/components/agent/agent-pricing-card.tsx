import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Zap, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentPricingCardProps {
  name: string;
  description: string;
  monthlyPrice: number;
  tokenUsage: "Low" | "Moderate" | "High";
  integrations: string[];
  features: string[];
  isPopular?: boolean;
  onLearnMore?: () => void;
  onDeploy?: () => void;
  className?: string;
}

export function AgentPricingCard({
  name,
  description,
  monthlyPrice,
  tokenUsage,
  integrations,
  features,
  isPopular = false,
  onLearnMore,
  onDeploy,
  className
}: AgentPricingCardProps) {
  const tokenColor = {
    Low: "text-green-400",
    Moderate: "text-yellow-400", 
    High: "text-red-400"
  }[tokenUsage];

  return (
    <TooltipProvider>
      <Card className={cn(
        "relative transition-all duration-300 hover:shadow-lg hover:shadow-harmonix-regal-gold/20",
        "bg-harmonix-night-pine/50 border-harmonix-sage-fade/30",
        isPopular && "border-harmonix-regal-gold",
        className
      )}>
        {isPopular && (
          <Badge className="absolute -top-2 left-4 bg-harmonix-regal-gold text-harmonix-deep-forest text-xs">
            Most Popular
          </Badge>
        )}
        
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-harmonix-regal-gold">{name}</h3>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    To use this agent, you need the Harmony Platform installed.
                    Already installed? You're good to go.
                    Not yet? Choose a setup plan first.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-harmonix-sage-fade">{description}</p>
          </div>

          {/* Primary Pricing Display */}
          <div className="text-center py-3 bg-harmonix-deep-forest/50 rounded-lg">
            <div className="text-2xl font-bold text-harmonix-regal-gold">
              ${monthlyPrice}/month
            </div>
            <div className="text-xs text-harmonix-sage-fade">
              Ongoing monthly cost
            </div>
          </div>

          {/* Token Usage & Integrations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-harmonix-sage-fade">Token Usage:</span>
              <span className={cn("font-medium", tokenColor)}>
                <Zap className="w-3 h-3 inline mr-1" />
                {tokenUsage}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-harmonix-sage-fade">Integrations:</div>
              <div className="flex flex-wrap gap-1">
                {integrations.slice(0, 3).map((integration, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className="text-xs border-harmonix-sage-fade/30 text-harmonix-sage-fade"
                  >
                    <Link2 className="w-3 h-3 mr-1" />
                    {integration}
                  </Badge>
                ))}
                {integrations.length > 3 && (
                  <Badge variant="outline" className="text-xs border-harmonix-sage-fade/30 text-harmonix-sage-fade">
                    +{integrations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-harmonix-sage-fade">Key Features:</div>
            <div className="space-y-1">
              {features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center text-xs text-harmonix-sage-fade">
                  <div className="w-1 h-1 bg-harmonix-regal-gold rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLearnMore}
              className="flex-1 border-harmonix-sage-fade/30 text-harmonix-sage-fade hover:bg-harmonix-sage-fade/10"
            >
              Learn More
            </Button>
            <Button
              size="sm"
              onClick={onDeploy}
              className="flex-1 bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
            >
              Deploy
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}