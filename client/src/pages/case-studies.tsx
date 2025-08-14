import React, { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { ArrowRight, LogIn, UserPlus, Check, Zap, Crown, Sparkles, Shield, Mail, Lock, Eye, EyeOff, Users, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaseStudiesPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const benefits = [
    "Access to 12+ Elite AI Agents",
    "Save 40+ hours per week",
    "680% average ROI",
    "24/7 automated operations",
    "Real-time CRM integration",
    "Custom agent builder access"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow Solutions",
      content: "Harmony's AI agents transformed our sales process. We're closing 3x more deals with half the effort.",
      revenue: "+$2.4M ARR",
      time: "60hrs/week saved"
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder, Growth Labs",
      content: "The ROI was immediate. Our customer service is now 24/7 without hiring a single person.",
      revenue: "+180% growth",
      time: "40hrs/week saved"
    },
    {
      name: "Emily Watson",
      role: "COO, Digital Ventures",
      content: "SŌL brain orchestration is game-changing. All our systems work together seamlessly now.",
      revenue: "+$850K/month",
      time: "80hrs/week saved"
    }
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#002a2d] via-[#1b1b1b] to-[#002a2d]">
        <Navbar />
        
        {/* Hero Section with Auth Form */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-harmonix-regal-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-harmonix-deep-forest/20 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 py-20 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Value Proposition */}
              <div className="space-y-8">
                <div>
                  <HarmonixLogo className="w-16 h-16 mb-6" />
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-serif mb-6">
                    Join the <span className="text-harmonix-regal-gold">AI Revolution</span>
                  </h1>
                  <p className="text-xl text-harmonix-sage-fade mb-8">
                    Deploy your AI workforce in minutes. Watch your business transform overnight.
                  </p>
                </div>
                
                {/* Benefits List */}
                <div className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-harmonix-regal-gold/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-harmonix-regal-gold" />
                      </div>
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-harmonix-regal-gold">5,000+</div>
                    <div className="text-sm text-harmonix-sage-fade">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-harmonix-regal-gold">$24M+</div>
                    <div className="text-sm text-harmonix-sage-fade">Revenue Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-harmonix-regal-gold">98%</div>
                    <div className="text-sm text-harmonix-sage-fade">Satisfaction</div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Auth Form */}
              <div className="lg:pl-12">
                <Card className="bg-harmonix-night-pine/80 border-harmonix-cedar-mist/30 backdrop-blur-md">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-white">
                      {isSignUp ? 'Start Your 7-Day Trial' : 'Welcome Back'}
                    </CardTitle>
                    <CardDescription className="text-harmonix-sage-fade">
                      {isSignUp 
                        ? 'No credit card required. Cancel anytime.' 
                        : 'Sign in to access your AI workforce'
                      }
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <form className="space-y-4">
                      {isSignUp && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-white">First Name</Label>
                            <Input
                              id="firstName"
                              placeholder="John"
                              className="bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-white">Last Name</Label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              className="bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harmonix-sage-fade" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harmonix-sage-fade" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-harmonix-sage-fade hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      {isSignUp && (
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-white">Company (Optional)</Label>
                          <Input
                            id="company"
                            placeholder="Your Company"
                            className="bg-harmonix-deep-forest/50 border-harmonix-cedar-mist/30 text-white placeholder-harmonix-sage-fade/50"
                          />
                        </div>
                      )}
                      
                      <Button className="w-full bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-bold py-6 text-lg">
                        {isSignUp ? (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            Start Free Trial
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-5 w-5" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </form>
                    
                    {/* Social Auth */}
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-harmonix-cedar-mist/30" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-harmonix-night-pine px-2 text-harmonix-sage-fade">Or continue with</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="border-harmonix-cedar-mist/30 text-white hover:bg-harmonix-cedar-mist/10">
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline" className="border-harmonix-cedar-mist/30 text-white hover:bg-harmonix-cedar-mist/10">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                          </svg>
                          GitHub
                        </Button>
                      </div>
                    </div>
                    
                    {/* Toggle Sign In/Up */}
                    <div className="text-center text-sm text-harmonix-sage-fade">
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                      <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-harmonix-regal-gold hover:underline font-medium"
                      >
                        {isSignUp ? 'Sign in' : 'Start free trial'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Trust Badge */}
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-harmonix-sage-fade">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="bg-harmonix-night-pine/50 border-y border-harmonix-cedar-mist/20 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Trusted by <span className="text-harmonix-regal-gold">5,000+ Businesses</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="bg-harmonix-deep-forest/30 border-harmonix-cedar-mist/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className="w-4 h-4 text-harmonix-regal-gold fill-harmonix-regal-gold" />
                      ))}
                    </div>
                    <p className="text-white mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-harmonix-sage-fade">{testimonial.role}</div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-1">
                          {testimonial.revenue}
                        </Badge>
                        <div className="text-xs text-harmonix-sage-fade">{testimonial.time}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-regal-gold/10 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Crown className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Competition is Already Using AI
            </h2>
            <p className="text-xl text-harmonix-sage-fade mb-8">
              Don't get left behind. Join the AI revolution today.
            </p>
            <Button size="lg" className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-bold px-12 py-6 text-lg">
              <Zap className="mr-2 h-6 w-6" />
              Start Your Free Trial Now
            </Button>
            <p className="text-sm text-harmonix-sage-fade mt-4">
              Join 5,000+ businesses • No credit card required • 7-day free trial
            </p>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageWrapper>
  );
}