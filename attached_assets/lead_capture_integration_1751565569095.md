# Lead Capture Integration Implementation Guide

## Overview

This document provides comprehensive implementation instructions for integrating the Harmonix platform's lead capture forms with multiple CRM systems (GoHighLevel primary, HubSpot secondary) and Google Sheets as a backup mechanism. This redundant approach ensures no lead data is ever lost, even during API outages or service disruptions.

## Architecture

The lead capture system follows a multi-endpoint delivery architecture:

1. **Primary Path**: Form submission → Backend API → GoHighLevel webhook
2. **Secondary Path**: Form submission → Backend API → HubSpot API
3. **Backup Path**: Form submission → Backend API → Google Sheets API

All paths operate concurrently with independent error handling and retry logic.

## Implementation

### 1. Backend Lead Capture Service (Node.js/Express)

```javascript
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

// Similar retry mechanisms for HubSpot and Google Sheets (omitted for brevity)

app.listen(3001, () => {
  console.log('Lead capture service running on port 3001');
});
```

### 2. Frontend Lead Capture Component (React)

```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// Form validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  business: yup.string().required('Business name is required'),
  phone: yup.string(),
}).required();

const LeadCaptureForm = ({ formType = 'waitlist', source = 'website', onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Add metadata
      const enrichedData = {
        ...data,
        source,
        formType,
        submittedAt: new Date().toISOString(),
        utmSource: getUrlParam('utm_source'),
        utmMedium: getUrlParam('utm_medium'),
        utmCampaign: getUrlParam('utm_campaign'),
      };
      
      // Send to backend
      const response = await axios.post('/api/leads', enrichedData);
      
      // Handle success
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your information has been submitted successfully.'
      });
      
      // Reset form
      reset();
      
      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(enrichedData);
      }
    } catch (error) {
      // Handle error
      console.error('Form submission error:', error);
      
      setSubmitStatus({
        type: 'error',
        message: 'There was an error submitting your information. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper to get URL parameters
  const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  };

  return (
    <div className="lead-capture-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name*</label>
            <input
              id="firstName"
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name*</label>
            <input
              id="lastName"
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              {...register('lastName')}
            />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address*</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email')}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="business">Business Name*</label>
          <input
            id="business"
            type="text"
            className={`form-control ${errors.business ? 'is-invalid' : ''}`}
            {...register('business')}
          />
          {errors.business && <div className="invalid-feedback">{errors.business.message}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            {...register('phone')}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : formType === 'waitlist' ? 'Join Waitlist' : 'Submit'}
        </button>
        
        {submitStatus && (
          <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default LeadCaptureForm;
```

### 3. Google Sheets Setup

1. Create a new Google Sheet with the following columns:
   - Timestamp
   - Email
   - First Name
   - Last Name
   - Business
   - Phone
   - Source

2. Set up a Google Cloud Project:
   - Go to Google Cloud Console
   - Create a new project
   - Enable Google Sheets API
   - Create a service account
   - Download the service account key (JSON)
   - Share your Google Sheet with the service account email

3. Store the service account key securely and reference it in your backend code.

### 4. GoHighLevel Webhook Configuration

1. In GoHighLevel:
   - Navigate to Settings > Integrations > Webhooks
   - Create a new webhook
   - Set the webhook URL to your API endpoint
   - Select "Contact Created" as the trigger event
   - Save the webhook

2. Test the webhook by submitting a test lead through your form.

3. Configure field mapping to ensure all form fields are properly mapped to GoHighLevel contact fields.

### 5. HubSpot API Configuration

1. In HubSpot:
   - Navigate to Settings > Integrations > API Key
   - Generate a new API key
   - Store this key securely in your environment variables

2. Create custom properties in HubSpot if needed to store additional form fields.

3. Set up workflows in HubSpot to process leads based on source or other criteria.

## Error Handling & Monitoring

### Logging

Implement comprehensive logging for all lead capture attempts:

```javascript
// Add to your backend service
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'lead-capture' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Use in your lead capture functions
function logLeadActivity(action, leadData, success, error = null) {
  const logData = {
    action,
    email: leadData.email,
    source: leadData.source,
    success,
    timestamp: new Date().toISOString(),
  };
  
  if (error) {
    logData.error = error.message;
    logger.error(logData);
  } else {
    logger.info(logData);
  }
}

// Example usage
try {
  await sendToGHL(leadData);
  logLeadActivity('ghl_submission', leadData, true);
} catch (error) {
  logLeadActivity('ghl_submission', leadData, false, error);
  // Retry logic
}
```

