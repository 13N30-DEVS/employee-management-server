import Redis from 'ioredis';
import { REDIS_CONFIG } from '../config/redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  namespace?: string; // Namespace for the cache key
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  namespace: string;
}

export interface RedisStats {
  connected: boolean;
  totalKeys: number;
  memoryUsage: any;
  info: any;
  lastPing: number;
}

class RedisService {
  private redis: Redis | null = null;
  private isConnected = false;
  private lastPing = 0;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    try {
      // Simple Redis connection for now
      this.redis = new Redis({
        host: REDIS_CONFIG.HOST,
        port: REDIS_CONFIG.PORT,
        password: REDIS_CONFIG.PASSWORD,
        db: REDIS_CONFIG.DB,
        connectTimeout: REDIS_CONFIG.CONNECT_TIMEOUT,
        commandTimeout: REDIS_CONFIG.COMMAND_TIMEOUT,
        maxRetriesPerRequest: REDIS_CONFIG.MAX_RETRIES,
        enableReadyCheck: true,
        lazyConnect: true,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to initialize Redis connection', error);
      this.redis = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.redis) return;

    this.redis.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected successfully');
    });

    this.redis.on('ready', () => {
      this.isConnected = true;
      console.log('Redis is ready');
    });

    this.redis.on('error', error => {
      this.isConnected = false;
      console.error('Redis connection error', error);
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      console.warn('Redis connection closed');
    });

