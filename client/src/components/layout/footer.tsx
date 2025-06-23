import { Link } from "wouter";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";

export function Footer() {
  return (
    <footer className="bg-harmonix-night-pine border-t border-harmonix-cedar-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <HarmonixLogo size="lg" variant="full" className="harmonix-logo-glow" />
            <p className="mt-4 text-harmonix-sage-fade max-w-md">
              Harmonix AI Platform helps visionary businesses Build, Automate, and Exit through 
              intelligent automation orchestrated by the SŌL brain engine.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-sm text-harmonix-sage-fade">
              <div className="w-2 h-2 bg-harmonix-regal-gold rounded-full animate-pulse"></div>
              <span>Powered by Mysticism, Clarity & Grounded Sovereignty</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-harmonix-regal-gold font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  Agent Marketplace
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  Create Agent
                </Link>
              </li>
              <li>
                <Link href="/my-agents" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  My Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-harmonix-regal-gold font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/harmony" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  Harmony
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/sol-brain" className="text-harmonix-sage hover:text-harmonix-gold transition-colors">
                  SŌL Brain
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-harmonix-cedar-mist flex flex-col md:flex-row justify-between items-center">
          <p className="text-harmonix-sage-fade text-sm">
            © 2025 Harmonix Digital. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-harmonix-sage-fade hover:text-harmonix-regal-gold text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}