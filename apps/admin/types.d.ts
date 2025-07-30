import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { action as Action } from "@repo/database/generated/prisma/client/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: Role[];
      permissions: Permission[];
      role_version: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    roles: Role[];
    permissions: Permission[];
    role_version: number;
  }
}
type Role = {
  name: string;
};

type Permission = {
  resource: string | null;
  path: string[];
  action: Action;
};
