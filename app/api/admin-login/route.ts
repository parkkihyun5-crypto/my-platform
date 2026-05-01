import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "npolap_admin_auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || "";
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || "";

    if (!adminPassword || !sessionToken) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "관리자 환경변수가 설정되어 있지 않습니다. ADMIN_PASSWORD와 ADMIN_SESSION_TOKEN을 확인하세요.",
        },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 암호가 올바르지 않습니다.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      message: "관리자 인증이 완료되었습니다.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "관리자 로그인 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}