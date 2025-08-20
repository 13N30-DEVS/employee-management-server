import fp from 'fastify-plugin';
import { FastifyRequest, FastifyReply } from 'fastify';
import { redisService } from '../services/redis';
import { Logger } from '../helpers/logger';

export default fp(async fastify => {
  // Decorate fastify with Redis service
  fastify.decorate('redis', redisService);

  // Add Redis health check to health endpoint
  fastify.addHook('onReady', async () => {
    try {
      const isHealthy = await redisService.isHealthy();
      if (isHealthy) {
        console.log('Redis service is healthy');
      } else {
        console.warn('Redis service is not healthy');
      }
    } catch (error) {
      console.error('Failed to check Redis health', error);
    }
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    try {
      await redisService.disconnect();
      console.log('Redis service disconnected');
    } catch (error) {
      console.error('Failed to disconnect Redis service', error);
    }
  });

  // Redis management endpoints
  fastify.get(
    '/admin/redis/stats',
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              connected: { type: 'boolean' },
              totalKeys: { type: 'number' },
              memoryUsage: { type: 'object' },
              info: { type: 'object' },
              lastPing: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await redisService.getStats();
        return reply.send(stats);
      } catch (error: any) {
        Logger.error(request, 'Failed to get Redis stats', error);
        return reply.code(500).send({
          error: 'Failed to get Redis stats',
          message: error.message,
        });
      }
    }
  );

  fastify.post(
    '/admin/redis/ping',
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              responseTime: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const startTime = Date.now();
        const isHealthy = await redisService.ping();
        const responseTime = Date.now() - startTime;

        return reply.send({
          success: isHealthy,
          responseTime,
        });
      } catch (error: any) {
        Logger.error(request, 'Redis ping failed', error);
        return reply.code(500).send({
          error: 'Redis ping failed',
          message: error.message,
        });
      }
    }
  );

  fastify.post(
    '/admin/redis/clear',
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        body: {
          type: 'object',
          properties: {
            namespace: { type: 'string' },
            tag: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              deletedCount: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { namespace, tag } = request.body as any;

        if (tag) {
          const deletedCount = await redisService.invalidateByTag(tag);
          Logger.info(request, `Redis cache invalidated for tag: ${tag}`);
          return reply.send({
            success: true,
            message: `Cache invalidated for tag: ${tag}`,
            deletedCount,
          });
        } else if (namespace) {
          const deletedCount = await redisService.invalidateByNamespace(namespace);
          Logger.info(request, `Redis cache invalidated for namespace: ${namespace}`);
          return reply.send({
            success: true,
            message: `Cache invalidated for namespace: ${namespace}`,
            deletedCount,
          });
        } else {
          const success = await redisService.clear();
          Logger.info(request, 'Redis cache cleared');
          return reply.send({
            success,
            message: 'Cache cleared',
            deletedCount: -1, // Unknown count for full clear
          });
        }
      } catch (error: any) {
        Logger.error(request, 'Failed to clear Redis cache', error);
        return reply.code(500).send({
          error: 'Failed to clear cache',
          message: error.message,
        });
      }
    }
  );

  // Log initialization
  console.log('Redis plugin initialized');
});

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    redis: typeof redisService;
  }
}
