"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import UnifiedCard from "@/components/UnifiedCard";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import UiButton from "@/components/UiButton";

type BenefitGroup = {
  title: string;
  items: string[];
};

type PurposeType = {
  title: string;
  desc: string;
};

type GovernanceGroup = {
  title: string;
  items: string[];
};

type ServicePackage = {
  id: string;
  title: string;
  desc: string;
  price: number;
};

type ConsultationFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const socialBenefits: BenefitGroup[] = [
  {
    title: "세제·보험 지원",
    items: [
      "법인세·소득세 3년 100% 면제, 이후 2년 50% 감면",
      "취득세·등록세 50% 감면",
      "재산세 25% 감면",
      "의료보건·교육 용역 부가가치세 면제",
      "4대 보험 사업주 부담분 일부 지원",
    ],
  },
  {
    title: "경영·재정 지원",
    items: [
      "성장단계별 맞춤형 컨설팅 지원",
      "공공기관 우선구매 권고",
      "전문인력 인건비 지원",
      "사업개발비 지원",
      "부지 구입비·시설비 지원(융자/임대)",
    ],
  },
];

const certificationRequirements: string[] = [
  "일정 조직형태를 갖춤",
  "사회적 목적 실현을 위해 설립",
  "1인 이상 유급근로자 고용",
  "일정 영업 수익 확보",
  "이해관계자가 참여하는 의사결정구조",
  "이윤의 사회적 목적 사용",
  "사회적기업용 정관 구비",
];

const organizationTypes = {
  possible: [
    "민법상 법인 또는 조합, 상법상 회사",
    "공익법인",
    "비영리민간단체",
    "사회복지법인",
    "생활협동조합",
    "그 밖의 법률상 비영리단체",
  ],
  impossible: [
    "개인사업자",
    "공공기관·지자체·지방공기업 출연·출자 형태",
    "대기업 및 대기업 관계 법인",
  ],
};

const purposeTypes: PurposeType[] = [
  {
    title: "일자리 제공형",
    desc: "취약계층 고용비율 30% 이상",
  },
  {
    title: "사회서비스 제공형",
    desc: "취약계층 대상 사회서비스 제공비율 30% 이상",
  },
  {
    title: "지역사회 공헌형",
    desc: "지역 취약계층 비율 또는 사회서비스 수혜 비율 20% 이상",
  },
  {
    title: "혼합형",
    desc: "취약계층 고용비율 20% 이상 + 서비스 수혜 비율 20% 이상",
  },
  {
    title: "기타형",
    desc: "불특정다수 대상 사업으로 별도 기준 검토",
  },
];

const governanceCards: GovernanceGroup[] = [
  {
    title: "내부 이해관계자",
    items: ["근로자대표"],
  },
  {
    title: "외부 이해관계자",
    items: [
      "서비스수혜자대표",
      "보호자대표",
      "후원자",
      "종교단체 종사자",
      "사회복지 종사자",
      "연계기업·연계지자체 담당자",
      "지역사회인사",
      "기타",
    ],
  },
];

const governanceRules: [string, string][] = [
  ["이사 수", "3명 이상"],
  ["이사 종류", "대표이사 · 사내이사 · 사외이사"],
  [
    "구성",
    "대표이사 1명 이상 / 근로자대표인 사내이사 1명 이상 / 사외이사 1명 이상",
  ],
  [
    "주의 사항",
    "근로자대표인 사내이사와 사외이사를 합한 수가 전체 이사의 과반수 이상",
  ],
];

const articlesRequired: string[] = [
  "목적",
  "사업내용",
  "명칭",
  "주된 사무소의 소재지",
  "지배구조 형태, 운영방식, 의사결정방식",
  "수익배분 및 재투자에 관한 사항",
  "종사자의 구성 및 임면에 관한 사항",
  "해산 및 청산에 관한 사항",
];

const incorporationDocs = {
  electronic: ["주주 및 임원 전원 개인용 은행 공동인증서", "잔고증명서"],
  paper: [
    "임원 전원의 개인인감증명서 및 개인인감도장",
    "임원 전원의 주민등록초본 또는 등본",
    "주주 전원의 일반도장 또는 개인인감도장",
    "잔고증명서",
  ],
};

