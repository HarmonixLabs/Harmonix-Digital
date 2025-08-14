import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { PageWrapper } from '@/components/transitions/page-wrapper';
import { 
  Sparkles, Crown, Zap, Shield, Users, TrendingUp, 
  Check, ChevronRight, Star, Gem, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function JoinPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const benefits = [
    { icon: Crown, text: "Access to 12 Elite AI Agents" },
    { icon: Zap, text: "Save 40+ Hours Per Week" },
    { icon: Shield, text: "Enterprise-Grade Security" },
    { icon: Users, text: "Priority Support 24/7" },
    { icon: TrendingUp, text: "Advanced Analytics Dashboard" },
    { icon: Gem, text: "NFT Agent Ownership" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Welcome to the waitlist! Check your email for confirmation.');
      setEmail('');
    }, 2000);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-harmonix-regal-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-harmonix-deep-forest/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <HarmonixLogo className="w-20 h-20 mx-auto mb-8" />
              
              <div className="inline-flex items-center gap-2 bg-harmonix-regal-gold/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-harmonix-regal-gold" />
                <span className="text-harmonix-regal-gold font-medium">Limited Early Access</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
                Join the <span className="text-harmonix-regal-gold">AI Revolution</span>
              </h1>
              
              <p className="text-xl text-harmonix-sage-fade mb-8 max-w-2xl mx-auto">
                Be among the first 500 businesses to deploy Harmony's elite AI agents. 
                Get 30% off lifetime pricing and exclusive founding member benefits.
              </p>

              {/* Signup Form */}
              <Card className="bg-harmonix-night-pine/80 border-harmonix-cedar-mist/30 max-w-md mx-auto">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your business email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder:text-harmonix-sage-fade/50"
                    />
                    
                    <Button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-bold py-6"
                    >
                      {loading ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>
                          Join Early Access Waitlist
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-harmonix-sage-fade/70 text-center">
                      🔒 No credit card required • Instant access upon launch
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-harmonix-regal-gold">5,000+</div>
                  <div className="text-sm text-harmonix-sage-fade">Businesses Waiting</div>
                </div>
                <div className="w-px h-12 bg-harmonix-cedar-mist/30" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-harmonix-regal-gold">280+</div>
                  <div className="text-sm text-harmonix-sage-fade">Already Activated</div>
                </div>
                <div className="w-px h-12 bg-harmonix-cedar-mist/30" />
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-harmonix-regal-gold fill-harmonix-regal-gold" />
                    ))}
                  </div>
                  <div className="text-sm text-harmonix-sage-fade">4.9/5 Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            What You'll Get with <span className="text-harmonix-regal-gold">Early Access</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20 hover:border-harmonix-regal-gold/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-harmonix-regal-gold/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-harmonix-regal-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{benefit.text}</h3>
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Urgency Section */}
        <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-regal-gold/10 border-y border-harmonix-cedar-mist/20">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <Lock className="w-12 h-12 text-harmonix-regal-gold mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              Spots Filling Fast
            </h3>
            <p className="text-harmonix-sage-fade mb-6 max-w-2xl mx-auto">
              Once we reach 500 founding members, prices increase by 40% and some features become exclusive
            </p>
            <div className="inline-flex items-center gap-3 bg-harmonix-night-pine/80 px-6 py-3 rounded-full">
              <span className="text-harmonix-sage-fade">Remaining Spots:</span>
              <span className="text-2xl font-bold text-harmonix-regal-gold">220</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}