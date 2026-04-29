import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<Response> {
  try {
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({
        ok: false,
        items: [],
        message: "GOOGLE_SHEET_WEBHOOK_URL 환경변수가 없습니다.",
      });
    }

    const response = await fetch(webhookUrl, {
      method: "GET",
      cache: "no-store",
    });

    const text = await response.text();
    const data = JSON.parse(text);

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data.items) ? data.items : [],
      raw: data,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      items: [],
      message: "Google Sheet 조회 실패",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const token = process.env.GOOGLE_SHEET_SECRET_TOKEN || "npolap-2026";

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
        token,
        organization: body.organization ?? "",
        name: body.name ?? "",
        phone: body.phone ?? "",
        email: body.email ?? "",
        message: body.message ?? "",
        sourcePage: body.sourcePage ?? "",
        serviceType: body.serviceType ?? "",
      }),
    });

    const text = await response.text();

    let result: any;
    try {
      result = JSON.parse(text);
    } catch {
      result = { ok: false, message: "Apps Script 응답이 JSON이 아닙니다.", raw: text };
    }

    if (!response.ok || result.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message: result.message || result.error || "Google Sheet 저장 실패",
          detail: result,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "문의가 정상 접수되었습니다.",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "문의 접수 중 서버 오류",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}