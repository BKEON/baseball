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
    text: "친구가 \"오늘 야구장 갈래?\"라고\n물었을 때 나의 첫 반응은?",
    options: [
      { value: "열정응원", label: "🔥 대박! 나 응원가 다 외워 갈래!" },
      { value: "먹방", label: "🍗 거기 요즘 맛있는 거 뭐 팔아? 요아정?" },
      { value: "가족피크닉", label: "☀️ 날씨 좋은데 밖에서 돗자리 펴고 놀면 좋겠다~" },
      { value: "낄끼빠빠", label: "😏 재밌겠다! 근데 지루하면 중간에 나와도 되지?" },
    ],
  },
  {
    id: "q2",
    number: "02",
    text: "야구장에 도착했을 때\n가장 설레는 순간은?",
    options: [
      { value: "앰프응원", label: "🔊 쿵광거리는 앰프 소리와 응원가 소리" },
      { value: "매점대기", label: "🌭 맛있는 냄새 가득한 매점 앞 대기" },
      { value: "잔디하늘", label: "🌿 푸른 잔디밭과 탁 트인 하늘을 바라볼 때" },
      { value: "조명설렘", label: "💡 경기장 조명이 켜지며 느껴지는 설렘" },
    ],
  },
  {
    id: "q3",
    number: "03",
    text: "경기가 시작됐다!\n나의 야구장 관람 자세는?",
    options: [
      { value: "서서응원", label: "🎤 9이닝 내내 서서 배트 치며 노래 부르기" },
      { value: "먹방흡입", label: "🍺 한 손엔 떡볶이, 한 손엔 맥주 끊임없이 흡입하기" },
      { value: "도란도란", label: "📸 편하게 기대앉아 도란도란 인증샷 찍기" },
      { value: "자유왔다", label: "📱 경기 보다가 폰 보다가 자유롭게 왔다 갔다" },
    ],
  },
  {
    id: "q4",
    number: "04",
    text: "우리 팀이 큰 점수 차로\n지고 있다. 이때 나는?",
    options: [
      { value: "역전응원", label: "📣 \"역전할 수 있어!\" 목이 터져라 응원한다" },
      { value: "먹는게우선", label: "🌶️ 지는 건 지는 거고 매운 거 먹으러 가자" },
      { value: "셀카남는건", label: "🤳 \"남는 건 사진뿐이야\" 다 같이 셀카 찍기" },
      { value: "지금나가자", label: "🏃 \"차 막히기 전에 지금 나가자!\" 짐을 싼다" },
    ],
  },
  {
    id: "q5",
    number: "05",
    text: "야구장에서 내가 생각하는\n최고의 명당 기준은?",
    options: [
      { value: "치어리더명당", label: "💃 치어리더와 선수들이 가장 잘 보이는 곳" },
      { value: "테이블명당", label: "🍽️ 음식을 안정적으로 놓을 수 있는 테이블석" },
      { value: "돗자리명당", label: "🛋️ 편하게 다리 뻗거나 돗자리 펼 수 있는 넓은 곳" },
      { value: "통로명당", label: "🚪 화장실·출구로 탈출하기 쉬운 통로쪽" },
    ],
  },
  {
    id: "q6",
    number: "06",
    text: "야구 경기는 보통 3시간 이상!\n나의 적당한 관람 시간은?",
    options: [
      { value: "연장전가능", label: "⚾ 연장전까지 가도 좋아! 밤새 응원 가능" },
      { value: "다먹을때까지", label: "🍖 맛있는 거 다 먹을 때까지가 내 관람 시간" },
      { value: "노을여유", label: "🌅 낮에 들어가서 노을 지는 것까지 보는 여유" },
      { value: "5이닝OUT", label: "⏱️ 5이닝 집중해서 보고, 루즈해지면 OUT!" },
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

  const handleSelect = (value: string) => setSelected(value);

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
            <div className="font-display text-7xl text-white/5 leading-none mb-2 select-none">
              {question.number}
            </div>
            <h2 className="text-xl font-bold text-white leading-relaxed mb-8 whitespace-pre-line">
              {question.text}
            </h2>

            <div className="flex flex-col gap-3 flex-1">
              {question.options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => handleSelect(opt.value)}
                  className={`option-card px-5 py-4 text-left text-sm font-medium ${selected === opt.value ? "selected" : ""}`}
                >
                  <span className="text-white/90">{opt.label}</span>
                  {selected === opt.value && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="float-right text-hw-orange">✓</motion.span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 pb-8 pt-4 safe-bottom">
        <motion.button
          onClick={handleNext}
          disabled={!selected}
          whileTap={{ scale: 0.97 }}
          className={`btn-primary w-full py-5 rounded-2xl text-lg tracking-widest font-display transition-all ${!selected ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          {currentQ < QUESTIONS.length - 1 ? "NEXT →" : "결과 보기 ⚾"}
        </motion.button>
      </div>
    </main>
  );
}
