import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const magazineHighlights = [
  {
    number: "01",
    eyebrow: "VENTURE & STARTUP",
    title: "벤처창업 1세대 실무형 전략가",
    desc: "초기 벤처 생태계가 형성되던 시기, 대학 및 중소기업청 소관 연구기관에서 창업지원실장과 전문위원으로 활동하며 창업 강연, 창업아카데미 운영, 창업 관련 집필 활동을 수행했습니다.",
  },
  {
    number: "02",
    eyebrow: "FINANCE & CAPITAL",
    title: "창업 · 금융 · 투자 구조 설계",
    desc: "영리·비영리 법인을 아우르는 창업 전문 컨설턴트로서 다양한 조직의 설립과 성장 전략을 지원했으며, 창업 컨설팅, IPO·M&A·투자 구조 설계 등에 참여해 기업 성장과 자본시장의 실무 경험을 축적했습니다.",
  },
  {
    number: "03",
    eyebrow: "DIGITAL TRANSFORMATION",
    title: "디지털 경제 전환의 선구적 행보",
    desc: "IMF 외환위기 이후 디지털저널과 하이코리아플러스를 설립해 대한민국 경제 활성화를 위한 디지털 산업과 금융 플랫폼 사업을 추진했습니다. 전자결제 플랫폼 사업과 정보중개 전문인력 양성 사업을 통해 디지털 경제 전환을 앞서 준비했습니다.",
  },
  {
    number: "04",
    eyebrow: "GLOBAL COOPERATION",
    title: "국제협력과 공공외교의 확장",
    desc: "2001년 대한민국의 IMF 차입금 조기 상환 이후 국가 재도약과 국제 위상 강화를 위한 민간 외교의 필요성에 주목해, 국제지도자연합 설립본부장으로 참여했습니다.",
  },
];

const strategicFields = [
  {
    number: "01",
    title: "구조 설계",
    desc: "사람, 자본, 기관, 브랜드를 하나의 실행 가능한 구조로 연결합니다.",
  },
  {
    number: "02",
    title: "공공외교",
    desc: "국내 현안과 세계적 흐름을 연결하는 민관 협력형 플랫폼을 설계합니다.",
  },
  {
    number: "03",
    title: "지속가능성",
    desc: "환경, 복지, 경제 활성화를 결합한 UN SDGs형 사회혁신 모델을 구축합니다.",
  },
];

const expertiseItems = [
  "공익법인 · 비영리법인 설립 구조 설계",
  "창업 · 투자 · IPO · M&A 전략 자문",
  "국제협력 · 공공외교 프로젝트 기획",
  "문화유산 보존 및 글로벌 네트워크 구축",
  "친환경 에너지 · 지속가능발전 프로젝트",
  "AI시대 공공 리더십과 칼럼 콘텐츠 기획",
];

const columnThemes = [
  "국가 경쟁력",
  "국제 질서",
  "기술 패권",
  "AI 혁명",
  "세대 통합",
  "공공 리더십",
  "지속가능 경제 생태계",
];

const timelineItems = [
  {
    year: "1990s",
    title: "벤처창업 현장과 창업지원 활동",
    desc: "창업지원실장, 전문위원, 창업 강연, 창업아카데미 운영, 창업 관련 집필 활동을 수행했습니다.",
  },
  {
    year: "IMF 이후",
    title: "디지털 산업과 금융 플랫폼 사업 추진",
    desc: "디지털저널과 하이코리아플러스를 설립해 정보·미디어 산업과 전자결제 플랫폼 사업을 추진했습니다.",
  },
  {
    year: "2001 이후",
    title: "국제지도자연합 설립과 민간외교 확장",
    desc: "국가 재도약과 국제 위상 강화를 위한 민간 외교의 필요성에 주목하고 국제협력 네트워크를 구축했습니다.",
  },
  {
    year: "현재",
    title: "문화유산 · 에너지 · 투자 · SDGs 프로젝트",
    desc: "문화유산 보존, 친환경 에너지, 국제 투자 협력, 글로벌 네트워크 구축 등 미래 전략 산업과 공공가치가 결합된 프로젝트에 주력하고 있습니다.",
  },
];

