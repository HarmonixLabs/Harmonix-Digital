import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, FileText, Mail, Phone, MapPin } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jadeForest/10 to-charcoalDeep/5">
      <div className="container max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-jadeForest hover:text-jadeForest/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-jadeForest mb-4">Terms & Conditions</h1>
            <p className="text-lg text-charcoalDeep/70">Harmonix AI Agent Platform</p>
            <p className="text-sm text-charcoalDeep/60 mt-2">Effective Date: Immediately</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-jadeForest/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-jadeForest">
              <FileText className="w-6 h-6" />
              HARMONIX TERMS & CONDITIONS
            </CardTitle>
            <p className="text-charcoalDeep/70">Keeping Us Aligned</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-sm leading-relaxed">
                
                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">1. Acceptance of Terms</h3>
                  <p className="text-charcoalDeep/80">
                    By accessing and using the Harmonix AI Agent Platform and associated services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please discontinue use of our platform and services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">2. Privacy Policy Overview</h3>
                  <p className="text-charcoalDeep/80">
                    Your use of our services is governed by this combined Terms and Privacy Policy document, which outlines how we collect, use, and protect your information. It includes specific terms for SMS consent and electronic communication.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">3. Information We Collect</h3>
                  <p className="text-charcoalDeep/80 mb-2">We may collect the following personal data:</p>
                  <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4">
                    <li>Full name, phone number, and email address</li>
                    <li>Company information and business requirements</li>
                    <li>AI agent usage data and performance metrics</li>
                    <li>Payment and billing information</li>
                    <li>Consent status and opt-in timestamp</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">4. How We Use Your Information</h3>
                  <p className="text-charcoalDeep/80 mb-2">Your data may be used to:</p>
                  <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4">
                    <li>Deploy and manage AI agents for your organization</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Send platform updates and service notifications</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Improve AI agent performance and platform features</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">5. AI Agent Services</h3>
                  <div className="space-y-3">
                    <p className="text-charcoalDeep/80">
                      <strong>Service Description:</strong> Harmonix provides AI-powered digital team members including Sales Agents, HR Agents, Concierge Agents, and specialized automation solutions.
                    </p>
                    <p className="text-charcoalDeep/80">
                      <strong>Pricing Structure:</strong> Services range from $12,500 base installation to $18,000 with full SOP mapping. Monthly maintenance fees of $300-$1,000 include AI model updates, prompt tuning, and priority support.
                    </p>
                    <p className="text-charcoalDeep/80">
                      <strong>Payment Terms:</strong> Full payment (30% early bird discount available) or split payment option (17% increase: 50% upfront, 25% at milestone 1, 25% at completion).
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">6. SMS + Messaging Consent</h3>
                  <p className="text-charcoalDeep/80 mb-2">
                    By entering your phone number and checking the opt-in box, you consent to receive:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4">
                    <li>Platform notifications and agent status updates</li>
                    <li>Billing reminders and payment confirmations</li>
                    <li>Service announcements and feature updates</li>
                  </ul>
                  <p className="text-charcoalDeep/80 mt-2">
                    You can opt-out anytime by replying "STOP". Message frequency may vary. Message & data rates may apply.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">7. Intellectual Property</h3>
                  <p className="text-charcoalDeep/80">
                    All content, branding, AI agent technology, and proprietary algorithms belong to Harmonix and are protected by copyright laws. Users are granted a non-exclusive license for business use as outlined in their service agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">8. Service Availability & Performance</h3>
                  <p className="text-charcoalDeep/80">
                    We strive for 99.9% uptime for AI agents but cannot guarantee uninterrupted service. Scheduled maintenance will be communicated in advance. AI agent performance may vary based on data quality and implementation complexity.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">9. Refund Policy</h3>
                  <div className="space-y-2">
                    <p className="text-charcoalDeep/80">
                      <strong>No Refunds:</strong> Due to the nature of AI agent implementation and customization, no refunds are issued after project initiation, as resources are allocated immediately.
                    </p>
                    <p className="text-charcoalDeep/80">
                      <strong>Client Satisfaction Commitment:</strong> We are committed to resolving any concerns with professionalism during the project lifecycle and provide comprehensive support.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">10. Data Security & Compliance</h3>
                  <p className="text-charcoalDeep/80">
                    We implement enterprise-grade security measures including encryption, secure API endpoints, and regular security audits. All data processing complies with applicable privacy laws including GDPR and CCPA.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">11. Limitation of Liability</h3>
                  <p className="text-charcoalDeep/80">
                    Our liability is limited to fees paid in the six-month period preceding a claim. Users agree to indemnify Harmonix against claims resulting from misuse of AI agents or platform services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">12. Governing Law & Dispute Resolution</h3>
                  <p className="text-charcoalDeep/80">
                    These Terms are governed by the laws of Canada. All disputes shall be resolved through binding arbitration under Canadian law, with proceedings conducted in Vancouver, BC.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">13. Platform Evolution</h3>
                  <p className="text-charcoalDeep/80">
                    Harmonix reserves the right to update platform features, AI agent capabilities, and service offerings. All existing agreements and user protections will remain active during any platform evolution.
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-charcoalDeep/80">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-jadeForest" />
                      <span>Harmonix Digital, Vancouver, BC, Canada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-jadeForest" />
                      <span>+1 (604) 757-7771</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-jadeForest" />
                      <span>legal@harmonix.ai</span>
                    </div>
                  </div>
                </section>

              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-charcoalDeep/60">
            Last updated: June 27, 2025 | For questions about these terms, contact our legal team.
          </p>
        </div>
      </div>
    </div>
  );
}