/**
 * Multi-CRM Lead Capture Service
 * Handles lead submission to GoHighLevel, HubSpot, and Google Sheets with retry logic
 */

import axios from 'axios';

class MultiCRMLeadService {
  constructor() {
    this.retryQueue = new Map();
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    this.startRetryProcessor();
  }

  // Main lead submission method
  async submitLead(leadData) {
    const enrichedData = this.enrichLeadData(leadData);
    
    try {
      const response = await axios.post('/api/leads', enrichedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      return {
        success: true,
        data: response.data,
        message: 'Lead submitted successfully'
      };
    } catch (error) {
      console.error('Lead submission error:', error);
      
      // Add to retry queue if network/server error
      if (this.shouldRetry(error)) {
        this.addToRetryQueue(enrichedData);
      }
      
      return {
        success: false,
        error: error.message,
        message: 'Lead submission failed, will retry automatically'
      };
    }
  }

  // Enrich lead data with metadata
  enrichLeadData(leadData) {
    return {
      ...leadData,
      timestamp: new Date().toISOString(),
      source: leadData.source || 'Harmonix Website',
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
      utmSource: this.getUrlParam('utm_source'),
      utmMedium: this.getUrlParam('utm_medium'),
      utmCampaign: this.getUrlParam('utm_campaign'),
      utmTerm: this.getUrlParam('utm_term'),
      utmContent: this.getUrlParam('utm_content'),
    };
  }

  // Get URL parameters
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  }

  // Determine if error should trigger retry
  shouldRetry(error) {
    // Retry on network errors, server errors (5xx), or timeout
    return !error.response || 
           error.response.status >= 500 || 
           error.code === 'ECONNABORTED' ||
           error.code === 'NETWORK_ERROR';
  }

  // Add lead to retry queue
  addToRetryQueue(leadData) {
    const id = Date.now() + Math.random();
    this.retryQueue.set(id, {
      data: leadData,
      attempts: 0,
      nextRetry: Date.now() + this.retryDelay,
    });
  }

  // Process retry queue
  startRetryProcessor() {
    setInterval(() => {
      this.processRetryQueue();
    }, 1000); // Check every second
  }

  async processRetryQueue() {
    const now = Date.now();
    
    for (const [id, item] of this.retryQueue.entries()) {
      if (now >= item.nextRetry && item.attempts < this.maxRetries) {
        console.log(`Retrying lead submission: ${item.data.email}, attempt ${item.attempts + 1}`);
        
        try {
          await axios.post('/api/leads', item.data);
          console.log('Retry successful, removing from queue');
          this.retryQueue.delete(id);
        } catch (error) {
          item.attempts++;
          
          if (item.attempts >= this.maxRetries) {
            console.error(`Max retries reached for lead: ${item.data.email}`);
            this.retryQueue.delete(id);
            // Could trigger notification to admin here
          } else {
            // Exponential backoff
            item.nextRetry = now + (this.retryDelay * Math.pow(2, item.attempts));
          }
        }
      }
    }
  }

  // Get retry queue status
  getRetryStatus() {
    return {
      queueLength: this.retryQueue.size,
      items: Array.from(this.retryQueue.values()).map(item => ({
        email: item.data.email,
        attempts: item.attempts,
        nextRetry: new Date(item.nextRetry).toISOString(),
      })),
    };
  }

  // Manual retry trigger
  async retryAll() {
    const now = Date.now();
    for (const [id, item] of this.retryQueue.entries()) {
      item.nextRetry = now;
    }
  }

  // Validate lead data
  validateLeadData(leadData) {
    const errors = [];
    
    if (!leadData.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(leadData.email)) {
      errors.push('Email format is invalid');
    }
    
    if (!leadData.firstName && !leadData.name) {
      errors.push('First name or name is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Form submission helper
  async handleFormSubmission(formData, form, options = {}) {
    const validation = this.validateLeadData(formData);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: 'Please fix the following errors: ' + validation.errors.join(', ')
      };
    }

    try {
      const result = await this.submitLead(formData);
      
      if (result.success && options.resetForm) {
        form?.reset();
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}

// Singleton instance
const leadService = new MultiCRMLeadService();

export default leadService;

// Helper hook for React components
export const useLeadSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const submitLead = async (leadData, options = {}) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await leadService.handleFormSubmission(leadData, null, options);
      setSubmitStatus(result);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearStatus = () => setSubmitStatus(null);

  return {
    submitLead,
    isSubmitting,
    submitStatus,
    clearStatus,
    retryStatus: leadService.getRetryStatus(),
  };
};