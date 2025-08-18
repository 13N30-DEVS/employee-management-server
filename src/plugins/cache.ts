import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Logger } from "@helpers";

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
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
  private tagIndex = new Map<string, Set<string>>();

  set(key: string, data: any, ttl: number = 300000, tags: string[] = []): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
    };

    this.cache.set(key, entry);

    // Index by tags for invalidation
    tags.forEach((tag) => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });

    // Cleanup expired entries
    this.cleanup();
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      // Remove from tag index
      entry.tags.forEach((tag) => {
        const keys = this.tagIndex.get(tag);
        if (keys) {
          keys.delete(key);
          if (keys.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      });
    }
    return this.cache.delete(key);
  }

  invalidateByTag(tag: string): void {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      keys.forEach((key) => this.cache.delete(key));
      this.tagIndex.delete(tag);
    }
  }

  clear(): void {
    this.cache.clear();
    this.tagIndex.clear();
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
    return {
      size: this.cache.size,
      tagCount: this.tagIndex.size,
    };
  }
}

const memoryCache = new MemoryCache();

export default fp(async (fastify: FastifyInstance) => {
  // Decorate fastify with cache methods
  fastify.decorate("cache", {
    get: (key: string) => memoryCache.get(key),
    set: (key: string, data: any, options?: CacheOptions) => {
      const ttl = options?.ttl || 300000; // Default 5 minutes
      const tags = options?.tags || [];
      memoryCache.set(key, data, ttl, tags);
    },
    delete: (key: string) => memoryCache.delete(key),
    invalidateByTag: (tag: string) => memoryCache.invalidateByTag(tag),
    clear: () => memoryCache.clear(),
    stats: () => memoryCache.stats(),
  });

  // Cache middleware
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const cacheKey = request.url;
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
          // Use the cache.set method with options
          fastify.cache.set(cacheKey, payload, { ttl: 300000, tags: ["api"] });
          Logger.debug(request, `Cached response for ${cacheKey}`);
        }
        return originalSend.call(this, payload);
      };
    }
  );

  // Cache invalidation endpoint (protected if authentication is available)
  fastify.get(
    "/admin/cache/stats",
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              size: { type: "number" },
              tagCount: { type: "number" },
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
    "/admin/cache/clear",
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        body: {
          type: "object",
          properties: {
            tag: { type: "string" },
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
        Logger.info(request, "Cache cleared");
        return reply.send({ message: "Cache cleared" });
      }
    }
  );

  // Periodic cache cleanup
  setInterval(() => {
    memoryCache.cleanup();
  }, 60000); // Cleanup every minute

  // Log initialization without request context
  console.log("Cache plugin initialized");
});

// Extend FastifyInstance interface
declare module "fastify" {
  interface FastifyInstance {
    cache: {
      get: (key: string) => any | null;
      set: (key: string, data: any, options?: CacheOptions) => void;
      delete: (key: string) => boolean;
      invalidateByTag: (tag: string) => void;
      clear: () => void;
      stats: () => { size: number; tagCount: number };
    };
  }
}
