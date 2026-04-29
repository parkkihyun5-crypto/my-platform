"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  isLink?: boolean;
};

type SocialLink = {
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

function getDisplayLabel(label: string): string {
  if (label === "대표 컨설턴트") return "에코피언";
  return label;
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
  if (item.isLink || item.href.startsWith("/")) {
    return (
      <Link href={item.href} className={className} onClick={onClick}>
        {children ?? getDisplayLabel(item.label)}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className} onClick={onClick}>
      {children ?? getDisplayLabel(item.label)}
    </a>
  );
}

export default function SiteHeader({
  mode = "sub",
  logoText = "NPOLAP",
  logoHref = "/heritage-office",
  menuItems = [],
  drawerItems = [],
  socialLinks = [],
  inquiryHref = "#contact",
  phoneHref = "tel:02-785-7874",
  kakaoHref = "http://pf.kakao.com/_mIJMX",
}: SiteHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    function updateHeaderState() {
      const isMobile = window.innerWidth < 768;
      const nextScrolled = window.scrollY > (isMobile ? 42 : 10);

      setScrolled((prev: boolean) =>
        prev === nextScrolled ? prev : nextScrolled
      );

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

  const activeMenuItems = mode === "home" ? drawerItems : menuItems;

  const currentLogoSrc = scrolled
    ? "/images/logo-dark.png"
    : "/images/logo-white.png";

  const mobileLogoSrc = "/images/logo-white.png";

  const headerShellClass = `fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
    scrolled
      ? "border-b border-slate-200/75 bg-white/88 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
      : "bg-transparent"
  }`;

  const headerInnerClass = `mx-auto max-w-[1600px] px-5 transition-all duration-700 md:px-10 lg:px-12 ${
    scrolled ? "py-3 md:py-4" : "py-4 md:py-5"
  }`;

  const desktopNavClass = "hidden items-center gap-7 xl:flex";

  const desktopMenuClass = `group relative inline-flex items-center rounded-full px-[2px] py-[2px] text-sm font-medium tracking-[0.02em] transition-all duration-300 md:text-[15px] ${
    scrolled
      ? "text-[#0B1F35]/80 hover:text-[#0B1F35]"
      : "text-white/88 hover:text-white"
  }`;

  const desktopMenuUnderlineClass =
    "pointer-events-none absolute -bottom-[9px] left-1/2 h-[1.5px] w-0 -translate-x-1/2 rounded-full bg-[#E5C996] transition-all duration-300 ease-out group-hover:w-[calc(100%-8px)]";

  const actionButtonClass = `hidden items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 md:inline-flex ${
    scrolled
      ? "border border-[#E5C996]/35 bg-[#E5C996] text-[#0B1F35] shadow-[0_10px_30px_rgba(229,201,150,0.18)] hover:-translate-y-[1px] hover:bg-[#E5C996] hover:shadow-[0_18px_45px_rgba(229,201,150,0.28)] active:translate-y-0"
      : "border border-white/18 bg-white/10 text-white backdrop-blur-md hover:-translate-y-[1px] hover:border-[#E5C996]/30 hover:bg-white/14 hover:text-[#FFF3D7]"
  }`;

  const menuButtonClass = `inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 xl:hidden ${
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
      <header className={headerShellClass}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C996]/0 to-transparent transition-all duration-700">
          <span
            className={`absolute inset-0 block transition-all duration-700 ${
              scrolled
                ? "bg-gradient-to-r from-transparent via-[#E5C996]/35 to-transparent"
                : ""
            }`}
          />
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-20 transition-all duration-700 ${
            scrolled
              ? "bg-transparent"
              : "bg-gradient-to-b from-transparent via-[#081A2F]/10 to-[#081A2F]/32"
          }`}
        />

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-full transition-all duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,rgba(229,201,150,0.08),transparent_34%)]" />
        </div>

        <div className={headerInnerClass}>
          <div className="flex items-center justify-between">
            <Link
              href={logoHref}
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
              {activeMenuItems.map((item: MenuItem) => (
                <MenuLink
                  key={item.label}
                  item={item}
                  className={desktopMenuClass}
                >
                  <>
                    <span>{getDisplayLabel(item.label)}</span>
                    <span className={desktopMenuUnderlineClass} />
                  </>
                </MenuLink>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
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
                      drawerOpen
                        ? "translate-y-0 rotate-45"
                        : "-translate-y-[5px]"
                    } ${scrolled ? "bg-[#0B1F35]" : "bg-white"}`}
                  />
                  <span
                    className={`absolute block h-[1.5px] w-5 rounded-full transition-all duration-300 ${
                      drawerOpen ? "opacity-0" : "opacity-100"
                    } ${scrolled ? "bg-[#0B1F35]" : "bg-white"}`}
                  />
                  <span
                    className={`absolute block h-[1.5px] w-5 rounded-full transition-all duration-300 ${
                      drawerOpen
                        ? "translate-y-0 -rotate-45"
                        : "translate-y-[5px]"
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
            href={logoHref}
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
          {activeMenuItems.map((item: MenuItem) => (
            <MenuLink
              key={item.label}
              item={item}
              onClick={() => setDrawerOpen(false)}
              className="group rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-lg font-semibold tracking-[0.01em] text-white/92 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] hover:pl-5 hover:text-white"
            >
              {getDisplayLabel(item.label)}
            </MenuLink>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          <a
            href={kakaoHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-[#E5C996]/25 bg-[#E5C996] px-4 py-3 text-sm font-semibold text-[#0B1F35] shadow-[0_10px_30px_rgba(229,201,150,0.16)] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_42px_rgba(229,201,150,0.26)]"
          >
            카카오톡 상담
          </a>

          <a
            href={inquiryHref}
            onClick={() => setDrawerOpen(false)}
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/10"
          >
            문의하기
          </a>

          <a
            href={phoneHref}
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/10"
          >
            전화상담 02-785-7874
          </a>
        </div>

        {socialLinks.length > 0 ? (
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#E5C996]">
              Social
            </div>

            <div className="flex flex-col gap-3">
              {socialLinks.map((item: SocialLink) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-white/75 transition-all duration-300 hover:translate-x-[2px] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#E5C996]">
            NPO LAP
          </div>
          <div className="mt-3 text-sm leading-7 text-white/65">
            Legacy Alliance Platform
            <br />
            자산 및 유산관리 전문 플랫폼
          </div>
        </div>
      </aside>
    </>
  );
}