import { initModels } from "@models";
import { sequelize, SequelizeOptions } from "@utils";
import { FastifyPluginCallback, FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Sequelize } from "sequelize";
import { establishCustomRelations } from "../models/customRelations";

declare module "fastify" {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}

const sequelizePlugin: FastifyPluginCallback<SequelizeOptions> = async (
  fastify: FastifyInstance,
  _
) => {
  try {
    // Test database connection with timeout
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Test connection with a simple query
    await sequelize.query("SELECT 1");
    console.log("✅ Database connection verified with test query.");

    // Initialize models and relationships
    initModels(sequelize);
    establishCustomRelations(sequelize);

    // Decorate fastify instance
    fastify.decorate("sequelize", sequelize);

    // Add graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n🔄 Closing database connections...");
      await sequelize.close();
      console.log("✅ Database connections closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error("🔄 Retrying in 5 seconds...");

    // Retry connection after 5 seconds
    setTimeout(async () => {
      try {
        await sequelize.authenticate();
        console.log("✅ Database connection established on retry.");
        initModels(sequelize);
        establishCustomRelations(sequelize);
        fastify.decorate("sequelize", sequelize);
      } catch (retryError) {
        console.error("❌ Database connection retry failed:", retryError);
        process.exit(1); // Exit if database connection fails after retry
      }
    }, 5000);
  }
};

export default fp(sequelizePlugin);
