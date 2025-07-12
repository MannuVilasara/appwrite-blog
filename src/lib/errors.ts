/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Creates a standardized error object
 * @param message - Error message
 * @param code - Optional error code
 * @param details - Optional error details
 * @returns Standardized error object
 */
export const createError = (
  message: string,
  code?: string,
  details?: any
): AppError => ({
  message,
  code,
  details,
});

/**
 * Handles API errors and returns user-friendly messages
 * @param error - The error object
 * @returns User-friendly error message
 */
export const handleApiError = (error: any): string => {
  // Handle Appwrite specific errors
  if (error?.message) {
    // Convert technical errors to user-friendly messages
    if (error.message.includes("Invalid credentials")) {
      return "Invalid email or password. Please try again.";
    }
    if (error.message.includes("User already exists")) {
      return "An account with this email already exists.";
    }
    if (error.message.includes("Document not found")) {
      return "The requested content was not found.";
    }
    if (error.message.includes("Unauthorized")) {
      return "You don't have permission to perform this action.";
    }
    return error.message;
  }

  // Fallback for unknown errors
  return "An unexpected error occurred. Please try again.";
};

/**
 * Logs errors in development only
 * @param error - Error to log
 * @param context - Optional context for the error
 */
export const logError = (error: any, context?: string): void => {
  if (import.meta.env.DEV) {
    const prefix = context ? `[${context}]` : "[Error]";
    console.error(prefix, error);
  }
};
