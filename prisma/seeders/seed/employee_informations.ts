import { employee_informations } from "@prisma/client";

export const employeeInformations: {
  table: string;
  data: employee_informations[];
} = {
  table: "employee_informations",
  data: [
    {
      id: "37d92534-8490-4902-9a66-f5a351450b0f",
      user_id: "c5dcc910-f10e-473c-a446-f7b7dfd025ca",
      workspace_id: "550e8400-e29b-41d4-a716-446655440000", // Link to super admin workspace
      name: "Super Admin",
      gender: 1,
      email: "superadmin@mailinator.com",
      mobile_number: null,
      profile_pic: null,
      is_active: true,
      is_deleted: false,
      created_by: "c5dcc910-f10e-473c-a446-f7b7dfd025ca", // Super admin user ID
      updated_by: "c5dcc910-f10e-473c-a446-f7b7dfd025ca", // Super admin user ID
      deleted_by: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  ],
};
