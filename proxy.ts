import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "npolap_admin_auth";

const ADMIN_API_PATHS = [
  "/api/update-status",
  "/api/update-admin-fields",
  "/api/delete-inquiry",
  "/api/contracts",
];

function isProtectedAdminPage(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isProtectedAdminApi(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  if (ADMIN_API_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return true;
  }

  if (pathname === "/api/inquiry") {
    return request.method !== "POST" && request.method !== "OPTIONS";
  }

  return false;
}

function isAuthorized(request: NextRequest): boolean {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || "";
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value || "";

  if (!sessionToken) return false;
  if (!cookieToken) return false;

  return cookieToken === sessionToken;
}

function unauthorizedJson() {
  return NextResponse.json(
    {
      ok: false,
      message: "관리자 인증이 필요합니다.",
    },
    {
      status: 401,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedAdminPage = isProtectedAdminPage(pathname);
  const protectedAdminApi = isProtectedAdminApi(request);

  if (!protectedAdminPage && !protectedAdminApi) {
    return NextResponse.next();
  }

  if (isAuthorized(request)) {
    return NextResponse.next();
  }

  if (protectedAdminApi) {
    return unauthorizedJson();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin-login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/inquiry",
    "/api/update-status/:path*",
    "/api/update-admin-fields/:path*",
    "/api/delete-inquiry/:path*",
    "/api/contracts/:path*",
  ],
};