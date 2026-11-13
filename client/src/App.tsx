import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { AnimatePresence } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageTransition, SacredLoader } from "@/components/transitions/page-transition";
import RedirectHandler from "@/components/RedirectHandler";
import { AppShell } from "@/components/layout/AppShell";
import { HarmonixGHLChat } from "@/components/integrations/HarmonixGHLChat";

// Core Pages
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Harmony from "@/pages/harmony";
import Pricing from "@/pages/pricing";
import CaseStudies from "@/pages/case-studies";
import Join from "@/pages/join";
import Demo from "@/pages/demo";
import Contact from "@/pages/contact";
import Careers from "@/pages/careers";
import FAQ from "@/pages/faq";

// Authentication
import Login from "@/pages/auth/Login";
import AuthCallback from "@/pages/auth-callback";

// Dashboard System
import Dashboard from "@/pages/dashboard";
import RoleDashboard from "@/pages/dashboard/RoleDashboard";

// Agent & Feature Pages
import MyAgents from "@/pages/my-agents";
import AgentCash from "@/pages/agent-cash";
import AgentDashboard from "@/pages/agent-dashboard";

// Commerce & NFT
import Wallet from "@/pages/wallet";
import NFTMarketplace from "@/pages/nft-marketplace";
import NFTMint from "@/pages/nft-mint";
import Checkout from "@/pages/checkout";
import ThankYou from "@/pages/thank-you";

// User Management
import Settings from "@/pages/settings";
import OnboardingPage from "@/pages/onboarding";

// Legal & Compliance
import TermsPage from "@/pages/legal/terms";
import PrivacyPage from "@/pages/legal/privacy";
import CookiesPage from "@/pages/legal/cookies";
import SMSTermsPage from "@/pages/legal/sms-terms";

// Development & Testing
import LoadingShowcase from "@/pages/loading-showcase";
import SystemHealth from "@/pages/system-health";
import ResponsiveTest from "@/pages/responsive-test";
import AgentTest from "@/pages/agent-test";
import PlatformStatus from "@/pages/platform-status";
import QAStatus from "@/pages/qa-status";

// Error Pages
import NotFound from "@/pages/not-found";
import Error400 from "@/pages/errors/error-400";
import Error401 from "@/pages/errors/error-401";
import Error403 from "@/pages/errors/error-403";
import Error500 from "@/pages/errors/error-500";

import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <AppShell>
          <RedirectHandler />
          <HarmonixGHLChat />
          <Switch>
          {/* === CORE PUBLIC ROUTES === */}
          <Route path="/" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/harmony" component={Harmony} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/join" component={Join} />
          <Route path="/demo" component={Demo} />
          <Route path="/contact" component={Contact} />
          <Route path="/careers" component={Careers} />
          <Route path="/faq" component={FAQ} />
          
          {/* === AUTHENTICATION === */}
          <Route path="/auth/signin" component={Login} />
          <Route path="/auth/signup" component={Login} />
          <Route path="/auth-callback" component={AuthCallback} />
          
          {/* === DASHBOARD SYSTEM === */}
          <Route path="/dashboard" component={RoleDashboard} />
          <Route path="/replit-dashboard" component={Dashboard} />
          
          {/* === AGENT MANAGEMENT === */}
          <Route path="/my-agents" component={MyAgents} />
          <Route path="/agent-cash" component={AgentCash} />
          <Route path="/agent-dashboard" component={AgentDashboard} />
          
          {/* === DEMO & FEATURES === */}
          
          {/* === COMMERCE & NFT === */}
          <Route path="/wallet" component={Wallet} />
          <Route path="/nft-marketplace" component={NFTMarketplace} />
          <Route path="/nft-mint" component={NFTMint} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thank-you" component={ThankYou} />
          
          {/* === USER MANAGEMENT === */}
          <Route path="/settings" component={Settings} />
          <Route path="/onboarding" component={OnboardingPage} />
          
          {/* === LEGAL & COMPLIANCE === */}
          <Route path="/legal/terms" component={TermsPage} />
          <Route path="/legal/privacy" component={PrivacyPage} />
          <Route path="/legal/cookies" component={CookiesPage} />
          <Route path="/legal/sms-terms" component={SMSTermsPage} />
          
          {/* === DEVELOPMENT & TESTING === */}
          <Route path="/loading-showcase" component={LoadingShowcase} />
          <Route path="/system-health" component={SystemHealth} />
          <Route path="/responsive-test" component={ResponsiveTest} />
          <Route path="/agent-test" component={AgentTest} />
          <Route path="/platform-status" component={PlatformStatus} />
          <Route path="/qa-status" component={QAStatus} />
          
          {/* === ERROR PAGES === */}
          <Route path="/error/400" component={Error400} />
          <Route path="/error/401" component={Error401} />
          <Route path="/error/403" component={Error403} />
          <Route path="/error/500" component={Error500} />
          
          {/* === 404 FALLBACK === */}
          <Route component={NotFound} />
        </Switch>
        </AppShell>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;