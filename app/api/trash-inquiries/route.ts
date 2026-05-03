import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GoogleTrashResponse = {
  ok?: boolean;
  source?: string;
  sheetName?: string;
  items?: unknown[];
  message?: string;
  detail?: unknown;
};

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

    const googleResponse = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    const text = await googleResponse.text();

    let data: GoogleTrashResponse;

    try {
      data = text ? (JSON.parse(text) as GoogleTrashResponse) : {};
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "휴지통 목록 응답을 해석할 수 없습니다.",
          detail: text,
        },
        { status: 500 }
      );
    }

    if (!googleResponse.ok || data.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: data.message || "휴지통 목록 조회에 실패했습니다.",
          detail: data.detail || data,
        },
        { status: 500 }
      );
    }

    if (data.source && data.source !== "trash") {
      return NextResponse.json(
        {
          ok: false,
          message: "휴지통 API가 휴지통 시트가 아닌 다른 시트를 반환했습니다.",
          detail: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        source: data.source || "trash",
        sheetName: data.sheetName || "휴지통",
        items: data.items || [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
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