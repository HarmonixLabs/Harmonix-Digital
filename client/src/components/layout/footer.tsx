import { Link } from "wouter";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { href: "/service-pricing#ai-agents", label: "AI Agents" },
    { href: "/service-pricing#web-design", label: "Web Design" },
    { href: "/service-pricing#blockchain", label: "Blockchain" },
    { href: "/service-pricing#launchpad", label: "The Launchpad" },
  ];

  const legalLinks = [
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/service-pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ];

  const companyLinks = [
    { href: "/case-studies", label: "Case Studies" },
    { href: "/demo", label: "Demo" },
    { href: "/harmony-waitlist", label: "Join Waitlist" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ];

  return (
    <footer className="bg-charcoalDeep border-t border-jadeForest/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/">
              <HarmonixLogo size="lg" variant="full" className="mb-4" />
            </Link>
            <p className="text-sm text-charcoalDeep/70 leading-relaxed">
              Intelligent Systems for Timeless Sovereignty. Transform your business with AI-powered digital team members.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-jadeForest/60 hover:text-jadeForest transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-jadeForest/60 hover:text-jadeForest transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-jadeForest/60 hover:text-jadeForest transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-jadeForest mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-charcoalDeep/70 hover:text-jadeForest transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-jadeForest mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-charcoalDeep/70 hover:text-jadeForest transition-colors cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-lg font-semibold text-jadeForest mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-charcoalDeep/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-jadeForest" />
                <span>Vancouver, BC, Canada</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-jadeForest" />
                <span>+1 (604) 757-7771</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-jadeForest" />
                <span>hello@harmonix.ai</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-jadeForest mb-2">Legal</h4>
              <ul className="space-y-1">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-xs text-charcoalDeep/60 hover:text-jadeForest transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-jadeForest/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-charcoalDeep/60">
              © {currentYear} Harmonix Digital. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-xs text-charcoalDeep/50">
              <Link href="/terms-and-conditions">
                <span className="hover:text-jadeForest transition-colors cursor-pointer">Terms</span>
              </Link>
              <Link href="/privacy-policy">
                <span className="hover:text-jadeForest transition-colors cursor-pointer">Privacy</span>
              </Link>
              <span>Built with ❤️ in Vancouver</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}