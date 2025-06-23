import { Link } from "wouter";
import { HarmonixLogo } from "@/components/harmonix-logo";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <HarmonixLogo size="lg" variant="gold" showText={true} />
            <p className="mt-4 text-gray-400 max-w-md">
              Harmonix AI Platform helps visionary businesses Build, Automate, and Exit through 
              intelligent automation orchestrated by the SŌL brain engine.
            </p>
            <div className="mt-6 flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-harmony-gold rounded-full animate-pulse"></div>
              <span>Powered by Regal Wisdom & Trust</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-harmony-gold font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Agent Marketplace
                </Link>
              </li>
              <li>
                <Link href="/nft-mint" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  NFT Minting
                </Link>
              </li>
              <li>
                <Link href="/agent-dashboard" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Agent Control
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-harmony-gold font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-harmony-gold transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Harmonix Digital. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-harmony-gold text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-harmony-gold text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}