const certificationSteps: [string, string, string][] = [
  ["1단계", "인증계획 공고", "고용노동부"],
  ["2단계", "상담 및 컨설팅", "권역별 지원기관, 진흥원"],
  ["3단계", "인증신청 및 접수", "진흥원"],
  ["4단계", "신청서류검토 및 현장실사 계획수립", "진흥원"],
  ["5단계", "현장실사", "진흥원, 권역별 지원기관"],
  ["6단계", "중앙부처 및 광역자치단체 추천", "진흥원 ↔ 중앙부처, 광역지자체"],
  ["7단계", "검토보고자료 제출", "진흥원 → 고용노동부"],
  ["8단계", "인증심사", "고용노동부 사회적기업 육성전문위원회"],
  ["9단계", "인증결과 안내 및 인증서 교부", "고용노동부, 고용센터, 진흥원"],
];

const certificationDocs: string[] = [
  "사회적기업 인증 신청서",
  "사회적기업 사실확인서(목적 유형별)",
  "법인 등기부등본",
  "유급근로자명부",
  "사회서비스 제공 확인서류",
  "취약계층 고용 증빙서류",
  "정관 사본(공증 필수)",
  "이사회회의록 2회분",
  "재무제표(전문가 확인 필수)",
  "정부·지자체 지원사항 확인서류",
  "개인정보 수집·이용·제공 동의서",
  "인증신청기관 개요",
  "주주명부",
  "이사회 명부",
  "근로계약서, 취업규칙",
  "4대 보험 가입확인서류, 급여대장",
  "계정별원장",
  "법인사업자등록증",
  "대표자 이력서",
  "사업장 소유증명서 또는 임대차계약서",
];

const servicePackages: ServicePackage[] = [
  {
    id: "basic",
    title: "사회적기업 설립 기본형",
    desc: "법인설립 구조 검토 + 기본 서류 방향 제시",
    price: 1500000,
  },
  {
    id: "cert",
    title: "사회적기업 인증 준비형",
    desc: "인증 요건 진단 + 정관/증빙 보완",
    price: 2500000,
  },
  {
    id: "integrated",
    title: "설립 + 인증 통합형",
    desc: "법인설립부터 인증 준비, 현장실사 대응까지 통합 지원",
    price: 5000000,
  },
  {
    id: "governance",
    title: "정관 · 거버넌스 보완형",
    desc: "의사결정구조, 이해관계자 참여, 정관 공증 대응",
    price: 1800000,
  },
];

