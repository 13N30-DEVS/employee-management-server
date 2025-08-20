import { FastifyPluginAsync } from 'fastify';

import schema from './schema';
import handler from './handlers';

const designations: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', { schema: schema.GET_ALL }, handler.GET_ALL);
};

export default designations;
