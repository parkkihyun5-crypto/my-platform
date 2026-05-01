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

export async function GET() {
  try {
    const webhookUrl = getGoogleSheetWebhookUrl();

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          items: [],
          message:
            "GOOGLE_SHEET_WEBHOOK_URL 환경변수가 없습니다. Vercel 환경변수 또는 .env.local을 확인하세요.",
        },
        { status: 500 }
      );
    }

    const res = await fetch(`${webhookUrl}?t=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
    });

    const text = await res.text();

    let data: {
      ok?: boolean;
      items?: unknown[];
      message?: string;
      [key: string]: unknown;
    };

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          items: [],
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
          items: [],
          message: data.message || "Google Sheet 조회 실패",
          raw: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data.items) ? data.items : [],
    });
  } catch (error) {
    console.error("INQUIRY GET API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        items: [],
        message: "Google Sheet 조회 실패",
      },
      { status: 500 }
    );
  }
}