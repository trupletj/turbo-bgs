"use server";

import { user } from "@repo/database/generated/prisma/client/client";
import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client";
import { ArrowRightSquare } from "lucide-react";

export const getUser = async (args: Prisma.userFindUniqueArgs) => {
  try {
    console.log(args);
    return prisma.user.findUnique(args);
  } catch (error) {
    console.error("getUser error:", error);
    throw error;
  }
};

export const getUsers = async (args: Prisma.userFindManyArgs) => {
  try {
    return prisma.user.findMany(args);
  } catch (error) {
    console.error("getUsers error:", error);
    throw error;
  }
};

export async function getSearchUsers(query: string) {
  if (!query.trim()) return [];

  const users = await prisma.user.findMany({
    where: {
      is_active: true,
      OR: [
        { first_name: { contains: query, mode: "insensitive" } },
        { last_name: { contains: query, mode: "insensitive" } },
        { register_number: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { first_name: "asc" },
  });

  return users;
}
