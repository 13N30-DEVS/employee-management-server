import { env } from "@config";
import * as url from "url";
import { Logger } from "@helpers";

interface PaginationResult {
  limit: number;
  offset: number | undefined;
  totalPages: number;
  totalCount: number;
  previousPage: number | null;
  currentPage: number;
  nextPage: number | null;
  previousPageLink: string | null;
  currentPageLink: string;
  nextPageLink: string | null;
  firstPageLink: string;
  lastPageLink: string;
}

interface LinkResult {
  previousPageLink: string | null;
  currentPageLink: string;
  nextPageLink: string | null;
  firstPageLink: string;
  lastPageLink: string;
}

/**
 * Generates a new URL by updating or setting the "offset" and "limit" query parameters.
 * @param newOffset - The new value for the "offset" query parameter.
 * @param baseUrl - The base URL to be parsed and modified.
 * @param newLimit - The new value for the "limit" query parameter.
 * @returns - The updated URL as a string.
 */
function parseLink(
  newOffset: number,
  baseUrl: string,
  newLimit: number
): string {
  try {
    const parsedUrl = new url.URL(baseUrl);

    parsedUrl.searchParams.set("offset", newOffset.toString());
    parsedUrl.searchParams.set("limit", newLimit.toString());

    return parsedUrl.toString();
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error("URL Update Error");
  }
}

/**
 * Generates pagination links based on the provided parameters.
 * @param offset - The starting number of the page.
 * @param baseUrl - The URL for the actual endpoint.
 * @param limit - The number of items per page.
 * @param totalPages - The total number of pages.
 * @returns - An object containing different pagination links.
 */
function generateLinks(
  offset: number,
  baseUrl: string,
  limit: number,
  totalPages: number
): LinkResult {
  try {
    let nextPageNumber = Math.floor(offset / limit) + 1;
    return {
      previousPageLink:
        offset > 0 ? parseLink(offset - limit, baseUrl, limit) : null,
      currentPageLink: parseLink(offset, baseUrl, limit),
      nextPageLink:
        nextPageNumber < totalPages
          ? parseLink(nextPageNumber * limit, baseUrl, limit)
          : null,
      firstPageLink: parseLink(0, baseUrl, limit),
      lastPageLink: parseLink((totalPages - 1) * limit, baseUrl, limit),
    };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error("Page Link Error");
  }
}

/**
 * Generates pagination metadata based on the provided options.
 * @param options - An object containing pagination options.
 *   - offset: The starting number of the page (default is 0).
 *   - page: The page number (if not provided, calculated based on offset and limit).
 *   - limit: The number of items per page.
 *   - totalCount: The total number of items across all pages.
 *   - url: The URL for the actual endpoint.
 * @returns - An object containing pagination metadata.
 */
function pagination<T>(options: {
  offset?: number;
  page?: number;
  limit: number;
  totalCount: number;
  url: string;
}): PaginationResult {
  try {
    let { limit, offset = 0, page, url, totalCount } = options;

    if (!offset) {
      offset = 0;
    }

    if (!page) {
      page = Math.floor(offset / limit) + 1;
    }

    const totalPages = Math.ceil(totalCount / limit);

    const pageUrl = env.FRONT_END_URL + url;

    const paginationLinks = generateLinks(offset, pageUrl, limit, totalPages);

    return {
      limit,
      offset,
      totalPages,
      totalCount,
      previousPage: page == 1 ? null : page - 1,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      ...paginationLinks,
    };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error("Pagination Error");
  }
}

export { pagination, generateLinks };
