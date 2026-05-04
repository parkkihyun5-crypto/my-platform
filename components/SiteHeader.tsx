"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  isLink?: boolean;
};

type SocialLink = {
  label: string;
  href: string;
};

type SubMenuItem = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  mode?: "home" | "sub";
  logoText?: string;
  logoHref?: string;
  menuItems?: MenuItem[];
  drawerItems?: MenuItem[];
  socialLinks?: SocialLink[];
  inquiryHref?: string;
  phoneHref?: string;
  kakaoHref?: string;
};

const mainMenuItems: MenuItem[] = [
  { label: "공익법인설립", href: "/public-interest-foundation", isLink: true },
  { label: "사회적기업설립", href: "/social-enterprise", isLink: true },
  { label: "브랜딩서비스", href: "/branding", isLink: true },
  { label: "헤리티지오피스", href: "/heritage-office", isLink: true },
];

const ecoMenuItem: MenuItem = {
  label: "에코피온",
  href: "/eco-pion",
  isLink: true,
};

const ecoSubMenuItems: MenuItem[] = [
  {
    label: "에코피온 리더",
    href: "/consultant-profile",
    isLink: true,
  },
  {
    label: "에코피온",
    href: "/eco-pion",
    isLink: true,
  },
];

const pageSubMenuItems: Record<string, SubMenuItem[]> = {
  "/public-interest-foundation": [
    { label: "설립 개요", href: "/public-interest-foundation#foundation-overview" },
    { label: "유형 비교", href: "/public-interest-foundation#foundation-types" },
    { label: "추천 구조", href: "/public-interest-foundation#foundation-structure" },
    { label: "컨설팅 비용", href: "/public-interest-foundation#foundation-cost" },
    { label: "문의하기", href: "/public-interest-foundation#foundation-contact" },
  ],
  "/social-enterprise": [
    { label: "혜택", href: "/social-enterprise#social-benefits" },
    { label: "인증요건", href: "/social-enterprise#social-requirements" },
    { label: "운영요건", href: "/social-enterprise#social-operation" },
    { label: "절차·서류", href: "/social-enterprise#social-process" },
    { label: "비용안내", href: "/social-enterprise#social-cost" },
  ],
  "/branding": [
    { label: "브랜딩 원칙", href: "/branding#branding-principles" },
    { label: "서비스 구성", href: "/branding#branding-services" },
    { label: "패키지 견적", href: "/branding#branding-packages" },
    { label: "옵션 선택", href: "/branding#branding-options" },
    { label: "상표등록", href: "/branding#branding-trademark" },
  ],
  "/heritage-office": [
    { label: "헤리티지 철학", href: "/heritage-office#heritage-philosophy" },
    { label: "명문가문", href: "/heritage-office#heritage-family" },
    { label: "설계 구조", href: "/heritage-office#heritage-structure" },
    { label: "설계 범위", href: "/heritage-office#heritage-scope" },
    { label: "실행 로드맵", href: "/heritage-office#heritage-roadmap" },
  ],
  "/eco-pion": [
    { label: "에코피언리더", href: "/consultant-profile/" },
    { label: "에코피온이란", href: "/eco-pion/#ecopion-intro" },
    { label: "필요한 대상", href: "/eco-pion/#ecopion-target" },
    { label: "전환 구조", href: "/eco-pion/#ecopion-transition" },
    { label: "컨설팅 범위", href: "/eco-pion/#ecopion-consulting" },
    { label: "비공개 상담 신청", href: "/eco-pion/#ecopion-contact" },
  ],
  "/consultant-profile": [
    { label: "에코피언리더", href: "/consultant-profile/" },
    { label: "에코피온이란", href: "/eco-pion/#ecopion-intro" },
    { label: "필요한 대상", href: "/eco-pion/#ecopion-target" },
    { label: "전환 구조", href: "/eco-pion/#ecopion-transition" },
    { label: "컨설팅 범위", href: "/eco-pion/#ecopion-consulting" },
    { label: "비공개 상담 신청", href: "/eco-pion/#ecopion-contact" },
  ],
};

function normalizeHref(label: string, href: string): string {
  if (label === "에코피온 리더") return "/consultant-profile";
  if (label === "에코피온리더") return "/consultant-profile";
  if (label === "에코피온") return "/eco-pion";
  return href;
}

function MenuLink({
  item,
  className,
  onClick,
  children,
}: {
  item: MenuItem;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const href = normalizeHref(item.label, item.href);

  if (href.startsWith("/") || item.isLink) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children ?? item.label}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children ?? item.label}
    </a>
  );
}

