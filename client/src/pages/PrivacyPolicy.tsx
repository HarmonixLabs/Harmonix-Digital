import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Shield, Database, Lock, Eye, Users, Server } from "lucide-react";

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl font-bold text-jadeForest mb-4">Privacy Policy</h1>
            <p className="text-lg text-charcoalDeep/70">Harmonix AI Agent Platform</p>
            <p className="text-sm text-charcoalDeep/60 mt-2">Effective Date: Immediately</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-jadeForest/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-jadeForest">
              <Shield className="w-6 h-6" />
              HARMONIX PRIVACY POLICY
            </CardTitle>
            <p className="text-charcoalDeep/70">Protecting Your Data & Privacy</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-sm leading-relaxed">
                
                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    1. Information We Collect
                  </h3>
                  <div className="space-y-3">
                    <p className="text-charcoalDeep/80">
                      Harmonix ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you interact with our AI agent platform.
                    </p>
                    
                    <div className="bg-jadeForest/5 p-4 rounded-lg">
                      <h4 className="font-medium text-jadeForest mb-2">Personal Information:</h4>
                      <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4">
                        <li>Full name, email address, phone number</li>
                        <li>Company information and business requirements</li>
                        <li>Billing and payment information</li>
                        <li>AI agent configuration preferences</li>
                        <li>Platform usage analytics and performance data</li>
                      </ul>
                    </div>

                    <div className="bg-goldenSovereign/5 p-4 rounded-lg">
                      <h4 className="font-medium text-goldenSovereign mb-2">Technical Information:</h4>
                      <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4">
                        <li>IP address, browser type, and device information</li>
                        <li>Session data and interaction logs</li>
                        <li>AI agent performance metrics</li>
                        <li>API usage and integration data</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    2. How We Use Your Information
                  </h3>
                  <div className="space-y-3">
                    <p className="text-charcoalDeep/80 mb-2">Your personal information is used to:</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/50 p-4 rounded-lg border border-jadeForest/20">
                        <h4 className="font-medium text-jadeForest mb-2">Service Delivery:</h4>
                        <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 text-xs">
                          <li>Deploy and customize AI agents</li>
                          <li>Process payments and manage billing</li>
                          <li>Provide technical support</li>
                          <li>Monitor agent performance</li>
                        </ul>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg border border-jadeForest/20">
                        <h4 className="font-medium text-jadeForest mb-2">Communication:</h4>
                        <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 text-xs">
                          <li>Send platform updates and notifications</li>
                          <li>Provide customer support</li>
                          <li>Share service announcements</li>
                          <li>Deliver requested information</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    3. SMS Messaging Policy
                  </h3>
                  <div className="bg-jadeForest/5 p-4 rounded-lg space-y-2">
                    <p className="text-charcoalDeep/80">
                      By submitting your phone number and checking the consent box, you explicitly agree to receive SMS communications from Harmonix.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong className="text-jadeForest">Frequency:</strong> Message frequency may vary
                      </div>
                      <div>
                        <strong className="text-jadeForest">Rates:</strong> Message & data rates may apply
                      </div>
                      <div>
                        <strong className="text-jadeForest">Opt-out:</strong> Reply STOP anytime
                      </div>
                      <div>
                        <strong className="text-jadeForest">Help:</strong> Reply HELP or email support
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    4. Data Sharing & A2P Compliance
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h4 className="font-medium text-red-700 mb-2">What We DON'T Share:</h4>
                      <ul className="list-disc list-inside space-y-1 text-red-600 text-sm ml-4">
                        <li>Mobile information with third parties for marketing</li>
                        <li>Personal data with unauthorized entities</li>
                        <li>AI agent configurations with competitors</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Permitted Sharing:</h4>
                      <ul className="list-disc list-inside space-y-1 text-green-600 text-sm ml-4">
                        <li>Service providers for platform operations</li>
                        <li>Payment processors for billing</li>
                        <li>Cloud infrastructure providers</li>
                        <li>Legal compliance when required</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    5. Data Security & Protection
                  </h3>
                  <div className="space-y-3">
                    <p className="text-charcoalDeep/80">
                      We implement enterprise-grade security measures to protect your information:
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/70 p-3 rounded border border-jadeForest/20 text-center">
                        <Lock className="w-6 h-6 text-jadeForest mx-auto mb-2" />
                        <h4 className="font-medium text-xs text-jadeForest">Encryption</h4>
                        <p className="text-xs text-charcoalDeep/70">End-to-end data encryption</p>
                      </div>
                      <div className="bg-white/70 p-3 rounded border border-jadeForest/20 text-center">
                        <Shield className="w-6 h-6 text-jadeForest mx-auto mb-2" />
                        <h4 className="font-medium text-xs text-jadeForest">Compliance</h4>
                        <p className="text-xs text-charcoalDeep/70">GDPR & CCPA compliant</p>
                      </div>
                      <div className="bg-white/70 p-3 rounded border border-jadeForest/20 text-center">
                        <Server className="w-6 h-6 text-jadeForest mx-auto mb-2" />
                        <h4 className="font-medium text-xs text-jadeForest">Infrastructure</h4>
                        <p className="text-xs text-charcoalDeep/70">Secure cloud hosting</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">6. Your Rights & Controls</h3>
                  <div className="space-y-3">
                    <p className="text-charcoalDeep/80">You have the right to:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-jadeForest rounded-full mt-2"></div>
                          <div>
                            <strong className="text-jadeForest text-sm">Access:</strong>
                            <span className="text-charcoalDeep/70 text-sm"> Request copies of your data</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-jadeForest rounded-full mt-2"></div>
                          <div>
                            <strong className="text-jadeForest text-sm">Correction:</strong>
                            <span className="text-charcoalDeep/70 text-sm"> Update inaccurate information</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-jadeForest rounded-full mt-2"></div>
                          <div>
                            <strong className="text-jadeForest text-sm">Deletion:</strong>
                            <span className="text-charcoalDeep/70 text-sm"> Request data removal</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-jadeForest rounded-full mt-2"></div>
                          <div>
                            <strong className="text-jadeForest text-sm">Portability:</strong>
                            <span className="text-charcoalDeep/70 text-sm"> Export your data</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">7. AI Agent Data Processing</h3>
                  <div className="bg-goldenSovereign/5 p-4 rounded-lg space-y-2">
                    <p className="text-charcoalDeep/80">
                      Our AI agents process data to provide intelligent automation services:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-charcoalDeep/70 ml-4 text-sm">
                      <li>Business communications and customer interactions</li>
                      <li>Performance analytics and optimization data</li>
                      <li>Integration data from connected systems</li>
                      <li>Learning patterns for improved service delivery</li>
                    </ul>
                    <p className="text-xs text-charcoalDeep/60 mt-2">
                      All AI processing is secure, compliant, and used exclusively for your business needs.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">8. Data Retention</h3>
                  <p className="text-charcoalDeep/80">
                    We retain personal information only as long as necessary to provide services and comply with legal obligations. AI agent data is retained to maintain service continuity and can be deleted upon request, subject to business continuity requirements.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">9. International Data Transfers</h3>
                  <p className="text-charcoalDeep/80">
                    Data may be processed in Canada and other jurisdictions where our service providers operate. We ensure appropriate safeguards are in place for international transfers in compliance with applicable privacy laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">10. Updates to This Policy</h3>
                  <p className="text-charcoalDeep/80">
                    We may update this Privacy Policy to reflect changes in our practices or legal requirements. Users will be notified of significant changes, and continued use constitutes acceptance of updated terms.
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-jadeForest mb-3">Contact Information</h3>
                  <div className="bg-jadeForest/5 p-4 rounded-lg">
                    <p className="text-charcoalDeep/80 mb-2">
                      For privacy-related questions or to exercise your rights, contact us:
                    </p>
                    <div className="space-y-1 text-sm text-charcoalDeep/70">
                      <p><strong>Email:</strong> privacy@harmonix.ai</p>
                      <p><strong>Phone:</strong> +1 (604) 757-7771</p>
                      <p><strong>Address:</strong> Harmonix Digital, Vancouver, BC, Canada</p>
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
            Last updated: June 27, 2025 | Your privacy is our priority.
          </p>
        </div>
      </div>
    </div>
  );
}