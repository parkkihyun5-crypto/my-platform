import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getWebhookUrl(): string {
  return (
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    ""
  );
}

export async function POST(request: Request): Promise<Response> {
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

    const body = (await request.json()) as {
      trashRow?: string;
      id?: string;
    };

    const trashRow = body.trashRow || body.id;

    if (!trashRow) {
      return NextResponse.json(
        {
          ok: false,
          message: "영구 삭제할 휴지통 행 번호가 없습니다.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "permanentDeleteInquiry",
        trashRow,
      }),
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
          message: "영구 삭제 응답을 해석할 수 없습니다.",
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
            : "문의 영구 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}