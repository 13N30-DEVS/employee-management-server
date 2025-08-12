import { workspaces } from "@prisma/client";

export const Workspaces: {
  table: string;
  data: workspaces[];
} = {
  table: "workspaces",
  data: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000", // Default workspace ID
      workspace_name: "Super Admin Workspace",
      is_active: true,
      is_deleted: false,
      created_by: "c5dcc910-f10e-473c-a446-f7b7dfd025ca", // Super admin user ID
      created_at: new Date(),
      updated_by: "c5dcc910-f10e-473c-a446-f7b7dfd025ca", // Super admin user ID
      updated_at: new Date(),
      deleted_by: null,
      deleted_at: null,
    },
  ],
};
