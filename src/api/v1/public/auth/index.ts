import { FastifyPluginAsync } from "fastify";
import handler from "./handlers";
import schema from "./schema";

const authRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  //  Login
  fastify.post("/logIn", { schema: schema.SIGN_IN }, (request, reply) =>
    handler.SIGN_IN(request, reply, fastify)
  );
};

export default authRoute;
