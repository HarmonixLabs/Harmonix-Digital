# HD Google Sheets Integration

## Overview

Your server.js file has been configured to work with your HD Google Sheets credentials. This integration allows form submissions to be automatically saved to Google Sheets using the `HD_GOOGLE_SHEETS_CREDENTIALS` and `HD_GOOGLE_SHEET_ID` environment variables.

## Files Created

1. **server.js** - Express server with Google Sheets integration
2. **test-hd-sheets.html** - Test form to verify the integration
3. **HD_SHEETS_README.md** - This documentation file

## Environment Variables Required

```bash
HD_GOOGLE_SHEET_ID=your_sheet_id_here
HD_GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"..."}
```

### HD_GOOGLE_SHEETS_CREDENTIALS Format

This should be the complete JSON service account key as a string:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service@project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account-email"
}
```

## Server Features

### Main Endpoint: POST /submit

Accepts form data and saves it to Google Sheets.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "phone": "555-1234",
  "message": "Test message",
  "source": "website",
  "sheetName": "Form Submissions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "data": {
    "timestamp": "2025-07-03T09:39:42.123Z",
    "rowCount": 1,
    "range": "Form Submissions!A2:H2"
  }
}
```

### Test Endpoint: GET /test-sheets

Tests the Google Sheets connection and returns spreadsheet information.

**Response:**
```json
{
  "success": true,
  "message": "Google Sheets connection successful",
  "spreadsheet": {
    "title": "Your Spreadsheet Name",
    "sheetCount": 3,
    "sheets": ["Sheet1", "Form Submissions", "Other Sheet"]
  }
}
```

### Health Check: GET /health

Basic server health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-03T09:39:42.123Z",
  "service": "Google Sheets Form Handler",
  "sheetsConnected": true
}
```

## Running the Server

### Option 1: Standalone Server
```bash
# Set environment variables
export HD_GOOGLE_SHEET_ID="your_sheet_id"
export HD_GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account",...}'

# Run the server
node server.js
```

### Option 2: Integration with Existing Server
The server.js can be imported and used as middleware in your existing Express application.

## Automatic Features

1. **Header Management**: Automatically creates headers if the sheet is empty
2. **Timestamp Addition**: Every submission gets a timestamp
3. **Dynamic Fields**: Any form field is automatically included in the sheet
4. **Error Handling**: Comprehensive error messages and logging
5. **Sheet Selection**: Use `sheetName` field to specify which sheet to write to

## Sheet Structure

The server automatically creates this structure:

| Timestamp | Email | Name | Company | Phone | Message | Source | Custom Field 1 | Custom Field 2 |
|-----------|-------|------|---------|-------|---------|--------|----------------|----------------|
| 2025-07-03T09:39:42.123Z | john@example.com | John Doe | Example Corp | 555-1234 | Test message | website | value1 | value2 |

## Testing

1. **Open test-hd-sheets.html in your browser**
2. **Click "Test Google Sheets Connection"** to verify setup
3. **Fill out and submit the form** to test data submission

## Integration with Your Forms

### Method 1: Direct API Call
```javascript
const formData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    message: 'Test message',
    sheetName: 'Lead Submissions'
};

fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => console.log('Success:', data));
```

### Method 2: HTML Form
```html
<form id="my-form">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <input type="text" name="company">
    <textarea name="message"></textarea>
    <input type="hidden" name="sheetName" value="Contact Forms">
    <button type="submit">Submit</button>
</form>

<script>
document.getElementById('my-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const response = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
        alert('Form submitted successfully!');
    }
});
</script>
```

## Troubleshooting

### Common Errors

1. **"HD_GOOGLE_SHEETS_CREDENTIALS environment variable is required"**
   - Ensure the credentials are set as a complete JSON string

2. **"HD_GOOGLE_SHEETS_CREDENTIALS must be valid JSON"**
   - Check that the JSON is properly formatted and escaped

3. **"Failed to initialize Google Sheets API"**
   - Verify the service account has access to the spreadsheet
   - Check that the Google Sheets API is enabled in your project

4. **Permission denied errors**
   - Make sure the service account email has editor access to your Google Sheet

### Debug Steps

1. Check server logs for detailed error messages
2. Test connection using `/test-sheets` endpoint
3. Verify environment variables are correctly set
4. Confirm Google Sheet permissions

## Security Notes

- Keep your HD_GOOGLE_SHEETS_CREDENTIALS secure
- Never commit credentials to version control
- Use environment variables for all sensitive data
- Consider rotating service account keys periodically

Your HD Google Sheets integration is now ready to capture form submissions automatically!