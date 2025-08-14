import React, { useState } from 'react';

import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { 
  Play, Pause, RefreshCw, Zap, Brain, Users, TrendingUp, 
  MessageSquare, DollarSign, Shield, Clock, ArrowRight,
  CheckCircle, Sparkles, Bot, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Lead Capture",
      description: "Watch as CA$H agent instantly captures and qualifies leads from multiple sources",
      duration: "15 seconds",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "CRM Integration",
      description: "See seamless data sync with GoHighLevel and automatic pipeline management",
      duration: "20 seconds",
      icon: Zap,
      color: "text-green-400"
    },
    {
      title: "AI Processing",
      description: "GRACE agent handles customer inquiries with human-like understanding",
      duration: "25 seconds",
      icon: Brain,
      color: "text-purple-400"
    },
    {
      title: "Task Automation",
      description: "FLOW optimizes workflows and delegates tasks to appropriate agents",
      duration: "30 seconds",
      icon: RefreshCw,
      color: "text-yellow-400"
    },
    {
      title: "Analytics & Insights",
      description: "KAIROS provides real-time analytics and predictive insights",
      duration: "20 seconds",
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      title: "SŌL Orchestration",
      description: "Master brain coordinates all agents for seamless collaboration",
      duration: "35 seconds",
      icon: Crown,
      color: "text-harmonix-regal-gold"
    }
  ];

  const results = [
    { metric: "3x", label: "More Leads Captured", icon: Users },
    { metric: "68%", label: "Time Saved", icon: Clock },
    { metric: "$2.4M", label: "Revenue Generated", icon: DollarSign },
    { metric: "24/7", label: "Availability", icon: Shield }
  ];

  const handlePlayDemo = () => {
    setIsPlaying(true);
    // Simulate demo progression
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-harmonix-cedar-mist/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-harmonix-regal-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-harmonix-deep-forest/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 py-20 relative">
            <div className="text-center space-y-6">
              <HarmonixLogo className="w-20 h-20 mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-serif">
                Experience <span className="text-harmonix-regal-gold">Harmony AI</span> in Action
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-3xl mx-auto">
                Watch our elite AI agents transform business operations in real-time. 
                See how 5,000+ businesses are saving 40+ hours per week.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Player */}
            <div>
              <Card className="bg-harmonix-night-pine/80 border-harmonix-cedar-mist/30 overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-harmonix-deep-forest/50 to-harmonix-night-pine/50">
                  {/* Demo Screen */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!isPlaying ? (
                      <Button
                        size="lg"
                        onClick={handlePlayDemo}
                        className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-bold"
                      >
                        <Play className="mr-2 h-6 w-6" />
                        Start Live Demo
                      </Button>
                    ) : (
                      <div className="text-center space-y-4 p-8">
                        <div className={cn("w-20 h-20 mx-auto", demoSteps[currentStep].color)}>
                          {React.createElement(demoSteps[currentStep].icon, { className: "w-full h-full" })}
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {demoSteps[currentStep].title}
                        </h3>
                        <p className="text-harmonix-sage-fade">
                          {demoSteps[currentStep].description}
                        </p>
                        <div className="flex justify-center gap-2">
                          {demoSteps.map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                idx === currentStep ? "w-8 bg-harmonix-regal-gold" : "w-2 bg-harmonix-cedar-mist/50"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Live Badge */}
                  {isPlaying && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white border-red-500">
                      <span className="animate-pulse mr-2">●</span> LIVE DEMO
                    </Badge>
                  )}
                </div>
                
                {/* Controls */}
                <CardContent className="p-4 border-t border-harmonix-cedar-mist/20">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="border-harmonix-cedar-mist/30 text-white hover:bg-harmonix-cedar-mist/10"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(0)}
                        className="border-harmonix-cedar-mist/30 text-white hover:bg-harmonix-cedar-mist/10"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-harmonix-sage-fade">
                      Step {currentStep + 1} of {demoSteps.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Results */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {results.map((result, idx) => (
                  <Card key={idx} className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
                    <CardContent className="p-4 text-center">
                      <result.icon className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{result.metric}</div>
                      <div className="text-sm text-harmonix-sage-fade">{result.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Demo Steps */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                What You'll <span className="text-harmonix-regal-gold">Experience</span>
              </h2>
              
              <div className="space-y-4">
                {demoSteps.map((step, idx) => (
                  <Card 
                    key={idx}
                    className={cn(
                      "bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 transition-all duration-300",
                      currentStep === idx && isPlaying && "border-harmonix-regal-gold bg-harmonix-regal-gold/10"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn("w-12 h-12 rounded-lg bg-harmonix-deep-forest/50 flex items-center justify-center", step.color)}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                            <Badge variant="outline" className="border-harmonix-cedar-mist/30 text-harmonix-sage-fade">
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-harmonix-sage-fade">{step.description}</p>
                          {currentStep === idx && isPlaying && (
                            <div className="mt-3 h-1 bg-harmonix-cedar-mist/20 rounded-full overflow-hidden">
                              <div className="h-full bg-harmonix-regal-gold animate-pulse" style={{ width: '100%' }} />
                            </div>
                          )}
                        </div>
                        {currentStep > idx && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-regal-gold/10 border-t border-harmonix-cedar-mist/20">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Sparkles className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-harmonix-sage-fade mb-8 max-w-2xl mx-auto">
              Join 5,000+ businesses already using Harmony AI to automate operations and scale effortlessly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-bold">
                <Zap className="mr-2 h-5 w-5" />
                Start 7-Day Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10">
                <MessageSquare className="mr-2 h-5 w-5" />
                Schedule Personal Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}