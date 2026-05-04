"use client";

import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";


const CHECKLIST_STORAGE_KEY = "npolap_public_interest_checklist_result";

const selfCheckItems = [
  "설립 목적이 한 문장으로 정리되어 있다",
  "공익사업의 수혜 대상이 명확하다",
  "설립자가 출연할 재산 또는 초기 운영재원이 있다",
  "최소 1년 이상의 사업계획이 있다",
  "사업별 예산을 대략 산정할 수 있다",
  "임원 후보자가 5명 이상 준비되어 있다",
  "회계와 세무를 관리할 사람이 있다",
  "사무소 주소지를 확보할 수 있다",
  "설립 후 홈페이지 또는 공시 채널을 만들 계획이 있다",
  "특정 개인이나 가족만을 위한 조직이 아니다",
  "정관에 담을 핵심 운영 원칙이 있다",
  "주무관청과 사전협의할 준비가 되어 있다",
];

type ReadinessAnalysis = {
  level: string;
  grade: string;
  toneClass: string;
  barClass: string;
  title: string;
  description: string;
  nextActions: string[];
  percentage: number;
};

function getReadinessAnalysis(
  checkedCount: number,
  totalCount: number
): ReadinessAnalysis {
  const percentage =
    totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (checkedCount <= 3) {
    return {
      level: "준비 초기 단계",
      grade: "BASIC",
      toneClass: "border-rose-200 bg-rose-50 text-rose-800",
      barClass: "bg-rose-500",
      title: "아직 설립 신청보다는 방향 정리가 먼저 필요합니다.",
      description:
        "현재 단계에서는 공익법인 설립허가 신청서를 바로 준비하기보다, 설립 목적·수혜 대상·출연재산·임원 구성의 기본 방향을 먼저 정리하는 것이 안전합니다.",
      nextActions: [
        "설립 목적을 한 문장으로 정리하세요.",
        "공익사업의 수혜 대상과 사업 분야를 구체화하세요.",
        "사단법인, 재단법인, 공익법인 중 어떤 형태가 적합한지 1차 진단이 필요합니다.",
        "주무관청 방문 전 설립 취지서 초안을 먼저 준비하는 것이 좋습니다.",
      ],
      percentage,
    };
  }

  if (checkedCount <= 6) {
    return {
      level: "기초 준비 단계",
      grade: "READY-1",
      toneClass: "border-amber-200 bg-amber-50 text-amber-800",
      barClass: "bg-amber-500",
      title: "설립 방향은 보이지만 핵심 서류 설계가 부족한 단계입니다.",
      description:
        "기본 구상은 있으나 주무관청이 요구하는 수준의 정관, 사업계획서, 수지예산서, 임원 구성 논리는 아직 보완이 필요합니다.",
      nextActions: [
        "목적사업과 사업계획서를 연결하세요.",
        "초기 재원과 출연재산의 증빙 가능성을 확인하세요.",
        "임원 후보자의 전문성·독립성·결격사유 여부를 점검하세요.",
        "주무관청 사전협의 질문지를 준비하세요.",
      ],
      percentage,
    };
  }

  if (checkedCount <= 9) {
    return {
      level: "실무 준비 단계",
      grade: "READY-2",
      toneClass: "border-blue-200 bg-blue-50 text-blue-800",
      barClass: "bg-blue-500",
      title: "주무관청 사전협의를 준비할 수 있는 단계입니다.",
      description:
        "공익법인 설립을 위한 기본 조건은 상당 부분 갖추어져 있습니다. 이제 정관, 재산목록, 출연확인서, 사업계획서, 수지예산서를 하나의 논리로 정리해야 합니다.",
      nextActions: [
        "정관 초안을 작성하고 공익성·사익배제 조항을 점검하세요.",
        "사업계획서와 수지예산서의 항목명을 일치시키세요.",
        "재산목록과 잔고증명서, 출연확인서의 내용이 서로 맞는지 확인하세요.",
        "주무관청 담당자에게 사전검토 가능 여부를 문의하세요.",
      ],
      percentage,
    };
  }

  return {
    level: "설립 신청 준비 단계",
    grade: "READY-3",
    toneClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
    barClass: "bg-emerald-500",
    title: "설립허가 신청 전 최종 점검 단계입니다.",
    description:
      "공익법인 설립을 위한 기본 구조가 상당히 준비되어 있습니다. 이제 주무관청 소관 적합성, 정관 문구, 제출서류 간 날짜·금액·안건 일치 여부를 최종 점검하면 됩니다.",
    nextActions: [
      "주무관청 사전협의를 진행하세요.",
      "발기인 총회 의사록과 정관의 안건·날짜·임원 명단을 대조하세요.",
      "재산목록, 출연확인서, 잔고증명서의 금액을 일치시키세요.",
      "허가 후 등기, 고유번호증, 법인계좌, 회계관리 체계까지 준비하세요.",
    ],
    percentage,
  };
}

