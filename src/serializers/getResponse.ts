import { Logger, pagination } from '@helpers';

interface GetServicePayload {
  result: {
    page: Array<object>;
    count: number;
    totalCount: number;
  };
  url: string;
  offset: number;
  limit: number;
}

/**
 * Represents the structure of the paginated response for a GET service.
 */
interface GetServiceResponse {
  page: Array<object>;
  count?: number;
  limit?: number;
  offset?: number;
  totalPages?: number;
  totalCount?: number;
  previousPage?: number | null;
  currentPage?: number;
  nextPage?: number | null;
  previousPageLink?: string | null;
  currentPageLink?: string;
  nextPageLink?: string | null;
  firstPageLink?: string;
  lastPageLink?: string;
}

/**
 * Formats the response of a GET service or endpoint.
 *
 * @param {GetServicePayload} options - The response object containing paginated information.
 * @returns {GetServiceResponse} An object containing extracted parameters related to pagination.
 * @throws {Error} Throws an error if there's an issue extracting parameters from the response.
 */
function preparePagination(options: GetServicePayload): GetServiceResponse {
  try {
    const {
      result: { page, count, totalCount },
      url,
      offset,
      limit,
    } = options;

    const paginationResult = pagination({
      offset,
      limit,
      totalCount,
      url,
    });

    return {
      page,
      count,
      ...paginationResult,
    };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error('Failed to extract pagination parameters from the response.');
  }
}

export { preparePagination };
