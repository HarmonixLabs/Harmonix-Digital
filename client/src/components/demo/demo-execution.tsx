import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  BarChart3, 
  Users, 
  TrendingUp,
  Activity,
  ArrowRight,
  X,
  PlayCircle
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  agent: string;
  duration: number;
  status: 'pending' | 'running' | 'completed';
  metrics?: {
    label: string;
    value: string;
    change?: string;
  }[];
}

interface DemoExecutionProps {
  scenario: any;
  onComplete: () => void;
  onClose: () => void;
}

export function DemoExecution({ scenario, onComplete, onClose }: DemoExecutionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<DemoStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize demo steps based on scenario
  useEffect(() => {
    const demoSteps = generateDemoSteps(scenario);
    setSteps(demoSteps);
  }, [scenario]);

  // Auto-run demo
  useEffect(() => {
    if (steps.length > 0 && !isRunning) {
      startDemo();
    }
  }, [steps]);

  const generateDemoSteps = (scenario: any): DemoStep[] => {
    const baseSteps = [
      {
        id: 'initialization',
        title: 'Platform Initialization',
        description: 'Setting up AI agents and connecting to data sources',
        agent: 'SŌL Brain',
        duration: 2000
      },
      {
        id: 'data_ingestion',
        title: 'Data Ingestion',
        description: 'Importing and processing existing business data',
        agent: scenario.agents[0] || 'Agent CA$H',
        duration: 3000
      },
      {
        id: 'analysis',
        title: 'AI Analysis',
        description: 'Analyzing patterns and identifying optimization opportunities',
        agent: scenario.agents[1] || 'Concierge Agent',
        duration: 4000
      },
      {
        id: 'automation',
        title: 'Workflow Automation',
        description: 'Implementing automated processes and triggers',
        agent: scenario.agents[0] || 'Agent CA$H',
        duration: 3000
      },
      {
        id: 'results',
        title: 'Results Generation',
        description: 'Generating reports and performance metrics',
        agent: 'SŌL Brain',
        duration: 2000
      }
    ];

    return baseSteps.map((step, index) => ({
      ...step,
      status: 'pending' as const,
      metrics: index === baseSteps.length - 1 ? generateMetrics(scenario) : undefined
    }));
  };

  const generateMetrics = (scenario: any) => [
    {
      label: 'Lead Conversion',
      value: `+${scenario.demoData.conversionRate}%`,
      change: '+15%'
    },
    {
      label: 'Time Efficiency',
      value: `${scenario.demoData.timeSaved}h saved`,
      change: '+78%'
    },
    {
      label: 'ROI Increase',
      value: `+${scenario.demoData.roiIncrease}%`,
      change: '+45%'
    },
    {
      label: 'Lead Volume',
      value: `${scenario.demoData.leadVolume}`,
      change: '+120%'
    }
  ];

  const startDemo = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < steps.length; i++) {
      // Update current step to running
      setCurrentStep(i);
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'running' } : step
      ));

      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));

      // Update progress
      setProgress(((i + 1) / steps.length) * 100);
    }

    setIsRunning(false);
    
    // Auto-close after showing results
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running': return <Clock className="w-5 h-5 text-harmonix-regal-gold animate-spin" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-harmonix-regal-gold" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-harmonix-sage-fade" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="harmonix-card-enhanced max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <HarmonixLogo size="sm" variant="icon" />
            <div>
              <CardTitle className="text-2xl text-white">{scenario.title} Demo</CardTitle>
              <p className="text-harmonix-sage-fade">{scenario.industry} Use Case</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-harmonix-sage-fade hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div>
            <div className="flex justify-between text-sm text-harmonix-sage-fade mb-2">
              <span>Demo Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Demo Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  step.status === 'running'
                    ? 'border-harmonix-regal-gold bg-harmonix-regal-gold/10'
                    : step.status === 'completed'
                    ? 'border-harmonix-sage-fade bg-harmonix-sage-fade/10'
                    : 'border-harmonix-cedar-mist bg-harmonix-cedar-mist/5'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-harmonix-sage-fade text-harmonix-sage-fade"
                      >
                        {step.agent}
                      </Badge>
                    </div>
                    <p className="text-harmonix-sage-fade text-sm">{step.description}</p>
                    
                    {/* Show metrics for final step */}
                    {step.metrics && step.status === 'completed' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {step.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-bold text-harmonix-regal-gold">
                              {metric.value}
                            </div>
                            <div className="text-xs text-harmonix-sage-fade">
                              {metric.label}
                            </div>
                            {metric.change && (
                              <div className="text-xs text-green-400">
                                {metric.change}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Metrics */}
          {isRunning && currentStep > 1 && (
            <Card className="bg-harmonix-cedar-mist/10 border-harmonix-cedar-mist">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-harmonix-regal-gold" />
                  <span>Live Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.floor(Math.random() * 50) + 25}
                    </div>
                    <div className="text-xs text-harmonix-sage-fade">Active Processes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-harmonix-regal-gold">
                      {Math.floor(Math.random() * 500) + 200}
                    </div>
                    <div className="text-xs text-harmonix-sage-fade">Data Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.floor(Math.random() * 10) + 5}s
                    </div>
                    <div className="text-xs text-harmonix-sage-fade">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      98.{Math.floor(Math.random() * 9)}%
                    </div>
                    <div className="text-xs text-harmonix-sage-fade">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demo Complete Actions */}
          {progress === 100 && (
            <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Demo Complete!</h3>
              <p className="text-harmonix-sage-fade mb-4">
                Your AI automation scenario has been successfully demonstrated. 
                Ready to implement this in your business?
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => window.open('/pricing', '_blank')}
                  className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest"
                >
                  Close Demo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}