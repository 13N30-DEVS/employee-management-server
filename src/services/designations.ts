import { Logger } from '@helpers';
import { master_designation } from '@models';
import { Op } from 'sequelize';

interface FindAllOptions {
  search: string;
  offset: number;
  limit: number;
}

/**
 * A class representing a service for managing master designations.
 *
 * @class Designation
 * @static
 * @throws {Error} Throws an error if there's an issue with constructing the query.
 */
class Designation {
  /**
   * Retrieves a list of master designations based on the given search query and pagination options.
   *
   * @param {FindAllOptions} options - An object containing the search query and pagination options.
   * @returns {Promise<{DesignationResult: master_designation[]; totalCount: number}>} - A promise that resolves to an object containing the list of master designations and the total count of master designations.
   * @throws {Error} Throws an error if there's an issue with constructing the query.
   */
  static async findAll(
    options: FindAllOptions
  ): Promise<{ DesignationResult: master_designation[]; totalCount: number }> {
    try {
      const { search, offset, limit } = options;

      const { count, rows: masterDesignations } = await master_designation.findAndCountAll({
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
        DesignationResult: masterDesignations ?? [],
        totalCount: count,
      };
    } catch (error: any) {
      Logger.error(error.message, error);
      throw new Error(error.message);
    }
  }
}

export { Designation };
