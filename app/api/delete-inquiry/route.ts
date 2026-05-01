import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function POST(req: Request) {
  try {
    const { row } = await req.json();

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          message: "삭제할 문의 행 정보가 없습니다.",
        },
        { status: 400 }
      );
    }

    if (!GOOGLE_SCRIPT_URL) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "GOOGLE_SCRIPT_URL 환경변수가 설정되어 있지 않습니다. .env.local 또는 Vercel 환경변수를 확인하세요.",
        },
        { status: 500 }
      );
    }

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "deleteInquiry",
        row,
      }),
      cache: "no-store",
    });

    const text = await res.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script 응답을 JSON으로 해석하지 못했습니다.",
          raw: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE INQUIRY API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "문의 삭제 API 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}