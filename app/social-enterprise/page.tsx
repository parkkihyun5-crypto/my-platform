"use client";
import { siteMenuItems } from "@/lib/site-menu";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useMemo, useState } from "react";
import { submitInquiry } from "@/lib/inquiry-client";

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const socialBenefits = [
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

const certificationRequirements = [
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

const purposeTypes = [
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

const governanceCards = [
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

const governanceRules = [
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

const articlesRequired = [
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

const certificationSteps = [
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

const certificationDocs = [
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

const servicePackages = [
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

function SectionTitle({
  badge,
  title,
  desc,
  center = false,
}: {
  badge: string;
  title: string;
  desc: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
        {badge}
      </div>
      <h2 className="mt-3 text-3xl font-bold text-[#0B1F35] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

export default function SocialEnterprisePage() {
  const [selectedPackageId, setSelectedPackageId] = useState("integrated");
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedPackage =
    servicePackages.find((item) => item.id === selectedPackageId) ?? servicePackages[2];

  const packageSummaryRows = useMemo(
    () => [
      ["기본 컨설팅", "사회적기업 설립 가능성 검토"],
      ["정관 구조화", "사회적 목적·재투자·의사결정구조 반영"],
      ["인증 준비", "증빙서류 목록 및 제출 흐름 설계"],
      ["현장실사 대응", "실무 점검 체크리스트 제공"],
    ],
    []
  );

  const mailtoHref = useMemo(() => {
    const subject = `[사회적기업 설립 상담] ${form.organization || "기관명 미입력"}`;
    const body = [
      "안녕하세요. 사회적기업 설립 상담 관련 문의를 드립니다.",
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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await submitInquiry(
        form,
        "social-enterprise",
        "사회적기업설립"
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
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
  mode="sub"
  logoText="SOCIAL ENTERPRISE"
  logoHref="/heritage-office"
  inquiryHref="#contact"
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
        <section
          id="hero"
          className="relative h-[100vh] w-full overflow-hidden pt-24 text-white md:pt-28"
        >
          <div className="absolute inset-0">
            <img
              src="/images/hero-social-enterprise.png"
              alt="social enterprise hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-6 md:px-10 lg:px-12">
            <div className="max-w-5xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EAD9BC] md:text-base">
                Social Enterprises
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl xl:text-[84px]">
                사회적기업 설립 및 인증
                <br />
                A to Z: 원스톱 솔루션
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
                세상을 위한 고귀한 도전에 확신을 더합니다.
                <br />
                사회적 가치로 향하는 길, 시작부터 인증까지 함께하겠습니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#benefits"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
                >
                  혜택 보기
                </a>
                <a
                  href="#requirements"
                  className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white transition duration-300 hover:scale-105 hover:bg-white/10"
                >
                  인증 요건 보기
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <SectionTitle
            badge="Benefits"
            title="사회적기업 의미와 혜택"
            desc="빵을 팔기 위해 고용하는 것이 아니라, 고용하기 위해 빵을 팝니다. 빵은 수단일 뿐, 본질은 그 빵을 만드는 사람의 일상을 지키는 일입니다.
            목적과 수단이 뒤바뀌지 않도록 중심을 잡는 것, 사회적 기업가가 실천해야할 가장 숭고한 약속입니다."
            center
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {socialBenefits.map((group) => (
              <div
                key={group.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-[#0B1F35]">{group.title}</h3>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-[#F8F6F1] px-4 py-3 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="requirements" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Requirements"
              title="사회적기업 인증 요건 7가지"
              desc="사회적기업 인증은 법에서 정한 요건을 모두 갖추어야 하며, 실제 운영과 정관 기재사항 모두 심사됩니다."
              center
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {certificationRequirements.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-sm transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="text-sm font-semibold tracking-[0.24em] text-[#C9A96B]">
                    REQUIREMENT {index + 1}
                  </div>
                  <div className="mt-3 text-xl font-bold text-[#0B1F35]">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                Organization Types
              </div>
              <h3 className="mt-3 text-3xl font-bold text-[#0B1F35]">조직형태</h3>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="text-sm font-bold text-[#0B1F35]">인증 가능 형태</div>
                  <div className="mt-3 space-y-2">
                    {organizationTypes.possible.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-[#0B1F35]">인증 불가 형태</div>
                  <div className="mt-3 space-y-2">
                    {organizationTypes.impossible.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                Social Purpose
              </div>
              <h3 className="mt-3 text-3xl font-bold text-[#0B1F35]">사회적 목적 유형</h3>

              <div className="mt-6 space-y-3">
                {purposeTypes.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-[#FCFBF8] px-4 py-4"
                  >
                    <div className="text-base font-bold text-[#0B1F35]">{item.title}</div>
                    <div className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Operation Conditions"
              title="유급근로자 · 영업수익 · 의사결정구조"
              desc="실제 인증 심사에서 자주 확인되는 핵심 운영요건을 따로 정리했습니다."
              center
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B1F35]">유급근로자</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  1인 이상의 유급근로자가 있어야 하며, 정규직뿐 아니라 비정규직과
                  파트타임도 포함될 수 있습니다. 다만 4대 보험과 최저임금 기준을
                  충족해야 합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B1F35]">영업수익</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  인증 신청일 직전 6개월 동안 영업활동 총수입이 같은 기간 총 노무비의
                  50% 이상이어야 하며, 재무제표와 계정별원장 등으로 입증합니다.
                </p>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B1F35]">이윤 사용</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  배분 가능한 이윤이 발생하면 3분의 2 이상을 근로조건 개선, 사회공헌,
                  고용확대·시설투자 등 사회적 목적에 우선 사용해야 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <SectionTitle
            badge="Governance"
            title="이해관계자 참여 의사결정구조"
            desc="사회적기업은 내·외부 이해관계자가 중요한 의사결정에 참여하는 구조를 정관에 반영해야 합니다."
            center
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
            {governanceCards.map((group) => (
              <div
                key={group.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-2xl font-bold text-[#0B1F35]">{group.title}</h3>
                <div className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0B1F35]">의사결정구조 기준</h3>
            <div className="mt-6 space-y-3">
              {governanceRules.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-200 py-3 text-sm last:border-b-0"
                >
                  <div className="font-semibold text-slate-500">{label}</div>
                  <div className="text-slate-800">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Articles & Registration"
              title="정관 필수사항과 법인 설립등기"
              desc="사회적기업은 일반 회사 정관과 달리 사회적 목적 달성을 위한 필수 항목을 포함하고, 인증 신청 시 공증받은 정관을 제출해야 합니다."
              center
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B1F35]">정관 필수 기재사항</h3>
                <div className="mt-5 grid gap-3">
                  {articlesRequired.map((item, index) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                    >
                      {index + 1}. {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-[#0B1F35]">법인 설립 필요서류</h3>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-bold text-[#0B1F35]">전자등기</div>
                    <div className="mt-3 space-y-2">
                      {incorporationDocs.electronic.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#0B1F35]">서류등기</div>
                    <div className="mt-3 space-y-2">
                      {incorporationDocs.paper.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#FBF5EA] px-4 py-4 text-sm leading-7 text-slate-700">
                  정관, 총회의사록, 이사회의사록은 원칙적으로 공증 대상이며,
                  자본금 10억 미만은 공증 의무가 면제될 수 있습니다. 다만 인증
                  신청 시에는 공증 정관 제출이 필요하므로 설립 단계에서 미리 준비하는
                  구성이 안전합니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
          <SectionTitle
            badge="Certification Process"
            title="사회적기업 인증 절차와 신청서류"
            desc="인증은 통합정보시스템에서 신청하고, 서류 검토와 현장실사, 중앙부처 추천, 전문위원회 심사를 거쳐 인증서를 교부받는 흐름입니다."
            center
          />

          <div className="mt-12 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-semibold">단계</th>
                    <th className="px-3 py-3 font-semibold">절차</th>
                    <th className="px-3 py-3 font-semibold">주관기관</th>
                  </tr>
                </thead>
                <tbody>
                  {certificationSteps.map(([step, process, agency]) => (
                    <tr key={step} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-3 py-3 font-semibold text-[#0B1F35]">{step}</td>
                      <td className="px-3 py-3 text-slate-700">{process}</td>
                      <td className="px-3 py-3 text-slate-700">{agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-[#0B1F35]">인증 신청 서류</h3>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {certificationDocs.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[#F8F6F1] px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cost" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Cost Guide"
              title="컨설팅 서비스 비용안내"
              desc="서비스 유형을 선택하면 예상 금액과 구성 항목을 바로 확인할 수 있도록 구성했습니다."
              center
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[32px] bg-gradient-to-br from-[#081A2F] to-[#12345A] p-6 text-white shadow-2xl">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
                  Service Type
                </div>
                <h3 className="mt-3 text-3xl font-bold">서비스 유형 선택</h3>

                <div className="mt-6 space-y-4">
                  {servicePackages.map((item) => {
                    const active = selectedPackageId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPackageId(item.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition duration-300 hover:scale-[1.02] ${
                          active
                            ? "border-[#E5C996] bg-white text-[#0B1F35]"
                            : "border-white/10 bg-white/5 text-white"
                        }`}
                      >
                        <div className="text-lg font-bold">{item.title}</div>
                        <div className="mt-2 text-sm leading-7 opacity-90">{item.desc}</div>
                        <div className="mt-4 text-xl font-bold">{formatKRW(item.price)}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold text-[#E5C996]">예상 총비용</div>
                  <div className="mt-3 text-4xl font-bold">{formatKRW(selectedPackage.price)}</div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                  Breakdown
                </div>
                <h3 className="mt-3 text-3xl font-bold text-[#0B1F35]">비용 구성 요약</h3>

                <div className="mt-6 space-y-3">
                  {packageSummaryRows.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[120px_1fr] gap-4 rounded-2xl bg-[#F8F6F1] px-4 py-4 text-sm"
                    >
                      <div className="font-semibold text-slate-500">{label}</div>
                      <div className="text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-[#FBF5EA] px-4 py-4 text-sm leading-7 text-slate-700">
                  접수해 주셔서 감사합니다. 상담 순서에 따라 검토 후 연락드리며,
                  최종 업무 범위와 금액은 제출자료 검토 후 확정됩니다.
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-700">
                  <div><strong>입금안내</strong></div>
                  <div className="mt-2">은행: 우리은행</div>
                  <div>계좌번호: 1005-404-403203</div>
                  <div>예금주: ILUNPOLAP컨설팅</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
  id="contact"
  className="mx-auto max-w-7xl px-6 py-20 scroll-mt-20 md:px-10 md:scroll-mt-24 lg:px-12"
>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-sm">
              <SectionTitle
                badge="Support"
                title="상담 전 준비하면 좋은 자료"
                desc="아래 자료를 준비하면 설립 구조와 인증 가능성 진단이 더 빨라집니다."
              />
              <div className="mt-6 space-y-3">
                {[
                  "법인 또는 단체 기본 소개서",
                  "사업 목적 초안",
                  "정관 초안 또는 기존 정관",
                  "근로자 현황 자료",
                  "매출·비용 자료 또는 사업계획서",
                  "회의록, 이해관계자 구성안",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle
                badge="Contact"
                title="사회적기업 설립 상담 신청"
                desc="설립, 인증, 정관, 현장실사, 비용안내 관련 상담을 접수할 수 있습니다."
              />

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    value={form.organization}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, organization: e.target.value }))
                    }
                    placeholder="기관명"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                  />
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="성명"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="연락처"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                  />
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="이메일"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                  />

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      첨부파일
                    </label>
                    <input
                      type="file"
                      multiple
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B1F35]"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      사업계획서, 정관 초안, 회의록, 재무자료 등을 첨부할 수 있습니다.
                    </p>
                  </div>
                </div>

                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  rows={6}
                  placeholder="현재 설립 단계, 인증 준비 수준, 궁금한 점을 입력해 주세요."
                  className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0B1F35]"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-6 w-full rounded-2xl bg-[#0B1F35] px-6 py-4 text-lg font-bold text-white transition duration-300 hover:scale-105 hover:shadow-2xl ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? "접수 중..." : "상담 신청하기"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <div className="bg-[#F6F3EE] px-6 pb-8">
        <div className="mx-auto flex max-w-7xl justify-end">
          <Link
            href="/admin"
            className="text-base font-bold text-[#0B1F35] transition duration-300 hover:scale-105"
          >
            관리자 로그인
          </Link>
        </div>
      </div>

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