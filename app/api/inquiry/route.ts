import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type InquiryPayload = {
  organization?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  sourcePage?: string;
  serviceType?: string;
};

function getAppsScriptUrl(): string {
  const url =
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    "";

  return url.trim();
}

async function parseAppsScriptResponse(response: Response) {
  const rawText = await response.text();

  if (!rawText.trim()) {
    return {
      ok: false,
      message: "Google Apps Script에서 빈 응답을 반환했습니다.",
      detail: "",
      rawText,
    };
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      message: "Google Apps Script 응답을 JSON으로 해석하지 못했습니다.",
      detail: rawText.slice(0, 1000),
      rawText,
    };
  }
}

export async function GET(): Promise<Response> {
  try {
    const appsScriptUrl = getAppsScriptUrl();

    if (!appsScriptUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script URL 환경변수가 설정되지 않았습니다.",
          detail:
            ".env.local 또는 Vercel 환경변수에 GOOGLE_APPS_SCRIPT_URL 값을 설정하세요.",
          items: [],
        },
        { status: 500 }
      );
    }

    const requestUrl = `${appsScriptUrl}${
      appsScriptUrl.includes("?") ? "&" : "?"
    }t=${Date.now()}`;

    const response = await fetch(requestUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await parseAppsScriptResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script 호출에 실패했습니다.",
          detail: data?.detail || data?.message || `HTTP ${response.status}`,
          appsScriptStatus: response.status,
          items: [],
        },
        { status: 502 }
      );
    }

    if (data?.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message:
            data.message || "Google Apps Script 처리 중 오류가 발생했습니다.",
          detail: data.detail || "",
          received: data,
          items: [],
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        source: data?.source || "google-apps-script",
        sheetName: data?.sheetName || "문의목록",
        items: Array.isArray(data?.items) ? data.items : [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "문의 데이터를 불러오는 중 서버 오류가 발생했습니다.",
        detail: error instanceof Error ? error.message : String(error),
        items: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const appsScriptUrl = getAppsScriptUrl();

    if (!appsScriptUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script URL 환경변수가 설정되지 않았습니다.",
          detail:
            ".env.local 또는 Vercel 환경변수에 GOOGLE_APPS_SCRIPT_URL 값을 설정하세요.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as InquiryPayload;

    const payload = {
      action: "createInquiry",
      organization: body.organization || "",
      name: body.name || "",
      phone: body.phone || "",
      email: body.email || "",
      message: body.message || "",
      sourcePage: body.sourcePage || "",
      serviceType: body.serviceType || "",
      status: "new",
      priority: "none",
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      return NextResponse.json(
        {
          ok: false,
          message: "필수 항목이 누락되었습니다.",
          detail: "성명, 연락처, 이메일, 문의내용은 필수입니다.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseAppsScriptResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script 저장 호출에 실패했습니다.",
          detail: data?.detail || data?.message || `HTTP ${response.status}`,
          appsScriptStatus: response.status,
        },
        { status: 502 }
      );
    }

    if (data?.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          message:
            data.message || "Google Apps Script 저장 처리 중 오류가 발생했습니다.",
          detail: data.detail || "",
          received: data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: data?.message || "문의가 저장되었습니다.",
        received: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "문의 저장 중 서버 오류가 발생했습니다.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}