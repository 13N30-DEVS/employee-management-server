import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyEmail } from '@interactors';
import { handleResponse, Logger, responseType } from '@helpers';
import { postRequestInfo } from '@mappers';

/**
 * Verifies whether a user with the given email ID exists.
 * If the email ID is already registered, returns a conflict response.
 * If the email ID is available, returns an OK response.
 * If there is an error checking the email ID, returns an Internal Server Error response.
 * @param {FastifyRequest} request - The request object containing the email ID in the body.
 * @param {FastifyReply} reply - The reply object to send the response.
 */
export async function verifyEmailHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { emailId } = postRequestInfo(request);

    const exists = await verifyEmail(emailId);

    if (exists) {
      return handleResponse(request, reply, responseType.CONFLICT, {
        error: { message: responseType.CONFLICT },
      });
    }
    return handleResponse(request, reply, responseType.OK, {
      data: { message: responseType.OK },
    });
  } catch (error: any) {
    Logger.error(error.message, error);
    return handleResponse(request, reply, responseType.INTERNAL_SERVER_ERROR, {
      error: {
        message: responseType.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
