import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, Users, Globe, AlertTriangle, FileText } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const legalPrinciples = [
  {
    icon: Scale,
    title: "Fair Terms",
    description: "Transparent, balanced agreements protecting both parties"
  },
  {
    icon: Shield,
    title: "Data Protection",
    description: "GDPR, CCPA compliance with robust security measures"
  },
  {
    icon: Users,
    title: "User Rights",
    description: "Clear rights and responsibilities for all platform users"
  },
  {
    icon: Globe,
    title: "Global Compliance",
    description: "International legal standards and jurisdiction clarity"
  },
  {
    icon: AlertTriangle,
    title: "Risk Management",
    description: "Comprehensive liability and limitation frameworks"
  },
  {
    icon: FileText,
    title: "Service Level",
    description: "Defined performance standards and support commitments"
  }
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Legal Framework
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Terms of Service
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Comprehensive terms governing your use of the Harmonix AI agent platform. 
                These terms ensure fair, secure, and compliant service delivery for all users.
              </p>
              <p className="text-sm text-harmonix-sage-fade mt-4">
                Last updated: June 23, 2025 • Effective Date: June 23, 2025
              </p>
            </div>

            {/* Legal Principles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {legalPrinciples.map((principle, index) => (
                <Card key={index} className="harmonix-card-enhanced">
                  <CardContent className="p-6 text-center">
                    <principle.icon className="w-8 h-8 text-harmonix-regal-gold mx-auto mb-4" />
                    <h3 className="font-bold text-white mb-2">{principle.title}</h3>
                    <p className="text-sm text-harmonix-sage-fade">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">

                {/* Agreement & Acceptance */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      1. Agreement & Acceptance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-harmonix-sage-fade">
                      By accessing or using the Harmonix platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                      If you disagree with any part of these terms, you may not access the Service.
                    </p>
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Entity Agreement</h4>
                      <p className="text-harmonix-sage-fade text-sm">
                        If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have 
                        the authority to bind such entity to these Terms. In such case, "you" and "your" refer to that entity.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Description */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      2. Service Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Platform Services</h4>
                      <ul className="list-disc list-inside space-y-2 text-harmonix-sage-fade">
                        <li>AI agent deployment and management platform</li>
                        <li>SŌL brain orchestration engine for agent coordination</li>
                        <li>Business workflow automation and integration services</li>
                        <li>Real-time analytics and performance monitoring</li>
                        <li>CRM integration and lead management capabilities</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Service Availability</h4>
                      <p className="text-harmonix-sage-fade text-sm">
                        We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Planned maintenance 
                        will be communicated 48 hours in advance when possible.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* User Accounts & Responsibilities */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      3. User Accounts & Responsibilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Account Security</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Maintain confidentiality of login credentials</li>
                          <li>Enable two-factor authentication when available</li>
                          <li>Notify us immediately of unauthorized access</li>
                          <li>Accept responsibility for all account activity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Acceptable Use</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Use services for legitimate business purposes only</li>
                          <li>Comply with all applicable laws and regulations</li>
                          <li>Respect intellectual property rights</li>
                          <li>Avoid activities that could harm the platform</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing & Payment Terms */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      4. Billing & Payment Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Payment Structure</h4>
                      <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-harmonix-regal-gold mb-2">Setup Fees</h5>
                            <ul className="text-sm text-harmonix-sage-fade space-y-1">
                              <li>One-time agent deployment and configuration</li>
                              <li>Custom integration setup and testing</li>
                              <li>Initial training and onboarding sessions</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-harmonix-regal-gold mb-2">Ongoing Costs</h5>
                            <ul className="text-sm text-harmonix-sage-fade space-y-1">
                              <li>Monthly platform access and maintenance</li>
                              <li>AI processing tokens and API usage</li>
                              <li>Support and feature updates</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Payment Processing</h4>
                      <p className="text-harmonix-sage-fade text-sm">
                        All payments are processed securely through Stripe. We accept major credit cards and ACH transfers. 
                        Invoices are due within 30 days of issuance unless otherwise agreed in writing.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Intellectual Property */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      5. Intellectual Property Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Harmonix Property</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Platform source code and algorithms</li>
                          <li>AI agent templates and configurations</li>
                          <li>SŌL brain orchestration engine</li>
                          <li>Harmonix branding and trademarks</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">User Content</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>You retain ownership of your business data</li>
                          <li>Grant us license to process for service delivery</li>
                          <li>We do not claim ownership of your content</li>
                          <li>Custom configurations remain your property</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Limitation of Liability */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      6. Limitation of Liability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Service Limitations</h4>
                      <p className="text-harmonix-sage-fade text-sm mb-4">
                        Harmonix provides AI automation services "as is" and makes no warranties about uninterrupted service, 
                        specific performance outcomes, or fitness for particular business purposes.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-harmonix-regal-gold mb-2">Excluded Damages</h5>
                          <ul className="text-xs text-harmonix-sage-fade space-y-1">
                            <li>Indirect or consequential business losses</li>
                            <li>Lost profits or revenue projections</li>
                            <li>Data loss not caused by our negligence</li>
                            <li>Third-party integration failures</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-harmonix-regal-gold mb-2">Liability Cap</h5>
                          <p className="text-xs text-harmonix-sage-fade">
                            Our total liability is limited to the amount paid by you in the 12 months 
                            preceding the claim, excluding setup fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Termination */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      7. Termination & Data Handling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Termination Rights</h4>
                      <p className="text-harmonix-sage-fade text-sm mb-4">
                        Either party may terminate this agreement with 30 days written notice. We may terminate immediately 
                        for breach of terms, non-payment, or illegal use of services.
                      </p>
                      
                      <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                        <h5 className="font-semibold text-harmonix-regal-gold mb-3">Data Export & Deletion</h5>
                        <ul className="list-disc list-inside space-y-2 text-harmonix-sage-fade text-sm">
                          <li>30-day grace period for data export after termination</li>
                          <li>All business data provided in standard formats</li>
                          <li>Configuration backups available upon request</li>
                          <li>Complete data deletion within 90 days of termination</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Governing Law */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      8. Governing Law & Dispute Resolution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Jurisdiction</h4>
                        <p className="text-harmonix-sage-fade text-sm">
                          These terms are governed by the laws of Delaware, USA. Any disputes will be resolved in Delaware state 
                          or federal courts, and you consent to jurisdiction in these venues.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Dispute Process</h4>
                        <ol className="list-decimal list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Good faith negotiation (30 days)</li>
                          <li>Mediation through neutral third party</li>
                          <li>Binding arbitration if mediation fails</li>
                          <li>Court proceedings for injunctive relief</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      9. Contact & Legal Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <p className="text-harmonix-sage-fade mb-4">
                        For legal notices, terms questions, or formal communications:
                      </p>
                      <div className="space-y-2 text-harmonix-sage-fade">
                        <p><strong>Legal Department:</strong> legal@harmonixdigital.com</p>
                        <p><strong>General Counsel:</strong> counsel@harmonixdigital.com</p>
                        <p><strong>Registered Agent:</strong> Available upon request</p>
                        <p><strong>Business Address:</strong> Available for service of process</p>
                      </div>
                      <p className="text-xs text-harmonix-sage-fade mt-4">
                        Legal notices must be in writing and delivered to the above address or email to be considered effective.
                      </p>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}