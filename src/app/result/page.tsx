"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RESULT_INFO } from "@/lib/quiz";
import type { ResultType, ResultInfo } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultInfo | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("quiz_result") as ResultType | null;
    if (!stored || !RESULT_INFO[stored]) {
      router.replace("/");
      return;
    }
    setResult(RESULT_INFO[stored]);
    setTimeout(() => setShowContent(true), 500);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-hw-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-hw-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col overflow-hidden">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${result.bgGradient} opacity-60`} />
      <div className="absolute inset-0 diamond-pattern" />

      {/* Glow orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: result.color }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Result reveal animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-4 text-center"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono tracking-[0.4em] text-white/40 uppercase mb-4"
          >
            당신의 직관 유형
          </motion.div>

          {/* Emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-8xl mb-6 animate-float"
          >
            {result.emoji}
          </motion.div>

          {/* Type name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h1
              className="font-display text-5xl md:text-6xl mb-2"
              style={{ color: result.color, textShadow: `0 0 20px ${result.color}` }}
            >
              {result.type}
            </h1>
          </motion.div>

          {/* Seat recommendation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 mt-2"
          >
            <span className="text-white/50 text-xs">추천 좌석</span>
            <span className="text-white font-bold text-sm">📍 {result.seat}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-white/70 text-sm leading-relaxed max-w-sm mb-8"
          >
            {result.description}
          </motion.p>

          {/* Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap gap-2 justify-center mb-10"
          >
            {result.traits.map((trait, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full border"
                style={{
                  borderColor: `${result.color}50`,
                  color: result.color,
                  background: `${result.color}15`,
                }}
              >
                #{trait}
              </span>
            ))}
          </motion.div>

          {/* Divider with baseball */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-3 text-white/20 text-xs mb-8"
          >
            <div className="flex-1 h-px bg-white/10" />
            <span>⚾</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Card news CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="w-full max-w-xs space-y-3"
          >
            <div className="text-white/40 text-xs text-center mb-2">
              데이터로 보는 한화생명 볼파크
            </div>
            <button
              onClick={() => router.push("/cardnews")}
              className="btn-primary w-full py-4 rounded-2xl text-base font-display tracking-widest"
            >
              📊 카드뉴스 보기
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:text-white/70 transition-all"
            >
              테스트 다시하기
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
