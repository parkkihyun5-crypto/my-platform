"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import UnifiedCard from "@/components/UnifiedCard";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import AutoQuoteForm from "@/components/AutoQuoteForm";
import { submitInquiry } from "@/lib/inquiry-client";
import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type BrandingPackage = {
  title: string;
  subtitle: string;
  description: string;
};

type BrandingServicePackage = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  price: number;
  popular?: boolean;
};

type BrandingOption = {
  id: string;
  label: string;
  price: number;
};

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  consultingType: string;
  currentStage: string;
  consultingMethod: string;
  message: string;
};

const brandPrinciples = [
  {
    title: "정체성의 언어화",
    description:
      "브랜드는 조직의 철학과 방향을 외부에 전달하는 첫 번째 언어입니다. 이름, 슬로건, 로고, 소개문이 하나의 논리로 정리되어야 합니다.",
  },
  {
    title: "시각 시스템의 일관성",
    description:
      "로고 하나만이 아니라 색상, 문서, 소개서, 홈페이지까지 연결되는 시각 구조가 필요합니다.",
  },
  {
    title: "대외 신뢰의 형성",
    description:
      "브랜드는 단순히 보기 좋은 요소가 아니라, 기관의 신뢰를 설명하는 구조입니다. 특히 공익기관일수록 정제된 인상이 중요합니다.",
  },
];

const packageItems: BrandingPackage[] = [
  {
    title: "네이밍 · 슬로건",
    subtitle: "Naming & Slogan",
    description:
      "기관의 정체성과 방향을 가장 압축적으로 보여주는 이름과 메시지를 설계합니다.",
  },
  {
    title: "로고 · 아이덴티티",
    subtitle: "Identity Design",
    description:
      "철학과 목적을 시각적으로 전달할 수 있는 로고와 기본 아이덴티티 시스템을 구성합니다.",
  },
  {
    title: "문서 · 소개서",
    subtitle: "Editorial System",
    description:
      "대외 문서, 제안서, 소개서, 정리 자료까지 동일한 브랜드 문법으로 정리합니다.",
  },
  {
    title: "홈페이지 방향 설계",
    subtitle: "Website Direction",
    description:
      "기관의 성격과 목적에 맞는 홈페이지 언어, 구조, 시각 흐름을 설계합니다.",
  },
];

const brandingServicePackages: BrandingServicePackage[] = [
  {
    id: "starter",
    title: "STARTER",
    subtitle: "BI Lite",
    desc: "로고 중심의 기본형 브랜딩 패키지",
    price: 1500000,
  },
  {
    id: "standard",
    title: "STANDARD",
    subtitle: "BI Pro",
    desc: "로고와 컬러 시스템을 포함한 표준형 패키지",
    price: 3000000,
  },
  {
    id: "premium",
    title: "PREMIUM",
    subtitle: "CI Basic",
    desc: "브랜드 아이덴티티와 응용 시스템을 포함한 고급 패키지",
    price: 8000000,
    popular: true,
  },
  {
    id: "signature",
    title: "SIGNATURE",
    subtitle: "CI Full",
    desc: "국제기관 수준의 아이덴티티 체계를 구축하는 최상위 패키지",
    price: 20000000,
  },
];

const brandingOptions: BrandingOption[] = [
  { id: "naming", label: "네이밍 개발", price: 2000000 },
  { id: "slogan", label: "슬로건 개발", price: 1000000 },
  { id: "ppt", label: "PPT 템플릿", price: 1000000 },
  { id: "website", label: "홈페이지 UI 설계", price: 5000000 },
  { id: "sns", label: "SNS 브랜드 키트", price: 1000000 },
  { id: "signage", label: "간판 · 사인 디자인", price: 2000000 },
];

const brandDirections = [
  "국제기구형",
  "공공기관형",
  "문화예술형",
  "지속가능성중심",
];

const trademarkSteps = [
  {
    step: "01",
    title: "상표 검색",
    desc: "출원 전 유사 상표와 선등록 상표를 먼저 확인합니다.",
  },
  {
    step: "02",
    title: "지정상품 검토",
    desc: "업종에 맞는 상품류와 서비스류를 정확하게 정리합니다.",
  },
  {
    step: "03",
    title: "출원 자료 준비",
    desc: "상표명, 로고, 출원인 정보, 지정상품 내용을 준비합니다.",
  },
  {
    step: "04",
    title: "특허청 출원",
    desc: "출원 접수 후 심사 절차로 들어갑니다.",
  },
  {
    step: "05",
    title: "중간대응",
    desc: "거절이유 통지 시 보정 또는 의견서로 대응합니다.",
  },
  {
    step: "06",
    title: "등록 완료",
    desc: "등록료 납부가 끝나면 권리가 발생합니다.",
  },
];

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

