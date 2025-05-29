import { FastifyReply, FastifyRequest } from "fastify";

import { queryRequestInfo } from "@mappers";
import { getDepartments } from "@interactors";
import { Logger, handleResponse, responseType } from "@helpers";
import { preparePagination } from "@serializers";

/**
 * Handles the request to retrieve all departments with pagination and search capabilities.
 *
 * @param {FastifyRequest} request - The incoming request object, containing query parameters for pagination and search.
 * @param {FastifyReply} reply - The reply object used to send the response back to the client.
 *
 * @returns {Promise<void>} - Sends a paginated list of departments as a response or an error message in case of failure.
 *
 * The function extracts query parameters from the request, calls the `getDepartments` interactor
 * to fetch the department data, and prepares the paginated response using `preparePagination`.
 * It then sends the response using the `handleResponse` helper. If an error occurs during the process,
 * it logs the error and sends an appropriate error response.
 */
export async function GET_ALL(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // -----------------------------
    //  MAPPER
    // -----------------------------
    const { url, search, offset, limit } = queryRequestInfo(request);
    // -----------------------------
    //  INTERACTOR
    // -----------------------------
    const result = await getDepartments({
      search,
      offset,
      limit,
    });
    // -----------------------------
    //  SERIALIZER
    // -----------------------------
    const data = preparePagination({
      result,
      url,
      offset,
      limit,
    });
    // -----------------------------
    //  RESPONSE
    // -----------------------------
    return handleResponse(request, reply, responseType?.OK, {
      data,
    });
  } catch (error: any) {
    Logger.error(request, error.message, error);
    return handleResponse(request, reply, responseType?.INTERNAL_SERVER_ERROR, {
      error: {
        message: responseType?.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
