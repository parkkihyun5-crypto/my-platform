"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import UnifiedCard from "@/components/UnifiedCard";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import UiButton from "@/components/UiButton";
type EstablishmentType = {
  id: string;
  name: string;
  legal: string;
  procedure: string;
  difficulty: string;
  period: string;
  budget: string;
  summary: string;
  details: [string, string][];
};

type PackageItem = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  price: number;
  desc: string;
  popular?: boolean;
};

type OptionItem = {
  id: string;
  label: string;
  price: number;
};

type DirectionItem = {
  id: string;
  label: string;
};

type StepItem = {
  step: string;
  title: string;
  desc: string;
};

type GuideFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
};

const promoItems: string[] = [
  "공익법인 설립부터 브랜딩·상표등록까지 원스톱 프리미엄 컨설팅",
  "사단법인 · 재단법인 · 공익법인 설립 구조 검토 지원",
  "기관명 · 영문명 · 로고 · 상표 전략 통합 설계",
  "브랜딩 패키지 · 홈페이지 기획 · 문서 디자인 시스템 구축",
  "상표등록 검색 · 절차 안내 · 비용안내",
];

const establishmentTypes: EstablishmentType[] = [
  {
    id: "voluntary",
    name: "비영리 임의단체",
    legal: "자율적 모임",
    procedure: "세무서 신고",
    difficulty: "매우 쉬움",
    period: "1~3일",
    budget: "30~50만",
    summary:
      "빠르게 시작할 수 있지만 공신력과 제도적 확장성은 비교적 제한됩니다.",
    details: [
      ["조직 구조", "대표 중심"],
      ["기부금 영수증", "불가"],
      ["대외 신뢰도", "기초 단계"],
      ["운영 유연성", "높음"],
      ["추천 대상", "소규모 시작 조직"],
    ],
  },
  {
    id: "association",
    name: "사단법인",
    legal: "회원 기반 법인",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "어려움",
    period: "3~6개월",
    budget: "200~300만",
    summary:
      "회원 구조와 공익 목적을 갖춘 대표적인 비영리법인 형태입니다.",
    details: [
      ["조직 구조", "총회 · 이사회 중심"],
      ["기부금 영수증", "지정 요건 충족 시 가능"],
      ["대외 신뢰도", "높음"],
      ["운영 유연성", "중간"],
      ["추천 대상", "협회형 · 회원형 조직"],
    ],
  },
  {
    id: "foundation",
    name: "재단법인",
    legal: "자산 기반 법인",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "매우 어려움",
    period: "6개월~1년",
    budget: "300~500만",
    summary:
      "출연재산과 장기 운영 구조가 명확할 때 적합한 고급형 법인 구조입니다.",
    details: [
      ["조직 구조", "이사회 중심"],
      ["기부금 영수증", "지정 요건 충족 시 가능"],
      ["대외 신뢰도", "매우 높음"],
      ["운영 유연성", "낮음"],
      ["추천 대상", "기금형 · 재산형 조직"],
    ],
  },
  {
    id: "public-benefit",
    name: "공익법인",
    legal: "공익성 인증 구조",
    procedure: "법인 설립 후 지정 절차",
    difficulty: "최고 수준",
    period: "법인 설립 후 추가 심사",
    budget: "300~700만",
    summary:
      "공신력은 가장 높지만 공익성 관리 기준과 사후 운영 체계가 매우 중요합니다.",
    details: [
      ["조직 구조", "공익 거버넌스"],
      ["기부금 영수증", "가능"],
      ["대외 신뢰도", "최상"],
      ["운영 유연성", "낮음"],
      ["추천 대상", "대형 후원 · 공익사업 조직"],
    ],
  },
];

const consultingPackages: PackageItem[] = [
  {
    id: "ngo-basic",
    name: "임의단체 설립 패키지",
    shortName: "임의단체",
    subtitle: "Quick Start",
    price: 500000,
    desc: "신속한 출발을 위한 기본형 설립 컨설팅",
  },
  {
    id: "association-pro",
    name: "사단법인 설립 패키지",
    shortName: "사단법인",
    subtitle: "Association Pro",
    price: 3000000,
    desc: "정관, 허가서류, 운영구조 설계를 포함한 표준형 패키지",
    popular: true,
  },
  {
    id: "foundation-premium",
    name: "재단법인 설립 패키지",
    shortName: "재단법인",
    subtitle: "Foundation Premium",
    price: 7000000,
    desc: "출연재산 구조와 허가 전략까지 포함한 고급 패키지",
  },
  {
    id: "public-signature",
    name: "공익법인 지정 패키지",
    shortName: "공익법인",
    subtitle: "Public Signature",
    price: 12000000,
    desc: "공익성 요건과 지정 전략을 포함한 프리미엄 패키지",
  },
];

