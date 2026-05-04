export default function FoundationChecklistHeroButtons() {
  return (
    <div className="mt-10 w-full max-w-6xl">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5C996]">
            Establishment Documents
          </div>

          <h2 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">
            법인유형별 체크리스트
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
    </div>
  );
}
