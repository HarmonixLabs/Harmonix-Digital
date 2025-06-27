import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/transitions/page-wrapper";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Clock, Users } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
                Privacy Policy
              </h1>
              <p className="text-lg text-jade-forest/80">
                Your privacy is fundamental to our mission of{" "}
                <span className="text-harmonix-gold">Intelligent Systems for Timeless Sovereignty</span>
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-jade-forest/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: June 27, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Effective immediately</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-harmonix-gold" />
                    Data Protection Philosophy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <p>
                    At Harmonix, we believe that <strong>Build. Automate. Exit.</strong> applies to data protection too. 
                    We build secure systems, automate compliance, and help you exit data dependency concerns.
                  </p>
                  <p>
                    Our approach ensures <strong>your business works for you, not you working for your business</strong> — 
                    including when it comes to data privacy and security.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white">Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-2">Account Information</h4>
                      <p>Email, name, company details, and billing information for platform access.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-2">Usage Data</h4>
                      <p>Agent interactions, platform usage patterns, and performance metrics.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-harmonix-gold mb-2">Integration Data</h4>
                      <p>Data processed through connected tools (CRM, payment processors, etc.).</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white">How We Use Your Data</CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <ul className="space-y-2">
                    <li>• Provide and improve our AI agent services</li>
                    <li>• Process payments and manage subscriptions</li>
                    <li>• Deliver personalized agent recommendations</li>
                    <li>• Ensure platform security and prevent fraud</li>
                    <li>• Communicate important updates and support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-harmonix-night-pine/30 border-jade-forest/20">
                <CardHeader>
                  <CardTitle className="text-white">Data Security & Rights</CardTitle>
                </CardHeader>
                <CardContent className="text-jade-forest/80 space-y-4">
                  <p>
                    We implement enterprise-grade security measures and comply with GDPR, CCPA, and other privacy regulations.
                    You have the right to access, modify, or delete your data at any time.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <Button variant="outline" className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10">
                      <FileText className="w-4 h-4 mr-2" />
                      Request Data Export
                    </Button>
                    <Button variant="outline" className="border-jade-forest/30 text-jade-forest hover:bg-jade-forest/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Waitlist */}
              <Card className="bg-gradient-to-r from-jade-forest/10 to-harmonix-gold/10 border-harmonix-gold/30">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Questions About Privacy?
                  </h3>
                  <p className="text-jade-forest/80 mb-6">
                    Contact our privacy team or join our waitlist for priority data protection updates.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/contact">
                      <Button size="lg" className="bg-jade-forest hover:bg-jade-forest/80 text-white">
                        Contact Privacy Team
                      </Button>
                    </Link>
                    <Link href="/waitlist">
                      <Button size="lg" variant="outline" className="border-harmonix-gold text-harmonix-gold hover:bg-harmonix-gold/10">
                        Join Privacy Updates
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