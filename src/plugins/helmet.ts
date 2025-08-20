import fp from 'fastify-plugin';
import helmet from '@fastify/helmet';
import { env } from '@config';

export default fp(async fastify => {
  const helmetOptions = {
    contentSecurityPolicy: env.NODE_ENV === 'production',
    hsts: env.NODE_ENV === 'production',
    noSniff: true,
    referrerPolicy: false,
    frameguard: false,
    xssFilter: true,
    hidePoweredBy: true,
    ieNoOpen: true,
    permittedCrossDomainPolicies: false,
  };

  fastify.register(helmet, helmetOptions);
});
