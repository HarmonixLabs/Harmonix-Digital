import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingTiers } from "@/components/pricing/pricing-tiers";
import { ROICalculator } from "@/components/pricing/roi-calculator";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Shield, 
  Zap, 
  Users, 
  HeadphonesIcon, 
  Globe, 
  CreditCard,
  Clock,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export default function PricingPage() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Deploy your first agent within 24 hours"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Expert onboarding and ongoing success management"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Monitoring",
      description: "Continuous monitoring and optimization"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "GDPR, CCPA, and international data protection"
    },
    {
      icon: CreditCard,
      title: "Flexible Billing",
      description: "Multiple payment options and financing available"
    }
  ];

  const faqs = [
    {
      question: "What's included in the setup fee?",
      answer: "The setup fee covers agent training, CRM integration, workflow configuration, team onboarding, and 30 days of dedicated support to ensure optimal performance."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades occur at your next billing cycle."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer 12-month financing with 0% APR for qualified businesses. This allows you to spread the setup cost over monthly installments."
    },
    {
      question: "What happens if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your setup fee and cancel your subscription."
    },
    {
      question: "How quickly can I see results?",
      answer: "Most customers see significant improvements within the first 30 days. Our agents typically achieve 40-70% automation of manual tasks within the first quarter."
    }
  ];

  return (
    <div className="min-h-screen harmonix-gradient">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 harmonix-scenic-gradient opacity-10"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <HarmonixLogo size="xl" variant="scenic" className="harmonix-logo-glow" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
              Transparent <span className="text-harmonix-regal-gold">Pricing</span>
              <br />for Every Business
            </h1>
            
            <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto leading-relaxed">
              Choose the perfect automation package for your business. No hidden fees, 
              no surprises—just clear pricing that scales with your success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
              <Button 
                size="lg" 
                className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold px-8 py-4"
              >
                <Link href="#pricing" className="flex items-center space-x-2">
                  <span>View Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest px-8 py-4"
              >
                <Link href="#calculator">Calculate ROI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything You Need to <span className="text-harmonix-regal-gold">Succeed</span>
            </h2>
            <p className="text-xl text-harmonix-sage-fade max-w-3xl mx-auto">
              Every plan includes enterprise-grade features and world-class support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover border-harmonix-cedar-mist bg-harmonix-cedar-mist/10">
                  <CardContent className="p-8 text-center">
                    <div className="bg-harmonix-regal-gold/20 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-harmonix-regal-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-harmonix-sage-fade leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing">
        <PricingTiers />
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="bg-harmonix-night-pine/50">
        <ROICalculator />
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Frequently Asked <span className="text-harmonix-regal-gold">Questions</span>
            </h2>
            <p className="text-xl text-harmonix-sage-fade">
              Everything you need to know about Harmonix pricing and plans
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-hover border-harmonix-cedar-mist">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                  <p className="text-harmonix-sage-fade leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="card-hover border-harmonix-regal-gold bg-harmonix-regal-gold/5">
            <CardContent className="p-12">
              <Clock className="w-16 h-16 text-harmonix-regal-gold mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-harmonix-sage-fade mb-8 max-w-2xl mx-auto">
                Join the early bird program and save 30% on setup fees. 
                Limited to the first 280 customers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  size="lg" 
                  className="bg-harmonix-regal-gold hover:bg-harmonix-regal-gold/90 text-harmonix-deep-forest font-semibold px-8 py-4"
                >
                  <Link href="/join" className="flex items-center space-x-2">
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-harmonix-sage-fade text-harmonix-sage-fade hover:bg-harmonix-sage-fade hover:text-harmonix-deep-forest px-8 py-4"
                >
                  <Link href="/demo">Try Demo First</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}