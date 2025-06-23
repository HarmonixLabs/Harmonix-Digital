import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { IntelligentWorkflowEngine } from "@/components/workflow/intelligent-workflow-engine";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function WorkflowSuggestionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  // Mock user context - in real app this would come from user profile/onboarding data
  const userContext = {
    industry: 'technology',
    role: user?.role || 'professional',
    companySize: '21-50',
    primaryGoals: ['increase-sales', 'reduce-costs'],
    currentAgents: ['Sales Agent'],
    experience: 'intermediate',
    painPoints: ['manual-repetitive-tasks', 'poor-lead-quality']
  };

  const handleWorkflowSelect = (workflow: any) => {
    setSelectedWorkflow(workflow);
    toast({
      title: "Workflow Selected",
      description: `You selected: ${workflow.title}`,
    });
  };

  const handleStartWorkflow = (workflowId: string) => {
    toast({
      title: "Workflow Started",
      description: "Your intelligent workflow is being configured...",
    });
    // In real app, this would navigate to workflow setup
  };

  return (
    <div className="min-h-screen harmonix-gradient">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <IntelligentWorkflowEngine
            userContext={userContext}
            onWorkflowSelect={handleWorkflowSelect}
            onStartWorkflow={handleStartWorkflow}
          />
        </div>
      </div>
    </div>
  );
}