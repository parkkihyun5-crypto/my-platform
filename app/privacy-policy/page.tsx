import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-slate-900">
      <SiteHeader
        title="공익법인 종합컨설팅 플랫폼"
        subtitle="PRIVACY POLICY"
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
            Privacy Policy
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0B1F35] md:text-5xl">
            개인정보처리방침
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
            본 개인정보처리방침은 사이트 이용 과정에서 수집되는 개인정보의 처리 목적,
            보유 기간, 이용자 권리, 안전성 확보 조치 등을 안내하기 위해 게시됩니다.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제1조 (개인정보의 처리목적)
              </h2>
              <p className="mt-3">
                ILU(이하 “사이트”)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를
                보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
                다음과 같이 개인정보 처리지침을 수립·공개합니다.
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6">
                <li>홈페이지 회원 가입 및 관리</li>
                <li>재화 또는 서비스 제공</li>
                <li>고충 처리</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제2조 (개인정보의 처리 및 보유기간)
              </h2>
              <p className="mt-3">
                사이트는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를
                수집 시에 동의받은 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>홈페이지 회원 가입 및 관리: 홈페이지 탈퇴 시까지</li>
                <li>재화 또는 서비스 제공: 공급완료 및 요금결제·정산 완료 시까지</li>
                <li>관련 법령에 따라 보존이 필요한 경우 해당 기간까지 보관</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제3조 (개인정보의 제3자 제공)
              </h2>
              <p className="mt-3">
                사이트는 정보주체의 개인정보를 처리목적 범위 내에서만 처리하며, 정보주체의
                동의 또는 법률에 특별한 규정이 있는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제4조 (개인정보처리의 위탁)
              </h2>
              <p className="mt-3">
                사이트는 원활한 개인정보 업무처리를 위하여 필요한 경우 일부 업무를 외부에
                위탁할 수 있으며, 위탁계약 체결 시 관련 법령에 따라 안전하게 관리되도록
                필요한 사항을 계약서 등에 명시합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제5조 (이용자 및 법정대리인의 권리와 행사 방법)
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
              <p className="mt-3">
                정보주체는 서면, 전화, 전자우편 등을 통하여 위 권리를 행사할 수 있으며,
                사이트는 지체 없이 조치합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제6조 (처리하는 개인정보 항목)
              </h2>
              <p className="mt-3">
                사이트는 회원 가입, 서비스 제공, 문의 처리 과정에서 성명, 연락처, 이메일 등
                서비스 제공에 필요한 최소한의 개인정보를 처리할 수 있습니다.
              </p>
              <p className="mt-3">
                인터넷 서비스 이용 과정에서 IP주소, 쿠키, 접속 기록, 방문 기록 등이 자동으로
                생성되어 수집될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제7조 (개인정보의 파기)
              </h2>
              <p className="mt-3">
                개인정보 보유기간의 경과, 처리목적 달성 등으로 개인정보가 불필요하게 되었을 때에는
                지체 없이 해당 개인정보를 파기합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제8조 (개인정보의 안전성 확보조치)
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>내부관리계획 수립 및 시행</li>
                <li>접근권한 관리 및 보안프로그램 설치</li>
                <li>전산실 및 자료보관실 접근통제</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제9조 (쿠키의 설치·운영 및 거부)
              </h2>
              <p className="mt-3">
                사이트는 맞춤형 서비스 제공을 위해 쿠키를 사용할 수 있습니다. 이용자는
                브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 일부 서비스 이용에 제한이
                있을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제10조 (개인정보 보호책임자)
              </h2>
              <p className="mt-3">
                사이트는 개인정보 처리에 관한 업무를 총괄하고 개인정보 보호 관련 문의,
                불만처리 및 피해구제를 위하여 개인정보 보호책임자를 지정할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제11조 (개인정보 열람청구)
              </h2>
              <p className="mt-3">
                정보주체는 개인정보 보호법에 따른 열람청구를 할 수 있으며, 사이트는 신속하게
                처리되도록 노력합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제12조 (권익침해 구제방법)
              </h2>
              <p className="mt-3">
                정보주체는 개인정보 침해와 관련하여 개인정보침해신고센터, 개인정보분쟁조정위원회,
                대검찰청, 경찰청 등 관계기관에 상담 또는 신고를 할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#0B1F35] md:text-2xl">
                제13조 (시행 및 변경)
              </h2>
              <p className="mt-3">
                본 개인정보처리방침은 2023년 5월 9일부터 적용됩니다.
              </p>
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