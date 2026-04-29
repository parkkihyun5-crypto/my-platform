import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request): Promise<Response> {
  try {
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "GOOGLE_SHEET_WEBHOOK_URL 환경변수가 없습니다.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "updateStatus",
        row: body.row,
        status: body.status,
      }),
    });

    const text = await response.text();

    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      result = {
        ok: false,
        message: "Apps Script 응답이 JSON이 아닙니다.",
        raw: text,
      };
    }

    if (!response.ok || result.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: result.message || "상태 변경 실패",
          detail: result,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "상태 변경 중 서버 오류",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}