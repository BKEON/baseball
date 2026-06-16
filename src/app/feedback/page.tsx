"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { trackFeedback } from "@/lib/analytics";

const OPTIONS = [
  { value: "good" as const, emoji: "👍", label: "재미있다!", color: "#FF6B00" },
  { value: "neutral" as const, emoji: "😐", label: "보통이다", color: "#F5C842" },
  { value: "bad" as const, emoji: "👎", label: "별로다", color: "#4A90D9" },
];

export default function FeedbackPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"good" | "neutral" | "bad" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    await trackFeedback(selected);
    setSubmitted(true);
    setTimeout(() => router.push("/"), 2000);
  };

  return (
    <main className="min-h-screen bg-hw-dark stadium-bg flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm text-center"
          >
            <div className="text-4xl mb-6">⭐</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              콘텐츠는 어떠셨나요?
            </h2>
            <p className="text-white/40 text-sm mb-10">
              여러분의 소감이 더 좋은 콘텐츠를 만드는 데 도움이 돼요
            </p>

            <div className="flex gap-4 justify-center mb-10">
              {OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelected(opt.value)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selected === opt.value
                      ? "scale-110"
                      : "border-white/10 bg-white/5"
                  }`}
                  style={
                    selected === opt.value
                      ? {
                          borderColor: opt.color,
                          background: `${opt.color}20`,
                          boxShadow: `0 0 20px ${opt.color}30`,
                        }
                      : {}
                  }
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: selected === opt.value ? opt.color : "rgba(255,255,255,0.5)" }}
                  >
                    {opt.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected}
              className={`btn-primary w-full py-4 rounded-2xl font-display tracking-widest text-lg ${
                !selected ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              완료
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">감사합니다!</h2>
            <p className="text-white/40 text-sm">소중한 의견을 남겨주셨어요</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
