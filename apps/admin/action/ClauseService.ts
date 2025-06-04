import { Clause } from "@/types";
import { prisma } from "@repo/database";

export const createClause = async (
  data: Omit<Clause, "id" | "isDeleted" | "children">
) => {
  try {
    if (data.sectionId) {
      const section = await prisma.section.findFirst({
        where: { id: data.sectionId, isDeleted: false },
      });
      if (!section) {
        throw new Error("Холбогдох бүлэг олдсонгүй");
      }
    }
    if (data.parentId) {
      const parent = await prisma.clause.findFirst({
        where: { id: data.parentId, isDeleted: false },
      });
      if (!parent) {
        throw new Error("Холбогдох эцэг заалт олдсонгүй");
      }
    }

    return await prisma.clause.create({
      data: {
        text: data.text,
        referenceNumber: data.referenceNumber,
        sectionId: data.sectionId,
        parentId: data.parentId,
        isDeleted: false,
      },
    });
  } catch (error) {
    throw new Error(`Заалт нэмэхэд алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getClause = async (id: string) => {
  try {
    const clause = await prisma.clause.findFirst({
      where: { id, isDeleted: false },
      include: {
        section: { where: { isDeleted: false } },
        clausePosition: {
          include: { position: { where: { isDeleted: false } } },
        },
      },
    });
    if (!clause) {
      throw new Error("Заалт олдсонгүй");
    }
    return clause;
  } catch (error) {
    throw new Error(`Заалт хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getAllClauses = async (sectionId?: string) => {
  try {
    return await prisma.clause.findMany({
      where: { sectionId: sectionId || undefined, isDeleted: false },
      include: {
        clausePosition: {
          include: { position: { where: { isDeleted: false } } },
        },
      },
      orderBy: { referenceNumber: "asc" },
    });
  } catch (error) {
    throw new Error(
      `Заалтууд хайхад алдаа гарлаа: ${(error as Error).message}`
    );
  }
};

export const updateClause = async (
  id: string,
  data: Partial<Omit<Clause, "id" | "isDeleted" | "children">>
) => {
  try {
    if (data.sectionId) {
      const section = await prisma.section.findFirst({
        where: { id: data.sectionId, isDeleted: false },
      });
      if (!section) {
        throw new Error("Холбогдох бүлэг олдсонгүй");
      }
    }
    if (data.parentId) {
      const parent = await prisma.clause.findFirst({
        where: { id: data.parentId, isDeleted: false },
      });
      if (!parent) {
        throw new Error("Холбогдох эцэг заалт олдсонгүй");
      }
    }

    return await prisma.clause.update({
      where: { id, isDeleted: false },
      data: {
        text: data.text ?? undefined,
        referenceNumber: data.referenceNumber ?? undefined,
        sectionId: data.sectionId ?? undefined,
        parentId: data.parentId ?? undefined,
      },
    });
  } catch (error) {
    throw new Error(`Заалт засахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const deleteClause = async (id: string) => {
  try {
    return await prisma.clause.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw new Error(`Заалт устгахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const restoreClause = async (id: string) => {
  try {
    const clause = await prisma.clause.findUnique({
      where: { id },
      select: { isDeleted: true },
    });

    if (!clause) {
      throw new Error("Заалт олдсонгүй");
    }

    if (!clause.isDeleted) {
      throw new Error("Заалт аль хэдийн идэвхтэй байна");
    }

    return await prisma.clause.update({
      where: { id },
      data: { isDeleted: false },
    });
  } catch (error) {
    throw new Error(
      `Заалтыг сэргээхэд алдаа гарлаа: ${(error as Error).message}`
    );
  }
};
