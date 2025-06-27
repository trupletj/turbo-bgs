"use server";

import { prisma } from "@repo/database";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";
import { Prisma } from "@repo/database/generated/prisma/client/client";

export const createRating = async (data: Prisma.ratingCreateInput) => {
  try {
    return await prisma.rating.create({ data });
  } catch (error) {
    console.error("createRating error:", error);
    throw error;
  }
};

//  {
//     score: number;
//     description?: string;
//     scored_date: Date;
//     clause_job_position: {
//       connect: { id: string };
//     };
//     rating_session: {
//       connect: { id: string };
//     };
//   }

export const getRating = async (args: Prisma.ratingFindUniqueArgs) => {
  try {
    return prisma.rating.findUnique(args);
  } catch (e) {
    console.log(e);
  }
};

export const getRatings = async (args: Prisma.ratingFindManyArgs = {}) => {
  try {
    return prisma.rating.findMany(args);
  } catch (e) {
    console.log(e);
  }
};

export const updateRating = async (
  id: string,
  data: Prisma.ratingUpdateInput
) => {
  try {
    const updated = await prisma.rating.update({
      where: { id },
      data,
    });
    return updated;
  } catch (error) {
    console.error("updateRating error:", error);
    throw error;
  }
};

// await updateRating("rating_id_here", {
//   score: 4,
//   description: "Дунд зэргийн",
// });
