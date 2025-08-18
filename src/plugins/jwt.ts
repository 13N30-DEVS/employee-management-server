import jwt from "@fastify/jwt";
import { env } from "@config";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/* Plug in function for JWT Authentication */
export default fp(async (fastify: FastifyInstance) => {
  // Validate JWT secret
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    throw new Error(
      "JWT_SECRET environment variable must be at least 32 characters long."
    );
  }

  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  });

  // Decorate authenticate method with better error handling
  fastify.decorate(
    "authenticate",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void> {
      try {
        await request.jwtVerify();
      } catch (err: any) {
        if (err.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
          reply.code(401).send({
            error: "Token expired",
            code: "TOKEN_EXPIRED",
            message: "Authentication token has expired",
          });
        } else if (err.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID") {
          reply.code(401).send({
            error: "Invalid token",
            code: "INVALID_TOKEN",
            message: "Authentication token is invalid",
          });
        } else {
          reply.code(401).send({
            error: "Unauthorized",
            code: "UNAUTHORIZED",
            message: "Authentication required",
          });
        }
      }
    }
  );

  // Decorate refresh token method
  fastify.decorate("generateRefreshToken", function (payload: any): string {
    return fastify.jwt.sign(payload, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
  });

  // Decorate access token method
  fastify.decorate("generateAccessToken", function (payload: any): string {
    return fastify.jwt.sign(payload, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  });
});

// Extend FastifyInstance interface
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    generateRefreshToken: (payload: any) => string;
    generateAccessToken: (payload: any) => string;
  }
}
