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
            <Link href="/legal/privacy">
              <a className="hover:text-white transition-colors">Privacy</a>
            </Link>
            <Link href="/legal/terms">
              <a className="hover:text-white transition-colors">Terms</a>
            </Link>
            <Link href="/system-health">
              <a className="opacity-70 hover:opacity-100 transition-opacity text-xs">
                System Health (Founders)
              </a>
            </Link>
          </nav>
          
          {/* Contact */}
          <div className="text-xs">
            Contact: <a className="underline hover:text-white transition-colors" href="mailto:connect@harmonixdigital.com">
              connect@harmonixdigital.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}