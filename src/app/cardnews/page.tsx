"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackCardNews } from "@/lib/analytics";

const CARDS = [
  {
    page: 1,
    title: "한화생명 볼파크\n방문객은 누구일까?",
    emoji: "👥",
    color: "#FF6B00",
    stats: [
      { label: "20-30대", value: "64%", desc: "주 방문 연령층" },
      { label: "동반 관람", value: "78%", desc: "혼자 오지 않는 비율" },
      { label: "여성 관람객", value: "42%", desc: "전년 대비 +8%p" },
    ],
    insight: "젊은 세대와 커플·가족 단위의 방문이 크게 늘고 있습니다. 야구는 이제 스포츠를 넘어 문화 콘텐츠로 자리잡고 있어요.",
  },
  {
    page: 2,
    title: "언제 가장\n사람이 많을까?",
    emoji: "📅",
    color: "#F5C842",
    stats: [
      { label: "금·토·일", value: "TOP 3", desc: "주말 집중 현상" },
      { label: "저녁 경기", value: "18:00~", desc: "가장 인기 있는 시간대" },
      { label: "성수기", value: "6-8월", desc: "방문객 최대 집중 시기" },
    ],
    insight: "토요일 저녁 경기가 가장 높은 인기를 자랑합니다. 평일 낮 경기는 비교적 여유롭게 즐길 수 있어요.",
  },
  {
    page: 3,
    title: "야구장 주변에서\n어디에 돈을 쓸까?",
    emoji: "💰",
    color: "#1A6B3A",
    stats: [
      { label: "식음료", value: "1위", desc: "경기장 내·외부 통합" },
      { label: "이동·주차", value: "2위", desc: "교통 관련 지출" },
      { label: "MD 상품", value: "3위", desc: "굿즈 구매 급증" },
    ],
    insight: "방문객 1인당 평균 지출액이 지속 증가하고 있으며, 특히 MD 상품 구매가 전년 대비 35% 증가했습니다.",
  },
  {
    page: 4,
    title: "한화생명 볼파크가\n지역경제에 미치는 영향",
    emoji: "🏙️",
    color: "#4A90D9",
    stats: [
      { label: "연간 방문객", value: "100만+", desc: "대전 대표 관광명소" },
      { label: "지역 매출", value: "↑32%", desc: "인근 상권 활성화" },
      { label: "고용 창출", value: "2,000+", desc: "직간접 일자리" },
    ],
    insight: "한화생명 볼파크는 단순한 야구장을 넘어 대전 지역경제를 이끄는 핵심 인프라로 성장하고 있습니다.",
  },
];

export default function CardNewsPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const pageStartTime = useRef(Date.now());

  useEffect(() => {
    pageStartTime.current = Date.now();
    return () => {
      const duration = Math.round((Date.now() - pageStartTime.current) / 1000);
      trackCardNews(CARDS[current].page, duration);
    };
  }, [current]);

  const goToPage = (next: number) => {
    const duration = Math.round((Date.now() - pageStartTime.current) / 1000);
    trackCardNews(CARDS[current].page, duration);
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
    pageStartTime.current = Date.now();
  };

  const touchStartX = useRef<number | null>(null);
  const handlers = {
    onTouchStart: (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (diff > 50 && current < CARDS.length - 1) goToPage(current + 1);
      if (diff < -50 && current > 0) goToPage(current - 1);
      touchStartX.current = null;
    },
  };

  const card = CARDS[current];

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 relative z-10">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          ←
        </button>
        <div className="text-xs font-mono text-white/30 uppercase tracking-widest">
          Card News
        </div>
        <div className="text-xs font-mono text-white/40">
          {current + 1} / {CARDS.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-4">
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className="transition-all duration-300"
          >
            <div
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-hw-orange" : "w-2 bg-white/20"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Card */}
      <div {...handlers} className="flex-1 px-5 pb-5 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 80 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full"
          >
            <div
              className="rounded-3xl overflow-hidden h-full flex flex-col min-h-[520px] relative"
              style={{
                background: `linear-gradient(135deg, ${card.color}20, #0A0E1A 60%)`,
                border: `1px solid ${card.color}30`,
              }}
            >
              {/* Top accent */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
              />

              <div className="flex-1 p-6 flex flex-col">
                {/* Page badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-mono px-3 py-1 rounded-full"
                    style={{ background: `${card.color}20`, color: card.color }}
                  >
                    #{String(card.page).padStart(2, "0")}
                  </span>
                  <span className="text-3xl">{card.emoji}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
                  {card.title}
                </h2>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {card.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                      className="rounded-2xl p-3 text-center"
                      style={{ background: `${card.color}15`, border: `1px solid ${card.color}20` }}
                    >
                      <div
                        className="text-xl font-display leading-none mb-1"
                        style={{ color: card.color }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-white font-bold text-xs mb-1">{stat.label}</div>
                      <div className="text-white/40 text-[10px] leading-tight">{stat.desc}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Insight */}
                <div
                  className="rounded-2xl p-4 flex-1"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Insight</div>
                  <p className="text-white/80 text-sm leading-relaxed">{card.insight}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-5 pb-6 safe-bottom flex gap-3">
        {current < CARDS.length - 1 ? (
          <button
            onClick={() => goToPage(current + 1)}
            className="btn-primary flex-1 py-4 rounded-2xl font-display tracking-widest text-base"
          >
            다음 카드 →
          </button>
        ) : (
          <button
            onClick={() => router.push("/feedback")}
            className="btn-primary flex-1 py-4 rounded-2xl font-display tracking-widest text-base"
          >
            소감 남기기 ✨
          </button>
        )}
        {current > 0 && (
          <button
            onClick={() => goToPage(current - 1)}
            className="w-14 h-14 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all text-lg"
          >
            ←
          </button>
        )}
      </div>
    </main>
  );
}
