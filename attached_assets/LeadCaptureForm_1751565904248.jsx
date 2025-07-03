// LeadCaptureForm.jsx - Multi-CRM lead capture component

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
