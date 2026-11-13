import React from 'react';
import { Link } from 'wouter';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-10 text-white/70">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <HarmonixLogo size="sm" variant="monogram" />
          
          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-5 text-sm">
            <Link href="/">
              <a className="hover:text-white transition-colors">Home</a>
            </Link>
            <Link href="/marketplace">
              <a className="hover:text-white transition-colors">Marketplace</a>
            </Link>
            <Link href="/demo">
              <a className="hover:text-white transition-colors">Demo</a>
            </Link>
            <Link href="/pricing">
              <a className="hover:text-white transition-colors">Pricing</a>
            </Link>
            <Link href="/join">
              <a className="text-[#FDC500] hover:text-[#FDC500]/80 transition-colors">Join</a>
            </Link>
            <a href="https://trustcenter.harmonixdigital.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy policy</a>
            <a href="https://trustcenter.harmonixdigital.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Public terms</a>
          </nav>
          
          {/* Contact */}
          <div className="max-w-3xl space-y-3 text-center text-xs leading-relaxed">
            <p>Harmonix Digital is operated by 18068526 CANADA INC.</p>
            <p>AI assistants may support our team, but can make mistakes. Do not enter sensitive personal, medical, legal, or financial information into unverified public chat. Website terms do not replace signed client agreements.</p>
            <p>Contact: <a className="underline hover:text-white transition-colors" href="mailto:connect@harmonixdigital.com">connect@harmonixdigital.com</a></p>
            <p>© {new Date().getFullYear()} 18068526 CANADA INC. · Powered by Harmonix</p>
          </div>
        </div>
      </div>
    </footer>
  );
}