"use server";

import { prisma } from "@repo/database";
import { type_clause_position } from "@repo/database/generated/prisma/client/client";

export async function createClausePositions(
  clauseId: string,
  positionIds: string[],
  type: type_clause_position
) {
  try {
    if (!clauseId || !positionIds.length || !type) {
      throw new Error("clauseId, positionIds болон type шаардлагатай");
    }

    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Заалт олдсонгүй");

    const positions = await prisma.position.findMany({
      where: { id: { in: positionIds }, isDeleted: false },
      select: { id: true, divisionId: true },
    });
    if (positions.length !== positionIds.length) {
      throw new Error("Ажлын байр олдсонгүй.");
    }

    const divisionIds = [...new Set(positions.map((p) => p.divisionId))];
    if (divisionIds.length > 1) {
      throw new Error("All positions must belong to the same division");
    }

    const clausePositions = await prisma.clause_position.createMany({
      data: positionIds.map((positionId) => ({
        clauseId,
        positionId,
        type,
      })),
    });

    console.log("Clause positions created:", {
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
    const clausePosition = await prisma.clause_position.update({
      where: { id },
      data: { isDeleted: true },
    });
    console.log("Clause position deleted:", { id });
    return clausePosition;
  } catch (error) {
    console.error("deleteClausePosition error:", error);
    throw new Error("Failed to delete clause position");
  }
}

export async function getClausePositionsByClauseId(clauseId: string) {
  try {
    const clausePositions = await prisma.clause_position.findMany({
      where: { clauseId, isDeleted: false },
      include: {
        position: { select: { id: true, name: true, divisionId: true } },
      },
    });
    console.log("Clause positions fetched:", {
      clauseId,
      count: clausePositions.length,
    });
    return clausePositions;
  } catch (error) {
    console.error("getClausePositionsByClauseId error:", error);
    throw new Error("Failed to fetch clause positions");
  }
}

export async function getClausesByPositionId(positionId: string) {
  try {
    const clausesId = await prisma.clause_position.findMany({
      where: {
        positionId,
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
import { positions, divisions } from "@/lib/data";

export async function createClausePositionsFromprisma(
  clauseId: string,
  positionIds: string[],
  type: type_clause_position
) {
  try {
    if (!clauseId || !positionIds.length || !type) {
      throw new Error("clauseId, positionIds, and type are required");
    }

    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Clause not found");

    // Тогтмол өгөгдлөөс position шалгах
    const validPositions = positions.filter((p) => positionIds.includes(p.id));
    if (validPositions.length !== positionIds.length) {
      throw new Error("Some positions not found");
    }

    // Бүх position нэг division-д хамаарах эсэхийг шалгах
    const divisionIds = [...new Set(validPositions.map((p) => p.divisionId))];
    if (divisionIds.length > 1) {
      throw new Error("All positions must belong to the same division");
    }

    const clausePositions = await prisma.clause_position.createMany({
      data: positionIds.map((positionId) => ({
        clauseId,
        positionId,
        type,
      })),
    });

    console.log("Clause positions created:", {
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
    const clausePosition = await prisma.clause_position.update({
      where: { id },
      data: { isDeleted: true },
    });
    console.log("Clause position deleted:", { id });
    return clausePosition;
  } catch (error) {
    console.error("deleteClausePosition error:", error);
    throw new Error("Failed to delete clause position");
  }
}

export async function getClausePositionsByClauseIdFromprisma(clauseId: string) {
  try {
    const clausePositions = await prisma.clause_position.findMany({
      where: { clauseId, isDeleted: false },
      include: { position: { select: { id: true, name: true } } },
    });
    // Тогтмол өгөгдлөөс divisionId нэмэх
    const enrichedPositions = clausePositions.map((cp) => {
      const position = positions.find((p) => p.id === cp.positionId);
      return {
        ...cp,
        position: {
          ...cp.position,
          divisionId: position?.divisionId || "",
        },
      };
    });
    console.log("Clause positions fetched:", {
      clauseId,
      count: enrichedPositions.length,
    });
    return enrichedPositions;
  } catch (error) {
    console.error("getClausePositionsByClauseId error:", error);
    throw new Error("Failed to fetch clause positions");
  }
}

// ШИНЭ: Ажлын байрыг шүүх функц
export async function getFilteredPositions(
  divisionId: string,
  searchTerm: string = ""
) {
  try {
    if (!divisionId) throw new Error("divisionId required");
    const filteredPositions = positions.filter(
      (p) =>
        p.divisionId === divisionId &&
        (searchTerm
          ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
    console.log("Filtered positions:", {
      divisionId,
      count: filteredPositions.length,
    });
    return filteredPositions;
  } catch (error) {
    console.error("getFilteredPositions error:", error);
    throw new Error("Failed to fetch filtered positions");
  }
}

export async function createClausePositionExtended(
  clauseId: string,
  positionId: string,
  type: type_clause_position
) {
  try {
    if (!clauseId || !positionId || !type) {
      throw new Error("clauseId, positionId, and type are required");
    }

    // Заалт байгаа эсэхийг шалгах
    const clause = await prisma.clause.findUnique({ where: { id: clauseId } });
    if (!clause) throw new Error("Clause not found");

    // Ажлын байр тогтмол өгөгдөлд байгаа эсэх
    const validPosition = positions.find((p) => p.id === positionId);
    if (!validPosition) throw new Error("Position not found");

    // Одоо байгаа холбоосыг шалгах (давхардалгүй)
    const existing = await prisma.clause_position.findFirst({
      where: { clauseId, positionId, isDeleted: false },
    });
    if (existing) {
      // Хэрвээ type өөр бол шинэчлэх
      if (existing.type !== type) {
        await prisma.clause_position.update({
          where: { id: existing.id },
          data: { type },
        });
      }
      return { message: "Clause position already exists or updated" };
    }

    // Шинэ clause_position мөр нэмэх
    const clausePosition = await prisma.clause_position.create({
      data: {
        clauseId,
        positionId,
        type,
      },
    });

    console.log("Clause position created:", { clauseId, positionId, type });
    return clausePosition;
  } catch (error) {
    console.error("createClausePositionExtended error:", error);
    throw new Error(
      `Failed to create clause position: ${(error as Error).message}`
    );
  }
}
