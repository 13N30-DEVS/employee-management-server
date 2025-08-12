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
      description: "Full system access and control",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Admin",
      description: "Workspace administrator with full workspace access",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "HR",
      description: "Human Resources manager",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: "Employee",
      description: "Regular employee",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 5,
      name: "Manager",
      description: "Department or team manager",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 6,
      name: "Team Lead",
      description: "Team leader with supervisory responsibilities",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 7,
      name: "Intern",
      description: "Intern or trainee",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
