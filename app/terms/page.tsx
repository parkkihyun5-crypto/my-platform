import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
        title="공익법인 종합컨설팅 플랫폼"
        subtitle="TERMS OF SERVICE"
        homeLabel="홈으로"
        homeHref="/"
        navItems={[
          { label: "이용약관", href: "/terms", isLink: true },
          { label: "개인정보처리방침", href: "/privacy-policy", isLink: true },
        ]}
      />

      <main className="mx-auto max-w-[1100px] px-4 py-16 md:px-8 md:py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#C9A96B] md:text-base">
            Terms of Service
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0B1F35] md:text-5xl">
            이용약관
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            본 약관은 사이트의 서비스 이용조건과 운영에 관한 제반사항을 규정합니다.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제1조 목적</h2>
              <p className="mt-3">
                본 약관은 공익법인컨설팅 ILU 사이트의 서비스 이용조건과 운영에 관한 제반 사항
                규정을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제2조 용어의 정의</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>회원: 약관에 동의하고 가입한 자</li>
                <li>이용계약: 사이트와 회원 간 체결되는 서비스 이용계약</li>
                <li>회원 아이디(ID): 회원 식별을 위한 고유한 문자와 숫자의 조합</li>
                <li>비밀번호: 회원 본인 확인을 위한 문자와 숫자의 조합</li>
                <li>운영자: 서비스를 개설·운영하는 자</li>
                <li>해지: 회원이 이용계약을 종료하는 것</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제3조 약관 외 준칙</h2>
              <p className="mt-3">
                운영자는 필요한 경우 별도로 운영정책을 공지·안내할 수 있으며, 본 약관과
                운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제4조 이용계약 체결</h2>
              <p className="mt-3">
                이용계약은 본 약관에 대한 동의와 가입신청에 대하여 운영자의 승낙으로 성립합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제5조 서비스 이용 신청</h2>
              <p className="mt-3">
                이용자는 가입 시 사이트가 요청하는 제반 정보를 제공해야 하며, 타인의 정보를
                도용하거나 허위 정보를 등록할 수 없습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제6조 개인정보처리방침</h2>
              <p className="mt-3">
                개인정보 보호에 관한 사항은 관계 법령 및 사이트의 개인정보처리방침에 따릅니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제7조 운영자의 의무</h2>
              <p className="mt-3">
                운영자는 회원의 의견이나 불만이 정당하다고 인정되는 경우 가능한 한 신속하게
                처리하여야 하며, 지속적이고 안정적인 서비스 제공을 위해 노력합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제8조 회원의 의무</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>관계 법령, 본 약관, 공지사항 및 운영정책 준수</li>
                <li>서비스 이용 권한의 양도·증여·담보 제공 금지</li>
                <li>ID 및 비밀번호 관리 의무</li>
                <li>운영자 및 제3자의 권리 침해 금지</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제9조 서비스 이용 시간</h2>
              <p className="mt-3">
                서비스 이용은 연중무휴 1일 24시간을 원칙으로 하되, 시스템 점검, 교체,
                장애, 천재지변 등의 사유로 일시 중단될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제10조 서비스 이용 해지</h2>
              <p className="mt-3">
                회원은 온라인을 통해 이용계약 해지를 신청할 수 있으며, 해지 시 사이트가 제공하는
                서비스 이용 권한도 종료됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제11조 서비스 이용 제한</h2>
              <p className="mt-3">
                허위정보 등록, 타인 정보 도용, 서비스 방해, 권리 침해 등 약관 위반 행위가 있는 경우
                사이트는 서비스 이용을 제한하거나 이용계약을 해지할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제12조 게시물의 관리</h2>
              <p className="mt-3">
                운영자는 불량 게시물 및 자료를 모니터링하고 필요한 경우 삭제 또는 이동 조치를 할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제13조 게시물의 보관</h2>
              <p className="mt-3">
                사이트 운영 중단이 필요한 경우 회원에게 사전 공지하고, 게시물 이전 등 필요한 조치를 위해 노력합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제14조 게시물에 대한 저작권</h2>
              <p className="mt-3">
                회원이 사이트 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속되며,
                사이트는 비영리 목적 범위 내에서 서비스 게재권을 가질 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제15조 손해배상</h2>
              <p className="mt-3">
                본 사이트에서 발생한 민·형사상 책임은 원칙적으로 회원 본인에게 있으며,
                불가항력 또는 회원의 고의·과실로 인한 손해에 대하여 사이트는 책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">제16조 면책</h2>
              <p className="mt-3">
                운영자는 회원이 서비스로부터 기대되는 이익을 얻지 못하거나, 회원 간 또는 회원과
                제3자 간 분쟁, 외부 통신서비스 장애, 불가항력적 사유 등으로 인한 손해에 대하여
                책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">부칙</h2>
              <p className="mt-3">본 약관은 2023년 5월 9일부터 시행합니다.</p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter
        leftText="© PARK KI HYUN, 2026.1.17"
        rightItems={[
          "공익법인 종합컨설팅",
          "이용약관",
          "개인정보처리방침",
        ]}
      />
    </div>
  );
}