function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function SocialEnterprisePage() {
  const [selectedPackageId, setSelectedPackageId] = useState<string>("integrated");
  const [consultationForm, setConsultationForm] = useState<ConsultationFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const selectedPackage: ServicePackage =
    servicePackages.find((item: ServicePackage) => item.id === selectedPackageId) ||
    servicePackages[2];

  const packageSummaryRows: [string, string][] = useMemo(
    () => [
      ["기본 컨설팅", "사회적기업 설립 가능성 검토"],
      ["정관 구조화", "사회적 목적·재투자·의사결정구조 반영"],
      ["인증 준비", "증빙서류 목록 및 제출 흐름 설계"],
      ["현장실사 대응", "실무 점검 체크리스트 제공"],
    ],
    []
  );

  const consultationMailtoHref: string = useMemo(() => {
    const subject: string = `[사회적기업 상담요청] ${
      consultationForm.organization || "기관명 미입력"
    }`;

    const body: string = [
      "안녕하세요. 사회적기업 설립/인증 상담을 요청드립니다.",
      "",
      `기관명: ${consultationForm.organization}`,
      `담당자명: ${consultationForm.name}`,
      `연락처: ${consultationForm.phone}`,
      `이메일: ${consultationForm.email}`,
      "",
      "상담 내용:",
      consultationForm.message || "(내용 미입력)",
      "",
      `관심 패키지: ${selectedPackage.title}`,
    ].join("\n");

    return `mailto:contact@example.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [consultationForm, selectedPackage]);

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
        title="공익법인 종합컨설팅 플랫폼"
        subtitle="SOCIAL ENTERPRISE · CONSULTING · CERTIFICATION"
        homeLabel="공익법인설립"
        homeHref="/"
        navItems={[
          { label: "사회적기업설립", href: "#hero" },
          { label: "비용안내", href: "#cost" },
          { label: "상담신청", href: "#contact" },
        ]}
      />

      <main>
        <section
          id="hero"
          className="relative overflow-hidden bg-gradient-to-br from-[#07182D] via-[#0B2340] to-[#143A63] text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,107,0.22),transparent_24%),radial-gradient(circle_at_left_bottom,rgba(255,255,255,0.08),transparent_20%)]" />
          <div className="relative mx-auto max-w-[1600px] px-4 py-20 md:px-10 md:py-36 lg:px-12 lg:py-40">
            <div className="inline-flex rounded-full border border-[#C9A96B]/30 bg-white/10 px-6 py-3 text-sm text-[#EAD9BC] backdrop-blur md:text-base">
              Social Enterprise Consulting
            </div>

            <div className="mt-10 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="max-w-6xl text-[40px] font-bold leading-[1.08] md:text-7xl xl:text-[88px]">
                  사회적기업 설립에서
                  <br />
                  인증까지 이어지는
                  <br />
                  종합 컨설팅 페이지
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-2xl">
                  사회적 목적, 조직형태, 이해관계자 거버넌스, 정관, 유급근로자,
                  영업수익, 인증서류와 현장실사 흐름까지 한 페이지에서 검토할 수 있도록
                  구성했습니다.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
  <UiButton href="#benefits" variant="primary" className="w-full sm:w-auto">
    혜택 보기
  </UiButton>
  <UiButton href="#requirements" variant="ghost" className="w-full sm:w-auto">
    인증 요건 보기
  </UiButton>
  <UiButton href="#contact" variant="ghost" className="w-full sm:w-auto">
    상담 안내 보기
  </UiButton>
</div>
              </div>

              <div className="rounded-[40px] border border-white/10 bg-white/10 p-9 shadow-2xl backdrop-blur md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                  운영 배포 기준 반영
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    "데모용 관리자 로그인 제거",
                    "실제 전송 없는 가짜 상담 버튼 제거",
                    "문의는 메일앱/전화 연결로 명확화",
                    "기존 디자인 톤과 카드 선택 기능은 유지",
                  ].map((item: string) => (
                    <div
                      key={item}
                      className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-base leading-8 text-slate-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="benefits"
          className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-32 lg:px-12"
        >
          <SectionTitle
            badge="Benefits"
            title="사회적기업 의미와 혜택"
            desc="사회적기업은 사회적 목적을 추구하면서 영리활동도 수행하는 기업으로, 취약계층 일자리 제공이나 사회서비스 제공, 지역사회 공헌을 핵심 목적으로 둡니다."
            center
          />

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {socialBenefits.map((group: BenefitGroup) => (
              <UnifiedCard key={group.title} title={group.title}>
                <div className="space-y-4">
                  {group.items.map((item: string) => (
                    <div
                      key={item}
                      className="rounded-[22px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </UnifiedCard>
            ))}
          </div>
        </section>

        <section id="requirements" className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Requirements"
              title="사회적기업 인증 요건 7가지"
              desc="사회적기업 인증은 법에서 정한 요건을 모두 갖추어야 하며, 실제 운영과 정관 기재사항 모두 심사됩니다."
              center
            />

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {certificationRequirements.map((item: string, index: number) => (
                <div
                  key={item}
                  className="rounded-[34px] border border-slate-200 bg-[#FCFBF8] p-8 shadow-sm transition duration-300 hover:scale-[1.01] hover:shadow-2xl"
                >
                  <div className="text-sm font-semibold tracking-[0.28em] text-[#C9A96B] md:text-base">
                    REQUIREMENT {index + 1}
                  </div>
                  <div className="mt-4 text-2xl font-bold leading-snug text-[#0B1F35] md:text-3xl">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-32 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <UnifiedCard subtitle="Organization Types" title="조직형태">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="text-base font-bold text-[#0B1F35] md:text-lg">
                    인증 가능 형태
                  </div>
                  <div className="mt-4 space-y-3">
                    {organizationTypes.possible.map((item: string) => (
                      <div
                        key={item}
                        className="rounded-[20px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-base font-bold text-[#0B1F35] md:text-lg">
                    인증 불가 형태
                  </div>
                  <div className="mt-4 space-y-3">
                    {organizationTypes.impossible.map((item: string) => (
                      <div
                        key={item}
                        className="rounded-[20px] bg-rose-50 px-5 py-4 text-base leading-8 text-rose-700 md:text-lg"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </UnifiedCard>

            <UnifiedCard subtitle="Social Purpose" title="사회적 목적 유형">
              <div className="space-y-4">
                {purposeTypes.map((item: PurposeType) => (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-slate-200 bg-[#FCFBF8] px-6 py-5"
                  >
                    <div className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                      {item.title}
                    </div>
                    <div className="mt-3 text-base leading-8 text-slate-600 md:text-lg">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </UnifiedCard>
          </div>
        </section>

        <section className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Operation Conditions"
              title="유급근로자 · 영업수익 · 의사결정구조"
              desc="실제 인증 심사에서 자주 확인되는 핵심 운영요건입니다."
              center
            />

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "유급근로자",
                  desc: "1인 이상의 유급근로자가 있어야 하며, 4대 보험과 최저임금 기준 충족 여부도 중요합니다.",
                },
                {
                  title: "영업수익",
                  desc: "인증 신청일 직전 6개월 기준 영업활동 총수입이 같은 기간 총 노무비의 50% 이상이어야 합니다.",
                },
                {
                  title: "이윤 사용",
                  desc: "배분 가능한 이윤의 3분의 2 이상을 사회적 목적 달성에 우선 사용해야 합니다.",
                },
              ].map((item: { title: string; desc: string }) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.desc}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-32 lg:px-12">
          <SectionTitle
            badge="Governance"
            title="이해관계자 참여 의사결정구조"
            desc="사회적기업은 내·외부 이해관계자가 중요한 의사결정에 참여하는 구조를 정관에 반영해야 합니다."
            center
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1fr]">
            {governanceCards.map((group: GovernanceGroup) => (
              <UnifiedCard key={group.title} title={group.title}>
                <div className="space-y-4">
                  {group.items.map((item: string) => (
                    <div
                      key={item}
                      className="rounded-[22px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </UnifiedCard>
            ))}
          </div>

          <UnifiedCard title="의사결정구조 기준" className="mt-10">
            <div className="space-y-3">
              {governanceRules.map(([label, value]: [string, string]) => (
                <div
                  key={label}
                  className="grid grid-cols-[150px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:text-base"
                >
                  <div className="font-semibold text-slate-500">{label}</div>
                  <div className="text-slate-800">{value}</div>
                </div>
              ))}
            </div>
          </UnifiedCard>
        </section>

        <section className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Articles & Registration"
              title="정관 필수사항과 법인 설립등기"
              desc="사회적기업은 사회적 목적 달성을 위한 필수 항목을 포함하고, 인증 신청 시 공증받은 정관을 제출해야 합니다."
              center
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <UnifiedCard title="정관 필수 기재사항">
                <div className="grid gap-4">
                  {articlesRequired.map((item: string, index: number) => (
                    <div
                      key={item}
                      className="rounded-[22px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                    >
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </UnifiedCard>

              <UnifiedCard title="법인 설립 필요서류">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <div className="text-base font-bold text-[#0B1F35] md:text-lg">
                      전자등기
                    </div>
                    <div className="mt-4 space-y-3">
                      {incorporationDocs.electronic.map((item: string) => (
                        <div
                          key={item}
                          className="rounded-[20px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold text-[#0B1F35] md:text-lg">
                      서류등기
                    </div>
                    <div className="mt-4 space-y-3">
                      {incorporationDocs.paper.map((item: string) => (
                        <div
                          key={item}
                          className="rounded-[20px] bg-[#F8F6F1] px-5 py-4 text-base leading-8 text-slate-700 md:text-lg"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] bg-[#FBF5EA] px-5 py-5 text-base leading-8 text-slate-700 md:text-lg">
                  정관과 의사록은 설립 단계부터 인증 제출 기준을 고려해 준비하는 것이
                  안전합니다.
                </div>
              </UnifiedCard>
            </div>
          </div>
        </section>

        <section
          id="cost"
          className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-32 lg:px-12"
        >
          <SectionTitle
            badge="Cost"
            title="사회적기업 컨설팅 비용안내"
            desc="패키지는 한 번에 1개만 선택되며, 선택된 항목은 아래 요약에 반영됩니다."
            center
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              {servicePackages.map((item: ServicePackage) => {
                const selected: boolean = selectedPackageId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSelectedPackageId((prev: string) =>
                        prev === item.id ? "" : item.id
                      )
                    }
                    className={`w-full rounded-[36px] border p-8 text-left shadow-sm transition duration-300 hover:scale-[1.01] hover:shadow-xl ${
                      selected
                        ? "border-[#0B1F35] bg-[#0B1F35] text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    <div className="text-3xl font-bold md:text-4xl">{item.title}</div>
                    <div
                      className={`mt-4 text-base leading-8 md:text-lg ${
                        selected ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {item.desc}
                    </div>
                    <div className="mt-6 text-2xl font-bold md:text-3xl">
                      {formatKRW(item.price)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[40px] bg-gradient-to-br from-[#081A2F] to-[#12345A] p-8 text-white shadow-2xl lg:sticky lg:top-28 lg:self-start md:p-10">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                Summary
              </div>
              <h3 className="mt-4 text-3xl font-bold md:text-4xl">통합견적요약</h3>

              {selectedPackageId ? (
                <>
                  <div className="mt-8 rounded-[32px] bg-white/5 p-6">
                    <div className="text-sm text-slate-300 md:text-base">선택 상품</div>
                    <div className="mt-3 text-3xl font-bold md:text-4xl">
                      {selectedPackage.title}
                    </div>
                    <div className="mt-3 text-base leading-8 text-slate-200 md:text-lg">
                      {selectedPackage.desc}
                    </div>
                    <div className="mt-6 text-3xl font-bold md:text-4xl">
                      {formatKRW(selectedPackage.price)}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 rounded-[32px] bg-white/5 p-6">
                    {packageSummaryRows.map(([label, value]: [string, string]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[140px_1fr] gap-4 text-sm md:text-base"
                      >
                        <div className="text-slate-300">{label}</div>
                        <div className="text-slate-100">{value}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-8 rounded-[32px] bg-white/5 p-6 text-base text-slate-200">
                  아직 선택된 상품이 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Certification Process"
              title="사회적기업 인증 절차와 신청서류"
              desc="인증은 통합정보시스템 신청, 서류검토, 현장실사, 추천, 전문위원회 심사를 거쳐 진행됩니다."
              center
            />

            <UnifiedCard className="mt-16">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm md:text-base">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-4 py-4 font-semibold">단계</th>
                      <th className="px-4 py-4 font-semibold">절차</th>
                      <th className="px-4 py-4 font-semibold">주관기관</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificationSteps.map(
                      ([step, process, agency]: [string, string, string]) => (
                        <tr
                          key={step}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-4 py-5 font-semibold text-[#0B1F35]">{step}</td>
                          <td className="px-4 py-5 text-slate-700">{process}</td>
                          <td className="px-4 py-5 text-slate-600">{agency}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </UnifiedCard>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {certificationDocs.map((item: string) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-slate-200 bg-[#FCFBF8] px-5 py-5 text-base leading-8 text-slate-700 md:text-lg"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-28 md:py-32">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10">
            <SectionTitle
              badge="Consultation"
              title="상담 안내"
              desc="기존처럼 실제 전송 없이 ‘상담 신청 완료’처럼 보이게 하지 않고, 메일앱으로 연결되는 운영형 구조로 바꿨습니다."
              center
            />

            <UnifiedCard className="mt-16">
              <div className="grid gap-5 md:grid-cols-2">
  <FormInput
    value={consultationForm.organization}
    onChange={(value: string) =>
      setConsultationForm((prev: ConsultationFormState) => ({
        ...prev,
        organization: value,
      }))
    }
    placeholder="기관명"
  />
  <FormInput
    value={consultationForm.name}
    onChange={(value: string) =>
      setConsultationForm((prev: ConsultationFormState) => ({
        ...prev,
        name: value,
      }))
    }
    placeholder="담당자명"
  />
  <FormInput
    value={consultationForm.phone}
    onChange={(value: string) =>
      setConsultationForm((prev: ConsultationFormState) => ({
        ...prev,
        phone: value,
      }))
    }
    placeholder="연락처"
  />
  <FormInput
    value={consultationForm.email}
    onChange={(value: string) =>
      setConsultationForm((prev: ConsultationFormState) => ({
        ...prev,
        email: value,
      }))
    }
    placeholder="이메일"
    type="email"
  />
</div>

              <FormTextarea
  value={consultationForm.message}
  onChange={(value: string) =>
    setConsultationForm((prev: ConsultationFormState) => ({
      ...prev,
      message: value,
    }))
  }
  placeholder="현재 설립 단계, 인증 준비 수준, 궁금한 점을 입력해 주세요."
  rows={6}
  className="mt-5"
/>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
  <UiButton href={consultationMailtoHref} variant="dark" className="w-full sm:w-auto">
    상담 메일 열기
  </UiButton>
  <UiButton href="tel:010-0000-0000" variant="secondary" className="w-full sm:w-auto">
    전화 문의
  </UiButton>
</div>
            </UnifiedCard>
          </div>
        </section>
      </main>

      <SiteFooter
        leftText="© PARK KI HYUN, 2026.1.17"
        rightItems={["사회적기업 설립 종합컨설팅", "인증 · 정관 · 거버넌스 · 비용안내"]}
      />
    </div>
  );
}