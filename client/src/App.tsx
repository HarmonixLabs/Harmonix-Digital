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
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import RoleDashboard from "@/pages/dashboard/RoleDashboard";
import EnhancedLogin from "@/pages/auth/Login";
import EnhancedMarketplace from "@/pages/marketplace/EnhancedMarketplace";
import Harmony from "@/pages/harmony";
// Standardized to sol-brain route
import Join from "@/pages/join";
import FAQ from "@/pages/faq";
import CaseStudies from "@/pages/case-studies";
import DemoDeploy from "@/pages/demo-deploy";
import Demo from "@/pages/demo";
import SolBrainDemo from "@/pages/sol-brain-demo";
import MyAgents from "@/pages/my-agents";
import Create from "@/pages/create";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Signin from "@/pages/signin";
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
import Waitlist from "@/pages/Waitlist";
import FeaturesDemo from "@/pages/features-demo";
import EnhancedDashboard from "@/pages/enhanced-dashboard";
import LeadCaptureDemo from "@/pages/lead-capture-demo";
import SystemHealth from "@/pages/system-health";
import SimpleLoginPage from "@/pages/simple-login";
import ResponsiveTest from "@/pages/responsive-test";
import InteractiveDemo from "@/pages/interactive-demo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <PageTransition>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/harmony" component={Harmony} />
          {/* Standardized to /sol-brain - see sol-brain.tsx */}
          <Route path="/join" component={Join} />
          <Route path="/faq" component={FAQ} />
          <Route path="/case-studies" component={CaseStudies} />
          <Route path="/demo-deploy" component={DemoDeploy} />
          <Route path="/demo" component={Demo} />
          <Route path="/sol-brain-demo" component={SolBrainDemo} />

          <Route path="/features-demo" component={FeaturesDemo} />
          <Route path="/enhanced-dashboard" component={EnhancedDashboard} />
          <Route path="/lead-capture-demo" component={LeadCaptureDemo} />
          <Route path="/system-health" component={SystemHealth} />
          <Route path="/responsive-test" component={ResponsiveTest} />
          <Route path="/interactive-demo" component={InteractiveDemo} />
          <Route path="/my-agents" component={MyAgents} />
          <Route path="/create" component={Create} />
          <Route path="/settings" component={Settings} />
          <Route path="/pricing" component={lazy(() => import("./pages/pricing-enhanced"))} />
          <Route path="/success" component={lazy(() => import("./pages/success"))} />
          <Route path="/thank-you" component={lazy(() => import("./pages/thank-you"))} />
          <Route path="/sol-brain" component={lazy(() => import("./pages/sol-brain"))} />
          <Route path="/dashboard/roi" component={lazy(() => import("./pages/dashboard/roi"))} />
          <Route path="/gamified-onboarding" component={lazy(() => import("./pages/gamified-onboarding"))} />
          <Route path="/get-started" component={lazy(() => import("./pages/get-started"))} />
          <Route path="/sign-in" component={lazy(() => import("./pages/sign-in"))} />

          <Route path="/legal/privacy" component={lazy(() => import("./pages/legal/privacy"))} />
          <Route path="/legal/terms" component={lazy(() => import("./pages/legal/terms"))} />
          <Route path="/legal/cookies" component={lazy(() => import("./pages/legal/cookies"))} />
          <Route path="/legal/sms-terms" component={lazy(() => import("./pages/legal/sms-terms"))} />
          <Route path="/contact" component={lazy(() => import("./pages/contact"))} />
          <Route path="/careers" component={lazy(() => import("./pages/careers"))} />
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/login" component={SimpleLoginPage} />
          <Route path="/signin" component={Signin} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/signup" component={Signup} />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/service-pricing" component={ServicePricing} />
          <Route path="/harmony-waitlist" component={Waitlist} />
          <Route path="/dashboard" component={RoleDashboard} />
          <Route path="/dashboard/legacy" component={Dashboard} />
          <Route path="/marketplace" component={lazy(() => import("./pages/enhanced-marketplace"))} />
          <Route path="/marketplace/legacy" component={Marketplace} />
          <Route path="/auth/login" component={EnhancedLogin} />
          <Route path="/create-agent" component={lazy(() => import("./pages/create-agent"))} />
          <Route path="/agent-builder" component={lazy(() => import("./pages/agent-builder"))} />
          <Route path="/creator-dashboard" component={lazy(() => import("./pages/creator-dashboard"))} />
          <Route path="/marketplace/deploy/:agentId" component={lazy(() => import("./pages/marketplace-deploy"))} />
          <Route path="/agent-marketplace" component={AgentMarketplace} />
          <Route path="/nft-marketplace" component={NFTMarketplace} />
          <Route path="/nft-mint" component={NFTMint} />
          <Route path="/agent-cash" component={AgentCash} />
          <Route path="/agent-dashboard" component={AgentDashboard} />
          <Route path="/wallet" component={lazy(() => import("./pages/wallet"))} />
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