export default function PublicInterestChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const totalSelfCheckCount = selfCheckItems.length;
  const checkedCount = checkedItems.length;

  const analysis = useMemo(
    () => getReadinessAnalysis(checkedCount, totalSelfCheckCount),
    [checkedCount, totalSelfCheckCount]
  );

  function toggleSelfCheckItem(item: string): void {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((current) => current !== item)
        : [...prev, item]
    );
  }

  function resetSelfCheck(): void {
    setCheckedItems([]);
  }

  function buildAnalysisMessage(): string {
    return [
      "[공익법인 설립 자가진단 결과]",
      "",
      `준비도 등급: ${analysis.grade}`,
      `준비 단계: ${analysis.level}`,
      `체크 현황: ${checkedCount}/${totalSelfCheckCount}`,
      `준비도: ${analysis.percentage}%`,
      "",
      "분석 요약:",
      analysis.title,
      analysis.description,
      "",
      "체크한 항목:",
      checkedItems.length > 0
        ? checkedItems.map((item) => `- ${item}`).join("\n")
        : "- 아직 체크한 항목이 없습니다.",
      "",
      "다음 조치:",
      analysis.nextActions.map((item) => `- ${item}`).join("\n"),
      "",
      "상담 요청:",
      "위 자가진단 결과를 기준으로 공익법인 설립 가능성, 주무관청 사전협의 방향, 정관 및 제출서류 준비 범위를 상담받고 싶습니다.",
    ].join("\n");
  }

  function handleConsultingWithAnalysis(): void {
    const message = buildAnalysisMessage();

    try {
      window.sessionStorage.setItem(CHECKLIST_STORAGE_KEY, message);
    } catch {
      // sessionStorage 사용이 제한된 환경에서도 페이지 이동은 정상 처리합니다.
    }

    window.location.href = "/public-interest-foundation#contact";
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/public-interest-foundation"
        inquiryHref="/public-interest-foundation#contact"
        menuItems={[
          { label: "공익법인설립", href: "/public-interest-foundation", isLink: true },
          { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
          { label: "브랜딩서비스", href: "/branding", isLink: true },
          { label: "헤리티지오피스", href: "/heritage-office", isLink: true },
          { label: "에코피온", href: "/consultant-profile", isLink: true },
        ]}
      />

      <main>
        <section className="relative overflow-hidden bg-[#081A2F] px-6 pb-24 pt-40 text-white md:px-10 md:pb-32 md:pt-48 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,201,150,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative mx-auto max-w-[1300px]">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
              Public Interest Foundation Checklist
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.15] md:text-6xl xl:text-[76px]">
              공익법인 설립 체크리스트
            </h1>

            <p className="mt-8 max-w-4xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
              선한 뜻은 선언으로 끝나지 않습니다.
              <br />
              공익법인은 철학이 제도로 완성될 때 비로소 시작됩니다.
            </p>

            <p className="mt-6 max-w-4xl text-sm leading-8 text-slate-300 md:text-base md:leading-8">
              법인별 제출서류 체크리스트와 공익법인 설립 전 자가진단을 통해
              현재 준비 상태를 점검하고, 상담 신청 시 분석 결과를 문의내용에
              자동으로 연결할 수 있습니다.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#public-benefit"
                className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-6 py-3 text-sm font-bold text-[#081A2F] shadow-[0_18px_45px_rgba(229,201,150,0.24)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_24px_60px_rgba(229,201,150,0.34)] md:px-7 md:py-4 md:text-base"
              >
                법인별 체크리스트 보기
              </a>

              <a
                href="#self-check"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/12 md:px-7 md:py-4 md:text-base"
              >
                자가진단 시작하기
              </a>
            </div>
          </div>
        </section>

        

        <section
          id="self-check"
          className="px-6 py-20 md:px-10 md:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-[1300px]">
            <div className="mx-auto max-w-4xl text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                Self Check
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#0B1F35] md:text-5xl">
                공익법인 설립 전 자가진단
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
                아래 항목을 직접 체크하면 현재 준비도를 자동으로 분석합니다.
                결과는 설립허가 가능성을 확정하는 법률 판단이 아니라,
                주무관청 사전협의 전 준비 수준을 점검하기 위한 실무 진단입니다.
              </p>
            </div>

            <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                      Check Items
                    </div>
                    <h3 className="mt-3 text-2xl font-bold text-[#0B1F35] md:text-3xl">
                      준비 항목 체크
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={resetSelfCheck}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50"
                  >
                    체크 초기화
                  </button>
                </div>

                <div className="mt-8 grid gap-4">
                  {selfCheckItems.map((item, index) => {
                    const checked = checkedItems.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSelfCheckItem(item)}
                        className={`flex gap-4 rounded-[24px] border px-5 py-4 text-left shadow-sm transition-all duration-300 ${
                          checked
                            ? "border-[#C9A96B] bg-[#FBF5EA] shadow-[0_18px_40px_rgba(201,169,107,0.12)]"
                            : "border-slate-200 bg-[#FCFBF8] hover:-translate-y-[1px] hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition-all duration-300 ${
                            checked
                              ? "border-[#C9A96B] bg-[#C9A96B] text-white"
                              : "border-slate-300 bg-white text-slate-400"
                          }`}
                        >
                          {checked ? "✓" : index + 1}
                        </span>

                        <span
                          className={`text-sm leading-7 md:text-base ${
                            checked
                              ? "font-semibold text-[#0B1F35]"
                              : "text-slate-700"
                          }`}
                        >
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sticky top-28 h-fit rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] md:p-8">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A96B]">
                  Auto Analysis
                </div>

                <h3 className="mt-3 text-2xl font-bold text-[#0B1F35] md:text-3xl">
                  자가 분석 결과
                </h3>

                <div className="mt-6 rounded-[28px] bg-[#081A2F] p-6 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-300">체크 현황</div>
                      <div className="mt-2 text-4xl font-bold">
                        {checkedCount}
                        <span className="text-xl font-semibold text-slate-300">
                          /{totalSelfCheckCount}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                      <div className="text-xs uppercase tracking-[0.18em] text-[#E5C996]">
                        Grade
                      </div>
                      <div className="mt-1 text-xl font-bold">
                        {analysis.grade}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${analysis.barClass}`}
                      style={{ width: `${analysis.percentage}%` }}
                    />
                  </div>

                  <div className="mt-3 text-sm text-slate-300">
                    준비도 {analysis.percentage}%
                  </div>
                </div>

                <div
                  className={`mt-5 rounded-[24px] border p-5 ${analysis.toneClass}`}
                >
                  <div className="text-sm font-bold uppercase tracking-[0.18em]">
                    {analysis.level}
                  </div>
                  <div className="mt-3 text-xl font-bold leading-8">
                    {analysis.title}
                  </div>
                  <p className="mt-3 text-sm leading-7">
                    {analysis.description}
                  </p>
                </div>

                <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#FCFBF8] p-5">
                  <div className="text-base font-bold text-[#0B1F35]">
                    다음 조치 가이드
                  </div>

                  <div className="mt-4 space-y-3">
                    {analysis.nextActions.map((action) => (
                      <div
                        key={action}
                        className="flex gap-3 rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-700"
                      >
                        <span className="font-bold text-[#C9A96B]">→</span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <button
                    type="button"
                    onClick={handleConsultingWithAnalysis}
                    className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-6 py-3 text-sm font-bold text-[#081A2F] shadow-[0_12px_30px_rgba(229,201,150,0.20)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_20px_45px_rgba(229,201,150,0.30)]"
                  >
                    분석 결과로 상담 신청하기
                  </button>

                  <a
                    href="/public-interest-foundation"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#081A2F] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50"
                  >
                    공익법인 설립 페이지로 돌아가기
                  </a>
                </div>
              </div>
            </div>
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
