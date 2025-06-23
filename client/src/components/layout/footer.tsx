import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold harmony-gold">Harmonix Digital</h3>
            <p className="text-gray-400 text-sm">
              Build, Automate, and Exit through intelligent AI automation
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span>Dashboard</span></li>
              <li><span>Agent Marketplace</span></li>
              <li><span>SŌL Brain Engine</span></li>
              <li><span>Analytics</span></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span>AI Agents</span></li>
              <li><span>The Launchpad</span></li>
              <li><span>The Boardroom</span></li>
              <li><span>Custom Development</span></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span>Support</span></li>
              <li><span>Documentation</span></li>
              <li><span>Community</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Harmonix Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}