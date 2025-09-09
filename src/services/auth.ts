import {
  employee_information,
  master_user_role,
  master_user_status,
  user,
  workspace,
  workspace_department,
  workspace_designation,
  workspace_shift,
} from '@models';
import { Transaction } from 'sequelize';

// Input interfaces
interface FindByEmailId {
  emailId: string;
}

interface CreateWorkspace {
  id: string;
  workspaceName: string;
  workspaceLogo: string;
  createdBy: string | undefined;
  updatedBy: string | undefined;
}

interface CreateUser {
  id: string;
  emailId: string;
  passwordHash: string;
  role: number;
  status: number;
}

interface CreateEmployeeInformation {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  emailId: string;
  createdBy: string | undefined;
  updatedBy: string | undefined;
}

interface CreateWorkspaceDepartment {
  id: string;
  workspaceId: string;
  departmentId: number;
  createdBy: string | undefined;
  updatedBy: string | undefined;
}

interface CreateWorkspaceDesignation {
  id: string;
  workspaceId: string;
  designationId: number;
  createdBy: string | undefined;
  updatedBy: string | undefined;
}

interface CreateWorkspaceShift {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  createdBy: string | undefined;
  updatedBy: string | undefined;
}

// Return type interfaces
interface UserData {
  id: string;
  email_id?: string;
  password_hash?: string;
  role_master_user_role?: {
    id: number;
    name: string;
  };
  status_master_user_status?: {
    id: number;
    name: string;
  };
  employee_informations?: Array<{
    workspace_id: string;
    workspace?: {
      id: string;
      workspace_name: string;
    };
  }>;
}

interface WorkspaceData {
  id: string;
  workspace_name?: string;
  workspace_logo?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

interface EmployeeInformationData {
  id: string;
  user_id: string;
  workspace_id?: string;
  name?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

interface WorkspaceDepartmentData {
  id: string;
  workspace_id?: string;
  department_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

interface WorkspaceDesignationData {
  id: string;
  workspace_id?: string;
  designation_id?: number;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

interface WorkspaceShiftData {
  id: string;
  workspace_id?: string;
  name?: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

class Auth {
  /**
   * Finds a user by their email ID.
   *
   * @param {FindByEmailId} options - An object containing the email ID of the user to find.
   * @returns {Promise<UserData | null>} - A promise that resolves to the user object with selected attributes or null if not found.
   * @throws {Error} - Throws an error if the query fails.
   */
  static async findByEmailId(options: FindByEmailId): Promise<UserData | null> {
    try {
      const { emailId } = options;

      const userData = await user.findOne({
        attributes: ['id', 'email_id', 'password_hash'],
        include: [
          {
            attributes: ['id', 'name'],
            required: false,
            model: master_user_role,
            as: 'role_master_user_role',
          },
          {
            attributes: ['id', 'name'],
            required: false,
            model: master_user_status,
            as: 'status_master_user_status',
          },
          {
            attributes: ['workspace_id'],
            required: false,
            model: employee_information,
            as: 'employee_informations',
            include: [
              {
                attributes: ['id', 'workspace_name'],
                required: false,
                model: workspace,
                as: 'workspace',
              },
            ],
          },
        ],
        where: { email_id: emailId },
      });

      return userData ? userData.toJSON() : null;
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new workspace.
   *
   * @param {CreateWorkspace} options - Workspace creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<WorkspaceData>} - A promise that resolves to the created workspace.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createWorkspace(
    options: CreateWorkspace,
    transaction: Transaction
  ): Promise<WorkspaceData> {
    try {
      const { id, workspaceName, workspaceLogo, createdBy, updatedBy } = options;

      const workspaceData = await workspace.create(
        {
          id,
          workspace_name: workspaceName,
          workspace_logo: workspaceLogo,
          created_by: createdBy,
          updated_by: updatedBy,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: true,
          is_deleted: false,
        },
        { transaction }
      );

      return workspaceData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUser} options - User creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<UserData>} - A promise that resolves to the created user.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createUser(options: CreateUser, transaction: Transaction): Promise<UserData> {
    try {
      const { id, emailId, passwordHash, role, status } = options;

      const userData = await user.create(
        {
          id,
          email_id: emailId,
          password_hash: passwordHash,
          role,
          status,
          created_at: new Date(),
          is_active: true,
        },
        { transaction }
      );

      return userData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates new employee information.
   *
   * @param {CreateEmployeeInformation} options - Employee information creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<EmployeeInformationData>} - A promise that resolves to the created employee information.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createEmployeeInformation(
    options: CreateEmployeeInformation,
    transaction: Transaction
  ): Promise<EmployeeInformationData> {
    try {
      const { id, userId, workspaceId, name, emailId, createdBy, updatedBy } = options;

      const employeeInfoData = await employee_information.create(
        {
          id,
          user_id: userId,
          workspace_id: workspaceId,
          name,
          email: emailId,
          created_by: createdBy,
          updated_by: updatedBy,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: true,
          is_deleted: false,
        },
        { transaction }
      );

      return employeeInfoData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new workspace department mapping.
   *
   * @param {CreateWorkspaceDepartment} options - Workspace department creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<WorkspaceDepartmentData>} - A promise that resolves to the created workspace department.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createWorkspaceDepartment(
    options: CreateWorkspaceDepartment,
    transaction: Transaction
  ): Promise<WorkspaceDepartmentData> {
    try {
      const { id, workspaceId, departmentId, createdBy, updatedBy } = options;

      const workspaceDeptData = await workspace_department.create(
        {
          id,
          workspace_id: workspaceId,
          department_id: departmentId,
          created_by: createdBy,
          updated_by: updatedBy,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: true,
          is_deleted: false,
        },
        { transaction }
      );

      return workspaceDeptData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new workspace designation mapping.
   *
   * @param {CreateWorkspaceDesignation} options - Workspace designation creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<WorkspaceDesignationData>} - A promise that resolves to the created workspace designation.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createWorkspaceDesignation(
    options: CreateWorkspaceDesignation,
    transaction: Transaction
  ): Promise<WorkspaceDesignationData> {
    try {
      const { id, workspaceId, designationId, createdBy, updatedBy } = options;

      const workspaceDesigData = await workspace_designation.create(
        {
          id,
          workspace_id: workspaceId,
          designation_id: designationId,
          created_by: createdBy,
          updated_by: updatedBy,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: true,
          is_deleted: false,
        },
        { transaction }
      );

      return workspaceDesigData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }

  /**
   * Creates a new workspace shift.
   *
   * @param {CreateWorkspaceShift} options - Workspace shift creation data.
   * @param {Transaction} transaction - Sequelize transaction object.
   * @returns {Promise<WorkspaceShiftData>} - A promise that resolves to the created workspace shift.
   * @throws {Error} - Throws an error if the creation fails.
   */
  static async createWorkspaceShift(
    options: CreateWorkspaceShift,
    transaction: Transaction
  ): Promise<WorkspaceShiftData> {
    try {
      const { id, workspaceId, name, description, startTime, endTime, createdBy, updatedBy } =
        options;

      const workspaceShiftData = await workspace_shift.create(
        {
          id,
          workspace_id: workspaceId,
          name,
          description,
          start_time: startTime,
          end_time: endTime,
          created_by: createdBy,
          updated_by: updatedBy,
          created_at: new Date(),
          updated_at: new Date(),
          is_active: true,
          is_deleted: false,
        },
        { transaction }
      );

      return workspaceShiftData.toJSON();
    } catch (error: any) {
      console.error('Auth service error:', error.message, error);
      throw new Error(error.message);
    }
  }
}

export { Auth };