### Alerting

Set up alerts for critical failures:

```javascript
const nodemailer = require('nodemailer');

// Configure email transport
const transporter = nodemailer.createTransport({
  // Your email configuration
});

// Alert on critical failures
function sendAlertEmail(subject, message) {
  const mailOptions = {
    from: 'alerts@harmonixdigital.com',
    to: 'admin@harmonixdigital.com',
    subject,
    text: message,
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending alert email:', error);
    } else {
      console.log('Alert email sent:', info.response);
    }
  });
}

// Example usage
if (ghlRetryQueue.length > 10) {
  sendAlertEmail(
    'GoHighLevel Integration Alert', 
    `There are ${ghlRetryQueue.length} leads waiting to be sent to GoHighLevel. Please check the system.`
  );
}
```

## Testing

### Unit Tests

Create unit tests for each integration point:

```javascript
// Example Jest test for GoHighLevel integration
describe('GoHighLevel Integration', () => {
  beforeEach(() => {
    // Mock axios
    jest.mock('axios');
  });
  
  test('Successfully sends lead to GoHighLevel', async () => {
    // Setup
    const mockLead = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };
    
    axios.post.mockResolvedValue({ data: { success: true } });
    
    // Execute
    const result = await sendToGHL(mockLead);
    
    // Assert
    expect(result).toBe(true);
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      mockLead
    );
  });
  
  test('Handles GoHighLevel API errors', async () => {
    // Setup
    const mockLead = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };
    
    axios.post.mockRejectedValue(new Error('API Error'));
    
    // Execute
    const result = await sendToGHL(mockLead);
    
    // Assert
    expect(result).toBe(false);
    expect(ghlRetryQueue.length).toBe(1);
    expect(ghlRetryQueue[0].leadData).toEqual(mockLead);
  });
});
```

### End-to-End Tests

Create E2E tests to verify the complete flow:

```javascript
// Example Cypress test
describe('Lead Capture Form', () => {
  beforeEach(() => {
    cy.visit('/join-waitlist');
    
    // Intercept API calls
    cy.intercept('POST', '/api/leads', { statusCode: 200, body: { success: true } }).as('submitForm');
  });
  
  it('Successfully submits the waitlist form', () => {
    // Fill out form
    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#email').type('test@example.com');
    cy.get('#business').type('Test Company');
    cy.get('#phone').type('555-123-4567');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for API call
    cy.wait('@submitForm').then((interception) => {
      // Verify request payload
      expect(interception.request.body).to.have.property('email', 'test@example.com');
      expect(interception.request.body).to.have.property('firstName', 'Test');
      expect(interception.request.body).to.have.property('formType', 'waitlist');
    });
    
    // Verify success message
    cy.get('.alert-success').should('be.visible');
  });
  
  it('Shows validation errors for required fields', () => {
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Verify validation errors
    cy.get('.invalid-feedback').should('have.length.at.least', 3);
    cy.get('#email').parent().find('.invalid-feedback').should('be.visible');
  });
});
```

## Deployment Considerations

1. **Environment Variables**: Store all sensitive information in environment variables:
   - `GHL_WEBHOOK_URL`
   - `HUBSPOT_API_KEY`
   - `GOOGLE_SHEETS_ID`

2. **Rate Limiting**: Implement rate limiting to prevent API abuse:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP, please try again later',
   });
   
   app.use('/api/leads', apiLimiter);
   ```

3. **CORS Configuration**: Configure CORS to only allow requests from your domains:
   ```javascript
   const corsOptions = {
     origin: ['https://harmonixdigital.com', 'https://app.harmonixdigital.com'],
     optionsSuccessStatus: 200,
   };
   
   app.use(cors(corsOptions));
   ```

4. **Health Checks**: Implement health check endpoints to monitor service status:
   ```javascript
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
   ```

## Conclusion

This implementation provides a robust, redundant lead capture system that ensures no lead data is lost, even during service disruptions. By sending leads concurrently to GoHighLevel (primary), HubSpot (secondary), and Google Sheets (backup), you create multiple layers of data protection.

The system includes comprehensive error handling, retry logic, and monitoring to ensure reliable operation and quick notification of any issues. The frontend component provides a user-friendly experience with proper validation and feedback.

For optimal performance in production, consider replacing the in-memory queues with a persistent queue system like Redis, and implement a more sophisticated logging and monitoring solution.
