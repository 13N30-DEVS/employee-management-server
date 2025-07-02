import { Dialect, Sequelize } from "sequelize";

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  NODE_ENV,
  DB_SSL,
}: any = process.env;

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
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  schema: "public",
};

const isProduction = NODE_ENV === "production";
const useSSL = DB_SSL === "true" && isProduction;

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    logging: false,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    timezone: "+00:00",
    dialectOptions: useSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);
