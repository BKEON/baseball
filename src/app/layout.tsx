import type { Metadata } from "next";
import { Bebas_Neue, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const notoSansKr = Noto_Sans_KR({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "내 직관 유형 테스트 | 한화생명 볼파크",
  description: "5문항으로 알아보는 나만의 야구장 관람 스타일",
  openGraph: {
    title: "내 직관 유형 테스트 | 한화생명 볼파크",
    description: "5문항으로 알아보는 나만의 야구장 관람 스타일",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${bebasNeue.variable} ${notoSansKr.variable} font-body bg-hw-dark text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
