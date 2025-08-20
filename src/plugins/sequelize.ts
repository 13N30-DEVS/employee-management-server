import { initModels } from '@models';
import { sequelize, SequelizeOptions } from '@utils';
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import { establishCustomRelations } from '../models/customRelations';
import { constants } from '@config';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}

// Retry configuration
const MAX_RETRIES = constants.DB_CONSTANTS.RETRY.MAX_ATTEMPTS;
const INITIAL_DELAY = constants.DB_CONSTANTS.RETRY.INITIAL_DELAY;
const MAX_DELAY = constants.DB_CONSTANTS.RETRY.MAX_DELAY;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoff = (attempt: number): number => {
  const delay = Math.min(INITIAL_DELAY * Math.pow(2, attempt), MAX_DELAY);
  return delay + Math.random() * 1000; // Add jitter
};

const retryConnection = async (attempt: number = 0): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Test connection with a simple query
    await sequelize.query('SELECT 1');
    console.log('✅ Database connection verified with test query.');

    return;
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      console.error('❌ Database connection failed after maximum retries:', error);
      throw error;
    }

    const delay = exponentialBackoff(attempt);
    console.error(`❌ Database connection failed (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);
    console.log(`🔄 Retrying in ${Math.round(delay)}ms...`);

    await sleep(delay);
    return retryConnection(attempt + 1);
  }
};

const sequelizePlugin: FastifyPluginCallback<SequelizeOptions> = async (
  fastify: FastifyInstance
) => {
  try {
    // Test database connection with retry logic
    await retryConnection();

    // Initialize models and relationships
    initModels(sequelize);
    establishCustomRelations(sequelize);

    // Decorate fastify instance
    fastify.decorate('sequelize', sequelize);

    // Add graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n🔄 Closing database connections...');
      try {
        await sequelize.close();
        console.log('✅ Database connections closed.');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing database connections:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default fp(sequelizePlugin);
