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
    company: "",
    businessType: "",
    teamSize: "",
    interests: "",
    revenue: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast({
        title: "Welcome to the Inner Circle!",
        description: "Early access secured with 30% discount. Check your email for next steps.",
      });
    } catch (error) {
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
        
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-jade-forest to-harmonix-gold text-deep-space-black py-2 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm font-semibold">
              🚀 Limited Time Offer - Early Bird 30% Off - Priority Access Guaranteed
            </p>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-jade-forest/20 via-transparent to-harmonix-gold/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column - Benefits */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-6">
                    <HarmonixLogo variant="monogram" className="w-16 h-16" />
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
                    Join the <span className="text-harmonix-gold">Harmonix</span> Revolution
                  </h1>
                  <div className="space-y-3 mb-8">
                    <p className="text-xl text-jade-forest italic">
                      "Intelligent Systems for Timeless Sovereignty"
                    </p>
                    <p className="text-lg text-harmonix-gold font-semibold">
                      Build. Automate. Exit.
                    </p>
                    <p className="text-base text-jade-forest/80">
                      Have your business work for you, not you working for your business.
                    </p>
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
              <Card className="bg-jade-forest/5 border-harmonix-gold/30 backdrop-blur-sm">
                <CardHeader>
                  <Badge className="mx-auto mb-2 bg-harmonix-gold/20 text-harmonix-gold border-harmonix-gold/30">
                    Early Access Program
                  </Badge>
                  <CardTitle className="text-2xl text-harmonix-gold text-center">
                    Secure Your Spot
                  </CardTitle>
                  <CardDescription className="text-jade-forest/80 text-center">
                    Join 500+ visionary leaders transforming their businesses with AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitting ? (
                    <div className="text-center py-8">
                      <WhimsicalLoader variant="sacred" size="lg" />
                      <p className="text-jade-forest/80 mt-4">Processing your application...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                      <div className="pt-4 space-y-4">
                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full bg-gradient-to-r from-harmonix-gold to-harmonix-gold/80 text-deep-space-black hover:from-harmonix-gold/90 hover:to-harmonix-gold/70 font-semibold py-3 text-lg"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Secure Priority Access
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        
                        <p className="text-xs text-jade-forest/60 text-center">
                          By joining, you agree to receive updates about Harmonix platform developments. 
                          <br />
                          30% early bird discount applied automatically.
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