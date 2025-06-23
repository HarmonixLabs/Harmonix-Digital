import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, Clock, Calculator } from "lucide-react";

interface CheckoutProps {
  tier: {
    id: string;
    name: string;
    setupMin: number;
    setupMax: number;
    mrrMin: number;
    mrrMax: number;
    agentsIncluded: number;
  };
  onBack: () => void;
}

export function StripeCheckout({ tier, onBack }: CheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingPlatform, setHasExistingPlatform] = useState(false);
  const [useFinancing, setUseFinancing] = useState(false);
  const [isEarlyBird, setIsEarlyBird] = useState(true); // First 280 customers
  const { toast } = useToast();

  // Calculate pricing based on selections
  const baseSetupFee = (tier.setupMin + tier.setupMax) / 2;
  const baseMrrFee = (tier.mrrMin + tier.mrrMax) / 2;
  
  // Apply discounts
  let finalSetupFee = baseSetupFee;
  if (hasExistingPlatform) {
    finalSetupFee *= 0.75; // 25% platform discount
  }
  if (isEarlyBird) {
    finalSetupFee *= 0.7; // 30% early bird discount
  }

  // Financing calculation (21% interest)
  const financedTotal = useFinancing ? finalSetupFee * 1.21 : finalSetupFee;
  const monthlyInstallment = useFinancing ? financedTotal / 12 : 0;

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Stripe checkout creation
      const checkoutData = {
        tier: tier.id,
        setupFee: finalSetupFee,
        monthlyFee: baseMrrFee,
        hasExistingPlatform,
        useFinancing,
        isEarlyBird,
        agentsIncluded: tier.agentsIncluded
      };

      // Call backend to create Stripe checkout session
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...checkoutData,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      toast({
        title: "Checkout Created",
        description: "Redirecting to Stripe checkout...",
      });
      
      // Redirect to Stripe checkout
      window.location.href = url;
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="harmonix-card-enhanced">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <Calculator className="w-6 h-6 text-harmonix-regal-gold" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="bg-harmonix-cedar-mist/20 rounded-xl p-4">
              <h3 className="text-xl font-bold text-harmonix-regal-gold mb-2">{tier.name} Plan</h3>
              <p className="text-harmonix-sage-fade text-sm mb-4">
                {tier.agentsIncluded} AI Agent{tier.agentsIncluded > 1 ? 's' : ''} included
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-harmonix-sage-fade">Base Setup Fee:</span>
                  <span className="text-white">${baseSetupFee.toLocaleString()}</span>
                </div>
                
                {hasExistingPlatform && (
                  <div className="flex justify-between items-center">
                    <span className="text-harmonix-sage-fade">Platform Discount (25%):</span>
                    <span className="text-harmonix-regal-gold">-${(baseSetupFee * 0.25).toLocaleString()}</span>
                  </div>
                )}
                
                {isEarlyBird && (
                  <div className="flex justify-between items-center">
                    <span className="text-harmonix-sage-fade">Early Bird Discount (30%):</span>
                    <span className="text-harmonix-regal-gold">-${(baseSetupFee * 0.3).toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-harmonix-cedar-mist pt-3">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">Setup Fee Total:</span>
                    <span className="text-harmonix-regal-gold text-xl">${finalSetupFee.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-harmonix-sage-fade">Monthly Maintenance:</span>
                  <span className="text-white">${baseMrrFee.toLocaleString()}/month</span>
                </div>
              </div>
            </div>

            {/* Financing Details */}
            {useFinancing && (
              <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-4">
                <h4 className="font-semibold text-harmonix-regal-gold mb-2">Financing Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">Total with Interest (21%):</span>
                    <span className="text-white">${financedTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-harmonix-sage-fade">Monthly Payment (12 months):</span>
                    <span className="text-harmonix-regal-gold">${monthlyInstallment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Signals */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-harmonix-sage-fade text-sm">
                <Shield className="w-4 h-4" />
                <span>Secure payment with Stripe</span>
              </div>
              <div className="flex items-center space-x-2 text-harmonix-sage-fade text-sm">
                <Clock className="w-4 h-4" />
                <span>Setup begins within 24 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card className="harmonix-card-enhanced">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-harmonix-regal-gold" />
              <span>Checkout Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Status */}
            <div className="space-y-3">
              <Label className="text-harmonix-sage-fade">Platform Status</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="existing-platform"
                  checked={hasExistingPlatform}
                  onCheckedChange={setHasExistingPlatform}
                  className="border-harmonix-cedar-mist data-[state=checked]:bg-harmonix-regal-gold"
                />
                <label htmlFor="existing-platform" className="text-white text-sm">
                  I already have Harmonix platform installed (25% discount)
                </label>
              </div>
            </div>

            {/* Financing Option */}
            <div className="space-y-3">
              <Label className="text-harmonix-sage-fade">Payment Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financing"
                  checked={useFinancing}
                  onCheckedChange={setUseFinancing}
                  className="border-harmonix-cedar-mist data-[state=checked]:bg-harmonix-regal-gold"
                />
                <label htmlFor="financing" className="text-white text-sm">
                  Finance over 12 months (21% APR)
                </label>
              </div>
            </div>

            {/* Early Bird Status */}
            {isEarlyBird && (
              <div className="bg-harmonix-regal-gold/10 border border-harmonix-regal-gold/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-harmonix-regal-gold text-harmonix-deep-forest">Early Bird</Badge>
                </div>
                <p className="text-harmonix-sage-fade text-sm">
                  You're eligible for the 30% early bird discount! Limited to first 280 customers.
                </p>
              </div>
            )}

            {/* Company Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="company" className="text-harmonix-sage-fade">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter your company name"
                  className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-harmonix-sage-fade">Industry</Label>
                <Select>
                  <SelectTrigger className="mt-1 bg-harmonix-night-pine border-harmonix-cedar-mist text-white">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saas">SaaS / Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="realestate">Real Estate</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold py-4 text-lg"
                size="lg"
              >
                {isLoading ? "Creating Checkout..." : `Proceed to Payment - $${finalSetupFee.toLocaleString()}`}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest"
                size="lg"
              >
                Back to Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}