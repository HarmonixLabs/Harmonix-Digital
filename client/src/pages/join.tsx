import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Sparkles, Crown, Users, ArrowRight, Zap, Star, Timer } from "lucide-react";
import { WhimsicalLoader } from "@/components/loading/whimsical-loader";
import { MysticalTooltip } from "@/components/ui/animated-tooltip";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessType: "",
    teamSize: "",
    interests: "",
    revenue: "",
    accessType: "waitlist" // waitlist, vip50, vip100
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to GHL CRM via API
      const response = await fetch('/api/ghl-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'join_page',
          tags: ['harmonix_early_access', formData.accessType === 'waitlist' ? 'waitlist' : 'vip_access'],
          leadValue: formData.accessType === 'vip100' ? 21500 : formData.accessType === 'vip50' ? 10750 : 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit to CRM');
      }

      const result = await response.json();
      
      // Handle VIP access with payment
      if (formData.accessType !== 'waitlist') {
        // Redirect to Stripe checkout for VIP deposit
        const checkoutResponse = await fetch('/api/create-vip-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessType: formData.accessType,
            customerData: formData,
            ghlContactId: result.contactId
          }),
        });
        
        const { url } = await checkoutResponse.json();
        window.location.href = url;
      } else {
        setIsSubmitted(true);
        toast({
          title: "Welcome to the Waitlist!",
          description: "You'll receive priority updates and early access notifications.",
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Error",
        description: "Please try again or contact our support team.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: Zap,
      title: "Priority Access",
      description: "First access to all 12+ AI agents and SŌL brain engine orchestration"
    },
    {
      icon: Star,
      title: "Early Bird Pricing",
      description: "30% discount locked in for your entire first year of service"
    },
    {
      icon: Users,
      title: "Exclusive Community",
      description: "Direct access to founders and priority support channels"
    },
    {
      icon: Timer,
      title: "Beta Features",
      description: "Test new agents and marketplace features before public release"
    }
  ];

  if (isSubmitted) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-deep-space-black">
          <Navbar />
          
          <div className="pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex justify-center mb-8">
                <HarmonixLogo variant="monogram" className="w-20 h-20" />
              </div>
              
              <CheckCircle className="w-16 h-16 text-harmonix-gold mx-auto mb-6" />
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to the Revolution
              </h1>
              
              <p className="text-xl text-jade-forest/80 mb-8">
                You're now part of the exclusive Harmonix community.
                <br />
                <span className="text-harmonix-gold">Build. Automate. Exit.</span> begins with your priority access.
              </p>
              
              <div className="space-y-4 text-jade-forest/60 mb-8">
                <p>• Early bird pricing locked at 30% off</p>
                <p>• Priority onboarding specialist contact within 24 hours</p>
                <p>• Exclusive access to SŌL brain and all 12+ AI agents</p>
                <p>• Beta marketplace features and NFT agent collection</p>
              </div>
              
              <Card className="bg-gradient-to-r from-jade-forest/10 to-harmonix-gold/10 border-harmonix-gold/30 p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  What Happens Next?
                </h3>
                <p className="text-jade-forest/80 text-sm italic mb-4">
                  "Have your business work for you, not you working for your business."
                </p>
                <p className="text-jade-forest/80 text-sm">
                  Our team will reach out with your personalized onboarding timeline and access credentials.
                  <br />
                  <span className="text-harmonix-gold">Intelligent Systems for Timeless Sovereignty</span> await.
                </p>
              </Card>
            </div>
          </div>
          
          <Footer />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-deep-space-black">
        <Navbar />
        
        {/* Premium Promo Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-harmonix-gold via-jade-forest to-harmonix-gold animate-gradient-x">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="max-w-7xl mx-auto px-4 py-3 relative">
            <div className="flex items-center justify-center space-x-4 text-deep-space-black">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-deep-space-black rounded-full animate-pulse"></div>
                <span className="font-bold text-sm uppercase tracking-wide">VIP Early Access</span>
              </div>
              <div className="hidden sm:block w-1 h-4 bg-deep-space-black/30"></div>
              <span className="font-semibold text-sm">30% OFF + Priority Onboarding</span>
              <div className="hidden sm:block w-1 h-4 bg-deep-space-black/30"></div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">Secure with 50% deposit</span>
                <Sparkles className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-jade-forest/30 via-transparent to-harmonix-gold/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(29,107,74,0.15),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              
              {/* Left Column - Hero Content */}
              <div className="space-y-10">
                <div className="text-center lg:text-left">
                  {/* Premium Logo Display */}
                  <div className="flex justify-center lg:justify-start mb-8">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-harmonix-gold/20 to-jade-forest/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-harmonix-gold/10 to-jade-forest/10 p-4 rounded-full border border-harmonix-gold/30 backdrop-blur-sm">
                        <HarmonixLogo variant="monogram" className="w-20 h-20" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hero Headlines */}
                  <div className="space-y-6">
                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                      Join the <span className="bg-gradient-to-r from-harmonix-gold to-jade-forest bg-clip-text text-transparent">Harmonix</span> Revolution
                    </h1>
                    
                    {/* Core Slogans with Enhanced Typography */}
                    <div className="space-y-4 max-w-2xl">
                      <p className="text-2xl text-jade-forest italic font-light leading-relaxed">
                        "Intelligent Systems for Timeless Sovereignty"
                      </p>
                      <p className="text-xl text-harmonix-gold font-bold tracking-wide">
                        BUILD. AUTOMATE. EXIT.
                      </p>
                      <p className="text-lg text-jade-forest/90 font-medium">
                        Have your business work for you, not you working for your business.
                      </p>
                    </div>
                    
                    {/* VIP Access Badges */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
                      <div className="bg-gradient-to-r from-harmonix-gold/20 to-harmonix-gold/10 border border-harmonix-gold/30 px-4 py-2 rounded-full">
                        <span className="text-harmonix-gold text-sm font-semibold">✨ VIP Access Available</span>
                      </div>
                      <div className="bg-gradient-to-r from-jade-forest/20 to-jade-forest/10 border border-jade-forest/30 px-4 py-2 rounded-full">
                        <span className="text-jade-forest text-sm font-semibold">🚀 50% Deposit Secures Spot</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index}>
                      <div className="flex items-start space-x-4 p-4 rounded-lg bg-jade-forest/5 hover:bg-jade-forest/10 transition-all duration-300">
                        <div className="w-12 h-12 rounded-lg bg-harmonix-gold/10 flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-6 w-6 text-harmonix-gold" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-harmonix-gold mb-2">{benefit.title}</h3>
                          <p className="text-jade-forest/80">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Form */}
              <Card className="bg-gradient-to-br from-jade-forest/10 to-harmonix-gold/5 border-harmonix-gold/40 backdrop-blur-lg shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Badge className="bg-harmonix-gold/20 text-harmonix-gold border-harmonix-gold/30 px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP Early Access
                    </Badge>
                    <Badge className="bg-jade-forest/20 text-jade-forest border-jade-forest/30 px-3 py-1">
                      Limited Spots
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl text-white text-center font-bold mb-2">
                    Secure Your Revolution
                  </CardTitle>
                  <CardDescription className="text-jade-forest/80 text-center text-base">
                    Join 500+ visionary leaders transforming their businesses with AI
                    <br />
                    <span className="text-harmonix-gold font-semibold">Choose your access level below</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitting ? (
                    <div className="text-center py-8">
                      <WhimsicalLoader variant="sacred" size="lg" />
                      <p className="text-jade-forest/80 mt-4">Processing your application...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* VIP Access Selection */}
                      <div className="space-y-4">
                        <Label className="text-white text-lg font-semibold">Choose Your Access Level</Label>
                        <div className="grid gap-4">
                          {/* Waitlist Option */}
                          <div 
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.accessType === 'waitlist' 
                                ? 'border-jade-forest bg-jade-forest/10' 
                                : 'border-jade-forest/30 bg-jade-forest/5 hover:border-jade-forest/50'
                            }`}
                            onClick={() => handleInputChange("accessType", "waitlist")}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white">Waitlist Access</h4>
                                <p className="text-sm text-jade-forest/80">Get early notifications and updates</p>
                              </div>
                              <div className="text-right">
                                <span className="text-jade-forest font-bold">FREE</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* VIP 50% Option */}
                          <div 
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.accessType === 'vip50' 
                                ? 'border-harmonix-gold bg-harmonix-gold/10' 
                                : 'border-harmonix-gold/30 bg-harmonix-gold/5 hover:border-harmonix-gold/50'
                            }`}
                            onClick={() => handleInputChange("accessType", "vip50")}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white flex items-center">
                                  <Crown className="w-4 h-4 mr-2 text-harmonix-gold" />
                                  VIP Access - 50% Deposit
                                </h4>
                                <p className="text-sm text-harmonix-gold/80">Secure your spot + 30% discount</p>
                              </div>
                              <div className="text-right">
                                <span className="text-harmonix-gold font-bold">$10,750</span>
                                <p className="text-xs text-harmonix-gold/60">50% deposit</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* VIP 100% Option */}
                          <div 
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.accessType === 'vip100' 
                                ? 'border-harmonix-gold bg-harmonix-gold/10' 
                                : 'border-harmonix-gold/30 bg-harmonix-gold/5 hover:border-harmonix-gold/50'
                            }`}
                            onClick={() => handleInputChange("accessType", "vip100")}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white flex items-center">
                                  <Star className="w-4 h-4 mr-2 text-harmonix-gold" />
                                  VIP Access - Full Payment
                                </h4>
                                <p className="text-sm text-harmonix-gold/80">Maximum savings + immediate access</p>
                              </div>
                              <div className="text-right">
                                <span className="text-harmonix-gold font-bold">$21,500</span>
                                <p className="text-xs text-harmonix-gold/60">Full payment</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <Label className="text-white text-lg font-semibold">Contact Information</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-jade-forest">Full Name *</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              required
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-jade-forest">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@company.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              required
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-jade-forest">Phone Number *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              required
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-jade-forest">Company Name *</Label>
                            <Input
                              id="company"
                              type="text"
                              placeholder="Your company"
                              value={formData.company}
                              onChange={(e) => handleInputChange("company", e.target.value)}
                              required
                              className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-jade-forest">Company Name *</Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your company or organization"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          required
                          className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessType" className="text-jade-forest">Industry</Label>
                          <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                            <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="saas">SaaS / Technology</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="finance">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="revenue" className="text-jade-forest">Annual Revenue</Label>
                          <Select onValueChange={(value) => handleInputChange("revenue", value)}>
                            <SelectTrigger className="bg-deep-space-black/50 border-jade-forest/30 text-white">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="startup">Pre-revenue / Startup</SelectItem>
                              <SelectItem value="100k">$100K - $500K</SelectItem>
                              <SelectItem value="500k">$500K - $1M</SelectItem>
                              <SelectItem value="1m">$1M - $5M</SelectItem>
                              <SelectItem value="5m">$5M - $10M</SelectItem>
                              <SelectItem value="10m+">$10M+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interests" className="text-jade-forest">Primary Automation Interest</Label>
                        <Textarea
                          id="interests"
                          placeholder="e.g., Lead qualification, Customer service, Content creation, Operations..."
                          value={formData.interests}
                          onChange={(e) => handleInputChange("interests", e.target.value)}
                          className="bg-deep-space-black/50 border-jade-forest/30 text-white focus:border-harmonix-gold"
                          rows={3}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6 space-y-4">
                        <Button 
                          type="submit" 
                          size="lg"
                          className={`w-full font-bold py-4 text-lg transition-all duration-300 ${
                            formData.accessType === 'waitlist'
                              ? 'bg-gradient-to-r from-jade-forest to-jade-forest/80 text-white hover:from-jade-forest/90 hover:to-jade-forest/70'
                              : 'bg-gradient-to-r from-harmonix-gold to-harmonix-gold/80 text-deep-space-black hover:from-harmonix-gold/90 hover:to-harmonix-gold/70'
                          }`}
                        >
                          {formData.accessType === 'waitlist' ? (
                            <>
                              <Users className="w-5 h-5 mr-2" />
                              Join Waitlist
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          ) : (
                            <>
                              <Crown className="w-5 h-5 mr-2" />
                              Secure VIP Access
                              <Sparkles className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                        
                        {formData.accessType !== 'waitlist' && (
                          <div className="bg-harmonix-gold/10 border border-harmonix-gold/30 p-4 rounded-lg">
                            <p className="text-sm text-harmonix-gold text-center font-semibold">
                              🚀 VIP Benefits: Immediate access + 30% discount + Priority support + Beta features
                            </p>
                          </div>
                        )}
                        
                        <p className="text-xs text-jade-forest/60 text-center leading-relaxed">
                          By joining, you agree to receive updates about Harmonix platform developments. 
                          <br />
                          {formData.accessType === 'waitlist' 
                            ? '30% early bird discount secured for when you upgrade.'
                            : 'Payment processed securely via Stripe. Cancel anytime.'
                          }
                        </p>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}