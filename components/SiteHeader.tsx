"use client";

import Link from "next/link";
import { useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  isLink?: boolean;
};

type SiteHeaderProps = {
  mode?: "main" | "sub";
  logoText?: string;
  logoHref?: string;
  inquiryHref?: string;
  menuItems?: MenuItem[];
};

const defaultMenuItems: MenuItem[] = [
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
    href: "/eco-pion",
    isLink: true,
  },
];

function isHashLink(href: string): boolean {
  return href.startsWith("#");
}

function isExternalLink(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function HeaderMenuLink({
  item,
  onNavigate,
  className,
}: {
  item: MenuItem;
  onNavigate?: () => void;
  className?: string;
}) {
  const handleHashClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHashLink(item.href)) return;

    event.preventDefault();

    const targetId = item.href.replace("#", "");
    const target = document.getElementById(targetId);

    if (target) {
      const headerOffset = 92;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }

    onNavigate?.();
  };

  if (isExternalLink(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {item.label}
      </a>
    );
  }

  if (isHashLink(item.href)) {
    return (
      <a href={item.href} onClick={handleHashClick} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {item.label}
    </Link>
  );
}

export default function SiteHeader({
  mode = "sub",
  logoText = "NPOLAP",
  logoHref = "/heritage-office",
  inquiryHref = "#contact",
  menuItems = defaultMenuItems,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const headerClass =
    mode === "main"
      ? "fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#081A2F]/80 text-white backdrop-blur-xl"
      : "fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#081A2F]/90 text-white backdrop-blur-xl";

  const desktopLinkClass =
    "relative inline-flex items-center text-sm font-semibold text-white/85 transition-colors duration-300 hover:text-[#E5C996]";

  const mobileLinkClass =
    "block rounded-2xl px-4 py-3 text-base font-semibold text-white/90 transition-colors duration-300 hover:bg-white/10 hover:text-[#E5C996]";

  const inquiryClass =
    "inline-flex items-center justify-center rounded-full border border-[#E5C996]/40 bg-[#E5C996]/10 px-5 py-2.5 text-sm font-bold text-[#F3DFB6] transition-all duration-300 hover:-translate-y-[1px] hover:bg-[#E5C996]/20";

  const mobileInquiryClass =
    "mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#E5C996]/40 bg-[#E5C996]/10 px-5 py-3 text-base font-bold text-[#F3DFB6] transition-all duration-300 hover:bg-[#E5C996]/20";

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-12">
        <Link
          href={logoHref}
          onClick={closeMobileMenu}
          className="inline-flex items-center gap-3"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5C996]/40 bg-white/5 text-sm font-black text-[#E5C996]">
            N
          </span>

          <span className="text-base font-black tracking-[-0.03em] text-white md:text-lg">
            {logoText}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {menuItems.map((item) => (
            <HeaderMenuLink
              key={`${item.label}-${item.href}`}
              item={item}
              className={desktopLinkClass}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <HeaderMenuLink
            item={{
              label: "문의하기",
              href: inquiryHref,
              isLink: !isHashLink(inquiryHref),
            }}
            className={inquiryClass}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="메뉴 열기"
          aria-expanded={isOpen}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-[2px] w-5 bg-white transition-all duration-300 ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[2px] w-5 bg-white transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[2px] w-5 bg-white transition-all duration-300 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#081A2F]/98 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:hidden">
          <nav className="mx-auto max-w-[1600px] space-y-1">
            {menuItems.map((item) => (
              <HeaderMenuLink
                key={`mobile-${item.label}-${item.href}`}
                item={item}
                onNavigate={closeMobileMenu}
                className={mobileLinkClass}
              />
            ))}

            <HeaderMenuLink
              item={{
                label: "문의하기",
                href: inquiryHref,
                isLink: !isHashLink(inquiryHref),
              }}
              onNavigate={closeMobileMenu}
              className={mobileInquiryClass}
            />
          </nav>
        </div>
      ) : null}
    </header>
  );
}