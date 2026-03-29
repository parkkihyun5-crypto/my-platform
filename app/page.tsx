"use client";

import React, { useState, useEffect, useMemo } from "react";

// --- 데이터 설정 (초보자도 수정하기 쉽게 상단에 배치) ---

const defaultContent = {
  siteName: "공익법인 종합컨설팅 플랫폼",
  siteSubtitle: "설립 · 운영 · 브랜딩 · 홈페이지까지 한 번에",
  heroBadge: "International Leaders Union Consulting & Branding",
  heroTitle: "공익법인 설립과 브랜드 구축을 동시에 완성하는 통합 플랫폼",
  heroDescription: "사단법인·재단법인·공익법인 설립 검토부터 정관 설계, 실무 운영 체계, 브랜딩 로고 서비스, 홈페이지 제작까지 실전 중심으로 연결하는 고급형 컨설팅 플랫폼입니다.",
  primaryCta: "설립유형 검토 보기",
  secondaryCta: "브랜딩 서비스 보기",
  topMenu1: "공익법인설립 메뉴",
  topMenu2: "브랜딩 서비스 메뉴",
  topMenu3: "상표등록 메뉴",
  consultingTitle: "공익법인 종합컨설팅 서비스",
  consultingDescription: "법인 설립 준비 단계부터 운영 안정화, 공신력 확보, 대외 브랜드 구축까지 전체 흐름을 구조적으로 설계합니다.",
  establishmentTitle: "비영리·비영리법인 설립 유형별 검토사항",
  establishmentDescription: "설립 목적, 자산 규모, 운영 구조, 공신력 수준에 따라 적합한 법인 유형을 비교하고 바로 컨설팅 상품을 선택할 수 있습니다.",
  brandingTitle: "브랜딩 로고 서비스",
  brandingDescription: "기관의 신뢰를 높이는 CI·BI 패키지와 추가 옵션을 선택하고 실시간 견적을 확인할 수 있습니다.",
  paymentTitle: "입금 안내",
  paymentDescription: "상담 또는 계약 확정 후 아래 계좌로 입금하시면 확인 절차를 진행합니다. 입금 전 최종 견적과 업무 범위를 반드시 확인해 주세요.",
  contactTitle: "상담 신청",
  contactDescription: "설립 유형 검토와 브랜딩 서비스 선택 결과를 함께 접수하여 통합 상담을 진행합니다.",
  footerText: "© International Leaders Union. All rights reserved.",
  phone: "010-0000-0000",
  email: "contact@npolap.cloud",
  bankName: "우리은행",
  bankAccount: "1005-404-403203",
  bankHolder: "국제지도자연합",
  // 테마 색상
  primary: "#0B1F35",
  secondary: "#143F67",
  accent: "#C8A86B",
  bodyBg: "#F5F7FB",
  cardBg: "#FFFFFF",
  textColor: "#0F172A",
};

const establishmentTypes = [
  {
    id: "voluntary",
    name: "비영리 임의단체",
    legal: "자율적 모임",
    procedure: "세무서 신고",
    difficulty: "매우 쉬움",
    period: "1~3일",
    budget: "30~50만",
    summary: "빠르게 출발할 수 있지만 공신력과 제도적 확장성은 제한적입니다.",
    details: [
      ["조직 구조", "대표 중심"],
      ["사업 범위", "친목·활동 중심"],
      ["기부금 영수증", "불가"],
    ],
  },
  {
    id: "association",
    name: "사단법인(비영리)",
    legal: "회원 기반 법인",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "어려움",
    period: "3~6개월",
    budget: "200~300만",
    summary: "공익성과 회원 구조를 갖춘 가장 표준적인 비영리법인 모델입니다.",
    details: [
      ["조직 구조", "회원·총회 중심"],
      ["사업 범위", "공익·협력 사업"],
      ["기부금 영수증", "지정 시 가능"],
    ],
  },
  {
    id: "foundation",
    name: "재단법인(비영리)",
    legal: "자산 기반 법인",
    procedure: "주무관청 허가 + 법원 등기",
    difficulty: "매우 어려움",
    period: "6개월~1년",
    budget: "300~500만",
    summary: "충분한 출연재산과 장기적 재단사업 구조가 있을 때 적합합니다.",
    details: [
      ["조직 구조", "이사회 중심"],
      ["사업 범위", "연구·장학·재단사업"],
      ["기부금 영수증", "지정 시 가능"],
    ],
  },
  {
    id: "public-benefit",
    name: "공익법인(지정)",
    legal: "정부 인증 공익기관",
    procedure: "법인 설립 후 국세청 지정",
    difficulty: "최고 수준",
    period: "법인 설립 후 추가 3개월",
    budget: "300~700만",
    summary: "공신력이 가장 높지만 관리 기준과 공익성 요건이 매우 엄격합니다.",
    details: [
      ["조직 구조", "공익 거버넌스"],
      ["사업 범위", "사회 공헌 및 정책 협력"],
      ["기부금 영수증", "가능(세제 혜택)"],
    ],
  },
];

