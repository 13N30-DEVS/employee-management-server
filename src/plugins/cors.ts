import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '@config';

export default fp(async fastify => {
  const corsOptions = {
    origin:
      env.NODE_ENV === 'production'
        ? [env.FRONT_END_URL] // Restrict to specific origin in production
        : true, // Allow all origins in development
    credentials: env.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'Cache-Control',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  };

  fastify.register(cors, corsOptions);
});
