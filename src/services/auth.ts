import { Logger } from "@helpers";
import {
  employee_information,
  master_user_role,
  master_user_status,
  user,
  workspace,
} from "@models";

interface FindByEmailId {
  emailId: string;
}

class Auth {
  /**
   * Finds a user by their email ID.
   *
   * @param {FindByEmailId} options - An object containing the email ID of the user to find.
   * @returns {Promise<any>} - A promise that resolves to the user object with selected attributes or null if not found.
   * @throws {Error} - Throws an error if the query fails.
   */
  static async findByEmailId(options: FindByEmailId): Promise<any> {
    try {
      const { emailId } = options;

      const userData = await user.findOne({
        attributes: ["id", "email_id", "password_hash"],
        include: [
          {
            attributes: ["id", "name"],
            required: false,
            model: master_user_role,
            as: "role_master_user_role",
          },
          {
            attributes: ["id", "name"],
            required: false,
            model: master_user_status,
            as: "status_master_user_status",
          },
          {
            attributes: ["workspace_id"],
            required: false,
            model: employee_information,
            as: "employee_informations",
            include: [
              {
                attributes: ["id", "workspace_name"],
                required: false,
                model: workspace,
                as: "workspace",
              },
            ],
          },
        ],
        where: { email_id: emailId },
      });

      return userData ? userData.toJSON() : null; // Using toJSON() instead of stringifying
    } catch (error: any) {
      Logger.error(error.message, error);
      throw new Error(error.message);
    }
  }
}

export { Auth };
