"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RESULT_INFO } from "@/lib/quiz";
import type { ResultType, ResultInfo } from "@/types";

// SVG 좌석 배치도 컴포넌트
function StadiumMap({ zone, color }: { zone: string; color: string }) {
  const zones: Record<string, { cx: number; cy: number; label: string }> = {
    cheering:  { cx: 310, cy: 175, label: "응원단석\n103~104구역" },
    lawn:      { cx: 185, cy: 285, label: "외야 잔디석\n500구역" },
    table:     { cx: 220, cy: 135, label: "테이블석\n100A~100C" },
    aisle:     { cx: 135, cy: 255, label: "외야 통로쪽\n501~502구역" },
    center:    { cx: 220, cy: 110, label: "중앙지정석\n100B~C구역" },
  };

  const target = zones[zone] || zones["center"];

  return (
    <svg viewBox="0 0 440 360" className="w-full max-w-sm mx-auto" style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}>
      {/* Background */}
      <rect width="440" height="360" rx="16" fill="#0D1B3E" opacity="0.95"/>

      {/* 잔디 그라운드 */}
      <ellipse cx="220" cy="190" rx="165" ry="140" fill="#1a4a28"/>
      <ellipse cx="220" cy="190" rx="145" ry="122" fill="#1e5530"/>
      {/* 다이아몬드 */}
      <polygon points="220,118 264,162 220,206 176,162" fill="#2a7040" stroke="#3a9050" strokeWidth="1.5"/>
      {/* 마운드 */}
      <circle cx="220" cy="162" r="10" fill="#2a7040" stroke="#3a9050" strokeWidth="1"/>
      {/* 홈플레이트 */}
      <rect x="216" y="199" width="8" height="8" fill="#fff" opacity="0.8" rx="1"/>
      {/* 베이스 */}
      <rect x="258" y="157" width="7" height="7" fill="#fff" opacity="0.7" rx="1"/>
      <rect x="216" y="115" width="7" height="7" fill="#fff" opacity="0.7" rx="1"/>
      <rect x="175" y="157" width="7" height="7" fill="#fff" opacity="0.7" rx="1"/>

      {/* 파울라인 */}
      <line x1="220" y1="207" x2="370" y2="330" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>
      <line x1="220" y1="207" x2="70" y2="330" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>

      {/* 외야 펜스 */}
      <path d="M75,325 Q100,120 220,78 Q340,120 365,325" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>

      {/* ── 좌석 구역들 ── */}
      {/* 중앙지정석 / 테이블석 (홈플레이트 뒤) */}
      <path d="M165,60 Q220,42 275,60 L285,100 Q220,82 155,100 Z"
        fill={zone === "table" || zone === "center" ? color : "rgba(255,255,255,0.08)"}
        stroke={zone === "table" || zone === "center" ? color : "rgba(255,255,255,0.15)"}
        strokeWidth="1.5" opacity={zone === "table" || zone === "center" ? 0.9 : 0.6}/>
      <text x="220" y="72" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.9">테이블석/중앙</text>

      {/* 1루 내야 응원단석 (우측 내야) */}
      <path d="M285,100 L340,130 L355,190 L310,195 L295,150 Z"
        fill={zone === "cheering" ? color : "rgba(255,255,255,0.08)"}
        stroke={zone === "cheering" ? color : "rgba(255,255,255,0.15)"}
        strokeWidth="1.5" opacity={zone === "cheering" ? 0.9 : 0.6}/>
      <text x="332" y="155" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.9">응원단석</text>
      <text x="332" y="165" textAnchor="middle" fill="white" fontSize="7" opacity="0.7">103~104</text>

      {/* 3루 내야 (좌측 내야) */}
      <path d="M155,100 L100,130 L85,190 L130,195 L145,150 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <text x="108" y="158" textAnchor="middle" fill="white" fontSize="8" opacity="0.7">3루측</text>

      {/* 우측 외야 (1루쪽) */}
      <path d="M340,130 L370,328 L290,328 L310,195 Z"
        fill={zone === "aisle" ? color : "rgba(255,255,255,0.06)"}
        stroke={zone === "aisle" ? color : "rgba(255,255,255,0.12)"}
        strokeWidth="1.2" opacity={zone === "aisle" ? 0.85 : 0.5}/>
      <text x="348" y="270" textAnchor="middle" fill="white" fontSize="8" opacity="0.8">외야 통로쪽</text>
      <text x="348" y="281" textAnchor="middle" fill="white" fontSize="7" opacity="0.6">501~502</text>

      {/* 좌측 외야 잔디석 */}
      <path d="M100,130 L70,328 L195,328 L160,220 L130,195 Z"
        fill={zone === "lawn" ? color : "rgba(255,255,255,0.06)"}
        stroke={zone === "lawn" ? color : "rgba(255,255,255,0.12)"}
        strokeWidth="1.2" opacity={zone === "lawn" ? 0.85 : 0.5}/>
      <text x="120" y="285" textAnchor="middle" fill="white" fontSize="8" opacity="0.8">외야 잔디석</text>
      <text x="120" y="296" textAnchor="middle" fill="white" fontSize="7" opacity="0.6">500구역</text>

      {/* 중앙 외야 */}
      <path d="M160,220 L195,328 L245,328 L280,328 L310,195 L275,200 L220,215 Z"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

      {/* 몬스터월 표시 (우측) */}
      <path d="M350,328 L370,328 L370,285 L350,300 Z" fill="#8B0000" opacity="0.7"/>
      <text x="363" y="315" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" transform="rotate(-90,363,315)">MONSTER</text>

      {/* 하이라이트 펄스 효과 */}
      <circle cx={target.cx} cy={target.cy} r="20" fill={color} opacity="0.15">
        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx={target.cx} cy={target.cy} r="8" fill={color} opacity="0.9"/>
      <circle cx={target.cx} cy={target.cy} r="4" fill="white" opacity="1"/>

      {/* 라벨 */}
      <rect
        x={target.cx > 220 ? target.cx - 80 : target.cx + 8}
        y={target.cy - 22}
        width="72" height="30" rx="5"
        fill={color} opacity="0.92"
      />
      {target.label.split("\n").map((line, i) => (
        <text
          key={i}
          x={target.cx > 220 ? target.cx - 44 : target.cx + 44}
          y={target.cy - 10 + i * 12}
          textAnchor="middle"
          fill="white"
          fontSize={i === 0 ? 8.5 : 7}
          fontWeight={i === 0 ? "bold" : "normal"}
        >{line}</text>
      ))}

      {/* 범례 */}
      <circle cx="16" cy="16" r="5" fill={color}/>
      <text x="25" y="20" fill="white" fontSize="8.5" opacity="0.9">내 추천 좌석</text>
    </svg>
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

  // 유형별 이름 오버라이드 (화면 표시용)
  const displayNames: Record<string, string> = {
    열정응원러: "열정응원형 🔥",
    잔디감성형: "가족피크닉형 🌿",
    가족피크닉형: "먹방유튜버형 🍗",
    데이터분석형: "낄끼빠빠형 🚪",
    직관몰입형: "직관몰입형 🎯",
  };
  const displayName = displayNames[result.type] || result.type;

  return (
    <main className="min-h-screen bg-hw-dark flex flex-col overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${result.bgGradient} opacity-60`} />
      <div className="absolute inset-0 diamond-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: result.color }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center px-6 pt-10 pb-6 text-center"
        >
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs font-mono tracking-[0.4em] text-white/40 uppercase mb-3">당신의 직관 유형
          </motion.div>

          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-6xl mb-4 animate-float">{result.emoji}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h1 className="font-display text-4xl md:text-5xl mb-1" style={{ color: result.color, textShadow: `0 0 20px ${result.color}` }}>
              {displayName}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4 mt-2">
            <span className="text-white/50 text-xs">추천 좌석</span>
            <span className="text-white font-bold text-sm">📍 {result.seat}</span>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="text-white/70 text-sm leading-relaxed max-w-sm mb-4">{result.description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-2 justify-center mb-6">
            {result.traits.map((trait, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full border"
                style={{ borderColor: `${result.color}50`, color: result.color, background: `${result.color}15` }}>
                #{trait}
              </span>
            ))}
          </motion.div>

          {/* 좌석 배치도 */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="w-full max-w-sm mb-2">
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">📍 한화생명 볼파크 좌석 위치</div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <StadiumMap zone={result.seatZone} color={result.color} />
            </div>
            <div className="mt-2 text-xs text-white/40 text-center">{result.seatDetail}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="flex items-center gap-3 text-white/20 text-xs my-5 w-full max-w-sm">
            <div className="flex-1 h-px bg-white/10" /><span>⚾</span><div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}
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
