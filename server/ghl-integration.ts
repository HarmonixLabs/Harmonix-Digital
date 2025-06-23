// Go High Level CRM Integration
import fetch from 'node-fetch';

interface CRMContact {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  source?: string;
  interests?: string[];
  activity?: string;
  tier?: string;
  timestamp?: string;
  [key: string]: any;
}

interface GHLContact {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

class GHLIntegration {
  private apiKey: string;
  private baseUrl = 'https://rest.gohighlevel.com/v1';
  
  constructor() {
    this.apiKey = process.env.GHL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('GHL_API_KEY not provided - CRM sync will be logged only');
    }
  }

  async createOrUpdateContact(contactData: CRMContact): Promise<{ success: boolean; contactId?: string; message?: string }> {
    if (!this.apiKey) {
      // Log the contact data when API key is not available
      console.log('GHL CRM Contact (API key not configured):', {
        email: contactData.email,
        name: contactData.name,
        phone: contactData.phone,
        company: contactData.company,
        source: contactData.source,
        activity: contactData.activity,
        timestamp: contactData.timestamp
      });
      
      return { 
        success: true, 
        message: 'Contact logged (GHL API key not configured)' 
      };
    }

    try {
      // Split name into first and last name
      const nameParts = (contactData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Prepare GHL contact data
      const ghlContact: GHLContact = {
        firstName,
        lastName,
        email: contactData.email,
        phone: contactData.phone || '',
        companyName: contactData.company || '',
        source: contactData.source || 'harmonix_platform',
        tags: this.prepareTags(contactData),
        customFields: {
          harmonix_activity: contactData.activity,
          harmonix_timestamp: contactData.timestamp,
          harmonix_interests: contactData.interests?.join(', ') || '',
          harmonix_tier: contactData.tier || ''
        }
      };

      // Check if contact exists
      const existingContact = await this.findContactByEmail(contactData.email);
      
      let response;
      if (existingContact) {
        // Update existing contact
        response = await this.updateContact(existingContact.id, ghlContact);
      } else {
        // Create new contact
        response = await this.createContact(ghlContact);
      }

      return {
        success: true,
        contactId: response.contact?.id || existingContact?.id,
        message: existingContact ? 'Contact updated' : 'Contact created'
      };

    } catch (error) {
      console.error('GHL API Error:', error);
      return {
        success: false,
        message: `GHL sync failed: ${error.message}`
      };
    }
  }

  private async findContactByEmail(email: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`GHL API error: ${response.status}`);
      }

      const data = await response.json();
      return data.contacts?.[0] || null;
    } catch (error) {
      console.error('Error finding contact:', error);
      return null;
    }
  }

  private async createContact(contactData: GHLContact): Promise<any> {
    const response = await fetch(`${this.baseUrl}/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create contact: ${response.status}`);
    }

    return await response.json();
  }

  private async updateContact(contactId: string, contactData: Partial<GHLContact>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update contact: ${response.status}`);
    }

    return await response.json();
  }

  private prepareTags(contactData: CRMContact): string[] {
    const tags = ['harmonix'];
    
    if (contactData.source) {
      tags.push(`source-${contactData.source}`);
    }
    
    if (contactData.activity) {
      tags.push(`activity-${contactData.activity}`);
    }
    
    if (contactData.tier) {
      tags.push(`tier-${contactData.tier}`);
    }
    
    if (contactData.interests) {
      contactData.interests.forEach(interest => {
        tags.push(`interest-${interest}`);
      });
    }
    
    return tags;
  }

  async addToOpportunity(contactId: string, opportunityData: {
    name: string;
    value: number;
    stage: string;
    source?: string;
  }): Promise<{ success: boolean; message?: string }> {
    if (!this.apiKey) {
      console.log('GHL Opportunity (API key not configured):', { contactId, ...opportunityData });
      return { success: true, message: 'Opportunity logged' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/opportunities/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId,
          ...opportunityData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create opportunity: ${response.status}`);
      }

      return { success: true, message: 'Opportunity created' };
    } catch (error) {
      console.error('Error creating opportunity:', error);
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
export const ghlIntegration = new GHLIntegration();

// Main function for updating CRM
export async function updateCRM(contactData: CRMContact): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await ghlIntegration.createOrUpdateContact(contactData);
    
    // Log for debugging
    console.log('CRM Update Result:', {
      email: contactData.email,
      success: result.success,
      message: result.message
    });
    
    return result;
  } catch (error) {
    console.error('CRM update error:', error);
    return {
      success: false,
      message: `CRM sync failed: ${error.message}`
    };
  }
}