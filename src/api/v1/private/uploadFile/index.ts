import { FastifyPluginAsync } from "fastify";

import schema from "./schema";
import handlers from "./handlers";

const uploads: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/upload", { schema: schema.UPLOAD }, handlers.UploadFile);
};

export default uploads;
