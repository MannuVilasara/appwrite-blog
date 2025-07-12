// Form related types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormFieldError {
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Common form validation patterns
export interface ValidationRules {
  required?: string | boolean;
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
}
