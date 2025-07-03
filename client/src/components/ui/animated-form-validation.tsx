import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedFormFieldProps {
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  validation?: (value: string) => { isValid: boolean; message?: string };
  required?: boolean;
  className?: string;
}

export function AnimatedFormField({
  name,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  validation,
  required = false,
  className
}: AnimatedFormFieldProps) {
  const [fieldValue, setFieldValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [validationState, setValidationState] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message?: string;
  }>({ status: 'idle' });

  useEffect(() => {
    if (fieldValue && validation) {
      setValidationState({ status: 'validating' });
      
      const timer = setTimeout(() => {
        const result = validation(fieldValue);
        setValidationState({
          status: result.isValid ? 'valid' : 'invalid',
          message: result.message
        });
      }, 500);

      return () => clearTimeout(timer);
    } else if (!fieldValue) {
      setValidationState({ status: 'idle' });
    }
  }, [fieldValue, validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFieldValue(newValue);
    onChange?.(newValue);
  };

  const getValidationIcon = () => {
    switch (validationState.status) {
      case 'validating':
        return <Loader2 className="w-4 h-4 animate-spin text-jade-forest" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    if (!isFocused && validationState.status === 'idle') return 'border-harmonix-sage';
    if (isFocused) return 'border-jade-forest';
    if (validationState.status === 'valid') return 'border-green-500';
    if (validationState.status === 'invalid') return 'border-red-500';
    return 'border-jade-forest';
  };

  return (
    <div className="relative">
      <div className="relative">
        <motion.input
          type={type}
          name={name}
          value={fieldValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={cn(
            'w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-300',
            'bg-harmonix-black text-harmonix-sage placeholder-harmonix-sage/60',
            'focus:outline-none focus:ring-2 focus:ring-jade-forest/20',
            getBorderColor(),
            className
          )}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused 
              ? '0 0 0 3px rgba(29, 107, 74, 0.1)'
              : validationState.status === 'valid'
              ? '0 0 0 2px rgba(34, 197, 94, 0.2)'
              : validationState.status === 'invalid'
              ? '0 0 0 2px rgba(239, 68, 68, 0.2)'
              : 'none'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        
        <AnimatePresence>
          {(isFocused || validationState.status !== 'idle') && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {getValidationIcon()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {validationState.message && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'mt-2 px-3 py-2 rounded-lg text-sm flex items-center gap-2',
              validationState.status === 'valid' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}
          >
            {validationState.status === 'valid' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {validationState.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated Submit Button with Progress
interface AnimatedSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  success?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function AnimatedSubmitButton({
  children,
  isLoading = false,
  success = false,
  onClick,
  disabled = false,
  className
}: AnimatedSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'relative w-full py-3 px-6 rounded-lg font-medium transition-all duration-300',
        'bg-jade-forest text-harmonix-black hover:bg-jade-forest-muted',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'overflow-hidden',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      animate={{
        backgroundColor: success ? '#22c55e' : undefined
      }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Success!</span>
          </motion.div>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Animated background effect */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: [-100, 300] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}
    </motion.button>
  );
}

// Form validation helpers
export const validationRules = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return {
      isValid,
      message: isValid ? '✓ Valid email address' : '✗ Please enter a valid email address'
    };
  },

  password: (value: string) => {
    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    const isValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
    
    if (isValid) {
      return { isValid: true, message: '✓ Strong password' };
    }
    
    const missing = [];
    if (!hasLength) missing.push('8+ characters');
    if (!hasUpper) missing.push('uppercase letter');
    if (!hasLower) missing.push('lowercase letter');
    if (!hasNumber) missing.push('number');
    if (!hasSpecial) missing.push('special character');
    
    return {
      isValid: false,
      message: `✗ Missing: ${missing.join(', ')}`
    };
  },

  phone: (value: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const isValid = phoneRegex.test(value);
    return {
      isValid,
      message: isValid ? '✓ Valid phone number' : '✗ Please enter a valid phone number'
    };
  },

  required: (value: string) => {
    const isValid = value.trim().length > 0;
    return {
      isValid,
      message: isValid ? '✓ Field completed' : '✗ This field is required'
    };
  }
};