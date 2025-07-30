"use server";

import { prisma } from "@repo/database";
import {
  Prisma,
  profile_role,
  permission,
} from "@repo/database/generated/prisma/client";
import { revalidatePath } from "next/cache";

export const getProfileRole = async (
  args: Prisma.profile_roleFindUniqueArgs
): Promise<(profile_role & { permissions: permission[] }) | null> => {
  try {
    return await prisma.profile_role.findUnique({
      ...args,
      include: { permissions: true },
    });
  } catch (error) {
    console.error("getProfileRole error:", error);
    throw new Error(
      `Ролын мэдээлэл авахад алдаа гарлаа: ${(error as Error).message}`
    );
  }
};

export const createProfileRole = async (
  data: Prisma.profile_roleCreateInput
) => {
  try {
    return await prisma.profile_role.create({ data });
  } catch (error) {
    console.error("createProfileRole error:", error);
    throw new Error(`Рол бүртгэхэд алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const updateProfileRole = async (
  id: string,
  data: Prisma.profile_roleUpdateInput
) => {
  try {
    return await prisma.profile_role.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error("updateProfileRole error:", error);
    throw new Error(
      `Рол засварлахад алдаа гарлаа: ${(error as Error).message}`
    );
  }
};

export const deleteProfileRole = async (id: string) => {
  try {
    const res = await prisma.profile_role.delete({
      where: { id },
    });
    if (res) {
      revalidatePath("/dashboard/admin/permission");
      return res;
    }
  } catch (error) {
    console.error("deleteProfileRole error:", error);
    throw new Error(`Рол устгахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getProfileRoles = async (
  args: Prisma.profile_roleFindManyArgs
): Promise<(profile_role & { permissions: permission[] })[]> => {
  try {
    return await prisma.profile_role.findMany({
      ...args,
      include: { permissions: true },
    });
  } catch (error) {
    console.error("getProfileRoles error:", error);
    throw new Error(
      `Ролын жагсаалт авахад алдаа гарлаа: ${(error as Error).message}`
    );
  }
};

export const getProfileByUserId = async (userId: string) => {
  return await prisma.profile.findUnique({
    where: { user_id: userId },
    include: {
      profile_roles: true,
    },
  });
};

export const updateProfileRoles = async (userId: string, roleIds: string[]) => {
  return await prisma.profile.update({
    where: { user_id: userId },
    data: {
      role_version: { increment: 1 },
      profile_roles: {
        set: roleIds.map((id) => ({ id })),
      },
    },
  });
};