const brandingPackages: PackageItem[] = [
  {
    id: "starter",
    name: "STARTER",
    shortName: "STARTER",
    subtitle: "BI Lite",
    price: 1500000,
    desc: "로고 중심의 기본형 브랜딩 패키지",
  },
  {
    id: "standard",
    name: "STANDARD",
    shortName: "STANDARD",
    subtitle: "BI Pro",
    price: 3000000,
    desc: "로고와 컬러 시스템을 포함한 표준형 패키지",
  },
  {
    id: "premium",
    name: "PREMIUM",
    shortName: "PREMIUM",
    subtitle: "CI Basic",
    price: 8000000,
    desc: "전략형 CI·BI 설계와 응용 시스템을 포함한 고급 패키지",
    popular: true,
  },
  {
    id: "signature",
    name: "SIGNATURE",
    shortName: "SIGNATURE",
    subtitle: "CI Full",
    price: 20000000,
    desc: "국제기관 수준의 아이덴티티 체계를 구축하는 최상위 패키지",
  },
];

const brandingOptions: OptionItem[] = [
  { id: "naming", label: "네이밍 개발", price: 2000000 },
  { id: "slogan", label: "슬로건 개발", price: 1000000 },
  { id: "ppt", label: "PPT 템플릿", price: 1000000 },
  { id: "website", label: "홈페이지 UI 설계", price: 5000000 },
  { id: "sns", label: "SNS 브랜드 키트", price: 1000000 },
  { id: "signage", label: "간판 · 사인 디자인", price: 2000000 },
];

const brandDirections: DirectionItem[] = [
  { id: "global", label: "글로벌기관형" },
  { id: "public", label: "공공기관형" },
  { id: "culture", label: "문화예술형" },
  { id: "sustain", label: "지속가능성중심" },
];

