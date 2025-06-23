import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, MessageSquare, Settings, Zap, ArrowRight, Users, Bot } from "lucide-react";
import { Link } from "wouter";

export default function ThankYou() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [onboardingStarted, setOnboardingStarted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentSuccess = params.get('payment') === 'success';
    const sessionId = params.get('session_id');

    if (paymentSuccess && sessionId) {
      // Trigger onboarding webhook
      fetch('/api/onboarding/start', {
        method: 'POST',
        body: JSON.stringify({ 
          userId: sessionStorage.getItem("userId"),
          sessionId 
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        console.log("Onboarding triggered:", data);
        setOnboardingStarted(true);
      })
      .catch(error => {
        console.error("Onboarding trigger failed:", error);
      });

      // Set payment data for display
      const tier = sessionStorage.getItem("selectedTier") || "Growth";
      const depositAmount = sessionStorage.getItem("depositAmount") || "0";
      const remainingBalance = sessionStorage.getItem("remainingBalance") || "0";
      
      setPaymentData({
        tier,
        depositAmount: parseFloat(depositAmount),
        remainingBalance: parseFloat(remainingBalance),
        sessionId
      });
    }
  }, []);

  const onboardingSteps = [
    {
      title: "Agent Deployment",
      description: "We're initializing your AI agents and configuring your Harmonix system",
      status: "in_progress",
      icon: Bot
    },
    {
      title: "Stack Integration", 
      description: "Connecting your tools - Gmail, CRM, Slack, and other business systems",
      status: "pending",
      icon: Settings
    },
    {
      title: "SŌL Calibration",
      description: "Your AI brain will ask clarifying questions to tailor your workflows",
      status: "pending",
      icon: Zap
    }
  ];

  const nextActions = [
    {
      title: "Start SŌL Onboarding",
      description: "Begin the guided setup with your AI systems architect",
      href: "/sol-brain?init=onboard",
      icon: MessageSquare,
      primary: true
    },
    {
      title: "View Dashboard",
      description: "Monitor your agent deployment and system status",
      href: "/dashboard",
      icon: Settings,
      primary: false
    },
    {
      title: "Schedule Setup Call",
      description: "Book 1-on-1 time with our onboarding specialist",
      href: "/book-call",
      icon: Calendar,
      primary: false
    },
    {
      title: "Browse Marketplace",
      description: "Add more specialized agents to your ecosystem",
      href: "/marketplace",
      icon: Users,
      primary: false
    }
  ];

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-harmonix-black">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-harmonix-gold mb-6">
              Welcome to Harmonix
            </h1>
            <p className="text-harmonix-sage">
              Your journey to intelligent automation begins here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-harmonix-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border border-green-500 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-harmonix-gold mb-4">
              Welcome to Your Harmony System
            </h1>
            <p className="text-xl text-harmonix-sage max-w-3xl mx-auto mb-6">
              Your payment has been processed successfully. Your intelligent automation journey begins now.
            </p>
            
            {paymentData.remainingBalance > 0 && (
              <div className="inline-flex items-center gap-2 bg-harmonix-gold/20 border border-harmonix-gold rounded-full px-6 py-2">
                <span className="text-harmonix-gold font-semibold">
                  Deposit Secured: ${paymentData.depositAmount.toLocaleString()} | 
                  Remaining: ${paymentData.remainingBalance.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Onboarding Progress */}
            <div className="space-y-6">
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    System Activation Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {onboardingSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                            step.status === "in_progress" 
                              ? "border-harmonix-gold bg-harmonix-gold/20" 
                              : step.status === "completed"
                                ? "border-green-400 bg-green-400/20"
                                : "border-harmonix-cedar bg-harmonix-black"
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              step.status === "in_progress" 
                                ? "text-harmonix-gold" 
                                : step.status === "completed"
                                  ? "text-green-400"
                                  : "text-harmonix-sage"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-harmonix-gold mb-1">{step.title}</h3>
                            <p className="text-harmonix-sage text-sm">{step.description}</p>
                            {step.status === "in_progress" && (
                              <Badge className="bg-harmonix-gold/20 text-harmonix-gold mt-2">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardHeader>
                  <CardTitle className="text-harmonix-gold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-harmonix-sage">Package:</span>
                      <Badge className="bg-harmonix-gold text-harmonix-black">
                        {paymentData.tier}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-harmonix-sage">Deposit Paid:</span>
                      <span className="text-harmonix-gold font-semibold">
                        ${paymentData.depositAmount.toLocaleString()}
                      </span>
                    </div>
                    {paymentData.remainingBalance > 0 && (
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Due on Completion:</span>
                        <span className="text-harmonix-sage">
                          ${paymentData.remainingBalance.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-harmonix-cedar">
                      <div className="flex justify-between">
                        <span className="text-harmonix-sage">Session ID:</span>
                        <span className="text-harmonix-sage text-sm font-mono">
                          {paymentData.sessionId.slice(-12)}...
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Actions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-harmonix-gold mb-6">Next Steps</h2>
              
              <div className="space-y-4">
                {nextActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        action.primary 
                          ? "bg-harmonix-gold/10 border-harmonix-gold" 
                          : "bg-harmonix-night border-harmonix-cedar hover:border-harmonix-gold/50"
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                              action.primary 
                                ? "bg-harmonix-gold text-harmonix-black" 
                                : "bg-harmonix-black border border-harmonix-cedar text-harmonix-gold"
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold mb-1 ${
                                action.primary ? "text-harmonix-gold" : "text-harmonix-gold"
                              }`}>
                                {action.title}
                              </h3>
                              <p className="text-harmonix-sage text-sm">
                                {action.description}
                              </p>
                            </div>
                            <ArrowRight className={`w-5 h-5 ${
                              action.primary ? "text-harmonix-gold" : "text-harmonix-sage"
                            }`} />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Support */}
              <Card className="bg-harmonix-night border-harmonix-cedar">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-harmonix-gold mb-3">Need Help?</h3>
                  <p className="text-harmonix-sage text-sm mb-4">
                    Our onboarding team will contact you within 24 hours. For immediate assistance:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-harmonix-sage">Email:</span>
                      <span className="text-harmonix-gold">onboarding@harmonix.ai</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-harmonix-sage">Priority Support:</span>
                      <span className="text-harmonix-gold">Available 24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}