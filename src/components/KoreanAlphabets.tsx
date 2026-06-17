import { useState } from "react";
import { HANGUL_CHARS } from "../data";
import { HangulChar } from "../types";
import { BookOpen, Sparkles, Volume2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function KoreanAlphabets() {
  const [activeTab, setActiveTab] = useState<"consonants" | "vowels">("consonants");
  const [selectedChar, setSelectedChar] = useState<HangulChar | null>(HANGUL_CHARS[0]);

  const speakSound = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const filteredChars = HANGUL_CHARS.filter((c) =>
    activeTab === "consonants" ? c.type === "consonant" : c.type === "vowel"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Selector */}
      <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 font-serif text-lg">
                Интерактивный Хангыль
              </h3>
              <p className="text-xs text-zinc-400">Нажмите на букву для озвучивания</p>
            </div>
          </div>
          
          <div className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex gap-1">
            <button
              onClick={() => setActiveTab("consonants")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === "consonants"
                  ? "bg-white dark:bg-zinc-750 text-rose-600 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              Согласные
            </button>
            <button
              onClick={() => setActiveTab("vowels")}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === "vowels"
                  ? "bg-white dark:bg-zinc-750 text-rose-600 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              }`}
            >
              Гласные
            </button>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {filteredChars.map((item, idx) => (
            <motion.button
              key={item.char}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => {
                setSelectedChar(item);
                speakSound(item.char);
              }}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 relative cursor-pointer border transition-all ${
                selectedChar?.char === item.char
                  ? "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-600"
                  : "bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100/70 border-zinc-100 dark:border-zinc-900 text-zinc-800 dark:text-zinc-200"
              }`}
            >
              <span className="text-3xl font-extrabold font-serif mb-1">{item.char}</span>
              <span className="text-[10px] opacity-75">{item.pronunciation}</span>
              <Volume2 className="absolute right-2 bottom-2 w-3.5 h-3.5 opacity-30 hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Character Detail Visual Card */}
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          {selectedChar ? (
            <motion.div
              key={selectedChar.char}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-radial from-rose-50/20 to-transparent dark:from-zinc-900 bg-white border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 shadow-md relative overflow-hidden"
            >
              <div className="absolute right-4 top-4 opacity-5 pointer-events-none select-none text-[120px] font-bold font-serif leading-none">
                {selectedChar.char}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/20 rounded-full text-[10px] font-bold text-rose-600 tracking-wider uppercase mb-3">
                    <Sparkles className="w-3 h-3" />
                    {selectedChar.type === "consonant" ? "Согласный звук" : "Гласный звук"}
                  </div>
                  <h4 className="text-2xl font-serif font-black dark:text-white">
                    {selectedChar.name}
                  </h4>
                </div>

                <button
                  onClick={() => speakSound(selectedChar.char)}
                  className="p-3 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full transition-transform shadow-md cursor-pointer flex items-center justify-center"
                >
                  <Volume2 className="w-5 h-5 animate-pulse" />
                </button>
              </div>

              {/* Character details block */}
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                  <span className="text-xs text-zinc-400 block mb-1">Фонетика (Произношение)</span>
                  <span className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                    Русский эквивалент: <span className="text-rose-500 font-bold font-serif">"{selectedChar.pronunciation}"</span>
                  </span>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                  <span className="text-xs text-zinc-400 block mb-1">Пример использования</span>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold font-serif text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                      {selectedChar.example}
                      <button 
                        onClick={() => speakSound(selectedChar.example.split(" ")[0])}
                        className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                      >
                        <Volume2 className="w-4 h-4 cursor-pointer" />
                      </button>
                    </span>
                    <span className="text-sm text-zinc-400">[{selectedChar.exampleTrans}]</span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Значение слова: <span className="font-medium text-zinc-700 dark:text-zinc-300">"{selectedChar.meaning}"</span>
                  </div>
                </div>

                {/* Cultural tip */}
                <div className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed pl-1 pt-2 border-t border-dashed border-zinc-100 dark:border-zinc-800">
                  <HelpCircle className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
                  <span>
                    Буквы Хангыля группируются в слоговые блоки (например: {selectedChar.char} + ㅏ = 가). 
                    Чтение всегда идёт слева направо и сверху вниз. Попробуйте написать в воображении!
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-zinc-400">
              Выберите любую букву слева для подробностей
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
