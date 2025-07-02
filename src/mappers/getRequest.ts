import { FastifyRequest } from "fastify";

interface ExtendFastifyRequest extends FastifyRequest {
  headers: any;
  decodedToken?: any;
  apiKey?: any;
}

/**
 * Extracts query parameters and additional information from a FastifyRequest object.
 *
 * @param {ExtendFastifyRequest} request - The request object containing query parameters and other data.
 * @returns An object containing extracted query parameters such as offset, limit, search, additional properties,
 *          the decoded token, and the request URL.
 * @throws Throws an error if there's an issue with extracting the information.
 */
function queryRequestInfo(request: ExtendFastifyRequest) {
  try {
    // For Get Request
    const { url } = request;
    const {
      offset = 0,
      limit = 5,
      search = "",
      ...rest
    } = request.query as {
      offset?: number;
      limit?: number;
      search?: string;
      [key: string]: any;
    };

    const decodedToken: any = request.decodedToken;

    return {
      offset,
      limit,
      search,
      ...rest,
      decodedToken,
      url,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

export { queryRequestInfo };
