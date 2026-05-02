import { siteMenuItems } from "@/lib/site-menu";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "NPOLAP | 에코피온 소개",
  description:
    "창업, 금융, 투자, 국제협력, 공공외교를 연결하는 구조 설계형 대표 에코피온 박기현 프로필 페이지입니다.",
  openGraph: {
    title: "대표 에코피온 소개 | NPOLAP",
    description:
      "Eco-pion은 지속가능한 인류문명의 구조를 설계하는 직업입니다. Eco-pion은 고귀한 삶을 지키고 가꾸는 지속가능한 문명설계자입니다.",
    url: "https://npolap.cloud/consultant-profile",
    siteName: "NPOLAP",
    images: [
      {
        url: "/images/consultant-profile.png",
        width: 1200,
        height: 630,
        alt: "에코피온 박기현",
      },
    ],
    locale: "ko_KR",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "NPOLAP | 에코피온 소개",
    description:
      "창업, 금융, 투자, 국제협력, 공공외교를 연결하는 구조 설계형 대표 에코피온 프로필.",
    images: ["/images/consultant-profile.png"],
  },
};

const columnItems = [
  {
    title: "군맹무상의 장님이 될 것인가",
    desc: "인식의 한계와 시대를 읽는 통찰을 다룬 칼럼입니다.",
    href: "https://www.kdpress.co.kr/news/articleView.html?idxno=75869&page=2&total=45",
  },
  {
    title: "정치의 바탕 '숙의(심의)민주주의'",
    desc: "민주주의의 질적 성숙과 숙의의 필요성을 다룬 칼럼입니다.",
    href: "https://www.kdpress.co.kr/news/articleView.html?idxno=70483&page=2&total=45",
  },
];

