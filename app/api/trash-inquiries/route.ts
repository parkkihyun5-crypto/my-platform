import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getWebhookUrl(): string {
  return (
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    ""
  );
}

export async function GET(): Promise<Response> {
  try {
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Sheet Webhook URL이 설정되어 있지 않습니다.",
        },
        { status: 500 }
      );
    }

    const url = new URL(webhookUrl);
    url.searchParams.set("action", "listTrash");
    url.searchParams.set("t", String(Date.now()));

    const response = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();

    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "휴지통 응답을 해석할 수 없습니다.",
          detail: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: response.ok ? 200 : response.status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "휴지통 목록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}