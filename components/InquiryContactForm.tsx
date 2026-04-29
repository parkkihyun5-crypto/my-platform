"use client";

import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import SectionTitle from "@/components/SectionTitle";
import { submitInquiry } from "@/lib/inquiry-client";
import { useEffect, useMemo, useState } from "react";

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

type InquiryContactFormProps = {
  badge: string;
  title: string;
  desc: string;
  sourcePage: string;
  serviceType: string;
  mailSubjectPrefix: string;
  whiteCardClass?: string;
  messagePlaceholder: string;
  rows?: number;
  submitLabel?: string;
  submitButtonClassName?: string;
  formClassName?: string;
  containerClassName?: string;
  helperTopContent?: React.ReactNode;
  helperBottomContent?: React.ReactNode;
  afterSuccess?: () => void;
  resetMessageTo?: string;
  useEmailFallbackButton?: boolean;
  emailButtonLabel?: string;
  showInlineSuccess?: boolean;
  successMessage?: string;
  externalMessage?: string;
  onExternalMessageApplied?: () => void;
};

export default function InquiryContactForm({
  badge,
  title,
  desc,
  sourcePage,
  serviceType,
  mailSubjectPrefix,
  whiteCardClass = "rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-10",
  messagePlaceholder,
  rows = 7,
  submitLabel = "문의하기",
  submitButtonClassName = "inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base",
  formClassName = "",
  containerClassName = "",
  helperTopContent,
  helperBottomContent,
  afterSuccess,
  resetMessageTo = "",
  useEmailFallbackButton = false,
  emailButtonLabel = "이메일로 문의하기",
  showInlineSuccess = false,
  successMessage = "문의가 접수되었습니다.",
  externalMessage,
  onExternalMessageApplied,
}: InquiryContactFormProps) {
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: resetMessageTo,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!externalMessage) return;

    setForm((prev) => ({
      ...prev,
      message: externalMessage,
    }));

    if (onExternalMessageApplied) {
      onExternalMessageApplied();
    }
  }, [externalMessage, onExternalMessageApplied]);

  const mailtoHref = useMemo(() => {
    const subject = `[${mailSubjectPrefix}] ${form.organization || "기관명 미입력"}`;
    const body = [
      `안녕하세요. ${mailSubjectPrefix} 관련 문의를 드립니다.`,
      "",
      `기관명: ${form.organization}`,
      `성명: ${form.name}`,
      `연락처: ${form.phone}`,
      `이메일: ${form.email}`,
      "",
      "문의 내용:",
      form.message || "(내용 미입력)",
    ].join("\n");

    return `mailto:npolap@ilukorea.org?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [form, mailSubjectPrefix]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await submitInquiry(form, sourcePage, serviceType);
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        detail?: string;
      };

      if (!response.ok || !result.ok) {
        alert(
          result.detail
            ? `${result.message ?? "문의 저장 실패"}\n\n${result.detail}`
            : result.message ?? "문의 저장 실패"
        );
        return;
      }

      setForm({
        organization: "",
        name: "",
        phone: "",
        email: "",
        message: resetMessageTo,
      });

      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 3200);

      if (afterSuccess) {
        afterSuccess();
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? `문의 전송 중 오류가 발생했습니다.\n\n${error.message}`
          : "문의 전송 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={containerClassName}>
      <SectionTitle badge={badge} title={title} desc={desc} center />

      {showInlineSuccess ? (
        <div
          className={`mx-auto mt-6 max-w-[760px] rounded-2xl border border-[#E5C996]/30 bg-white/95 px-5 py-4 text-center text-sm font-medium text-[#0B1F35] shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-500 ${
            showSuccess
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={`${whiteCardClass} mt-14 ${formClassName}`}>
        {helperTopContent ? <div className="mb-6">{helperTopContent}</div> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            value={form.organization}
            onChange={(value) => setForm((prev) => ({ ...prev, organization: value }))}
            placeholder="기관명"
          />
          <FormInput
            value={form.name}
            onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
            placeholder="성명"
          />
          <FormInput
            value={form.phone}
            onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
            placeholder="연락처"
          />
          <FormInput
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            placeholder="이메일"
            type="email"
          />
        </div>

        <FormTextarea
          value={form.message}
          onChange={(value) => setForm((prev) => ({ ...prev, message: value }))}
          placeholder={messagePlaceholder}
          className="mt-4"
          rows={rows}
        />

        {helperBottomContent ? <div className="mt-6">{helperBottomContent}</div> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${submitButtonClassName} ${
              isSubmitting ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isSubmitting ? "접수 중..." : submitLabel}
          </button>

          {useEmailFallbackButton ? (
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:px-7 md:py-4 md:text-base"
            >
              {emailButtonLabel}
            </a>
          ) : null}
        </div>
      </form>
    </div>
  );
}