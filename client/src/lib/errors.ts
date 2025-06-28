// Comprehensive error handling system for Harmonix Platform

export interface HarmonixError {
  message: string;
  code?: string;
  status?: number;
  field?: string;
  details?: Record<string, any>;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = 'AUTH_ERROR',
    public status: number = 401,
    public field?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string = 'Network connection failed. Please check your internet connection.',
    public code: string = 'NETWORK_ERROR'
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Error handling utilities
export const errorUtils = {
  // Extract user-friendly error message from various error types
  getUserMessage(error: any): string {
    if (error instanceof AuthError) {
      return error.message || 'Authentication failed. Please try again.';
    }
    
    if (error instanceof ValidationError) {
      return error.message || 'Please check your input and try again.';
    }
    
    if (error instanceof NetworkError) {
      return error.message || 'Connection error. Please check your internet.';
    }
    
    // Handle API error responses
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      // Handle common backend error patterns
      if (error.message.includes('User already exists')) {
        return 'An account with this email already exists. Please try logging in instead.';
      }
      
      if (error.message.includes('Invalid credentials')) {
        return 'Email or password is incorrect. Please try again.';
      }
      
      if (error.message.includes('Token expired')) {
        return 'Your session has expired. Please log in again.';
      }
      
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  },

  // Extract field-specific validation errors
  getFieldErrors(error: any): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    
    if (error instanceof ValidationError && error.field) {
      fieldErrors[error.field] = error.message;
    }
    
    // Handle zod validation errors
    if (error?.details?.fieldErrors) {
      Object.entries(error.details.fieldErrors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
    }
    
    // Handle backend validation errors
    if (error?.response?.data?.fieldErrors) {
      Object.assign(fieldErrors, error.response.data.fieldErrors);
    }
    
    return fieldErrors;
  },

  // Check if error requires authentication
  isAuthError(error: any): boolean {
    return (
      error instanceof AuthError ||
      error?.status === 401 ||
      error?.response?.status === 401 ||
      error?.message?.includes('Unauthorized') ||
      error?.message?.includes('Token expired')
    );
  },

  // Check if error is temporary/retryable
  isRetryableError(error: any): boolean {
    return (
      error instanceof NetworkError ||
      error?.status >= 500 ||
      error?.response?.status >= 500 ||
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('timeout')
    );
  }
};

// Form error handling hook
export const useFormErrorHandler = () => {
  const handleError = (error: any, setFieldError?: (field: string, message: string) => void) => {
    // Extract field-specific errors
    const fieldErrors = errorUtils.getFieldErrors(error);
    
    // Set field errors if setFieldError function is provided
    if (setFieldError) {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
    }
    
    // Return general error message
    return errorUtils.getUserMessage(error);
  };

  return { handleError };
};

// Toast error handler for consistent user feedback
export const createErrorToast = (error: any) => {
  const message = errorUtils.getUserMessage(error);
  const isAuth = errorUtils.isAuthError(error);
  
  return {
    title: isAuth ? 'Authentication Error' : 'Error',
    description: message,
    variant: 'destructive' as const,
    duration: isAuth ? 6000 : 4000, // Longer duration for auth errors
  };
};

// Authentication error handler with redirect
export const handleAuthError = (error: any) => {
  if (errorUtils.isAuthError(error)) {
    // Clear stored token
    localStorage.removeItem('harmonix_token');
    
    // Redirect to login after short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    
    return {
      title: 'Session Expired',
      description: 'Please log in again to continue.',
      variant: 'destructive' as const,
    };
  }
  
  return createErrorToast(error);
};