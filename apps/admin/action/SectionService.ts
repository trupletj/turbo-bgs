"use server";

import { prisma } from "@repo/database";
import { Section } from "@/types";

export const createSection = async (
  data: Omit<Section, "id" | "isDeleted">
) => {
  try {
    if (data.policyId) {
      const policy = await prisma.policy.findFirst({
        where: { id: data.policyId, isDeleted: false },
      });
      if (!policy) {
        throw new Error("Холбогдох журам олдсонгүй");
      }
    }

    return await prisma.section.create({
      data: {
        policyId: data.policyId,
        referenceNumber: data.referenceNumber,
        text: data.text,
        isDeleted: false,
      },
    });
  } catch (error) {
    throw new Error(`Бүлэг нэмэхэд алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getSection = async (id: string) => {
  try {
    const section = await prisma.section.findFirst({
      where: { id, isDeleted: false },
      include: {
        clause: { where: { isDeleted: false } },
        policy: { where: { isDeleted: false } },
      },
    });
    if (!section) {
      throw new Error("Бүлэг олдсонгүй");
    }
    return section;
  } catch (error) {
    throw new Error(`Бүлэг хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getAllSections = async (policyId?: string) => {
  try {
    return await prisma.section.findMany({
      where: { policyId: policyId || undefined, isDeleted: false },
      include: { clause: { where: { isDeleted: false } } },
      orderBy: { referenceNumber: "asc" },
    });
  } catch (error) {
    throw new Error(`Бүлгүүд хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const updateSection = async (
  id: string,
  data: Partial<Omit<Section, "id" | "isDeleted">>
) => {
  try {
    if (data.policyId) {
      const policy = await prisma.policy.findFirst({
        where: { id: data.policyId, isDeleted: false },
      });
      if (!policy) {
        throw new Error("Холбогдох журам олдсонгүй");
      }
    }

    return await prisma.section.update({
      where: { id, isDeleted: false },
      data: {
        policyId: data.policyId ?? undefined,
        referenceNumber: data.referenceNumber ?? undefined,
        text: data.text ?? undefined,
      },
    });
  } catch (error) {
    throw new Error(`Бүлэг засахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const deleteSection = async (id: string) => {
  try {
    return await prisma.section.update({
      where: { id, isDeleted: false },
      data: { isDeleted: true },
    });
  } catch (error) {
    throw new Error(`Бүлэг устгахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const restoreSection = async (id: string) => {
  try {
    const section = await prisma.section.findUnique({
      where: { id },
      select: { isDeleted: true },
    });
    if (!section) {
      throw new Error("Бүлэг олдсонгүй");
    }

    if (!section.isDeleted) {
      throw new Error("Бүлэг аль хэдийн идэвхтэй байна");
    }

    return await prisma.section.update({
      where: { id },
      data: { isDeleted: false },
    });
  } catch (error) {
    throw new Error(
      `Бүлгийг сэргээхэд алдаа гарлаа: ${(error as Error).message}`
    );
  }
};
