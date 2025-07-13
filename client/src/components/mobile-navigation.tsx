import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Zap, 
  Plus, 
  DollarSign,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const publicLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/marketplace', label: 'Marketplace', icon: Zap },
    { href: '/harmony', label: 'About', icon: Users },
    { href: '/demo', label: 'Demo', icon: Zap },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/faq', label: 'FAQ', icon: ChevronRight },
  ];
  
  const privateLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/marketplace', label: 'Marketplace', icon: Zap },
    { href: '/agent-builder', label: 'Build Agent', icon: Plus },
    { href: '/creator-dashboard', label: 'Creator Hub', icon: DollarSign },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  const links = user ? privateLinks : publicLinks;
  
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden min-h-[44px] min-w-[44px] text-harmonix-sage-fade"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {/* Mobile Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[280px] bg-harmonix-night-pine border-harmonix-sage-fade/20">
          <SheetHeader>
            <SheetTitle className="text-harmonix-regal-gold">Menu</SheetTitle>
          </SheetHeader>
          
          <nav className="mt-6 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              
              return (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      min-h-[44px] text-responsive-base
                      transition-colors
                      ${isActive 
                        ? 'bg-harmonix-regal-gold/10 text-harmonix-regal-gold' 
                        : 'text-harmonix-sage-fade hover:bg-harmonix-cedar-green/20 hover:text-harmonix-sage-fade'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </a>
                </Link>
              );
            })}
            
            {/* Auth Actions */}
            <div className="pt-4 mt-4 border-t border-harmonix-sage-fade/20 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-responsive-sm text-harmonix-sage-fade/70">Signed in as</p>
                    <p className="text-responsive-base font-medium text-harmonix-sage-fade">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start text-harmonix-sage-fade hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-harmonix-sage-fade"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button 
                      className="w-full bg-harmonix-regal-gold text-black hover:bg-harmonix-regal-gold/90"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}