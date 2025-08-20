import { FastifyPluginAsync } from 'fastify';
import handler from './handlers';
import schema from './schema';

const authRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  //  Login
  fastify.post('/logIn', { schema: schema.SIGN_IN }, (request, reply) =>
    handler.signIn(request, reply, fastify)
  );
  //  SignUp
  fastify.post('/signUp', { schema: schema.SIGN_UP }, (request, reply) =>
    handler.signUp(request, reply, fastify)
  );
};

export default authRoute;
