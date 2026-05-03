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
      message: "Google Apps Script ?묐떟??JSON?쇰줈 ?댁꽍?????놁뒿?덈떎.",
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
          message: "Google Sheet Webhook URL???ㅼ젙?섏뼱 ?덉? ?딆뒿?덈떎.",
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
          message: "蹂듭썝???댁???臾몄쓽 ID媛 ?놁뒿?덈떎.",
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
          message: data?.message || "臾몄쓽 蹂듭썝???ㅽ뙣?덉뒿?덈떎.",
          detail: data?.detail || data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: data.message || "臾몄쓽媛 蹂듭썝?섏뿀?듬땲??",
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
            : "臾몄쓽 蹂듭썝 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.",
      },
      { status: 500 }
    );
  }
}
