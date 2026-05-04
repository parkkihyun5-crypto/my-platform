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

type AppsScriptData = {
  ok?: boolean;
  message?: string;
  detail?: string;
  source?: string;
  sheetName?: string;
  items?: unknown[];
  [key: string]: unknown;
};

type AppsScriptPostResult = {
  response: Response;
  data: AppsScriptData | null;
  rawText: string;
  parseError: string | null;
  payload: Record<string, string>;
};

function getAppsScriptUrl(): string {
  const url =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.GOOGLE_APPS_SCRIPT_URL ||
    process.env.GOOGLE_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    process.env.APPS_SCRIPT_URL ||
    process.env.INQUIRY_SCRIPT_URL ||
    "";

  return url.trim();
}

function cleanValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function parseAppsScriptResponse(response: Response): Promise<{
  data: AppsScriptData | null;
  rawText: string;
  parseError: string | null;
}> {
  const rawText = await response.text();

  if (!rawText.trim()) {
    return {
      data: null,
      rawText,
      parseError: "Google Apps Script에서 빈 응답을 반환했습니다.",
    };
  }

  try {
    return {
      data: JSON.parse(rawText) as AppsScriptData,
      rawText,
      parseError: null,
    };
  } catch {
    return {
      data: null,
      rawText,
      parseError: "Google Apps Script 응답을 JSON으로 해석하지 못했습니다.",
    };
  }
}

async function postToAppsScript(
  appsScriptUrl: string,
  payload: Record<string, string>
): Promise<AppsScriptPostResult> {
  const response = await fetch(appsScriptUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const { data, rawText, parseError } = await parseAppsScriptResponse(response);

  return {
    response,
    data,
    rawText,
    parseError,
    payload,
  };
}

function shouldRetryWithLegacyAction(result: AppsScriptPostResult): boolean {
  if (result.parseError) return false;
  if (result.response.ok && result.data?.ok !== false) return false;

  const message = `${result.data?.message || ""} ${result.data?.detail || ""}`;

  return /action|createInquiry|create|unknown|지원|처리|없/i.test(message);
}

function missingUrlResponse() {
  return NextResponse.json(
    {
      ok: false,
      message: "Google Apps Script URL 환경변수가 설정되지 않았습니다.",
      detail:
        "Vercel 환경변수 또는 .env.local에 GOOGLE_SHEET_WEBHOOK_URL, GOOGLE_APPS_SCRIPT_URL, GOOGLE_SCRIPT_URL, APPS_SCRIPT_URL, INQUIRY_SCRIPT_URL 중 하나를 설정하세요.",
    },
    { status: 500 }
  );
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
            "Vercel 환경변수 또는 .env.local에 Google Sheets CRM Webhook URL을 설정하세요.",
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

    const { data, rawText, parseError } = await parseAppsScriptResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script 조회 호출에 실패했습니다.",
          detail: data?.detail || data?.message || parseError || `HTTP ${response.status}`,
          appsScriptStatus: response.status,
          rawText,
          items: [],
        },
        { status: 502 }
      );
    }

    if (parseError) {
      return NextResponse.json(
        {
          ok: false,
          message: parseError,
          detail: rawText || "(빈 응답)",
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
            data.message || "Google Apps Script 조회 처리 중 오류가 발생했습니다.",
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
      return missingUrlResponse();
    }

    let body: InquiryPayload;

    try {
      body = (await request.json()) as InquiryPayload;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "요청 본문을 JSON으로 읽지 못했습니다.",
          detail: "문의 폼에서 JSON 형식으로 전송되는지 확인하세요.",
        },
        { status: 400 }
      );
    }

    const payload = {
      action: "create",
      organization: cleanValue(body.organization),
      name: cleanValue(body.name),
      phone: cleanValue(body.phone),
      email: cleanValue(body.email),
      message: cleanValue(body.message),
      sourcePage: cleanValue(body.sourcePage),
      serviceType: cleanValue(body.serviceType),
      status: "new",
      priority: "none",
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      return NextResponse.json(
        {
          ok: false,
          message: "필수 항목이 누락되었습니다.",
          detail: "성명, 연락처, 이메일, 문의 내용은 필수입니다.",
        },
        { status: 400 }
      );
    }

    let result = await postToAppsScript(appsScriptUrl, payload);

    if (shouldRetryWithLegacyAction(result)) {
      result = await postToAppsScript(appsScriptUrl, {
        ...payload,
        action: "createInquiry",
      });
    }

    const { response, data, rawText, parseError } = result;

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Google Apps Script 저장 호출에 실패했습니다.",
          detail: data?.detail || data?.message || parseError || `HTTP ${response.status}`,
          appsScriptStatus: response.status,
          rawText,
        },
        { status: 502 }
      );
    }

    if (parseError) {
      return NextResponse.json(
        {
          ok: false,
          message: parseError,
          detail: rawText || "(빈 응답)",
          sentPayload: result.payload,
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
          sentPayload: result.payload,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: data?.message || "문의가 저장되었습니다.",
        item: data?.item ?? null,
        data,
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
