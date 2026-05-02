import Link from "next/link";

type SiteFooterProps = {
  leftText: string;
  rightItems: string[];
};

function getFooterHref(item: string): string {
  switch (item) {
    case "공익법인설립":
      return "/public-interest-foundation";
    case "사회적기업설립":
      return "/social-enterprise";
    case "브랜딩서비스":
      return "/branding";
    case "헤리티지오피스":
      return "/heritage-office";
    case "에코피온":
      return "/eco-pion";
    case "에코피온 리더":
      return "/eco-pion#advisor";
    default:
      return "#";
  }
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/90 transition-all duration-300 hover:-translate-y-[1px] hover:border-[#E5C996]/45 hover:bg-white/[0.08] hover:text-[#E5C996]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#E5C996]/0 blur-[10px] transition-all duration-300 group-hover:bg-[#E5C996]/12" />
      <span className="relative z-10">{children}</span>
    </a>
  );
}

export default function SiteFooter({
  leftText: _leftText,
  rightItems,
}: SiteFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#0B1F35]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C996]/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,201,150,0.10),transparent_36%)]" />

      <div className="relative mx-auto max-w-[1600px] px-6 py-12 md:px-10 md:py-14 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <div className="space-y-[2px] leading-tight">
              <div className="text-xl font-bold tracking-[0.02em] text-white md:text-2xl">
                NPO LAP
              </div>
              <div className="text-sm font-medium tracking-[0.04em] text-[#E5C996] md:text-base">
                Legacy Alliance Platform
              </div>
              <div className="text-white/70">ㅡ</div>
              <div className="text-base text-slate-200 md:text-lg">
                자산 및 유산관리 전문 플랫폼
              </div>
            </div>

            <div className="mt-6 space-y-[2px] text-sm leading-tight text-slate-300 md:text-base">
              <div>서울특별시 영등포구 국제금융로 10, Three IFC 43층, 07326</div>
              <div>
                43rd Floor, Three IFC, 10 Gukjegeumyung-ro, Yeongdeungpo-gu,
                Seoul 07326, Korea
              </div>
              <div>대표전화: 02-785-7874</div>
              <div>팩스: 02-6442-2365</div>
              <div>E-mail: npolap@ilukorea.org</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <SocialIcon href="https://www.facebook.com" label="Facebook">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.7v8h2.8Z" />
                </svg>
              </SocialIcon>

              <SocialIcon href="https://www.youtube.com" label="YouTube">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.7 30.7 0 0 0 2 12a30.7 30.7 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.7 30.7 0 0 0 22 12a30.7 30.7 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </SocialIcon>

              <SocialIcon href="https://www.instagram.com" label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.7 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.6A4.4 4.4 0 1 1 7.6 12 4.4 4.4 0 0 1 12 7.6Zm0 1.8A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Z" />
                </svg>
              </SocialIcon>
            </div>

            <div className="mt-8 text-sm text-slate-400 md:text-base">
              © 2002 ILU NPOLAP Organization. All rights reserved
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#E5C996]">
              Sitemap
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {rightItems.map((item: string) => (
                <Link
                  key={item}
                  href={getFooterHref(item)}
                  className="text-base text-slate-300 transition-all duration-300 hover:translate-x-[2px] hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C996]/40"
                >
                  {item}
                </Link>
              ))}

              <Link
                href="/terms"
                className="text-base text-slate-300 transition-all duration-300 hover:translate-x-[2px] hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C996]/40"
              >
                이용약관
              </Link>

              <Link
                href="/privacy-policy"
                className="text-base text-slate-300 transition-all duration-300 hover:translate-x-[2px] hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C996]/40"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}