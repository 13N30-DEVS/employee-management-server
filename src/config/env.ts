import { config } from 'dotenv';
import { z } from 'zod';
import constants from './constants';

config({ path: '.env' });

// Environment variable schema with validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3030'),

  // Database
  DB_NAME: z.string().min(1, 'Database name is required'),
  DB_USERNAME: z.string().min(1, 'Database username is required'),
  DB_PASSWORD: z.string().min(1, 'Database password is required'),
  DB_HOST: z.string().min(1, 'Database host is required'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_DIALECT: z.enum(['postgres', 'mysql', 'sqlite']).default('postgres'),
  DB_SSL: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  DB_POOL_MAX: z.string().transform(Number).default(String(constants.DB_CONSTANTS.POOL.MAX)),
  DB_POOL_MIN: z.string().transform(Number).default(String(constants.DB_CONSTANTS.POOL.MIN)),
  DB_POOL_ACQUIRE: z
    .string()
    .transform(Number)
    .default(String(constants.DB_CONSTANTS.POOL.ACQUIRE)),
  DB_POOL_IDLE: z.string().transform(Number).default(String(constants.DB_CONSTANTS.POOL.IDLE)),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).default('0'),
  REDIS_CONNECT_TIMEOUT: z.string().transform(Number).default('10000'),
  REDIS_COMMAND_TIMEOUT: z.string().transform(Number).default('5000'),
  REDIS_RETRY_DELAY: z.string().transform(Number).default('1000'),
  REDIS_MAX_RETRIES: z.string().transform(Number).default('3'),
  REDIS_MAX_CLIENTS: z.string().transform(Number).default('10'),
  REDIS_MIN_CLIENTS: z.string().transform(Number).default('1'),
  REDIS_DEFAULT_TTL: z
    .string()
    .transform(Number)
    .default(String(constants.CACHE_CONSTANTS.TTL.DEFAULT)),
  REDIS_MAX_TTL: z.string().transform(Number).default(String(constants.CACHE_CONSTANTS.TTL.MAX)),
  REDIS_KEY_PREFIX: z.string().default('ems:'),
  REDIS_ENABLE_CLUSTER: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  REDIS_CLUSTER_NODES: z
    .string()
    .transform(val => (val ? val.split(',') : []))
    .default(''),
  REDIS_ENABLE_SENTINEL: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  REDIS_SENTINEL_HOSTS: z
    .string()
    .transform(val => (val ? val.split(',') : []))
    .default(''),
  REDIS_SENTINEL_PASSWORD: z.string().optional(),
  REDIS_SENTINEL_MASTER_NAME: z.string().default('mymaster'),
  REDIS_ENABLE_SSL: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  REDIS_SSL_CA: z.string().optional(),
  REDIS_SSL_CERT: z.string().optional(),
  REDIS_SSL_KEY: z.string().optional(),

  // JWT
  JWT_SECRET: z
    .string()
    .min(
      constants.SECURITY_CONSTANTS.SESSION_SECRET_MIN_LENGTH,
      `JWT secret must be at least ${constants.SECURITY_CONSTANTS.SESSION_SECRET_MIN_LENGTH} characters`
    ),
  JWT_EXPIRES_IN: z.string().default(constants.SECURITY_CONSTANTS.JWT_EXPIRES_IN),
  JWT_REFRESH_EXPIRES_IN: z.string().default(constants.SECURITY_CONSTANTS.JWT_REFRESH_EXPIRES_IN),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
  CORS_CREDENTIALS: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Frontend
  FRONT_END_URL: z.string().url('Invalid frontend URL').default('http://localhost:3000'),

  // AWS S3
  S3_URL: z.string().url('Invalid S3 URL'),
  AWS_ACCESS_KEY: z.string().min(1, 'AWS access key is required'),
  AWS_SECRET: z.string().min(1, 'AWS secret is required'),
  AWS_BUCKET_NAME: z.string().min(1, 'AWS bucket name is required'),
  AWS_REGION: z.string().default('us-east-1'),

  // Email
  BREVO_SMTP_SERVER: z.string().min(1, 'SMTP server is required'),
  BREVO_PORT: z.string().transform(Number).default('587'),
  BREVO_LOGIN: z.string().min(1, 'SMTP login is required'),
  BREVO_USER: z.string().min(1, 'SMTP user is required'),
  BREVO_PASSWORD: z.string().min(1, 'SMTP password is required'),

  // Rate Limiting
  RATE_LIMIT_MAX: z
    .string()
    .transform(Number)
    .default(String(constants.SECURITY_CONSTANTS.RATE_LIMIT.MAX_REQUESTS)),
  RATE_LIMIT_TIME_WINDOW: z.string().default(constants.SECURITY_CONSTANTS.RATE_LIMIT.TIME_WINDOW),

  // Security
  BCRYPT_ROUNDS: z
    .string()
    .transform(Number)
    .default(String(constants.SECURITY_CONSTANTS.BCRYPT_ROUNDS)),
  SESSION_SECRET: z
    .string()
    .min(
      constants.SECURITY_CONSTANTS.SESSION_SECRET_MIN_LENGTH,
      `Session secret must be at least ${constants.SECURITY_CONSTANTS.SESSION_SECRET_MIN_LENGTH} characters`
    ),
});

// Validate environment variables
const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
  // Use process.stderr for critical errors during startup
  process.stderr.write('❌ Invalid environment variables:\n');
  process.stderr.write(JSON.stringify(envParseResult.error.format(), null, 2) + '\n');
  process.exit(1);
}

const env = envParseResult.data;

export default env;
export { env };
