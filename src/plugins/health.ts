import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  services: {
    database: 'healthy' | 'unhealthy';
    redis: 'healthy' | 'unhealthy';
    memory: 'healthy' | 'unhealthy';
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  version: string;
}

export default fp(async (fastify: FastifyInstance) => {
  // Health check endpoint
  fastify.get('/health', async (): Promise<HealthStatus> => {
    // Check database health
    let dbStatus: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      if (fastify.sequelize) {
        await fastify.sequelize.authenticate();
        dbStatus = 'healthy';
      }
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Check Redis health
    let redisStatus: 'healthy' | 'unhealthy' = 'unhealthy';
    try {
      if (fastify.redis) {
        await fastify.redis.ping();
        redisStatus = 'healthy';
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    const memoryStatus: 'healthy' | 'unhealthy' = memoryPercentage < 90 ? 'healthy' : 'unhealthy';

    // Determine overall status
    const overallStatus: 'ok' | 'error' =
      dbStatus === 'healthy' && redisStatus === 'healthy' && memoryStatus === 'healthy'
        ? 'ok'
        : 'error';

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        memory: memoryStatus,
      },
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage * 100) / 100,
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    // Set appropriate status code
    if (overallStatus === 'error') {
      fastify.log.warn('Health check failed', healthStatus);
    }

    return healthStatus;
  });

  // Detailed health check endpoint
  fastify.get('/health/detailed', async () => {
    const detailedHealth = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      pid: process.pid,
      title: process.title,
      argv: process.argv,
      execPath: process.execPath,
      cwd: process.cwd(),
    };

    return detailedHealth;
  });

  // Readiness probe for Kubernetes
  fastify.get('/ready', async (request, reply) => {
    try {
      // Check if database is ready
      if (fastify.sequelize) {
        await fastify.sequelize.authenticate();
      }

      // Check if Redis is ready
      if (fastify.redis) {
        await fastify.redis.ping();
      }

      reply.status(200).send({ status: 'ready' });
    } catch (error) {
      reply.status(503).send({
        status: 'not ready',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Liveness probe for Kubernetes
  fastify.get('/live', async (request, reply) => {
    reply.status(200).send({ status: 'alive' });
  });
});
