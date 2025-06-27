import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale, FileText, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-deep-space-black">
        <Navbar />
        
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <HarmonixLogo variant="icon" className="w-16 h-16" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-jade-forest/80">
                Empowering <span className="text-harmonix-gold">Intelligent Systems for Timeless Sovereignty</span> through clear agreements
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-jade-forest/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: June 27, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Effective immediately</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Scale className="w-5 h-5 text-harmonix-gold" />
                    Service Philosophy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <p>
                    Harmonix exists to help you <strong>Build. Automate. Exit.</strong> — building powerful systems, 
                    automating complex workflows, and ultimately achieving the sovereignty to exit manual operations.
                  </p>
                  <p>
                    Our terms ensure <strong>your business works for you, not you working for your business</strong>, 
                    while maintaining fair and transparent service agreements.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                  <CardHeader>
                    <CardTitle className="text-white">Service Scope</CardTitle>
                  </CardHeader>
                  <CardContent className="text-jade-forest/80 space-y-3">
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">AI Agent Platform</h4>
                      <p className="text-sm">12+ specialized agents for business automation</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">SŌL Brain Engine</h4>
                      <p className="text-sm">Orchestration and workflow management</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">Marketplace</h4>
                      <p className="text-sm">NFT agent trading and creator economy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                  <CardHeader>
                    <CardTitle className="text-white">User Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="text-jade-forest/80 space-y-3">
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">Account Security</h4>
                      <p className="text-sm">Maintain secure login and API credentials</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">Usage Compliance</h4>
                      <p className="text-sm">Follow platform guidelines and integration terms</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-1">Payment Terms</h4>
                      <p className="text-sm">Timely payment for subscriptions and services</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white">Service Levels & Support</CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-jade-forest/5 rounded-lg">
                      <h4 className="font-semibold text-harmonix-gold mb-2">Uptime</h4>
                      <p className="text-2xl font-bold text-white">99.9%</p>
                      <p className="text-sm">Platform availability</p>
                    </div>
                    <div className="text-center p-4 bg-jade-forest/5 rounded-lg">
                      <h4 className="font-semibold text-harmonix-gold mb-2">Response</h4>
                      <p className="text-2xl font-bold text-white">&lt;24h</p>
                      <p className="text-sm">Support response time</p>
                    </div>
                    <div className="text-center p-4 bg-jade-forest/5 rounded-lg">
                      <h4 className="font-semibold text-harmonix-gold mb-2">Updates</h4>
                      <p className="text-2xl font-bold text-white">Weekly</p>
                      <p className="text-sm">Feature enhancements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white">Pricing & Refunds</CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <ul className="space-y-2">
                    <li>• Transparent pricing with no hidden fees</li>
                    <li>• Early bird discounts honored for contract duration</li>
                    <li>• 30-day satisfaction guarantee on all new subscriptions</li>
                    <li>• Pro-rated refunds for unused service periods</li>
                    <li>• Split payment options available with financing terms</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact & Waitlist */}
              <Card className="bg-gradient-to-r from-jade-forest/10 to-harmonix-gold/10 border-harmonix-gold/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Questions About Terms?
                  </h3>
                  <p className="text-jade-forest/80 mb-6">
                    Contact our legal team or join our waitlist for priority support access.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button size="lg" className="bg-jade-forest hover:bg-jade-forest/80 text-white">
                        Contact Legal Team
                      </Button>
                    </Link>
                    <Link href="/waitlist">
                      <Button size="lg" variant="outline" className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold/10">
                        Join Waitlist
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageWrapper>
  );
}