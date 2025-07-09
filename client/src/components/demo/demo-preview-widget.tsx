import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Play, 
  Clock, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface DemoPreviewWidgetProps {
  className?: string;
}

export function DemoPreviewWidget({ className = "" }: DemoPreviewWidgetProps) {
  const [, setLocation] = useLocation();

  const quickDemos = [
    {
      id: 'sales-automation',
      title: 'Sales Automation',
      duration: '8 min',
      description: 'See how Agent CA$H transforms lead management',
      results: '+45% conversion',
      industry: 'SaaS'
    },
    {
      id: 'customer-service',
      title: 'Customer Support',
      duration: '6 min', 
      description: 'AI-powered support that never sleeps',
      results: '24/7 availability',
      industry: 'E-commerce'
    },
    {
      id: 'operations',
      title: 'Operations Automation',
      duration: '12 min',
      description: 'Streamline workflows and boost efficiency',
      results: '60% time saved',
      industry: 'Enterprise'
    }
  ];

  return (
    <Card className={`harmonix-card-enhanced ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-harmonix-regal-gold" />
          <span>Interactive Demos</span>
        </CardTitle>
        <p className="text-harmonix-sage-fade text-sm">
          Experience AI automation in action with real-world scenarios
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {quickDemos.map((demo) => (
          <div 
            key={demo.id}
            className="p-3 rounded-lg bg-harmonix-cedar-mist/5 border border-harmonix-cedar-mist/30 hover:bg-harmonix-cedar-mist/10 transition-all duration-300 cursor-pointer"
            onClick={() => setLocation('/demo?view=scenarios')}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-white">{demo.title}</h4>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-harmonix-sage-fade text-harmonix-sage-fade"
                  >
                    {demo.industry}
                  </Badge>
                </div>
                <p className="text-harmonix-sage-fade text-sm mb-2">{demo.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-harmonix-sage-fade flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {demo.duration}
                    </span>
                    <span className="text-harmonix-regal-gold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {demo.results}
                    </span>
                  </div>
                </div>
              </div>
              <Play className="w-5 h-5 text-harmonix-regal-gold ml-3 flex-shrink-0" />
            </div>
          </div>
        ))}

        <Button
          onClick={() => setLocation('/demo?view=scenarios')}
          className="w-full mt-4 bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          View All Demo Scenarios
        </Button>
      </CardContent>
    </Card>
  );
}