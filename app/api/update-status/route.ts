import { NextResponse } from "next/server";

function getGoogleSheetWebhookUrl() {
  return (
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    process.env.APPS_SCRIPT_URL ||
    process.env.INQUIRY_SCRIPT_URL ||
    ""
  );
}

export async function POST(req: Request) {
  try {
    const { row, status } = await req.json();

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          message: "상태를 변경할 문의 행 정보가 없습니다.",
        },
        { status: 400 }
      );
    }

    const webhookUrl = getGoogleSheetWebhookUrl();

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "GOOGLE_SHEET_WEBHOOK_URL 환경변수가 없습니다. Vercel 환경변수 또는 .env.local을 확인하세요.",
        },
        { status: 500 }
      );
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "updateStatus",
        row,
        status,
      }),
      cache: "no-store",
    });

    const text = await res.text();

    let data: {
      ok?: boolean;
      message?: string;
      row?: number | string;
      status?: string;
      [key: string]: unknown;
    };

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

    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: data.message || "상태 변경에 실패했습니다.",
          raw: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.message || "상태가 변경되었습니다.",
      row: data.row || row,
      status: data.status || status,
    });
  } catch (error) {
    console.error("UPDATE STATUS API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "상태 변경 API 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}