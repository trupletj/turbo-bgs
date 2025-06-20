"use server";
import { prisma } from "@repo/database";

export async function getDivisions() {
  try {
    const divisions = await prisma.division.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        department: {
          select: {
            id: true,
            name: true,
            company: { select: { id: true, name: true } },
          },
        },
      },
    });
    console.log("Divisions fetched:", { count: divisions.length });
    return divisions;
  } catch (error) {
    console.error("getDivisions error:", error);
    throw new Error("Failed to fetch divisions");
  }
}

export async function getPositionsByDivisionId(divisionId: string) {
  try {
    if (!divisionId) throw new Error("divisionId required");
    const positions = await prisma.position.findMany({
      where: { divisionId, isDeleted: false },
      select: { id: true, name: true, divisionId: true },
    });
    console.log("Positions fetched:", { divisionId, count: positions.length });
    return positions;
  } catch (error) {
    console.error("getPositionsByDivisionId error:", error);
    throw new Error("Failed to fetch positions");
  }
}
