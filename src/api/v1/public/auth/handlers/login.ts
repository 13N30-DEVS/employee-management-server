import { FastifyReply, FastifyRequest } from 'fastify';
import { handleResponse, responseType } from '@helpers';
import { SignIn } from '@interactors';
import { postRequestInfo } from '@mappers';
import { AuthenticatedFastifyInstance } from '@types';

/**
 * Handles the signin request, validates the request body using Zod schema,
 * calls the `SignIn` interactor to generate an authentication token, and returns the token
 * in the response. Uses standardized error handling for consistent responses.
 *
 * @param request - The request object containing the emailId and password.
 * @param reply - The reply object to send the response.
 * @param fastify - The Fastify instance to pass to the `SignIn` interactor.
 *
 * @returns A promise that resolves to a response object with the authentication token.
 */
export async function signIn(
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: AuthenticatedFastifyInstance
) {
  const { emailId, password } = postRequestInfo(request);
  const payload = { emailId, password };

  // Call SignIn function
  const result = await SignIn(payload, fastify);

  // Return successful response
  return handleResponse(request, reply, responseType?.OK, { data: result });
}
