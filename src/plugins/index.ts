import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

// Plugin registration order is important
// 1. Core plugins (helmet, cors, etc.)
// 2. JWT plugin (provides authentication)
// 3. Redis plugin (provides caching)
// 4. Feature plugins (cache, health, security)

export default fp(async (fastify: FastifyInstance) => {
  // Register plugins in the correct order
  await fastify.register(import('./helmet'));
  await fastify.register(import('./cors'));
  await fastify.register(import('./sensible'));
  await fastify.register(import('./multipart'));
  await fastify.register(import('./jwt')); // Must be before cache/health
  await fastify.register(import('./redis')); // Redis service
  await fastify.register(import('./ratelimit'));
  await fastify.register(import('./sequelize'));
  await fastify.register(import('./swagger'));

  // Feature plugins that may depend on JWT
  await fastify.register(import('./cache'));
  await fastify.register(import('./health'));
  await fastify.register(import('./security'));
});
