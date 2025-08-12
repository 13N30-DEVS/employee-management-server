import { Logger } from "@helpers";
import { Auth } from "@services";
import * as bcrypt from "bcrypt";
import { sequelize } from "@utils";
import { v4 as uuidv4 } from "uuid";

interface SignInPayload {
  emailId: string;
  password: string;
}

interface SignUpPayload {
  emailId: string;
  workspaceName: string;
  adminName: string;
  workspaceLogo: string;
  password: string;
  role: number;
  departments: number[];
  designations: number[];
  shifts: {
    name: string;
    description?: string;
    startTime: string;
    endTime: string;
  }[];
}

// Return type interfaces
interface WorkspaceResponse {
  id: string;
  workspaceName: string | undefined;
  workspaceLogo: string | undefined;
}

interface UserResponse {
  id: string;
  emailId: string | undefined;
}

interface SignUpResponse {
  token: string;
  workspace: WorkspaceResponse;
  user: UserResponse;
}

/**
 * Signs in a user with the provided emailId and password.
 * @param {SignInPayload} options - EmailId and password of the user to sign in.
 * @param {FastifyInstance} fastify - The Fastify instance to use for generating the authentication token.
 * @returns {Promise<{ token: string }>} A promise that resolves to an object with a single property - token, which is the authentication token for the user.
 * @throws {Error} If the user does not exist or the password is incorrect. The error will have a statusCode property set to 404 or 403, respectively.
 */
export const SignIn = async (
  options: SignInPayload,
  fastify: any
): Promise<{ token: string }> => {
  try {
    const { emailId, password } = options;

    const user = await Auth.findByEmailId({ emailId });

    if (!user) {
      const error: any = new Error("User does not exist.");
      error.statusCode = 404;
      throw error;
    }

    if (!user.password_hash) {
      const error: any = new Error("User password hash not found.");
      error.statusCode = 500;
      throw error;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      const error: any = new Error("Incorrect password.");
      error.statusCode = 403;
      throw error;
    }

    // Authentication Token
    const authToken: string = fastify.jwt.sign({
      userId: user.id,
      roleId: user.role_master_user_role?.id,
      roleName: user.role_master_user_role?.name,
      statusId: user.status_master_user_status?.id,
      statusName: user.status_master_user_status?.name,
      workspaceId: user.employee_informations?.[0]?.workspace?.id,
      workspaceName:
        user.employee_informations?.[0]?.workspace?.workspace_name ??
        "Unknown Workspace",
    });

    return { token: authToken };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw error; // Don't wrap it in a new Error, pass original error with statusCode
  }
};

/**
 * Signs up a new user with workspace creation and all related data.
 * @param {SignUpPayload} options - User registration data including workspace, departments, designations, and shifts.
 * @param {FastifyInstance} fastify - The Fastify instance to use for generating the authentication token.
 * @returns {Promise<SignUpResponse>} A promise that resolves to the signup response with token, workspace, and user data.
 * @throws {Error} If the user already exists or any database operation fails.
 */
export const SignUp = async (
  options: SignUpPayload,
  fastify: any
): Promise<SignUpResponse> => {
  const transaction = await sequelize.transaction();

  try {
    const {
      emailId,
      password,
      workspaceName,
      adminName,
      workspaceLogo,
      role,
      departments,
      designations,
      shifts,
    } = options;

    // Check if user already exists
    const existingUser = await Auth.findByEmailId({ emailId });
    if (existingUser) {
      const error: any = new Error("User with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    // 1. Create user FIRST
    const userId = uuidv4();
    const user = await Auth.createUser(
      {
        id: userId,
        emailId,
        passwordHash,
        role,
        status: 1, // Assuming 1 is active status
      },
      transaction
    );

    // 2. Create workspace with the user as creator
    const workspaceId = uuidv4();
    const workspace = await Auth.createWorkspace(
      {
        id: workspaceId,
        workspaceName,
        workspaceLogo,
        createdBy: userId,
        updatedBy: userId,
      },
      transaction
    );

    // 3. Create employee information (admin user as employee)
    const employeeInfoId = uuidv4();
    await Auth.createEmployeeInformation(
      {
        id: employeeInfoId,
        userId,
        workspaceId,
        name: adminName,
        emailId,
        createdBy: userId,
        updatedBy: userId,
      },
      transaction
    );

    // 4. Create workspace departments
    for (const deptId of departments) {
      await Auth.createWorkspaceDepartment(
        {
          id: uuidv4(),
          workspaceId,
          departmentId: deptId,
          createdBy: userId,
          updatedBy: userId,
        },
        transaction
      );
    }

    // 5. Create workspace designations
    for (const desigId of designations) {
      await Auth.createWorkspaceDesignation(
        {
          id: uuidv4(),
          workspaceId,
          designationId: desigId,
          createdBy: userId,
          updatedBy: userId,
        },
        transaction
      );
    }

    // 6. Create workspace shifts
    for (const shift of shifts) {
      await Auth.createWorkspaceShift(
        {
          id: uuidv4(),
          workspaceId,
          name: shift.name,
          description: shift.description,
          startTime: shift.startTime,
          endTime: shift.endTime,
          createdBy: userId,
          updatedBy: userId,
        },
        transaction
      );
    }

    // Commit transaction
    await transaction.commit();

    // Generate authentication token
    const authToken: string = fastify.jwt.sign({
      userId: user.id,
      roleId: role,
      workspaceId: workspace.id,
      workspaceName: workspace.workspace_name ?? "Unknown Workspace",
    });

    // Return properly typed response
    const response: SignUpResponse = {
      token: authToken,
      workspace: {
        id: workspace.id,
        workspaceName: workspace.workspace_name,
        workspaceLogo: workspace.workspace_logo,
      },
      user: {
        id: user.id,
        emailId: user.email_id,
      },
    };

    return response;
  } catch (error: any) {
    // Rollback transaction on error
    await transaction.rollback();
    Logger.error(error.message, error);
    throw error;
  }
};
