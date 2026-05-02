import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://npolap.cloud"),
  title: "NPOLAP | 공익유산플랫폼",
  description:
    "공익법인설립, 자산보존, 가문전략, 공익유산, 국제협력의 새로운 플랫폼",
  openGraph: {
    title: "NPOLAP | 공익유산플랫폼",
    description:
      "공익법인설립, 자산보존, 가문전략, 공익유산, 국제협력의 새로운 플랫폼",
    url: "https://npolap.cloud",
    siteName: "NPOLAP 공익유산플랫폼",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NPOLAP 공익유산플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NPOLAP | 공익유산플랫폼",
    description:
      "공익법인설립, 자산보존, 가문전략, 공익유산, 국제협력의 새로운 플랫폼",
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