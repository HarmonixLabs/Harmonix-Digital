# GHL Webhook Troubleshooting Guide

## Current Status
- Webhook endpoint is configured and responding with 200 status
- Test payloads are being sent successfully 
- However, workflow triggers are not appearing in GHL dashboard

## Issue Analysis

### What's Working
✅ Webhook URL is accessible and responding
✅ JSON payload is being accepted 
✅ Server is sending proper Content-Type headers
✅ Platform registration flow is functioning

### What's Not Working
❌ GHL workflow triggers not showing in execution logs
❌ Mapping reference payload dropdown is empty
❌ Workflow automation not activating

## Potential Solutions

### 1. Webhook Setup in GHL
The webhook trigger in GHL requires:
- Proper inbound webhook configuration
- Correct payload structure 
- Initial test request to populate mapping reference

### 2. Payload Format
Current payload structure:
```json
{
  "contact": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "555-0123", 
    "companyName": "Company Name",
    "source": "Harmonix Platform"
  },
  "eventType": "contact_created",
  "platform": "Harmonix",
  "timestamp": "2025-06-23T17:30:00.000Z"
}
```

### 3. GHL Dashboard Steps
To activate the workflow:
1. Send test payload (done)
2. Go to GHL workflow builder
3. Click "Check for new requests" in mapping reference
4. Select the received payload
5. Map the fields as needed
6. Save and activate the workflow

### 4. Verification Steps
After mapping in GHL:
- Send another test registration
- Check GHL execution logs
- Verify workflow triggers are firing
- Confirm contact data is being processed

## Test Commands

### Register New User (Triggers Workflow)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@harmonix.com", 
    "password": "Test123!",
    "phone": "555-TEST",
    "company": "Test Company"
  }'
```

### Direct Webhook Test
```bash
curl "${HARMONIX_GHL_WEBHOOK}" \
  -H "Content-Type: application/json" \
  -d '{
    "contact": {
      "email": "direct@harmonix.com",
      "firstName": "Direct",
      "lastName": "Test"
    },
    "eventType": "contact_created"
  }'
```

## Next Steps
1. Check GHL workflow builder for new requests
2. Complete the mapping setup in GHL dashboard  
3. Activate the workflow
4. Test with new registration to verify triggers

The platform is sending the data correctly - the remaining step is configuring the mapping in your GHL dashboard.