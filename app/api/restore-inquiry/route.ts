import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getWebhookUrl(): string {
  return (
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    ""
  );
}

async function parseGoogleScriptResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return {
      ok: false,
      message: "Google Apps Script 응답을 JSON으로 해석할 수 없습니다.",
      detail: text,
    };
  }
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

    const trashId = String(body.trashId || body.id || "").trim();
    const trashRow = String(body.trashRow || "").trim();

    if (!trashId && !trashRow) {
      return NextResponse.json(
        {
          ok: false,
          message: "복원할 휴지통 문의 ID가 없습니다.",
        },
        { status: 400 }
      );
    }

    const googleResponse = await fetch(webhookUrl, {
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

    const data = await parseGoogleScriptResponse(googleResponse);

    if (!googleResponse.ok || !data?.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: data?.message || "문의 복원에 실패했습니다.",
          detail: data?.detail || data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: data.message || "문의가 복원되었습니다.",
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
            : "문의 복원 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}