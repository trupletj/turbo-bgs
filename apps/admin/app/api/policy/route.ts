import { NextResponse } from "next/server";
import {
  createPolicy,
  getPolicy,
  getAllPolicies,
  updatePolicy,
  deletePolicy,
  restorePolicy,
} from "@/action/PolicyService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const policy = await getPolicy(id);
      return NextResponse.json(policy);
    }

    const policies = await getAllPolicies();
    return NextResponse.json(policies);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

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