    this.redis.on('end', () => {
      this.isConnected = false;
      console.warn('Redis connection ended');
    });
  }

  private generateKey(key: string, namespace?: string): string {
    const prefix = REDIS_CONFIG.KEY_PREFIX;
    const ns = namespace ? `${namespace}:` : '';
    return `${prefix}${ns}${key}`;
  }

  private async executeCommand<T>(command: () => Promise<T>, fallback?: T): Promise<T | null> {
    if (!this.redis || !this.isConnected) {
      return fallback || null;
    }

    try {
      const result = await command();
      return result;
    } catch (error) {
      console.error('Redis command failed', error);
      return fallback || null;
    }
  }

  // Cache operations
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<boolean> {
    const { ttl = REDIS_CONFIG.DEFAULT_TTL, tags = [], namespace } = options;

    const cacheKey = this.generateKey(key, namespace);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
      namespace: namespace || 'default',
    };

    try {
      // Store the main data
      const result = await this.executeCommand(() =>
        this.redis!.setex(cacheKey, ttl, JSON.stringify(entry))
      );

      if (result === 'OK' && tags.length > 0) {
        // Store tag associations for invalidation
        await this.storeTagAssociations(cacheKey, tags);
      }

      return result === 'OK';
    } catch (error) {
      console.error(`Failed to set cache key: ${cacheKey}`, error);
      return false;
    }
  }

  async get<T>(key: string, namespace?: string): Promise<T | null> {
    const cacheKey = this.generateKey(key, namespace);

    try {
      const result = await this.executeCommand(() => this.redis!.get(cacheKey));

      if (!result) return null;

      const entry: CacheEntry<T> = JSON.parse(result);

      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl * 1000) {
        await this.delete(key, namespace);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`Failed to get cache key: ${cacheKey}`, error);
      return null;
    }
  }

  async delete(key: string, namespace?: string): Promise<boolean> {
    const cacheKey = this.generateKey(key, namespace);

    try {
      const result = await this.executeCommand(() => this.redis!.del(cacheKey));

      // Also remove tag associations
      await this.removeTagAssociations(cacheKey);

      return result === 1;
    } catch (error) {
      console.error(`Failed to delete cache key: ${cacheKey}`, error);
      return false;
    }
  }

  async exists(key: string, namespace?: string): Promise<boolean> {
    const cacheKey = this.generateKey(key, namespace);

    try {
      const result = await this.executeCommand(() => this.redis!.exists(cacheKey));

      return result === 1;
    } catch (error) {
      console.error(`Failed to check existence of cache key: ${cacheKey}`, error);
      return false;
    }
  }

  async expire(key: string, ttl: number, namespace?: string): Promise<boolean> {
    const cacheKey = this.generateKey(key, namespace);

    try {
      const result = await this.executeCommand(() => this.redis!.expire(cacheKey, ttl));

      return result === 1;
    } catch (error) {
      console.error(`Failed to set expiry for cache key: ${cacheKey}`, error);
      return false;
    }
  }

  async ttl(key: string, namespace?: string): Promise<number> {
    const cacheKey = this.generateKey(key, namespace);

    try {
      const result = await this.executeCommand(() => this.redis!.ttl(cacheKey));

      return result || -1;
    } catch (error) {
      console.error(`Failed to get TTL for cache key: ${cacheKey}`, error);
      return -1;
    }
  }

  // Tag-based operations
  async invalidateByTag(tag: string): Promise<number> {
    const tagKey = this.generateKey(`tag:${tag}`);

    try {
      const keys = await this.executeCommand(() => this.redis!.smembers(tagKey));

      if (!keys || keys.length === 0) return 0;

      let deletedCount = 0;
      for (const key of keys) {
        if (await this.delete(key)) {
          deletedCount++;
        }
      }

      // Remove the tag itself
      await this.executeCommand(() => this.redis!.del(tagKey));

      return deletedCount;
    } catch (error) {
      console.error(`Failed to invalidate tag: ${tag}`, error);
      return 0;
    }
  }

  async invalidateByNamespace(namespace: string): Promise<number> {
    const pattern = this.generateKey('*', namespace);

    try {
      const keys = await this.executeCommand(() => this.redis!.keys(pattern));

      if (!keys || keys.length === 0) return 0;

      let deletedCount = 0;
      for (const key of keys) {
        if (await this.delete(key)) {
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error(`Failed to invalidate namespace: ${namespace}`, error);
      return 0;
    }
  }

  async clear(): Promise<boolean> {
    try {
      const pattern = `${REDIS_CONFIG.KEY_PREFIX}*`;
      const keys = await this.executeCommand(() => this.redis!.keys(pattern));

      if (!keys || keys.length === 0) return true;

      const result = await this.executeCommand(() => this.redis!.del(...keys));

      return result === keys.length;
    } catch (error) {
      console.error('Failed to clear cache', error);
      return false;
    }
  }

  // Tag association management
  private async storeTagAssociations(key: string, tags: string[]): Promise<void> {
    for (const tag of tags) {
      const tagKey = this.generateKey(`tag:${tag}`);
      await this.executeCommand(() => this.redis!.sadd(tagKey, key));
    }
  }

  private async removeTagAssociations(_key: string): Promise<void> {
    // This would require storing tag information in the main entry
    // For now, we'll skip this optimization
  }

  // Utility methods
  async ping(): Promise<boolean> {
    try {
      const result = await this.executeCommand(() => this.redis!.ping());

      if (result === 'PONG') {
        this.lastPing = Date.now();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Redis ping failed', error);
      return false;
    }
  }

  async getStats(): Promise<RedisStats> {
    try {
      const [totalKeys, memoryUsage, info] = await Promise.all([
        this.executeCommand(() => this.redis!.dbsize()) || 0,
        this.executeCommand(() => this.redis!.info('memory')) || {},
        this.executeCommand(() => this.redis!.info()) || {},
      ]);

      return {
        connected: this.isConnected,
        totalKeys: totalKeys || 0,
        memoryUsage,
        info,
        lastPing: this.lastPing,
      };
    } catch (error) {
      console.error('Failed to get Redis stats', error);
      return {
        connected: this.isConnected,
        totalKeys: 0,
        memoryUsage: {},
        info: {},
        lastPing: this.lastPing,
      };
    }
  }

  // Connection management
  async connect(): Promise<boolean> {
    if (!this.redis) {
      this.initializeConnection();
      return false;
    }

    try {
      await this.redis.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to Redis', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.disconnect();
        this.isConnected = false;
        console.log('Redis disconnected');
      } catch (error) {
        console.error('Failed to disconnect from Redis', error);
      }
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    return await this.ping();
  }
}

// Export singleton instance
export const redisService = new RedisService();
export default redisService;
