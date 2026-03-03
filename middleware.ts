import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const hasSession = Boolean(
    req.cookies.get("admin_session")?.value
  );

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin-login", req.url);

  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};