export default function ConsultantProfilePage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
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
        ]}
      />

      <main>
        <section className="relative min-h-screen overflow-hidden bg-[#081A2F] pt-24 text-white md:pt-28">
  <div className="absolute inset-0 bg-[#081A2F]" />
  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f6f3ee] to-transparent" />

  <div className="relative z-10 mx-auto grid min-h-[calc(100vh-112px)] max-w-[1600px] items-center gap-14 px-6 py-16 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
    <div className="relative">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-px w-14 bg-[#E5C996]" />
        <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#E5C996] md:text-sm">
          Representative Consultant
        </div>
      </div>

      <h1 className="max-w-5xl text-[42px] font-bold leading-[1.08] tracking-[-0.055em] md:text-7xl xl:text-[92px]">
        구조를 설계하는
        <br />
        실천형 전략가
      </h1>

      <div className="mt-8 max-w-3xl border-l border-[#E5C996]/45 pl-6">
        <p className="text-lg leading-9 text-slate-200 md:text-[22px] md:leading-10">
          벤처 창업의 현장을 경험하고, 디지털 혁신과 세계의 흐름을 읽으며,
          AI시대의 지속가능한 국제사회의 미래를 고민하는 실천형 칼럼니스트.
        </p>
      </div>

      <div className="mt-9 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
        창업·금융·투자 분야의 현장 경험을 바탕으로 기업 성장 구조와 시장의
        작동 원리를 체득하고, 이후 국제협력과 공공 영역으로 활동 무대를 넓혀
        지속가능한 국제사회의 발전 모델을 모색해 왔습니다.
      </div>

      <div className="mt-11 flex flex-col gap-3 sm:flex-row">
        <a
          href="#profile"
          className="group inline-flex items-center justify-center rounded-full bg-[#E5C996] px-7 py-4 text-sm font-bold text-[#081A2F] shadow-[0_18px_45px_rgba(229,201,150,0.18)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_24px_60px_rgba(229,201,150,0.28)] md:text-base"
        >
          대표 프로필 보기
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>

        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#E5C996]/35 hover:bg-white/[0.08] hover:text-[#F3DFB6] md:text-base"
        >
          컨설팅 문의
        </a>
      </div>
    </div>

    <div className="relative mx-auto w-full max-w-[690px] lg:mx-0">
      <div className="relative overflow-hidden rounded-[42px] border border-white/12 bg-white/[0.04] p-3 shadow-[0_36px_90px_rgba(0,0,0,0.36)]">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0B1F35]">
          <img
            src="/images/consultant-profile.png"
            alt="대표 컨설턴트 프로필"
            className="h-[560px] w-full object-cover object-top md:h-[720px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/70 via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <div className="rounded-[26px] border border-white/12 bg-[#050B14]/42 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.20)] backdrop-blur-md md:p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                PARK KI HYUN
              </div>

              <div className="mt-2 text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                박기현
              </div>

              <div className="mt-2 text-sm leading-7 text-slate-300 md:text-base">
                국제지도자연합(International Leaders Union)
                <br />
                사무총장 겸 기획실장
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        <section id="profile" className="relative bg-[#f6f3ee] py-24 md:py-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96B]/35 to-transparent" />

          <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr]">
              <aside className="lg:pt-4">
                <div className="sticky top-28">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-[#C9A96B]" />
                    <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                      Profile Essay
                    </div>
                  </div>

                  <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                    시장과 국가를 연결하고,
                    <br />
                    혁신과 공공가치를 결합해
                    <br />
                    미래를 설계합니다.
                  </h2>

                  <div className="mt-8 overflow-hidden rounded-[32px] border border-[#C9A96B]/20 bg-[#FBF5EA] shadow-[0_18px_50px_rgba(201,169,107,0.10)]">
                    <div className="border-b border-[#C9A96B]/20 px-6 py-5">
                      <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A96B]">
                        Core Identity
                      </div>
                    </div>
                    <div className="p-6 text-sm leading-8 text-slate-700 md:text-base">
                      창업, 금융, 투자, 국제협력, 공공외교, 지속가능발전을
                      하나의 실행 구조로 통합하는 전략형 컨설턴트입니다.
                    </div>
                  </div>
                </div>
              </aside>

              <article className="relative">
                <div className="absolute -left-5 top-0 hidden h-full w-px bg-gradient-to-b from-[#C9A96B]/0 via-[#C9A96B]/35 to-[#C9A96B]/0 lg:block" />

                <div className="rounded-[42px] border border-slate-200/90 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] md:p-10">
                  <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="overflow-hidden rounded-[34px] bg-[#0B1F35]">
                      <img
                        src="/images/consultant-profile.png"
                        alt="대표 컨설턴트 프로필"
                        className="h-full min-h-[520px] w-full object-cover object-top"
                      />
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                        Representative Consultant
                      </div>

                      <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#0B1F35] md:text-4xl">
                        박기현
                      </h3>

                      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg md:leading-9">
                        국제지도자연합(International Leaders Union) 사무총장 겸
                        기획실장. 대한민국 벤처창업 붐을 이끌었던 1세대 실무형
                        전략가로, 창업·금융·투자 분야의 현장 경험을 바탕으로
                        기업 성장 구조와 시장의 작동 원리를 체득했습니다.
                      </p>

                      <div className="my-8 h-px bg-gradient-to-r from-[#C9A96B]/45 via-slate-200 to-transparent" />

                      <p className="text-base leading-8 text-slate-600 md:text-lg md:leading-9">
                        이후 국제협력과 공공 영역으로 활동 무대를 넓혀
                        국제사회의 지속가능한 발전 모델을 모색해 온 인물입니다.
                        실물경제와 공공외교를 함께 이해하는 드문 실무형 리더라는
                        평가를 받습니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {strategicFields.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A96B]/35 hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]"
                    >
                      <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A96B]">
                        {item.number}
                      </div>
                      <h4 className="mt-4 text-xl font-bold text-[#0B1F35]">
                        {item.title}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-24 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,107,0.10),transparent_30%)]" />

          <div className="relative mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[#C9A96B]" />
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                    Magazine Layout
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                  현장에서 축적한
                  <br />
                  실행형 이력
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                  창업 현장, 금융 플랫폼, 투자 구조, 국제협력, 공공외교를
                  관통하는 복합적 경험을 바탕으로 지속 가능한 구조를 설계합니다.
                </p>
              </div>

              <div className="space-y-6">
                {magazineHighlights.map((item, index) => (
                  <article
                    key={item.title}
                    className={`group grid gap-6 rounded-[38px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-[0_12px_36px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A96B]/35 hover:bg-white hover:shadow-[0_28px_70px_rgba(15,23,42,0.10)] md:p-8 ${
                      index % 2 === 0
                        ? "lg:grid-cols-[180px_1fr]"
                        : "lg:grid-cols-[1fr_180px]"
                    }`}
                  >
                    <div
                      className={`flex flex-col justify-between rounded-[28px] border border-[#C9A96B]/25 bg-white p-5 ${
                        index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="text-[52px] font-bold leading-none tracking-[-0.08em] text-[#C9A96B]/80 md:text-[68px]">
                        {item.number}
                      </div>
                      <div className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#0B1F35]">
                        {item.eyebrow}
                      </div>
                    </div>

                    <div
                      className={`flex flex-col justify-center ${
                        index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <h3 className="text-2xl font-bold leading-snug tracking-[-0.03em] text-[#0B1F35] md:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base md:leading-8">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f3ee] py-24 md:py-32">
          <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[44px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                  Timeline
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                  한 사람의 이력이
                  <br />
                  하나의 구조로 이어지는 과정
                </h2>

                <div className="mt-10 space-y-6">
                  {timelineItems.map((item) => (
                    <div
                      key={item.year}
                      className="grid gap-5 border-t border-slate-200 pt-6 md:grid-cols-[150px_1fr]"
                    >
                      <div className="text-xl font-bold tracking-[-0.03em] text-[#C9A96B]">
                        {item.year}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0B1F35]">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-sm leading-8 text-slate-600 md:text-base">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[44px] bg-[#081A2F] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] md:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,201,150,0.18),transparent_34%)]" />
                <div className="relative">
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                    Strategic Summary
                  </div>

                  <h3 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] md:text-4xl">
                    실물경제와
                    <br />
                    공공외교를 함께 이해하는
                    <br />
                    드문 실무형 리더
                  </h3>

                  <p className="mt-7 text-base leading-8 text-slate-300 md:text-lg">
                    기업 성장 구조와 시장의 작동 원리를 체득한 뒤,
                    국제협력과 공공 영역으로 활동 무대를 넓혀 국내 현안과
                    세계적 흐름을 연결하는 역할을 수행해 왔습니다.
                  </p>

                  <div className="mt-10 grid gap-4">
                    {["실물경제", "공공외교", "국제협력", "지속가능발전"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-[22px] border border-white/10 bg-white/[0.055] px-5 py-4 text-base font-semibold text-white backdrop-blur-md"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#081A2F] py-24 text-white md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(229,201,150,0.16),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.07),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

          <div className="relative mx-auto max-w-[1450px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[#E5C996]" />
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                    Strategic Field
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] md:text-5xl">
                  미래 전략 산업과
                  <br />
                  공공가치의 접점을
                  <br />
                  설계합니다.
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-300 md:text-lg">
                  최근에는 문화유산 보존, 친환경 에너지, 국제 투자 협력,
                  글로벌 네트워크 구축 등 미래 전략 산업과 공공 가치가 결합된
                  프로젝트에 주력하고 있습니다.
                </p>
              </div>

              <div className="grid gap-5">
                {strategicFields.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-6 rounded-[34px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#E5C996]/25 hover:bg-white/[0.08] md:grid-cols-[120px_1fr] md:p-8"
                  >
                    <div className="text-[48px] font-bold leading-none tracking-[-0.08em] text-[#E5C996]">
                      {item.number}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-8 text-slate-300 md:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f3ee] py-24 md:py-32">
          <div className="mx-auto max-w-[1450px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[#C9A96B]" />
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                    Expertise
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                  대표 컨설팅 영역
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                  단일 업무가 아니라, 조직의 철학·제도·자본·브랜드·국제협력을
                  통합적으로 연결하는 구조 설계형 컨설팅을 지향합니다.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {expertiseItems.map((item, index) => (
                  <div
                    key={item}
                    className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A96B]/35 hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]"
                  >
                    <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#C9A96B]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-4 text-lg font-bold leading-8 text-[#0B1F35] md:text-xl">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white py-24 md:py-32">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_15%_20%,rgba(201,169,107,0.10),transparent_28%)]" />

          <div className="relative mx-auto max-w-[1250px] px-6 md:px-10 lg:px-12">
            <div className="rounded-[46px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.07)] md:p-12">
              <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
                <div>
                  <div className="text-[72px] font-bold leading-none tracking-[-0.08em] text-[#C9A96B]/80 md:text-[96px]">
                    EF
                  </div>
                  <div className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                    Eco-Fare Campaign
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                    착한 생산과 소비를 통해
                    <br />
                    환경과 복지를 함께 해결하는 모델
                  </h2>

                  <p className="mt-7 text-base leading-9 text-slate-700 md:text-lg md:leading-10">
                    아울러 착한 생산과 소비를 통해 환경오염과 복지 문제를 동시에
                    해결하고자 하는 ‘에코페어(Eco-Fare) 캠페인’을 설계하여,
                    환경 가치와 경제 활성화를 함께 추구하는 UN SDGs 달성형
                    사회혁신 모델 구축에도 힘쓰고 있습니다.
                  </p>

                  <div className="mt-9 grid gap-4 md:grid-cols-3">
                    {["착한 생산", "착한 소비", "지속가능발전"].map((item) => (
                      <div
                        key={item}
                        className="rounded-[24px] border border-[#C9A96B]/20 bg-white px-5 py-4 text-center text-base font-bold text-[#0B1F35] shadow-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f3ee] py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[#C9A96B]" />
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                    Columnist Perspective
                  </div>
                </div>

                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                  진영을 넘어
                  <br />
                  시대의 본질을 읽는
                  <br />
                  칼럼니스트
                </h2>
              </div>

              <div>
                <p className="text-base leading-9 text-slate-700 md:text-lg md:leading-10">
                  그의 칼럼은 감정적 진영 논리를 넘어 국가 경쟁력, 국제 질서,
                  기술 패권, AI 혁명, 세대 통합, 공공 리더십, 지속가능한 경제
                  생태계 등 시대의 본질적 과제를 다룹니다. 현실 감각과 원칙의
                  균형 속에서 대한민국과 국제사회가 나아갈 방향을 모색하는 데
                  강점을 지닙니다.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {columnThemes.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-[1px] hover:border-[#C9A96B]/35 hover:text-[#0B1F35]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative overflow-hidden bg-[#081A2F] py-24 text-white md:py-32"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,201,150,0.15),transparent_34%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C996]/40 to-transparent" />

          <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-10 lg:px-12">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
              Consulting Inquiry
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] md:text-5xl">
              조직의 철학을 구조로 만들고,
              <br />
              실행 가능한 미래 전략으로 연결합니다.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              공익법인 설립, 사회적기업 설립, 브랜딩, 헤리티지오피스,
              국제협력 프로젝트에 대한 상담을 요청하실 수 있습니다.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/heritage-office#contact"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#E5C996] px-7 py-4 text-base font-bold text-[#081A2F] shadow-[0_18px_45px_rgba(229,201,150,0.20)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_24px_60px_rgba(229,201,150,0.32)] sm:w-auto"
              >
                상담 신청하기
              </a>

              <a
                href="tel:02-785-7874"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-white/12 sm:w-auto"
              >
                02-785-7874
              </a>
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
        ]}
      />
    </div>
  );
}