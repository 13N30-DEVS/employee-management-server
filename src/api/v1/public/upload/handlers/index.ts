import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from '@services';

/**
 * Handles public workspace logo upload without authentication
 */
async function uploadWorkspaceLogo(request: FastifyRequest, reply: FastifyReply) {
  return UploadService.uploadWorkspaceLogo(request, reply);
}

export default { uploadWorkspaceLogo };
