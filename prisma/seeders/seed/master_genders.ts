import { master_genders } from "@prisma/client";

export const masterGenders: {
  table: string;
  data: master_genders[];
} = {
  table: "master_genders",
  // Male, Female, Others
  data: [
    {
      id: 1,
      name: "Male",
      description: "Identifies as male",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: "Female",
      description: "Identifies as female",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      name: "Transgender",
      description: "Identifies as transgender",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 4,
      name: "Others",
      description:
        "Identifies with other gender identities or prefers not to specify",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
