import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LeadCaptureData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  businessName?: string;
  industry?: string;
  jobTitle?: string;
  companySize?: string;
  agentId: string;
  question?: string;
  agentResponse?: string;
  sessionId?: string;
}

export function useLeadCapture() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureLeadAfterResponse = async (
    agentId: string,
    agentName: string,
    question: string,
    agentResponse: string,
    sessionId?: string
  ) => {
    return new Promise<boolean>((resolve) => {
      // Create modal programmatically or use existing LeadCaptureModal
      const shouldCapture = window.confirm(
        `${agentName} has provided valuable insights for your business. Would you like to share your contact information so our team can follow up with personalized recommendations?`
      );

      if (shouldCapture) {
        // For demo purposes, we'll collect basic info via prompts
        // In a real implementation, this would trigger the LeadCaptureModal
        const firstName = window.prompt("First Name:");
        const lastName = window.prompt("Last Name:");
        const email = window.prompt("Email:");
        
        if (firstName && lastName && email) {
          submitLead({
            firstName,
            lastName,
            email,
            agentId,
            question,
            agentResponse,
            sessionId
          }).then(() => resolve(true));
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };

  const submitLead = async (leadData: LeadCaptureData): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/capture-lead", leadData);

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Thank You!",
          description: "Your information has been captured. Our team will follow up with you soon."
        });

        return true;

      } else {
        throw new Error('Failed to capture lead');
      }

    } catch (error: any) {
      console.error('Lead capture error:', error);
      toast({
        title: "Submission Error",
        description: "We couldn't capture your information right now. Please try again.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    captureLeadAfterResponse,
    submitLead,
    isSubmitting
  };
}