import { useState } from "react";
import { PHRASEBOOK } from "../data";
import { Phrase } from "../types";
import { Search, Volume2, Bookmark, CheckCircle, Info, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

const CATEGORIES = [
  { id: "all", label: "Все фразы" },
  { id: "greetings", label: "Приветствия" },
  { id: "dining", label: "Еда и Ресторан" },
  { id: "shopping", label: "Покупки" },
  { id: "transport", label: "Транспорт" },
  { id: "emergency", label: "Экстренное" }
];

export default function Phrasebook() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const toggleFavorite = (korean: string) => {
    if (favorites.includes(korean)) {
      setFavorites(favorites.filter(f => f !== korean));
    } else {
      setFavorites([...favorites, korean]);
    }
  };

  const playPhraseSound = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(text);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Filter Logic
  const filteredPhrases = PHRASEBOOK.filter(phrase => {
    const matchesCategory = selectedCategory === "all" || phrase.category === selectedCategory;
    const matchesSearch = 
      phrase.korean.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.romanization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Category filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по фразам, транскрипции или переводу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 shadow-sm"
          />
        </div>

        {/* Categories Carousel / Badges */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:max-w-[60%] shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      {filteredPhrases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPhrases.map((phrase, idx) => (
            <motion.div
              key={phrase.korean}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.4) }}
              className={`rounded-3xl p-5 border relative flex flex-col justify-between transition-all bg-white dark:bg-zinc-900 ${
                phrase.category === "emergency"
                  ? "border-amber-100 dark:border-amber-950 bg-radial from-amber-50/5 via-transparent to-transparent"
                  : "border-zinc-100 dark:border-zinc-800"
              } shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-750`}
            >
              <div>
                {/* Topic tags and favorites button */}
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    phrase.category === "emergency"
                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                      : "bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                  }`}>
                    {phrase.category === "greetings" && "Приветствие"}
                    {phrase.category === "dining" && "Ресторан"}
                    {phrase.category === "shopping" && "Покупки"}
                    {phrase.category === "transport" && "Транспорт"}
                    {phrase.category === "emergency" && "Экстренное"}
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copyToClipboard(phrase.korean)}
                      className="p-1.5 text-zinc-300 hover:text-zinc-500 rounded-lg transition-colors cursor-pointer"
                      title="Копировать в буфер"
                    >
                      {copiedIndex === phrase.korean ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-mono hover:underline">COPY</span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleFavorite(phrase.korean)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        favorites.includes(phrase.korean)
                          ? "text-rose-500"
                          : "text-zinc-300 hover:text-rose-400"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main values */}
                <div className="mb-4">
                  <h4 className="text-2xl font-black font-serif text-zinc-900 dark:text-zinc-50 tracking-wide mb-1">
                    {phrase.korean}
                  </h4>
                  <p className="text-xs text-rose-600/70 dark:text-rose-400 font-medium tracking-tight">
                    {phrase.romanization}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2 font-medium">
                    {phrase.translation}
                  </p>
                </div>
              </div>

              {/* Interaction Row */}
              <div className="pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                {phrase.context ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 shrink">
                    <Info className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    <span className="truncate" title={phrase.context}>
                      {phrase.context}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => playPhraseSound(phrase.korean)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/70 dark:hover:bg-rose-900/30 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Слушать
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <HelpCircle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h4 className="font-semibold text-zinc-700 dark:text-zinc-300">Ничего не найдено</h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Попробуйте изменить категорию или скорректировать запрос (например: "привет", "картой", "сколько").
          </p>
        </div>
      )}
    </div>
  );
}