const establishmentPackages = [
  { id: "ngo-basic", name: "임의단체 설립 패키지", price: 500000, desc: "간편 신고와 기본 운영 구조 설계" },
  { id: "association-pro", name: "사단법인 설립 패키지", price: 3000000, desc: "정관 설계, 허가 서류, 실사 대응 포함", popular: true },
  { id: "foundation-premium", name: "재단법인 설립 패키지", price: 7000000, desc: "출연재산 구조, 이사회 설계 포함" },
  { id: "public-benefit-signature", name: "공익법인 지정 패키지", price: 12000000, desc: "공익성 구조, 세제 요건 지정 전략 포함" },
];

const brandingPackages = [
  { id: "starter", name: "STARTER", price: 1500000, desc: "로고 중심의 기본형 브랜딩" },
  { id: "standard", name: "STANDARD", price: 3000000, desc: "로고와 컬러 시스템 포함 표준형" },
  { id: "premium", name: "PREMIUM", price: 8000000, desc: "전략형 CI·BI 설계와 응용 시스템", popular: true },
  { id: "signature", name: "SIGNATURE", price: 20000000, desc: "국제기관 수준의 아이덴티티 체계" },
];

const brandingAddons = [
  { id: "naming", label: "네이밍 개발", price: 2000000 },
  { id: "slogan", label: "슬로건 개발", price: 1000000 },
  { id: "ppt", label: "PPT 템플릿", price: 1000000 },
  { id: "website", label: "홈페이지 UI 설계", price: 5000000 },
];

// --- 유틸리티 함수 ---

function formatKRW(value) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// --- 컴포넌트 ---