const trademarkSteps: StepItem[] = [
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

export default function Page() {
  const [selectedType, setSelectedType] = useState<string>("association");
  const [selectedConsultingIds, setSelectedConsultingIds] = useState<string[]>([]);
  const [selectedBrandingIds, setSelectedBrandingIds] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["naming"]);
  const [selectedDirection, setSelectedDirection] = useState<string>("global");
  const [vatIncluded, setVatIncluded] = useState<boolean>(false);
  const [trademarkKeyword, setTrademarkKeyword] = useState<string>("");
  const [trademarkClass, setTrademarkClass] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [topSearch, setTopSearch] = useState<string>("");
  const [guideForm, setGuideForm] = useState<GuideFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
  });

  const selectedTypeData: EstablishmentType =
    establishmentTypes.find((item: EstablishmentType) => item.id === selectedType) ||
    establishmentTypes[1];

  const selectedConsultingList: PackageItem[] = consultingPackages.filter((item) =>
    selectedConsultingIds.includes(item.id)
  );

  const selectedBrandingList: PackageItem[] = brandingPackages.filter((item) =>
    selectedBrandingIds.includes(item.id)
  );

  const consultingTotal: number = selectedConsultingList.reduce(
    (sum: number, item: PackageItem) => sum + item.price,
    0
  );

  const brandingTotal: number = selectedBrandingList.reduce(
    (sum: number, item: PackageItem) => sum + item.price,
    0
  );

  const optionTotal: number = selectedOptions.reduce((sum: number, id: string) => {
    const found: OptionItem | undefined = brandingOptions.find(
      (item: OptionItem) => item.id === id
    );
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotal: number = consultingTotal + brandingTotal + optionTotal;
  const total: number = vatIncluded ? Math.round(subtotal * 1.1) : subtotal;

  const selectedDirectionLabel: string = useMemo(() => {
    const found: DirectionItem | undefined = brandDirections.find(
      (item: DirectionItem) => item.id === selectedDirection
    );
    return found ? found.label : "";
  }, [selectedDirection]);

  function toggleConsultingPackage(id: string): void {
    setSelectedConsultingIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
    );
  }

  function toggleBrandingPackage(id: string): void {
    setSelectedBrandingIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
    );
  }

  function toggleOption(id: string): void {
    setSelectedOptions((prev: string[]) =>
      prev.includes(id) ? prev.filter((item: string) => item !== id) : [...prev, id]
    );
  }

  function handleTrademarkSearch(): void {
    const keyword: string = trademarkKeyword.trim();

    if (!keyword) {
      alert("검색할 상표명을 입력해 주세요.");
      return;
    }

    setSearchHistory((prev: string[]) =>
      [keyword, ...prev.filter((item: string) => item !== keyword)].slice(0, 5)
    );

    const query: string = encodeURIComponent(keyword);
    window.open(
      `https://www.kipris.or.kr/khome/search/search.do?queryText=${query}`,
      "_blank"
    );
  }

  function handleTopServiceSearch(): void {
    const q: string = topSearch.trim();

    if (!q) {
      alert("찾고 싶은 서비스를 입력해 주세요.");
      return;
    }

    const text: string = q.split(" ").join("").toLowerCase();

    if (text.includes("사회적기업") || text.includes("사회적")) {
      window.location.href = "/social-enterprise";
      return;
    }

    if (text.includes("상표") || text.includes("kipris") || text.includes("출원")) {
      document.getElementById("trademark")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (text.includes("브랜딩") || text.includes("로고")) {
      document.getElementById("branding")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (text.includes("비용") || text.includes("안내")) {
      document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  const guideMailtoHref: string = useMemo(() => {
    const subject: string = `[비용안내 요청] ${guideForm.organization || "기관명 미입력"}`;
    const body: string = [
      "안녕하세요. 비용안내 및 상담을 요청드립니다.",
      "",
      `기관명: ${guideForm.organization}`,
      `담당자명: ${guideForm.name}`,
      `연락처: ${guideForm.phone}`,
      `이메일: ${guideForm.email}`,
      "",
      "추가 요청사항:",
      "- 설립 유형 검토",
      "- 브랜딩 범위 검토",
      "- 상표등록 필요 여부 검토",
    ].join("\n");

    return `mailto:contact@example.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [guideForm]);

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <div className="relative overflow-hidden border-b border-[#C9A96B]/20 bg-[#041322] text-white">
        <div className="py-3">
          <div
            className="whitespace-nowrap text-xs tracking-[0.2em] text-[#E8D2A6] md:text-sm"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            <span className="inline-block pr-16">
              {promoItems.map((item: string, index: number) => (
                <span key={`first-${index}`} className="mx-8 inline-block">
                  ✦ {item}
                </span>
              ))}
            </span>
            <span className="inline-block pr-16">
              {promoItems.map((item: string, index: number) => (
                <span key={`second-${index}`} className="mx-8 inline-block">
                  ✦ {item}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <SiteHeader
        title="공익법인 종합컨설팅 플랫폼"
        subtitle="PREMIUM CONSULTING · BRANDING · TRADEMARK"
        homeLabel="공익법인설립"
        homeHref="/"
        navItems={[
          { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
          { label: "브랜딩서비스", href: "#branding" },
          { label: "상표등록", href: "#trademark" },
          { label: "문의하기", href: "#contact" },
        ]}
        showSearch
        searchValue={topSearch}
        onSearchChange={setTopSearch}
        onSearchEnter={handleTopServiceSearch}
      />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#07182D] via-[#0B2340] to-[#143A63] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,107,0.22),transparent_24%),radial-gradient(circle_at_left_bottom,rgba(255,255,255,0.08),transparent_20%)]" />
          <div className="relative mx-auto max-w-[1600px] px-4 py-20 md:px-10 md:py-36 lg:px-12 lg:py-40">
            <div className="inline-flex rounded-full border border-[#C9A96B]/30 bg-white/10 px-6 py-3 text-sm text-[#EAD9BC] backdrop-blur md:text-base">
              International Leaders Union Consulting & Branding
            </div>

            <div className="mt-10 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="max-w-6xl text-[40px] font-bold leading-[1.08] md:text-7xl xl:text-[88px]">
                  공익법인 설립과 브랜드
                  <br />
                  구축을 동시에 완성하는
                  <br />
                  프리미엄 컨설팅 플랫폼
                </h1>

                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 md:text-2xl">
                  사단법인·재단법인·공익법인 설립 검토부터 브랜딩, 상표등록 준비,
                  홈페이지 전략까지 한 번에 연결하는 운영형 페이지입니다.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
  <UiButton href="#establishment" variant="primary" className="w-full sm:w-auto">
    설립유형 보기
  </UiButton>
  <UiButton href="#branding" variant="ghost" className="w-full sm:w-auto">
    브랜딩 보기
  </UiButton>
  <UiButton href="#contact" variant="ghost" className="w-full sm:w-auto">
    문의하기
  </UiButton>
</div>
              </div>

              <div className="rounded-[40px] border border-white/10 bg-white/10 p-9 shadow-2xl backdrop-blur md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                  운영 배포 기준 반영
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    "프론트 관리자 로그인 제거",
                    "브라우저 localStorage 저장 제거",
                    "가짜 신청 완료 문구 제거",
                    "실제 문의는 메일/전화 연결 방식으로 전환",
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

        <section id="establishment" className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Establishment"
              title="공익법인 설립 유형 비교"
              desc="설립유형별 구조, 기간, 예산, 난이도를 한눈에 확인할 수 있습니다."
              center
            />

            <div className="mt-16 grid gap-8 lg:grid-cols-4">
              {establishmentTypes.map((item: EstablishmentType) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedType(item.id)}
                  className={`rounded-[36px] border p-8 text-left shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                    selectedType === item.id
                      ? "border-[#C9A96B] ring-2 ring-[#EFE1C7]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-base font-semibold text-[#C9A96B]">{item.legal}</div>
                  <h3 className="mt-3 text-2xl font-bold text-[#0B1F35] md:text-3xl">
                    {item.name}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-slate-600">{item.summary}</p>

                  <div className="mt-8 grid grid-cols-2 gap-4 text-sm md:text-base">
                    <div className="rounded-3xl bg-[#F8F6F1] p-4">
                      <div className="text-xs text-slate-500 md:text-sm">절차</div>
                      <div className="mt-1.5 font-semibold">{item.procedure}</div>
                    </div>
                    <div className="rounded-3xl bg-[#F8F6F1] p-4">
                      <div className="text-xs text-slate-500 md:text-sm">난이도</div>
                      <div className="mt-1.5 font-semibold">{item.difficulty}</div>
                    </div>
                    <div className="rounded-3xl bg-[#F8F6F1] p-4">
                      <div className="text-xs text-slate-500 md:text-sm">기간</div>
                      <div className="mt-1.5 font-semibold">{item.period}</div>
                    </div>
                    <div className="rounded-3xl bg-[#F8F6F1] p-4">
                      <div className="text-xs text-slate-500 md:text-sm">예산</div>
                      <div className="mt-1.5 font-semibold">{item.budget}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <UnifiedCard
                subtitle="Selected Type"
                title={selectedTypeData.name}
                description={selectedTypeData.summary}
              >
                <div className="rounded-[32px] bg-[#F8F6F1] p-6 md:p-7">
                  {selectedTypeData.details.map(([label, value]: [string, string]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[140px_1fr] gap-4 border-b border-slate-200 py-4 text-sm last:border-b-0 md:text-base"
                    >
                      <div className="font-semibold text-slate-500">{label}</div>
                      <div className="text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>
              </UnifiedCard>

              <div className="rounded-[40px] bg-gradient-to-br from-[#081A2F] to-[#12345A] p-8 text-white shadow-2xl md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                  Consulting Package
                </div>
                <h3 className="mt-4 text-3xl font-bold md:text-4xl">
                  설립유형별 컨설팅 상품 선택
                </h3>

                <div className="mt-8 space-y-5">
                  {consultingPackages.map((item: PackageItem) => {
                    const selected: boolean = selectedConsultingIds.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleConsultingPackage(item.id)}
                        className={`w-full rounded-[30px] border p-6 text-left transition duration-300 ${
                          selected
                            ? "border-white bg-white text-[#0B1F35]"
                            : "border-white/10 bg-white/5 text-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div
                              className={`text-sm font-semibold md:text-base ${
                                selected ? "text-[#C9A96B]" : "text-[#EAD9BC]"
                              }`}
                            >
                              {item.subtitle}
                            </div>
                            <div className="mt-2 text-xl font-bold md:text-2xl">
                              {item.name}
                            </div>
                            <div className="mt-3 text-sm leading-8 opacity-90 md:text-base">
                              {item.desc}
                            </div>
                          </div>
                          {item.popular ? (
                            <span className="rounded-full bg-[#EAD9BC] px-4 py-1.5 text-xs font-bold text-[#0B1F35] md:text-sm">
                              추천
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-5 text-2xl font-bold md:text-3xl">
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

        <section id="branding" className="py-20 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Branding Service"
              title="브랜딩 패키지 · 옵션 · 통합 견적"
              desc="선택형 패키지와 옵션을 바로 조합해 볼 수 있습니다."
              center
            />

            <div className="mt-16 grid gap-8 lg:grid-cols-4">
              {brandingPackages.map((item: PackageItem) => {
                const selected: boolean = selectedBrandingIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleBrandingPackage(item.id)}
                    className={`rounded-[36px] border bg-white p-8 text-left shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                      selected
                        ? "border-[#C9A96B] ring-2 ring-[#E8D8BA]"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-semibold text-[#C9A96B]">
                          {item.subtitle}
                        </div>
                        <h3 className="mt-3 text-2xl font-bold text-[#0B1F35] md:text-3xl">
                          {item.name}
                        </h3>
                      </div>
                      {item.popular ? (
                        <span className="rounded-full bg-[#EAD9BC] px-4 py-1.5 text-xs font-bold text-[#0B1F35] md:text-sm">
                          추천
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-5 text-base leading-8 text-slate-600">{item.desc}</p>

                    <div className="mt-8 text-3xl font-bold text-[#0B1F35]">
                      {formatKRW(item.price)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <UnifiedCard subtitle="Options" title="옵션 선택">
                <div className="grid gap-5 md:grid-cols-2">
                  {brandingOptions.map((item: OptionItem) => {
                    const checked: boolean = selectedOptions.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleOption(item.id)}
                        className={`rounded-[30px] border p-6 text-left transition duration-300 hover:scale-[1.02] ${
                          checked
                            ? "border-[#0B1F35] bg-[#0B1F35] text-white shadow-xl"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xl font-semibold">{item.label}</div>
                            <div
                              className={`mt-3 text-sm md:text-base ${
                                checked ? "text-slate-200" : "text-slate-500"
                              }`}
                            >
                              {formatKRW(item.price)}
                            </div>
                          </div>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg ${
                              checked
                                ? "border-white bg-white text-[#0B1F35]"
                                : "border-slate-300 bg-white text-slate-400"
                            }`}
                          >
                            {checked ? "✓" : "+"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-[28px] border border-slate-200 bg-[#FCFBF8] p-6">
                  <div className="text-base font-semibold text-slate-700">브랜드 방향 선택</div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {brandDirections.map((item: DirectionItem) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedDirection(item.id)}
                        className={`rounded-2xl border px-5 py-4 text-left text-sm font-semibold transition duration-300 hover:scale-[1.02] md:text-base ${
                          selectedDirection === item.id
                            ? "border-[#C9A96B] bg-[#FBF5EA] shadow-sm"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#F8F6F1] px-5 py-4">
                    <input
                      id="vat"
                      type="checkbox"
                      checked={vatIncluded}
                      onChange={(e) => setVatIncluded(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="vat" className="text-sm font-medium text-slate-700 md:text-base">
                      VAT 포함 금액으로 보기
                    </label>
                  </div>
                </div>
              </UnifiedCard>

              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-[40px] bg-gradient-to-br from-[#081A2F] to-[#12345A] p-8 text-white shadow-2xl md:p-10">
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                    Integrated Estimate
                  </div>
                  <h3 className="mt-4 text-3xl font-bold md:text-4xl">통합 견적 요약</h3>

                  <div className="mt-8 space-y-5 rounded-[32px] bg-white/5 p-6">
                    <div className="grid grid-cols-[130px_1fr] gap-4 text-sm md:text-base">
                      <span className="text-slate-300">설립 패키지</span>
                      <span className="text-slate-100">
                        {selectedConsultingList.length > 0
                          ? selectedConsultingList.map((item) => item.shortName).join(", ")
                          : "선택 없음"}
                      </span>
                    </div>

                    <div className="grid grid-cols-[130px_1fr] gap-4 text-sm md:text-base">
                      <span className="text-slate-300">브랜딩 패키지</span>
                      <span className="text-slate-100">
                        {selectedBrandingList.length > 0
                          ? selectedBrandingList.map((item) => item.shortName).join(", ")
                          : "선택 없음"}
                      </span>
                    </div>

                    <div className="grid grid-cols-[130px_1fr] gap-4 text-sm md:text-base">
                      <span className="text-slate-300">옵션</span>
                      <span className="text-slate-100">
                        {selectedOptions.length > 0
                          ? brandingOptions
                              .filter((item: OptionItem) =>
                                selectedOptions.includes(item.id)
                              )
                              .map((item: OptionItem) => item.label)
                              .join(", ")
                          : "선택 없음"}
                      </span>
                    </div>

                    <div className="grid grid-cols-[130px_1fr] gap-4 text-sm md:text-base">
                      <span className="text-slate-300">브랜드 방향</span>
                      <span className="text-slate-100">{selectedDirectionLabel}</span>
                    </div>

                    <div className="border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between text-sm text-slate-300 md:text-base">
                        <span>소계</span>
                        <span>{formatKRW(subtotal)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-slate-300 md:text-base">
                        <span>{vatIncluded ? "VAT 포함" : "VAT 별도"}</span>
                        <span>{vatIncluded ? "적용" : "미적용"}</span>
                      </div>
                      <div className="mt-5 flex items-center justify-between text-2xl font-bold text-white md:text-3xl">
                        <span>예상 금액</span>
                        <span>{formatKRW(total)}</span>
                      </div>
                    </div>

                    <div className="rounded-3xl bg-[#FBF5EA] px-5 py-5 text-sm leading-8 text-[#0B1F35] md:text-base">
                      이 견적은 화면상 참고용입니다. 실제 계약 견적은 상담 후 범위와 일정에
                      따라 조정됩니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="trademark" className="bg-white py-20 md:py-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="Trademark"
              title="상표등록 사전 검토"
              desc="운영형 버전에서는 검색 기능은 유지하되, 실제 접수 기능으로 오해되지 않도록 명확히 구분했습니다."
              center
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[40px] bg-gradient-to-br from-[#081A2F] to-[#12345A] p-8 text-white shadow-2xl md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996] md:text-base">
                  Search Trademark
                </div>
                <h3 className="mt-4 text-3xl font-bold md:text-4xl">KIPRIS 검색 연결</h3>

                <div className="mt-8 space-y-5">
                  <input
                    value={trademarkKeyword}
                    onChange={(e) => setTrademarkKeyword(e.target.value)}
                    placeholder="상표명 또는 기관명을 입력하세요"
                    className="w-full rounded-[24px] border border-white/10 bg-white/10 px-5 py-5 text-base text-white outline-none placeholder:text-slate-300 md:text-lg"
                  />
                  <input
                    value={trademarkClass}
                    onChange={(e) => setTrademarkClass(e.target.value)}
                    placeholder="지정상품 분류(선택)"
                    className="w-full rounded-[24px] border border-white/10 bg-white/10 px-5 py-5 text-base text-white outline-none placeholder:text-slate-300 md:text-lg"
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleTrademarkSearch}
                    className="rounded-3xl bg-[#C9A96B] px-8 py-4 text-base font-bold text-[#0B1F35] transition duration-300 hover:scale-105 hover:shadow-2xl md:text-lg"
                  >
                    KIPRIS 검색하기
                  </button>
                  <a
                    href="#contact"
                    className="rounded-3xl border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition duration-300 hover:scale-105 md:text-lg"
                  >
                    별도 상담 요청
                  </a>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                    <div className="text-base font-semibold text-[#E5C996]">입력 예시</div>
                    <div className="mt-3 text-sm leading-8 text-slate-200 md:text-base">
                      상표명: {trademarkKeyword || "입력 전"}
                      <br />
                      분류: {trademarkClass || "입력 전"}
                    </div>
                  </div>

                  <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                    <div className="text-base font-semibold text-[#E5C996]">최근 검색</div>
                    <div className="mt-3 space-y-3 text-sm text-slate-200 md:text-base">
                      {searchHistory.length === 0 ? (
                        <div>아직 검색 기록이 없습니다.</div>
                      ) : (
                        searchHistory.map((item: string) => (
                          <div key={item} className="rounded-2xl bg-white/5 px-4 py-3">
                            {item}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <UnifiedCard subtitle="Process" title="상표등록 진행 흐름">
                <div className="space-y-5">
                  {trademarkSteps.map((item: StepItem) => (
                    <div
                      key={item.step}
                      className="rounded-[28px] border border-slate-200 bg-[#FCFBF8] px-5 py-5"
                    >
                      <div className="text-sm font-semibold text-[#C9A96B] md:text-base">
                        STEP {item.step}
                      </div>
                      <div className="mt-2 text-xl font-bold text-[#0B1F35] md:text-2xl">
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
          </div>
        </section>

        <section id="guide" className="py-28 md:py-32">
          <div className="mx-auto max-w-[1100px] px-6 md:px-8">
            <SectionTitle
              badge="Guide Request"
              title="비용안내 요청"
              desc="이전처럼 브라우저에만 저장하지 않고, 실제 문의는 메일앱으로 연결되도록 바꾸었습니다."
              center
            />

            <UnifiedCard className="mt-16">
              <div className="grid gap-5 md:grid-cols-2">
  <FormInput
    value={guideForm.organization}
    onChange={(value: string) =>
      setGuideForm((prev: GuideFormState) => ({
        ...prev,
        organization: value,
      }))
    }
    placeholder="기관명"
  />
  <FormInput
    value={guideForm.name}
    onChange={(value: string) =>
      setGuideForm((prev: GuideFormState) => ({
        ...prev,
        name: value,
      }))
    }
    placeholder="담당자명"
  />
  <FormInput
    value={guideForm.phone}
    onChange={(value: string) =>
      setGuideForm((prev: GuideFormState) => ({
        ...prev,
        phone: value,
      }))
    }
    placeholder="연락처"
  />
  <FormInput
    value={guideForm.email}
    onChange={(value: string) =>
      setGuideForm((prev: GuideFormState) => ({
        ...prev,
        email: value,
      }))
    }
    placeholder="이메일"
    type="email"
  />
</div>

              <div className="mt-6 rounded-[24px] bg-[#FBF5EA] px-5 py-5 text-sm leading-8 text-slate-700 md:text-base">
                이 페이지는 입력값을 브라우저에 저장하지 않습니다. 아래 버튼을 누르면
                메일앱이 열리며, 실제 발송은 사용자가 직접 확인 후 진행합니다.
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
  <UiButton href={guideMailtoHref} variant="dark" className="w-full sm:w-auto">
    비용안내 요청 메일 열기
  </UiButton>
  <UiButton href="tel:010-0000-0000" variant="secondary" className="w-full sm:w-auto">
    전화 문의
  </UiButton>
</div>
            </UnifiedCard>
          </div>
        </section>

        <section id="contact" className="bg-white py-28 md:py-32">
          <div className="mx-auto max-w-[1200px] px-6 md:px-8">
            <SectionTitle
              badge="Contact"
              title="운영형 문의 안내"
              desc="실제 접수 백엔드가 붙기 전까지는 가장 안전한 운영형 방식으로 문의 채널을 명확하게 안내합니다."
              center
            />

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <UnifiedCard>
                <div className="text-base font-semibold text-[#C9A96B]">이메일</div>
                <div className="mt-4 text-2xl font-bold text-[#0B1F35]">
                  contact@example.com
                </div>
                <UiButton href="mailto:contact@example.com" variant="dark" className="mt-6 w-full sm:w-auto">
  메일 보내기
</UiButton>
              </UnifiedCard>

              <UnifiedCard>
                <div className="text-base font-semibold text-[#C9A96B]">전화</div>
                <div className="mt-4 text-2xl font-bold text-[#0B1F35]">
                  010-0000-0000
                </div>
                <UiButton href="tel:010-0000-0000" variant="dark" className="mt-6 w-full sm:w-auto">
  전화 연결
</UiButton>
              </UnifiedCard>

              <UnifiedCard>
                <div className="text-base font-semibold text-[#C9A96B]">상담 범위</div>
                <div className="mt-4 text-base leading-8 text-slate-600">
                  공익법인 설립, 브랜딩, 상표등록, 사회적기업 설립, 운영구조 검토
                </div>
                <UiButton href="/social-enterprise" variant="dark" className="mt-6 w-full sm:w-auto">
  사회적기업 페이지
</UiButton>
              </UnifiedCard>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        leftText="© PARK KI HYUN, 2026.1.17"
        rightItems={[
          "공익법인 종합컨설팅",
          "브랜딩 · 상표등록 · 사회적기업 설립",
        ]}
      />
    </div>
  );
}