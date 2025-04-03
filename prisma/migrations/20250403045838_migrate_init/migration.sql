CREATE SCHEMA "auth";

CREATE TABLE "auth"."master_user_roles" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar,
  "description" varchar,
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "auth"."master_user_statuses" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar,
  "description" varchar,
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "auth"."users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "email_id" varchar(255),
  "password_hash" varchar(255),
  "role" int,
  "status" int,
  "is_active" bool DEFAULT true,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp
);

CREATE TABLE "master_genders" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar,
  "description" varchar,
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "master_departments" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar,
  "description" varchar,
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "master_designations" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar,
  "description" varchar,
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "workspaces" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_name" varchar,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "workspace_departments" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid,
  "dep_id" int,
  "is_active" bool DEFAULT true,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp
);

CREATE TABLE "workspace_designations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid,
  "dep_id" int,
  "is_active" bool DEFAULT true,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp
);

CREATE TABLE "employee_informations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid,
  "workspace_id" uuid,
  "gender" int,
  "email" varchar UNIQUE,
  "mobile_number" varchar UNIQUE,
  "profile_pic" varchar,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "employee_role_mappings" (
  "id" uuid PRIMARY KEY NOT NULL,
  "emp_id" uuid,
  "role_id" int,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "employee_details" (
  "id" uuid PRIMARY KEY NOT NULL,
  "emp_id" uuid,
  "date_of_birth" date,
  "addresses" text,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

ALTER TABLE "auth"."users" ADD FOREIGN KEY ("role") REFERENCES "auth"."master_user_roles" ("id");

ALTER TABLE "auth"."users" ADD FOREIGN KEY ("status") REFERENCES "auth"."master_user_statuses" ("id");

ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");

ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("dep_id") REFERENCES "master_departments" ("id");

ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");

ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("dep_id") REFERENCES "master_designations" ("id");

ALTER TABLE "employee_informations" ADD FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id");

ALTER TABLE "employee_informations" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");

ALTER TABLE "employee_informations" ADD FOREIGN KEY ("gender") REFERENCES "master_genders" ("id");

ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("emp_id") REFERENCES "employee_informations" ("id");

ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("role_id") REFERENCES "auth"."master_user_roles" ("id");

ALTER TABLE "employee_details" ADD FOREIGN KEY ("emp_id") REFERENCES "employee_informations" ("id");
