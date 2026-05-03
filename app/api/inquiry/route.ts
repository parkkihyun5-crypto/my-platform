import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InquiryPayload = {
  organization?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  sourcePage?: string;
  serviceType?: string;
  status?: string;
  manager?: string;
  priority?: string;
  memo?: string;
  id?: string;
  [key: string]: unknown;
};

type AppsScriptResponse = {
  ok?: boolean;
  items?: unknown[];
  item?: unknown;
  message?: string;
  error?: string;
  detail?: string;
  [key: string]: unknown;
};

function getGoogleSheetWebhookUrl(): string {
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

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function createMissingWebhookResponse(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      items: [],
      message:
        "GOOGLE_SHEET_WEBHOOK_URL 환경변수가 없습니다. Vercel 환경변수 또는 .env.local을 확인하세요.",
    },
    { status: 500 }
  );
}

async function parseAppsScriptResponse(response: Response): Promise<{
  ok: boolean;
  status: number;
  data: AppsScriptResponse | null;
  rawText: string;
}> {
  const rawText = await response.text();

  if (!rawText.trim()) {
    return {
      ok: response.ok,
      status: response.status,
      data: null,
      rawText,
    };
  }

  try {
    const data = JSON.parse(rawText) as AppsScriptResponse;

    return {
      ok: response.ok && data.ok !== false,
      status: response.status,
      data,
      rawText,
    };
  } catch {
    return {
      ok: false,
      status: response.status,
      data: null,
      rawText,
    };
  }
}

async function forwardToAppsScript(
  method: "GET" | "POST" | "PATCH",
  payload?: Record<string, unknown>
): Promise<NextResponse> {
  const webhookUrl = getGoogleSheetWebhookUrl();

  if (!webhookUrl) {
    return createMissingWebhookResponse();
  }

  try {
    const requestUrl =
      method === "GET" ? `${webhookUrl}?t=${Date.now()}` : webhookUrl;

    const response = await fetch(requestUrl, {
      method: method === "GET" ? "GET" : "POST",
      cache: "no-store",
      headers:
        method === "GET"
          ? undefined
          : {
              "Content-Type": "application/json; charset=utf-8",
              Accept: "application/json",
            },
      body:
        method === "GET"
          ? undefined
          : JSON.stringify({
              action: method === "PATCH" ? "update" : "create",
              ...payload,
            }),
    });

    const parsed = await parseAppsScriptResponse(response);

    if (!parsed.ok) {
      return NextResponse.json(
        {
          ok: false,
          items: [],
          message:
            parsed.data?.message ||
            parsed.data?.error ||
            parsed.data?.detail ||
            "Google Apps Script 처리 중 오류가 발생했습니다.",
          status: parsed.status,
          raw: parsed.data ?? parsed.rawText,
        },
        { status: response.ok ? 500 : response.status }
      );
    }

    if (method === "GET") {
      return NextResponse.json(
        {
          ok: true,
          items: Array.isArray(parsed.data?.items) ? parsed.data.items : [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          parsed.data?.message ||
          (method === "PATCH"
            ? "문의 상태가 정상적으로 수정되었습니다."
            : "문의가 정상적으로 접수되었습니다."),
        item: parsed.data?.item ?? null,
        data: parsed.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[INQUIRY ${method} API ERROR]:`, error);

    return NextResponse.json(
      {
        ok: false,
        items: [],
        message:
          error instanceof Error
            ? error.message
            : "Google Apps Script 연결 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  return forwardToAppsScript("GET");
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as InquiryPayload;

    const organization = normalize(body.organization);
    const name = normalize(body.name);
    const phone = normalize(body.phone);
    const email = normalize(body.email);
    const message = normalize(body.message);
    const sourcePage = normalize(body.sourcePage) || "unknown";
    const serviceType = normalize(body.serviceType) || "general";

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        {
          ok: false,
          message: "필수 항목이 누락되었습니다.",
          detail: "성명, 연락처, 이메일, 문의 내용을 모두 입력해야 합니다.",
        },
        { status: 400 }
      );
    }

    return forwardToAppsScript("POST", {
      organization,
      name,
      phone,
      email,
      message,
      sourcePage,
      serviceType,
    });
  } catch (error) {
    console.error("[INQUIRY POST PARSE ERROR]:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "문의 요청 데이터를 처리하지 못했습니다.",
        detail:
          error instanceof Error
            ? error.message
            : "요청 본문을 JSON으로 해석하지 못했습니다.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as InquiryPayload;

    if (!body.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "수정할 문의 ID가 없습니다.",
        },
        { status: 400 }
      );
    }

    return forwardToAppsScript("PATCH", body);
  } catch (error) {
    console.error("[INQUIRY PATCH PARSE ERROR]:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "문의 수정 요청 데이터를 처리하지 못했습니다.",
        detail:
          error instanceof Error
            ? error.message
            : "요청 본문을 JSON으로 해석하지 못했습니다.",
      },
      { status: 400 }
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET,POST,PATCH,OPTIONS",
    },
  });
}