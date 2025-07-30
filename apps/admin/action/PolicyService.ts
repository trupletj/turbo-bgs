"use server";

import { prisma } from "@repo/database";
import { Clause, Policy } from "@/types/index";
import { Prisma } from "@repo/database/generated/prisma/client";

export const createPolicy = async (data: Omit<Policy, "id" | "isDeleted">) => {
  try {
    if (data.referenceCode) {
      const existingPolicy = await prisma.policy.findUnique({
        where: { referenceCode: data.referenceCode, isDeleted: false },
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

export const createEmptyPolicy = async () => {
  try {
    return await prisma.policy.create({
      data: {
        referenceCode: "ref-" + Date.now(),
      },
    });
  } catch (error) {
    throw new Error(`Журам үүсгэхэд алдаа гарлаа: ${(error as Error).message}`);
  }
};

const sortByReferenceNumberSection = (
  a: { referenceNumber: string | null },
  b: { referenceNumber: string | null }
) => {
  const refA = (a.referenceNumber ?? "").split(".").map(Number);
  const refB = (b.referenceNumber ?? "").split(".").map(Number);

  for (let i = 0; i < Math.max(refA.length, refB.length); i++) {
    const partA = refA[i] ?? 0;
    const partB = refB[i] ?? 0;

    if (partA !== partB) {
      return partA - partB;
    }
  }

  return 0;
};

const sortByReferenceNumber = (a: Clause, b: Clause) => {
  const refA = a.referenceNumber.split(".").map(Number);
  const refB = b.referenceNumber.split(".").map(Number);

  for (let i = 0; i < Math.max(refA.length, refB.length); i++) {
    const partA = refA[i] ?? 0;
    const partB = refB[i] ?? 0;

    if (partA !== partB) {
      return partA - partB;
    }
  }

  return 0;
};

const buildClauseTree = (
  clauses: Clause[],
  parentId: string | null = null
): Clause[] => {
  return clauses
    .filter((clause) => clause.parentId === parentId && !clause.isDeleted)
    .sort(sortByReferenceNumber)
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

    sections.sort(sortByReferenceNumberSection);

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

        const clauseTree = buildClauseTree(allClauses); // ← sorted recursively

        return { ...section, clause: clauseTree };
      })
    );

    return { ...policy, section: sectionsWithClauses };
  } catch (error) {
    throw new Error(`Журам хайхад алдаа гарлаа: ${(error as Error).message}`);
  }
};

export const getAllPoliciesPage = async ({
  page = 1,
  pageSize = 10,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  try {
    const skip = (page - 1) * pageSize;

    const where: Prisma.policyWhereInput = {
      isDeleted: false,
      AND: search
        ? [
            {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { referenceCode: { contains: search, mode: "insensitive" } },
              ],
            },
          ]
        : undefined,
    };

    const [items, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          name: true,
          approvedDate: true,
          referenceCode: true,
        },
        orderBy: {
          approvedDate: "desc",
        },
      }),
      prisma.policy.count({ where }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Журмууд хайхад алдаа гарлаа: ${(error as Error).message}`);
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

export const getPolicyOne = async (args: Prisma.policyFindManyArgs = {}) => {
  try {
    const policy = await prisma.policy.findFirst(args);
    return policy;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Тодорхой бус алдаа гарлаа");
    }
  }
};

export async function newPolicy(formData: FormData) {
  const name = formData.get("name") as string;
  const approvedDate = formData.get("approvedDate") as string;
  const referenceCode = formData.get("referenceCode") as string;

  try {
    const createdPolicy = await prisma.policy.create({
      data: {
        name: name || null,
        approvedDate: approvedDate ? new Date(approvedDate) : null,
        referenceCode,
        isDeleted: false,
      },
    });

    return createdPolicy; // Үүссэн policy буцаана
  } catch (error) {
    console.error("Policy үүсгэхэд алдаа гарлаа:", error);
    throw new Error("Policy үүсгэхэд алдаа гарлаа");
  }
}

export async function editPolicy({
  id,
  name,
  referenceCode,
  approvedDate,
}: {
  id: string;
  name?: string;
  referenceCode?: string;
  approvedDate?: Date;
}) {
  const clauseJobPosition = await prisma.policy.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(referenceCode !== undefined && { referenceCode }),
      ...(approvedDate !== undefined && { approvedDate }),
    },
  });

  return clauseJobPosition;
}

export async function getSinglePolicy(id: string) {
  const policy = await prisma.policy.findUnique({
    where: { id, isDeleted: false },
  });

  if (!policy) {
    throw new Error("Журам олдсонгүй");
  }

  return policy;
}

export async function updatePolicyField(
  id: string,
  field: "name" | "referenceCode" | "approvedDate",
  value: string
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    await prisma.policy.update({
      where: { id },
      data: {
        [field]: field === "approvedDate" ? new Date(value) : value,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("update error", error); // 👉 энэ log-г шалгах
    if (error && error.code === "P2002") {
      return {
        success: false,
        message: `${field === "referenceCode" ? "Журмын код" : field} давхардсан байна`,
      };
    }

    return {
      success: false,
      message: "Сервер дээр алдаа гарлаа",
    };
  }
}
