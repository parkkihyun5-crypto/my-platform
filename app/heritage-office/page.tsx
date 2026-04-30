"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";
import UnifiedCard from "@/components/UnifiedCard";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import { submitInquiry } from "@/lib/inquiry-client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type InquiryFormState = {
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

type RoadmapItem = {
  step: string;
  task: string;
  tool: string;
  detail: string;
};

const serviceItems = [
  {
    title: "공익법인설립",
    description: "공익법인 및 비영리 조직 설립 방향과 구조를 연결합니다.",
    href: "/public-interest-foundation",
  },
  {
    title: "사회적기업설립",
    description: "사회적 목적과 운영 구조, 인증 준비를 함께 설계합니다.",
    href: "/social-enterprise",
  },
  {
    title: "브랜딩서비스",
    description: "기관명, 로고, 상표, 문서체계, 홈페이지 방향을 통합 설계합니다.",
    href: "/branding",
  },
  {
    title: "헤리티지오피스",
    description:
      "가문의 철학과 자산, 공익적 비전을 통합하여 지속 가능한 자산과 유산을 설계합니다.",
    href: "/heritage-office",
  },
];

const coreStructureItems = [
  {
    title: "PHILOSOPHY",
    description: "가문의 가치와 정신을 유산의 언어로 정리합니다.",
  },
  {
    title: "INSTITUTION",
    description: "재단·공익법인·운영체계를 제도적으로 설계합니다.",
  },
  {
    title: "LEGACY",
    description: "한 세대의 성취를 다음 세대의 질서로 남깁니다.",
  },
];

const valueSystemItems = [
  {
    title: "철학의 제도화",
    description:
      "가문의 가치와 창립자의 뜻을 선언문, 헌장, 설립 취지로 구조화합니다.",
  },
  {
    title: "공익의 구조화",
    description: "사적인 선의를 공적인 유산으로 전환할 수 있도록 설계합니다.",
  },
  {
    title: "브랜드의 상징화",
    description: "기관명, 로고, 문서 체계를 하나의 정체성으로 통합합니다.",
  },
  {
    title: "세대의 계승화",
    description: "한 세대의 성취가 다음 세대의 방향이 되도록 설계합니다.",
  },
];

const heritageOfficeItems = [
  "가문 철학 정리",
  "유산 구조 설계",
  "운영 체계 구축",
  "브랜드 체계 완성",
];

const roadmapItems: RoadmapItem[] = [
  {
    step: "1단계: 진단",
    task: "자산 구조 및 잠재적 리스크 파악",
    tool: "세무/법률 실사 (Due Diligence)",
    detail:
      "현재 보유 자산의 구조, 명의, 세금 이슈, 승계 리스크를 종합적으로 점검하는 단계입니다. 향후 유산 설계의 출발점이 되는 핵심 진단입니다.",
  },
  {
    step: "2단계: 설계",
    task: "가문의 미션과 비전 설정",
    tool: "가족 헌장 작성",
    detail:
      "가문이 추구하는 철학과 공익적 방향을 언어로 정리하고, 다음 세대가 공유할 수 있는 가치 기준을 구조화하는 단계입니다.",
  },
  {
    step: "3단계: 구축",
    task: "의사결정 및 자산 관리 체계 수립",
    tool: "패밀리오피스 설립 또는 MFO 가입",
    detail:
      "가문의 자산과 유산을 장기적으로 관리할 수 있도록 의사결정 구조, 운영 체계, 자문 체계를 제도적으로 정비하는 단계입니다.",
  },
  {
    step: "4단계: 실행",
    task: "자산 이전 및 후계자 양성",
    tool: "신탁(Trust) 및 교육 프로그램",
    detail:
      "실제 자산 이전, 승계 계획 실행, 후계자 교육과 공익 프로그램 연계를 통해 유산이 지속되도록 만드는 실천 단계입니다.",
  },
];

