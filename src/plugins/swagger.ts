import swagger, { SwaggerOptions } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

const swaggerPlugin: FastifyPluginCallback<SwaggerOptions> = async (fastify: any) => {
  fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Workforce Management System',
        description: 'API documentation',
        version: '1.0.0',
      },
    },
    exposeRoute: true,
  });
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (_request: any, _reply: any, next: any) {
        next();
      },
      preHandler: function (_request: any, _reply: any, next: () => void) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject: any, _request: any, _reply: any) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
};

export default fp(swaggerPlugin);
