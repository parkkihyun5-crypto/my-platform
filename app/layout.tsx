import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://npolap.cloud"),
  title: "공익법인 종합컨설팅 플랫폼",
  description:
    "헤리티지 자산 설계 플랫폼 + 공익 구조 설계 + 브랜딩 + 상표 + 컨설팅 통합 시스템",
  openGraph: {
    title: "공익법인 종합컨설팅 플랫폼",
    description:
      "헤리티지 자산 설계 플랫폼 + 공익 구조 설계 + 브랜딩 + 상표 + 컨설팅 통합 시스템",
    url: "https://npolap.cloud",
    siteName: "NPOLAP",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "공익법인 종합컨설팅 플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "공익법인 종합컨설팅 플랫폼",
    description:
      "헤리티지 자산 설계 플랫폼 + 공익 구조 설계 + 브랜딩 + 상표 + 컨설팅 통합 시스템",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}