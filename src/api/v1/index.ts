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

const routes = (fastify: FastifyInstance, _: any, _done: any) => {
  // Pre-validation hook for JWT authentication for private routes
  fastify.addHook(
    "onRequest",
    async (request: ExtendFastifyRequest, _reply: FastifyReply) => {
      const authorizationHeader = request.headers.authorization;

      // For Private Routes [Authorization Token In Header]
      if (authorizationHeader) {
        const splittoken = authorizationHeader.split(" ")[1];
        if (splittoken) {
          const decodedToken = fastify.jwt.decode(splittoken, {
            complete: false,
          });
          request.decodedToken = decodedToken;
        }
      }
      // No else block needed; just proceed for public routes
    }
  );

  //Routes of Public API
  routesLoader(fastify, path.join(__dirname, "public"));
  //Routes of Private API
  // routesLoader(fastify, join(__dirname, "private"));
  fastify.register((innerFastify, _opts, next) => {
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
    next();
  });
};

export default routes;
