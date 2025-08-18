import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { testConnection } from "../utils/sequelizeInstance";
import { Logger } from "../helpers/logger";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: {
      status: "healthy" | "unhealthy";
      responseTime?: number;
      error?: string;
    };
    redis: {
      status: "healthy" | "unhealthy";
      responseTime?: number;
      error?: string;
    };
    memory: {
      status: "healthy" | "unhealthy";
      used: number;
      total: number;
      percentage: number;
    };
    disk: {
      status: "healthy" | "unhealthy";
      used: number;
      total: number;
      percentage: number;
    };
  };
}

export default fp(async (fastify: FastifyInstance) => {
  // Health check endpoint
  fastify.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string", enum: ["healthy", "unhealthy"] },
              timestamp: { type: "string" },
              uptime: { type: "number" },
              version: { type: "string" },
              environment: { type: "string" },
              checks: {
                type: "object",
                properties: {
                  database: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      responseTime: { type: "number" },
                      error: { type: "string" },
                    },
                  },
                  redis: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      responseTime: { type: "number" },
                      error: { type: "string" },
                    },
                  },
                  memory: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      used: { type: "number" },
                      total: { type: "number" },
                      percentage: { type: "number" },
                    },
                  },
                  disk: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      used: { type: "number" },
                      total: { type: "number" },
                      percentage: { type: "number" },
                    },
                  },
                },
              },
            },
          },
          503: {
            type: "object",
            properties: {
              status: { type: "string" },
              error: { type: "string" },
              timestamp: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const startTime = Date.now();
      const healthStatus: HealthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        checks: {
          database: { status: "unhealthy" },
          redis: { status: "unhealthy" },
          memory: { status: "unhealthy", used: 0, total: 0, percentage: 0 },
          disk: { status: "unhealthy", used: 0, total: 0, percentage: 0 },
        },
      };

      try {
        // Database health check
        const dbStartTime = Date.now();
        await testConnection();
        const dbResponseTime = Date.now() - dbStartTime;

        healthStatus.checks.database = {
          status: "healthy",
          responseTime: dbResponseTime,
        };

        // Redis health check
        const redisStartTime = Date.now();
        let redisHealthy = false;
        try {
          if (fastify.redis) {
            redisHealthy = await fastify.redis.isHealthy();
          }
        } catch (error) {
          // Redis health check failed
        }
        const redisResponseTime = Date.now() - redisStartTime;

        healthStatus.checks.redis = {
          status: redisHealthy ? "healthy" : "unhealthy",
          responseTime: redisResponseTime,
        };

        // Memory health check
        const memUsage = process.memoryUsage();
        const totalMemory = memUsage.heapTotal;
        const usedMemory = memUsage.heapUsed;
        const memoryPercentage = (usedMemory / totalMemory) * 100;

        healthStatus.checks.memory = {
          status: memoryPercentage < 90 ? "healthy" : "unhealthy",
          used: Math.round(usedMemory / 1024 / 1024), // MB
          total: Math.round(totalMemory / 1024 / 1024), // MB
          percentage: Math.round(memoryPercentage),
        };

        // Disk health check (simplified - you might want to use a proper disk usage library)
        const diskUsage = {
          used: 0, // Implement actual disk usage check
          total: 0,
          percentage: 0,
        };

        healthStatus.checks.disk = {
          status: "healthy", // Simplified for now
          ...diskUsage,
        };

        // Determine overall status
        const allChecksHealthy = Object.values(healthStatus.checks).every(
          (check) => check.status === "healthy"
        );

        healthStatus.status = allChecksHealthy ? "healthy" : "unhealthy";

        const responseTime = Date.now() - startTime;
        Logger.info(request, `Health check completed in ${responseTime}ms`);

        if (healthStatus.status === "healthy") {
          return reply.send(healthStatus);
        } else {
          return reply.code(503).send(healthStatus);
        }
      } catch (error: any) {
        healthStatus.status = "unhealthy";
        if (!healthStatus.checks.database.status) {
          healthStatus.checks.database.error = error.message;
        }

        Logger.error(request, "Health check failed", error);
        return reply.code(503).send(healthStatus);
      }
    }
  );

  // Readiness probe (for Kubernetes)
  fastify.get(
    "/ready",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const dbHealthy = await testConnection();
        let redisHealthy = false;
        try {
          if (fastify.redis) {
            redisHealthy = await fastify.redis.isHealthy();
          }
        } catch (error) {
          // Redis health check failed
        }

        if (dbHealthy && redisHealthy) {
          return reply.send({ status: "ready" });
        } else {
          return reply.code(503).send({
            status: "not ready",
            database: dbHealthy ? "healthy" : "unhealthy",
            redis: redisHealthy ? "healthy" : "unhealthy",
          });
        }
      } catch (error: any) {
        Logger.error(request, "Readiness check failed", error);
        return reply
          .code(503)
          .send({ status: "not ready", error: error.message });
      }
    }
  );

  // Liveness probe (for Kubernetes)
  fastify.get("/live", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: "alive" });
  });

  // Metrics endpoint (protected if authentication is available)
  fastify.get(
    "/metrics",
    {
      preHandler: fastify.authenticate ? [fastify.authenticate] : [],
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              uptime: { type: "number" },
              memory: {
                type: "object",
                properties: {
                  heapUsed: { type: "number" },
                  heapTotal: { type: "number" },
                  external: { type: "number" },
                  rss: { type: "number" },
                },
              },
              process: {
                type: "object",
                properties: {
                  pid: { type: "number" },
                  version: { type: "string" },
                  platform: { type: "string" },
                  arch: { type: "string" },
                },
              },
              redis: {
                type: "object",
                properties: {
                  connected: { type: "boolean" },
                  totalKeys: { type: "number" },
                  lastPing: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const memUsage = process.memoryUsage();

      // Get Redis stats
      let redisStats = { connected: false, totalKeys: 0, lastPing: 0 };
      try {
        if (fastify.redis) {
          const stats = await fastify.redis.getStats();
          redisStats = {
            connected: stats.connected,
            totalKeys: stats.totalKeys,
            lastPing: stats.lastPing,
          };
        }
      } catch (error) {
        Logger.error(request, "Failed to get Redis stats for metrics", error);
      }

      const metrics = {
        uptime: process.uptime(),
        memory: {
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memUsage.external / 1024 / 1024), // MB
          rss: Math.round(memUsage.rss / 1024 / 1024), // MB
        },
        process: {
          pid: process.pid,
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
        redis: redisStats,
      };

      return reply.send(metrics);
    }
  );

  // Log initialization without request context
  console.log("Health check plugin initialized");
});
