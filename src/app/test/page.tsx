"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackTestStart, trackTestComplete } from "@/lib/analytics";
import { calculateResult } from "@/lib/quiz";
import type { TestAnswers } from "@/types";

const QUESTIONS = [
  {
    id: "q1",
    number: "01",
    text: "야구장에서 가장 중요하게\n생각하는 것은?",
    options: [
      { value: "응원분위기", label: "🔥 응원 분위기" },
      { value: "경기몰입감", label: "🎯 경기 몰입감" },
      { value: "편안함", label: "😌 편안함" },
      { value: "먹거리", label: "🍺 먹거리" },
      { value: "사진", label: "📸 사진 / 인증샷" },
    ],
  },
  {
    id: "q2",
    number: "02",
    text: "응원 소음은\n어느 정도가 좋은가요?",
    options: [
      { value: "클수록좋다", label: "📢 클수록 좋다!" },
      { value: "적당히좋다", label: "🔉 적당히 좋다" },
      { value: "조용한것이좋다", label: "🤫 조용한 게 좋다" },
    ],
  },
  {
    id: "q3",
    number: "03",
    text: "주로 누구와\n야구장을 방문하나요?",
    options: [
      { value: "혼자", label: "🙋 혼자" },
      { value: "친구", label: "👥 친구와 함께" },
      { value: "연인", label: "💑 연인과 함께" },
      { value: "가족", label: "👨‍👩‍👧‍👦 가족과 함께" },
    ],
  },
  {
    id: "q4",
    number: "04",
    text: "경기 중 가장\n기대되는 순간은?",
    options: [
      { value: "홈런", label: "💥 홈런 장면" },
      { value: "응원가", label: "🎵 응원가 떼창" },
      { value: "투수전", label: "⚔️ 숨막히는 투수전" },
      { value: "먹거리", label: "🌭 야구장 먹거리" },
      { value: "인증샷", label: "📷 완벽한 인증샷" },
    ],
  },
  {
    id: "q5",
    number: "05",
    text: "선호하는\n관람 스타일은?",
    options: [
      { value: "열정적으로응원", label: "🔥 열정적으로 응원" },
      { value: "경기에집중", label: "👁️ 경기에 집중" },
      { value: "편안하게관람", label: "🛋️ 편안하게 관람" },
      { value: "감성적으로즐김", label: "✨ 감성적으로 즐김" },
    ],
  },
];

export default function TestPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      trackTestStart();
      setStarted(true);
    }
  }, [started]);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      const result = calculateResult(newAnswers);
      await trackTestComplete(result);
      sessionStorage.setItem("quiz_result", result);
      sessionStorage.setItem("quiz_answers", JSON.stringify(newAnswers));
      router.push("/result");
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
      const prevId = QUESTIONS[currentQ - 1].id;
      setSelected((answers as Record<string, string>)[prevId] || null);
    }
  };

  return (
    <main className="min-h-screen bg-hw-dark diamond-pattern flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 disabled:opacity-20 transition-all"
        >
          ←
        </button>
        <div className="text-center">
          <span className="font-mono text-hw-orange text-sm">{currentQ + 1}</span>
          <span className="font-mono text-white/30 text-sm"> / {QUESTIONS.length}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-8">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-hw-orange rounded-full progress-glow"
            initial={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-5 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {/* Question number */}
            <div className="font-display text-7xl text-white/5 leading-none mb-2 select-none">
              {question.number}
            </div>

            {/* Question text */}
            <h2 className="text-xl font-bold text-white leading-relaxed mb-8 whitespace-pre-line">
              {question.text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 flex-1">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => handleSelect(opt.value)}
                  className={`option-card px-5 py-4 text-left text-sm font-medium ${
                    selected === opt.value ? "selected" : ""
                  }`}
                >
                  <span className="text-white/90">{opt.label}</span>
                  {selected === opt.value && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="float-right text-hw-orange"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="px-5 pb-8 pt-4 safe-bottom">
        <motion.button
          onClick={handleNext}
          disabled={!selected}
          whileTap={{ scale: 0.97 }}
          className={`btn-primary w-full py-5 rounded-2xl text-lg tracking-widest font-display transition-all ${
            !selected ? "opacity-30 cursor-not-allowed" : ""
          }`}
        >
          {currentQ < QUESTIONS.length - 1 ? "NEXT →" : "결과 보기 ⚾"}
        </motion.button>
      </div>
    </main>
  );
}
