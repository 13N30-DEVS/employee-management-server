import { FastifyReply, FastifyRequest } from "fastify";
import { Logger, handleResponse, responseType } from "@helpers";
import { SignIn } from "@interactors";
import { postRequestInfo } from "@mappers";

interface signInType {
  emailId: string;
  password: string;
}

// Sign In
export async function SIGN_IN(
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: any
) {
  try {
    const { emailId, password } = postRequestInfo(request);
    const payload = { emailId, password };

    // Call SignIn function
    const result = await SignIn(payload as signInType, fastify);

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
