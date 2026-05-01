import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "npolap_admin_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLoginPage = pathname === "/admin-login";

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const sessionToken = process.env.ADMIN_SESSION_TOKEN || "";
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";

  if (!sessionToken || cookieToken !== sessionToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin-login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLoginPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};