import { Logger } from '@helpers';
import { master_department } from '@models';
import { Op } from 'sequelize';

interface FindAllOptions {
  search: string;
  offset: number;
  limit: number;
}

/**
 * A class representing a database query to retrieve master department information.
 *
 * @class Department
 * @static
 * @throws {Error} Throws an error if there's an issue with constructing the query.
 */
class Department {
  /**
   * Retrieves a list of master departments based on the given search query.
   *
   * @param {FindAllOptions} options - An object containing the search query and pagination options.
   * @returns {Promise<{DepartmentResult: master_department[]; totalCount: number}>} - A promise that resolves to an object containing the list of master departments and the total count of master departments.
   * @throws {Error} Throws an error if there's an issue with constructing the query.
   */
  static async findAll(
    options: FindAllOptions
  ): Promise<{ DepartmentResult: master_department[]; totalCount: number }> {
    try {
      const { search, offset, limit } = options;

      const { count, rows: masterDepartments } = await master_department.findAndCountAll({
        attributes: ['id', 'name', 'description'],
        order: [['id', 'ASC']],
        where: search
          ? {
              [Op.and]: [{ name: { [Op.iLike]: `%${search}%` } }, { is_active: true }],
            }
          : { is_active: true },
        limit,
        offset,
      });

      return {
        DepartmentResult: masterDepartments ?? [],
        totalCount: count,
      };
    } catch (error: any) {
      console.error('Departments service error:', error.message, error);
      throw new Error(error.message);
    }
  }
}

export { Department };
