import { PageWrapper } from "@/components/transitions/page-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Link } from "wouter";
import { ArrowLeft, Clock, Users, Zap, Sparkles, Star, CheckCircle } from "lucide-react";

export default function Waitlist() {
  return (
    <PageWrapper enableParallax={true} enableGeometry={true}>
      <div className="min-h-screen bg-harmonix-deep-forest">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-jadeForest hover:text-goldenSovereign">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-bold text-charcoalDeep mb-6">
              Join the <span className="text-jadeForest">Harmony</span> Movement
            </h1>
            
            <p className="text-xl text-charcoalDeep/70 max-w-3xl mx-auto mb-8">
              Be among the first to experience the future of AI-powered business automation. 
              Join our exclusive waitlist and get priority access to Harmonix's revolutionary platform.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="bg-white/50 border-jadeForest/20">
                <CardHeader className="text-center pb-4">
                  <Clock className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                  <CardTitle className="text-lg text-charcoalDeep">Early Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-charcoalDeep/70">
                    Get first access to our platform before the public launch
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/50 border-jadeForest/20">
                <CardHeader className="text-center pb-4">
                  <Zap className="w-8 h-8 text-goldenSovereign mx-auto mb-2" />
                  <CardTitle className="text-lg text-charcoalDeep">Exclusive Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-charcoalDeep/70">
                    Special launch pricing and early adopter discounts
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-white/50 border-jadeForest/20">
                <CardHeader className="text-center pb-4">
                  <Users className="w-8 h-8 text-jadeForest mx-auto mb-2" />
                  <CardTitle className="text-lg text-charcoalDeep">VIP Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-charcoalDeep/70">
                    Priority onboarding and dedicated customer success
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-jadeForest/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-charcoalDeep">Reserve Your Spot</CardTitle>
                <CardDescription className="text-charcoalDeep/70">
                  Join thousands of forward-thinking businesses already on the waitlist
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Harmony Waitlist Form Embed */}
                <div className="relative" style={{ height: '1287px', minHeight: '800px' }}>
                  <iframe
                    src="https://api.leadconnectorhq.com/widget/form/0b1uhgr7r2bcbKzp85yF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    id="inline-0b1uhgr7r2bcbKzp85yF"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="A2P Form - Harmony WaitList"
                    data-height="1287"
                    data-layout-iframe-id="inline-0b1uhgr7r2bcbKzp85yF"
                    data-form-id="0b1uhgr7r2bcbKzp85yF"
                    title="A2P Form - Harmony WaitList"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-sm text-charcoalDeep/60 mb-4">
              Prefer to share? Send this link to colleagues:
            </p>
            <div className="bg-white/50 border border-jadeForest/20 rounded-lg p-4 max-w-md mx-auto">
              <code className="text-sm text-jadeForest break-all">
                https://api.leadconnectorhq.com/widget/form/0b1uhgr7r2bcbKzp85yF
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Form Embed Script */}
      <script src="https://link.msgsndr.com/js/form_embed.js"></script>
    </PageWrapper>
  );
}