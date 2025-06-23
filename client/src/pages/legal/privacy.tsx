import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const privacyPrinciples = [
  {
    icon: Shield,
    title: "Data Protection",
    description: "Your information is encrypted and stored securely using industry-standard protocols"
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear information about what data we collect and how we use it"
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Strict controls on who can access your data and when"
  },
  {
    icon: Database,
    title: "Data Minimization", 
    description: "We only collect data necessary for platform functionality"
  },
  {
    icon: Users,
    title: "User Rights",
    description: "Full control over your data with easy access, export, and deletion options"
  },
  {
    icon: Mail,
    title: "Communication",
    description: "Opt-in only marketing with easy unsubscribe options"
  }
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="harmonix-container">
            <div className="text-center mb-12">
              <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6">
                Legal Compliance
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white font-serif">
                Privacy Policy
              </h1>
              <p className="text-xl text-harmonix-sage-fade max-w-4xl mx-auto">
                Your privacy and data security are fundamental to how we build and operate Harmonix. 
                This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-harmonix-sage-fade mt-4">
                Last updated: June 23, 2025
              </p>
            </div>

            {/* Privacy Principles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {privacyPrinciples.map((principle, index) => (
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

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="harmonix-container">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                
                {/* Information We Collect */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      1. Information We Collect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Account Information</h4>
                      <ul className="list-disc list-inside space-y-2 text-harmonix-sage-fade">
                        <li>Name, email address, and contact details</li>
                        <li>Company information and business profile</li>
                        <li>Billing and payment information (processed securely through Stripe)</li>
                        <li>Authentication credentials (encrypted and hashed)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Usage Data</h4>
                      <ul className="list-disc list-inside space-y-2 text-harmonix-sage-fade">
                        <li>Platform interactions and feature usage patterns</li>
                        <li>AI agent deployment configurations and performance metrics</li>
                        <li>Support conversations and feedback submissions</li>
                        <li>Device information and browser specifications</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Business Data</h4>
                      <ul className="list-disc list-inside space-y-2 text-harmonix-sage-fade">
                        <li>CRM data you choose to integrate (via Go High Level)</li>
                        <li>Workflow configurations and automation settings</li>
                        <li>Team member information and role assignments</li>
                        <li>Performance analytics and reporting data</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* How We Use Information */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      2. How We Use Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Platform Services</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Provide and maintain AI agent functionality</li>
                          <li>Process payments and manage subscriptions</li>
                          <li>Deliver customer support and technical assistance</li>
                          <li>Send service-related communications</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Improvements</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Analyze usage patterns to enhance features</li>
                          <li>Develop new AI agent capabilities</li>
                          <li>Improve platform performance and reliability</li>
                          <li>Personalize user experience</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Security */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      3. Data Security & Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Security Measures</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>AES-256 encryption for data at rest</li>
                          <li>TLS 1.3 encryption for data in transit</li>
                          <li>Multi-factor authentication options</li>
                          <li>Regular security audits and penetration testing</li>
                        </ul>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>SOC 2 Type II compliance framework</li>
                          <li>GDPR and CCPA compliance procedures</li>
                          <li>Employee access controls and training</li>
                          <li>Incident response and breach notification protocols</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Rights */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      4. Your Privacy Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Access & Control</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>View all data we have about you</li>
                          <li>Download your data in portable formats</li>
                          <li>Correct inaccurate information</li>
                          <li>Delete your account and associated data</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Communication Preferences</h4>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li>Opt out of marketing communications</li>
                          <li>Control notification preferences</li>
                          <li>Manage cookie and tracking settings</li>
                          <li>Request restriction of data processing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Third Party Services */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      5. Third Party Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Integrated Services</h4>
                        <p className="text-harmonix-sage-fade text-sm mb-3">
                          We integrate with trusted third-party services to provide platform functionality:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                          <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                          <li><strong>OpenAI:</strong> AI model processing (data not used for training)</li>
                          <li><strong>Go High Level:</strong> CRM integration (with your explicit consent)</li>
                          <li><strong>Neon Database:</strong> Secure data storage (SOC 2 certified)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      6. Contact & Data Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-harmonix-night-pine/30 rounded-lg p-6">
                      <p className="text-harmonix-sage-fade mb-4">
                        For privacy-related questions, data requests, or to exercise your rights:
                      </p>
                      <div className="space-y-2 text-harmonix-sage-fade">
                        <p><strong>Email:</strong> privacy@harmonixdigital.com</p>
                        <p><strong>Data Protection Officer:</strong> dpo@harmonixdigital.com</p>
                        <p><strong>Response Time:</strong> Within 30 days for most requests</p>
                      </div>
                      <p className="text-xs text-harmonix-sage-fade mt-4">
                        We may need to verify your identity before processing certain requests.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Updates */}
                <Card className="harmonix-card-enhanced">
                  <CardHeader>
                    <CardTitle className="text-2xl text-harmonix-regal-gold font-serif">
                      7. Policy Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-harmonix-sage-fade mb-4">
                      We may update this privacy policy to reflect changes in our practices or legal requirements. 
                      Significant changes will be communicated via:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-harmonix-sage-fade text-sm">
                      <li>Email notification to account holders</li>
                      <li>In-platform notification banners</li>
                      <li>Updated "Last modified" date at the top of this policy</li>
                    </ul>
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