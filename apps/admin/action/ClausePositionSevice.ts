"use server";

import { prisma } from "@repo/database";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

export async function createClausePositions(
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
      where: { id: { in: job_positionIds }, isDeleted: false },
      select: { id: true, divisionId: true },
    });
    if (job_positions.length !== job_positionIds.length) {
      throw new Error("Ажлын байр олдсонгүй.");
    }

    const divisionIds = [...new Set(job_positions.map((p) => p.divisionId))];
    if (divisionIds.length > 1) {
      throw new Error("All job_positions must belong to the same division");
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
      data: { isDeleted: true },
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
      where: { clauseId, isDeleted: false },
      include: {
        job_position: { select: { id: true, name: true, divisionId: true } },
      },
    });
    console.log("Clause job_positions fetched:", {
      clauseId,
      count: clausePositions.length,
    });
    return clausePositions;
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
        isDeleted: false,
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

import * as data from "@/lib/data";
import { job_positions, divisions } from "@/lib/data";

export async function createClausePositionsFromprisma(
  clauseId: string,
  job_positionIds: string[],
  type: type_clause_job_position
) {
  try {
    if (!clauseId || !job_positionIds.length || !type) {
      throw new Error("clauseId, job_positionIds, and type are required");
    }

    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Clause not found");

    // Тогтмол өгөгдлөөс job_position шалгах
    const validPositions = job_positions.filter((p) =>
      job_positionIds.includes(p.id)
    );
    if (validPositions.length !== job_positionIds.length) {
      throw new Error("Some job_positions not found");
    }

    // Бүх job_position нэг division-д хамаарах эсэхийг шалгах
    const divisionIds = [...new Set(validPositions.map((p) => p.divisionId))];
    if (divisionIds.length > 1) {
      throw new Error("All job_positions must belong to the same division");
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

export async function deleteClausePositionFromprisma(id: string) {
  try {
    const clausePosition = await prisma.clause_job_position.update({
      where: { id },
      data: { isDeleted: true },
    });
    console.log("Clause job_position deleted:", { id });
    return clausePosition;
  } catch (error) {
    console.error("deleteClausePosition error:", error);
    throw new Error("Failed to delete clause job_position");
  }
}

export async function getClausePositionsByClauseIdFromprisma(clauseId: string) {
  try {
    const clausePositions = await prisma.clause_job_position.findMany({
      where: { clauseId, isDeleted: false },
      include: { job_position: { select: { id: true, name: true } } },
    });
    // Тогтмол өгөгдлөөс divisionId нэмэх
    const enrichedPositions = clausePositions.map((cp) => {
      const job_position = job_positions.find(
        (p) => p.id === cp.job_positionId
      );
      return {
        ...cp,
        job_position: {
          ...cp.job_position,
          divisionId: job_position?.divisionId || "",
        },
      };
    });
    console.log("Clause job_positions fetched:", {
      clauseId,
      count: enrichedPositions.length,
    });
    return enrichedPositions;
  } catch (error) {
    console.error("getClausePositionsByClauseId error:", error);
    throw new Error("Failed to fetch clause job_positions");
  }
}

// ШИНЭ: Ажлын байрыг шүүх функц
export async function getFilteredPositions(
  divisionId: string,
  searchTerm: string = ""
) {
  try {
    if (!divisionId) throw new Error("divisionId required");
    const filteredPositions = job_positions.filter(
      (p) =>
        p.divisionId === divisionId &&
        (searchTerm
          ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
    console.log("Filtered job_positions:", {
      divisionId,
      count: filteredPositions.length,
    });
    return filteredPositions;
  } catch (error) {
    console.error("getFilteredPositions error:", error);
    throw new Error("Failed to fetch filtered job_positions");
  }
}

export async function createClausePositionExtended(
  clauseId: string,
  job_positionId: string,
  type: type_clause_job_position
) {
  try {
    if (!clauseId || !job_positionId || !type) {
      throw new Error("clauseId, job_positionId, and type are required");
    }

    // Заалт байгаа эсэхийг шалгах
    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Clause not found");

    // Ажлын байр тогтмол өгөгдөлд байгаа эсэх
    const validPosition = job_positions.find((p) => p.id === job_positionId);
    if (!validPosition) throw new Error("Position not found");

    // Одоо байгаа холбоосыг шалгах (давхардалгүй)
    const existing = await prisma.clause_job_position.findFirst({
      where: { clauseId, job_positionId, isDeleted: false },
    });
    if (existing) {
      // Хэрвээ type өөр бол шинэчлэх
      if (existing.type !== type) {
        await prisma.clause_job_position.update({
          where: { id: existing.id },
          data: { type },
        });
      }
      return { message: "Clause job_position already exists or updated" };
    }

    // Шинэ clause_job_position мөр нэмэх
    const clausePosition = await prisma.clause_job_position.create({
      data: {
        clauseId,
        job_positionId,
        type,
      },
    });

    console.log("Clause job_position created:", {
      clauseId,
      job_positionId,
      type,
    });
    return clausePosition;
  } catch (error) {
    console.error("createClausePositionExtended error:", error);
    throw new Error(
      `Failed to create clause job_position: ${(error as Error).message}`
    );
  }
}
