"use client";
import { KODA_LOGO_VERTICAL, KODA_LOGO_HORIZONTAL } from "@/lib/logo";

// 랜딩 페이지용 - 세로형 흰색 원본
export function KodaLogoBig() {
  return (
    <div className="flex flex-col items-center">
      <img
        src={KODA_LOGO_VERTICAL}
        alt="국가데이터처"
        className="w-24 h-auto object-contain"
      />
    </div>
  );
}

// 다른 페이지용 - 가로형 흰색 원본, 우측 상단 구석
export function KodaLogoCorner() {
  return (
    <div className="fixed top-3 right-3 z-50 opacity-70 hover:opacity-100 transition-opacity">
      <img
        src={KODA_LOGO_HORIZONTAL}
        alt="국가데이터처"
        className="h-7 w-auto object-contain"
      />
    </div>
  );
}
