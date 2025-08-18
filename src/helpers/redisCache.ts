import { FastifyRequest } from "fastify";
import { redisService, CacheOptions } from "../services/redis";
import { Logger } from "./logger";

export interface CacheDecoratorOptions extends CacheOptions {
  key?: string | ((request: FastifyRequest) => string);
  condition?: (request: FastifyRequest) => boolean;
  onHit?: (data: any, request: FastifyRequest) => void;
  onMiss?: (request: FastifyRequest) => void;
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
    employees: (filters?: string) => string;
    reports: (type: string, date: string) => string;
  };

  // Session cache
  session: {
    user: (sessionId: string) => string;
    tokens: (userId: string) => string;
  };

  // API cache
  api: {
    response: (endpoint: string, params?: string) => string;
    rateLimit: (ip: string, endpoint: string) => string;
  };
}

export class RedisCacheHelper {
  private static readonly cachePatterns: CachePatterns = {
    user: {
      profile: (userId: string) => `user:profile:${userId}`,
      permissions: (userId: string) => `user:permissions:${userId}`,
      preferences: (userId: string) => `user:preferences:${userId}`,
    },

    data: {
      departments: () => "data:departments:all",
      designations: () => "data:designations:all",
      employees: (filters?: string) => `data:employees:${filters || "all"}`,
      reports: (type: string, date: string) => `data:reports:${type}:${date}`,
    },

    session: {
      user: (sessionId: string) => `session:user:${sessionId}`,
      tokens: (userId: string) => `session:tokens:${userId}`,
    },

    api: {
      response: (endpoint: string, params?: string) =>
        `api:response:${endpoint}:${params || "default"}`,
      rateLimit: (ip: string, endpoint: string) =>
        `ratelimit:${ip}:${endpoint}`,
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
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const request = args.find(
          (arg) => arg && typeof arg === "object" && arg.url
        );

        if (!request || (options.condition && !options.condition(request))) {
          return originalMethod.apply(this, args);
        }

        const cacheKey =
          typeof options.key === "function"
            ? options.key(request)
            : options.key ||
              `${target.constructor.name}:${propertyKey}:${JSON.stringify(
                args
              )}`;

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
          Logger.error(
            request,
            `Cache operation failed for ${cacheKey}`,
            error
          );
          // Fallback to original method
          return originalMethod.apply(this, args);
        }
      };

      return descriptor;
    };
  }

  /**
   * Invalidate cache by pattern
   */
  static async invalidatePattern(pattern: string): Promise<number> {
    try {
      // This is a simplified implementation - in production you might want to use SCAN
      return 0;
    } catch (error) {
      console.error(`Failed to invalidate pattern: ${pattern}`, error);
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

      console.log(`Invalidated cache for user: ${userId}`);
    } catch (error) {
      console.error(`Failed to invalidate user cache: ${userId}`, error);
    }
  }

  /**
   * Invalidate data cache
   */
  static async invalidateDataCache(type?: string): Promise<void> {
    try {
      if (type === "departments") {
        await redisService.delete(this.cachePatterns.data.departments());
      } else if (type === "designations") {
        await redisService.delete(this.cachePatterns.data.designations());
      } else if (type === "employees") {
        // Invalidate all employee caches
        await redisService.invalidateByNamespace("data:employees");
      } else if (type === "reports") {
        // Invalidate all report caches
        await redisService.invalidateByNamespace("data:reports");
      } else {
        // Invalidate all data caches
        await redisService.invalidateByNamespace("data");
      }

      console.log(`Invalidated data cache: ${type || "all"}`);
    } catch (error) {
      console.error(`Failed to invalidate data cache: ${type}`, error);
    }
  }

  /**
   * Warm up cache with frequently accessed data
   */
  static async warmupCache(): Promise<void> {
    try {
      console.log("Starting cache warmup...");

      // Add your warmup logic here
      // Example: Pre-load departments, designations, etc.

      console.log("Cache warmup completed");
    } catch (error) {
      console.error("Cache warmup failed", error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getStats() {
    try {
      return await redisService.getStats();
    } catch (error) {
      console.error("Failed to get cache stats", error);
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
      console.error("Cache health check failed", error);
      return false;
    }
  }
}

// Export commonly used patterns
export const cachePatterns = RedisCacheHelper.patterns;
export const cacheDecorator = RedisCacheHelper.cache;
export const invalidateUserCache =
  RedisCacheHelper.invalidateUserCache.bind(RedisCacheHelper);
export const invalidateDataCache =
  RedisCacheHelper.invalidateDataCache.bind(RedisCacheHelper);
export const warmupCache = RedisCacheHelper.warmupCache.bind(RedisCacheHelper);

export default RedisCacheHelper;
