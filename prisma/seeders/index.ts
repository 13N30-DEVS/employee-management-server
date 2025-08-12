import { PrismaClient } from "@prisma/client";
import * as Seeds from "./seed";

const prisma = new PrismaClient();

// Type for seeder data
interface SeederData {
  table: string;
  data: any[];
}

// Map table names to seeder export names
const seederMap: { [key: string]: string } = {
  master_user_roles: "masterUserRoles",
  master_user_statuses: "masterUserStatuses",
  master_genders: "masterGenders",
  users: "Users",
  workspaces: "Workspaces",
  employee_informations: "employeeInformations",
  master_designations: "masterDesignations",
  master_departments: "masterDepartments",
};

// Function to verify seeding dependencies
const verifyDependencies = async () => {
  console.log("🔍 Verifying seeding dependencies...");

  // Check if all required seeders exist
  const requiredSeeders = [
    "master_user_roles",
    "master_user_statuses",
    "master_genders",
    "users",
    "workspaces",
    "employee_informations",
    "master_designations",
    "master_departments",
  ];

  for (const seederName of requiredSeeders) {
    const exportName = seederMap[seederName];
    if (!(Seeds as any)[exportName]) {
      throw new Error(
        `Missing required seeder: ${seederName} (export: ${exportName})`
      );
    }
  }

  console.log("✓ All required seeders found");
};

const main = async () => {
  console.log("---- Seeding In Progress ----");

  // Verify dependencies first
  await verifyDependencies();

  // Define the seeding order to respect dependencies
  const seedingOrder = [
    "master_user_roles",
    "master_user_statuses",
    "master_genders",
    "users",
    "workspaces", // Must come after users, before employee_informations
    "employee_informations", // Must come after workspaces
    "master_designations",
    "master_departments",
  ];

  // Process each table sequentially to ensure proper order
  for (const tableName of seedingOrder) {
    const exportName = seederMap[tableName];
    const seed = (Seeds as any)[exportName] as SeederData;

    if (seed) {
      console.log(`\n📝 ${seed.table} started`);

      // Add dependency checks for critical tables
      if (tableName === "workspaces") {
        // Ensure users exist before seeding workspaces
        const userCount = await prisma.users.count();
        if (userCount === 0) {
          throw new Error(
            "Cannot seed workspaces: No users found. Please ensure users are seeded first."
          );
        }
        console.log(
          `✓ Verified ${userCount} users exist before seeding workspaces`
        );
      }

      if (tableName === "employee_informations") {
        // Ensure workspaces exist before seeding employee_informations
        const workspaceCount = await prisma.workspaces.count();
        if (workspaceCount === 0) {
          throw new Error(
            "Cannot seed employee_informations: No workspaces found. Please ensure workspaces are seeded first."
          );
        }
        console.log(
          `✓ Verified ${workspaceCount} workspaces exist before seeding employee_informations`
        );
      }

      // Process each record in the current table
      for (const data of seed.data) {
        try {
          await (prisma as any)[tableName].upsert({
            where: { id: data.id },
            update: data,
            create: data,
          });
        } catch (error) {
          console.error(
            `❌ Error seeding ${tableName} with ID ${data.id}:`,
            error
          );
          console.error(`Data that failed:`, JSON.stringify(data, null, 2));
          throw error;
        }
      }

      console.log(`✓ ${seed.table} completed (${seed.data.length} records)`);
    } else {
      console.log(
        `⚠️  Warning: No seeder found for table '${tableName}' (export: ${exportName})`
      );
    }
  }

  console.log("\n🎉 ---- Seeding Completed Successfully ----");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
