import { FastifyPluginAsync } from "fastify";

import schema from "./schema";
import handler from "./handlers";

const business_trips: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  //   fastify.addHook("preHandler", fastify.authenticate);
  fastify.get("/", { schema: schema.GET_ALL }, handler.GET_ALL);
};

export default business_trips;
