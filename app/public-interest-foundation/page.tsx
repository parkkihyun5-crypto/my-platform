"use client";

import { FormEvent, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import UnifiedCard from "@/components/UnifiedCard";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { submitInquiry } from "@/lib/inquiry-client";

type EstablishmentType = {
  id: string;
  legal: string;
  name: string;
  summary: string;
  procedure: string;
  difficulty: string;
  period: string;
  budget: string;
  trust: string;
  flexibility: string;
  receipt: string;
  structure: string;
  recommended: string;
};

type PackageItem = {
  id: string;
  subtitle: string;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
};

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const aboutItems = [
  {
    title: "철학 중심 설계",
    description:
      "임의단체, 사단법인, 재단법인, 공익법인 중 설립 목적과 운영 방식에 맞는 존재의 이유와 지속될 가치를 먼저 설계합니다.",
  },
  {
    title: "공익법인 구조설계",
    description:
      "공익법인 설립은 절차가 아니라 철학과 구조의 설계입니다. 목적·자산·정관·운영까지 공익법인 구조를 통합 설계합니다",
  },
  {
    title: "브랜딩까지 연결",
    description:
      "기관명, 상징, 로고, 문서디자인, 웹페이지를 통해 공적 신뢰를 구축합니다.",
  },
];

const memberItems = [
  "법인 설립 및 운영 구조 검토",
  "정관 · 규정 · 대외문서 기획",
  "브랜드 전략 · 로고 · 홈페이지 방향 설계",
];

const serviceItems = [
  {
    title: "공익법인설립",
    description: "비영리 조직 구조 검토부터 허가·등기 준비까지 단계별 컨설팅",
    href: "/public-interest-foundation",
  },
  {
    title: "사회적기업설립",
    description: "사회적 목적, 거버넌스, 정관, 인증 준비까지 연계 지원",
    href: "/social-enterprise",
  },
  {
    title: "브랜딩서비스",
    description: "기관명, 로고, CI·BI, 소개서, 홈페이지 방향 설계",
    href: "/branding",
  },
  {
    title: "헤리티지오피스",
    description:
      "가문의 철학과 자산, 공익적 비전을 통합하여 지속 가능한 유산 관리 및 운영 체계를 설계합니다.",
    href: "/heritage-office",
  },
];

const establishmentTypes: EstablishmentType[] = [
  {
    id: "voluntary",
    legal: "자율적 모임",
    name: "비영리 임의단체",
    summary:
      "빠르게 시작할 수 있지만 공신력과 제도적 확장성은 비교적 제한됩니다.",
    procedure: "세무서 신고",
    difficulty: "매우 쉬움",
    period: "1~3일",
    budget: "30~50만 대행료,정관 등 문서작성시50~100추가", 
    structure: "대표 중심",
    receipt: "불가",
    trust: "기초 단계",
    flexibility: "높음",
    recommended: "소규모 시작 조직",
  },
  {
    id: "association",
    legal: "회원 기반 법인",
    name: "사단법인",
    summary: "회원 구조와 공익 목적을 갖춘 대표적인 비영리법인 형태입니다.",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "어려움",
    period: "3~6개월",
    budget: "최소3000~5000만 이상",
    structure: "총회 · 이사회 중심",
    receipt: "지정 요건 충족 시 가능",
    trust: "높음",
    flexibility: "중간",
    recommended: "협회형 · 회원형 조직",
  },
  {
    id: "foundation",
    legal: "자산 기반 법인",
    name: "재단법인",
    summary:
      "출연재산과 장기 운영 구조가 명확할 때 적합한 고급형 법인 구조입니다.",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "매우 어려움",
    period: "6개월~1년",
    budget: "1억~50억 이상",
    structure: "이사회 중심",
    receipt: "지정 요건 충족 시 가능",
    trust: "매우 높음",
    flexibility: "낮음",
    recommended: "기금형 · 재산형 조직",
  },
  {
    id: "public-benefit",
    legal: "공익성 인증 구조",
    name: "공익법인",
    summary:
      "공신력은 가장 높지만 공익성 관리 기준과 사후 운영 체계가 매우 중요합니다.",
    procedure: "법인 설립 후 지정 절차",
    difficulty: "최고 수준",
    period: "법인 설립 후 추가 심사",
    budget: "5000만 이상~",
    structure: "공익 거버넌스",
    receipt: "가능",
    trust: "최상",
    flexibility: "낮음",
    recommended: "대형 후원 · 공익사업 조직",
  },
];

const consultingPackages: PackageItem[] = [
  {
    id: "ngo-basic",
    subtitle: "Quick Start",
    name: "임의단체 설립 패키지",
    description: "기본형 설립 컨설팅, 정관 등 허가서류 추가 작성시 비용추가",
    price: 500000,
  },
  {
    id: "association-pro",
    subtitle: "Association Pro",
    name: "사단법인 설립 패키지",
    description: "정관, 허가서류, 운영구조 설계를 포함한 표준형 패키지",
    price: 3000000,
    popular: true,
  },
  {
    id: "foundation-premium",
    subtitle: "Foundation Premium",
    name: "재단법인 설립 패키지",
    description: "출연재산 구조와 허가 전략까지 포함한 고급 패키지",
    price: 7000000,
  },
  {
    id: "public-signature",
    subtitle: "Public Signature",
    name: "공익법인 지정 패키지",
    description: "공익성 요건과 지정 전략을 포함한 프리미엄 패키지",
    price: 12000000,
  },
];

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PublicInterestFoundationPage() {
  const [selectedTypeId, setSelectedTypeId] = useState<string>("association");
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedType =
    establishmentTypes.find((item) => item.id === selectedTypeId) ??
    establishmentTypes[1];

  const selectedPackages = consultingPackages.filter((item) =>
    selectedPackageIds.includes(item.id)
  );

  const selectedPackagesText =
    selectedPackages.length > 0
      ? selectedPackages.map((item) => item.name).join(", ")
      : "선택없음";

  const selectedPackagesTotal = selectedPackages.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const estimatedTotal = selectedPackagesTotal;

  function togglePackage(id: string): void {
    setSelectedPackageIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  const mailtoHref = useMemo(() => {
    const subject = `[NPOLAP 문의하기] ${form.organization || "기관명 미입력"}`;
    const body = [
      "안녕하세요. 문의를 드립니다.",
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
  }, [form]);

  async function handleInquirySubmit(
    e: FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await submitInquiry(
        form,
        "public-interest-foundation",
        "공익법인설립"
      );

      if (!response.ok) {
        window.location.href = mailtoHref;
        return;
      }

      setForm({
        organization: "",
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      alert("문의가 정상적으로 접수되었습니다.");
    } catch {
      window.location.href = mailtoHref;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/public-interest-foundation"
        inquiryHref="#contact"
        menuItems={[
          { label: "공익법인설립", href: "/public-interest-foundation", isLink: true },
          { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
          { label: "브랜딩서비스", href: "/branding", isLink: true },
          { label: "헤리티지오피스", href: "/heritage-office", isLink: true },
          { label: "에코피온", href: "/heritage-office", isLink: true },
        ]}
       
      />

      <main>
        <section className="relative h-[100vh] w-full overflow-hidden pt-24 md:pt-28">
          <div className="absolute inset-0">
            <img
              src="/images/hero-public-interest.jpg"
              alt="public interest foundation hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 md:px-10 lg:px-12">
            <div className="max-w-5xl text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EAD9BC] md:text-base">
                Public Foundations
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tighter md:text-6xl xl:text-[84px]">
                자산을 넘어
                <br />
                세대를 잇는 유산을 설계합니다
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
                NPOLAP은 가문의 철학, 공익적 비전, 정교한 제도 설계를 연결하여
                <br />
                개인의 성취를 시대의 공적 유산으로 완성하는
                <br />
                공익법인 설립 및 유산 설계 전문 컨설팅 그룹입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="ABOUT NPOLAP"
              title="헤리티지 자산 설계 기반 통합 컨설팅"
              desc="많은 이들이 공익법인을 ‘설립 절차’로 이해합니다. 진정한 공익법인은 단순한 조직이 아니라, 설립구성원들의 철학과 사회적 책임이 제도화된 구조입니다. NPOLAP은 법률과 행정, 브랜딩과 디지털 아카이브를 통합하여 철학이 선언에 머무르지 않고 실제로 작동하는 시스템을 설계합니다."
              center
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {aboutItems.map((item) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="members" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="MEMBERS"
              title="전문가 협업 기반의 실행 구조"
              desc="공익법인 설립은 절차가 아니라 철학과 구조의 설계에서 시작됩니다. 목적사업, 출연 자산, 정관 설계, 문서, 허가, 시스템 구축과 운영 방향의 실행까지 통합적으로 설계합니다."
              center
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {memberItems.map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 text-center text-lg font-semibold text-[#0B1F35] shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="SERVICES"
              title="업무분야"
              desc="공익법인 설립은 단순히 서류를 만드는 과정이 아니라, 설립자의 선의가 사회적 제도로 안착하는 설계의 시작입니다. 엔포렙은 설립자의 자산과 철학에 가장 최적화된 법적 형태를 제안하고 완성해 드립니다."
              center
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {serviceItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-[#0B1F35]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <div className="mt-6 text-sm font-semibold text-[#0B1F35]">
                    자세히 보기 →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

                <section id="establishment" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="ESTABLISHMENT"
              title="공익법인 설립 유형 비교"
              desc="어떤 일을 하고 싶은지(성격)와 무엇을 가지고 있는지(자원)를 분석하여, 우리 조직의 철학을 담기에 가장 적합하고 단단한 '그릇'을 설계하는 과정입니다."
              center
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-4">
              {establishmentTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTypeId(item.id)}
                  className={`p-6 text-left rounded-[30px] border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] ${
                    selectedTypeId === item.id
                      ? "border-[#1E1E1E] shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
                      : ""
                  }`}
                >
                  <div className="text-sm font-semibold text-[#C9A96B]">{item.legal}</div>
                  <div className="mt-3 text-2xl font-bold text-[#0B1F35]">{item.name}</div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                    {item.summary}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm md:text-[15px]">
                    <div className="rounded-[18px] bg-[#F6F3EE] px-4 py-3">
                      <div className="text-slate-500">절차</div>
                      <div className="mt-1 font-semibold text-[#0B1F35]">{item.procedure}</div>
                    </div>
                    <div className="rounded-[18px] bg-[#F6F3EE] px-4 py-3">
                      <div className="text-slate-500">난이도</div>
                      <div className="mt-1 font-semibold text-[#0B1F35]">{item.difficulty}</div>
                    </div>
                    <div className="rounded-[18px] bg-[#F6F3EE] px-4 py-3">
                      <div className="text-slate-500">기간</div>
                      <div className="mt-1 font-semibold text-[#0B1F35]">{item.period}</div>
                    </div>
                    <div className="rounded-[18px] bg-[#F6F3EE] px-4 py-3">
                      <div className="text-slate-500">설립예산</div>
                      <div className="mt-1 font-semibold text-[#0B1F35]">{item.budget}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                  SELECTED TYPE
                </div>

                <h3 className="mt-4 text-3xl font-bold text-[#0B1F35] md:text-4xl">
                  {selectedType.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                  {selectedType.summary}
                </p>

                <div className="mt-6 rounded-[24px] bg-[#F8F6F1] p-4 md:p-6">
                  <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:grid-cols-[140px_1fr] md:text-base">
                    <div className="font-semibold text-slate-500">조직 구조</div>
                    <div className="text-slate-800">{selectedType.structure}</div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:grid-cols-[140px_1fr] md:text-base">
                    <div className="font-semibold text-slate-500">기부금 영수증</div>
                    <div className="text-slate-800">{selectedType.receipt}</div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:grid-cols-[140px_1fr] md:text-base">
                    <div className="font-semibold text-slate-500">대외 신뢰도</div>
                    <div className="text-slate-800">{selectedType.trust}</div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:grid-cols-[140px_1fr] md:text-base">
                    <div className="font-semibold text-slate-500">운영 유연성</div>
                    <div className="text-slate-800">{selectedType.flexibility}</div>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm last:border-b-0 md:grid-cols-[140px_1fr] md:text-base">
                    <div className="font-semibold text-slate-500">추천 대상</div>
                    <div className="text-slate-800">{selectedType.recommended}</div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="overflow-hidden rounded-[14px] border border-slate-300 bg-white">
                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300 bg-[#FAF8F4]">
                      <div className="px-3 py-2 text-center text-[15px] font-bold text-[#111827]">
                        설립유형
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-center text-[15px] font-bold text-[#111827]">
                        {selectedType.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300">
                      <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                        절차
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-sm font-semibold text-[#111827]">
                        {selectedType.procedure}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300">
                      <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                        기간
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-sm font-semibold text-[#111827]">
                        {selectedType.period}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300">
                      <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                        상품
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-sm font-semibold text-[#111827]">
                        {selectedPackages.length > 0
                          ? selectedPackages.map((item) => item.name).join(", ")
                          : "선택없음"}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300">
                      <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                        기본 예산 참고
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-sm font-semibold text-[#111827]">
                        {selectedType.budget}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr] border-b border-slate-300">
                      <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                        선택 패키지 금액
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-sm font-semibold text-[#111827]">
                        {formatKRW(selectedPackagesTotal)}
                      </div>
                    </div>

                    <div className="grid grid-cols-[170px_1fr]">
                      <div className="px-3 py-2 text-base font-bold text-slate-800">
                        예상금액
                      </div>
                      <div className="border-l border-slate-300 px-3 py-2 text-base font-bold text-[#111827]">
                        {formatKRW(selectedPackagesTotal)}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#111827]">
                    실제 비용은 조직 규모, 허가 전략, 제출 문서 범위, 추가 자문 여부에 따라
                    조정될 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="rounded-[36px] bg-[#081A2F] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                  CONSULTING PACKAGE
                </div>

                <h3 className="mt-4 text-2xl font-bold md:text-3xl">
                  컨설팅 서비스 선택
                </h3>

                <div className="mt-6 space-y-4">
                  {consultingPackages.map((item) => {
                    const selected = selectedPackageIds.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => togglePackage(item.id)}
                        className={`w-full rounded-[24px] border p-5 text-left transition-all duration-300 ${
                          selected
                            ? "border-white bg-white text-[#0B1F35] shadow-[0_20px_50px_rgba(255,255,255,0.10)]"
                            : "border-white/10 bg-white/5 text-white hover:-translate-y-[2px] hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div
                              className={`text-xs font-semibold uppercase tracking-[0.18em] md:text-sm ${
                                selected ? "text-[#C9A96B]" : "text-[#EAD9BC]"
                              }`}
                            >
                              {item.subtitle}
                            </div>

                            <div className="mt-2 text-lg font-bold md:text-xl">
                              {item.name}
                            </div>

                            <div className="mt-2 text-sm leading-7 opacity-90 md:text-base">
                              {item.description}
                            </div>
                          </div>

                          {item.popular ? (
                            <span className="rounded-full bg-[#EAD9BC] px-3 py-1 text-[11px] font-bold text-[#0B1F35] md:text-xs">
                              추천
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-4 text-2xl font-bold md:text-3xl">
                          {formatKRW(item.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="ONLINE CONSULTING"
              title="문의하기"
              desc="개인정보 활용: 견적 제공 및 상담을 위한 개인정보 수집에 동의하실 경우에만 문의가 접수됩니다."
              center
            />

            <form
              onSubmit={handleInquirySubmit}
              className="mt-14 rounded-[30px] border border-slate-200/90 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)] md:p-10"
            >
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
                placeholder="상담을 원하는 내용을 입력해 주세요."
                className="mt-4"
                rows={7}
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center rounded-full bg-[#081A2F] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,31,53,0.14)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(11,31,53,0.20)] md:px-7 md:py-4 md:text-base ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? "접수 중..." : "문의하기"}
                </button>

                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50 md:px-7 md:py-4 md:text-base"
                >
                  이메일로 문의하기
                </a>
              </div>
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