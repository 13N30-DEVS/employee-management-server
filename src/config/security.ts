import { env } from './env';

export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  },

  // JWT configuration
  JWT: {
    SECRET: env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRY: env.JWT_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRY: env.JWT_REFRESH_EXPIRES_IN,
    ISSUER: 'ems-backend',
    AUDIENCE: 'ems-frontend',
  },

  // Rate limiting
  RATE_LIMIT: {
    GLOBAL: {
      MAX: env.RATE_LIMIT_MAX,
      TIME_WINDOW: env.RATE_LIMIT_TIME_WINDOW,
    },
    AUTH: {
      MAX: 5, // 5 attempts per minute for auth endpoints
      TIME_WINDOW: '1 minute',
    },
    UPLOAD: {
      MAX: 10, // 10 uploads per minute
      TIME_WINDOW: '1 minute',
    },
  },

  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
    SCAN_VIRUS: false, // Enable in production with proper antivirus service
  },

  // CORS configuration
  CORS: {
    ORIGIN: env.CORS_ORIGIN,
    CREDENTIALS: env.CORS_CREDENTIALS,
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'Cache-Control',
    ],
    EXPOSED_HEADERS: ['X-Total-Count', 'X-Page-Count'],
    MAX_AGE: 86400, // 24 hours
  },

  // Security headers
  HEADERS: {
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_FRAME_OPTIONS: 'DENY',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=()',
    STRICT_TRANSPORT_SECURITY: 'max-age=31536000; includeSubDomains; preload',
  },

  // Session security
  SESSION: {
    SECRET: env.SESSION_SECRET,
    COOKIE_SECURE: env.NODE_ENV === 'production',
    COOKIE_HTTP_ONLY: true,
    COOKIE_SAME_SITE: 'strict' as const,
    COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Database security
  DATABASE: {
    SSL: env.DB_SSL && env.NODE_ENV === 'production',
    CONNECTION_TIMEOUT: 30000, // 30 seconds
    QUERY_TIMEOUT: 30000, // 30 seconds
    MAX_CONNECTIONS: env.DB_POOL_MAX,
    MIN_CONNECTIONS: env.DB_POOL_MIN,
  },

  // Logging security
  LOGGING: {
    LOG_LEVEL: env.NODE_ENV === 'production' ? 'info' : 'debug',
    LOG_SENSITIVE_DATA: false, // Never log passwords, tokens, etc.
    LOG_IP_ADDRESSES: true,
    LOG_USER_AGENTS: true,
    LOG_REQUEST_BODIES: env.NODE_ENV === 'development',
  },

  // API security
  API: {
    VERSION: 'v1',
    PREFIX: '/api',
    DOCS_ENABLED: env.NODE_ENV !== 'production',
    DOCS_PATH: '/docs',
    HEALTH_CHECK_PATH: '/health',
    METRICS_PATH: '/metrics',
  },

  // Encryption
  ENCRYPTION: {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    SALT_ROUNDS: env.BCRYPT_ROUNDS,
  },
};

// Security validation functions
export const SecurityValidator = {
  /**
   * Validates password strength
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.PASSWORD;

    if (password.length < config.MIN_LENGTH) {
      errors.push(`Password must be at least ${config.MIN_LENGTH} characters long`);
    }

    if (password.length > config.MAX_LENGTH) {
      errors.push(`Password must not exceed ${config.MAX_LENGTH} characters`);
    }

    if (config.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (config.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (config.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (config.REQUIRE_SPECIAL_CHARS && !config.SPECIAL_CHARS.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validates file upload
   */
  validateFile(file: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = SECURITY_CONFIG.FILE_UPLOAD;

    if (!file || !file.buffer) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    if (file.size > config.MAX_SIZE) {
      errors.push(`File size exceeds maximum limit of ${config.MAX_SIZE / (1024 * 1024)}MB`);
    }

    if (!config.ALLOWED_TYPES.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Sanitizes user input
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  /**
   * Generates secure random string
   */
  generateSecureString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};

export default SECURITY_CONFIG;
