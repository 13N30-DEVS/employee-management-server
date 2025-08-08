import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { readdirSync } from "fs";
import * as path from "path";

interface ExtendFastifyRequest extends FastifyRequest {
  headers: any;
  decodedToken?: any;
  apiKey?: any;
}

const routesLoader = (fastify: FastifyInstance, sourceDir: string) => {
  readdirSync(sourceDir, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((item: any) => item.name)
    .forEach(async (item: string) => {
      let route: any = await import(`${sourceDir}/${item}`);
      fastify.register(route.default, { prefix: `/api/v1/${item}` });
    });
};

const routes = async (fastify: FastifyInstance) => {
  fastify.addHook(
    "onRequest",
    async (request: ExtendFastifyRequest, _reply: FastifyReply) => {
      const authorizationHeader = request.headers.authorization;
      if (authorizationHeader) {
        const splittoken = authorizationHeader.split(" ")[1];
        if (splittoken) {
          const decodedToken = fastify.jwt.decode(splittoken, {
            complete: false,
          });
          request.decodedToken = decodedToken;
        }
      }
    }
  );

  // Await route loading
  routesLoader(fastify, path.join(__dirname, "public"));

  // Register private routes with auth hook
  await fastify.register(async (innerFastify) => {
    innerFastify.addHook(
      "onRequest",
      async (request: ExtendFastifyRequest, reply: FastifyReply) => {
        if (!request.headers.authorization) {
          reply.status(401).send({ message: "Unauthorized" });
          return;
        }

        if (!request.headers?.["x-workspace-id"]) {
          reply.status(401).send({ message: "Workspace id not found" });
        }
      }
    );

    routesLoader(innerFastify, path.join(__dirname, "private"));
  });
};

export default routes;
