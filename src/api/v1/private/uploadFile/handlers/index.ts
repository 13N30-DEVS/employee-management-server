import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from '@services';

/**
 * Handles private file upload with authentication and workspace validation
 */
async function UploadFile(request: FastifyRequest, reply: FastifyReply) {
  return UploadService.uploadPrivateFile(request, reply);
}

export default { UploadFile };
