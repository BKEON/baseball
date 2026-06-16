"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackVisit, getVisitorCount } from "@/lib/analytics";

export default function LandingPage() {
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackVisit();
    getVisitorCount().then(setVisitorCount);
  }, []);

  const handleStart = () => {
    router.push("/test");
  };

  const handleCardNews = () => {
    router.push("/cardnews");
  };

  return (
    <main className="min-h-screen stadium-bg diamond-pattern relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-hw-orange/5 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-hw-orange/3 blur-2xl" />
      </div>

      {/* Scoreboard ticker at top */}
      <div className="relative z-10 bg-black/60 border-b border-hw-orange/30 py-2 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-inner text-hw-orange/70 text-xs font-mono tracking-widest uppercase">
            {Array(2).fill("⚾ 한화생명 볼파크 직관 유형 테스트 · HANWHA LIFE BALLPARK · 나의 야구 스타일을 찾아봐! · ").join("")}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-hw-orange animate-pulse" />
          <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Live</span>
        </div>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-hw-gray/60 border border-white/10 rounded-full px-3 py-1"
          >
            <span className="text-xs text-white/50">오늘의 참여자</span>
            <span className="text-sm font-bold text-hw-orange scoreboard">
              {visitorCount.toLocaleString()}
            </span>
            <span className="text-xs text-white/50">명</span>
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
        {/* Stadium graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 relative"
        >
          <div className="text-8xl animate-float">⚾</div>
          <div className="absolute inset-0 rounded-full blur-3xl bg-hw-orange/20" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-2"
        >
          <div className="text-xs font-mono text-hw-orange/70 tracking-[0.4em] uppercase mb-3">
            Hanwha Life Ballpark
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-none tracking-wide">
            내 직관
          </h1>
          <h1 className="font-display text-5xl md:text-7xl leading-none tracking-wide">
            <span className="text-hw-orange led-text">유형 테스트</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/60 text-sm md:text-base mt-4 mb-10 leading-relaxed"
        >
          5문항으로 알아보는<br />
          <span className="text-white/80">나만의 야구장 관람 스타일</span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-xs"
        >
          <button
            onClick={handleStart}
            className="btn-primary w-full py-5 rounded-2xl text-xl tracking-widest font-display"
          >
            START TEST
          </button>
          <p className="text-white/30 text-xs mt-3">약 1분 소요</p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="my-10 flex items-center gap-4 w-full max-w-xs"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-white/20 text-xs">또는</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>

        {/* Card news section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="w-full max-w-xs"
        >
          <div className="text-white/40 text-xs mb-3 uppercase tracking-widest">
            데이터로 보는 한화생명 볼파크
          </div>
          <button
            onClick={handleCardNews}
            className="w-full py-4 rounded-2xl border border-white/20 text-white/70 text-sm hover:border-hw-orange/50 hover:text-white hover:bg-hw-orange/5 transition-all duration-200"
          >
            📊 카드뉴스 보기
          </button>
        </motion.div>
      </div>

      {/* Bottom graphic - baseball diamond silhouette */}
      <div className="relative z-10 h-32 overflow-hidden">
        <svg viewBox="0 0 375 100" className="w-full absolute bottom-0 opacity-10" fill="none">
          <path d="M0 100 L187 20 L375 100" stroke="#FF6B00" strokeWidth="1" fill="rgba(255,107,0,0.05)" />
          <path d="M75 100 L187 50 L300 100" stroke="#FF6B00" strokeWidth="0.5" fill="rgba(255,107,0,0.03)" />
          <circle cx="187" cy="20" r="5" fill="#FF6B00" opacity="0.5" />
          <circle cx="75" cy="100" r="4" fill="#FF6B00" opacity="0.3" />
          <circle cx="300" cy="100" r="4" fill="#FF6B00" opacity="0.3" />
          <circle cx="187" cy="50" r="3" fill="#FF6B00" opacity="0.4" />
        </svg>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-white/20 text-xs safe-bottom">
        © 2024 Hanwha Life Ballpark
      </footer>
    </main>
  );
}