export default function HeritageOfficePage() {
  const [form, setForm] = useState<InquiryFormState>({
    organization: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [heroVisible, setHeroVisible] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [selectedRoadmapStep, setSelectedRoadmapStep] =
    useState<RoadmapItem | null>(null);
  const [legacyFilmVisible, setLegacyFilmVisible] = useState<boolean>(false);

  const legacyFilmRef = useRef<HTMLElement | null>(null);

  const mailtoHref = useMemo(() => {
    const subject = `[헤리티지오피스 문의] ${form.organization || "기관명 미입력"}`;
    const body = [
      "안녕하세요. 헤리티지오피스 관련 문의를 드립니다.",
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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHeroVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;

    const timer = window.setTimeout(() => {
      setShowSuccess(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    if (!selectedRoadmapStep) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRoadmapStep(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedRoadmapStep]);

  useEffect(() => {
    const target = legacyFilmRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setLegacyFilmVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.22,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  function scrollToSection(targetId: string): void {
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = 92;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  async function handleInquirySubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await submitInquiry(
        form,
        "heritage-office",
        "헤리티지오피스"
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
      setShowSuccess(true);
    } catch {
      window.location.href = mailtoHref;
    } finally {
      setIsSubmitting(false);
    }
  }

  const whiteCardClass =
    "rounded-[30px] border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-slate-300/90 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] focus-within:-translate-y-1 focus-within:border-[#0B1F35]/20 focus-within:shadow-[0_24px_60px_rgba(15,23,42,0.10)]";

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="HERITAGE OFFICE"
        logoHref="/heritage-office"
        inquiryHref="#heritage-inquiry"
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
    label: "에코피언",
    href: "/consultant-profile",
    isLink: true,
  },
]}
      />

      {selectedRoadmapStep ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[720px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96B]">
                  ROADMAP DETAIL
                </div>
                <h3 className="mt-3 text-2xl font-bold text-[#0B1F35] md:text-3xl">
                  {selectedRoadmapStep.step}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRoadmapStep(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:bg-slate-50 hover:text-[#0B1F35]"
                aria-label="로드맵 상세 닫기"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[20px] bg-[#F8F6F1] px-5 py-4">
                <div className="text-sm font-semibold text-slate-500">주요 과업</div>
                <div className="mt-2 text-base font-semibold text-[#0B1F35] md:text-lg">
                  {selectedRoadmapStep.task}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#FBF5EA] px-5 py-4">
                <div className="text-sm font-semibold text-slate-500">핵심 도구</div>
                <div className="mt-2 text-base font-semibold text-[#0B1F35] md:text-lg">
                  {selectedRoadmapStep.tool}
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 bg-white px-5 py-5 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
                {selectedRoadmapStep.detail}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoadmapStep(null);
                    window.setTimeout(() => scrollToSection("contact"), 120);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-[#E5C996]/30 bg-[#E5C996] px-5 py-3 text-sm font-semibold text-[#0B1F35] shadow-[0_10px_30px_rgba(229,201,150,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_45px_rgba(229,201,150,0.28)]"
                >
                  이 단계 상담하기
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`fixed right-5 top-24 z-[80] rounded-2xl border border-[#E5C996]/30 bg-white/95 px-5 py-4 text-sm font-medium text-[#0B1F35] shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-500 md:right-8 ${
          showSuccess
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        문의가 접수되었습니다.
      </div>

      <main>
        <section className="relative h-[100vh] w-full overflow-hidden pt-24 md:pt-28">
          <div className="absolute inset-0">
            <img
              src="/images/hero-main.jpg"
              alt="heritage office hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center px-5 md:px-10 lg:px-12">
            <div
              className={`max-w-5xl text-white transition-all duration-[1400ms] ease-out ${
                heroVisible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-6 opacity-0 blur-[10px]"
              }`}
            >
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EAD9BC] md:text-base">
                HERITAGE OFFICE
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl xl:text-[84px]">
                자산을 넘어
                <br />
                세상을 밝히는
                <br />
                영원한 유산을 설계합니다
              </h1>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <p className="mt-7 max-w-3xl text-base leading-8 text-slate-200 md:text-xl md:leading-9">
                  헤리티지 자산 설계 (Heritage Asset Design)
                  <br />
                  가문의 유산을 제도화하고 세상과 연결하여 한 세대의 성취가
                  <br />
                  다음 세대의 질서로 이어지도록 돕습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-white py-20 md:py-28">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#f6f3ee] to-transparent" />
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="PHILOSOPHY"
              title="가문의 철학이 명문가의 유산입니다"
              center
            />

            <div className={`${whiteCardClass} mt-14 overflow-hidden p-0`}>
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[320px] bg-[#0B1F35]">
                  <img
                    src="/images/heritage-office-philosophy.png"
                    alt="heritage office philosophy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="p-6 md:p-10">
                  <div className="text-center text-base leading-8 text-slate-700 md:text-xl md:leading-10">
                    위대한 가문의 유산은 재산 그 자체가 아니라,
                    <br />
                    재산을 사용하는 가문의 철학입니다.
                    <br />
                    <br />
                    철학이 제도화될 때 비로소 ‘재단’이 탄생합니다.
                    <br />
                    <br />
                    가문의 정신이 제도로 구현되고,
                    <br />
                    가문의 활동이 사회를 품는 공헌으로 확장될 때
                    <br />
                    가문은 번영을 넘어 공적 유산으로 승계됩니다.
                    <br />
                    <br />
                    재단은 단순히 기부하는 창구가 아닙니다.
                    <br />
                    가문의 가치관을 시공간을 초월해 지속시키는 장치이자,
                    <br />
                    세대가 바뀌어도 정신이 흐려지지 않게 하는 보루입니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={legacyFilmRef}
          className="bg-[#f6f3ee] py-20 md:py-28"
        >
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="LEGACY FILM"
              title="명문가문 소개"
              desc="위대한 가문은 재산이 아니라 철학을 남기고, 구조를 통해 그 정신을 계승합니다."
              center
            />

            <div
              className={`mt-14 overflow-hidden rounded-[30px] border border-slate-200/90 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-[1200ms] ease-out ${
                legacyFilmVisible
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-8 opacity-0 blur-[8px]"
              }`}
            >
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div
                  className={`relative aspect-video w-full bg-black transition-all duration-[1400ms] ease-out ${
                    legacyFilmVisible
                      ? "scale-100 opacity-100"
                      : "scale-[1.03] opacity-0"
                  }`}
                >
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube.com/embed/d2Rod-qg8mM?rel=0"
                    title="명문가문 소개 영상"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div
                  className={`flex flex-col justify-center p-6 transition-all delay-150 duration-[1200ms] ease-out md:p-10 ${
                    legacyFilmVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-6 opacity-0"
                  }`}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96B]">
                    HERITAGE INSIGHT
                  </div>

                  <h3 className="mt-4 text-2xl font-bold leading-[1.4] text-[#0B1F35] md:text-3xl">
                    명문가문은 무엇을
                    <br />
                    유산으로 남기는가
                  </h3>

                  <p className="mt-6 text-sm leading-8 text-slate-600 md:text-base">
                    위대한 가문은 단순히 부를 축적하지 않습니다.
                    <br />
                    철학을 만들고, 제도를 구축하며, 계승 구조를 설계합니다.
                    <br />
                    <br />
                    이 영상은 가문이 어떻게 공적 유산으로 확장되는지를
                    <br />
                    구조적으로 이해할 수 있도록 돕습니다.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["철학", "제도", "계승", "명문가문", "유산"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="CORE STRUCTURE"
              title="유산 설계의 3대 구조"
              desc="철학, 제도, 계승을 하나의 구조로 연결해야 유산은 지속될 수 있습니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {coreStructureItems.map((item) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="VALUE SYSTEM"
              title="가문의 철학을 구조로 바꾸는 4가지 축"
              desc="가치가 문장에 머무르지 않고 제도, 공익, 상징, 계승으로 이어지도록 설계합니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {valueSystemItems.map((item) => (
                <UnifiedCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="SCOPE"
              title="헤리티지오피스 설계 범위"
              desc="철학 정리부터 브랜드 체계 완성까지 유산의 설계와 운영을 연결합니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {heritageOfficeItems.map((item) => (
                <div
                  key={item}
                  className={`${whiteCardClass} p-6 text-center text-lg font-semibold text-[#0B1F35] md:p-8`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1300px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="ROADMAP"
              title="헤리티지오피스 실행 로드맵"
              desc="진단에서 설계, 구축, 실행까지 단계별 구조로 유산을 완성합니다."
              center
            />

            <div className="mt-14 grid gap-6 xl:grid-cols-4">
              {roadmapItems.map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setSelectedRoadmapStep(item)}
                  className={`${whiteCardClass} p-6 text-left md:p-8`}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96B]">
                    {item.step}
                  </div>
                  <div className="mt-4 text-2xl font-bold text-[#0B1F35]">
                    {item.task}
                  </div>
                  <div className="mt-4 text-sm leading-7 text-slate-600">
                    {item.tool}
                  </div>
                  <div className="mt-6 inline-flex items-center text-sm font-semibold text-[#0B1F35]">
                    자세히 보기 →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
            <SectionTitle
              badge="PLATFORM"
              title="철학과 구조를 잇는 통합 플랫폼"
              desc="유산은 자산만으로 남지 않습니다. 설계와 운영, 공익과 계승이 함께 구조화될 때 비로소 다음 세대로 이어집니다."
              center
            />

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {serviceItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className={`${whiteCardClass} block p-6 md:p-8`}
                >
                  <h3 className="text-2xl font-bold text-[#0B1F35]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 md:py-28">
  <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
    <SectionTitle
      badge="CONCLUSION"
      title="철학과 구조로 연결하는 자산과 유산 설계 플랫폼"
      center
    />

    <div className={`${whiteCardClass} mt-14 p-6 md:p-10`}>
      <div className="text-center text-base leading-8 tracking-[-0.01em] text-slate-700 md:text-lg md:leading-9">
        NPO LAP (Legacy Alliance Platform)
        <br />
        <br />
        공익법인 설립, 사회적기업 설립, 브랜딩 서비스,
        <br />
        헤리티지오피스 설립까지
        <br />
        <br />
        철학과 구조로 연결하는
        <br />
        자산과 유산의 통합 설계 플랫폼
      </div>
    </div>
  </div>
</section>

<section
  id="contact"
  className="py-20 scroll-mt-28 md:py-28"
><section
  id="contact"
  className="py-20 scroll-mt-28 md:py-28"
>
  <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-12">
    <div className={`${whiteCardClass} p-6 md:p-10`}>
      <SectionTitle
        badge="ONLINE CONSULTING"
        title="문의하기"
        desc="개인정보 활용: 견적 제공 및 상담을 위한 개인정보 수집에 동의하실 경우에만 문의가 접수됩니다."
        center
      />

      <form onSubmit={handleInquirySubmit} className="mt-10">
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

        <div className="mt-4">
          <FormTextarea
            value={form.message}
            onChange={(value) => setForm((prev) => ({ ...prev, message: value }))}
            placeholder={`상담을 원하는 내용을 입력해 주세요.

- 가문의 철학을 제도적으로 남기고 싶은 분
- 재단 설립을 통해 사회공헌 구조를 만들고 싶은 분
- 자산 이전이 아닌 유산 계승 구조를 고민하는 분
- 기업 사회의 공익재단 또는 사회적 가치 플랫폼을 준비하는 분
- 창립자의 정신과 기록을 체계화하고 싶은 분`}
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 md:flex-row md:justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full border border-[#E5C996]/30 bg-[#E5C996] px-6 py-3 text-sm font-semibold text-[#0B1F35] shadow-[0_10px_30px_rgba(229,201,150,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_45px_rgba(229,201,150,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "접수 중..." : "문의 접수하기"}
          </button>

          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#0B1F35] transition-all duration-300 hover:-translate-y-[1px] hover:bg-slate-50"
          >
            이메일로 문의하기
          </a>
        </div>
      </form>
    </div>
  </div>
</section>
      </main>

      <SiteFooter
        leftText="International Leaders Union"
        rightItems={["공익법인설립", "사회적기업설립", "브랜딩서비스", "헤리티지오피스","에코피언"]}
      />
    </div>
  );
}