import type { InquiryFormPayload } from "@/lib/inquiry-types";

type BaseForm = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function buildInquiryPayload(
  form: BaseForm,
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

export async function submitInquiry(
  form: BaseForm,
  sourcePage: string,
  serviceType: string
): Promise<Response> {
  const payload = buildInquiryPayload(form, sourcePage, serviceType);

  return fetch("/api/inquiry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}