import { FastifyPluginCallback, FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { Logger } from '../helpers/logger';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Cache tags for invalidation
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  tags: string[];
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();

  set(key: string, data: any, ttl: number = 300000, tags: string[] = []): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
    };

    this.cache.set(key, entry);
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  invalidateByNamespace(namespace: string): number {
    let count = 0;
    for (const [key] of this.cache.entries()) {
      if (key.startsWith(namespace)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  stats(): { size: number; tagCount: number } {
    const tags = new Set<string>();
    for (const entry of this.cache.values()) {
      entry.tags.forEach(tag => tags.add(tag));
    }

    return {
      size: this.cache.size,
      tagCount: tags.size,
    };
  }
}

const memoryCache = new MemoryCache();

const cachePlugin: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  // Decorate fastify with cache methods
  fastify.decorate('cache', {
    get: (key: string) => memoryCache.get(key),
    set: (key: string, data: any, options?: CacheOptions) => {
      const ttl = options?.ttl || 300000; // Default 5 minutes
      memoryCache.set(key, data, ttl, options?.tags || []);
    },
    delete: (key: string) => memoryCache.delete(key),
    invalidateByTag: (tag: string) => memoryCache.invalidateByTag(tag),
    clear: () => memoryCache.clear(),
    stats: () => memoryCache.stats(),
  });

  // Cache middleware with smart caching based on headers
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const cacheKey = request.url;

    // Check if request explicitly wants fresh data
    const cacheControl = request.headers['cache-control'];
    const pragma = request.headers['pragma'];

    // Skip cache if explicitly requested
    if (cacheControl === 'no-cache' || pragma === 'no-cache') {
      Logger.debug(request, `Cache bypassed for ${cacheKey} - no-cache header`);
      return;
    }

    const cachedResponse = fastify.cache.get(cacheKey);

    if (cachedResponse) {
      Logger.debug(request, `Cache hit for ${cacheKey}`);
      return reply.send(cachedResponse);
    }

    // Store original send method
    const originalSend = reply.send;

    // Override send method to cache successful responses
    reply.send = function (payload: any) {
      if (reply.statusCode === 200 && payload) {
        // Check if response has cache control headers
        const responseCacheControl = reply.getHeader('Cache-Control');

        // Don't cache if response explicitly says no-cache
        if (
          responseCacheControl === 'no-cache' ||
          responseCacheControl === 'no-store' ||
          responseCacheControl === 'private'
        ) {
          Logger.debug(
            request,
            `Cache bypassed for ${cacheKey} - response cache-control: ${responseCacheControl}`
          );
        } else {
          // Smart TTL based on endpoint type
          let ttl = 300000; // Default 5 minutes

          // Longer cache for static data
          if (cacheKey.includes('/departments') || cacheKey.includes('/designations')) {
            ttl = 1800000; // 30 minutes for static data
          }
          // Shorter cache for dynamic data
          else if (cacheKey.includes('/employees') || cacheKey.includes('/users')) {
            ttl = 60000; // 1 minute for user data
          }
          // Very short cache for sensitive data
          else if (cacheKey.includes('/auth') || cacheKey.includes('/login')) {
            ttl = 0; // No cache for auth
          }

          if (ttl > 0) {
            fastify.cache.set(cacheKey, payload, { ttl, tags: ['api'] });
            Logger.debug(request, `Cached response for ${cacheKey} with TTL: ${ttl}ms`);
          }
        }
      }
      return originalSend.call(this, payload);
    };
  });

  // Cache invalidation endpoint (protected if authentication is available)
  fastify.get(
    '/admin/cache/stats',
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              size: { type: 'number' },
              tagCount: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const stats = fastify.cache.stats();
      return reply.send(stats);
    }
  );

  fastify.post(
    '/admin/cache/clear',
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        body: {
          type: 'object',
          properties: {
            tag: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { tag } = request.body as any;

      if (tag) {
        fastify.cache.invalidateByTag(tag);
        Logger.info(request, `Cache invalidated for tag: ${tag}`);
        return reply.send({ message: `Cache invalidated for tag: ${tag}` });
      } else {
        fastify.cache.clear();
        Logger.info(request, 'Cache cleared');
        return reply.send({ message: 'Cache cleared' });
      }
    }
  );

  // Periodic cache cleanup
  setInterval(() => {
    memoryCache.cleanup();
  }, 60000); // Cleanup every minute

  // Log initialization without request context
  const mockRequest = {
    id: 'cache-plugin-init',
    method: 'GET',
    url: '/cache/init',
    headers: { 'user-agent': 'cache-plugin' },
    ip: '127.0.0.1',
    hostname: 'localhost',
    protocol: 'http',
    query: {},
    params: {},
    body: null,
  } as any;
  Logger.info(mockRequest, 'Cache plugin initialized');
};

export default cachePlugin;

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    cache: {
      get: (_key: string) => any | null;
      set: (_key: string, _data: any, _options?: CacheOptions) => void;
      delete: (_key: string) => boolean;
      invalidateByTag: (_tag: string) => void;
      clear: () => void;
      stats: () => { size: number; tagCount: number };
    };
  }
}