function handleTrademarkSearch(
  keyword: string,
  trademarkClass: string,
  setSearchHistory: Dispatch<SetStateAction<string[]>>
): void {
  const value = keyword.trim();
  const classValue = trademarkClass.trim();

  if (!value) {
    alert("검색할 상표명을 입력해 주세요.");
    return;
  }

  const historyLabel = classValue ? `${value} / ${classValue}` : value;

  setSearchHistory((prev: string[]) =>
    [historyLabel, ...prev.filter((item: string) => item !== historyLabel)].slice(0, 8)
  );

  const queryText = classValue ? `${value} ${classValue}` : value;

  window.open(
    `https://www.kipris.or.kr/khome/search/searchResult.do?queryText=${encodeURIComponent(queryText)}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export default function BrandingPage() {
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    consultingType: "브랜딩 서비스",
    currentStage: "",
    consultingMethod: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [selectedBrandingIds, setSelectedBrandingIds] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["naming"]);
  const [selectedDirection, setSelectedDirection] = useState<string>("국제기구형");
  const [vatIncluded, setVatIncluded] = useState<boolean>(false);

  const [trademarkKeyword, setTrademarkKeyword] = useState<string>("");
  const [trademarkClass, setTrademarkClass] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [quoteMessage, setQuoteMessage] = useState<string>("");

  const selectedBrandingList = brandingServicePackages.filter((item) =>
    selectedBrandingIds.includes(item.id)
  );

  const brandingTotal = selectedBrandingList.reduce(
    (sum: number, item: BrandingServicePackage) => sum + item.price,
    0
  );

  const optionTotal = selectedOptions.reduce((sum: number, id: string) => {
    const found = brandingOptions.find((item: BrandingOption) => item.id === id);
    return sum + (found ? found.price : 0);
  }, 0);

  const brandingSubtotal = brandingTotal + optionTotal;
  const brandingFinalTotal = vatIncluded
    ? Math.round(brandingSubtotal * 1.1)
    : brandingSubtotal;

  useEffect(() => {
    if (!quoteMessage) return;

    setForm((prev) => ({
      ...prev,
      message: quoteMessage,
    }));

    const inquirySection = document.getElementById("branding-inquiry");
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setQuoteMessage("");
  }, [quoteMessage]);

  const emailSubject = useMemo(() => {
    return `[브랜딩서비스 문의] ${form.name || "성함 미입력"}`;
  }, [form.name]);

  const emailBody = useMemo(() => {
    return [
      "안녕하세요. 브랜딩서비스 관련 문의를 드립니다.",
      "",
      `성명: ${form.name}`,
      `연락처: ${form.phone}`,
      `이메일: ${form.email}`,
      `상담 유형: ${form.consultingType}`,
      `현재 단계: ${form.currentStage}`,
      `희망 상담 방식: ${form.consultingMethod}`,
      "",
      "문의 내용:",
      form.message || "(내용 미입력)",
    ].join("\n");
  }, [form]);

  const mailtoHref = useMemo(() => {
    return `mailto:npolap@ilukorea.org?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  }, [emailSubject, emailBody]);

  const gmailComposeHref = useMemo(() => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      "npolap@ilukorea.org"
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailBody
    )}`;
  }, [emailSubject, emailBody]);

  function toggleBrandingPackage(id: string): void {
    setSelectedBrandingIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
    );
  }

  function toggleOption(id: string): void {
    setSelectedOptions((prev: string[]) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
    );
  }  function handleEmailInquiry(): void {
    try {
      void navigator.clipboard?.writeText("npolap@ilukorea.org");
    } catch {
      // Ignore clipboard permission errors.
    }

    const isMobile =
      typeof window !== "undefined" &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      );

    if (isMobile) {
      window.location.href = mailtoHref;
      alert("\uC774\uBA54\uC77C \uC791\uC131 \uD654\uBA74\uC73C\uB85C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4. \uBA54\uC77C \uC571\uC5D0\uC11C \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
      return;
    }

    const gmailWindow = window.open(
      gmailComposeHref,
      "brandingGmailCompose",
      "width=760,height=720,left=120,top=80"
    );

    if (gmailWindow) {
      try {
        gmailWindow.opener = null;
        gmailWindow.focus();
      } catch {
        // Ignore browser security restrictions.
      }

      alert("\uC774\uBA54\uC77C \uC791\uC131\uCC3D\uC774 \uC5F4\uB838\uC2B5\uB2C8\uB2E4. \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
      return;
    }

    window.location.href = mailtoHref;
    alert("\uC774\uBA54\uC77C \uC791\uC131 \uD654\uBA74\uC73C\uB85C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4. \uBA54\uC77C \uC571\uC5D0\uC11C \uB0B4\uC6A9\uC744 \uD655\uC778\uD55C \uB4A4 \uBCF4\uB0B4\uAE30\uB97C \uB20C\uB7EC\uC8FC\uC138\uC694.");
  }
  async function handleInquirySubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      alert("성명, 연락처, 이메일, 문의 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const inquiryForm = {
        ...form,
        organization: "개인 상담",
        message: [
          "[브랜딩 서비스 상담 신청]",
          "",
          `상담 유형: ${form.consultingType}`,
          `현재 단계: ${form.currentStage}`,
          `희망 상담 방식: ${form.consultingMethod}`,
          "",
          "문의 내용:",
          form.message,
        ].join("\n"),
      };

      const response = await submitInquiry(inquiryForm, "branding", "브랜딩서비스");
      const rawText = await response.text();

      let result: {
        ok?: boolean;
        message?: string;
        detail?: string;
        emailSent?: boolean;
      } | null = null;

      if (rawText.trim()) {
        try {
          result = JSON.parse(rawText) as {
            ok?: boolean;
            message?: string;
            detail?: string;
            emailSent?: boolean;
          };
        } catch {
          result = null;
        }
      }

      if (!response.ok || result?.ok === false) {
        const errorMessage = result?.detail
          ? `${result.message ?? "문의 저장 실패"}

