"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackCardNews } from "@/lib/analytics";
import { KodaLogoCorner } from "@/components/KodaLogo";

// ── 카드 1: 부사동 전체 카드소비 TOP3 ──
function Card1() {
  const data = [
    { rank: 1, label: "한식 일반\n음식점업", value: 326550083, color: "#FF6B00", pct: 100 },
    { rank: 2, label: "편의점", value: 294256894, color: "#F5C842", pct: 90 },
    { rank: 3, label: "골프·스포츠\n경기용품", value: 260760877, color: "#4A90D9", pct: 80 },
  ];
  const fmt = (v: number) => (v / 100000000).toFixed(1) + "억";

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-hw-orange/20 text-hw-orange">#01</span>
        <span className="text-xs text-white/40">실제 SDC 카드소비 데이터</span>
      </div>
      <h2 className="text-xl font-bold text-white leading-tight mb-1 break-keep">
        ⚾ 볼파크 인근<br/>카드 소비 <span className="text-hw-orange">TOP 3</span>
      </h2>
      <p className="text-xs text-white/50 mb-5 break-keep">한화생명 볼파크 인근 지역 기준</p>

      <div className="flex flex-col gap-4 flex-1">
        {data.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.3 }}>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: item.color, color: "#000" }}>{item.rank}</div>
              <span className="text-sm font-bold text-white break-keep whitespace-pre-line leading-tight">{item.label}</span>
              <span className="ml-auto text-sm font-black" style={{ color: item.color }}>{fmt(item.value)}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden ml-10">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.7, ease: "easeOut" }}
                style={{ background: item.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 인포그래픽 강조 */}
      <div className="mt-5 rounded-2xl p-4 text-center" style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.25)" }}>
        <div className="text-2xl font-black text-hw-orange">🍚 한식 1위!</div>
        <p className="text-xs text-white/60 mt-1 break-keep">볼파크 인근 핵심 소비는<br/>한식당 · 편의점 · 스포츠용품점</p>
      </div>
    </div>
  );
}

// ── 카드 2: 외부유입 고객 카드소비 TOP3 ──
function Card2() {
  const data = [
    { rank: 1, label: "골프·스포츠\n경기용품", value: 169195438, color: "#FF6B00", pct: 100 },
    { rank: 2, label: "한식 일반\n음식점업", value: 136233963, color: "#F5C842", pct: 81 },
    { rank: 3, label: "편의점", value: 122858668, color: "#4A90D9", pct: 73 },
  ];
  const fmt = (v: number) => (v / 100000000).toFixed(1) + "억";

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">#02</span>
        <span className="text-xs text-white/40">대전 외지 방문객 분석</span>
      </div>
      <h2 className="text-xl font-bold text-white leading-tight mb-1 break-keep">
        🚗 외지인이 쓰는 돈<br/><span className="text-blue-400">TOP 3</span>
      </h2>
      <p className="text-xs text-white/50 mb-5 break-keep">대전 비거주 외지 방문객 기준</p>

      <div className="flex flex-col gap-4 flex-1">
        {data.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.3 }}>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: item.color, color: "#000" }}>{item.rank}</div>
              <span className="text-sm font-bold text-white break-keep whitespace-pre-line leading-tight">{item.label}</span>
              <span className="ml-auto text-sm font-black" style={{ color: item.color }}>{fmt(item.value)}</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden ml-10">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }} animate={{ width: `${item.pct}%` }}
                transition={{ delay: i * 0.15 + 0.5, duration: 0.7, ease: "easeOut" }}
                style={{ background: item.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl p-4 text-center" style={{ background: "rgba(74,144,217,0.1)", border: "1px solid rgba(74,144,217,0.25)" }}>
        <div className="text-2xl font-black text-blue-400">⛳ 스포츠용품 1위!</div>
        <p className="text-xs text-white/60 mt-1 break-keep">외지인은 스포츠용품 구매에<br/>가장 많이 지출하는 특징</p>
      </div>
    </div>
  );
}

