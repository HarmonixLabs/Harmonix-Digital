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
        
        {/* Sacred Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-harmonix-night-pine/20 via-transparent to-harmonix-regal-gold/10" />
          {/* Raining light particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-b from-harmonix-regal-gold via-harmonix-sage-fade/50 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                animationName: 'starfallSacred',
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
              }}
            />
          ))}
        </div>

        <div className="harmonix-container py-16 sm:py-20 lg:py-24 relative">
          
          {/* Header Section */}
          <div className="text-center mb-16 sm:mb-20">
            
            {/* Logo and Early Bird Badge */}
            <div className="flex justify-center mb-8">
              <HarmonixLogo size="xl" variant="scenic" className="harmonix-logo-glow" />
            </div>
            
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-harmonix-regal-gold/20 to-harmonix-sage-fade/20 text-harmonix-regal-gold border-harmonix-regal-gold/40 px-6 py-3 text-base font-medium backdrop-blur-sm shadow-lg shadow-harmonix-regal-gold/20 mb-8"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
              Exclusive Early Access - Limited Spots Available
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white font-serif leading-tight">
              Join the <span className="text-harmonix-regal-gold">Harmony</span> Movement
            </h1>
            
            <p className="text-xl sm:text-2xl text-harmonix-sage-fade max-w-4xl mx-auto mb-8 leading-relaxed">
              Be among the first to experience the future of AI-powered business automation. 
              Join our exclusive waitlist and get priority access to Harmonix's revolutionary platform.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              <Card className="harmonix-card-enhanced p-8 group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-harmonix-regal-gold/20 transition-colors">
                    <Clock className="w-8 h-8 text-harmonix-regal-gold" />
                  </div>
                  <CardTitle className="text-xl font-bold text-harmonix-regal-gold">Early Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-harmonix-sage-fade text-center leading-relaxed">
                    Get first access to our platform before the public launch. Be among the first 280 users to experience the future.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="harmonix-card-enhanced p-8 group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-harmonix-regal-gold/20 transition-colors">
                    <Star className="w-8 h-8 text-harmonix-regal-gold" />
                  </div>
                  <CardTitle className="text-xl font-bold text-harmonix-regal-gold">30% Early Bird Discount</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-harmonix-sage-fade text-center leading-relaxed">
                    Special launch pricing with 30% off all packages. Save thousands on your AI automation journey.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="harmonix-card-enhanced p-8 group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-harmonix-regal-gold/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-harmonix-regal-gold/20 transition-colors">
                    <Users className="w-8 h-8 text-harmonix-regal-gold" />
                  </div>
                  <CardTitle className="text-xl font-bold text-harmonix-regal-gold">VIP Onboarding</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-harmonix-sage-fade text-center leading-relaxed">
                    Priority onboarding and dedicated customer success. White-glove setup and personalized agent deployment.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="harmonix-card-enhanced backdrop-blur-sm shadow-2xl shadow-harmonix-regal-gold/10">
              <CardHeader className="text-center p-8 sm:p-12">
                <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30 mb-6 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Secure Registration
                </Badge>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-harmonix-regal-gold font-serif mb-4">
                  Pay 30% Deposit & Get 15% Off + Priority Access
                </CardTitle>
                <CardDescription className="text-lg text-harmonix-sage-fade max-w-2xl mx-auto leading-relaxed">
                  Join thousands of forward-thinking businesses already on the waitlist. 
                  Secure your early bird pricing and priority access to the future of business automation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Harmony Waitlist Form Embed */}
                <div className="relative bg-harmonix-night-pine/20 rounded-b-lg" style={{ height: '1287px', minHeight: '800px' }}>
                  <iframe
                    src="https://api.leadconnectorhq.com/widget/form/0b1uhgr7r2bcbKzp85yF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '0 0 8px 8px'
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
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto p-8 bg-harmonix-night-pine/20 rounded-lg border border-harmonix-regal-gold/20">
              <h3 className="text-xl font-bold text-harmonix-regal-gold mb-4">
                Spread the Movement
              </h3>
              <p className="text-harmonix-sage-fade mb-6">
                Know other business owners who could benefit from AI automation? 
                Share this exclusive waitlist and build the future together.
              </p>
              <div className="bg-harmonix-deep-forest/50 px-6 py-4 rounded border border-harmonix-regal-gold/30">
                <code className="text-harmonix-regal-gold font-mono text-sm">
                  harmonix.ai/harmony-waitlist
                </code>
              </div>
              <div className="flex justify-center mt-6">
                <Badge className="bg-harmonix-regal-gold/20 text-harmonix-regal-gold border-harmonix-regal-gold/30">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Referral bonuses coming soon
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>

      {/* Form Embed Script */}
      <script src="https://link.msgsndr.com/js/form_embed.js"></script>
    </PageWrapper>
  );
}