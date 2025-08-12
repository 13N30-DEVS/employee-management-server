CREATE SCHEMA "auth";

CREATE TABLE "auth"."master_user_roles" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(255),
  "description" varchar(255),
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "auth"."master_user_statuses" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(255),
  "description" varchar(255),
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
  "name" varchar(255),
  "description" varchar(255),
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "master_departments" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(255),
  "description" varchar(255),
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "master_designations" (
  "id" int PRIMARY KEY NOT NULL,
  "name" varchar(255),
  "description" varchar(255),
  "is_active" bool DEFAULT true,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "workspaces" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_name" varchar(255),
  "workspace_logo" varchar(255),
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
  "department_id" int,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "workspace_designations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid,
  "designation_id" int,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "workspace_shifts" (
  "id" uuid PRIMARY KEY NOT NULL,
  "workspace_id" uuid,
  "name" varchar(255),
  "description" varchar(255),
  "start_time" time NOT NULL,
  "end_time" time NOT NULL,
  "is_active" bool DEFAULT true,
  "is_deleted" bool DEFAULT false,
  "created_by" uuid,
  "created_at" timestamp,
  "updated_by" uuid,
  "updated_at" timestamp,
  "deleted_by" uuid,
  "deleted_at" timestamp
);

CREATE TABLE "employee_informations" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "workspace_id" uuid,
  "name" varchar(255),
  "gender" int,
  "email" varchar(255) UNIQUE,
  "mobile_number" varchar(255) UNIQUE,
  "profile_pic" varchar(255),
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

-- Basic foreign key relationships
ALTER TABLE "auth"."users" ADD FOREIGN KEY ("role") REFERENCES "auth"."master_user_roles" ("id");
ALTER TABLE "auth"."users" ADD FOREIGN KEY ("status") REFERENCES "auth"."master_user_statuses" ("id");

ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");
ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("department_id") REFERENCES "master_departments" ("id");

ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");
ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("designation_id") REFERENCES "master_designations" ("id");

ALTER TABLE "employee_informations" ADD FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_informations" ADD FOREIGN KEY ("workspace_id") REFERENCES "workspaces" ("id");
ALTER TABLE "employee_informations" ADD FOREIGN KEY ("gender") REFERENCES "master_genders" ("id");

ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("emp_id") REFERENCES "employee_informations" ("id");
ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("role_id") REFERENCES "auth"."master_user_roles" ("id");

ALTER TABLE "employee_details" ADD FOREIGN KEY ("emp_id") REFERENCES "employee_informations" ("id");

-- Audit trail foreign key relationships (created_by, updated_by, deleted_by)
-- Users table audit relationships
ALTER TABLE "auth"."users" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "auth"."users" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");

-- Workspaces table audit relationships
ALTER TABLE "workspaces" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspaces" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspaces" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Workspace departments table audit relationships
ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_departments" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Workspace designations table audit relationships
ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_designations" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Workspace shifts table audit relationships
ALTER TABLE "workspace_shifts" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_shifts" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "workspace_shifts" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Employee informations table audit relationships
ALTER TABLE "employee_informations" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_informations" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_informations" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Employee role mappings table audit relationships
ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_role_mappings" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");

-- Employee details table audit relationships
ALTER TABLE "employee_details" ADD FOREIGN KEY ("created_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_details" ADD FOREIGN KEY ("updated_by") REFERENCES "auth"."users" ("id");
ALTER TABLE "employee_details" ADD FOREIGN KEY ("deleted_by") REFERENCES "auth"."users" ("id");
