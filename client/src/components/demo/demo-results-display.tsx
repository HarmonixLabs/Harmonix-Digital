import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle, 
  BarChart3,
  Target,
  ArrowUpRight
} from "lucide-react";

interface DemoResultsDisplayProps {
  scenario: any;
  metrics: {
    label: string;
    value: string;
    change: string;
    icon: React.ComponentType<any>;
    color: string;
  }[];
  className?: string;
}

export function DemoResultsDisplay({ scenario, metrics, className = "" }: DemoResultsDisplayProps) {
  return (
    <Card className={`harmonix-card-enhanced ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center space-x-2">
          <CheckCircle className="w-6 h-6 text-harmonix-regal-gold" />
          <span>Demo Results: {scenario.title}</span>
        </CardTitle>
        <p className="text-harmonix-sage-fade">
          Performance improvements achieved through AI automation
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-harmonix-cedar-mist/10 border border-harmonix-cedar-mist/30"
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                <Badge 
                  variant="outline" 
                  className={`text-xs ${metric.color} border-current`}
                >
                  {metric.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-harmonix-sage-fade">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* ROI Summary */}
        <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-harmonix-regal-gold">ROI Summary</h4>
            <Target className="w-5 h-5 text-harmonix-regal-gold" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">
                +{scenario.demoData.roiIncrease}%
              </div>
              <div className="text-xs text-harmonix-sage-fade">ROI Increase</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {scenario.demoData.timeSaved}h
              </div>
              <div className="text-xs text-harmonix-sage-fade">Time Saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                ${(scenario.demoData.roiIncrease * 1000).toLocaleString()}
              </div>
              <div className="text-xs text-harmonix-sage-fade">Est. Monthly Value</div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        <div>
          <h4 className="font-semibold text-harmonix-regal-gold mb-3">Implementation Timeline</h4>
          <div className="space-y-2">
            {[
              { phase: 'Setup & Configuration', duration: '1-2 days', status: 'completed' },
              { phase: 'Agent Training', duration: '3-5 days', status: 'completed' },
              { phase: 'Integration Testing', duration: '2-3 days', status: 'completed' },
              { phase: 'Full Deployment', duration: '1 day', status: 'completed' }
            ].map((phase, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-harmonix-cedar-mist/5">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-harmonix-regal-gold" />
                  <span className="text-white text-sm">{phase.phase}</span>
                </div>
                <span className="text-harmonix-sage-fade text-xs">{phase.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="pt-4 border-t border-harmonix-cedar-mist/30">
          <h4 className="font-semibold text-harmonix-regal-gold mb-2">Ready to Get Started?</h4>
          <p className="text-harmonix-sage-fade text-sm">
            These results can be implemented in your business within 1-2 weeks. 
            Schedule a consultation to discuss your specific requirements.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}