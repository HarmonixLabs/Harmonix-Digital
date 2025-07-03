import { z } from "zod";
import { useState, useEffect } from "react";

// Common validation schemas
export const emailSchema = z.string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const phoneSchema = z.string()
  .regex(/^\+?1?\d{10,14}$/, "Please enter a valid phone number")
  .optional();

export const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

export const companySchema = z.string()
  .min(2, "Company name must be at least 2 characters")
  .max(100, "Company name must be less than 100 characters")
  .optional();

export const messageSchema = z.string()
  .min(10, "Message must be at least 10 characters")
  .max(500, "Message must be less than 500 characters")
  .optional();

// Form validation states
export interface ValidationState {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

// Validation hook
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  values: T
) {
  const [validationState, setValidationState] = useState<ValidationState>({
    errors: {},
    touched: {},
    isValid: false
  });

  // Validate single field
  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = schema.shape[name as keyof typeof schema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setValidationState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: "" }
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: error.errors[0]?.message || "Invalid value" }
        }));
      }
    }
  };

  // Mark field as touched
  const touchField = (name: string) => {
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true }
    }));
  };

  // Validate all fields
  const validateAll = () => {
    try {
      schema.parse(values);
      setValidationState(prev => ({
        ...prev,
        errors: {},
        isValid: true
      }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationState(prev => ({
          ...prev,
          errors,
          isValid: false
        }));
      }
      return false;
    }
  };

  // Check overall validity on value changes
  useEffect(() => {
    const isValid = validateAll();
    setValidationState(prev => ({ ...prev, isValid }));
  }, [values]);

  return {
    ...validationState,
    validateField,
    touchField,
    validateAll
  };
}

// Error message component
export function FieldError({ error, touched }: { error?: string; touched?: boolean }) {
  if (!error || !touched) return null;
  
  return (
    <p className="text-sm text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
      {error}
    </p>
  );
}

// Success message component
export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-green-50 border border-green-200 p-4 animate-in fade-in slide-in-from-top-2">
      <p className="text-sm text-green-800 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </p>
    </div>
  );
}

// Loading state component
export function FormLoading({ message = "Processing..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-harmonix-sage-fade">
      <div className="w-5 h-5 border-2 border-harmonix-regal-gold border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

// Enhanced input component with validation
export function ValidatedInput({
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  className = "",
  required = false,
  ...props
}: {
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
  [key: string]: any;
}) {
  const hasError = touched && error;
  
  return (
    <div className="space-y-1">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          ${hasError 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-harmonix-cedar-mist/20 focus:ring-harmonix-regal-gold'
          }
          bg-harmonix-night-pine/50 text-white placeholder-harmonix-sage-fade
          focus:outline-none focus:ring-2 focus:border-transparent
          ${className}
        `}
        {...props}
      />
      <FieldError error={error} touched={touched} />
    </div>
  );
}

// Enhanced textarea component with validation
export function ValidatedTextarea({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  className = "",
  rows = 4,
  ...props
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
  [key: string]: any;
}) {
  const hasError = touched && error;
  
  return (
    <div className="space-y-1">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          ${hasError 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-harmonix-cedar-mist/20 focus:ring-harmonix-regal-gold'
          }
          bg-harmonix-night-pine/50 text-white placeholder-harmonix-sage-fade
          focus:outline-none focus:ring-2 focus:border-transparent resize-none
          ${className}
        `}
        {...props}
      />
      <FieldError error={error} touched={touched} />
    </div>
  );
}