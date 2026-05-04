import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LegalEntityAnchorChecklistSections from "@/components/LegalEntityAnchorChecklistSections";

export default function LegalEntityChecklistPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/public-interest-foundation"
        inquiryHref="#legal-entity-checklist-inquiry"
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
        <section className="relative overflow-hidden bg-[#081A2F] px-6 pb-20 pt-40 text-white md:px-10 md:pb-28 md:pt-48 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,201,150,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

          <div className="relative mx-auto max-w-[1300px]">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
              Legal Entity Documents Checklist
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.15] md:text-6xl xl:text-[76px]">
              법인별 제출서류 체크리스트
            </h1>

            <p className="mt-8 max-w-4xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
              공익법인, 재단법인, 의료법인, 학교법인, 사단법인, 신용협동조합,
              사회적기업, 영리법인까지 설립 유형별 제출서류를 한눈에
              점검합니다.
            </p>

            <p className="mt-6 max-w-4xl text-sm leading-8 text-slate-300 md:text-base md:leading-8">
              각 항목을 체크하면 전체 준비도와 법인별 준비도를 확인할 수
              있으며, 체크 결과는 기존 공익법인설립 상담 폼의 문의내용에
              자동으로 전달됩니다.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#legal-entity-checklist"
                className="inline-flex items-center justify-center rounded-full bg-[#E5C996] px-6 py-3 text-sm font-bold text-[#081A2F] shadow-[0_18px_45px_rgba(229,201,150,0.24)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_24px_60px_rgba(229,201,150,0.34)] md:px-7 md:py-4 md:text-base"
              >
                제출서류 체크 시작하기
              </a>

              <a
                href="/public-interest-foundation"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/12 md:px-7 md:py-4 md:text-base"
              >
                공익법인설립 페이지로 돌아가기
              </a>

              <a
                href="#legal-entity-checklist-inquiry"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/12 md:px-7 md:py-4 md:text-base"
              >
                상담 신청하기
              </a>
            </div>
          </div>
        </section>

        <LegalEntityAnchorChecklistSections />
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
