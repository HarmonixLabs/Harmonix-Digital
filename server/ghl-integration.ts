/**
 * GoHighLevel Integration Service
 * Handles lead capture and CRM synchronization for Harmonix platform
 */

export interface GHLContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface GHLResponse {
  success: boolean;
  contactId?: string;
  message?: string;
  error?: string;
}

class GHLIntegrationService {
  private apiKey: string;
  private locationId: string;
  private baseUrl = 'https://services.leadconnectorhq.com';

  constructor() {
    // Use environment variables for API credentials
    this.apiKey = process.env.GHL_API_KEY || '';
    this.locationId = process.env.GHL_LOCATION_ID || 'eKlKYR6vdxwBnCFOUy5l';
    
    if (!this.apiKey) {
      console.warn('GHL_API_KEY not found in environment variables');
    }
  }

  /**
   * Create or update a contact in GoHighLevel
   */
  async createContact(contactData: GHLContact): Promise<GHLResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'GHL API key not configured'
      };
    }

    try {
      const payload = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || '',
        companyName: contactData.companyName || '',
        source: contactData.source || 'Harmonix Agent Chat',
        locationId: this.locationId,
        tags: contactData.tags || ['agent-lead', 'harmonix-platform'],
        customFields: {
          ...contactData.customFields,
          lead_source: 'Agent Interaction',
          platform: 'Harmonix AI'
        }
      };

      const response = await fetch(`${this.baseUrl}/contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          contactId: result.contact?.id,
          message: 'Contact created successfully'
        };
      } else {
        console.error('GHL API Error:', result);
        return {
          success: false,
          error: result.message || 'Failed to create contact'
        };
      }

    } catch (error: any) {
      console.error('GHL Integration Error:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Add tags to an existing contact
   */
  async addTagsToContact(contactId: string, tags: string[]): Promise<GHLResponse> {
    if (!this.apiKey || !contactId) {
      return {
        success: false,
        error: 'Missing API key or contact ID'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Tags added successfully'
        };
      } else {
        const result = await response.json();
        return {
          success: false,
          error: result.message || 'Failed to add tags'
        };
      }

    } catch (error: any) {
      console.error('GHL Tag Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Trigger a workflow for lead nurturing
   */
  async triggerWorkflow(contactId: string, workflowId: string): Promise<GHLResponse> {
    if (!this.apiKey || !contactId || !workflowId) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/workflows/${workflowId}/subscribers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Workflow triggered successfully'
        };
      } else {
        const result = await response.json();
        return {
          success: false,
          error: result.message || 'Failed to trigger workflow'
        };
      }

    } catch (error: any) {
      console.error('GHL Workflow Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create opportunity in GoHighLevel
   */
  async createOpportunity(contactId: string, opportunityData: {
    name: string;
    pipelineId: string;
    stageId: string;
    monetaryValue?: number;
    source?: string;
  }): Promise<GHLResponse> {
    if (!this.apiKey || !contactId) {
      return {
        success: false,
        error: 'Missing API key or contact ID'
      };
    }

    try {
      const payload = {
        contactId: contactId,
        name: opportunityData.name,
        pipelineId: opportunityData.pipelineId,
        stageId: opportunityData.stageId,
        monetaryValue: opportunityData.monetaryValue || 0,
        source: opportunityData.source || 'Agent Interaction'
      };

      const response = await fetch(`${this.baseUrl}/opportunities/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          contactId: result.opportunity?.id,
          message: 'Opportunity created successfully'
        };
      } else {
        const result = await response.json();
        return {
          success: false,
          error: result.message || 'Failed to create opportunity'
        };
      }

    } catch (error: any) {
      console.error('GHL Opportunity Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const ghlIntegration = new GHLIntegrationService();