import { Logger } from "@helpers";
import { Designation } from "@services";

interface Payload {
  offset?: number;
  limit?: number;
  search?: string;
}

export const getDesignations = async (options: Payload) => {
  try {
    const { offset = 0, limit = 10, search = "" } = options;

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
