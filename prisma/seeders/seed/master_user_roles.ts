import { master_user_roles } from "@prisma/client";

export const masterUserRoles: {
  table: string;
  data: master_user_roles[];
} = {
  table: "master_user_roles",
  // Super Admin, Admin, Parent, Student
  data: [
    {
      id: 1,
      name: "Super Admin",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Admin",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "HR",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: "Employee",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
