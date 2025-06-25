"use server";

import { prisma } from "@repo/database";
import { Clause, Policy } from "@/types";

export const createPolicy = async (data: Omit<Policy, "id" | "isDeleted">) => {
  try {
    if (data.referenceCode) {
      const existingPolicy = await prisma.policy.findUnique({
        where: { referenceCode: data.referenceCode },
      });
      if (existingPolicy) {
        throw new Error("Журмын код бүртгэлтэй байна");
      }
    }

    return await prisma.policy.create({
      data: {
        name: data.name,
        approvedDate: data.approvedDate ? new Date(data.approvedDate) : null,
        referenceCode: data.referenceCode,
      },
    });
  } catch (error) {
    throw new Error(`Журам нэмэхэд алдаа гарлаа: ${(error as Error).message}`);
  }
};

const buildClauseTree = (
  clauses: Clause[],
  parentId: string | null = null
): Clause[] => {
  return clauses
    .filter((clause) => clause.parentId === parentId && !clause.isDeleted)
    .map((clause) => ({
      ...clause,
      children: buildClauseTree(clauses, clause.id),
    }));
};

export const getPolicy = async (id: string) => {
  try {
    const policy = await prisma.policy.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        approvedDate: true,
        referenceCode: true,
        isDeleted: true,
      },
    });
    if (!policy) {
      throw new Error("Журам олдсонгүй");
    }

    const sections = await prisma.section.findMany({
      where: { policyId: policy.id, isDeleted: false },
      select: {
        id: true,
        policyId: true,
        text: true,
        referenceNumber: true,
        isDeleted: true,
      },
    });

    const sectionsWithClauses = await Promise.all(
      sections.map(async (section) => {
        const allClauses = await prisma.clause.findMany({
          where: { sectionId: section.id, isDeleted: false },
          select: {
            id: true,
            text: true,
            referenceNumber: true,
            sectionId: true,
            parentId: true,
            isDeleted: true,
          },
        });

        const clauseTree = buildClauseTree(allClauses);

        return { ...section, clause: clauseTree };
      })
    );

    return { ...policy, section: sectionsWithClauses };
  } catch (error) {
    throw new Error(`Журам хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getAllPolicies = async () => {
  try {
    return await prisma.policy.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        approvedDate: true,
        referenceCode: true,
      },
      orderBy: { approvedDate: "desc" },
    });
  } catch (error) {
    throw new Error(`Журмууд хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const updatePolicy = async (
  id: string,
  data: Partial<Omit<Policy, "id" | "isDeleted">>
) => {
  try {
    if (data.referenceCode) {
      const existingPolicy = await prisma.policy.findUnique({
        where: { referenceCode: data.referenceCode },
      });
      if (existingPolicy && existingPolicy.id !== id) {
        throw new Error("Журмын код бүртгэлтэй байна");
      }
    }

    return await prisma.policy.update({
      where: { id, isDeleted: false },
      data: {
        name: data.name ?? undefined,
        approvedDate: data.approvedDate
          ? new Date(data.approvedDate)
          : data.approvedDate === null
            ? null
            : undefined,
        referenceCode: data.referenceCode ?? undefined,
      },
    });
  } catch (error) {
    throw new Error(`Журам засахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const deletePolicy = async (id: string) => {
  try {
    const policy = await prisma.$transaction(async (tx) => {
      const updatedPolicy = await tx.policy.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
      });

      await tx.section.updateMany({
        where: { policyId: id, isDeleted: false },
        data: { isDeleted: true },
      });

      await tx.clause.updateMany({
        where: { section: { policyId: id }, isDeleted: false },
        data: { isDeleted: true },
      });

      return updatedPolicy;
    });

    console.log("Policy deleted with cascade:", { policyId: id });
    return policy;
  } catch (error) {
    console.error("Error in deletePolicy:", error);
    throw new Error(`Журам устгахад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const restorePolicy = async (id: string) => {
  try {
    const policy = await prisma.$transaction(async (tx) => {
      const updatedPolicy = await tx.policy.update({
        where: { id, isDeleted: true },
        data: { isDeleted: false },
      });

      await tx.section.updateMany({
        where: { policyId: id, isDeleted: true },
        data: { isDeleted: false },
      });

      await tx.clause.updateMany({
        where: { section: { policyId: id }, isDeleted: true },
        data: { isDeleted: false },
      });

      return updatedPolicy;
    });

    console.log("Policy restored with cascade:", { policyId: id });
    return policy;
  } catch (error) {
    throw new Error(
      `Журам сэргээхэд алдаа гарлаа: ${(error as Error).message}`
    );
  }
};

export const getPolicyOne = async (id: string) => {
  try {
    const policy = await prisma.policy.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        approvedDate: true,
        referenceCode: true,
        isDeleted: true,
      },
    });
    return policy;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Тодорхой бус алдаа гарлаа");
    }
  }
};
