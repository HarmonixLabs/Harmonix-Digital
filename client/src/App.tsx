import React, { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Harmony from "@/pages/harmony";
import SoulBrain from "@/pages/soul-brain";
import Join from "@/pages/join";
import FAQ from "@/pages/faq";
import CaseStudies from "@/pages/case-studies";
import DemoDeploy from "@/pages/demo-deploy";
import Demo from "@/pages/demo";
import MyAgents from "@/pages/my-agents";
import Create from "@/pages/create";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Marketplace from "@/pages/marketplace";
import AgentMarketplace from "@/pages/agent-marketplace";
import Wallet from "@/pages/wallet";
import AgentCash from "@/pages/agent-cash";
import AgentDashboard from "@/pages/agent-dashboard";
import NFTMarketplace from "@/pages/nft-marketplace";
import NFTMint from "@/pages/nft-mint";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/harmony" component={Harmony} />
      <Route path="/soul-brain" component={SoulBrain} />
      <Route path="/join" component={Join} />
      <Route path="/faq" component={FAQ} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/demo-deploy" component={DemoDeploy} />
      <Route path="/demo" component={Demo} />
      <Route path="/my-agents" component={MyAgents} />
      <Route path="/create" component={Create} />
      <Route path="/settings" component={Settings} />
      <Route path="/pricing" component={lazy(() => import("./pages/pricing"))} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/marketplace" component={AgentMarketplace} />
      <Route path="/nft-marketplace" component={Marketplace} />
      <Route path="/agent-cash" component={AgentCash} />
      <Route path="/agent-dashboard" component={AgentDashboard} />
      <Route path="/nft-marketplace" component={NFTMarketplace} />
      <Route path="/nft-mint" component={NFTMint} />
      <Route path="/wallet" component={Wallet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
