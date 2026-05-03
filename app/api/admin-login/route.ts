import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "npolap_admin_auth";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const normalizedA = a.trim().toLowerCase();
  const normalizedB = b.trim().toLowerCase();

  if (!normalizedA || !normalizedB) return false;
  if (normalizedA.length !== normalizedB.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(normalizedA, "hex"),
      Buffer.from(normalizedB, "hex")
    );
  } catch {
    return false;
  }
}

function jsonResponse(
  body: { ok: boolean; message: string },
  status: number
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      password?: string;
    };

    const password = typeof body.password === "string" ? body.password : "";

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
    const legacyAdminPassword = process.env.ADMIN_PASSWORD || "";
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || "";

    if ((!adminPasswordHash && !legacyAdminPassword) || !sessionToken) {
      return jsonResponse(
        {
          ok: false,
          message: "관리자 인증 환경변수가 설정되어 있지 않습니다.",
        },
        500
      );
    }

    const inputHash = sha256Hex(password);

    const passwordMatched = adminPasswordHash
      ? safeEqualHex(inputHash, adminPasswordHash)
      : password === legacyAdminPassword;

    if (!passwordMatched) {
      return jsonResponse(
        {
          ok: false,
          message: "관리자 인증에 실패했습니다.",
        },
        401
      );
    }

    const response = jsonResponse(
      {
        ok: true,
        message: "관리자 인증이 완료되었습니다.",
      },
      200
    );

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: "관리자 로그인 처리 중 오류가 발생했습니다.",
      },
      500
    );
  }
}