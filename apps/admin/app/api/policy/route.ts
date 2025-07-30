import { NextResponse } from "next/server";
import {
  createPolicy,
  getPolicy,
  updatePolicy,
  deletePolicy,
  restorePolicy,
} from "@/action/PolicyService";
import { prisma } from "@repo/database";
import { Prisma } from "@repo/database/generated/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const id = searchParams.get("id");

  if (id) {
    const policy = await getPolicy(id);
    return NextResponse.json(policy);
  }

  const skip = (page - 1) * pageSize;

  const where: Prisma.policyWhereInput = {
    isDeleted: false,
    OR: search
      ? [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            referenceCode: {
              contains: search,
              mode: "insensitive" as const,
            },
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

  return NextResponse.json({
    items,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
  });
}

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (id) {
//       const policy = await getPolicy(id);
//       return NextResponse.json(policy);
//     }

//     const policies = await getAllPolicies();
//     return NextResponse.json(policies);
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 400 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const policy = await createPolicy(data);
    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Журмын ID шаардлагатай" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const updatedPolicy = await updatePolicy(id, data);
    return NextResponse.json(updatedPolicy);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Журмын ID шаардлагатай" },
        { status: 400 }
      );
    }
    const deletedPolicy = await deletePolicy(id);
    return NextResponse.json(deletedPolicy);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Журмын ID шаардлагатай" },
        { status: 400 }
      );
    }

    const restoredPolicy = await restorePolicy(id);
    return NextResponse.json(restoredPolicy, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
