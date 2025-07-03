import { apiRequest } from "./queryClient";

export interface LeadCaptureData {
  // Core contact information
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  business?: string;
  company?: string;
  
  // Source and attribution
  source: string;
  formType: 'waitlist' | 'demo' | 'contact' | 'consultation' | 'agent-interest' | 'pricing' | 'onboarding';
  page: string;
  
  // UTM tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  
  // Additional context
  interests?: string[];
  message?: string;
  tier?: string;
  agentType?: string;
  
  // System data
  timestamp?: string;
  userAgent?: string;
  referrer?: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  message: string;
  leadId?: string;
  results?: {
    ghl: boolean;
    hubspot: boolean;
    sheets: boolean;
  };
  errors?: string[];
}

export class UniversalLeadCapture {
  private static instance: UniversalLeadCapture;
  private retryAttempts = 3;
  private retryDelay = 1000; // Start with 1 second

  public static getInstance(): UniversalLeadCapture {
    if (!UniversalLeadCapture.instance) {
      UniversalLeadCapture.instance = new UniversalLeadCapture();
    }
    return UniversalLeadCapture.instance;
  }

  /**
   * Main method to capture leads with comprehensive error handling and retry logic
   */
  public async captureeLead(data: LeadCaptureData): Promise<LeadCaptureResponse> {
    // Enhance data with system information
    const enhancedData = this.enhanceLeadData(data);
    
    // Validate required fields
    const validation = this.validateLeadData(enhancedData);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
        errors: validation.errors
      };
    }

    // Attempt submission with retry logic
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.submitLead(enhancedData);
        
        if (response.success) {
          // Log successful submission
          this.logSubmission(enhancedData, response, attempt);
          return response;
        }
        
        // If not successful and not the last attempt, retry
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, attempt - 1)); // Exponential backoff
          continue;
        }
        
        return response;
      } catch (error) {
        console.error(`Lead capture attempt ${attempt} failed:`, error);
        
        if (attempt === this.retryAttempts) {
          return {
            success: false,
            message: 'Failed to submit lead after multiple attempts',
            errors: [error.message]
          };
        }
        
        await this.delay(this.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    return {
      success: false,
      message: 'Lead capture failed after all retry attempts'
    };
  }

  /**
   * Enhance lead data with system information and UTM tracking
   */
  private enhanceLeadData(data: LeadCaptureData): LeadCaptureData {
    const enhanced = { ...data };
    
    // Add timestamp if not present
    if (!enhanced.timestamp) {
      enhanced.timestamp = new Date().toISOString();
    }
    
    // Add system information
    enhanced.userAgent = navigator.userAgent;
    enhanced.referrer = document.referrer;
    enhanced.page = window.location.pathname;
    
    // Extract UTM parameters from URL if not provided
    if (!enhanced.utmSource || !enhanced.utmMedium) {
      const utmParams = this.extractUTMParameters();
      enhanced.utmSource = enhanced.utmSource || utmParams.utmSource;
      enhanced.utmMedium = enhanced.utmMedium || utmParams.utmMedium;
      enhanced.utmCampaign = enhanced.utmCampaign || utmParams.utmCampaign;
      enhanced.utmTerm = enhanced.utmTerm || utmParams.utmTerm;
      enhanced.utmContent = enhanced.utmContent || utmParams.utmContent;
    }
    
    // Normalize name fields
    if (enhanced.name && !enhanced.firstName && !enhanced.lastName) {
      const nameParts = enhanced.name.split(' ');
      enhanced.firstName = nameParts[0] || '';
      enhanced.lastName = nameParts.slice(1).join(' ') || '';
    } else if (enhanced.firstName && enhanced.lastName && !enhanced.name) {
      enhanced.name = `${enhanced.firstName} ${enhanced.lastName}`.trim();
    }
    
    // Normalize company fields
    if (enhanced.business && !enhanced.company) {
      enhanced.company = enhanced.business;
    } else if (enhanced.company && !enhanced.business) {
      enhanced.business = enhanced.company;
    }
    
    return enhanced;
  }

  /**
   * Validate lead data before submission
   */
  private validateLeadData(data: LeadCaptureData): { valid: boolean; message: string; errors: string[] } {
    const errors: string[] = [];
    
    // Email is required
    if (!data.email) {
      errors.push('Email address is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Source and form type are required
    if (!data.source) {
      errors.push('Lead source is required');
    }
    
    if (!data.formType) {
      errors.push('Form type is required');
    }
    
    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors[0] : 'Validation passed',
      errors
    };
  }

  /**
   * Submit lead to the backend API
   */
  private async submitLead(data: LeadCaptureData): Promise<LeadCaptureResponse> {
    try {
      const response = await apiRequest('POST', '/api/leads', data);
      return response as LeadCaptureResponse;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  /**
   * Extract UTM parameters from current URL
   */
  private extractUTMParameters(): Partial<LeadCaptureData> {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
    };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Delay function for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log successful submission for analytics
   */
  private logSubmission(data: LeadCaptureData, response: LeadCaptureResponse, attempt: number): void {
    console.log('Lead capture successful:', {
      email: data.email,
      source: data.source,
      formType: data.formType,
      attempt,
      leadId: response.leadId,
      results: response.results
    });
    
    // Send analytics event if tracking is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'lead_capture', {
        event_category: 'engagement',
        event_label: data.formType,
        value: 1,
        custom_parameters: {
          source: data.source,
          page: data.page,
          attempt
        }
      });
    }
  }

  /**
   * Get form configuration for different form types
   */
  public getFormConfig(formType: LeadCaptureData['formType']) {
    const configs = {
      waitlist: {
        title: 'Join the Waitlist',
        description: 'Get early access to Harmonix AI agents',
        submitText: 'Join Waitlist',
        fields: ['name', 'email', 'company'],
        interests: true
      },
      demo: {
        title: 'Request a Demo',
        description: 'See Harmonix AI agents in action',
        submitText: 'Request Demo',
        fields: ['name', 'email', 'phone', 'company'],
        interests: true
      },
      contact: {
        title: 'Contact Us',
        description: 'Get in touch with our team',
        submitText: 'Send Message',
        fields: ['name', 'email', 'message'],
        interests: false
      },
      consultation: {
        title: 'Book Consultation',
        description: 'Schedule a strategic consultation',
        submitText: 'Book Consultation',
        fields: ['name', 'email', 'phone', 'company'],
        interests: true
      },
      'agent-interest': {
        title: 'Agent Interest',
        description: 'Learn more about this AI agent',
        submitText: 'Get Information',
        fields: ['name', 'email', 'company'],
        interests: false
      },
      pricing: {
        title: 'Get Pricing',
        description: 'Receive custom pricing for your needs',
        submitText: 'Get Pricing',
        fields: ['name', 'email', 'phone', 'company'],
        interests: true
      },
      onboarding: {
        title: 'Complete Onboarding',
        description: 'Finish setting up your account',
        submitText: 'Complete Setup',
        fields: ['name', 'email', 'company'],
        interests: true
      }
    };
    
    return configs[formType] || configs.waitlist;
  }
}

// Export singleton instance
export const universalLeadCapture = UniversalLeadCapture.getInstance();

// Convenience function for quick lead capture
export async function captureLeadQuick(
  email: string, 
  formType: LeadCaptureData['formType'], 
  source: string,
  additionalData: Partial<LeadCaptureData> = {}
): Promise<LeadCaptureResponse> {
  return universalLeadCapture.captureeLead({
    email,
    formType,
    source,
    ...additionalData
  });
}