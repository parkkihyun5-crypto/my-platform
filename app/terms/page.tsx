"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const cardClass =
  "rounded-[24px] md:rounded-[30px] border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/heritage-office"
        inquiryHref="#terms"
        menuItems={[
          { label: "공익법인설립", href: "/public-interest-foundation", isLink: true },
          { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
          { label: "브랜딩서비스", href: "/branding", isLink: true },
          { label: "헤리티지오피스", href: "/heritage-office", isLink: true },
        ]}
      />

      <main id="terms" className="px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-8 text-center md:mb-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A96B] md:text-sm md:tracking-[0.28em]">
              TERMS OF SERVICE
            </div>
            <h1 className="mt-3 text-[28px] font-bold leading-tight text-[#0B1F35] md:mt-4 md:text-5xl">
              이용약관
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 md:mt-5 md:text-lg md:leading-9">
              본 약관은 NPO LAP가 제공하는 홈페이지 및 관련 상담·문의 서비스의 이용과 관련한
              기본적인 권리, 의무 및 책임사항을 규정합니다.
            </p>
            <div className="mt-3 text-xs text-slate-500 md:mt-4 md:text-sm">
              시행일자: 2026. 04. 22
            </div>
          </div>

          <div className="grid gap-4 md:gap-5">
            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">1. 목적 및 적용범위</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  본 약관은 NPO LAP가 운영하는 홈페이지에서 제공하는 정보 제공, 문의 접수,
                  상담 신청 및 관련 서비스에 적용됩니다.
                </p>
                <p>
                  이용자는 본 홈페이지를 이용함으로써 본 약관의 내용에 동의한 것으로 봅니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">2. 서비스 내용</h2>
              <div className="mt-4 rounded-[18px] md:rounded-[22px] bg-[#F8F6F1] px-4 py-3.5 text-[14px] leading-7 text-slate-700 md:mt-5 md:px-5 md:py-4 md:text-base md:leading-8">
                ① 공익법인 설립, 사회적기업 설립, 브랜딩 서비스, 헤리티지오피스 관련 정보 제공
                <br />
                ② 온라인 문의 접수 및 상담 신청
                <br />
                ③ 서비스 안내, 견적 검토, 협력 또는 계약 관련 사전 커뮤니케이션
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">3. 이용자의 의무</h2>
              <div className="mt-4 rounded-[18px] md:rounded-[22px] bg-[#F8F6F1] px-4 py-3.5 text-[14px] leading-7 text-slate-700 md:mt-5 md:px-5 md:py-4 md:text-base md:leading-8">
                ① 허위 정보 또는 타인의 정보 입력 금지
                <br />
                ② 회사 및 제3자의 권리 침해 금지
                <br />
                ③ 홈페이지 운영을 방해하거나 서비스 안정성을 해치는 행위 금지
                <br />
                ④ 관련 법령 및 공서양속에 반하는 행위 금지
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">4. 회사의 책임 및 면책</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  NPO LAP는 관련 법령에 따라 안정적인 서비스 제공을 위하여 노력합니다.
                </p>
                <p>
                  다만 천재지변, 시스템 장애, 통신망 장애, 기타 불가항력 사유로 인한 서비스 중단에 대해서는
                  책임을 지지 않습니다.
                </p>
                <p>
                  홈페이지에 제공되는 정보는 일반 안내 목적이며, 개별 사안에 대한 최종 판단과 결정은
                  이용자의 책임 아래 이루어져야 합니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">5. 지식재산권</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  홈페이지 내 텍스트, 디자인, 이미지, 문서 및 기타 콘텐츠에 대한 권리는 NPO LAP 또는
                  정당한 권리자에게 귀속됩니다.
                </p>
                <p>
                  이용자는 회사의 사전 동의 없이 이를 복제, 배포, 수정 또는 상업적으로 사용할 수 없습니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">6. 개인정보 보호 및 기타</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  개인정보 처리에 관한 사항은 별도로 게시되는 개인정보처리방침에 따릅니다.
                </p>
                <p>
                  본 약관은 관련 법령 및 서비스 정책 변경에 따라 수정될 수 있으며,
                  변경 시 홈페이지를 통하여 공지합니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">부칙</h2>
              <div className="mt-4 text-[14px] leading-7 text-slate-700 md:mt-5 md:text-base md:leading-8">
                본 약관은 2026년 4월 22일부터 시행합니다.
              </div>
            </section>
          </div>
        </div>
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