// ── 카드 3: 1인당 소비 비교 ──
function Card3() {
  const items = [
    { label: "야구장 외부유입\n고객 평균", total: 76716, perPerson: 32306, color: "#FF6B00" },
    { label: "대전 전체\n평균", total: 114869, perPerson: 35687, color: "#4A90D9" },
  ];
  const fmt = (v: number) => v.toLocaleString() + "원";
  const maxTotal = Math.max(...items.map(i => i.total));

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">#03</span>
        <span className="text-xs text-white/40">소비 규모 비교</span>
      </div>
      <h2 className="text-xl font-bold text-white leading-tight mb-1 break-keep">
        💳 1인당 카드소비<br/><span className="text-green-400">비교 분석</span>
      </h2>
      <p className="text-xs text-white/50 mb-5 break-keep">대전 외지 방문객 vs 대전 전체 평균</p>

      {/* 비교 카드 */}
      <div className="flex gap-3 mb-5">
        {items.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.3 }}
            className="flex-1 rounded-2xl p-4 text-center"
            style={{ background: `${item.color}15`, border: `1px solid ${item.color}40` }}>
            <p className="text-xs text-white/50 mb-2 whitespace-pre-line leading-tight break-keep">{item.label}</p>
            <div className="text-lg font-black mb-1" style={{ color: item.color }}>{fmt(item.perPerson)}</div>
            <div className="text-xs text-white/40">1인당 평균</div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="text-xs text-white/60">{fmt(item.total)}</div>
              <div className="text-xs text-white/30">평균 소비액</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 바 비교 */}
      <div className="flex flex-col gap-3 flex-1">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60 whitespace-pre-line leading-tight break-keep">{item.label.replace("\n", " ")}</span>
              <span style={{ color: item.color }} className="font-bold">{fmt(item.total)}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(item.total / maxTotal) * 100}%` }}
                transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
                style={{ background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl p-3 text-center" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
        <p className="text-xs text-white/70 break-keep">
          대전 외지 방문객 1인당 소비 <span className="text-green-400 font-bold">32,306원</span><br/>
          대전 전체 평균 대비 <span className="text-green-400 font-bold">약 90% 수준</span>
        </p>
      </div>
    </div>
  );
}

// ── 카드 4: 대전 외부유입 소비 TOP5 지역 ──
function Card4() {
  const data = [
    { rank: 1, label: "중앙동", value: 102228544347, color: "#FF6B00" },
    { rank: 2, label: "신성동", value: 7150375868, color: "#F5C842" },
    { rank: 3, label: "관평동", value: 6569588067, color: "#4A90D9" },
    { rank: 4, label: "은행선화동", value: 5939942156, color: "#A855F7" },
    { rank: 5, label: "둔산2동", value: 1034280828, color: "#16a34a" },
  ];
  const max = data[0].value;
  const fmt = (v: number) => v >= 100000000 ? (v / 100000000).toFixed(0) + "억" : (v / 10000000).toFixed(0) + "천만";

  return (
    <div className="flex flex-col h-full p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">#04</span>
        <span className="text-xs text-white/40">지역별 소비 현황</span>
      </div>
      <h2 className="text-xl font-bold text-white leading-tight mb-1 break-keep">
        📍 대전 외부유입<br/>소비 <span className="text-purple-400">TOP 5 지역</span>
      </h2>
      <p className="text-xs text-white/50 mb-4 break-keep">대전을 찾은 외지인의 주요 소비 지역</p>

      <div className="flex flex-col gap-3 flex-1">
        {data.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 + 0.3 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: item.color, color: "#000" }}>{item.rank}</div>
              <span className="text-sm font-bold text-white">{item.label}</span>
              <span className="ml-auto text-xs font-black" style={{ color: item.color }}>{fmt(item.value)}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden ml-8">
              <motion.div className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
                transition={{ delay: i * 0.12 + 0.5, duration: 0.7 }}
                style={{ background: item.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl p-3" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-purple-400 text-base">🏆</span>
          <span className="text-xs font-bold text-white">중앙동 압도적 1위</span>
        </div>
        <p className="text-xs text-white/60 break-keep">
          중앙동이 <span className="text-purple-400 font-bold">1,022억원</span>으로<br/>
          2위 신성동(71억)과 약 14배 차이
        </p>
      </div>
    </div>
  );
}

const CARDS = [
  { page: 1, color: "#FF6B00", component: Card1 },
  { page: 2, color: "#4A90D9", component: Card2 },
  { page: 3, color: "#16a34a", component: Card3 },
  { page: 4, color: "#A855F7", component: Card4 },
];

export default function CardNewsPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const pageStartTime = useRef(Date.now());
  const touchStartX = useRef<number | null>(null);

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

  const card = CARDS[current];
  const CardComponent = card.component;

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col">
      <KodaLogoCorner />

      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">←</button>
        <div className="text-center">
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest">Card News</div>
          <div className="text-xs text-white/20 mt-0.5">국가데이터처 SDC 카드소비 데이터</div>
        </div>
        <div className="text-xs font-mono text-white/40">{current + 1} / {CARDS.length}</div>
      </div>

      {/* 점 인디케이터 */}
      <div className="flex justify-center gap-2 pb-3">
        {CARDS.map((c, i) => (
          <button key={i} onClick={() => goToPage(i)}>
            <div className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === current ? 32 : 8, background: i === current ? c.color : "rgba(255,255,255,0.2)" }} />
          </button>
        ))}
      </div>

      {/* 카드 */}
      <div className="flex-1 px-5 pb-4 overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50 && current < CARDS.length - 1) goToPage(current + 1);
          if (diff < -50 && current > 0) goToPage(current - 1);
          touchStartX.current = null;
        }}>
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, x: direction * 80 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 80 }} transition={{ duration: 0.3 }}
            className="h-full">
            <div className="rounded-3xl overflow-hidden min-h-[480px] flex flex-col"
              style={{ background: `linear-gradient(145deg, ${card.color}18 0%, #0A0E1A 55%)`, border: `1px solid ${card.color}35` }}>
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              <CardComponent />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pb-6 safe-bottom flex gap-3">
        {current < CARDS.length - 1 ? (
          <button onClick={() => goToPage(current + 1)} className="btn-primary flex-1 py-4 rounded-2xl font-bold tracking-widest">다음 카드 →</button>
        ) : (
          <button onClick={() => router.push("/feedback")} className="btn-primary flex-1 py-4 rounded-2xl font-bold tracking-widest">소감 남기기 ✨</button>
        )}
        {current > 0 && (
          <button onClick={() => goToPage(current - 1)} className="w-14 h-14 rounded-2xl border border-white/10 text-white/40 hover:text-white transition-all text-lg">←</button>
        )}
      </div>
    </main>
  );
}
