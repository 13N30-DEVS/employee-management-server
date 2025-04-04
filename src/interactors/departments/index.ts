import { Logger } from "@helpers";
import { Department } from "@services";

interface Payload {
  offset?: number;
  limit?: number;
  search?: string;
}

export const getDepartments = async (options: Payload) => {
  try {
    const { offset = 0, limit = 10, search = "" } = options;

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
    Logger.error(error.message, error);
    throw new Error(error.message);
  }
};
