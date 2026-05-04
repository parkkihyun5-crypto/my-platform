const checklistButtons = [
  {
    title: "공익법인",
    desc: "설립허가 · 정관 · 출연재산 · 공익성 검토",
    href: "/public-interest-foundation/legal-entity-checklist#public-benefit",
  },
  {
    title: "재단법인",
    desc: "출연재산 · 기본재산 · 이사회 구조",
    href: "/public-interest-foundation/legal-entity-checklist#foundation",
  },
  {
    title: "의료재단·의료법인",
    desc: "의료기관 운영계획 · 시설 · 인력 · 재산",
    href: "/public-interest-foundation/legal-entity-checklist#medical",
  },
  {
    title: "학교법인",
    desc: "교지 · 교사 · 수익용 기본재산 · 교육계획",
    href: "/public-interest-foundation/legal-entity-checklist#school",
  },
  {
    title: "문화재단·박물관재단",
    desc: "소장품 · 전시공간 · 아카이브 · 문화사업",
    href: "/public-interest-foundation/legal-entity-checklist#culture",
  },
  {
    title: "사단법인",
    desc: "회원명부 · 창립총회 · 정관 · 사업계획",
    href: "/public-interest-foundation/legal-entity-checklist#association",
  },
  {
    title: "신용협동조합",
    desc: "공동유대 · 발기인 · 출자금 · 인가 준비",
    href: "/public-interest-foundation/legal-entity-checklist#credit-union",
  },
  {
    title: "사회적기업",
    desc: "법인설립 · 인증요건 · 유급근로자 · 재투자",
    href: "/public-interest-foundation/legal-entity-checklist#social-enterprise",
  },
  {
    title: "영리법인",
    desc: "정관 · 자본금 · 등기 · 사업자등록",
    href: "/public-interest-foundation/legal-entity-checklist#corporation",
  },
];

export default function FoundationChecklistHeroButtons() {
  return (
    <div className="mt-10 w-full max-w-6xl">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5C996]">
            Establishment Documents
          </div>

          <h2 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
            법인별 제출서류 체크리스트
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-200">
            법인 유형별 제출서류를 별도 페이지에서 확인하고, 체크 결과를
            상담 문의내용에 함께 전달할 수 있습니다.
          </p>
        </div>

        <a
          href="/public-interest-foundation/legal-entity-checklist"
          className="inline-flex w-fit items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] hover:border-[#E5C996]/50 hover:bg-white/15 hover:text-[#FFF3D7]"
        >
          전체 제출서류 보기 →
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {checklistButtons.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group rounded-[22px] border border-white/15 bg-white/10 p-4 text-left text-white shadow-[0_12px_35px_rgba(2,6,23,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-[2px] hover:border-[#E5C996]/45 hover:bg-white/15 hover:shadow-[0_20px_55px_rgba(2,6,23,0.24)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-white md:text-lg">
                  {item.title}
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-200 md:text-sm">
                  {item.desc}
                </p>
              </div>

              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-bold text-[#E5C996] transition-all duration-300 group-hover:border-[#E5C996]/50 group-hover:bg-[#E5C996] group-hover:text-[#081A2F]">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}