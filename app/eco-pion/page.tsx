"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import { submitInquiry } from "@/lib/inquiry-client";
import type { FormEvent, MouseEvent } from "react";
import { useMemo, useState } from "react";

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

type CardItem = {
  title: string;
  description: string;
};

type ProcessItem = {
  step: string;
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const valueCards: CardItem[] = [
  {
    title: "자산의 유산화",
    description:
      "한 세대가 이룬 경제적 성취가 단순한 재산 이전에 머무르지 않도록, 가문의 철학과 공익적 가치로 제도화합니다.",
  },
  {
    title: "공익 구조 설계",
    description:
      "재단법인, 공익법인, 박물관, 미술관, 장학재단, 문화재단 등 설립 목적에 맞는 제도적 그릇을 설계합니다.",
  },
  {
    title: "문화·브랜드 전환",
    description:
      "보이지 않는 철학과 자산의 의미를 기관명, 스토리, 로고, 소개서, 홈페이지, 아카이브로 연결합니다.",
  },
];

const targetCards: CardItem[] = [
  {
    title: "재단을 만들고 싶지만 구조가 막막한 경우",
    description:
      "설립 목적, 출연재산, 주무관청, 정관, 이사회, 공익법인 지정 가능성까지 함께 검토해야 합니다.",
  },
  {
    title: "박물관·미술관을 만들고 싶은 경우",
    description:
      "소장품의 의미, 전시·교육 사업, 운영비, 후원 구조, 브랜드 방향, 문화재단 연계 가능성을 통합적으로 설계해야 합니다.",
  },
  {
    title: "가문 승계와 공익사업을 함께 고민하는 경우",
    description:
      "가족 헌장, 가문 철학, 다음 세대 교육, 패밀리오피스, 공익재단 구조를 하나의 질서로 정리해야 합니다.",
  },
  {
    title: "기존 비영리법인을 고도화하려는 경우",
    description:
      "정관, 목적사업, 후원 구조, 브랜드, 홈페이지, CRM 운영체계를 재정비하여 공신력을 높일 수 있습니다.",
  },
];

const serviceCards: CardItem[] = [
  {
    title: "Heritage Diagnosis",
    description:
      "자산 유형, 설립 의도, 가족 참여 구조, 공익 방향을 진단하여 가장 적합한 법인·재단·문화기관 구조를 제안합니다.",
  },
  {
    title: "Foundation Design",
    description:
      "재단법인, 공익법인, 장학재단, 문화재단 설립을 위한 취지문, 정관 방향, 목적사업, 이사회 구조를 설계합니다.",
  },
  {
    title: "Museum & Art Foundation",
    description:
      "미술품, 유물, 기록물, 컬렉션을 박물관·미술관·아카이브·교육사업으로 확장하는 구조를 설계합니다.",
  },
  {
    title: "Family Legacy Office",
    description:
      "가문 철학, 가족 헌장, 창립자 스토리, 다음 세대 교육, 공익사업 포트폴리오를 통합 설계합니다.",
  },
  {
    title: "Public Branding",
    description:
      "기관명, 슬로건, 로고, 소개서, 홈페이지, 상표, 대외문서 체계를 통해 공익기관의 신뢰 이미지를 구축합니다.",
  },
  {
    title: "Operation Structure",
    description:
      "이사회, 자문위원회, 운영규정, 후원자 관리, 상담 CRM, 사업보고 체계를 실제 운영 가능한 구조로 정리합니다.",
  },
];

const processItems: ProcessItem[] = [
  {
    step: "01",
    title: "자산·철학 진단",
    description:
      "보유 자산, 설립 의도, 가문 철학, 공익적 비전, 문화자산의 성격을 종합적으로 확인합니다.",
  },
  {
    step: "02",
    title: "설립 구조 선택",
    description:
      "재단법인, 사단법인, 공익법인, 박물관, 미술관, 사회적기업 등 가장 적합한 제도적 그릇을 비교합니다.",
  },
  {
    step: "03",
    title: "문서·브랜드 설계",
    description:
      "설립 취지문, 정관 방향, 기관명, 슬로건, 소개서, 홈페이지 메시지를 하나의 철학으로 정리합니다.",
  },
  {
    step: "04",
    title: "운영·계승 체계 구축",
    description:
      "이사회, 자문위원회, 후원 구조, 다음 세대 교육, 아카이브, CRM 운영까지 지속 가능한 구조로 연결합니다.",
  },
];

const trustCards: CardItem[] = [
  {
    title: "설립 유형 판단",
    description:
      "재단법인과 공익법인, 박물관과 문화재단의 차이를 이해하고 내 자산에 맞는 방향을 정리할 수 있습니다.",
  },
  {
    title: "컬렉션의 공공화",
    description:
      "개인 소장품이 단순 보관에 머무르지 않고 전시, 교육, 아카이브, 문화유산 플랫폼으로 확장될 수 있습니다.",
  },
  {
    title: "가문 철학의 문서화",
    description:
      "막연했던 가문의 정신과 창립자의 뜻을 가족 헌장, 설립 취지문, 기관 철학으로 구체화할 수 있습니다.",
  },
  {
    title: "상담·견적·계약 관리",
    description:
      "상담 신청 이후 관리자 CRM에서 유입페이지, 서비스유형, 상태, 담당자, 견적까지 관리할 수 있습니다.",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "에코피온은 직업군인가요, 컨설팅 서비스인가요?",
    answer:
      "에코피온은 NPOLAP이 제안하는 융합형 직업군이자 컨설팅 철학입니다. 단순 행정 대행이 아니라 자산, 철학, 공익, 생태, 문화, 브랜드, 운영 구조를 함께 설계하는 역할을 뜻합니다.",
  },
  {
    question: "재단법인과 공익법인은 같은 것인가요?",
    answer:
      "같지 않습니다. 재단법인은 민법상 비영리법인의 한 형태이고, 공익법인은 일정한 공익성 요건을 충족하여 별도의 지정과 사후관리가 필요한 구조입니다. 먼저 설립 구조를 정하고 이후 공익법인 지정 가능성을 검토하는 방식이 일반적입니다.",
  },
  {
    question: "박물관이나 미술관 설립도 상담 가능한가요?",
    answer:
      "가능합니다. 소장품의 성격, 전시 목적, 운영비, 후원 구조, 법인 형태, 문화재단 연계 가능성, 디지털 아카이브 방향까지 함께 검토할 수 있습니다.",
  },
  {
    question: "상담 전에 반드시 준비해야 할 자료가 있나요?",
    answer:
      "처음 상담에서는 완성된 자료가 없어도 됩니다. 다만 보유 자산의 종류, 설립하고 싶은 기관의 방향, 가족 또는 후계자 참여 여부, 컬렉션 목록, 기존 법인 여부를 간단히 정리하면 더 구체적인 상담이 가능합니다.",
  },
  {
    question: "세무·법률·회계 자문도 포함되나요?",
    answer:
      "NPOLAP의 설계는 세무, 법률, 회계, 브랜딩, 운영 구조를 함께 고려합니다. 다만 구체적인 신고, 등기, 법률 판단은 필요에 따라 관련 자격 전문가와 연계하여 진행하는 방식이 안전합니다.",
  },
];

const bottomPageMenu = [
  { label: "에코피온 정의", href: "#ecopion-intro" },
  { label: "설립대상", href: "#ecopion-target" },
  { label: "서비스구성", href: "#ecopion-consulting" },
  { label: "실행로드맵", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "비공개 상담 신청", href: "#ecopion-contact" },
];

const siteMapItems = [
  "공익법인설립",
  "사회적기업설립",
  "브랜딩서비스",
  "헤리티지오피스",
  "에코피온",
];

export default function EcoPionPage() {
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const emailTo = "npolap@ilukorea.org";

  const emailSubject = useMemo(() => {
    return `[에코피온 상담 문의] ${form.organization || "기관명 미입력"}`;
  }, [form.organization]);

  const emailBody = useMemo(() => {
    return [
      "안녕하세요. 에코피온 컨설팅 관련 상담을 신청합니다.",
      "",
      `기관명: ${form.organization}`,
      `성명: ${form.name}`,
      `연락처: ${form.phone}`,
      `이메일: ${form.email}`,
      "",
      "문의 내용:",
      form.message || "(내용 미입력)",
    ].join("\n");
  }, [form]);

  const mailtoHref = useMemo(() => {
    return `mailto:${emailTo}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  }, [emailSubject, emailBody]);

  const gmailComposeHref = useMemo(() => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emailTo
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
      emailBody
    )}`;
  }, [emailSubject, emailBody]);

  function updateForm<K extends keyof InquiryFormState>(
    key: K,
    value: InquiryFormState[K]
  ): void {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function openEmailWindow(): void {
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent
      );

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
      gmailComposeHref,
      "npolapEcoPionGmailInquiryWindow",
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
      return;
    }

    window.location.href = mailtoHref;
  }

  function handleEmailInquiryClick(
    event: MouseEvent<HTMLButtonElement>
  ): void {
    event.preventDefault();
    event.stopPropagation();
    openEmailWindow();
  }

  async function handleInquirySubmit(
    e: FormEvent<HTMLFormElement>
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

    const ecoPionTaggedForm: InquiryFormState = {
      ...form,
      message: [
        "[비공개 상담 신청]",
        "",
        "유입페이지: /eco-pion",
        "상담유형: 내 자산의 공익 유산화 상담",
        "",
        form.message,
      ].join("\n"),
    };

    try {
      setIsSubmitting(true);

      const primaryResponse = await submitInquiry(
        ecoPionTaggedForm,
        "eco-pion",
        "에코피온 컨설팅"
      );

      if (primaryResponse.ok) {
        setForm({
          organization: "",
          name: "",
          phone: "",
          email: "",
          message: "",
        });

        setShowSuccess(true);
        window.setTimeout(() => setShowSuccess(false), 3200);
        alert("비공개 상담 신청이 정상적으로 접수되었습니다.");
        return;
      }

      const fallbackResponse = await submitInquiry(
        ecoPionTaggedForm,
        "heritage-office",
        "헤리티지오피스"
      );

      if (fallbackResponse.ok) {
        setForm({
          organization: "",
          name: "",
          phone: "",
          email: "",
          message: "",
        });

        setShowSuccess(true);
        window.setTimeout(() => setShowSuccess(false), 3200);
        alert(
          "비공개 상담 신청이 정상적으로 접수되었습니다. 관리자 보드에서는 헤리티지오피스 유입으로 표시될 수 있으나, 문의 내용에 에코피온 상담으로 기록됩니다."
        );
        return;
      }

      alert("문의 저장 중 오류가 발생했습니다. 이메일 문의로 연결합니다.");
      openEmailWindow();
    } catch (error) {
      alert(
        error instanceof Error
          ? `문의 전송 중 오류가 발생했습니다.\n\n${error.message}\n\n이메일 문의로 연결합니다.`
          : "문의 전송 중 오류가 발생했습니다. 이메일 문의로 연결합니다."
      );
      openEmailWindow();
    } finally {
      setIsSubmitting(false);
    }
  }

  const cardClass =
    "rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-8";

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/heritage-office"
        inquiryHref="#ecopion-contact"
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
            href: "/eco-pion",
            isLink: true,
          },
        ]}
      />

      <div
        className={`fixed right-5 top-24 z-[80] rounded-2xl border border-[#E5C996]/30 bg-white/95 px-5 py-4 text-sm font-medium text-[#0B1F35] shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-500 md:right-8 ${
          showSuccess
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        상담 신청이 접수되었습니다.
      </div>

      <main>
        <section className="relative h-[100vh] w-full overflow-hidden pt-24 md:pt-28">
          <div className="absolute inset-0">
            <img
              src="/images/hero-eco-pion.jpg"
              alt="에코피온 히어로 배경"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#061525]/65" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(229,201,150,0.22),transparent_32%)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 md:px-10 lg:px-12">
            <div className="max-w-6xl text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#EAD9BC] md:text-base">
                ECO-PION · HERITAGE ASSET DESIGN
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl xl:text-[84px]">
                자산은 남길 수 있습니다
                <br />
                그러나 유산은
                <br />
                설계해야 합니다
              </h1>

              <p className="mt-7 max-w-4xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
                에코피온은 자산가의 철학과 자산, 공익적 비전, 문화적 가치를
                <br />
                비영리법인·재단·박물관·미술관·공익사업 구조로 연결하는
                <br />
                AI시대의 헤리티지 자산 설계 직업군입니다.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#ecopion-contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-7 py-4 text-sm font-bold text-[#0B1F35] shadow-[0_18px_45px_rgba(229,201,150,0.24)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_24px_60px_rgba(229,201,150,0.34)] md:text-base"
                >
                  비공개 상담 신청
                </a>

                <a
                  href="#ecopion-intro"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/15 md:text-base"
                >
                  에코피온이란?
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="ecopion-intro" className="scroll-mt-28 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Definition"
              title="에코피온은 자산을 유산으로 바꾸는 문명설계자입니다"
              desc="Eco-pion은 Economy, Ecology, Pio의 의미를 결합한 새로운 직업군입니다. 경제를 삶을 운영하는 수단으로 이해하고, 생태를 생명의 본질로 바라보며, 기술과 인간성, 자산과 공익, 가문과 사회를 하나의 지속 가능한 구조로 연결합니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {valueCards.map((item) => (
                <div key={item.title} className={cardClass}>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96B]">
                    ECO-PION
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-[34px] bg-[#081A2F] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:p-10">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                One Sentence
              </div>
              <p className="mt-5 text-xl font-semibold leading-9 md:text-3xl md:leading-[1.55]">
                에코피온은 AI시대 자연과 인류의 생명 가치를 지키고,
                생태·기술·경제·정신의 균형을 설계하며,
                한 세대의 성취가 다음 세대의 질서와 공적 유산으로 이어지도록 돕는
                지속가능한 문명설계자입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="ecopion-target" className="scroll-mt-28 py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Target"
              title="어떤 분들에게 에코피온이 필요한가"
              desc="재단, 박물관, 미술관, 공익법인 설립은 단순 서류 작업이 아닙니다. 자산의 목적, 가문의 철학, 공익적 방향, 운영 가능성을 함께 설계해야 합니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {targetCards.map((item) => (
                <div key={item.title} className={cardClass}>
                  <h3 className="text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ecopion-transition" className="scroll-mt-28 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Before & After"
              title="선한 뜻이 실제로 작동하는 구조가 됩니다"
              desc="에코피온 컨설팅은 막연한 사회공헌 의지를 실제 법인, 재단, 브랜드, 운영체계, 후원 구조로 전환합니다."
              center
            />

            <div className="mt-14 overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="grid bg-[#081A2F] text-white md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                    Before
                  </div>
                  <h3 className="mt-4 text-3xl font-bold">
                    자산은 있으나 구조가 없는 상태
                  </h3>
                </div>
                <div className="border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                    After
                  </div>
                  <h3 className="mt-4 text-3xl font-bold">
                    유산으로 작동하는 제도적 구조
                  </h3>
                </div>
              </div>

              {[
                [
                  "재단을 만들고 싶지만 절차와 방향이 막막함",
                  "설립 유형, 주무관청, 정관, 출연재산, 공익 지정 방향이 정리됨",
                ],
                [
                  "가족 간 생각이 다르고 기준이 없음",
                  "가족 헌장과 가문 철학으로 의사결정 기준이 생김",
                ],
                [
                  "미술품과 유물은 있으나 활용 방향이 없음",
                  "박물관, 미술관, 아카이브, 교육사업으로 연결됨",
                ],
                [
                  "기부와 후원이 일회성에 머무름",
                  "목적사업, 운영규정, 후원자 관리 체계로 지속성이 생김",
                ],
                [
                  "기관명과 소개자료가 약함",
                  "브랜드, 소개서, 홈페이지 메시지가 하나의 정체성으로 통합됨",
                ],
              ].map(([before, after]) => (
                <div
                  key={before}
                  className="grid border-t border-slate-200 md:grid-cols-2"
                >
                  <div className="bg-[#FCFBF8] p-5 text-sm leading-7 text-slate-700 md:p-6 md:text-base">
                    {before}
                  </div>
                  <div className="border-t border-slate-200 bg-white p-5 text-sm font-semibold leading-7 text-[#0B1F35] md:border-l md:border-t-0 md:p-6 md:text-base">
                    {after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ecopion-consulting" className="scroll-mt-28 py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Service"
              title="에코피온 컨설팅 서비스 구성"
              desc="자산 진단부터 법인 구조, 브랜드, 운영체계, 다음 세대 계승 구조까지 한 번에 연결합니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {serviceCards.map((item) => (
                <div key={item.title} className={cardClass}>
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96B]">
                    Consulting Scope
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Roadmap"
              title="에코피온 실행 로드맵"
              desc="상담 이후에는 진단, 구조 선택, 문서·브랜드 설계, 운영체계 구축의 단계로 진행됩니다."
              center
            />

            <div className="mt-14 grid gap-6 xl:grid-cols-4">
              {processItems.map((item) => (
                <div key={item.step} className={cardClass}>
                  <div className="text-4xl font-bold text-[#C9A96B]">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Trust"
              title="상담 후 가장 많이 정리되는 핵심 가치"
              desc="에코피온 상담은 막연한 구상을 실무적 판단 기준으로 바꾸는 데 초점을 둡니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {trustCards.map((item) => (
                <div key={item.title} className={cardClass}>
                  <h3 className="text-2xl font-bold text-[#0B1F35]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="FAQ"
              title="자주 묻는 질문"
              desc="에코피온 컨설팅을 신청하기 전 자주 확인하는 질문입니다."
              center
            />

            <div className="mt-14 space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5 transition-all duration-300 open:bg-white open:shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-6"
                >
                  <summary className="cursor-pointer list-none text-lg font-bold text-[#0B1F35] md:text-xl">
                    <div className="flex items-center justify-between gap-4">
                      <span>{item.question}</span>
                      <span className="text-[#C9A96B] transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </div>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="ecopion-contact" className="scroll-mt-28 py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[34px] bg-[#081A2F] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                  Contact
                </div>
                <h2 className="mt-4 text-3xl font-bold leading-[1.35] md:text-5xl">
                  지금 필요한 것은
                  <br />
                  설립 서류가 아니라
                  <br />
                  설립 방향입니다
                </h2>
                <p className="mt-6 text-sm leading-8 text-slate-200 md:text-base">
                  재단, 박물관, 미술관, 공익법인은 한 번 설립하면 쉽게 바꾸기 어렵습니다.
                  목적, 자산, 정관, 이사회, 운영규정, 브랜드, 후원 구조, 세대 계승 방향을
                  처음부터 함께 검토해야 합니다.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "어떤 법인 구조가 적합한지 진단",
                    "재단법인·공익법인·문화재단 방향 검토",
                    "박물관·미술관 설립 전 준비사항 확인",
                    "가문 철학과 설립 취지 문서화 방향 제안",
                    "브랜드·홈페이지·아카이브 구축 방향 안내",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-10">
                <SectionTitle
                  badge="Inquiry"
                  title="비공개 상담 신청"
                  desc="아래 내용을 남겨주시면 재단·박물관·미술관·공익법인 설립 가능성을 검토하여 상담 순서에 따라 연락드립니다."
                />

                <form onSubmit={handleInquirySubmit} className="mt-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    <input
                      value={form.organization}
                      onChange={(e) =>
                        updateForm("organization", e.target.value)
                      }
                      placeholder="기관명 또는 가문명"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                    />
                    <input
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="성명"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="연락처"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                    />
                    <input
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="이메일"
                      type="email"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                    />
                  </div>

                  <textarea
                    value={form.message}
                    onChange={(e) => updateForm("message", e.target.value)}
                    placeholder="상담 희망 내용을 입력해 주세요. 예: 재단 설립, 박물관 설립, 미술관 설립, 공익법인 지정, 가문 유산 설계, 컬렉션 아카이브 등"
                    required
                    rows={7}
                    className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                  />

                  <div className="mt-5 rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm leading-7 text-slate-600">
                    문의 접수 및 상담 응대를 위한 개인정보 수집·이용에 동의합니다.
                    입력하신 정보는 상담 목적 외로 사용하지 않습니다.
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full bg-[#081A2F] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(11,31,53,0.18)] transition-all duration-300 hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
                    >
                      {isSubmitting
                        ? "접수 중입니다"
                        : "비공개 상담 신청"}
                    </button>

                    <button
                      type="button"
                      onClick={handleEmailInquiryClick}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:text-base"
                    >
                      이메일로 직접 문의하기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0B1F35] py-12">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                Eco-pion Page Menu
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {bottomPageMenu.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/90 transition-all duration-300 hover:-translate-y-[1px] hover:border-[#E5C996]/40 hover:text-[#E5C996]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter leftText="NPOLAP" rightItems={siteMapItems} />
    </div>
  );
}
