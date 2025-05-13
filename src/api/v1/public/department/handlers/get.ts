import { FastifyReply, FastifyRequest } from "fastify";

import { queryRequestInfo } from "@mappers";
import { getDepartments } from "@interactors";
import { Logger, handleResponse, responseType } from "@helpers";
import { preparePagination } from "@serializers";

export async function GET_ALL(request: FastifyRequest, reply: FastifyReply) {
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
