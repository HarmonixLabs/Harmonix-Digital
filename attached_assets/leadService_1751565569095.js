const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;

// In-memory queues for retry logic (use Redis or similar for production)
const ghlRetryQueue = [];
const hubspotRetryQueue = [];
const sheetsRetryQueue = [];

// Google Sheets Authentication
async function getGoogleSheetsAuth() {
  // Implementation depends on your authentication method (service account or OAuth)
  // This is a simplified example using service account
  const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

// Send lead to GoHighLevel
async function sendToGHL(leadData) {
  try {
    const response = await axios.post(GHL_WEBHOOK_URL, leadData);
    console.log('Lead successfully sent to GoHighLevel:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending lead to GoHighLevel:', error.message);
    ghlRetryQueue.push({ leadData, attempts: 0, lastAttempt: Date.now() });
    return false;
  }
}

// Send lead to HubSpot
async function sendToHubSpot(leadData) {
  try {
    // Map leadData to HubSpot contact properties format
    const contactProperties = {
      properties: {
        email: leadData.email,
        firstname: leadData.firstName || '',
        lastname: leadData.lastName || '',
        company: leadData.business || '',
        phone: leadData.phone || '',
        source: leadData.source || 'Harmonix Website',
      },
    };

    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      contactProperties,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );
    console.log('Lead successfully sent to HubSpot:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending lead to HubSpot:', error.message);
    hubspotRetryQueue.push({ leadData, attempts: 0, lastAttempt: Date.now() });
    return false;
  }
}

// Send lead to Google Sheets
async function sendToGoogleSheets(leadData) {
  try {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Format data for sheets
    const values = [
      [
        new Date().toISOString(),
        leadData.email,
        leadData.firstName || '',
        leadData.lastName || '',
        leadData.business || '',
        leadData.phone || '',
        leadData.source || 'Harmonix Website',
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_ID,
      range: 'Leads!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    console.log('Lead successfully sent to Google Sheets:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending lead to Google Sheets:', error.message);
    sheetsRetryQueue.push({ leadData, attempts: 0, lastAttempt: Date.now() });
    return false;
  }
}

// Main lead capture endpoint
app.post('/api/leads', async (req, res) => {
  const leadData = req.body;

  // Basic validation
  if (!leadData.email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Add timestamp
  leadData.timestamp = new Date().toISOString();

  // Track success of each destination
  const results = {
    ghl: false,
    hubspot: false,
    sheets: false,
  };

  // Send to all destinations concurrently
  try {
    const [ghlResult, hubspotResult, sheetsResult] = await Promise.allSettled([
      sendToGHL(leadData),
      sendToHubSpot(leadData),
      sendToGoogleSheets(leadData),
    ]);

    results.ghl = ghlResult.status === 'fulfilled' && ghlResult.value;
    results.hubspot = hubspotResult.status === 'fulfilled' && hubspotResult.value;
    results.sheets = sheetsResult.status === 'fulfilled' && sheetsResult.value;

    // If at least one destination succeeded, consider it a success
    if (results.ghl || results.hubspot || results.sheets) {
      res.status(200).json({
        message: 'Lead captured successfully',
        results,
      });
    } else {
      // All destinations failed, but we've queued for retry
      res.status(202).json({
        message: 'Lead accepted for processing, will retry delivery',
        results,
      });
    }
  } catch (error) {
    console.error('Unexpected error in lead capture:', error);
    res.status(500).json({ error: 'Server error processing lead' });
  }
});

// Retry mechanism for GoHighLevel
setInterval(() => {
  if (ghlRetryQueue.length > 0) {
    const item = ghlRetryQueue.shift();
    
    // Exponential backoff (5s, 25s, 125s, etc.)
    const backoff = Math.pow(5, item.attempts + 1) * 1000;
    const timeSinceLastAttempt = Date.now() - item.lastAttempt;
    
    if (timeSinceLastAttempt >= backoff) {
      console.log(`Retrying GoHighLevel lead: ${item.leadData.email}, attempt ${item.attempts + 1}`);
      
      sendToGHL(item.leadData).catch(() => {
        // If still failing and under max attempts, requeue
        if (item.attempts < 5) {
          ghlRetryQueue.push({
            leadData: item.leadData,
            attempts: item.attempts + 1,
            lastAttempt: Date.now(),
          });
        } else {
          console.error(`Max retries reached for GoHighLevel lead: ${item.leadData.email}`);
          // Could implement notification system here
        }
      });
    } else {
      // Not ready for retry yet, put back in queue
      ghlRetryQueue.push(item);
    }
  }
}, 10000); // Check every 10 seconds

// Similar retry mechanisms for HubSpot and Google Sheets
// Implement similar retry logic for hubspotRetryQueue and sheetsRetryQueue

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    queues: {
      ghl: ghlRetryQueue.length,
      hubspot: hubspotRetryQueue.length,
      sheets: sheetsRetryQueue.length,
    },
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Lead capture service running on port ${PORT}`);
});

module.exports = app;
