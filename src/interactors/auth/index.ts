import { Logger } from "@helpers";
import { Auth } from "@services";
import * as bcrypt from "bcrypt";

interface SignInPayload {
  emailId: string;
  password: string;
}

export const SignIn = async (options: SignInPayload, fastify: any) => {
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
    });

    return { token: authToken };
  } catch (error: any) {
    Logger.error(error.message, error);
    throw error; // Don't wrap it in a new Error, pass original error with statusCode
  }
};
