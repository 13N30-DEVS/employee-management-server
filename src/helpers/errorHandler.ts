import { FastifyRequest, FastifyReply } from 'fastify';
import { Logger } from './logger';

// Custom application error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, code?: string, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code || this.getDefaultCode(statusCode);
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      case 429:
        return 'TOO_MANY_REQUESTS';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'UNKNOWN_ERROR';
    }
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR');
    this.details = details;
  }
  details?: any;
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, message, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(409, message, 'CONFLICT');
  }
}

// Error handler function
export const handleAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle known error types
    if (error.name === 'SequelizeValidationError') {
      return new ValidationError('Validation failed', error);
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return new ConflictError('Resource already exists');
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return new ValidationError('Invalid reference');
    }

    return new AppError(500, error.message, 'INTERNAL_SERVER_ERROR');
  }

  return new AppError(500, 'Internal server error', 'INTERNAL_SERVER_ERROR');
};

// Global error handler middleware
export const globalErrorHandler = (error: Error, request: FastifyRequest, reply: FastifyReply) => {
  const appError = handleAppError(error);

  // Log error
  Logger.error(request, appError.message, appError);

  // Send error response
  reply.status(appError.statusCode).send({
    isError: true,
    message: appError.message,
    code: appError.code,
    origin: request.url,
    timestamp: new Date(),
    ...(process.env.NODE_ENV === 'development' && { stack: appError.stack }),
  });
};

// Async error wrapper
export const asyncHandler = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
  return async (..._args: T): Promise<R> => {
    try {
      return await fn(..._args);
    } catch (error) {
      throw handleAppError(error);
    }
  };
};
