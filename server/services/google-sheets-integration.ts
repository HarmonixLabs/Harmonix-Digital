import { google } from 'googleapis';

interface SheetData {
  timestamp: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  accessType?: string;
  businessType?: string;
  teamSize?: string;
  revenue?: string;
  interests?: string;
  source?: string;
  tags?: string[];
}

class GoogleSheetsIntegration {
  private sheets: any;
  private spreadsheetId: string;
  private auth: any;

  constructor() {
    // Initialize with environment variables
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '1234567890abcdef'; // Replace with actual sheet ID
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Use service account credentials from environment
      const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS ? 
        JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS) : null;

      if (credentials) {
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
        console.log('Google Sheets integration initialized');
      } else {
        console.log('Google Sheets credentials not configured - using fallback');
      }
    } catch (error) {
      console.error('Google Sheets auth error:', error);
    }
  }

  async appendLead(data: SheetData): Promise<boolean> {
    try {
      if (!this.sheets) {
        console.log('Google Sheets not configured, skipping...');
        return false;
      }

      const values = [[
        data.timestamp,
        data.name,
        data.email,
        data.phone || '',
        data.company || '',
        data.accessType || 'waitlist',
        data.businessType || '',
        data.teamSize || '',
        data.revenue || '',
        data.interests || '',
        data.source || 'harmonix_platform',
        data.tags?.join(', ') || ''
      ]];

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A:L', // Adjust range as needed
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values,
        },
      });

      console.log('Lead added to Google Sheets:', data.email);
      return true;
    } catch (error) {
      console.error('Google Sheets append error:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.sheets) {
        return false;
      }

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      console.log('Google Sheets connection successful:', response.data.properties.title);
      return true;
    } catch (error) {
      console.error('Google Sheets connection test failed:', error);
      return false;
    }
  }
}

export const googleSheetsIntegration = new GoogleSheetsIntegration();

export async function sendToGoogleSheets(leadData: any): Promise<boolean> {
  const sheetData: SheetData = {
    timestamp: new Date().toISOString(),
    name: `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim() || leadData.name || 'Unknown',
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company || leadData.companyName,
    accessType: leadData.accessType,
    businessType: leadData.businessType,
    teamSize: leadData.teamSize,
    revenue: leadData.revenue,
    interests: leadData.interests,
    source: leadData.source,
    tags: leadData.tags
  };

  return await googleSheetsIntegration.appendLead(sheetData);
}