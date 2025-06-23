import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Zap,
  BarChart3,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface DemoScenario {
  id: string;
  title: string;
  industry: string;
  description: string;
  useCase: string;
  agents: string[];
  expectedOutcomes: string[];
  demoData: {
    leadVolume: number;
    conversionRate: number;
    timeSaved: number;
    roiIncrease: number;
  };
  duration: number;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  icon: React.ComponentType<any>;
}

interface DemoScenarioCardProps {
  scenario: DemoScenario;
  onStartDemo: (scenario: DemoScenario) => void;
  isRunning?: boolean;
  className?: string;
}

export function DemoScenarioCard({ scenario, onStartDemo, isRunning = false, className = "" }: DemoScenarioCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-harmonix-sage-fade/20 text-harmonix-sage-fade border-harmonix-sage-fade/30';
    }
  };

  return (
    <Card 
      className={`harmonix-card-enhanced cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-105 border-harmonix-regal-gold' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-harmonix-regal-gold/20 flex items-center justify-center">
              <scenario.icon className="w-6 h-6 text-harmonix-regal-gold" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">{scenario.title}</CardTitle>
              <p className="text-harmonix-sage-fade text-sm">{scenario.industry}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${getComplexityColor(scenario.complexity)}`}
          >
            {scenario.complexity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <p className="text-harmonix-sage-fade text-sm leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Use Case */}
        <div className="bg-harmonix-cedar-mist/10 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-harmonix-regal-gold mb-2">Use Case</h4>
          <p className="text-white text-sm">{scenario.useCase}</p>
        </div>

        {/* Agents Involved */}
        <div>
          <h4 className="text-sm font-semibold text-harmonix-regal-gold mb-3">AI Agents</h4>
          <div className="flex flex-wrap gap-2">
            {scenario.agents.map((agent, index) => (
              <Badge 
                key={index}
                className="bg-harmonix-sage-fade/20 text-harmonix-sage-fade border-harmonix-sage-fade/30 text-xs"
              >
                {agent}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expected Outcomes */}
        <div>
          <h4 className="text-sm font-semibold text-harmonix-regal-gold mb-3">Expected Results</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">+{scenario.demoData.conversionRate}%</div>
              <div className="text-xs text-harmonix-sage-fade">Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{scenario.demoData.timeSaved}h</div>
              <div className="text-xs text-harmonix-sage-fade">Time Saved</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={() => onStartDemo(scenario)}
            disabled={isRunning}
            className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold transition-all duration-300"
            size="lg"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Demo...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Demo ({scenario.duration}min)
              </>
            )}
          </Button>
        </div>

        {/* Demo Info */}
        <div className="flex items-center justify-between text-xs text-harmonix-sage-fade pt-2">
          <span>Duration: {scenario.duration} minutes</span>
          <span>Live data simulation</span>
        </div>
      </CardContent>
    </Card>
  );
}