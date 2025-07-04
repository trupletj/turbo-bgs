"use server";
import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client/client";
import { revalidatePath } from "next/cache";

export const createProfile = async (data: Prisma.profileCreateInput) => {
  try {
    return await prisma.profile.create({ data });
  } catch (error) {
    console.error("createProfile error:", error);
    throw error;
  }
};

export const getProfile = async (args: Prisma.profileFindUniqueArgs) => {
  try {
    return prisma.profile.findUnique(args);
  } catch (error) {
    console.error("getProfile error:", error);
    throw error;
  }
};

export const getProfiles = async (args: Prisma.profileFindManyArgs) => {
  try {
    return prisma.profile.findMany(args);
  } catch (error) {
    console.error("getProfiles error:", error);
    throw error;
  }
};

export const deleteProfile = async (id: string) => {
  try {
    const res = await prisma.profile.delete({
      where: { user_id: id },
    });
    if (res) {
      revalidatePath("/dashboard/admin/users");
      return res;
    }
  } catch (error) {
    console.error("deleteProfile error:", error);
    throw error;
  }
};
