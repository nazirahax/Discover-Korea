import { useState } from "react";
import { CULTURE_QUIZ_QUESTIONS } from "../data";
import { Award, RefreshCw, Check, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CultureQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const activeQuestion = CULTURE_QUIZ_QUESTIONS[currentIdx];

  const handleOptionClick = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOpt(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedOpt === activeQuestion.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsSubmitted(false);

    if (currentIdx < CULTURE_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6"
          >
            {/* Header: Score and Progress indicators */}
            <div className="flex justify-between items-center text-xs font-bold text-zinc-400 border-b border-zinc-50 dark:border-zinc-850 pb-4">
              <span className="uppercase tracking-widest text-[10px]">
                Вопрос {currentIdx + 1} из {CULTURE_QUIZ_QUESTIONS.length}
              </span>
              <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 rounded-full text-rose-600 font-mono tracking-wider">
                Счёт: {score}
              </span>
            </div>

            {/* Question Text */}
            <h4 className="text-lg md:text-xl font-serif font-black text-zinc-800 dark:text-zinc-50 leading-relaxed mb-4">
              {activeQuestion.question}
            </h4>

            {/* Options list */}
            <div className="space-y-3">
              {activeQuestion.options.map((opt, idx) => {
                let btnStyles = "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/50";
                
                if (selectedOpt === idx) {
                  btnStyles = "border-rose-400 bg-rose-500/5 text-rose-600 dark:text-rose-400 font-semibold";
                }

                // Correct / Incorrect evaluations after submission
                if (isSubmitted) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyles = "bg-emerald-500/10 border-emerald-400 text-emerald-600 dark:text-emerald-400 font-bold";
                  } else if (selectedOpt === idx) {
                    btnStyles = "bg-red-500/10 border-red-300 text-red-600 dark:text-red-400 line-through decoration-red-400/50";
                  } else {
                    btnStyles = "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 text-zinc-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl text-left border transition-all text-xs flex justify-between items-center ${
                      !isSubmitted ? "cursor-pointer active:scale-[0.99]" : "cursor-default"
                    } ${btnStyles}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && idx === activeQuestion.correctIndex && (
                      <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanations section */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-250 dark:border-zinc-800 flex items-start gap-3"
              >
                <BookOpen className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">Пояснение гида</span>
                  <p className="text-[11px] text-zinc-650 dark:text-zinc-300 leading-normal pl-0.5 font-normal">
                    {activeQuestion.info}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submission buttons */}
            <div className="pt-4 border-t border-zinc-50 dark:border-zinc-850 flex justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOpt === null}
                  className="px-6 py-3 bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer"
                >
                  Ответить
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-zinc-850 flex items-center gap-1.5"
                >
                  <span>{currentIdx < CULTURE_QUIZ_QUESTIONS.length - 1 ? "Дальше" : "Завершить тест"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-md text-center space-y-6"
          >
            <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-3xl shadow-lg mx-auto">
              🏆
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">Тест завершен</span>
              <h4 className="text-2xl font-serif font-black text-zinc-800 dark:text-white">Ваш результат: {score} из {CULTURE_QUIZ_QUESTIONS.length}</h4>
            </div>

            {/* Evaluation verdict */}
            <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl max-w-md mx-auto">
              {score === CULTURE_QUIZ_QUESTIONS.length ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">진짜 한국인! (Кореец на 100%)</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Невероятный результат! Вы отлично знаете тонкости традиции этикета Саланбан, каноны корейских верований и язык. Пора подавать на туристическую визу!
                  </p>
                </div>
              ) : score >= 3 ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">Опытный кореевед или дорамщик!</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Отличные познания! Вы прекрасно понимаете поведение корейцев, культуру Хангыля и бытовые особенности жизни в Сеуле.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">В поиске вдохновения!</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    Вы в самом начале захватывающего пути.South Korea полна удивительных сюрпризов. Почитайте наши статьи, покрутите интерактивный разговорник и попробуйте пройти тест еще раз!
                  </p>
                </div>
              )}
            </div>

            {/* Restart button */}
            <button
              onClick={handleRestart}
              className="px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-rose-500 rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Пройти повторно
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
