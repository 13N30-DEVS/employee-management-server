import { FastifyRequest } from 'fastify';
import { redisService, CacheOptions } from '../services/redis';
import { Logger } from './logger';

export interface CacheDecoratorOptions extends CacheOptions {
  key?: string | ((request: FastifyRequest) => string);
  condition?: (request: FastifyRequest) => boolean;
  onHit?: (_data: any, _request: FastifyRequest) => void;
  onMiss?: (_request: FastifyRequest) => void;
}

export interface CachePatterns {
  // User-specific cache
  user: {
    profile: (userId: string) => string;
    permissions: (userId: string) => string;
    preferences: (userId: string) => string;
  };

  // Data cache
  data: {
    departments: () => string;
    designations: () => string;
    employees: (_filters?: string) => string;
    reports: (_type: string, _date: string) => string;
  };

  // Session cache
  session: {
    user: (_sessionId: string) => string;
    tokens: (_userId: string) => string;
  };

  // API cache
  api: {
    response: (_endpoint: string, _params?: string) => string;
    rateLimit: (_ip: string, _endpoint: string) => string;
  };
}

// Create a mock request object for logging when no request is available
const createMockRequest = () =>
  ({
    id: 'system',
    url: '/system',
    method: 'SYSTEM',
    ip: '127.0.0.1',
    hostname: 'localhost',
    protocol: 'http',
    headers: { 'user-agent': 'system' },
    query: {},
    params: {},
    body: null,
    user: undefined,
  } as any);

export class RedisCacheHelper {
  private static readonly cachePatterns: CachePatterns = {
    user: {
      profile: (userId: string) => `user:profile:${userId}`,
      permissions: (userId: string) => `user:permissions:${userId}`,
      preferences: (userId: string) => `user:preferences:${userId}`,
    },

    data: {
      departments: () => 'data:departments:all',
      designations: () => 'data:designations:all',
      employees: (filters?: string) => `data:employees:${filters || 'all'}`,
      reports: (type: string, date: string) => `data:reports:${type}:${date}`,
    },

    session: {
      user: (sessionId: string) => `session:user:${sessionId}`,
      tokens: (userId: string) => `session:tokens:${userId}`,
    },

    api: {
      response: (endpoint: string, params?: string) =>
        `api:response:${endpoint}:${params || 'default'}`,
      rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,
    },
  };

  /**
   * Get cache patterns for consistent key generation
   */
  static get patterns(): CachePatterns {
    return this.cachePatterns;
  }

  /**
   * Cache decorator for methods
   */
  static cache(options: CacheDecoratorOptions = {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const request = args.find(arg => arg && typeof arg === 'object' && arg.url);

        if (!request || (options.condition && !options.condition(request))) {
          return originalMethod.apply(this, args);
        }

        const cacheKey =
          typeof options.key === 'function'
            ? options.key(request)
            : options.key || `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

        try {
          // Try to get from cache
          const cached = await redisService.get(cacheKey);
          if (cached) {
            Logger.debug(request, `Cache hit for ${cacheKey}`);
            if (options.onHit) {
              options.onHit(cached, request);
            }
            return cached;
          }

          // Cache miss, execute original method
          Logger.debug(request, `Cache miss for ${cacheKey}`);
          if (options.onMiss) {
            options.onMiss(request);
          }

          const result = await originalMethod.apply(this, args);

          // Cache the result
          if (result) {
            await redisService.set(cacheKey, result, options);
            Logger.debug(request, `Cached result for ${cacheKey}`);
          }

          return result;
        } catch (error) {
          Logger.error(request, `Cache operation failed for ${cacheKey}`, error);
          // Fallback to original method
          return originalMethod.apply(this, args);
        }
      };

      return descriptor;
    };
  }

  /**
   * Invalidate cache by pattern using available Redis methods
   */
  static async invalidatePattern(pattern: string): Promise<number> {
    try {
      // Use the available invalidateByNamespace method for pattern invalidation
      // This is a simplified approach - in production you might want to implement SCAN
      const namespace = pattern.replace('*', '').replace(/:$/, '');
      if (namespace) {
        return await redisService.invalidateByNamespace(namespace);
      }

      // Fallback to clearing all cache if no namespace pattern
      const result = await redisService.clear();
      return result ? 1 : 0;
    } catch (error) {
      Logger.error(createMockRequest(), `Failed to invalidate pattern: ${pattern}`, error);
      return 0;
    }
  }

  /**
   * Invalidate user-related cache
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    try {
      const patterns = [
        this.cachePatterns.user.profile(userId),
        this.cachePatterns.user.permissions(userId),
        this.cachePatterns.user.preferences(userId),
        this.cachePatterns.session.tokens(userId),
      ];

      for (const pattern of patterns) {
        await redisService.delete(pattern);
      }

      Logger.info(createMockRequest(), `Invalidated cache for user: ${userId}`);
    } catch (error) {
      Logger.error(createMockRequest(), `Failed to invalidate user cache: ${userId}`, error);
    }
  }

  /**
   * Invalidate data cache
   */
  static async invalidateDataCache(type?: string): Promise<void> {
    try {
      if (type === 'departments') {
        await redisService.delete(this.cachePatterns.data.departments());
      } else if (type === 'designations') {
        await redisService.delete(this.cachePatterns.data.designations());
      } else if (type === 'employees') {
        // Invalidate all employee caches
        await this.invalidatePattern('data:employees');
      } else if (type === 'reports') {
        // Invalidate all report caches
        await this.invalidatePattern('data:reports');
      } else {
        // Invalidate all data caches
        await this.invalidatePattern('data');
      }

      Logger.info(createMockRequest(), `Invalidated data cache: ${type || 'all'}`);
    } catch (error) {
      Logger.error(createMockRequest(), `Failed to invalidate data cache: ${type}`, error);
    }
  }

  /**
   * Warm up cache with frequently accessed data
   */
  static async warmupCache(): Promise<void> {
    try {
      Logger.info(createMockRequest(), 'Starting cache warmup...');

      // Add your warmup logic here
      // Example: Pre-load departments, designations, etc.
      // await this.warmupDepartments();
      // await this.warmupDesignations();

      Logger.info(createMockRequest(), 'Cache warmup completed');
    } catch (error) {
      Logger.error(createMockRequest(), 'Cache warmup failed', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats() {
    try {
      return await redisService.getStats();
    } catch (error) {
      Logger.error(createMockRequest(), 'Failed to get cache stats', error);
      return null;
    }
  }

  /**
   * Health check for cache
   */
  static async isHealthy(): Promise<boolean> {
    try {
      return await redisService.isHealthy();
    } catch (error) {
      Logger.error(createMockRequest(), 'Cache health check failed', error);
      return false;
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  static async clearAll(): Promise<void> {
    try {
      await redisService.clear();
      Logger.info(createMockRequest(), 'All cache cleared');
    } catch (error) {
      Logger.error(createMockRequest(), 'Failed to clear all cache', error);
    }
  }
}

// Export commonly used patterns
export const cachePatterns = RedisCacheHelper.patterns;
export const cacheDecorator = RedisCacheHelper.cache;
export const invalidateUserCache = RedisCacheHelper.invalidateUserCache.bind(RedisCacheHelper);
export const invalidateDataCache = RedisCacheHelper.invalidateDataCache.bind(RedisCacheHelper);
export const warmupCache = RedisCacheHelper.warmupCache.bind(RedisCacheHelper);
export const clearAllCache = RedisCacheHelper.clearAll.bind(RedisCacheHelper);

export default RedisCacheHelper;