function normalizeMenuItems(items: MenuItem[]): MenuItem[] {
  const source = items.length > 0 ? items : mainMenuItems;

  return source
    .filter(
      (item) =>
        item.label !== "에코피온" &&
        item.label !== "에코피온 리더" &&
        item.label !== "에코피온리더"
    )
    .map((item) => ({
      ...item,
      href: normalizeHref(item.label, item.href),
    }));
}

export default function SiteHeader({
  mode = "sub",
  logoText,
  menuItems = [],
  drawerItems = [],
  socialLinks = [],
  inquiryHref = "#contact",
  phoneHref = "tel:02-785-7874",
  kakaoHref = "http://pf.kakao.com/_mIJMX",
}: SiteHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  const desktopMainMenuItems = useMemo(() => {
    return normalizeMenuItems(menuItems);
  }, [menuItems]);

  const mobileMenuItems = useMemo(() => {
    const source = drawerItems.length > 0 ? drawerItems : desktopMainMenuItems;
    const normalized = normalizeMenuItems(source);

    return [
      ...normalized,
      {
        ...ecoMenuItem,
        label: "에코피온 메인",
      },
      ...ecoSubMenuItems,
    ];
  }, [drawerItems, desktopMainMenuItems]);

  const ecoDesktopSubMenuItems = pageSubMenuItems["/eco-pion"];

  useEffect(() => {
    let ticking = false;

    function updateHeaderState() {
      const isMobile = window.innerWidth < 768;
      const nextScrolled = window.scrollY > (isMobile ? 42 : 10);

      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      ticking = false;
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeaderState);
    }

    function handleResize() {
      if (window.innerWidth >= 1280) {
        setDrawerOpen(false);
      }

      updateHeaderState();
    }

    updateHeaderState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      return;
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [drawerOpen]);

  const currentLogoSrc = scrolled ? "/images/logo-dark.png" : "/images/logo-white.png";
  const mobileLogoSrc = "/images/logo-white.png";

  const headerShellClass = `site-header-shell fixed inset-x-0 top-0 z-50 overflow-visible transition-all duration-700 ${
    scrolled
      ? "border-b border-slate-200/75 bg-white/88 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
      : "bg-[#081A2F]/22 backdrop-blur-[2px]"
  }`;

  const headerInnerClass = `mx-auto max-w-[1600px] overflow-visible px-5 transition-all duration-700 md:px-10 lg:px-12 ${
    scrolled ? "py-3 md:py-4" : "py-4 md:py-5"
  }`;

  const desktopNavClass = "relative hidden items-center justify-center gap-10 overflow-visible xl:flex";

  const desktopMenuClass = `group relative inline-flex items-center rounded-full px-0 py-2 text-sm font-semibold tracking-[-0.01em] transition-all duration-300 md:text-[15px] ${
    scrolled
      ? "text-[#0B1F35]/82 hover:text-[#B89B5E] focus-visible:text-[#B89B5E]"
      : "text-white/94 hover:text-[#D6BD7F] focus-visible:text-[#D6BD7F]"
  }`;

  const desktopMenuUnderlineClass =
    "pointer-events-none absolute -bottom-[5px] left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#E5C996] transition-all duration-300 ease-out group-hover:w-full";

  const ecoTopLinkClass = `relative inline-flex items-center rounded-full px-0 py-2 text-sm font-semibold tracking-[-0.01em] transition-all duration-300 md:text-[15px] ${
    scrolled
      ? "text-[#0B1F35]/82 hover:text-[#B89B5E] focus-visible:text-[#B89B5E]"
      : "text-white/94 hover:text-[#D6BD7F] focus-visible:text-[#D6BD7F]"
  }`;

  const ecoSubLinkClass = `block whitespace-nowrap py-1.5 text-sm font-semibold tracking-[-0.02em] transition-all duration-300 ${
    scrolled
      ? "text-[#0B1F35]/76 hover:text-[#B89B5E]"
      : "text-white/90 hover:text-[#E5C996]"
  }`;

  const actionButtonClass = `hidden items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 md:inline-flex ${
    scrolled
      ? "border border-[#E5C996]/35 bg-[#E5C996] text-[#0B1F35] shadow-[0_10px_30px_rgba(229,201,150,0.18)] hover:-translate-y-[1px] hover:bg-[#E5C996] hover:shadow-[0_18px_45px_rgba(229,201,150,0.28)] active:translate-y-0"
      : "border border-white/18 bg-white/10 text-white backdrop-blur-md hover:-translate-y-[1px] hover:border-[#E5C996]/30 hover:bg-white/14 hover:text-[#FFF3D7]"
  }`;

  const menuButtonClass = `inline-flex items-center justify-center rounded-full transition-all duration-300 xl:hidden ${
    mode === "home" ? "h-10 w-10 md:h-11 md:w-11" : "h-10 w-10"
  } ${
    scrolled
      ? "border border-slate-300/85 bg-white text-[#0B1F35] shadow-sm hover:-translate-y-[1px] hover:bg-slate-50"
      : "border border-white/18 bg-white/8 text-white backdrop-blur-md hover:-translate-y-[1px] hover:bg-white/14"
  }`;

  const drawerOverlayClass = `fixed inset-0 z-[60] bg-[#020617]/55 transition-all duration-500 ${
    drawerOpen
      ? "pointer-events-auto opacity-100 backdrop-blur-[3px]"
      : "pointer-events-none opacity-0"
  }`;

  const drawerPanelClass = `fixed right-0 top-0 z-[70] flex h-screen w-[88%] max-w-[400px] flex-col border-l border-white/10 bg-[#0B1F35]/95 p-6 text-white shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl transition-all duration-500 ease-out ${
    drawerOpen ? "translate-x-0" : "translate-x-full"
  }`;

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .site-header-shell {
          --header-submenu-text: rgba(255, 255, 255, 0.88);
          --header-submenu-hover-bg: rgba(255, 255, 255, 0.06);
          --header-open-bg: rgba(8, 26, 47, 0.78);
          --header-open-shadow: 0 18px 48px rgba(2, 6, 23, 0.24);
          padding-bottom: 0;
        }

        .site-header-shell[data-scrolled="true"] {
          --header-submenu-text: rgba(11, 31, 53, 0.78);
          --header-submenu-hover-bg: rgba(184, 155, 94, 0.08);
          --header-open-bg: rgba(255, 255, 255, 0.94);
          --header-open-shadow: 0 18px 48px rgba(15, 23, 42, 0.1);
        }

        @media (min-width: 1280px) {
          .site-header-shell:hover,
          .site-header-shell:focus-within {
            background: var(--header-open-bg);
            box-shadow: var(--header-open-shadow);
            backdrop-filter: blur(12px);
            padding-bottom: 204px;
          }
        }

        .eco-dropdown-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .nav-dropdown-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .nav-dropdown-wrap::after,
        .eco-dropdown-wrap::after {
          content: "";
          position: absolute;
          left: -14px;
          right: -14px;
          top: 100%;
          height: 18px;
        }

        .eco-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          right: auto;
          width: 184px;
          min-width: 184px;
          max-width: min(280px, calc(100vw - 32px));
          transform: translateX(-50%) translateY(-8px);
          padding: 6px 14px;
          text-align: center;
          white-space: nowrap;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          backdrop-filter: none;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 240ms ease,
            transform 240ms ease,
            visibility 240ms ease;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          right: auto;
          width: 184px;
          min-width: 184px;
          max-width: min(280px, calc(100vw - 32px));
          transform: translateX(-50%) translateY(-8px);
          padding: 6px 14px;
          text-align: center;
          white-space: nowrap;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
          backdrop-filter: none;
          z-index: 100;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 240ms ease,
            transform 240ms ease,
            visibility 240ms ease;
        }

        .site-header-shell:hover .nav-dropdown-menu,
        .site-header-shell:focus-within .nav-dropdown-menu,
        .site-header-shell:hover .eco-dropdown-menu,
        .site-header-shell:focus-within .eco-dropdown-menu {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }

        .nav-dropdown-menu a,
        .eco-dropdown-menu a {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 4px 12px;
          text-align: center;
          color: var(--header-submenu-text);
          border-radius: 8px;
          transition:
            color 200ms ease,
            background-color 200ms ease;
        }

        .nav-dropdown-menu a:hover,
        .nav-dropdown-menu a:focus-visible,
        .eco-dropdown-menu a:hover,
        .eco-dropdown-menu a:focus-visible {
          color: #d6bd7f;
          background: var(--header-submenu-hover-bg);
        }
      `}</style>

      <header className={headerShellClass} data-scrolled={scrolled ? "true" : "false"}>
        <div className={headerInnerClass}>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-8">
            <Link
              href="/heritage-office"
              className="relative flex shrink-0 items-center transition hover:opacity-90"
              aria-label={logoText || "홈으로 이동"}
            >
              <Image
                src={currentLogoSrc}
                alt={logoText || "Site Logo"}
                width={160}
                height={44}
                priority
                className={`w-auto transition-all duration-700 ${
                  scrolled ? "h-[26px] md:h-[30px]" : "h-[28px] md:h-[32px]"
                }`}
              />
            </Link>

            <nav className={desktopNavClass}>
              {desktopMainMenuItems.map((item) => {
                const submenu = pageSubMenuItems[normalizeHref(item.label, item.href)] ?? [];

                return (
                  <div
                    key={`desktop-${item.label}-${item.href}`}
                    className="nav-dropdown-wrap"
                  >
                    <MenuLink item={item} className={desktopMenuClass}>
                      <>
                        <span>{item.label}</span>
                        <span className={desktopMenuUnderlineClass} />
                      </>
                    </MenuLink>

                    {submenu.length > 0 ? (
                      <div className="nav-dropdown-menu">
                        {submenu.slice(0, 5).map((subItem) => (
                          <Link
                            key={`desktop-sub-${subItem.href}`}
                            href={subItem.href}
                            className={ecoSubLinkClass}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <div className="eco-dropdown-wrap">
                <MenuLink item={ecoMenuItem} className={ecoTopLinkClass}>
                  <>
                    <span>{ecoMenuItem.label}</span>
                    <span className={desktopMenuUnderlineClass} />
                  </>
                </MenuLink>

                {ecoDesktopSubMenuItems.length > 0 ? (
                  <div className="eco-dropdown-menu">
                    {ecoDesktopSubMenuItems.map((item) => (
                      <Link
                        key={`eco-sub-${item.href}`}
                        href={item.href}
                        className={ecoSubLinkClass}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
              <a href={inquiryHref} className={actionButtonClass}>
                문의하기
              </a>

              <button
                type="button"
                aria-label="메뉴 열기"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className={menuButtonClass}
              >
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span
                    className={`absolute block h-[1.5px] w-5 rounded-full transition-all duration-300 ${
                      drawerOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px]"
                    } ${scrolled ? "bg-[#0B1F35]" : "bg-white"}`}
                  />
                  <span
                    className={`absolute block h-[1.5px] w-5 rounded-full transition-all duration-300 ${
                      drawerOpen ? "opacity-0" : "opacity-100"
                    } ${scrolled ? "bg-[#0B1F35]" : "bg-white"}`}
                  />
                  <span
                    className={`absolute block h-[1.5px] w-5 rounded-full transition-all duration-300 ${
                      drawerOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
                    } ${scrolled ? "bg-[#0B1F35]" : "bg-white"}`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={drawerOverlayClass} onClick={() => setDrawerOpen(false)} />

      <aside className={drawerPanelClass}>
        <div className="flex items-center justify-between">
          <Link
            href="/heritage-office"
            className="flex items-center transition hover:opacity-90"
            onClick={() => setDrawerOpen(false)}
            aria-label={logoText || "홈으로 이동"}
          >
            <Image
              src={mobileLogoSrc}
              alt={logoText || "Site Logo"}
              width={160}
              height={44}
              className="h-[28px] w-auto"
            />
          </Link>

          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setDrawerOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition duration-300 hover:bg-white/12"
          >
            ✕
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {mobileMenuItems.map((item, index) => (
            <MenuLink
              key={`drawer-${index}-${item.label}-${item.href}`}
              item={item}
              onClick={() => setDrawerOpen(false)}
              className={`group rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-lg font-semibold tracking-[-0.01em] text-white/92 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] hover:pl-5 hover:text-white ${
                ecoSubMenuItems.some((sub) => sub.label === item.label && sub.href === item.href)
                  ? "ml-4 text-base text-[#E5C996]"
                  : ""
              }`}
            >
              {item.label === "에코피온 메인" ? "에코피온" : item.label}
            </MenuLink>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          <a
            href={inquiryHref}
            onClick={() => setDrawerOpen(false)}
            className="rounded-[22px] border border-[#E5C996]/30 bg-[#E5C996] px-4 py-4 text-center text-base font-bold text-[#0B1F35] transition-all duration-300 hover:bg-[#F1D9A5]"
          >
            문의하기
          </a>

          <a
            href={phoneHref}
            className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-base font-semibold text-white/90 transition-all duration-300 hover:bg-white/[0.08]"
          >
            전화상담
          </a>

          <a
            href={kakaoHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-center text-base font-semibold text-white/90 transition-all duration-300 hover:bg-white/[0.08]"
          >
            카카오 상담
          </a>
        </div>

        {socialLinks.length > 0 ? (
          <div className="mt-auto pt-10">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
              Social
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={`social-${item.label}-${item.href}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
