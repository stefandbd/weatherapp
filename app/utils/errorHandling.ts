import {Alert} from 'react-native';

/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  originalError?: any;
}

/**
 * Create a standardized error object
 * @param message - Error message
 * @param code - Error code
 * @param statusCode - HTTP status code if applicable
 * @param originalError - Original error object
 * @returns Standardized error object
 */
export const createAppError = (
  message: string,
  code?: string,
  statusCode?: number,
  originalError?: any,
): AppError => ({
  message,
  code,
  statusCode,
  originalError,
});

/**
 * Get user-friendly error message from any error type
 * @param error - Error object of any type
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  // Handle our custom AppError type
  if (typeof error === 'object' && 'message' in error) {
    const appError = error as AppError;
    return appError.message;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred';
};

/**
 * Show error alert with consistent styling
 * @param error - Error object or message
 * @param title - Alert title (default: 'Error')
 * @param onPress - Optional callback when OK is pressed
 */
export const showErrorAlert = (
  error: unknown,
  title: string = 'Error',
  onPress?: () => void,
): void => {
  const message = getErrorMessage(error);
  Alert.alert(title, message, [{text: 'OK', onPress}]);
};

/**
 * Log error with consistent format
 * @param error - Error object
 * @param context - Context where error occurred
 */
export const logError = (error: unknown, context: string): void => {
  const message = getErrorMessage(error);
  console.error(`[${context}] ${message}`, error);
};

/**
 * Handle async operation with error handling
 * @param operation - Async operation to execute
 * @param context - Context for error logging
 * @param showAlert - Whether to show error alert (default: true)
 * @returns Promise that resolves to operation result or null if error
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  context: string,
  showAlert: boolean = true,
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    logError(error, context);
    if (showAlert) {
      showErrorAlert(error);
    }
    return null;
  }
};

/**
 * Retry an async operation with exponential backoff
 * @param operation - Async operation to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise that resolves to operation result
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};
