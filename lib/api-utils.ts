import { NextApiResponse } from 'next';
// import { closeConnection } from './mongodb';

/**
 * Standard error types for API responses
 */
export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  VALIDATION = 'VALIDATION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  SERVER_ERROR = 'SERVER_ERROR',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED'
}

/**
 * Error response structure
 */
interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

/**
 * Handles API errors consistently across endpoints
 * @param res - Next.js API response object
 * @param type - Type of error
 * @param message - Error message
 * @param details - Additional error details
 * @param originalError - Original error object
 */
export async function handleApiError(
  res: NextApiResponse,
  type: ErrorType,
  message: string,
  details?: string,
  originalError?: Error
): Promise<void> {
  // Log the error
  if (originalError) {
    console.error(`API Error [${type}]: ${message}`, originalError);
  } else {
    console.error(`API Error [${type}]: ${message}`);
  }

  // Close MongoDB connection if there was an error
  // await closeConnection(); // Not needed with Mongoose caching

  // Determine status code based on error type
  let statusCode: number;
  switch (type) {
    case ErrorType.NOT_FOUND:
      statusCode = 404;
      break;
    case ErrorType.DUPLICATE:
      statusCode = 409;
      break;
    case ErrorType.VALIDATION:
      statusCode = 400;
      break;
    case ErrorType.UNAUTHORIZED:
      statusCode = 401;
      break;
    case ErrorType.METHOD_NOT_ALLOWED:
      statusCode = 405;
      break;
    case ErrorType.SERVER_ERROR:
    default:
      statusCode = 500;
      break;
  }

  // Construct error response
  const errorResponse: ErrorResponse = {
    error: message
  };

  if (details) {
    errorResponse.details = details;
  }

  if (originalError?.name) {
    errorResponse.code = originalError.name;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Validates that the request method matches one of the allowed methods
 * @param req - Next.js API request object
 * @param res - Next.js API response object
 * @param allowedMethods - Array of allowed HTTP methods
 * @returns Boolean indicating if method is allowed
 */
export async function validateMethod(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any,
  res: NextApiResponse,
  allowedMethods: string[]
): Promise<boolean> {
  if (!allowedMethods.includes(req.method || '')) {
    await handleApiError(
      res,
      ErrorType.METHOD_NOT_ALLOWED,
      'Method not allowed',
      `This endpoint only supports: ${allowedMethods.join(', ')}`
    );
    return false;
  }
  return true;
}