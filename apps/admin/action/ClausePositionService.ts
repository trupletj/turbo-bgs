"use server";

import { prisma } from "@repo/database";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";
import { Prisma } from "@repo/database/generated/prisma/client/client";

export async function createClausePositionsWithType(
  clauseId: string,
  job_positionIds: string[],
  type: type_clause_job_position
) {
  try {
    if (!clauseId || !job_positionIds.length || !type) {
      throw new Error("clauseId, job_positionIds болон type шаардлагатай");
    }

    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Заалт олдсонгүй");

    const job_positions = await prisma.job_position.findMany({
      where: { id: { in: job_positionIds } },
      select: { id: true },
    });
    if (job_positions.length !== job_positionIds.length) {
      throw new Error("Ажлын байр олдсонгүй.");
    }

    const clausePositions = await prisma.clause_job_position.createMany({
      data: job_positionIds.map((job_positionId) => ({
        clauseId,
        job_positionId,
        type,
      })),
    });

    console.log("Clause job_positions created:", {
      clauseId,
      count: clausePositions.count,
    });
    return clausePositions;
  } catch (error) {
    console.error("createClausePositions error:", error);
    throw error;
  }
}

export async function deleteClausePosition(id: string) {
  try {
    const clausePosition = await prisma.clause_job_position.update({
      where: { id },
      data: { is_checked: true },
    });
    console.log("Clause job_position deleted:", { id });
    return clausePosition;
  } catch (error) {
    console.error("deleteClausePosition error:", error);
    throw new Error("Failed to delete clause job_position");
  }
}

export async function getClausePositionsByClauseId(clauseId: string) {
  try {
    const clausePositions = await prisma.clause_job_position.findMany({
      where: { clauseId, is_checked: false },
      include: {
        job_position: { select: { id: true, name: true, alba_id: true } },
      },
    });
    console.log("Clause job_positions fetched:", {
      clauseId,
      count: clausePositions.length,
    });
    return clausePositions.map((pos) => ({
      ...pos,
      type: pos.type ?? "IMPLEMENTATION", // Default утга
    }));
  } catch (error) {
    console.error("getClausePositionsByClauseId error:", error);
    throw new Error("Failed to fetch clause job_positions");
  }
}

export async function getClausesByPositionId(job_positionId: string) {
  try {
    const clausesId = await prisma.clause_job_position.findMany({
      where: {
        job_positionId,
        is_checked: false,
      },
      select: { clauseId: true },
    });

    if (clausesId.length === 0) {
      console.log("Ажлын байранд тохирох заалт олдсонгүй");
      return [];
    }

    console.log("Сугалж авсан заалтуудын id:", {
      clausesId,
      count: clausesId.length,
    });

    const clauses = await prisma.clause.findMany({
      where: {
        id: {
          in: clausesId.map((clause) => clause.clauseId),
        },
      },
    });

    console.log("Таарах заалтууд:", clauses);
    return clauses;
  } catch (error) {
    console.error("getClausesByPositionId error:", error);
    throw new Error("Failed to fetch clauses");
  }
}
export const getOrganizations = async (
  args: Prisma.organizationFindManyArgs = {}
) => {
  try {
    return prisma.organization.findMany(args);
  } catch (e) {
    console.log(e);
  }
};

export async function getClauseJobPosition(
  args: Prisma.clause_job_positionFindManyArgs = {}
) {
  try {
    return prisma.clause_job_position.findFirst(args);
  } catch (e) {
    console.log(e);
  }
}

export async function createClauseJobPosition({
  clauseId,
  job_positionId,
  is_checked,
  type,
}: {
  clauseId: string;
  job_positionId: string;
  is_checked: boolean;
  type: type_clause_job_position;
}) {
  const clauseJobPosition = await prisma.clause_job_position.create({
    data: { clauseId, job_positionId, is_checked, type },
  });

  return clauseJobPosition;
}

export async function updateClauseJobPosition({
  id,
  is_checked,
  type,
}: {
  id: string;
  is_checked?: boolean;
  type?: type_clause_job_position;
}) {
  const clauseJobPosition = await prisma.clause_job_position.update({
    where: { id },
    data: {
      ...(is_checked !== undefined && { is_checked }),
      ...(type !== undefined && { type }),
    },
  });

  return clauseJobPosition;
}

export const getPositions = async (
  args: Prisma.clause_job_positionFindManyArgs = {}
) => {
  try {
    return prisma.clause_job_position.findMany(args);
  } catch (e) {
    console.log(e);
  }
};

// export const getPositions = async ({ clauseId }: { clauseId: string }) => {
//   try {
//     return prisma.clause_job_position.findMany({
//       where: {
//         clauseId: clauseId,
//       },
//       include: {
//         job_position: {
//           select: {
//             id: true,
//             name: true,
//             organization: {
//               select: {
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   } catch (e) {
//     console.log(e);
//   }
// };
