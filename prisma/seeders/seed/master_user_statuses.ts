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
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "In Active",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "Blocked",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: "Deleted",
      description: "",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
