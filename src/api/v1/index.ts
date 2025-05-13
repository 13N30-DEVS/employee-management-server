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

const routes = (fastify: FastifyInstance, _: any, done: any) => {
  // Pre-validation hook for JWT authentication for private routes
  fastify.addHook(
    "onRequest",
    async (request: ExtendFastifyRequest, reply: FastifyReply) => {
      try {
        const authorizationHeader: any = request.headers.authorization;

        // For Private Routes [Authorization Token In Header]
        if (authorizationHeader) {
          const splittoken: any = authorizationHeader?.split(" ")?.[1]!;

          let decodedToken: any = fastify.jwt.decode(splittoken, {
            complete: false,
          });

          request.decodedToken = decodedToken;
        } else {
          // Skip Token Verification for Public Routes
          return;
        }
      } catch (error: any) {
        // Handle Authentication Errors
        return reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  //Routes of Public API
  routesLoader(fastify, path.join(__dirname, "public"));
  //Routes of Private API
  // routesLoader(fastify, join(__dirname, "private"));
  fastify.register((innerFastify, opts, next) => {
    innerFastify.addHook(
      "onRequest",
      async (request: ExtendFastifyRequest, reply: FastifyReply) => {
        if (!request.headers.authorization) {
          reply.status(401).send({ message: "Unauthorized" });
          return;
        }

        if (!request.headers?.["x-workspace-id"]) {
          reply.status(401).send({ message: "Workspace id not found" });
          return;
        }
      }
    );
    routesLoader(innerFastify, path.join(__dirname, "private"));
    next();
  });

  done();
};

export default routes;
