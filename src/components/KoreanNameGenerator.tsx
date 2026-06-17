import { useState } from "react";
import { NameResult } from "../types";
import { Sparkles, User, Gift, Check, ShieldAlert, Key, Clipboard, Volume2, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const TRAITS = [
  { id: "wise", label: "Мудрый / Умный (지혜)", emoji: "🧠" },
  { id: "creative", label: "Творческий (예술)", emoji: "🎨" },
  { id: "calm", label: "Мирный / Спокойный (평화)", emoji: "🍂" },
  { id: "strong", label: "Сильный / Храбрый (용기)", emoji: "⚔️" },
  { id: "kind", label: "Добродушный (친절)", emoji: "🌸" },
  { id: "bright", label: "Яркий / Веселый (밝은)", emoji: "☀️" },
  { id: "independent", label: "Свободный (자유)", emoji: "🌊" }
];

const SEASONS = [
  { id: "spring", label: "Весна (봄)", color: "text-emerald-500 hover:bg-emerald-50/20" },
  { id: "summer", label: "Лето (여름)", color: "text-amber-500 hover:bg-amber-50/20" },
  { id: "autumn", label: "Осень (가을)", color: "text-orange-500 hover:bg-orange-50/20" },
  { id: "winter", label: "Зима (겨울)", color: "text-sky-500 hover:bg-sky-50/20" }
];

export default function KoreanNameGenerator() {
  const [originalName, setOriginalName] = useState("");
  const [gender, setGender] = useState("female");
  const [season, setSeason] = useState("spring");
  const [selectedTraits, setSelectedTraits] = useState<string[]>(["wise", "kind"]);
  const [loading, setLoading] = useState(false);
  const [nameResult, setNameResult] = useState<NameResult | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleTrait = (id: string) => {
    if (selectedTraits.includes(id)) {
      if (selectedTraits.length > 1) {
        setSelectedTraits(selectedTraits.filter(t => t !== id));
      }
    } else {
      if (selectedTraits.length < 3) {
        setSelectedTraits([...selectedTraits, id]);
      }
    }
  };

  const speakSound = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const copyName = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async () => {
    if (!originalName.trim()) {
      setErrorStatus("Пожалуйста, введите свое имя.");
      return;
    }

    setLoading(true);
    setErrorStatus(null);
    setNameResult(null);

    const traitLabels = TRAITS.filter(t => selectedTraits.includes(t.id)).map(t => t.label);

    try {
      const response = await fetch("/api/gemini/generate-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalName,
          gender,
          season,
          traits: traitLabels
        })
      });

      const data = await response.json();
      if (data.success && data.nameResult) {
        setNameResult(data.nameResult);
      } else {
        throw new Error(data.error || "Ошибка генерации корейского имени.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "Не удалось связаться с сервером Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Parameter entry panel */}
      <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
        <div>
          <div className="flex gap-2 items-center text-rose-500 mb-2">
            <Gift className="w-5 h-5" />
            <h3 className="font-semibold text-lg font-serif text-zinc-800 dark:text-zinc-50">Параметры Имени</h3>
          </div>
          <p className="text-xs text-zinc-400">
            В Корее имя — это пожелание судьбы и отражение вашей внутренней сути. Укажите ваши качества!
          </p>
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Ваше имя (на русском / латинице)
          </label>
          <input
            type="text"
            placeholder="Например: Александр или Анна"
            value={originalName}
            onChange={(e) => {
              setOriginalName(e.target.value);
              if (errorStatus) setErrorStatus(null);
            }}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>

        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Гендерный оттенок
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900">
            {["female", "male", "neutral"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-2 text-xs font-semibold rounded-lg text-center transition-all cursor-pointer ${
                  gender === g
                    ? "bg-white dark:bg-zinc-750 text-rose-500 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {g === "female" && "Женское"}
                {g === "male" && "Мужское"}
                {g === "neutral" && "Унисекс"}
              </button>
            ))}
          </div>
        </div>

        {/* Seasons selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Ваше любимое время года
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SEASONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer select-none ${
                  season === s.id
                    ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900 text-rose-600 font-bold"
                    : "bg-zinc-50/50 hover:bg-zinc-50 border-zinc-100 dark:border-zinc-900 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Traits selection (Max 3) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Ваши качества (от 1 до 3)
            </label>
            <span className="text-[10px] text-zinc-400">выбрано: {selectedTraits.length}/3</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {TRAITS.map((t) => {
              const active = selectedTraits.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTrait(t.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                    active
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-zinc-50/50 hover:bg-zinc-50 border-zinc-100 dark:border-zinc-900 text-zinc-600 dark:text-zinc-350"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label.split(" (")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error warning */}
        {errorStatus && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">
            ⚠️ {errorStatus}
          </div>
        )}

        {/* Trigger Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:scale-98 disabled:opacity-50 text-white rounded-2xl font-bold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Создаем имя...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Сгенерировать имя</span>
            </>
          )}
        </button>
      </div>

      {/* Result Display Card */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[460px]"
            >
              <div className="relative mb-6">
                <RefreshCw className="w-12 h-12 text-rose-500/35 animate-spin" />
                <User className="w-6 h-6 text-rose-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
              </div>
              <h4 className="font-serif font-black text-lg text-zinc-900 dark:text-zinc-50">Вычисляем гармонию звуков</h4>
              <p className="text-zinc-400 text-xs mt-2 max-w-xs">
                Сопоставляем благословение иероглифов Ханьцзя с временами года и вашим характером...
              </p>
            </motion.div>
          ) : nameResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-rose-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden"
            >
              {/* Caligraphy Background Accent Decal */}
              <div className="absolute right-4 top-4 text-[120px] md:text-[160px] font-black font-serif text-rose-500/5 leading-none select-none pointer-events-none">
                {nameResult.koreanNameHangul}
              </div>

              {/* Title Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">
                    Даровано ИИ Судьбоносное имя
                  </span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Сгенерировано для: <span className="font-semibold text-zinc-700 dark:text-zinc-200">"{originalName}"</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => speakSound(nameResult.koreanNameHangul)}
                    className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl hover:bg-rose-100/70 cursor-pointer active:scale-95 transition-transform"
                    title="Послушать правильный звук"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => copyName(`${nameResult.koreanNameHangul} (${nameResult.koreanNameRomanized})`)}
                    className="p-3 bg-zinc-50 dark:bg-zinc-950 text-zinc-400 rounded-xl hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                    title="Копировать имя"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Clipboard className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Huge caligraphy display */}
              <div className="text-center py-8 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-3xl border border-zinc-100 dark:border-zinc-850 mb-6">
                <span className="text-6xl md:text-7xl font-sans font-black tracking-widest text-zinc-900 dark:text-white block select-text">
                  {nameResult.koreanNameHangul}
                </span>
                <span className="text-lg md:text-xl font-medium tracking-tight text-rose-500/80 block mt-2 select-text">
                  {nameResult.koreanNameRomanized}
                </span>
              </div>

              {/* Grid specifics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                  <span className="text-xs text-zinc-400 block mb-1">Иероглифы Ханча</span>
                  <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 block font-serif">
                    {nameResult.hanja}
                  </span>
                  <p className="text-[11px] text-zinc-500 mt-2 italic leading-normal">
                    {nameResult.hanjaMeaning}
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                  <span className="text-xs text-zinc-400 block mb-1">Советы по артикуляции</span>
                  <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-normal">
                    {nameResult.accentTips}
                  </p>
                </div>
              </div>

              {/* Deep meaning content */}
              <div className="p-5 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100/30 rounded-2xl">
                <span className="text-xs text-rose-500 font-bold tracking-wider uppercase block mb-2">
                  Поэтическая философия имени
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-350 leading-relaxed font-normal">
                  {nameResult.overallMeaning}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="bg-zinc-50/50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[460px]">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-2xl mb-4">
                <User className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-zinc-700 dark:text-zinc-300">Ожидание сотворения имени</h4>
              <p className="text-xs text-zinc-400 max-w-xs mt-1">
                Заполните форму слева и нажмите кнопку генерации, чтобы получить корейское имя с аутентичными иероглифами Ханьцзя!
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
