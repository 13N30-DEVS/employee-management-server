import { env } from "./env";

export const REDIS_CONFIG = {
  // Redis connection
  HOST: env.REDIS_HOST || "localhost",
  PORT: env.REDIS_PORT || 6379,
  PASSWORD: env.REDIS_PASSWORD || undefined,
  DB: env.REDIS_DB || 0,

  // Connection options
  CONNECT_TIMEOUT: env.REDIS_CONNECT_TIMEOUT || 10000,
  COMMAND_TIMEOUT: env.REDIS_COMMAND_TIMEOUT || 5000,
  RETRY_DELAY: env.REDIS_RETRY_DELAY || 1000,
  MAX_RETRIES: env.REDIS_MAX_RETRIES || 3,

  // Pool settings
  MAX_CLIENTS: env.REDIS_MAX_CLIENTS || 10,
  MIN_CLIENTS: env.REDIS_MIN_CLIENTS || 1,

  // Cache settings
  DEFAULT_TTL: env.REDIS_DEFAULT_TTL || 300, // 5 minutes in seconds
  MAX_TTL: env.REDIS_MAX_TTL || 86400, // 24 hours in seconds

  // Key prefixes
  KEY_PREFIX: env.REDIS_KEY_PREFIX || "ems:",

  // Cluster settings
  ENABLE_CLUSTER: env.REDIS_ENABLE_CLUSTER,
  CLUSTER_NODES: env.REDIS_CLUSTER_NODES || [],

  // Sentinel settings
  ENABLE_SENTINEL: env.REDIS_ENABLE_SENTINEL,
  SENTINEL_HOSTS: env.REDIS_SENTINEL_HOSTS || [],
  SENTINEL_PASSWORD: env.REDIS_SENTINEL_PASSWORD || undefined,
  SENTINEL_MASTER_NAME: env.REDIS_SENTINEL_MASTER_NAME || "mymaster",

  // SSL settings
  ENABLE_SSL: env.REDIS_ENABLE_SSL,
  SSL_CA: env.REDIS_SSL_CA || undefined,
  SSL_CERT: env.REDIS_SSL_CERT || undefined,
  SSL_KEY: env.REDIS_SSL_KEY || undefined,
};

export default REDIS_CONFIG;
