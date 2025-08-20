import { FastifyReply, FastifyRequest } from 'fastify';
import { handleResponse, responseType } from '@helpers';
import { SignUp } from '@interactors';
import { postRequestInfo } from '@mappers';
import { AuthenticatedFastifyInstance } from '@types';

interface shifts {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
}

interface SignUpType {
  emailId: string;
  workspaceName: string;
  adminName: string;
  workspaceLogo: string;
  password: string;
  role: number;
  departments: number[];
  designations: number[];
  shifts: shifts[];
}

export async function signUp(
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: AuthenticatedFastifyInstance
) {
  const { emailId, password, ...rest } = postRequestInfo(request);
  const payload = { emailId, password, ...rest };

  // Call SignUp function
  const result = await SignUp(payload as SignUpType, fastify);

  // Return successful response
  return handleResponse(request, reply, responseType?.OK, { data: result });
}
