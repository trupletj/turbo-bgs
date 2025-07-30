import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/sign-out") {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user?.id || session?.user?.role_version === undefined) {
    return NextResponse.next();
  }

  try {
    const versionCheckUrl = new URL("/api/check-version", req.url);
    const response = await fetch(versionCheckUrl.toString(), {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Version check failed");

    const { versionMatch } = await response.json();

    if (!versionMatch) {
      const response = NextResponse.redirect(new URL("/sign-out", req.url));
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");
      return response;
    }
  } catch (error) {
    console.error("Version check error:", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/opt",
    "/((?!api|_next|sign-out|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp)$).*)",
  ],
};
