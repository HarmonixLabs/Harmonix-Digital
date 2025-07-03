# Google Sheets Integration Setup Guide

## Overview
Your Harmonix platform now includes comprehensive Google Sheets form handling integration. This allows form submissions to be automatically saved to Google Sheets while also syncing with your existing CRM system.

## What's Been Implemented

### 1. Enhanced Form Handler (form-handler.js)
- Added `google-sheets` form handler type
- Automatic form data collection and JSON formatting
- Integration with existing CRM system
- Comprehensive error handling and user feedback

### 2. Server Integration (server/routes.ts)
- `/submit` endpoint for Google Sheets integration
- `/test-sheets` endpoint for connection testing
- Automatic header creation in sheets
- Dual integration (Google Sheets + CRM sync)

### 3. Standalone Server (server.js)
- Complete Express server with Google Sheets API integration
- Health check endpoints
- Comprehensive error handling
- Production-ready configuration

### 4. Example Implementation (google-sheets-form-example.html)
- Working HTML form example
- Harmonix-branded styling
- Real-time form validation
- Success/error feedback

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 2. Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - Name: `harmonix-sheets-integration`
   - Description: `Service account for Harmonix form submissions`
4. Click "Create and Continue"
5. Skip roles for now (click "Continue")
6. Click "Done"

### 3. Generate Service Account Key

1. Find your service account in the credentials list
2. Click on the service account email
3. Go to "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format
6. Download the key file

### 4. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Harmonix Form Submissions" (or your preference)
4. Note the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 5. Share Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add your service account email as an editor:
   - Email format: `your-service-account@project-id.iam.gserviceaccount.com`
   - Permission: "Editor"
4. Click "Send"

### 6. Environment Variables

Add these environment variables to your project:

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----"
```

**Important:** The private key should include the full key with `\n` characters for line breaks.

## How to Use

### Method 1: Using Your Enhanced Form Handler

Add `data-handler="google-sheets"` to any form:

```html
<form data-handler="google-sheets">
    <input type="email" name="email" required>
    <input type="text" name="name" required>
    <input type="text" name="company">
    <textarea name="message"></textarea>
    <input type="hidden" name="sheetName" value="Lead Submissions">
    <button type="submit">Submit</button>
</form>
```

### Method 2: Direct API Call

```javascript
const formData = {
    email: 'user@example.com',
    name: 'John Doe',
    company: 'Example Corp',
    message: 'Interested in AI agents',
    source: 'website',
    sheetName: 'Lead Submissions' // Optional, defaults to 'Form Submissions'
};

fetch('/submit', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('Form submitted successfully:', data);
    } else {
        console.error('Error:', data.error);
    }
});
```

## Testing

### 1. Test Google Sheets Connection
Visit: `http://localhost:5000/test-sheets`

This will verify:
- Service account authentication
- Spreadsheet access
- API connectivity

### 2. Test Form Submission
Open: `google-sheets-form-example.html`

Fill out and submit the form to test the complete workflow.

## Features

### Automatic Features
- **Timestamp Addition**: Every submission gets a timestamp
- **Header Management**: Headers are automatically created if missing
- **Data Validation**: Required field validation
- **CRM Sync**: Submissions also sync to your existing CRM
- **Error Handling**: Comprehensive error messages and logging

### Customizable Options
- **Sheet Names**: Use different sheets for different forms
- **Custom Fields**: Any form field is automatically included
- **Source Tracking**: Track where submissions come from
- **Validation Rules**: Customize required fields per form

## Troubleshooting

### Common Issues

1. **"Google Sheets configuration missing"**
   - Check environment variables are set correctly
   - Verify private key format includes proper line breaks

2. **"Failed to initialize Google Sheets API"**
   - Verify service account email is correct
   - Check that Google Sheets API is enabled in your project

3. **"Permission denied"**
   - Ensure service account has editor access to the spreadsheet
   - Verify spreadsheet ID is correct

4. **"Sheet not found"**
   - The specified sheet name doesn't exist
   - Check spelling of sheetName parameter

### Debug Steps

1. Check server logs for detailed error messages
2. Test connection using `/test-sheets` endpoint
3. Verify environment variables in production
4. Confirm service account permissions

## Integration with Existing Forms

Your existing Harmonix forms can be easily converted:

1. Add `data-handler="google-sheets"` to the form element
2. Ensure form fields have proper `name` attributes
3. Add optional `sheetName` hidden field for organization
4. The form handler will automatically process submissions

## Security Notes

- Service account keys should be kept secure
- Private keys should never be committed to version control
- Use environment variables for all sensitive configuration
- Consider rotating service account keys periodically

Your Google Sheets integration is now ready to capture and organize all form submissions while maintaining your existing CRM workflow!