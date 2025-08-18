import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { env } from "@config";

export default fp(async (fastify) => {
  const rateLimitOptions = {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
    allowList: ["127.0.0.1", "::1"], // Allow localhost
    keyGenerator: (request: any) => {
      // Use IP address for rate limiting
      return request.ip;
    },
    errorResponseBuilder: (request: any, context: any) => {
      return {
        code: 429,
        error: "Too Many Requests",
        message: `Rate limit exceeded, retry in ${context.after}`,
        retryAfter: context.after,
      };
    },
    // Different limits for different routes
    skip: (request: any) => {
      // Skip rate limiting for health checks
      return request.url === "/health";
    },
  };

  fastify.register(rateLimit, rateLimitOptions);
});
