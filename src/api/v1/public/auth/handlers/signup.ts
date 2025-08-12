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

    // Handle specific error types with proper error responses
    if (error?.statusCode === 400) {
      return handleResponse(request, reply, responseType?.BAD_REQUEST, {
        error: { message: error.message || "Bad Request" },
      });
    } else if (error?.statusCode === 401) {
      return handleResponse(request, reply, responseType?.UNAUTHORIZED, {
        error: { message: error.message || "Unauthorized" },
      });
    } else if (error?.statusCode === 403) {
      return handleResponse(request, reply, responseType?.FORBIDDEN, {
        error: { message: error.message || "Forbidden" },
      });
    } else if (error?.statusCode === 404) {
      return handleResponse(request, reply, responseType?.NOT_FOUND, {
        error: { message: error.message || "Not Found" },
      });
    } else if (error?.statusCode === 409) {
      return handleResponse(request, reply, responseType?.CONFLICT, {
        error: { message: error.message || "Conflict" },
      });
    } else if (error?.statusCode === 422) {
      return handleResponse(
        request,
        reply,
        responseType?.UNPROCESSABLE_ENTITY,
        {
          error: { message: error.message || "Validation Error" },
        }
      );
    } else {
      // Handle foreign key constraint violations and other database errors
      let errorMessage = "Internal Server Error";

      return handleResponse(
        request,
        reply,
        responseType?.INTERNAL_SERVER_ERROR,
        {
          error: { message: errorMessage },
        }
      );
    }
  }
}
