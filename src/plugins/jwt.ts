import jwt from "@fastify/jwt";
import { config } from "dotenv";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

config({ path: ".env" });

const { JWT_SECRET }: any = process.env;

/* Plug in function for JWT Authentication */
export default fp(async (fastify: FastifyInstance) => {
  // Secret Key from .env
  const jwtSecret = JWT_SECRET;

  // If JWT_SECRET not exists
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }

  fastify.register(jwt, {
    secret: jwtSecret,
    sign: {
      expiresIn: "48h", // Token expires in 48 hour
    },
  });

  fastify.decorate(
    "authenticate",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void> {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
