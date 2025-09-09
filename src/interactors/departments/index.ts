import { master_department } from '@models';
import { Department } from '@services';

interface Payload {
  offset?: number;
  limit?: number;
  search?: string;
}

/**
 * Retrieves a list of master departments with pagination and search capabilities.
 *
 * @param {Payload} options - An object containing pagination and search options.
 *   - offset: The starting number of the page (default is 0).
 *   - limit: The number of items per page (default is 10).
 *   - search: The search query to filter the master departments (default is "").
 *
 * @returns {Promise<{page: master_department[], count: number, totalCount: number}>} - A promise that resolves to an object containing the list of master departments, the count of master departments in the page, and the total count of master departments.
 *
 * @throws {Error} Throws an error if there's an issue with constructing the query.
 */
export const getDepartments = async (
  options: Payload
): Promise<{
  page: master_department[];
  count: number;
  totalCount: number;
}> => {
  try {
    const { offset = 0, limit = 10, search = '' } = options;

    const { DepartmentResult, totalCount } = await Department.findAll({
      search,
      offset,
      limit,
    });

    return {
      page: DepartmentResult,
      count: DepartmentResult?.length,
      totalCount,
    };
  } catch (error: any) {
    console.error('Departments interactor error:', error.message, error);
    throw new Error(error.message);
  }
};
