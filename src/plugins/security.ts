import fp from 'fastify-plugin';
import { FastifyRequest, FastifyReply } from 'fastify';
import { Logger } from '@helpers';
import { constants } from '@config';

export default fp(async fastify => {
  // Security middleware
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Add security headers
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('X-XSS-Protection', '1; mode=block');
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    reply.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Remove server information
    reply.header('Server', '');

    // Log security events
    if (request.headers['x-forwarded-for'] || request.headers['x-real-ip']) {
      Logger.security(request, 'Proxied request detected', {
        forwardedFor: request.headers['x-forwarded-for'],
        realIp: request.headers['x-real-ip'],
        originalIp: request.ip,
      });
    }
  });

  // Request size limiting
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const contentLength = parseInt(request.headers['content-length'] || '0');
    const maxSize = constants.FILE_CONSTANTS.MAX_SIZE;

    if (contentLength > maxSize) {
      Logger.warning(request, `Request size limit exceeded: ${contentLength} bytes`);
      return reply.code(413).send({
        error: 'Payload Too Large',
        message: 'Request body exceeds maximum allowed size',
        maxSize: maxSize,
      });
    }
  });

  // SQL Injection protection
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const suspiciousPatterns = [
      /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/i,
      /\b(script|javascript|vbscript|onload|onerror|onclick)\b/i,
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    ];

    const checkValue = (value: any): boolean => {
      if (typeof value === 'string') {
        return suspiciousPatterns.some(pattern => pattern.test(value));
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(checkValue);
      }
      return false;
    };

    const hasSuspiciousContent =
      checkValue(request.body) || checkValue(request.query) || checkValue(request.params);

    if (hasSuspiciousContent) {
      Logger.security(request, 'Potential SQL injection attempt detected', {
        body: request.body,
        query: request.query,
        params: request.params,
        ip: request.ip,
      });

      return reply.code(400).send({
        error: 'Bad Request',
        message: 'Request contains potentially malicious content',
      });
    }
  });

  // Rate limiting per user (if authenticated)
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user) {
      const userId = (request.user as any).id;
      const key = `user:${userId}:${request.url}`;

      // Simple in-memory rate limiting (consider using Redis in production)
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute

      if (!fastify.rateLimitStore) {
        fastify.rateLimitStore = new Map();
      }

      const userRequests = fastify.rateLimitStore.get(key) || [];
      const recentRequests = userRequests.filter(time => now - time < windowMs);

      if (recentRequests.length >= constants.SECURITY_CONSTANTS.RATE_LIMIT.USER_MAX_REQUESTS) {
        Logger.warning(request, `User rate limit exceeded for user ${userId}`);
        return reply.code(429).send({
          error: 'Too Many Requests',
          message: 'User rate limit exceeded',
        });
      }

      recentRequests.push(now);
      fastify.rateLimitStore.set(key, recentRequests);
    }
  });

  // Log all requests for security monitoring
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const responseTime = reply.getResponseTime();

    Logger.info(request, `Request completed with status ${reply.statusCode} in ${responseTime}ms`);

    // Log security-relevant responses
    if (reply.statusCode >= 400) {
      Logger.warning(
        request,
        `Request failed with status ${reply.statusCode} in ${responseTime}ms`
      );
    }
  });
});

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    rateLimitStore?: Map<string, number[]>;
  }
}
