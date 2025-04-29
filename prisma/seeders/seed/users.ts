import { users } from "@prisma/client";
import * as bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("Login@321", salt);

export const Users: {
  table: string;
  data: users[];
} = {
  table: "users",
  data: [
    {
      id: "c5dcc910-f10e-473c-a446-f7b7dfd025ca",
      email_id: "superadmin@mailinator.com",
      password_hash: hash,
      role: 1,
      status: 1,
      is_active: true,
      created_by: null,
      updated_by: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
