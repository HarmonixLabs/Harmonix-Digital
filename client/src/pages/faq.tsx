import React from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is the Harmony Platform?",
      answer: "Harmony is a comprehensive AI automation platform that helps businesses Build, Automate, and Exit through intelligent systems. It features 12+ specialized AI agents orchestrated by the SŌL brain engine, providing enterprise-grade automation with spiritual wisdom and tactical precision."
    },
    {
      question: "How does the SŌL brain engine work?",
      answer: "The SŌL brain is the central intelligence that coordinates all your AI agents. It learns from your business patterns, shares knowledge between agents, and provides strategic recommendations. Think of it as your digital boardroom advisor that grows smarter with every interaction."
    },
    {
      question: "What AI agents are included?",
      answer: "Harmony includes 12+ specialized agents: Sales (CA$HFLOW), Concierge, HR, Social Media, Executive Assistant, Project Manager, Content Creation, Email Marketing, Finance, Legal/Compliance, Analyst/Forecasting, and R&D/Innovation agents. Each agent can be customized to your specific business needs."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Harmony uses enterprise-grade security with multi-tenant architecture, role-based access control, and data sovereignty. Your data stays within your organization's secure environment, and we're fully compliant with GDPR and CCPA regulations."
    },
    {
      question: "How much does Harmony cost?",
      answer: "Pricing varies by agent and customization level. Base agent installation starts at $12,500, with SOP mapping and customization at $18,000. Monthly maintenance ranges from $300-$1,000 per agent. Contact us for enterprise pricing and multi-agent bundles."
    },
    {
      question: "Can I try Harmony before purchasing?",
      answer: "Yes! You can experience the SŌL brain demo and browse our agent marketplace. For qualified businesses, we offer guided demos and proof-of-concept deployments. Join our waitlist for early access to the full platform."
    },
    {
      question: "How long does implementation take?",
      answer: "Basic agent deployment takes 2-4 weeks. Full platform implementation with custom SOPs and integrations typically takes 6-12 weeks. Our Launchpad program provides 90-day guided setup with dedicated support."
    },
    {
      question: "What integrations are supported?",
      answer: "Harmony integrates with popular CRM systems (Salesforce, HubSpot, GoHighLevel), calendar platforms (Google, Outlook), project management tools (Asana, Monday), and financial systems (QuickBooks, Xero). Custom integrations are available for enterprise clients."
    },
    {
      question: "Do I need technical knowledge to use Harmony?",
      answer: "No technical knowledge required. Harmony is designed for business leaders and teams. Our intuitive interface, guided onboarding, and dedicated support ensure you can leverage AI automation regardless of technical background."
    },
    {
      question: "What's included in the NFT marketplace?",
      answer: "Our NFT marketplace features collectible agent trading cards with different rarity tiers. These aren't just collectibles – they represent licenses for premium agent features, exclusive training content, and community access. Think Pokemon cards meets enterprise software licensing."
    },
    {
      question: "Can agents work together?",
      answer: "Yes! This is where Harmony shines. The SŌL brain orchestrates agent collaboration, enabling complex workflows where your Sales agent hands off to HR for onboarding, or Finance coordinates with Project Management for budget planning. It's like having a digital team that never sleeps."
    },
    {
      question: "What makes Harmony different from other AI tools?",
      answer: "Harmony combines spiritual wisdom with tactical AI precision. We're not just automating tasks – we're building intelligent systems that embody timeless sovereignty principles. Our multi-tenant architecture, agent marketplace, and SŌL brain orchestration create a platform that grows with your vision."
    }
  ];

  const ctaOptions = [
    {
      title: "Try Live Demo",
      description: "Experience the central intelligence that orchestrates all agents",
      href: "/demo",
      variant: "primary" as const
    },
    {
      title: "Browse Agent Marketplace",
      description: "Explore our collection of specialized AI agents",
      href: "/marketplace",
      variant: "secondary" as const
    },
    {
      title: "Join Waitlist",
      description: "Get early access to the full Harmony platform",
      href: "/join",
      variant: "primary" as const
    }
  ];

  return (
    <div className="min-h-screen bg-harmony-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-harmony-green/20 via-transparent to-harmony-gold/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <HarmonixLogo size="lg" variant="gold" className="justify-center mb-6" />
          <h1 className="text-5xl lg:text-6xl font-bold text-white font-serif mb-6">
            Frequently Asked <span className="text-harmony-gold">Questions</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Everything you need to know about intelligent systems for timeless sovereignty
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-900/50 border border-gray-800 rounded-lg px-6 data-[state=open]:border-harmony-gold/50"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-harmony-gold hover:text-harmony-gold/80">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white font-serif mb-4">
              Ready to Experience <span className="text-harmony-gold">Harmony</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take the next step toward intelligent automation and timeless sovereignty
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ctaOptions.map((option, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-harmony-gold/50 transition-colors">
                <CardHeader className="text-center">
                  <CardTitle className="text-harmony-gold font-serif">{option.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href={option.href}>
                    <Button 
                      className={
                        option.variant === "primary" 
                          ? "bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 w-full"
                          : "border-harmony-gold text-harmony-gold hover:bg-harmony-gold/10 w-full"
                      }
                      variant={option.variant === "primary" ? "default" : "outline"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-harmony-green/20 to-harmony-gold/20 rounded-2xl p-12 border border-harmony-gold/30">
            <MessageCircle className="w-16 h-16 text-harmony-gold mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white font-serif mb-4">
              Still Have Questions?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Our team is here to help you understand how Harmony can transform your business
            </p>
            <Link href="/join">
              <Button size="lg" className="bg-harmony-gold text-harmony-dark hover:bg-harmony-gold/90 font-semibold">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}