import { FastifyPluginAsync } from 'fastify';

import schema from './schema';
import handlers from './handlers';

const uploads: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post(
    '/workspace-logo',
    { schema: schema.UPLOAD_WORKSPACE_LOGO },
    handlers.uploadWorkspaceLogo
  );
};

export default uploads;
