"use server";

import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const hasAccess = async (
  path: string,
  requestedAction: "CREATE" | "READ" | "UPDATE" | "DELETE"
): Promise<boolean> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return false;

  const permissions = session.user.permissions;

  if (!permissions) return false;

  return permissions.some((permission) => {
    const actionMatches = permission.action === requestedAction;
    const pathMatches = permission.path.some((p) => path.startsWith(p));
    return actionMatches && pathMatches;
  });
};

export const createPermission = async (data: Prisma.permissionCreateInput) => {
  try {
    return await prisma.permission.create({ data });
  } catch (error) {
    console.error("createPermission error:", error);
    throw error;
  }
};

export const getPermission = async (
  args: Prisma.permissionFindFirstArgs = {}
) => {
  try {
    return prisma.permission.findFirst(args);
  } catch (error) {
    console.error("getPermission error:", error);
    throw error;
  }
};

export const getPermissions = async (args: Prisma.permissionFindManyArgs) => {
  try {
    return await prisma.permission.findMany(args);
  } catch (error) {
    console.error("getPermissions error:", error);
    throw error;
  }
};

export const getPermissionsByRoleId = async (profile_role_id: string) => {
  try {
    return await prisma.permission.findMany({
      where: {
        profile_roles: {
          some: {
            id: profile_role_id,
          },
        },
      },
    });
  } catch (error) {
    console.error("getPermissionsByRoleId error:", error);
    throw error;
  }
};
export const updatePermission = async (args: Prisma.permissionUpdateArgs) => {
  try {
    return await prisma.permission.update(args);
  } catch (error) {
    console.error("updatePermission error:", error);
    throw error;
  }
};
export const deletePermission = async (id: string) => {
  try {
    const res = await prisma.permission.delete({
      where: { id },
    });
    if (res) {
      revalidatePath("/dashboard/admin/permissions");
      return res;
    }
  } catch (error) {
    console.error("deletePermission error:", error);
    throw error;
  }
};