const timelineItems = [
  {
    year: "1990s",
    title: "벤처창업 현장과 창업지원 플랫폼 운영",
    desc: "초기 벤처 생태계가 형성되던 시기, 대학 및 중소기업청 소관 연구기관에서 창업지원실장과 전문위원으로 활동하며 창업 강연, 창업아카데미 운영, 창업 관련 집필 활동과 제3시장 진입지원 컨설팅을 수행했습니다.",
  },
  {
    year: "IMF 이후",
    title: "디지털 산업과 정보중개 플랫폼 활성화",
    desc: "디지털저널과 하이코리아플러스를 설립해 대한민국 경제 활성화를 위한 디지털 산업과 AI빅데이터를 활용한 정보중개 플랫폼 사업을 추진했습니다.",
  },
  {
    year: "2001 이후",
    title: "국제지도자연합 설립과 민간외교 플랫폼 구축",
    desc: "대한민국의 IMF 차입금 조기 상환 이후 국가 재도약과 국제 위상 강화를 위한 민간 외교의 필요성에 주목해 국제지도자연합 설립본부장으로 참여했습니다.",
  },
  {
    year: "현재",
    title: "문화유산 · 에너지 · 투자 · SDGs 프로젝트",
    desc: "문화유산 보존, 친환경 에너지, 국제 투자 협력, 글로벌 네트워크 구축 등 미래 전략 산업과 공공 가치가 결합된 프로젝트에 주력하고 있습니다.",
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

const keywordItems = [
  "실물경제",
  "공공외교",
  "국제협력",
  "지속가능발전",
  "AI시대",
  "공공 리더십",
];

export default function ConsultantProfilePage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/heritage-office"
        inquiryHref="/heritage-office#contact"
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
        <section className="relative h-[100vh] w-full overflow-hidden pt-24 text-white md:pt-28">
          <div className="absolute inset-0">
            <img
              src="/images/forum-stage-bg.jpg"
              alt="forum stage background"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#081A2F]/30" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 md:px-10 lg:px-12">
            <div className="max-w-5xl">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px w-14 bg-[#E5C996]" />
                <div className="text-xs font-semibold uppercase tracking-[0.32em] text-[#E5C996] md:text-sm">
                  Ecopion Consultant
                </div>
              </div>

              <h1 className="text-[42px] font-bold leading-[1.08] tracking-[-0.055em] md:text-6xl xl:text-[80px]">
                다음시대를 잇는
                <br />
                法人 구조 설계자
              </h1>

              <div className="mt-8 max-w-3xl border-l border-[#E5C996]/45 pl-6">
                <p className="text-lg leading-9 text-slate-200 md:text-[22px] md:leading-10">
                  백년의 뿌리 위에 천년의 가지를 뻗는 가문의 문명을 설계합니다.
                </p>
              </div>

              <div className="mt-9 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                영리는 뿌리고 비영리는 열매입니다. 창업·금융·언론의 현장에서 체득한 자양분으로 경제적 수단으로 사회적 가치를 추구하는 가문을 설계합니다. 가문의 성취가 대를 이어 인류 문명에 기여하는 지속가능한 영속적인 로드맵을 제시합니다.
              </div>

              <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#speaker-profile"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#E5C996]/35 hover:bg-white/[0.08] hover:text-[#F3DFB6] md:text-base"
                >
                  소개 보기
                  <span className="ml-2 transition-transform duration-300">
                    →
                  </span>
                </a>

                <a
                  href="/heritage-office#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#E5C996]/35 hover:bg-white/[0.08] hover:text-[#F3DFB6] md:text-base"
                >
                  컨설팅 문의
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="speaker-profile"
          className="relative overflow-hidden bg-[#f6f3ee] py-16 md:py-20"
        >
          <div className="relative z-10 mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <div className="mb-12 max-w-5xl">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                Biography
              </div>

              <h2 className="mt-4 text-4xl font-bold tracking-[-0.02em] text-[#0B1F35] md:text-5xl">
                박기현
              </h2>

              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-700 md:text-lg md:leading-9">
                혁신과 자본, 공공가치를 연결, 자산을 유산으로 지속가능한 신뢰구조를 설계하는 에코피온 전략가
              </p>
            </div>

            <div className="grid gap-10 lg:h-[980px] lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
              <div className="relative h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-[36px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-5">
                  <div className="flex min-h-[520px] flex-1 items-center justify-center overflow-hidden rounded-[28px] bg-[#0f2238] lg:min-h-0">
                    <img
                      src="/images/consultant-profile.png"
                      alt="박기현 대표 에코피온"
                      className="h-full w-full object-contain object-center"
                    />
                  </div>

                  <div className="shrink-0 px-4 py-6 md:px-6 md:py-7">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                      LEAD ECO-PION
                    </div>

                    <h3 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-[#0B1F35] md:text-3xl">
                      박기현 / PARK KI HYUN
                    </h3>

                    <div className="mt-3 text-base font-semibold leading-7 text-[#0B1F35] md:text-lg">
                      국제지도자연합 사무총장
                    </div>

                    <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600 md:text-[15px] md:leading-7">
                      <p>
                        <span className="font-bold text-[#0B1F35]">전문영역</span>
                        <span className="mx-2 text-slate-300">/</span>
                        창업 · 금융 · 투자 · 국제협력 · 공공외교
                      </p>
                      <p>
                        <span className="font-bold text-[#0B1F35]">핵심역량</span>
                        <span className="mx-2 text-slate-300">/</span>
                        조직 설립, 성장전략, 투자구조, 공익 플랫폼 설계
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-full min-h-0 flex-col gap-8 pt-1 md:pt-2 lg:pt-0">
                <div className="shrink-0">
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                    Heritage Architect
                  </div>
                  <h3 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                    제도와 구조를 만들고,
                    <br />
                    사람과 자본과 기관을 연결합니다.
                  </h3>
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-[34px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:px-8 md:py-8">
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                    <div className="space-y-6 text-[15px] leading-8 text-slate-700 md:text-[17px] md:leading-9">
                      <p>
                        국제지도자연합(International Leaders Union) 사무총장 겸
                        NPOLAP 대표. 대한민국 벤처창업 붐을 이끌었던 1세대 실무형
                        전략가로, 창업·금융·투자 분야의 현장 경험을 바탕으로
                        기업 성장 구조와 시장의 작동 원리를 체득했으며, 이후
                        국제협력과 공공 영역으로 활동 무대를 넓혀 국제사회의
                        지속가능한 발전 모델을 모색해 온 인물이다.
                      </p>

                      <p>
                        초기 벤처 생태계가 형성되던 시기, 대학 및 중소기업청 소관
                        연구기관에서 창업지원실장과 전문위원으로 활동하며 창업
                        강연, 창업아카데미 운영, 창업 관련 집필 활동을 수행했다.
                        동시에 영리·비영리 법인을 아우르는 창업 전문 컨설턴트로서
                        다양한 조직의 설립과 성장 전략을 지원했으며, 창업 컨설팅,
                        IPO·M&A·투자 구조 설계 등에 참여해 기업 성장과 자본시장의
                        실무 경험을 축적했다.
                      </p>

                      <p>
                        특히 IMF 외환위기 이후 국가 경제 회복이 최대 과제로
                        대두되던 시기, 디지털저널과 하이코리아플러스를 설립해
                        대한민국 경제 활성화를 위한 디지털 산업과 금융 플랫폼
                        사업을 추진했다. 디지털저널을 통해 정보·미디어 산업의
                        가능성을 제시했고, 하이코리아플러스를 통해 오늘날 체크카드·
                        교통카드 등 디지털 카드 시스템의 초기 모델로 평가받는
                        전자결제 플랫폼 사업을 선도했다.
                      </p>

                      <p>
                        동시에 데이터 산업의 성장 가능성을 내다보고 정보중개
                        전문인력 양성 사업을 전개하는 등 디지털 경제 전환을 앞서
                        준비한 선구적 행보를 보였다. 2001년 대한민국의 IMF 차입금
                        조기 상환 이후에는 국가 재도약과 국제 위상 강화를 위한
                        민간 외교의 필요성에 주목해, 국제지도자연합 설립본부장으로
                        참여하였다.
                      </p>

                      <p>
                        이후 UN 등 국제기구와의 협력 네트워크를 기반으로 글로벌
                        리더십 교류, 청년 인재 양성, 문화외교, 국제 포럼, 민관
                        협력사업 등을 추진하며 국내 현안과 세계적 흐름을 연결하는
                        역할을 수행해 왔다. 실물경제와 공공외교를 함께 이해하는
                        드문 실무형 리더라는 평가를 받는다.
                      </p>

                      <p>
                        최근에는 문화유산 보존, 친환경 에너지, 국제 투자 협력,
                        글로벌 네트워크 구축 등 미래 전략 산업과 공공 가치가 결합된
                        프로젝트에 주력하고 있다. 아울러 착한 생산과 소비를 통해
                        환경오염과 복지 문제를 동시에 해결하고자 하는 ‘에코페어
                        (Eco-Fare) 캠페인’을 설계하여, 환경 가치와 경제 활성화를
                        함께 추구하는 UN SDGs 달성형 사회혁신 모델 구축에도 힘쓰고
                        있다.
                      </p>

                      <p>
                        그의 칼럼은 감정적 진영 논리를 넘어 국가 경쟁력, 국제 질서,
                        기술 패권, AI 혁명, 세대 통합, 공공 리더십, 지속가능한 경제
                        생태계 등 시대의 본질적 과제를 다룬다. 현실 감각과 원칙의
                        균형 속에서 대한민국과 국제사회가 나아갈 방향을 모색하는 데
                        강점을 지닌다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                  <div className="grid md:grid-cols-[220px_1fr]">
                    <div className="border-b border-slate-200 px-6 py-7 md:border-b-0 md:border-r md:px-7">
                      <div className="mb-5 h-[3px] w-10 bg-[#d61f4f]" />
                      <div className="text-3xl font-bold tracking-[-0.03em] text-[#0B1F35]">
                        칼럼
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        
                      </p>
                    </div>

                    <div className="divide-y divide-slate-200">
                      {columnItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-6 py-6 transition-colors duration-300 hover:bg-[#faf8f4] md:px-7"
                        >
                          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#d61f4f]">
                           
                          </div>
                          <h4 className="mt-2 text-xl font-bold leading-snug tracking-[-0.03em] text-[#0B1F35] md:text-2xl">
                            {item.title}
                          </h4>
                          <p className="mt-3 text-sm leading-7 text-slate-600">
                            {item.desc}
                          </p>
                          <div className="mt-4 inline-flex items-center text-sm font-bold text-[#0B1F35]">
                            칼럼 바로가기
                            <span className="ml-2">→</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f3ee] py-20 md:py-28">
          <div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[40px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] md:p-10">
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B]">
                  Timeline
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0B1F35] md:text-5xl">
                  한 사람의 열정이
                  <br />
                  제도와 구조로 이어지는 실현 과정
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

              <aside className="relative overflow-hidden rounded-[40px] bg-[#081A2F] p-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] md:p-10">
                <div className="relative">
                  <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
                    Strategic Summary
                  </div>

                  <h3 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] md:text-4xl">
                    영리와 비영리
                    <br />
                    사람과 제도를 연결하는
                    <br />
                    신뢰구축 설계
                  </h3>

                  <p className="mt-7 text-base leading-8 text-slate-300 md:text-lg">
                    기업 성장 구조와 시장의 작동 원리를 체득한 뒤, 국제협력과
                    공공 영역으로 활동 무대를 넓혀 국내 현안과 세계적 흐름을
                    연결하는 역할을 수행해 왔습니다.
                  </p>

                  <div className="mt-10 grid gap-4">
                    {keywordItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-[22px] border border-white/10 bg-white/[0.055] px-5 py-4 text-base font-semibold text-white backdrop-blur-md"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
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
                  Eco-pion 영역
                </h2>

                <p className="mt-6 text-base leading-8 text-slate-600 md:text-lg">
                  Eco-pion은 고귀한 삶을 지키고 가꾸는 사람들입니다.
경제(Eco-nomy)를 삶의 수단으로, 생태(Eco-logy)를 생명의 본질로 이해하고, 이를 Pio의 경건함과 책임으로 하나의 가치로 묶어냅니다. AI시대의 Eco-pion은 자연과 인류의 생명 가치를 지키며, 생태·기술·경제·정신의 균형을 설계하는 지속가능한 문명을 설계하는 직업입니다.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {expertiseItems.map((item, index) => (
                  <div
                    key={item}
                    className="group rounded-[30px] border border-slate-200 bg-[#FCFBF8] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A96B]/35 hover:bg-white hover:shadow-[0_24px_60px_rgba(15,23,42,0.09)]"
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

        <section
          id="consulting-inquiry"
          className="relative overflow-hidden bg-[#081A2F] py-24 text-white md:py-32"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C996]/40 to-transparent" />

          <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-10 lg:px-12">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#E5C996]">
              Consulting Inquiry
            </div>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.04em] md:text-5xl">
              한 사람의 비전이 실현되도록
              <br />
              조직의 철학과 제도를 구조로 만들고,
              <br />
              지속가능한 미래 성장 전략으로 연결합니다.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              학교와 병원, 미술관과 박물관 같은 공익적 기반 위에 사회적 기업의 혁신을 더하고,
              정교한 브랜딩으로 고유의 헤리티지를 정립하고, 시대를 불문하는 존재 가치를 증명합니다.
              국경을 넘는 공공 협력 프로젝트를 통해 한 사람의 비전이 세계적인 영향력으로 이어지도록 에코피온의 가치를 설계합니다.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/heritage-office#contact"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 py-4 text-base font-bold text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-white/12 sm:w-auto"
              >
                상담 신청하기
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
          "에코피온",
        ]}
      />
    </div>
  );
}