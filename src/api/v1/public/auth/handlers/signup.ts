import { FastifyReply, FastifyRequest } from "fastify";
import { Logger, handleResponse, responseType } from "@helpers";
import { SignUp } from "@interactors";
import { postRequestInfo } from "@mappers";

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

export async function SIGN_UP(
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: any
) {
  try {
    const { emailId, password, ...rest } = postRequestInfo(request);
    const payload = { emailId, password, ...rest };

    // Call SignUp function
    const result = await SignUp(payload as SignUpType, fastify);

    // Return successful response
    return handleResponse(request, reply, responseType?.OK, { data: result });
  } catch (error: any) {
    console.log("error:", error);
    Logger.error(request, error.message, error);

    // If error contains a statusCode, use it. Otherwise, return a generic internal error.
    if (error?.statusCode === 401) {
      return handleResponse(request, reply, responseType?.UNAUTHORIZED, {
        error: { message: error.message },
      });
    } else if (error?.statusCode === 403) {
      return handleResponse(request, reply, responseType?.FORBIDDEN, {
        error: { message: error.message },
      });
    } else if (error?.statusCode === 404) {
      return handleResponse(request, reply, responseType?.NOT_FOUND, {
        error: { message: error.message },
      });
    } else if (error?.statusCode === 409) {
      return handleResponse(request, reply, responseType?.CONFLICT, {
        error: { message: error.message },
      });
    } else {
      return handleResponse(
        request,
        reply,
        responseType?.INTERNAL_SERVER_ERROR,
        {
          error: { message: "Internal Server Error" },
        }
      );
    }
  }
}
