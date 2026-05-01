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
    const body = await req.json();
    const { row, manager, priority, memo } = body;

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자 정보를 저장할 문의 행 정보가 없습니다.",
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
            "Google Sheet Webhook URL 환경변수가 없습니다. Vercel 환경변수 또는 .env.local을 확인하세요.",
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
        action: "updateAdminFields",
        row,
        manager,
        priority,
        memo,
      }),
      cache: "no-store",
    });

    const text = await res.text();

    let data: {
      ok?: boolean;
      message?: string;
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
          message: data.message || "관리자 정보 저장에 실패했습니다.",
          raw: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: data.message || "관리자 정보가 저장되었습니다.",
    });
  } catch (error) {
    console.error("UPDATE ADMIN FIELDS API ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "관리자 정보 저장 API 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}