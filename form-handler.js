/**
 * Harmonix Platform Form Handler
 * Handles form submissions, validation, and CRM integration
 */

class FormHandler {
  constructor() {
    this.apiBase = '/api';
    this.init();
  }

  init() {
    // Initialize form handlers on page load
    document.addEventListener('DOMContentLoaded', () => {
      this.bindFormHandlers();
    });
  }

  bindFormHandlers() {
    // Bind all form submissions
    const forms = document.querySelectorAll('form[data-handler]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    });

    // Bind specific form types
    this.bindWaitlistForms();
    this.bindContactForms();
    this.bindLeadCaptureForms();
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const handler = form.dataset.handler;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    this.setFormLoading(form, true);

    try {
      switch (handler) {
        case 'waitlist':
          await this.handleWaitlistSubmission(data, form);
          break;
        case 'contact':
          await this.handleContactSubmission(data, form);
          break;
        case 'lead-capture':
          await this.handleLeadCapture(data, form);
          break;
        case 'roi-request':
          await this.handleROIRequest(data, form);
          break;
        case 'google-sheets':
          await this.handleGoogleSheetsSubmission(data, form);
          break;
        default:
          throw new Error(`Unknown form handler: ${handler}`);
      }
    } catch (error) {
      this.showFormError(form, error.message);
    } finally {
      this.setFormLoading(form, false);
    }
  }

  bindWaitlistForms() {
    const waitlistButtons = document.querySelectorAll('[data-action="join-waitlist"]');
    waitlistButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.openWaitlistModal();
      });
    });
  }

  bindContactForms() {
    const contactButtons = document.querySelectorAll('[data-action="contact"]');
    contactButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.openContactModal();
      });
    });
  }

  bindLeadCaptureForms() {
    const leadButtons = document.querySelectorAll('[data-action="lead-capture"]');
    leadButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.openLeadCaptureModal();
      });
    });
  }

  async handleWaitlistSubmission(data, form) {
    // Validate required fields
    if (!data.email) {
      throw new Error('Email is required');
    }

    // Submit to API
    const response = await fetch(`${this.apiBase}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        company: data.company || '',
        phone: data.phone || '',
        source: data.source || 'website',
        interest: data.interest || 'general'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to join waitlist');
    }

    this.showFormSuccess(form, 'Successfully joined the waitlist! Check your email for next steps.');
    
    // Track conversion
    this.trackEvent('waitlist_joined', {
      email: data.email,
      source: data.source || 'website'
    });
  }

  async handleContactSubmission(data, form) {
    // Validate required fields
    if (!data.email || !data.message) {
      throw new Error('Email and message are required');
    }

    // Submit to API
    const response = await fetch(`${this.apiBase}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name || '',
        company: data.company || '',
        phone: data.phone || '',
        message: data.message,
        subject: data.subject || 'General Inquiry',
        source: 'contact_form'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    this.showFormSuccess(form, 'Message sent successfully! We\'ll get back to you within 24 hours.');
    
    // Track conversion
    this.trackEvent('contact_submitted', {
      email: data.email,
      subject: data.subject || 'General Inquiry'
    });
  }

  async handleLeadCapture(data, form) {
    // Validate required fields
    if (!data.email) {
      throw new Error('Email is required');
    }

    // Submit to CRM
    const response = await fetch(`${this.apiBase}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        company: data.company || '',
        phone: data.phone || '',
        leadSource: data.leadSource || 'website',
        interest: data.interest || 'ai_agents',
        budget: data.budget || '',
        timeline: data.timeline || ''
      })
    });

    if (!response.ok) {
      throw new Error('Failed to capture lead');
    }

    this.showFormSuccess(form, 'Thanks for your interest! Our team will contact you soon.');
    
    // Track conversion
    this.trackEvent('lead_captured', {
      email: data.email,
      interest: data.interest || 'ai_agents'
    });
  }

  async handleROIRequest(data, form) {
    // Validate required fields
    if (!data.email || !data.company) {
      throw new Error('Email and company are required');
    }

    // Submit ROI request
    const response = await fetch(`${this.apiBase}/roi-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        company: data.company,
        name: data.name || '',
        phone: data.phone || '',
        currentProcesses: data.currentProcesses || '',
        teamSize: data.teamSize || '',
        industry: data.industry || '',
        goals: data.goals || ''
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit ROI request');
    }

    this.showFormSuccess(form, 'ROI analysis request submitted! We\'ll prepare a custom report for you.');
    
    // Track conversion
    this.trackEvent('roi_requested', {
      email: data.email,
      company: data.company
    });
  }

  async handleGoogleSheetsSubmission(data, form) {
    // Validate required fields (customize based on your form)
    if (!data.email) {
      throw new Error('Email is required');
    }

    // Prepare data for Google Sheets
    const submissionData = {
      timestamp: new Date().toISOString(),
      email: data.email,
      name: data.name || '',
      company: data.company || '',
      phone: data.phone || '',
      message: data.message || '',
      source: data.source || 'website',
      ...data // Include any additional form fields
    };

    // Submit to Google Sheets endpoint
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit form: ${errorText}`);
    }

    const result = await response.json();
    
    this.showFormSuccess(form, 'Form submitted successfully! Your information has been saved.');
    
    // Track conversion
    this.trackEvent('google_sheets_submitted', {
      email: data.email,
      formType: 'google_sheets'
    });

    return result;
  }

  setFormLoading(form, loading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const spinner = form.querySelector('.loading-spinner');
    
    if (loading) {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
      }
      if (spinner) {
        spinner.style.display = 'inline-block';
      }
    } else {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
      if (spinner) {
        spinner.style.display = 'none';
      }
    }
  }

  showFormSuccess(form, message) {
    this.clearFormMessages(form);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success harmonix-success-message';
    successDiv.innerHTML = `
      <div class="flex items-center p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        ${message}
      </div>
    `;
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, 5000);
  }

  showFormError(form, message) {
    this.clearFormMessages(form);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error harmonix-error-message';
    errorDiv.innerHTML = `
      <div class="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        ${message}
      </div>
    `;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  clearFormMessages(form) {
    const existingMessages = form.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
  }

  openWaitlistModal() {
    // Implementation for opening waitlist modal
    console.log('Opening waitlist modal...');
  }

  openContactModal() {
    // Implementation for opening contact modal
    console.log('Opening contact modal...');
  }

  openLeadCaptureModal() {
    // Implementation for opening lead capture modal
    console.log('Opening lead capture modal...');
  }

  trackEvent(eventName, properties = {}) {
    // Track events for analytics
    try {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
      }
      
      // Custom tracking implementation
      console.log('Event tracked:', eventName, properties);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
}

// Initialize form handler
const harmonixFormHandler = new FormHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}