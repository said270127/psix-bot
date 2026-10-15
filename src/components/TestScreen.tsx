import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Question } from "@/types";

type Props = {
  questions: Question[];
  onComplete: (answers: { questionId: number; selectedIndex: number }[]) => void;
  ageCategory: string;
};

export default function TestScreen({ questions, onComplete, ageCategory }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];
  const selected = answers[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  function handleNext() {
    if (selected === null) return;
    if (isLast) {
      setSubmitting(true);
      const result = answers.map((ans, i) => ({
        questionId: questions[i].id,
        selectedIndex: ans as number,
      }));
      onComplete(result);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-400">
              {ageCategory === "3-7" ? "3–7 yosh testi" : ageCategory === "8-13" ? "8–13 yosh testi" : ageCategory === "14-17" ? "14–17 yosh testi" : "18+ yosh testi"}
            </span>
            <span className="text-sm font-semibold text-slate-600">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
            Savol {currentIndex + 1}
          </p>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 leading-relaxed mb-6">
            {question.text}
          </h2>

          <div className="space-y-2.5">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                  selected === idx
                    ? "bg-blue-50 border-blue-400 text-slate-800 shadow-sm"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected === idx ? "border-blue-500 bg-blue-500" : "border-slate-300"
                    }`}
                  >
                    {selected === idx && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm sm:text-base">{option.label}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null || submitting}
            className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                {isLast ? "Testni yakunlash" : "Keyingi savol"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
