import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HarmonixLogo } from "@/components/brand/HarmonixLogo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { useOnboarding } from "@/hooks/use-onboarding";
import { IntegratedChatbot } from "@/components/chat/integrated-chatbot";
import { OnboardingModal } from "@/components/onboarding/fixed-onboarding-modal";
import { InteractiveTour } from "@/components/onboarding/interactive-tour";
import { UnifiedAuthModal } from "@/components/auth/unified-auth-modal";
import { MysticalTooltip, NeuralTooltip } from "@/components/ui/animated-tooltip";
import { Coins, User, Settings, LogOut, Menu, X, HelpCircle } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, organization, logout } = useAuth();
  const { isConnected } = useWebSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const {
    showModal,
    userState,
    setupProgress,
    triggerOnboarding,
    dismissModal,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/service-pricing", label: "Pricing" },
    { href: "/dashboard/roi", label: "ROI Calculator" },
    { href: "/demo", label: "Demo" },
    { href: "/harmony-waitlist", label: "Join Waitlist" },
    { href: "/case-studies", label: "Success Stories" },
    { href: "/faq", label: "FAQ" },
  ];

  const privateLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/my-agents", label: "My Agents" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard/roi", label: "ROI Analytics" },
    { href: "/create", label: "Create" },
    { href: "/wallet", label: "Wallet" },
  ];

  const navigationLinks = user ? privateLinks : publicLinks;

  const isActive = (href: string) => location === href;

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  const getCurrentPageContext = () => {
    if (location.includes('onboarding')) return 'onboarding';
    if (location.includes('dashboard')) return 'dashboard';
    if (location.includes('marketplace')) return 'marketplace';
    if (location.includes('agents')) return 'agents';
    return 'general';
  };

  return (
    <>
      <nav 
        className="border-b border-jade-forest/20 bg-charcoalDeep backdrop-blur-md sticky top-0 z-50"
        data-tour="navbar"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <HarmonixLogo size="md" variant="full" className="harmonix-logo-glow" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                  variant={location === link.href ? "default" : "ghost"}
                  className={location === link.href ? "bg-harmonix-gold text-deep-space-black" : "text-jade-forest hover:text-harmonix-gold"}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* SŌL Connection Status */}
            <div className="flex items-center space-x-2 text-sm text-jade-forest">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-harmonix-gold' : 'bg-red-400'}`}></div>
              <span>{isConnected ? 'SŌL Connected' : 'SŌL Disconnected'}</span>
            </div>
            
            {user ? (
              <>
                {/* Token Balance */}
                <div 
                  className="hidden sm:flex items-center space-x-2 text-sm"
                  data-tour="tokens"
                >
                  <Coins className="harmony-gold" size={16} />
                  <span className="font-semibold text-jade-forest">{user.tokenBalance.toLocaleString()}</span>
                  <span className="text-jade-forest/70">Harmony</span>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-harmony-gold">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-harmony-gold to-harmony-teal text-harmony-dark">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-deep-space-black border-jade-forest/30" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-jade-forest">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-jade-forest/70">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-jade-forest/30" />
                    <DropdownMenuItem className="text-jade-forest hover:bg-jade-forest/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-jade-forest hover:bg-jade-forest/10">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-jade-forest hover:bg-jade-forest/10"
                      onClick={() => triggerOnboarding('setup')}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Setup Wizard
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden text-jade-forest hover:bg-jade-forest/10">
                      <Coins className="mr-2 h-4 w-4" />
                      {user.tokenBalance} Tokens
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-jade-forest/30" />
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-red-900/20"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setAuthModalTab('login');
                    setShowAuthModal(true);
                  }}
                  className="text-jade-forest hover:text-harmonix-gold"
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-harmonix-gold hover:bg-harmonix-gold/90 text-deep-space-black"
                  onClick={() => {
                    setAuthModalTab('signup');
                    setShowAuthModal(true);
                  }}
                >
                  Pay 30% Deposit & Get 15% Off, Priority Access
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden touch-friendly-btn h-12 w-12"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'harmony-gold bg-gray-800'
                      : 'text-white hover:text-harmony-gold hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/sol-brain"
                className="block px-3 py-2 rounded-md text-base font-medium harmony-teal hover:text-white hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                SŌL Brain
              </Link>
              
              {!user && (
                <div className="pt-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                  <Button className="w-full bg-harmony-gold hover:bg-yellow-500 text-harmony-dark">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </nav>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showModal}
        onClose={dismissModal}
        onStartSetup={() => triggerOnboarding('setup')}
        onStartTour={handleStartTour}
        onSkip={skipOnboarding}
        userState={userState}
      />

      {/* Interactive Tour */}
      <InteractiveTour
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />

      {/* Integrated AI Chatbot */}
      {user && (
        <div data-tour="chat-button">
          <IntegratedChatbot 
            userContext={{
              role: user?.role || 'professional',
              industry: 'technology',
              experience: 'intermediate',
              currentPage: getCurrentPageContext()
            }}
          />
        </div>
      )}

      {/* Unified Auth Modal */}
      <UnifiedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}
