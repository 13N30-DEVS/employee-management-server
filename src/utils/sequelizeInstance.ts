import { Dialect, Sequelize } from 'sequelize';
import { env } from '@config';

export interface SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  port: number;
  schema: string;
}

let dbConfig: SequelizeOptions = {
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: env.DB_DIALECT,
  schema: 'public',
};

const isProduction = env.NODE_ENV === 'production';
const useSSL = env.DB_SSL && isProduction;

export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  logging: env.NODE_ENV === 'development' ? console.log : false,
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  timezone: '+00:00',
  schema: dbConfig.schema,

  // Connection pooling configuration
  pool: {
    max: env.DB_POOL_MAX,
    min: env.DB_POOL_MIN,
    acquire: env.DB_POOL_ACQUIRE,
    idle: env.DB_POOL_IDLE,
    evict: 60000, // Remove dead connections every 60 seconds
  },

  // SSL configuration for production
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},

  // Retry configuration
  retry: {
    max: 3,
    timeout: 10000,
  },

  // Better error handling
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    return true;
  } catch (error: any) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
};

// Graceful shutdown
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed successfully.');
  } catch (error: any) {
    console.error('❌ Error closing database connection:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('🔄 Shutting down gracefully...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Shutting down gracefully...');
  await closeConnection();
  process.exit(0);
});
