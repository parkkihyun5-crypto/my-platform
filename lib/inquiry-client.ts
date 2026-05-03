import type { InquiryFormPayload } from "@/lib/inquiry-types";

export type BaseInquiryForm = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type SafeInquiryResult = {
  ok: boolean;
  status: number;
  data: {
    ok?: boolean;
    message?: string;
    detail?: string;
    emailSent?: boolean;
    emailError?: string | null;
  } | null;
  rawText: string;
  errorMessage: string;
};

export type EmailInquiryOptions = {
  to?: string;
  subject: string;
  body: string;
};

export function buildInquiryPayload(
  form: BaseInquiryForm,
  sourcePage: string,
  serviceType: string
): InquiryFormPayload {
  return {
    organization: form.organization,
    name: form.name,
    phone: form.phone,
    email: form.email,
    message: form.message,
    sourcePage,
    serviceType,
  };
}

export function validateInquiryForm(form: BaseInquiryForm): string | null {
  if (!form.name.trim()) return "성명을 입력해 주세요.";
  if (!form.phone.trim()) return "연락처를 입력해 주세요.";
  if (!form.email.trim()) return "이메일을 입력해 주세요.";
  if (!form.message.trim()) return "문의 내용을 입력해 주세요.";
  return null;
}

export async function submitInquiry(
  form: BaseInquiryForm,
  sourcePage: string,
  serviceType: string
): Promise<Response> {
  const payload = buildInquiryPayload(form, sourcePage, serviceType);

  return fetch("/api/inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
}

export async function submitInquirySafely(
  form: BaseInquiryForm,
  sourcePage: string,
  serviceType: string
): Promise<SafeInquiryResult> {
  try {
    const response = await submitInquiry(form, sourcePage, serviceType);
    const rawText = await response.text();

    let data: SafeInquiryResult["data"] = null;

    if (rawText.trim()) {
      try {
        data = JSON.parse(rawText) as SafeInquiryResult["data"];
      } catch {
        data = null;
      }
    }

    const apiOk = response.ok && data?.ok !== false;

    return {
      ok: apiOk,
      status: response.status,
      data,
      rawText,
      errorMessage: apiOk
        ? ""
        : [
            data?.message || "문의 저장 중 오류가 발생했습니다.",
            data?.detail ? `상세내용: ${data.detail}` : "",
            `상태코드: ${response.status}`,
            `응답내용: ${rawText || "(빈 응답)"}`,
          ]
            .filter(Boolean)
            .join("\n"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      rawText: "",
      errorMessage:
        error instanceof Error
          ? `문의 전송 중 오류가 발생했습니다.\n\n${error.message}`
          : "문의 전송 중 오류가 발생했습니다.",
    };
  }
}

export function buildMailtoHref({
  to = "npolap@ilukorea.org",
  subject,
  body,
}: EmailInquiryOptions): string {
  return `mailto:${to}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export function buildGmailComposeHref({
  to = "npolap@ilukorea.org",
  subject,
  body,
}: EmailInquiryOptions): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function openInquiryEmail(
  options: EmailInquiryOptions
): Promise<void> {
  const to = options.to || "npolap@ilukorea.org";
  const mailtoHref = buildMailtoHref({ ...options, to });
  const gmailHref = buildGmailComposeHref({ ...options, to });

  const isMobile =
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );

  if (typeof window === "undefined") return;

  if (isMobile) {
    window.location.href = mailtoHref;
    return;
  }

  const popupWidth = 760;
  const popupHeight = 760;

  const left = Math.max(
    0,
    window.screenX + (window.outerWidth - popupWidth) / 2
  );

  const top = Math.max(
    0,
    window.screenY + (window.outerHeight - popupHeight) / 2
  );

  const popup = window.open(
    gmailHref,
    "npolapInquiryEmailWindow",
    [
      "popup=yes",
      `width=${popupWidth}`,
      `height=${popupHeight}`,
      `left=${Math.round(left)}`,
      `top=${Math.round(top)}`,
      "resizable=yes",
      "scrollbars=yes",
    ].join(",")
  );

  if (popup) {
    popup.focus();
  } else {
    window.location.href = mailtoHref;
  }

  try {
    await navigator.clipboard.writeText(to);
  } catch {
    // 브라우저 권한에 따라 복사가 실패할 수 있으므로 무시합니다.
  }
}