"use client";
import { KODA_LOGO_VERTICAL, KODA_LOGO_HORIZONTAL } from "@/lib/logo";

// 랜딩 페이지용 - 세로형 로고, 크게
export function KodaLogoBig() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-2xl px-5 py-3"
        style={{ background: "rgba(255,255,255,0.92)" }}
      >
        <img
          src={KODA_LOGO_VERTICAL}
          alt="국가데이터처"
          className="w-20 h-auto object-contain"
        />
      </div>
    </div>
  );
}

// 다른 페이지용 - 가로형 로고, 우측 상단 구석에 작게
export function KodaLogoCorner() {
  return (
    <div className="fixed top-3 right-3 z-50">
      <div
        className="rounded-xl px-2.5 py-1.5"
        style={{ background: "rgba(255,255,255,0.88)" }}
      >
        <img
          src={KODA_LOGO_HORIZONTAL}
          alt="국가데이터처"
          className="h-6 w-auto object-contain"
        />
      </div>
    </div>
  );
}
