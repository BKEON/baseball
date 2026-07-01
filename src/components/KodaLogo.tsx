"use client";
import { KODA_LOGO } from "@/lib/logo";

// 랜딩 페이지용 - 크게, 잘 보이게
export function KodaLogoBig() {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={KODA_LOGO}
        alt="국가데이터처"
        className="w-16 h-16 object-contain"
        style={{ filter: "brightness(0) invert(1)" }}
      />
      <span className="text-white/60 text-xs tracking-widest font-medium">
        국가데이터처
      </span>
    </div>
  );
}

// 다른 페이지용 - 우측 상단 구석에 작게
export function KodaLogoCorner() {
  return (
    <div className="fixed top-3 right-4 z-50 flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity">
      <img
        src={KODA_LOGO}
        alt="국가데이터처"
        className="w-7 h-7 object-contain"
        style={{ filter: "brightness(0) invert(1)" }}
      />
      <span className="text-white/70 text-[10px] tracking-wide hidden sm:block">
        국가데이터처
      </span>
    </div>
  );
}
