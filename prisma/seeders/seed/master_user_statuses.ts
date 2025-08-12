import { master_user_statuses } from "@prisma/client";

export const masterUserStatuses: {
  table: string;
  data: master_user_statuses[];
} = {
  table: "master_user_statuses",
  // Active, In Active, Blocked, Invited
  data: [
    {
      id: 1,
      name: "Active",
      description: "User account is active and can access the system",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "In Active",
      description:
        "User account is temporarily inactive and cannot access the system",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "Blocked",
      description:
        "User account is blocked due to security violations or policy breaches",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: "Deleted",
      description:
        "User account has been soft deleted and is no longer accessible",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