${result.detail}`
          : result?.message ??
            `문의 저장 중 오류가 발생했습니다.

상태코드: ${response.status}
응답내용: ${
              rawText || "(빈 응답)"
            }

이메일 문의로 연결합니다.`;

        alert(errorMessage);
        handleEmailInquiry();
        return;
      }

      setForm({
        organization: "",
        name: "",
        phone: "",
        email: "",
        consultingType: "브랜딩 서비스",
        currentStage: "",
        consultingMethod: "",
        message: "",
      });

      if (result?.emailSent === false) {
        alert(
          "문의는 정상적으로 저장되었습니다. 다만 이메일 알림 발송은 실패했습니다. 관리자 보드에서는 확인 가능합니다."
        );
        return;
      }

      alert("문의가 정상적으로 접수되었습니다.");
    } catch (error) {
      alert(
        error instanceof Error
          ? `문의 전송 중 오류가 발생했습니다.

${error.message}

이메일 문의로 연결합니다.`
          : "문의 전송 중 오류가 발생했습니다. 이메일 문의로 연결합니다."
      );

      handleEmailInquiry();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
  mode="sub"
  logoText="BRANDING SERVICE"
  logoHref="/heritage-office"
  inquiryHref="#branding-inquiry"
  menuItems={[
    {
      label: "공익법인설립",
      href: "/public-interest-foundation",
      isLink: true,
    },
    {
      label: "사회적기업설립",
      href: "/social-enterprise",
      isLink: true,
    },
    {
      label: "브랜딩서비스",
      href: "/branding",
      isLink: true,
    },
    {
      label: "헤리티지오피스",
      href: "/heritage-office",
      isLink: true,
    },
    {
      label: "에코피온",
      href: "/consultant-profile",
      isLink: true,
    },
  ]}
/>

      <main>
        <section className="relative h-[100vh] w-full overflow-hidden pt-24 md:pt-28">
          <div className="absolute inset-0">
            <img
              src="/images/hero-branding.png"
              alt="branding hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 md:px-10 lg:px-12">
            <div className="max-w-5xl text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.34em] text-[#EAD9BC] md:text-base">
                Branding Service
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl xl:text-[84px]">
                철학을 시각화하고
                <br />
                정체성을 제도로 연결하는
                <br />
                브랜딩 서비스
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
                브랜드는 단순한 디자인이 아닙니다.
                <br />
                보이지 않는 조직의 철학과 가치를
                <br />
                보이는 가치로 사회와 연결하는 언어입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="branding-principles" className="scroll-mt-28 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="BRAND PRINCIPLES"
              title="브랜딩 설계의 핵심 원칙"
              desc="브랜드는 보기 좋은 외형이 아니라, 조직의 방향과 철학을 공적 언어로 정리하는 시스템입니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {brandPrinciples.map((item) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="branding-services" className="scroll-mt-28 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="BRANDING PACKAGE"
              title="브랜딩 서비스 구성"
              desc="네이밍부터 로고, 문서 시스템, 홈페이지 방향까지 기관의 정체성을 통합적으로 설계합니다."
              center
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {packageItems.map((item) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                    {item.subtitle}
                  </div>
                </UnifiedCard>
              ))}
            </div>
          </div>
        </section>

        <section id="branding-packages" className="scroll-mt-28 bg-[#F1EEE7] py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="BRANDING SERVICE"
              title="브랜딩 패키지 · 옵션 · 통합 견적"
              desc="선택형 패키지와 옵션을 바로 조합해 볼 수 있습니다."
              center
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-4">
              {brandingServicePackages.map((item) => {
                const active = selectedBrandingIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleBrandingPackage(item.id)}
                    className={`rounded-[30px] border bg-white p-6 text-left transition-all duration-500 ease-out ${
                      active
                        ? "border-[#C9A96B] shadow-[0_24px_60px_rgba(201,169,107,0.12)]"
                        : "border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A96B]">
                          {item.subtitle}
                        </div>
                        <div className="mt-3 text-3xl font-bold text-[#0B1F35]">
                          {item.title}
                        </div>
                      </div>
                      {item.popular ? (
                        <span className="rounded-full bg-[#EAD9BC] px-3 py-1 text-[11px] font-bold text-[#0B1F35] md:text-xs">
                          추천
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                      {item.desc}
                    </p>

                    <div className="mt-6 text-2xl font-bold text-[#081A2F] md:text-3xl">
                      {formatKRW(item.price)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div id="branding-options" className="scroll-mt-28 rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                  OPTIONS
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F35] md:text-4xl">
                  옵션 선택
                </h3>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {brandingOptions.map((item) => {
                    const active = selectedOptions.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleOption(item.id)}
                        className={`rounded-[24px] p-5 text-left transition-all duration-300 ${
                          active
                            ? "border border-[#0B1F35] bg-[#0B1F35] text-white shadow-[0_24px_60px_rgba(11,31,53,0.18)]"
                            : "border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{item.label}</div>
                            <div
                              className={`mt-2 text-sm md:text-base ${
                                active ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              {formatKRW(item.price)}
                            </div>
                          </div>

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
                              active
                                ? "border-white bg-white text-[#0B1F35]"
                                : "border-slate-300 bg-white text-slate-400"
                            }`}
                          >
                            {active ? "✓" : "+"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                    BRAND DIRECTION
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {brandDirections.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedDirection(item)}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-all duration-300 md:text-base ${
                          selectedDirection === item
                            ? "border-[#C9A96B] bg-[#FBF5EA] shadow-[0_18px_40px_rgba(201,169,107,0.10)]"
                            : "border-slate-200 bg-white hover:-translate-y-[2px] hover:border-slate-300/90 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F8F6F1] px-4 py-4">
                    <input
                      id="vat"
                      type="checkbox"
                      checked={vatIncluded}
                      onChange={(e) => setVatIncluded(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label
                      htmlFor="vat"
                      className="text-sm font-medium text-slate-700 md:text-base"
                    >
                      VAT 포함 금액으로 보기
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-[36px] bg-[#081A2F] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                  INTEGRATED ESTIMATE
                </div>
                <h3 className="mt-4 text-2xl font-bold md:text-3xl">통합 견적 요약</h3>

                <div className="mt-6 space-y-5 rounded-[24px] bg-white/5 p-5">
                  <div className="grid grid-cols-[110px_1fr] gap-3 text-sm md:text-base">
                    <div className="text-slate-300">설립 패키지</div>
                    <div className="text-white">선택 없음</div>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] gap-3 text-sm md:text-base">
                    <div className="text-slate-300">브랜딩 패키지</div>
                    <div className="text-white">
                      {selectedBrandingList.length > 0
                        ? selectedBrandingList.map((item) => item.title).join(", ")
                        : "선택 없음"}
                    </div>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] gap-3 text-sm md:text-base">
                    <div className="text-slate-300">옵션</div>
                    <div className="text-white">
                      {selectedOptions.length > 0
                        ? brandingOptions
                            .filter((item) => selectedOptions.includes(item.id))
                            .map((item) => item.label)
                            .join(", ")
                        : "선택 없음"}
                    </div>
                  </div>

                  <div className="grid grid-cols-[110px_1fr] gap-3 text-sm md:text-base">
                    <div className="text-slate-300">브랜드 방향</div>
                    <div className="text-white">{selectedDirection}</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-slate-300">브랜딩 패키지</span>
                    <span className="font-semibold text-white">
                      {formatKRW(brandingTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-slate-300">옵션 금액</span>
                    <span className="font-semibold text-white">
                      {formatKRW(optionTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-slate-300">VAT 반영</span>
                    <span className="font-semibold text-white">
                      {vatIncluded ? "포함" : "별도"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] bg-[#E5C996] px-5 py-6 text-[#0B1F35]">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em]">
                    FINAL TOTAL
                  </div>
                  <div className="mt-3 text-3xl font-bold md:text-4xl">
                    {formatKRW(brandingFinalTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="branding-trademark" className="scroll-mt-28 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="TRADEMARK"
              title="상표등록 검색 및 출원 준비"
              desc="상표 검색부터 지정상품 검토, 출원 준비까지 사전 단계에서 점검할 수 있습니다."
              center
            />

            <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                  SEARCH
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F35] md:text-4xl">
                  상표검색
                </h3>

                <div className="mt-3 rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm leading-7 text-slate-600">
                  상표명만 입력해도 검색할 수 있으며,
                  <br />
                  상품류 또는 서비스류를 함께 입력하면 검색 범위를 좁혀볼 수 있습니다.
                </div>

                <div
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTrademarkSearch(trademarkKeyword, trademarkClass, setSearchHistory);
    }
  }}
  className="mt-6 grid gap-4"
>
  <FormInput
    value={trademarkKeyword}
    onChange={setTrademarkKeyword}
    placeholder="검색할 상표명을 입력해 주세요."
  />
  <FormInput
    value={trademarkClass}
    onChange={setTrademarkClass}
    placeholder="상품류 또는 서비스류를 입력해 주세요."
  />
</div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      handleTrademarkSearch(
                        trademarkKeyword,
                        trademarkClass,
                        setSearchHistory
                      )
                    }
                    className="inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base"
                  >
                    검색하기
                  </button>

                  <a
                    href="https://www.kipris.or.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:px-7 md:py-4 md:text-base"
                  >
                    KIPRIS 바로가기
                  </a>
                </div>

                <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                    SEARCH GUIDE
                  </div>

                  <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                    <div className="rounded-2xl bg-white px-4 py-4">
                      상표명 중심으로 먼저 검색하고, 유사 상표가 많은 경우 상품류를 추가해 보세요.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      예시: 삼성 / 35류, Heritage Office / 41류
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      엔터로 바로 검색하려면 상표명 입력 후 키보드 Enter를 눌러도 됩니다.
                    </div>
                  </div>
                </div>

                {searchHistory.length > 0 ? (
                  <div className="mt-6 rounded-[24px] bg-[#F8F6F1] p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                      SEARCH HISTORY
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {searchHistory.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            const [keywordPart, classPart] = item.split(" / ");
                            setTrademarkKeyword(keywordPart ?? "");
                            setTrademarkClass(classPart ?? "");
                          }}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-50"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                  PREPARATION
                </div>
                <h3 className="mt-4 text-2xl font-bold text-[#0B1F35] md:text-4xl">
                  출원 준비 체크
                </h3>

                <div className="mt-6 grid gap-3">
                  {[
                    "상표명 또는 로고 확정",
                    "유사 상표 사전 검색",
                    "지정상품 및 서비스류 검토",
                    "출원인 정보 준비",
                    "사용 계획 또는 실제 사용 여부 확인",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C9A96B]">
                    QUICK NOTE
                  </div>
                  <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700">
                    <div className="rounded-2xl bg-white px-4 py-4">
                      검색 결과가 많을수록 지정상품 범위를 구체화하는 것이 좋습니다.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      출원 전에는 문자상표와 로고상표를 구분하여 검토하는 것이 안전합니다.
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      영문명과 한글명을 함께 사용할 계획이라면 각각 별도 점검이 필요합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="PROCESS"
              title="상표등록 절차 안내"
              desc="검색부터 등록 완료까지의 절차를 단계별로 정리했습니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trademarkSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[28px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                  <div className="text-sm font-semibold tracking-[0.24em] text-[#C9A96B]">
                    STEP {item.step}
                  </div>
                  <div className="mt-3 text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section id="branding-inquiry" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="ONLINE CONSULTING"
              title="브랜딩 서비스 상담"
              desc="기관의 성격, 방향, 철학, 대외 인상까지 함께 검토하며 가장 적합한 브랜드 구조를 제안합니다."
              center
            />

            <form
              onSubmit={handleInquirySubmit}
              className="mt-14 rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-10"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  value={form.name}
                  onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                  placeholder="성함"
                  required
                />
                <FormInput
                  value={form.phone}
                  onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                  placeholder="연락처"
                  type="tel"
                  required
                />
                <FormInput
                  value={form.email}
                  onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                  placeholder="이메일"
                  type="email"
                  required
                />
                <select
                  value={form.consultingType}
                  onChange={(e) => setForm((prev) => ({ ...prev, consultingType: e.target.value }))}
                  required
                  className="w-full rounded-[20px] border border-slate-300/90 bg-white px-5 py-4 text-sm text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 focus:border-[#0B1F35] focus:shadow-[0_16px_36px_rgba(11,31,53,0.08)] focus:ring-4 focus:ring-[#0B1F35]/8 md:text-base"
                >
                  <option value="">상담 유형 선택</option>
                  <option value="공익법인 설립">공익법인 설립</option>
                  <option value="헤리티지오피스">헤리티지오피스</option>
                  <option value="브랜딩 서비스">브랜딩 서비스</option>
                  <option value="사회적기업 설립">사회적기업 설립</option>
                  <option value="에코피온상담">에코피온상담</option>
                  <option value="기타 문의">기타 문의</option>
                </select>
                <select
                  value={form.currentStage}
                  onChange={(e) => setForm((prev) => ({ ...prev, currentStage: e.target.value }))}
                  required
                  className="w-full rounded-[20px] border border-slate-300/90 bg-white px-5 py-4 text-sm text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 focus:border-[#0B1F35] focus:shadow-[0_16px_36px_rgba(11,31,53,0.08)] focus:ring-4 focus:ring-[#0B1F35]/8 md:text-base"
                >
                  <option value="">현재 단계</option>
                  <option value="아이디어 단계">아이디어 단계</option>
                  <option value="설립 준비 중">설립 준비 중</option>
                  <option value="운영 중">운영 중</option>
                  <option value="브랜드 개선 필요">브랜드 개선 필요</option>
                  <option value="전문가 검토 필요">전문가 검토 필요</option>
                </select>
                <select
                  value={form.consultingMethod}
                  onChange={(e) => setForm((prev) => ({ ...prev, consultingMethod: e.target.value }))}
                  required
                  className="w-full rounded-[20px] border border-slate-300/90 bg-white px-5 py-4 text-sm text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.04)] outline-none transition-all duration-300 focus:border-[#0B1F35] focus:shadow-[0_16px_36px_rgba(11,31,53,0.08)] focus:ring-4 focus:ring-[#0B1F35]/8 md:text-base"
                >
                  <option value="">희망 상담 방식</option>
                  <option value="전화 상담">전화 상담</option>
                  <option value="이메일 상담">이메일 상담</option>
                  <option value="온라인 미팅">온라인 미팅</option>
                  <option value="대면 상담">대면 상담</option>
                  <option value="비공개 미팅">비공개 미팅</option>
                </select>
              </div>

              <FormTextarea
                value={form.message}
                onChange={(value) => setForm((prev) => ({ ...prev, message: value }))}
                placeholder="브랜드 개선이 필요한 지점, 필요한 산출물, 현재 사용 중인 이름·로고·홈페이지 상태를 간단히 적어주세요."
                className="mt-4"
                rows={7}
                required
              />
              <label className="mt-5 flex items-start gap-3 rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm leading-7 text-slate-600">
                <input type="checkbox" required className="mt-1 h-4 w-4" />
                <span>개인정보 수집 및 상담 목적 활용에 동의합니다.</span>
              </label>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? "접수 중..." : "비공개 상담 신청하기"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleEmailInquiry();
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:px-7 md:py-4 md:text-base"
                >
                  이메일로 문의하기
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                남겨주신 내용은 외부에 공개되지 않으며, 검토 후 담당자가 순차적으로 연락드립니다.
              </p>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter
  leftText="NPO LAP"
  rightItems={[
    "공익법인설립",
    "사회적기업설립",
    "브랜딩서비스",
    "헤리티지오피스",
    "에코피온",
  ]}
/>
    </div>
  );
}
