import { config } from "dotenv";
config({ path: ".env" });

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  NODE_ENV,
  FRONT_END_URL,
  S3_URL,
  AWS_ACCESS_KEY,
  AWS_SECRET,
  AWS_BUCKET_NAME,
}: any = process.env;

export default {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  NODE_ENV,
  FRONT_END_URL,
  S3_URL,
  AWS_ACCESS_KEY,
  AWS_SECRET,
  AWS_BUCKET_NAME,
};
