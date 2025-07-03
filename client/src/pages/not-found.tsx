import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Container, Section } from "@/components/layout";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { useState } from "react";
import { UnifiedAuthModal } from "@/components/auth/unified-auth-modal";

export default function NotFound() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-harmonix-deep-forest">
      <Navbar />
      
      <Section spacing="xl">
        <Container size="sm">
          <Card className="bg-harmonix-night-pine/50 border-harmonix-cedar-mist/20">
            <CardContent className="p-12 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <HarmonixLogo size="xl" variant="h-mark" />
              </div>

              {/* 404 Message */}
              <div className="mb-8">
                <h1 className="text-6xl font-bold text-harmonix-regal-gold mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
                <p className="text-harmonix-sage-fade max-w-md mx-auto">
                  The page you're looking for seems to have wandered into the digital wilderness. 
                  But don't worry, we can help you find your way back.
                </p>
              </div>

              {/* Animation */}
              <div className="relative h-32 mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-harmonix-regal-gold/20 animate-pulse"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-harmonix-regal-gold/30 animate-ping"></div>
                  <AlertCircle className="absolute w-8 h-8 text-harmonix-regal-gold" />
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-4">
                  While you're here, why not explore what Harmonix can do for you?
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-harmonix-regal-gold hover:bg-harmonix-gold-bright text-harmonix-deep-forest font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Join Waitlist
                  </Button>
                  
                  <Link href="/">
                    <Button variant="outline" className="border-harmonix-regal-gold text-harmonix-regal-gold hover:bg-harmonix-regal-gold/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Additional Links */}
              <div className="mt-8 pt-8 border-t border-harmonix-cedar-mist/20">
                <p className="text-sm text-harmonix-sage-fade mb-4">Or explore these popular pages:</p>
                <div className="flex flex-wrap gap-4 justify-center text-sm">
                  <Link href="/marketplace">
                    <span className="text-harmonix-regal-gold hover:text-harmonix-gold-bright cursor-pointer">
                      Agent Marketplace
                    </span>
                  </Link>
                  <Link href="/demo">
                    <span className="text-harmonix-regal-gold hover:text-harmonix-gold-bright cursor-pointer">
                      Try Demo
                    </span>
                  </Link>
                  <Link href="/service-pricing">
                    <span className="text-harmonix-regal-gold hover:text-harmonix-gold-bright cursor-pointer">
                      Pricing
                    </span>
                  </Link>
                  <Link href="/case-studies">
                    <span className="text-harmonix-regal-gold hover:text-harmonix-gold-bright cursor-pointer">
                      Success Stories
                    </span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Footer />

      {/* Auth Modal */}
      <UnifiedAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </div>
  );
}
