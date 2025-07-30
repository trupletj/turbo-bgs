import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@repo/database";

export async function GET() {
  try {
    // Хэрэглэгчийн session-г шалгах
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { user_id: session.user.id },
      select: { role_version: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const versionMatch = session.user.role_version === profile.role_version;

    return NextResponse.json({
      versionMatch,
      sessionVersion: session.user.role_version,
      dbVersion: profile.role_version,
    });
  } catch (error) {
    console.error("Version check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
