import { Logger } from '@helpers';
import { master_designation as designation } from '@models';
import { Designation } from '@services';

interface Payload {
  offset?: number;
  limit?: number;
  search?: string;
}

/**
 * Retrieves a list of designations with pagination and search capabilities.
 *
 * @param {Payload} options - An object containing pagination and search options.
 *   - offset: The starting number of the page (default is 0).
 *   - limit: The number of items per page (default is 10).
 *   - search: The search query to filter the designations (default is "").
 *
 * @returns {Promise<{page: designation[], count: number, totalCount: number}>} - A promise that resolves to an object containing the list of designations, the count of designations in the page, and the total count of designations.
 *
 * @throws {Error} Throws an error if there's an issue with constructing the query.
 */
export const getDesignations = async (
  options: Payload
): Promise<{ page: designation[]; count: number; totalCount: number }> => {
  try {
    const { offset = 0, limit = 10, search = '' } = options;

    const { DesignationResult, totalCount } = await Designation.findAll({
      search,
      offset,
      limit,
    });

    return {
      page: DesignationResult,
      count: DesignationResult?.length,
      totalCount,
    };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error(error.message);
  }
};
