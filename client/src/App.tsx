import React, { Suspense, lazy } from "react";
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
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import RoleDashboard from "@/pages/dashboard/RoleDashboard";
import EnhancedLogin from "@/pages/auth/Login";
import EnhancedMarketplace from "@/pages/marketplace/EnhancedMarketplace";
import Harmony from "@/pages/harmony";
// Standardized to sol-brain route
import Join from "@/pages/join";
import UnifiedJoin from "@/pages/unified-join";
import FAQ from "@/pages/faq";
import CaseStudies from "@/pages/case-studies";
import DemoDeploy from "@/pages/demo-deploy";
import Demo from "@/pages/demo";
import SolBrainDemo from "@/pages/sol-brain-demo";
import MyAgents from "@/pages/my-agents";
import Create from "@/pages/create";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import AuthCallback from "@/pages/auth-callback";
import OnboardingPage from "@/pages/onboarding";
import Signup from "@/pages/signup";
import Marketplace from "@/pages/marketplace";
import AgentMarketplace from "@/pages/agent-marketplace";
import Wallet from "@/pages/wallet";
import AgentCash from "@/pages/agent-cash";
import AgentDashboard from "@/pages/agent-dashboard";
import NFTMarketplace from "@/pages/nft-marketplace";
import NFTMint from "@/pages/nft-mint";
import ThankYou from "@/pages/thank-you";
import Checkout from "@/pages/checkout";
import LoadingShowcase from "@/pages/loading-showcase";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ServicePricing from "@/pages/ServicePricing";
import Pricing from "@/pages/pricing";
import Waitlist from "@/pages/Waitlist";
import FeaturesDemo from "@/pages/features-demo";
import EnhancedDashboard from "@/pages/enhanced-dashboard";
import LeadCaptureDemo from "@/pages/lead-capture-demo";
import SystemHealth from "@/pages/system-health";
// Removed duplicate authentication imports
import ResponsiveTest from "@/pages/responsive-test";
import InteractiveDemo from "@/pages/interactive-demo";
import AgentTest from "@/pages/agent-test";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <RedirectHandler />
        <Switch>
          {/* === UNIFIED CORE ROUTES === */}
          <Route path="/" component={Home} />
          
          {/* Agent Marketplace - UNIFIED */}
          <Route path="/marketplace" component={Marketplace} />
          
          {/* Join/Waitlist - UNIFIED */}
          <Route path="/join" component={UnifiedJoin} />
          
          {/* Dashboard - UNIFIED */}
          <Route path="/dashboard" component={RoleDashboard} />
          <Route path="/replit-dashboard" component={Dashboard} />
          
          {/* Creator Zone - UNIFIED */}
          <Route path="/creator" component={lazy(() => import("./pages/creator-dashboard"))} />
          
          {/* Demo - UNIFIED */}
          <Route path="/demo" component={Demo} />
          
          {/* Authentication - UNIFIED */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          
          {/* Admin - UNIFIED */}
          <Route path="/admin" component={lazy(() => import("./pages/admin"))} />

          {/* === SUPPORT PAGES === */}
          <Route path="/faq" component={FAQ} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/service-pricing" component={ServicePricing} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          
          {/* === EXTENDED FUNCTIONALITY === */}
          <Route path="/wallet" component={lazy(() => import("./pages/wallet"))} />
          <Route path="/settings" component={Settings} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/sol-brain" component={lazy(() => import("./pages/sol-brain"))} />
          <Route path="/dashboard/roi" component={lazy(() => import("./pages/dashboard/roi"))} />
          <Route path="/nft-marketplace" component={NFTMarketplace} />
          <Route path="/nft-mint" component={NFTMint} />
          
          {/* === DEVELOPMENT & TESTING === */}
          <Route path="/features-demo" component={FeaturesDemo} />
          <Route path="/system-health" component={SystemHealth} />
          <Route path="/loading-showcase" component={LoadingShowcase} />
          
          {/* === LEGACY ROUTES (will auto-redirect via RedirectHandler) === */}
          <Route path="/harmony" component={Harmony} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/auth/callback" component={AuthCallback} />
          
          {/* === LEGAL PAGES === */}
          <Route path="/legal/privacy" component={lazy(() => import("./pages/legal/privacy"))} />
          <Route path="/legal/terms" component={lazy(() => import("./pages/legal/terms"))} />
          <Route path="/legal/cookies" component={lazy(() => import("./pages/legal/cookies"))} />
          <Route path="/legal/sms-terms" component={lazy(() => import("./pages/legal/sms-terms"))} />
          <Route path="/contact" component={lazy(() => import("./pages/contact"))} />
          <Route path="/careers" component={lazy(() => import("./pages/careers"))} />
          <Route path="/system-health" component={lazy(() => import("./pages/system-health"))} />
          <Route path="/platform-status" component={lazy(() => import("./pages/platform-status"))} />
          <Route path="/admin-panel" component={lazy(() => import("./pages/admin-panel"))} />
          <Route path="/admin/status" component={lazy(() => import("./pages/admin/status"))} />
          <Route path="/transitions-demo" component={lazy(() => import("./pages/transitions-demo"))} />
          <Route path="/loading-showcase" component={LoadingShowcase} />
          
          {/* Error Pages */}
          <Route path="/error/400" component={lazy(() => import("./pages/errors/error-400"))} />
          <Route path="/error/401" component={lazy(() => import("./pages/errors/error-401"))} />
          <Route path="/error/403" component={lazy(() => import("./pages/errors/error-403"))} />
          <Route path="/error/500" component={lazy(() => import("./pages/errors/error-500"))} />
          
          <Route component={NotFound} />
        </Switch>
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
            <Suspense fallback={<SacredLoader />}>
              <Router />
            </Suspense>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
