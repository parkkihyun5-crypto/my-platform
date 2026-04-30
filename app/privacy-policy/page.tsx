"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const cardClass =
  "rounded-[24px] md:rounded-[30px] border border-slate-200/90 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:p-8";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <SiteHeader
        mode="sub"
        logoText="NPOLAP"
        logoHref="/heritage-office"
        inquiryHref="#privacy-policy"
        menuItems={[
          { label: "공익법인설립", href: "/public-interest-foundation", isLink: true },
          { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
          { label: "브랜딩서비스", href: "/branding", isLink: true },
          { label: "헤리티지오피스", href: "/heritage-office", isLink: true },
          { label: "에코피온", href: "/heritage-office", isLink: true },
        ]}
      />

      <main id="privacy-policy" className="px-5 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          <div className="mb-8 text-center md:mb-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A96B] md:text-sm md:tracking-[0.28em]">
              PRIVACY POLICY
            </div>
            <h1 className="mt-3 text-[28px] font-bold leading-tight text-[#0B1F35] md:mt-4 md:text-5xl">
              개인정보처리방침
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 md:mt-5 md:text-lg md:leading-9">
              NPO LAP는 문의 접수 및 상담 응대를 위하여 필요한 최소한의 개인정보를 수집·이용하며,
              관련 법령에 따라 이를 안전하게 관리합니다.
            </p>
            <div className="mt-3 text-xs text-slate-500 md:mt-4 md:text-sm">
              시행일자: 2026. 04. 22
            </div>
          </div>

          <div className="grid gap-4 md:gap-5">
            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">1. 수집 항목 및 이용 목적</h2>
              <div className="mt-4 overflow-hidden rounded-[18px] md:mt-5 md:rounded-[22px] border border-slate-200">
                <div className="grid grid-cols-[0.9fr_1.4fr] border-b border-slate-200 bg-[#FAF8F4] text-[13px] font-bold text-[#111827] md:text-base">
                  <div className="px-3 py-2.5 md:px-4 md:py-3">구분</div>
                  <div className="border-l border-slate-200 px-3 py-2.5 md:px-4 md:py-3">내용</div>
                </div>
                <div className="grid grid-cols-[0.9fr_1.4fr] border-b border-slate-200 text-[13px] md:text-base">
                  <div className="px-3 py-3.5 font-semibold text-slate-700 md:px-4 md:py-4">수집 항목</div>
                  <div className="border-l border-slate-200 px-3 py-3.5 text-slate-700 md:px-4 md:py-4">
                    기관명, 성명, 연락처, 이메일, 문의내용
                  </div>
                </div>
                <div className="grid grid-cols-[0.9fr_1.4fr] text-[13px] md:text-base">
                  <div className="px-3 py-3.5 font-semibold text-slate-700 md:px-4 md:py-4">이용 목적</div>
                  <div className="border-l border-slate-200 px-3 py-3.5 text-slate-700 md:px-4 md:py-4">
                    문의 접수, 상담 응대, 서비스 안내, 협력 또는 계약 관련 사전 커뮤니케이션
                  </div>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">2. 보유기간 및 파기</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  개인정보는 문의 처리 완료 후 지체 없이 파기하는 것을 원칙으로 합니다.
                </p>
                <div className="rounded-[18px] md:rounded-[22px] bg-[#F8F6F1] px-4 py-3.5 md:px-5 md:py-4">
                  ① 문의 및 상담 정보: 처리 완료 후 파기
                  <br />
                  ② 다만, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관
                </div>
                <p>
                  전자적 파일은 복구가 불가능한 방법으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">3. 제3자 제공 및 처리위탁</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>
                  NPO LAP는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                </p>
                <p>
                  다만, 정보주체의 동의가 있거나 법령에 특별한 규정이 있는 경우 예외로 합니다.
                </p>
                <p>
                  서비스 운영상 필요한 경우 관련 법령에 따라 개인정보 처리업무의 일부를 외부에 위탁할 수 있으며,
                  이 경우 안전하게 관리·감독합니다.
                </p>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">4. 정보주체의 권리</h2>
              <div className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 md:mt-5 md:space-y-4 md:text-base md:leading-8">
                <p>이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다.</p>
                <div className="rounded-[18px] md:rounded-[22px] bg-[#F8F6F1] px-4 py-3.5 md:px-5 md:py-4">
                  ① 열람 요청
                  <br />
                  ② 정정 또는 삭제 요청
                  <br />
                  ③ 처리정지 요청
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">5. 문의처</h2>
              <div className="mt-4 overflow-hidden rounded-[18px] md:mt-5 md:rounded-[22px] border border-slate-200">
                <div className="grid grid-cols-[110px_1fr] border-b border-slate-200 text-[13px] md:grid-cols-[140px_1fr] md:text-base">
                  <div className="bg-[#FAF8F4] px-3 py-3.5 font-semibold text-slate-700 md:px-4 md:py-4">기관명</div>
                  <div className="border-l border-slate-200 px-3 py-3.5 text-slate-700 md:px-4 md:py-4">NPO LAP</div>
                </div>
                <div className="grid grid-cols-[110px_1fr] text-[13px] md:grid-cols-[140px_1fr] md:text-base">
                  <div className="bg-[#FAF8F4] px-3 py-3.5 font-semibold text-slate-700 md:px-4 md:py-4">이메일</div>
                  <div className="border-l border-slate-200 px-3 py-3.5 text-slate-700 md:px-4 md:py-4 break-all">
                    npolap@ilukorea.org
                  </div>
                </div>
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
          "에코피온",
        ]}
      />
    </div>
  );
}