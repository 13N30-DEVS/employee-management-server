import {
  PrismaClient,
  master_user_roles,
  master_user_statuses,
} from "@prisma/client";
import * as Seeds from "./seed";

const prisma = new PrismaClient();

const main = async () => {
  console.log("---- Seeding In Progress ----");

  let upsertPromises: any[] = [];

  Object.values(Seeds).forEach((seed: { table: string; data: any[] }) => {
    // Master user roles
    if (seed.table == "master_user_roles") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: master_user_roles) => {
        upsertPromises.push(
          prisma.master_user_roles.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Master user statuses
    if (seed.table == "master_user_statuses") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: master_user_statuses) => {
        upsertPromises.push(
          prisma.master_user_statuses.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Master genders
    if (seed.table == "master_genders") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: any) => {
        upsertPromises.push(
          prisma.master_genders.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Users
    if (seed.table == "users") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: any) => {
        upsertPromises.push(
          prisma.users.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Employee Informations
    if (seed.table == "employee_informations") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: any) => {
        upsertPromises.push(
          prisma.employee_informations.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Master Designations
    if (seed.table == "master_designations") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: any) => {
        upsertPromises.push(
          prisma.master_designations.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }

    // Master Departments
    if (seed.table == "master_departments") {
      console.log(`${seed.table} started`);
      seed.data.forEach((data: any) => {
        upsertPromises.push(
          prisma.master_departments.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          })
        );
      });
      console.log(`${seed.table} completed`);
    }
  });

  await Promise.all(upsertPromises);

  console.log("---- Seeding Completed ----");
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
