// Application constants
export const APP_CONSTANTS = {
  NAME: 'Employee Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Backend API for Employee Management System',
} as const;

// Database constants
export const DB_CONSTANTS = {
  POOL: {
    MAX: 10,
    MIN: 0,
    ACQUIRE: 30000,
    IDLE: 10000,
  },
  RETRY: {
    MAX_ATTEMPTS: 5,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 30000,
  },
} as const;

// User status constants
export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  SUSPENDED: 2,
  PENDING: 3,
} as const;

// User role constants
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 3,
  EMPLOYEE: 4,
} as const;

// Security constants
export const SECURITY_CONSTANTS = {
  BCRYPT_ROUNDS: 10,
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',
  SESSION_SECRET_MIN_LENGTH: 32,
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    TIME_WINDOW: '1 minute',
    USER_MAX_REQUESTS: 50,
  },
} as const;

// File upload constants
export const FILE_CONSTANTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

// Cache constants
export const CACHE_CONSTANTS = {
  TTL: {
    DEFAULT: 300, // 5 minutes
    MAX: 86400, // 24 hours
    USER_PROFILE: 1800, // 30 minutes
    USER_PERMISSIONS: 3600, // 1 hour
    DATA: 7200, // 2 hours
  },
  PATTERNS: {
    USER: 'user:*',
    DATA: 'data:*',
    SESSION: 'session:*',
    API: 'api:*',
  },
} as const;

// Pagination constants
export const PAGINATION_CONSTANTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

// Time constants
export const TIME_CONSTANTS = {
  FORMATS: {
    TIME_24H: 'HH:mm:ss',
    TIME_24H_SHORT: 'HH:mm',
    TIME_12H: 'h:mm a',
    TIME_12H_SHORT: 'h a',
    DATE: 'yyyy-MM-dd',
    DATETIME: 'yyyy-MM-dd HH:mm:ss',
    ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  },
  REGEX: {
    TIME_12H: /^(0?[1-9]|1[0-2])(?::[0-5]\d)? [APMapm]{2}$/,
    TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/,
  },
} as const;

// HTTP status messages
export const HTTP_MESSAGES = {
  SUCCESS: {
    FETCHED: 'Data fetched successfully',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
  },
  ERROR: {
    VALIDATION: 'Validation failed',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Insufficient permissions',
    CONFLICT: 'Resource conflict',
    INTERNAL_SERVER: 'Internal server error',
  },
} as const;

// Validation constants
export const VALIDATION_CONSTANTS = {
  STRING: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 128,
  },
  NUMBERS: {
    MIN_ID: 1,
    MAX_ID: 999999999,
  },
} as const;

export default {
  APP_CONSTANTS,
  DB_CONSTANTS,
  USER_STATUS,
  USER_ROLES,
  SECURITY_CONSTANTS,
  FILE_CONSTANTS,
  CACHE_CONSTANTS,
  PAGINATION_CONSTANTS,
  TIME_CONSTANTS,
  HTTP_MESSAGES,
  VALIDATION_CONSTANTS,
};
