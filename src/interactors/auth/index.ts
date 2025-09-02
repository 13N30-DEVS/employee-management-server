import { Auth } from '@services';
import * as bcrypt from 'bcrypt';
import { sequelize } from '@utils';
import { v4 as uuidv4 } from 'uuid';
import { LoginInput, SignupInput } from '@schemas';
import { AuthenticatedFastifyInstance } from '@types';
import { constants } from '@config';
import { AppError, NotFoundError, AuthenticationError, Logger, ConflictError } from '@helpers';

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
  options: LoginInput,
  fastify: AuthenticatedFastifyInstance
): Promise<{ token: string }> => {
  const { emailId, password } = options;

  const user = await Auth.findByEmailId({ emailId });

  if (!user) {
    throw new NotFoundError('User does not exist.');
  }

  if (!user.password_hash) {
    throw new AppError(500, 'User password hash not found.', 'PASSWORD_HASH_MISSING');
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);

  if (!passwordMatch) {
    throw new AuthenticationError('Incorrect password.');
  }

  // Authentication Token
  const authToken: string = fastify.generateAccessToken({
    userId: user.id,
    roleId: user.role_master_user_role?.id || 0,
    roleName: user.role_master_user_role?.name,
    statusId: user.status_master_user_status?.id || 0,
    statusName: user.status_master_user_status?.name,
    workspaceId: user.employee_informations?.[0]?.workspace?.id || '',
    workspaceName:
      user.employee_informations?.[0]?.workspace?.workspace_name ?? 'Unknown Workspace',
  });

  return { token: authToken };
};

/**
 * Signs up a new user with workspace creation and all related data.
 * @param {SignUpPayload} options - User registration data including workspace, departments, designations, and shifts.
 * @param {FastifyInstance} fastify - The Fastify instance to use for generating the authentication token.
 * @returns {Promise<SignUpResponse>} A promise that resolves to the signup response with token, workspace, and user data.
 * @throws {Error} If the user already exists or any database operation fails.
 */
export const SignUp = async (
  options: SignupInput,
  fastify: AuthenticatedFastifyInstance
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
      throw new ConflictError('User with this email already exists.');
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, constants.SECURITY_CONSTANTS.BCRYPT_ROUNDS);

    // 1. Create user FIRST
    const userId = uuidv4();
    const user = await Auth.createUser(
      {
        id: userId,
        emailId,
        passwordHash,
        role,
        status: constants.USER_STATUS.ACTIVE,
      },
      transaction
    );

    // 2. Create workspace with the user as creator
    const workspaceId = uuidv4();
    const workspace = await Auth.createWorkspace(
      {
        id: workspaceId,
        workspaceName,
        workspaceLogo: workspaceLogo || '',
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
    const authToken: string = fastify.generateAccessToken({
      userId: user.id,
      roleId: role,
      workspaceId: workspace.id,
      workspaceName: workspace.workspace_name ?? 'Unknown Workspace',
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
  } catch (error: unknown) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error(error instanceof Error ? error.message : 'Unknown error', error);
    throw error;
  }
};

/**
 * Verifies whether a user with the given email ID exists.
 * @param {string} emailId - The email ID to verify.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false if not.
 * @throws {Error} - Throws an error if the query fails.
 */
export const verifyEmail = async (emailId: string): Promise<boolean> => {
  try {
    const user = await Auth.findByEmailId({ emailId });
    return user ? !!user : false;
  } catch (error: any) {
    Logger.error(error.message, error);
    throw new Error(error.message);
  }
};
