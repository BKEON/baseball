"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RESULT_INFO } from "@/lib/quiz";
import type { ResultType, ResultInfo } from "@/types";
import { KodaLogoCorner } from "@/components/KodaLogo";

const displayNames: Record<string, string> = {
  열정응원러: "열정응원형", 잔디감성형: "가족피크닉형",
  가족피크닉형: "먹방유튜버형", 데이터분석형: "낄끼빠빠형", 직관몰입형: "직관몰입형",
};

const seatInfo: Record<string, { zone: string; color: string; bgColor: string; where: string; tip: string }> = {
  cheering: { zone: "카스존 (응원단석)", color: "#FF6B00", bgColor: "rgba(255,107,0,0.12)", where: "1루 홈 내야 · 응원단 바로 앞", tip: "치어리더와 응원단이 바로 앞! 서서 응원하는 게 기본입니다 🎤" },
  lawn: { zone: "밤켈존 (잔디석)", color: "#16a34a", bgColor: "rgba(22,163,74,0.12)", where: "좌측 외야 · 500구역", tip: "돗자리·바베큐존 인접! 여유로운 피크닉 관람이 가능합니다 🌿" },
  table: { zone: "중앙 탁자석 / 내야 탁자석(4층)", color: "#ea7c1a", bgColor: "rgba(234,124,26,0.12)", where: "홈플레이트 정면 · 100A~100C / 4층", tip: "테이블에 음식 놓고 편하게! 먹방하기 최고의 자리입니다 🍗" },
  aisle: { zone: "외야지정석", color: "#7c3aed", bgColor: "rgba(124,58,237,0.12)", where: "우측 외야 · 501~508구역", tip: "통로와 출구 접근이 쉬워 언제든 자유롭게 이동할 수 있습니다 🚪" },
  center: { zone: "내야지정석A", color: "#F5C842", bgColor: "rgba(245,200,66,0.12)", where: "1루 내야 · 101~112구역", tip: "경기 전체를 한눈에! 선수들의 플레이를 가까이서 볼 수 있습니다 🎯" },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quiz_result") as ResultType | null;
    if (!stored || !RESULT_INFO[stored]) { router.replace("/"); return; }
    setResult(RESULT_INFO[stored]);
  }, [router]);

  if (!result) return (
    <div className="min-h-screen bg-hw-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-hw-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayName = displayNames[result.type] || result.type;
  const seat = seatInfo[result.seatZone] || seatInfo["center"];

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${result.bgGradient} opacity-60`} />
      <div className="absolute inset-0 diamond-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: result.color }} />

      <KodaLogoCorner />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center px-5 pt-10 pb-10 text-center">

          <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs font-mono tracking-[0.4em] text-white/40 uppercase mb-4">당신의 직관 유형</motion.p>

          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="text-6xl mb-4 animate-float">
            {result.emoji}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="font-black text-5xl mb-4 break-keep"
            style={{ color: result.color, textShadow: `0 0 24px ${result.color}` }}>
            {displayName}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-white/70 text-sm leading-relaxed max-w-xs mb-5 break-keep">
            {result.description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-2 justify-center mb-7">
            {result.traits.map((trait, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border"
                style={{ borderColor: `${result.color}50`, color: result.color, background: `${result.color}15` }}>
                #{trait}
              </span>
            ))}
          </motion.div>

          {/* 추천 좌석 카드 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            className="w-full max-w-xs mb-7">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3 text-left flex items-center gap-2">
              <span style={{ color: result.color }}>●</span> 추천 좌석
            </p>
            <div className="rounded-2xl border p-5 text-left mb-3" style={{ background: seat.bgColor, borderColor: `${seat.color}40` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: `${seat.color}25`, border: `1.5px solid ${seat.color}60` }}>
                  {result.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm leading-snug break-keep">{seat.zone}</p>
                  <p className="text-xs mt-0.5 break-keep" style={{ color: seat.color }}>{seat.where}</p>
                </div>
              </div>
              <div className="h-px mb-4" style={{ background: `${seat.color}25` }} />
              <div className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
                <p className="text-white/65 text-sm leading-relaxed break-keep">{seat.tip}</p>
              </div>
            </div>

            {/* 티켓 예매 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🎟️</span>
                <p className="text-xs font-bold text-white/80">티켓 예매</p>
              </div>
              <div className="flex flex-col gap-2">
                <a href="https://www.hanwhaeagles.co.kr/ticketInfo.do" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-95"
                  style={{ background: `${result.color}20`, border: `1px solid ${result.color}40` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🦅</span>
                    <span className="text-sm font-medium text-white break-keep">한화이글스 공식 홈페이지</span>
                  </div>
                  <span className="text-white/40 text-xs">→</span>
                </a>
                <a href="https://www.ticketlink.co.kr/sports/baseball/10" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 transition-all active:scale-95">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎫</span>
                    <span className="text-sm font-medium text-white">티켓링크</span>
                  </div>
                  <span className="text-white/40 text-xs">→</span>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="flex items-center gap-3 text-white/20 text-xs mb-6 w-full max-w-xs">
            <div className="flex-1 h-px bg-white/10" /><span>⚾</span><div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="w-full max-w-xs space-y-3">
            <p className="text-white/40 text-xs text-center mb-2">데이터로 보는 한화생명 볼파크</p>
            <button onClick={() => router.push("/cardnews")} className="btn-primary w-full py-4 rounded-2xl text-base font-bold tracking-widest">
              📊 카드뉴스 보기
            </button>
            <button onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:text-white/70 transition-all">
              테스트 다시하기
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
