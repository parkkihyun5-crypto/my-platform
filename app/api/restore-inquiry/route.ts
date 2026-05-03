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
      trashId?: string;
      trashRow?: string;
      id?: string;
    };

    const trashId = body.trashId || body.id || "";
    const trashRow = body.trashRow || "";

    if (!trashId && !trashRow) {
      return NextResponse.json(
        {
          ok: false,
          message: "복원할 휴지통 문의 ID가 없습니다.",
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
        action: "restoreInquiry",
        trashId,
        trashRow,
      }),
      cache: "no-store",
    });

    const text = await response.text();

    let data: unknown;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "복원 응답을 해석할 수 없습니다.",
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
            : "문의 복원 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}