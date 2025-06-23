import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Agents", href: "/marketplace" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "SŌL Brain", href: "/sol-brain" },
        { label: "Wallet", href: "/wallet" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Support", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Twitter", href: "#" },
        { label: "Discord", href: "#" },
        { label: "GitHub", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-800 bg-black/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-harmony-gold to-yellow-400 flex items-center justify-center">
                <div className="text-harmony-dark text-sm">🪷</div>
              </div>
              <span className="text-xl font-bold harmony-gold">HARMONIX</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering businesses with intelligent AI agents and the SŌL brain engine for seamless automation.
            </p>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a 
                        href={link.href} 
                        className="hover:text-harmony-gold transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <a className="hover:text-harmony-gold transition-colors">
                          {link.label}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Harmonix. All rights reserved. | Powered by SŌL Brain Engine</p>
        </div>
      </div>
    </footer>
  );
}
