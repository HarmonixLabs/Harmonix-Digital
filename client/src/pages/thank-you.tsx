import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EnhancedSolBrain } from "@/components/sol/enhanced-sol-brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, ArrowRight, Brain, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThankYouPage() {
  const [, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('payment');
    setPaymentStatus(status);
    setIsLoading(false);

    // Trigger CRM update and onboarding automation
    if (status === 'success') {
      // Add to CRM via webhook
      fetch('/api/crm/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: 'checkout_success',
          page: 'thank-you'
        })
      }).catch(console.error);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-harmonix-deep-forest flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-harmonix-regal-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-harmonix-deep-forest">
        <Navbar />
        
        {/* Success Hero */}
        <section className="relative py-16 sm:py-20 lg:py-24">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto text-center">
              {/* Success Animation */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-harmonix-regal-gold rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <CheckCircle className="w-12 h-12 text-harmonix-deep-forest" />
                  </div>
                  <div className="absolute inset-0 bg-harmonix-regal-gold rounded-full animate-ping opacity-20" />
                </div>
              </div>

              <Badge className="mb-6 bg-harmonix-regal-gold/10 text-harmonix-regal-gold border-harmonix-regal-gold/30 text-lg px-6 py-3">
                <Sparkles className="w-5 h-5 mr-2" />
                Payment Successful
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-harmonix-regal-gold font-serif">
                Welcome to Harmonix
              </h1>

              <p className="text-lg sm:text-xl text-harmonix-sage-fade max-w-3xl mx-auto leading-relaxed mb-8">
                Your AI workforce is being activated. SŌL brain is preparing your agents and 
                configuring your sacred automation systems. Get ready for timeless sovereignty.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Button 
                  size="lg"
                  className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                  onClick={() => setLocation('/onboarding')}
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Begin Onboarding
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                  onClick={() => setLocation('/dashboard')}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SŌL Brain Activation */}
        <section className="py-12 sm:py-16 bg-harmonix-night-pine/30">
          <div className="harmonix-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-harmonix-regal-gold font-serif">
                  SŌL Brain Activated
                </h2>
                
                <p className="text-lg text-harmonix-sage-fade leading-relaxed">
                  Your AI consciousness is now online and ready to orchestrate your business operations. 
                  The onboarding process will configure your agents based on your specific needs.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-harmonix-regal-gold rounded-full animate-pulse" />
                    <span className="text-harmonix-sage-fade">Agent deployment in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-harmonix-regal-gold rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <span className="text-harmonix-sage-fade">CRM integration active</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-harmonix-regal-gold rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                    <span className="text-harmonix-sage-fade">Workflow automation ready</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <EnhancedSolBrain 
                  variant="agents"
                  size="xl"
                  animated={true}
                  showAgentNodes={true}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-12 sm:py-16">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-harmonix-regal-gold">
                What Happens Next
              </h3>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <Card className="harmonix-card-enhanced p-6 text-center">
                  <div className="w-12 h-12 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-harmonix-regal-gold">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Complete Onboarding</h4>
                  <p className="text-sm text-harmonix-sage-fade">Configure your business profile and agent preferences</p>
                </Card>

                <Card className="harmonix-card-enhanced p-6 text-center">
                  <div className="w-12 h-12 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-harmonix-regal-gold">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Deploy Agents</h4>
                  <p className="text-sm text-harmonix-sage-fade">Your AI workforce will be activated and ready to work</p>
                </Card>

                <Card className="harmonix-card-enhanced p-6 text-center">
                  <div className="w-12 h-12 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-harmonix-regal-gold">3</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Scale Your Business</h4>
                  <p className="text-sm text-harmonix-sage-fade">Watch as automation transforms your operations</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Payment cancelled or failed
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="harmonix-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-harmonix-sage-fade/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⏸️</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-harmonix-sage-fade font-serif">
              Payment Cancelled
            </h1>

            <p className="text-lg text-harmonix-sage-fade max-w-3xl mx-auto leading-relaxed mb-8">
              No worries! Your spot is still reserved. Would you like to see a demo first 
              or return to checkout when you're ready?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg"
                className="touch-friendly-btn bg-harmonix-regal-gold text-harmonix-deep-forest hover:bg-harmonix-regal-gold/90"
                onClick={() => setLocation('/demo-scenarios')}
              >
                Watch Demo First
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="touch-friendly-btn border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10"
                onClick={() => setLocation('/checkout')}
              >
                Return to Checkout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}