export default function HomePage() {
  const [selectedEstablishment, setSelectedEstablishment] = useState("association");
  const [selectedEstPackage, setSelectedEstPackage] = useState("association-pro");
  const [selectedBrandingPackage, setSelectedBrandingPackage] = useState("premium");
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isVat, setIsVat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 견적 계산
  const estPrice = establishmentPackages.find(p => p.id === selectedEstPackage)?.price || 0;
  const brandPrice = brandingPackages.find(p => p.id === selectedBrandingPackage)?.price || 0;
  const addonPrice = selectedAddons.reduce((sum, id) => sum + (brandingAddons.find(a => a.id === id)?.price || 0), 0);
  const subtotal = estPrice + brandPrice + addonPrice;
  const total = isVat ? Math.round(subtotal * 1.1) : subtotal;

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900" style={{ backgroundColor: defaultContent.bodyBg }}>
      
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight" style={{ color: defaultContent.primary }}>{defaultContent.siteName}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{defaultContent.siteSubtitle}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#establishment" className="hover:text-slate-900 transition-colors">{defaultContent.topMenu1}</a>
            <a href="#branding" className="hover:text-slate-900 transition-colors">{defaultContent.topMenu2}</a>
            <a href="#trademark" className="hover:text-slate-900 transition-colors">{defaultContent.topMenu3}</a>
            <button className="px-5 py-2.5 rounded-full text-white text-xs font-bold transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: defaultContent.primary }}>
              관리자 로그인
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* 히어로 섹션 */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(135deg, ${defaultContent.primary} 0%, ${defaultContent.secondary} 100%)` }}></div>
          <div className="max-w-7xl mx-auto px-6 text-center text-white">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-8 backdrop-blur-sm">
              {defaultContent.heroBadge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-[1.15]">
              {defaultContent.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              {defaultContent.heroDescription}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#establishment" className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold shadow-xl hover:-translate-y-1 transition-all">
                {defaultContent.primaryCta}
              </a>
              <a href="#branding" className="px-8 py-4 rounded-xl bg-transparent border border-white/30 text-white font-bold hover:bg-white/10 transition-all">
                {defaultContent.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        {/* 상표 검색 섹션 (KIPRIS 연동 UI) */}
        <section id="trademark" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">특허청 KIPRIS 실시간 상표 검색</h2>
            <p className="text-slate-500 mb-10">등록하고자 하는 상표가 이미 존재하는지 실시간으로 확인하세요.</p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="검색할 상표명을 입력하세요 (예: 국제지도자연합)"
                className="w-full px-8 py-6 rounded-2xl border-2 border-slate-100 bg-slate-50 text-lg focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute right-3 top-3 bottom-3 px-8 rounded-xl text-white font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: defaultContent.primary }}
                onClick={() => window.open(`https://www.kipris.or.kr/k3/search/search.do?searchQuery=${searchQuery}`, '_blank')}
              >
                검색하기
              </button>
            </div>
            <div className="mt-6 flex justify-center gap-6 text-sm text-slate-400">
              <span>#상표등록</span> <span>#KIPRIS연동</span> <span>#실시간조회</span>
            </div>
          </div>
        </section>

        {/* 설립 유형 비교 섹션 */}
        <section id="establishment" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{defaultContent.establishmentTitle}</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">{defaultContent.establishmentDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {establishmentTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setSelectedEstablishment(type.id)}
                  className={`cursor-pointer p-8 rounded-[32px] border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    selectedEstablishment === type.id ? 'border-blue-500 bg-white shadow-xl' : 'border-transparent bg-white/50'
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{type.name}</h3>
                  <div className="text-xs font-bold text-blue-600 mb-4 uppercase tracking-wider">{type.legal}</div>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{type.summary}</p>
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">절차</span>
                      <span className="font-semibold">{type.procedure}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">난이도</span>
                      <span className="font-semibold">{type.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">예상기간</span>
                      <span className="font-semibold">{type.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 브랜딩 패키지 & 견적 섹션 */}
        <section id="branding" className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              
              {/* 왼쪽: 패키지 선택 */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-4">{defaultContent.brandingTitle}</h2>
                <p className="text-slate-400 mb-12">{defaultContent.brandingDescription}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {brandingPackages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      onClick={() => setSelectedBrandingPackage(pkg.id)}
                      className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        selectedBrandingPackage === pkg.id ? 'border-amber-500 bg-white/10' : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      {pkg.popular && <span className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded">POPULAR</span>}
                      <h4 className="font-bold text-lg mb-1">{pkg.name}</h4>
                      <p className="text-xs text-slate-400 mb-4">{pkg.desc}</p>
                      <div className="text-xl font-bold text-amber-500">{formatKRW(pkg.price)}</div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-6">추가 옵션 선택</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brandingAddons.map((addon) => (
                    <div 
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`cursor-pointer p-4 rounded-xl border text-center transition-all ${
                        selectedAddons.includes(addon.id) ? 'border-amber-500 bg-amber-500 text-black font-bold' : 'border-white/10 hover:bg-white/5 text-slate-400'
                      }`}
                    >
                      <div className="text-xs mb-1">{addon.label}</div>
                      <div className="text-[10px] opacity-80">+{formatKRW(addon.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 통합 견적 요약 */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 p-8 rounded-3xl bg-white text-slate-900 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-slate-100">통합 견적 요약</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">설립 컨설팅</span>
                      <span className="font-bold">{formatKRW(estPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">브랜딩 패키지</span>
                      <span className="font-bold">{formatKRW(brandPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">추가 옵션 ({selectedAddons.length})</span>
                      <span className="font-bold">{formatKRW(addonPrice)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium">부가세(10%) 포함</span>
                    <button 
                      onClick={() => setIsVat(!isVat)}
                      className={`w-12 h-6 rounded-full transition-all relative ${isVat ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVat ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="mb-8">
                    <div className="text-xs text-slate-400 mb-1">최종 예상 견적</div>
                    <div className="text-4xl font-black text-blue-600 tracking-tight">{formatKRW(total)}</div>
                  </div>

                  <button className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg mb-4">
                    상담 신청하기
                  </button>
                  <button className="w-full py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">
                    비용안내서 PDF 받아보기
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 상담 신청 폼 */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{defaultContent.contactTitle}</h2>
              <p className="text-slate-500">{defaultContent.contactDescription}</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">기관/단체명</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" placeholder="예: 국제지도자연합" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">담당자 성함</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" placeholder="홍길동" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">연락처</label>
                  <input type="text" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">이메일</label>
                  <input type="email" className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all" placeholder="example@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">문의 내용</label>
                <textarea className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all h-32" placeholder="설립 목적이나 궁금하신 점을 자유롭게 적어주세요."></textarea>
              </div>
              <button className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:brightness-110 transition-all" style={{ backgroundColor: defaultContent.primary }}>
                통합 상담 신청 접수
              </button>
            </form>
          </div>
        </section>

        {/* 입금 안내 섹션 */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 p-12 rounded-[40px] bg-white shadow-sm border border-slate-100">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">{defaultContent.paymentTitle}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{defaultContent.paymentDescription}</p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-sm text-slate-400 mb-2">{defaultContent.bankName}</div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{defaultContent.bankAccount}</div>
                <div className="text-lg font-bold text-slate-600">예금주: {defaultContent.bankHolder}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-bold text-slate-900 mb-2">{defaultContent.siteName}</div>
            <div className="text-xs text-slate-400">{defaultContent.footerText}</div>
          </div>
          <div className="flex gap-8 text-xs font-medium text-slate-500">
            <span>T. {defaultContent.phone}</span>
            <span>E. {defaultContent.email}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
