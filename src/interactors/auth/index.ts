import { Logger } from "@helpers";
import { Auth } from "@services";
import * as bcrypt from "bcrypt";

interface SignInPayload {
  emailId: string;
  password: string;
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
      workspaceId: user.employee_informations[0]?.workspace?.id,
      workspaceName: user.employee_informations[0]?.workspace?.workspace_name,
    });

    return { token: authToken };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw error; // Don't wrap it in a new Error, pass original error with statusCode
  }
};
