import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "공익법인 종합컨설팅 플랫폼",
  description: "공익법인 설립, 브랜딩, 상표등록, 사회적기업 설립 종합 컨설팅",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}