import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorizedResponse(): NextResponse {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

export function middleware(request: NextRequest): NextResponse {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  try {
    const base64 = authorization.split(" ")[1] ?? "";
    const decoded = atob(base64);
    const [id, password] = decoded.split(":");

    if (id === adminId && password === adminPassword) {
      return NextResponse.next();
    }

    return unauthorizedResponse();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};