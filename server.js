/**
 * Harmonix Google Sheets Integration Server
 * Handles form submissions and writes data to Google Sheets using HD secrets
 */

const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Google Sheets Configuration using HD secrets
const HD_GOOGLE_SHEET_ID = process.env.HD_GOOGLE_SHEET_ID;
const HD_GOOGLE_SHEETS_CREDENTIALS = process.env.HD_GOOGLE_SHEETS_CREDENTIALS;

// Initialize Google Sheets API
let sheets;
let auth;

async function initializeGoogleSheets() {
  try {
    // Parse the credentials JSON
    if (!HD_GOOGLE_SHEETS_CREDENTIALS) {
      throw new Error('HD_GOOGLE_SHEETS_CREDENTIALS environment variable is required');
    }

    let credentials;
    try {
      credentials = JSON.parse(HD_GOOGLE_SHEETS_CREDENTIALS);
    } catch (parseError) {
      throw new Error('HD_GOOGLE_SHEETS_CREDENTIALS must be valid JSON');
    }

    // Create JWT auth client using parsed credentials
    auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Authorize the client
    await auth.authorize();
    
    // Create sheets API instance
    sheets = google.sheets({ version: 'v4', auth });
    
    console.log('✅ Google Sheets API initialized successfully');
    console.log(`📋 Using sheet ID: ${HD_GOOGLE_SHEET_ID}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets API:', error.message);
    return false;
  }
}

// Helper function to get column letter from index
function getColumnLetter(index) {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// Helper function to ensure headers exist in the sheet
async function ensureHeaders(sheetName, headers) {
  try {
    // Get current sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: HD_GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:ZZ1`,
    });

    const currentHeaders = response.data.values?.[0] || [];
    
    // Check if we need to add headers
    if (currentHeaders.length === 0) {
      // Add headers to empty sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: HD_GOOGLE_SHEET_ID,
        range: `${sheetName}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });
      console.log(`✅ Headers added to ${sheetName}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error ensuring headers for ${sheetName}:`, error.message);
    return false;
  }
}

// Main form submission endpoint
app.post('/submit', async (req, res) => {
  try {
    console.log('📝 Received form submission:', req.body);

    // Validate required environment variables
    if (!HD_GOOGLE_SHEET_ID || !HD_GOOGLE_SHEETS_CREDENTIALS) {
      return res.status(500).json({
        success: false,
        error: 'Google Sheets configuration missing. Please set HD_GOOGLE_SHEET_ID and HD_GOOGLE_SHEETS_CREDENTIALS environment variables.'
      });
    }

    // Initialize Google Sheets if not already done
    if (!sheets) {
      const initialized = await initializeGoogleSheets();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Failed to initialize Google Sheets API'
        });
      }
    }

    // Extract form data
    const formData = req.body;
    const timestamp = new Date().toISOString();
    
    // Define the sheet name (you can customize this)
    const sheetName = formData.sheetName || 'Form Submissions';
    
    // Prepare headers and values
    const headers = [
      'Timestamp',
      'Email',
      'Name',
      'Company',
      'Phone',
      'Message',
      'Source',
      ...Object.keys(formData).filter(key => 
        !['timestamp', 'email', 'name', 'company', 'phone', 'message', 'source', 'sheetName'].includes(key)
      )
    ];

    // Ensure headers exist in the sheet
    await ensureHeaders(sheetName, headers);

    // Prepare row data
    const rowData = [
      timestamp,
      formData.email || '',
      formData.name || '',
      formData.company || '',
      formData.phone || '',
      formData.message || '',
      formData.source || 'website'
    ];

    // Add additional fields
    headers.slice(7).forEach(header => {
      rowData.push(formData[header] || '');
    });

    // Append data to sheet
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: HD_GOOGLE_SHEET_ID,
      range: `${sheetName}!A:${getColumnLetter(headers.length - 1)}`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ Data successfully written to Google Sheets');
    console.log('📊 Updated range:', appendResponse.data.updates.updatedRange);

    // Send success response
    res.json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        timestamp,
        rowCount: appendResponse.data.updates.updatedRows,
        range: appendResponse.data.updates.updatedRange
      }
    });

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    
    // Send error response
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Google Sheets Form Handler',
    sheetsConnected: !!sheets
  });
});

// Test endpoint for Google Sheets connection
app.get('/test-sheets', async (req, res) => {
  try {
    if (!sheets) {
      const initialized = await initializeGoogleSheets();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Failed to initialize Google Sheets'
        });
      }
    }

    // Test by getting spreadsheet metadata
    const response = await sheets.spreadsheets.get({
      spreadsheetId: HD_GOOGLE_SHEET_ID,
    });

    res.json({
      success: true,
      message: 'Google Sheets connection successful',
      spreadsheet: {
        title: response.data.properties.title,
        sheetCount: response.data.sheets.length,
        sheets: response.data.sheets.map(sheet => sheet.properties.title)
      }
    });

  } catch (error) {
    console.error('❌ Google Sheets test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Static file serving (if needed)
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    // Initialize Google Sheets on startup
    if (HD_GOOGLE_SHEET_ID && HD_GOOGLE_SHEETS_CREDENTIALS) {
      await initializeGoogleSheets();
    } else {
      console.warn('⚠️ HD Google Sheets configuration missing. Server will start but sheets integration will be disabled.');
      console.warn('⚠️ Required: HD_GOOGLE_SHEET_ID and HD_GOOGLE_SHEETS_CREDENTIALS environment variables');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📋 Form submission endpoint: http://localhost:${PORT}/submit`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Sheets test: http://localhost:${PORT}/test-sheets`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;