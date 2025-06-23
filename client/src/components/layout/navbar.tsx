import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnboardingTrigger } from "@/components/onboarding/onboarding-trigger";
import { HarmonixLogo } from "@/components/harmonix-logo";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useWebSocket } from "@/hooks/use-websocket";
import { Coins, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, organization, logout } = useAuth();
  const { isConnected } = useWebSocket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/agent-dashboard", label: "Agent Control" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/nft-mint", label: "Mint NFTs" },
    { href: "/wallet", label: "Wallet" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="harmonixGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                </defs>
                
                {/* Outer Circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="url(#harmonixGold)" 
                  strokeWidth="4"
                  opacity="0.9"
                />
                
                {/* Letter H with geometric design */}
                <g fill="url(#harmonixGold)" opacity="0.95">
                  {/* Left vertical line */}
                  <rect x="25" y="25" width="6" height="50" />
                  
                  {/* Right vertical line */}
                  <rect x="69" y="25" width="6" height="50" />
                  
                  {/* Horizontal crossbar */}
                  <rect x="31" y="47" width="38" height="6" />
                  
                  {/* Golden ratio inspired smaller elements */}
                  <rect x="45" y="60" width="10" height="15" />
                  <rect x="58" y="67" width="6" height="8" opacity="0.7" />
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold text-harmony-gold">HARMONIX</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href)
                    ? 'harmony-gold'
                    : 'text-white hover:text-harmony-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/sol-brain"
              className="harmony-teal hover:text-white transition-colors"
            >
              SŌL Brain
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Onboarding Trigger */}
            <OnboardingTrigger variant="help" size="sm" className="hidden md:flex" />
            
            {/* SŌL Connection Status */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'SŌL Connected' : 'SŌL Disconnected'}</span>
            </div>
            
            {user ? (
              <>
                {/* Token Balance */}
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <Coins className="harmony-gold" size={16} />
                  <span className="font-semibold">{user.tokenBalance.toLocaleString()}</span>
                  <span className="text-gray-400">Harmony</span>
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
                  <DropdownMenuContent className="w-56 bg-harmony-slate border-gray-800" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden text-gray-300 hover:bg-gray-800">
                      <Coins className="mr-2 h-4 w-4" />
                      {user.tokenBalance} Tokens
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-gray-800"
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
                <Button variant="ghost">Sign In</Button>
                <Button className="bg-harmony-gold hover:bg-yellow-500 text-harmony-dark">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
  );
}
