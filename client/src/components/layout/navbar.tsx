import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { HarmonixLogo } from '@/components/brand/HarmonixLogo';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solStatus, setSolStatus] = useState<'connected' | 'disconnected'>('connected');

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Simulate SOL status (would be from real connection in production)
  useEffect(() => {
    const interval = setInterval(() => {
      setSolStatus(prev => prev === 'connected' ? 'connected' : 'disconnected');
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const Dot = ({ ok }: { ok: boolean }) => (
    <span className={cn(
      "inline-block h-2 w-2 rounded-full mr-2",
      ok ? "bg-[#16a34a]" : "bg-[#ef4444]"
    )} />
  );

  const isActive = (href: string) => location === href;

  return (
    <header className={cn(
      "sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#0b0b0bcc] bg-[#0b0b0c]/85",
      atTop ? "border-b border-transparent" : "border-b border-white/5"
    )}>
      <nav className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/">
            <a className="flex items-center gap-2">
              <HarmonixLogo size="sm" variant="monogram" />
              <span className="sr-only">Harmonix</span>
            </a>
          </Link>

          {/* Center: Primary Nav (desktop) */}
          <ul className="hidden lg:flex items-center gap-6 text-sm">
            <li>
              <Link href="/">
                <a className={cn(
                  "hover:text-white transition-colors",
                  isActive('/') ? "text-[#FDC500] border-b-2 border-[#FDC500]" : "text-white/80"
                )}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/marketplace">
                <a className={cn(
                  "hover:text-white transition-colors",
                  isActive('/marketplace') ? "text-[#FDC500] border-b-2 border-[#FDC500]" : "text-white/80"
                )}>
                  Marketplace
                </a>
              </Link>
            </li>
            <li>
              <Link href="/demo">
                <a className={cn(
                  "hover:text-white transition-colors",
                  isActive('/demo') ? "text-[#FDC500] border-b-2 border-[#FDC500]" : "text-white/80"
                )}>
                  Demo
                </a>
              </Link>
            </li>
            <li>
              <Link href="/pricing">
                <a className={cn(
                  "hover:text-white transition-colors",
                  isActive('/pricing') ? "text-[#FDC500] border-b-2 border-[#FDC500]" : "text-white/80"
                )}>
                  Pricing
                </a>
              </Link>
            </li>
            <li>
              <Link href="/join">
                <a className="rounded-full px-3 py-1.5 text-sm font-medium bg-[#FDC500] text-black hover:shadow-[0_0_0_3px_rgba(253,197,0,.25)] transition">
                  Join – Early Access
                </a>
              </Link>
            </li>
            <li>
              <Link href={isAuthenticated ? "/dashboard" : "/auth/signin"}>
                <a className={cn(
                  "hover:text-white transition-colors",
                  (isActive('/dashboard') || isActive('/auth/signin')) ? "text-[#FDC500] border-b-2 border-[#FDC500]" : "text-white/80"
                )}>
                  {isAuthenticated ? "Dashboard" : "Sign In"}
                </a>
              </Link>
            </li>
          </ul>

          {/* Right: SOL chip (desktop) */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden lg:flex items-center text-xs text-white/80">
                  <span className="inline-flex items-center rounded-full border border-white/10 px-2 py-1">
                    <Dot ok={solStatus === 'connected'} />
                    {solStatus === 'connected' ? 'SŌL Connected' : 'SŌL Disconnected'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Org-level state. Manage in Dashboard → System Health.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile burger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white/80">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-[#0b0b0f]/95 backdrop-blur border-l border-white/10">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <HarmonixLogo size="sm" variant="monogram" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setMobileOpen(false)}
                    className="text-white/70"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="flex flex-col text-lg text-white/90 gap-4 flex-1">
                  <Link href="/" onClick={() => setMobileOpen(false)}>
                    <a className={cn(
                      "py-2 transition-colors",
                      isActive('/') ? "text-[#FDC500]" : "hover:text-white"
                    )}>
                      Home
                    </a>
                  </Link>
                  <Link href="/marketplace" onClick={() => setMobileOpen(false)}>
                    <a className={cn(
                      "py-2 transition-colors",
                      isActive('/marketplace') ? "text-[#FDC500]" : "hover:text-white"
                    )}>
                      Marketplace
                    </a>
                  </Link>
                  <Link href="/demo" onClick={() => setMobileOpen(false)}>
                    <a className={cn(
                      "py-2 transition-colors",
                      isActive('/demo') ? "text-[#FDC500]" : "hover:text-white"
                    )}>
                      Demo
                    </a>
                  </Link>
                  <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                    <a className={cn(
                      "py-2 transition-colors",
                      isActive('/pricing') ? "text-[#FDC500]" : "hover:text-white"
                    )}>
                      Pricing
                    </a>
                  </Link>
                  <Link href={isAuthenticated ? "/dashboard" : "/auth/signin"} onClick={() => setMobileOpen(false)}>
                    <a className={cn(
                      "py-2 transition-colors",
                      (isActive('/dashboard') || isActive('/auth/signin')) ? "text-[#FDC500]" : "hover:text-white"
                    )}>
                      {isAuthenticated ? "Dashboard" : "Sign In"}
                    </a>
                  </Link>
                  
                  <div className="pt-4 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full",
                        solStatus === "connected" ? "bg-[#16a34a]" : "bg-[#ef4444]"
                      )} />
                      {solStatus === "connected" ? "SŌL Connected" : "SŌL Disconnected"}
                    </span>
                  </div>
                </nav>
                
                {/* Join CTA pinned at bottom */}
                <div className="pt-4 border-t border-white/10">
                  <Link href="/join" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-[#FDC500] text-black hover:bg-[#FDC500]/90 font-semibold">
                      Join – Early Access
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}