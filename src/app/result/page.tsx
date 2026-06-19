"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RESULT_INFO } from "@/lib/quiz";
import type { ResultType, ResultInfo } from "@/types";

// 한화생명 볼파크 실제 구조 기반 좌석 배치도
function StadiumMap({ zone, color }: { zone: string; color: string }) {
  // 각 구역별 하이라이트 설정 (실제 구장 위치 기반)
  const zoneConfig: Record<string, {
    highlightPaths: string[];
    pinX: number; pinY: number;
    label: string; subLabel: string;
  }> = {
    // 열정응원형 - 1루측 응원단석 (카스존, 103~104구역)
    cheering: {
      highlightPaths: ["infield-1b"],
      pinX: 330, pinY: 168,
      label: "오렌지석/응원단석", subLabel: "1루측 103~104구역 (카스존)",
    },
    // 가족피크닉형 - 좌측 외야 잔디석 (밤켈존, 500구역)
    lawn: {
      highlightPaths: ["outfield-lf"],
      pinX: 108, pinY: 270,
      label: "외야 잔디석", subLabel: "좌측 외야 500구역 (밤켈존/바베큐존)",
    },
    // 먹방유튜버형 - 중앙 테이블석 (홈플레이트 뒤)
    table: {
      highlightPaths: ["home-table"],
      pinX: 220, pinY: 52,
      label: "테이블석 / 탁자석", subLabel: "중앙 100A~100C구역 / 4층 탁자석",
    },
    // 낄끼빠빠형 - 우측 외야 통로쪽 (501~502구역)
    aisle: {
      highlightPaths: ["outfield-rf"],
      pinX: 352, pinY: 270,
      label: "외야 통로쪽 좌석", subLabel: "우측 외야 501~502구역 (복도쪽)",
    },
    // 직관몰입형 - 중앙 내야 지정석
    center: {
      highlightPaths: ["home-table"],
      pinX: 220, pinY: 52,
      label: "중앙 내야지정석", subLabel: "중앙 100B~100C구역",
    },
  };

  const cfg = zoneConfig[zone] || zoneConfig["center"];

  // 구역별 채우기 색상
  const zoneColor = (id: string) =>
    cfg.highlightPaths.includes(id) ? color : "rgba(255,255,255,0.07)";
  const zoneStroke = (id: string) =>
    cfg.highlightPaths.includes(id) ? color : "rgba(255,255,255,0.18)";
  const zoneOpacity = (id: string) =>
    cfg.highlightPaths.includes(id) ? 0.88 : 0.55;

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 460 380" className="w-full" style={{ filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.6))" }}>
        {/* 배경 */}
        <rect width="460" height="380" rx="18" fill="#0B1628"/>
        <rect width="460" height="380" rx="18" fill="url(#bgGrad)"/>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#0D1F3C"/>
            <stop offset="100%" stopColor="#060C18"/>
          </radialGradient>
        </defs>

        {/* ════════ 그라운드 ════════ */}
        {/* 외야 잔디 */}
        <path d="M80,345 Q80,80 220,42 Q360,80 380,345 Z" fill="#14532d" opacity="0.9"/>
        {/* 내야 잔디 */}
        <polygon points="220,130 278,188 220,246 162,188" fill="#166534" opacity="0.95"/>
        {/* 내야 흙 */}
        <polygon points="220,135 275,188 220,241 165,188" fill="#92400e" opacity="0.5"/>
        {/* 마운드 */}
        <circle cx="220" cy="188" r="12" fill="#a16207" opacity="0.7"/>
        <circle cx="220" cy="188" r="6" fill="#ca8a04" opacity="0.6"/>
        {/* 홈플레이트 */}
        <polygon points="220,243 226,249 224,256 216,256 214,249" fill="white" opacity="0.85"/>
        {/* 베이스 */}
        <rect x="272" y="184" width="9" height="9" rx="1" fill="white" opacity="0.8"/>
        <rect x="216" y="126" width="9" height="9" rx="1" fill="white" opacity="0.8"/>
        <rect x="160" y="184" width="9" height="9" rx="1" fill="white" opacity="0.8"/>
        {/* 파울라인 */}
        <line x1="223" y1="254" x2="383" y2="345" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        <line x1="217" y1="254" x2="77" y2="345" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
        {/* 외야 펜스 */}
        <path d="M82,343 Q82,78 220,40 Q358,78 378,343" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>

        {/* ════════ 관중석 구역 ════════ */}

        {/* 중앙 테이블석/포수 뒤 (홈플레이트 정면) */}
        <path id="home-table" d="M168,30 Q220,14 272,30 L282,72 Q220,54 158,72 Z"
          fill={zoneColor("home-table")} stroke={zoneStroke("home-table")}
          strokeWidth="1.8" opacity={zoneOpacity("home-table")}/>

        {/* 1루측 내야 상단 */}
        <path d="M272,30 L340,68 L352,130 L300,138 L282,72 Z"
          fill={zoneColor("infield-1b-upper")} stroke={zoneStroke("infield-1b-upper")}
          strokeWidth="1.5" opacity={zoneOpacity("infield-1b-upper")}/>

        {/* 1루측 응원단석 (카스존 103~104) - 핵심 구역 */}
        <path id="infield-1b" d="M300,138 L352,130 L368,210 L316,218 Z"
          fill={zoneColor("infield-1b")} stroke={zoneStroke("infield-1b")}
          strokeWidth="1.8" opacity={zoneOpacity("infield-1b")}/>

        {/* 3루측 내야 상단 */}
        <path d="M168,30 L100,68 L88,130 L140,138 L158,72 Z"
          fill={zoneColor("infield-3b-upper")} stroke={zoneStroke("infield-3b-upper")}
          strokeWidth="1.5" opacity={zoneOpacity("infield-3b-upper")}/>

        {/* 3루측 내야 하단 */}
        <path d="M140,138 L88,130 L72,210 L124,218 Z"
          fill={zoneColor("infield-3b")} stroke={zoneStroke("infield-3b")}
          strokeWidth="1.5" opacity={zoneOpacity("infield-3b")}/>

        {/* 우측 외야 (1루쪽, 501~502, 통로쪽) */}
        <path id="outfield-rf" d="M368,210 L316,218 L310,290 L382,345 L410,280 Z"
          fill={zoneColor("outfield-rf")} stroke={zoneStroke("outfield-rf")}
          strokeWidth="1.8" opacity={zoneOpacity("outfield-rf")}/>

        {/* 몬스터월 (우측 외야 끝) */}
        <path d="M382,345 L410,280 L430,295 L408,358 Z"
          fill="#7f1d1d" opacity="0.8" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="415" y="325" fill="#fca5a5" fontSize="7" fontWeight="bold"
          transform="rotate(-70,415,325)" textAnchor="middle">MONSTER</text>

        {/* 좌측 외야 잔디석 (3루쪽, 밤켈존 500구역) */}
        <path id="outfield-lf" d="M72,210 L124,218 L130,290 L78,345 L42,280 Z"
          fill={zoneColor("outfield-lf")} stroke={zoneStroke("outfield-lf")}
          strokeWidth="1.8" opacity={zoneOpacity("outfield-lf")}/>

        {/* 중앙 외야 (좌중간~우중간) */}
        <path d="M130,290 L310,290 L382,345 L78,345 Z"
          fill={zoneColor("outfield-cf")} stroke={zoneStroke("outfield-cf")}
          strokeWidth="1.2" opacity={zoneOpacity("outfield-cf")}/>

        {/* ════════ 구역 라벨 ════════ */}
        <text x="220" y="47" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.85">테이블석/중앙지정석</text>

        <text x="334" y="170" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" opacity="0.85">응원단석</text>
        <text x="334" y="180" textAnchor="middle" fill="white" fontSize="6.5" opacity="0.7">103~104</text>
        <text x="334" y="190" textAnchor="middle" fill="white" fontSize="6.5" opacity="0.65">(카스존)</text>

        <text x="106" y="168" textAnchor="middle" fill="white" fontSize="7.5" opacity="0.75">3루측</text>
        <text x="106" y="178" textAnchor="middle" fill="white" fontSize="6.5" opacity="0.65">내야석</text>

        <text x="355" y="268" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" opacity="0.85">외야 통로쪽</text>
        <text x="355" y="278" textAnchor="middle" fill="white" fontSize="6.5" opacity="0.7">501~502구역</text>

        <text x="85" y="268" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" opacity="0.85">외야 잔디석</text>
        <text x="85" y="278" textAnchor="middle" fill="white" fontSize="6.5" opacity="0.7">500구역</text>
        <text x="85" y="288" textAnchor="middle" fill="white" fontSize="6" opacity="0.65">(밤켈존)</text>

        <text x="220" y="330" textAnchor="middle" fill="white" fontSize="7.5" opacity="0.7">중앙 외야</text>

        {/* ════════ 핀 마커 ════════ */}
        {/* 외부 펄스 */}
        <circle cx={cfg.pinX} cy={cfg.pinY} r="18" fill={color} opacity="0.12">
          <animate attributeName="r" values="12;22;12" dur="1.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.18;0.04;0.18" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        {/* 핀 배경 */}
        <circle cx={cfg.pinX} cy={cfg.pinY} r="10" fill={color} opacity="0.3"/>
        {/* 핀 중심 */}
        <circle cx={cfg.pinX} cy={cfg.pinY} r="6" fill={color} opacity="0.95"/>
        <circle cx={cfg.pinX} cy={cfg.pinY} r="3" fill="white" opacity="1"/>

        {/* ════════ 범례 ════════ */}
        <rect x="10" y="352" width="10" height="10" rx="2" fill={color} opacity="0.9"/>
        <text x="25" y="361" fill="white" fontSize="9" opacity="0.85">추천 좌석</text>
        <rect x="100" y="352" width="10" height="10" rx="2" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <text x="115" y="361" fill="white" fontSize="9" opacity="0.55">기타 구역</text>
        <rect x="195" y="352" width="10" height="10" rx="2" fill="#7f1d1d"/>
        <text x="210" y="361" fill="white" fontSize="9" opacity="0.55">몬스터월</text>

        {/* 방향 표시 */}
        <text x="220" y="188" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8">HOME</text>
      </svg>

      {/* 좌석 정보 카드 */}
      <div className="mt-3 rounded-xl border px-4 py-3 flex items-center gap-3"
        style={{ background: `${color}15`, borderColor: `${color}40` }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}` }}/>
        <div>
          <div className="text-xs font-bold" style={{ color }}>{cfg.label}</div>
          <div className="text-xs text-white/50 mt-0.5">{cfg.subLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultInfo | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quiz_result") as ResultType | null;
    if (!stored || !RESULT_INFO[stored]) { router.replace("/"); return; }
    setResult(RESULT_INFO[stored]);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-hw-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-hw-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayNames: Record<string, string> = {
    열정응원러: "열정응원형",
    잔디감성형: "가족피크닉형",
    가족피크닉형: "먹방유튜버형",
    데이터분석형: "낄끼빠빠형",
    직관몰입형: "직관몰입형",
  };
  const displayName = displayNames[result.type] || result.type;

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${result.bgGradient} opacity-60`} />
      <div className="absolute inset-0 diamond-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-25"
        style={{ background: result.color }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center px-5 pt-10 pb-8 text-center">

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs font-mono tracking-[0.4em] text-white/40 uppercase mb-3">
            당신의 직관 유형
          </motion.div>

          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4 animate-float">{result.emoji}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="font-display text-5xl mb-1"
            style={{ color: result.color, textShadow: `0 0 20px ${result.color}` }}>
            {displayName}
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 mt-2">
            <span className="text-white/50 text-xs">추천 좌석</span>
            <span className="text-white font-bold text-sm">📍 {result.seat}</span>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            className="text-white/70 text-sm leading-relaxed max-w-sm mb-4">{result.description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-2 justify-center mb-6">
            {result.traits.map((trait, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border"
                style={{ borderColor: `${result.color}50`, color: result.color, background: `${result.color}15` }}>
                #{trait}
              </span>
            ))}
          </motion.div>

          {/* 한화생명 볼파크 좌석 배치도 */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="w-full max-w-sm mb-6">
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span style={{ color: result.color }}>●</span>
              한화생명 볼파크 좌석 위치
            </div>
            <StadiumMap zone={result.seatZone} color={result.color} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
            className="flex items-center gap-3 text-white/20 text-xs mb-6 w-full max-w-sm">
            <div className="flex-1 h-px bg-white/10" /><span>⚾</span><div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
            className="w-full max-w-xs space-y-3">
            <div className="text-white/40 text-xs text-center mb-2">데이터로 보는 한화생명 볼파크</div>
            <button onClick={() => router.push("/cardnews")}
              className="btn-primary w-full py-4 rounded-2xl text-base font-display tracking-widest">
              📊 카드뉴스 보기
            </button>
            <button onClick={() => router.push("/")}
              className="w-full py-3 rounded-2xl border border-white/10 text-white/40 text-sm hover:text-white/70 transition-all">
              테스트 다시하기
            </button>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
