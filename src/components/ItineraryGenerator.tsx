import { useState } from "react";
import { DailyItinerary } from "../types";
import { Compass, Calendar, Search, MapPin, Sparkles, Loader2, Award, ChevronRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CITIES = [
  { id: "Seoul", label: "Сеул (서울)", desc: "Столица неонового драйва и многовековых дворцов" },
  { id: "Busan", label: "Пусан (부산)", desc: "Морской мегаполис, песчаные пляжи и свежие морепродукты" },
  { id: "Jeju", label: "Остров Чеджу (제주도)", desc: "Вулканические пляжи, мандарины и тишина природы" },
  { id: "Gyeongju", label: "Кёнджу (경주)", desc: "Историческая сокровищница древней династии Силла" }
];

const STYLES = [
  { id: "balance", label: "Сбалансированный", desc: "Дворцы, кухня, парки и немного шопинга", emoji: "🎏" },
  { id: "foodie", label: "Гастро-тур", desc: "Уличные рынки, корейское барбекю, аутентичные кафе", emoji: "🥢" },
  { id: "k-culture", label: "Современная K-Culture", desc: "K-pop локации, съемочные площадки дорам, модные шоурумы", emoji: "🎤" },
  { id: "hiking-nature", label: "Природа & Горы", desc: "Подъемы на пики, прогулки у водопадов и храмы в лесу", emoji: "⛰️" }
];

const LOADING_PULSES = [
  "Маринуем кимчи для отличного настроения...",
  "Собираем чемоданы и бронируем места у иллюминатора...",
  "Прокладываем оптимальный маршрут по веткам метро...",
  "Советуемся с местными гидами в Чонно-гу...",
  "Завариваем отборный корейский чай для бодрости..."
];

export default function ItineraryGenerator() {
  const [city, setCity] = useState("Seoul");
  const [style, setStyle] = useState("balance");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [currentPulse, setCurrentPulse] = useState(LOADING_PULSES[0]);
  const [itinerary, setItinerary] = useState<DailyItinerary[] | null>(null);
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const startLoadingInterval = () => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_PULSES.length;
      setCurrentPulse(LOADING_PULSES[index]);
    }, 2800);
    return interval;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorStatus(null);
    setItinerary(null);
    const intervalId = startLoadingInterval();

    try {
      const response = await fetch("/api/gemini/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, style, days }),
      });

      const data = await response.json();
      clearInterval(intervalId);

      if (data.success && data.itinerary) {
        setItinerary(data.itinerary);
        setSelectedDayTab(1);
      } else {
        throw new Error(data.error || "Произошла ошибка при составлении архитектуры поездки.");
      }
    } catch (err: any) {
      clearInterval(intervalId);
      console.error(err);
      setErrorStatus(err.message || "Не удалось соединиться с сервером Gemini. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  const speakSound = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8">
      {/* Intro block */}
      <div className="bg-rose-500/5 dark:bg-rose-950/20 p-5 rounded-3xl border border-rose-500/10 flex flex-col sm:flex-row gap-4 items-center">
        <div className="p-3.5 bg-rose-500 text-white rounded-2xl shrink-0">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="font-serif font-bold text-zinc-900 dark:text-zinc-50 text-base">
            ИИ-Архитектор путешествий в Корею
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Наш умный гид на базе Gemini 3.5 спроектирует персонализированный почасовой тур. Никаких банальных шаблонов — только сочная корейская оригинальность!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selector Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
          {/* Target City */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              1. Выберите город
            </label>
            <div className="space-y-2">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCity(c.id)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex justify-between items-center ${
                    city === c.id
                      ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-medium"
                      : "bg-zinc-50/50 hover:bg-zinc-50 border-zinc-100 dark:border-zinc-900 text-zinc-700 dark:text-zinc-350"
                  }`}
                >
                  <div>
                    <span className="text-xs block font-semibold">{c.label}</span>
                    <span className="text-[10px] text-zinc-400 font-normal">{c.desc}</span>
                  </div>
                  {city === c.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              2. Направление увлечений
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    style === s.id
                      ? "bg-rose-50/50 border-rose-200 dark:bg-rose-950/10 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                      : "bg-zinc-50/50 hover:bg-zinc-50 border-zinc-100 dark:border-zinc-900 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-[10px] font-bold block">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Days selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              3. Длительность поездки ({days} сут.)
            </label>
            <div className="flex gap-2 p-1 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-900 justify-between">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    days === d
                      ? "bg-rose-500 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {d} {d === 1 ? "день" : (d < 5 ? "дня" : "дней")}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:scale-98 disabled:opacity-50 text-white rounded-2xl font-bold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Рассчитываем тур...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Спланировать маршрут</span>
              </>
            )}
          </button>
        </div>

        {/* Output Screen */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl p-12 border border-zinc-100 dark:border-zinc-800 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[460px]"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-rose-100 dark:border-rose-950 border-t-rose-500 animate-spin" />
                  <Compass className="w-6 h-6 text-rose-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h4 className="font-serif font-black text-lg text-zinc-900 dark:text-zinc-50">
                  Составляем идеальный план
                </h4>
                <p className="text-zinc-400 text-xs mt-2 max-w-sm">
                  {currentPulse}
                </p>
                <div className="mt-8 flex gap-1.5 py-1 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-mono text-zinc-400 tracking-tight">GEMINI ENGINE STATUS: OK</span>
                </div>
              </motion.div>
            )}

            {errorStatus && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 dark:bg-red-950/20 rounded-3xl p-8 border border-red-100 dark:border-red-900 text-center space-y-4"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
                <h4 className="font-semibold text-red-800 dark:text-red-400">Ошибка при создании маршрута</h4>
                <p className="text-xs text-red-600 max-w-md mx-auto">{errorStatus}</p>
                <p className="text-[11px] text-zinc-400">Убедитесь, что вы настроили секретный ключ API (Secrets Panel).</p>
                <button
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-red-700 transition-colors"
                >
                  Попробовать снова
                </button>
              </motion.div>
            )}

            {!loading && !errorStatus && itinerary === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-50/50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[460px]"
              >
                <div className="p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-2xl mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-zinc-700 dark:text-zinc-300">План путешествия пуст</h4>
                <p className="text-xs text-zinc-400 max-w-xs mt-1">
                  Настройте параметры в боковой колонке и нажмите кнопку «Спланировать», чтобы запустить генерацию.
                </p>
              </motion.div>
            )}

            {!loading && !errorStatus && itinerary && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Top Frame */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                      Сгенерированный маршрут
                    </span>
                    <h4 className="text-xl font-bold font-serif text-zinc-800 dark:text-white mt-0.5">
                      {CITIES.find(c => c.id === city)?.label?.split(" (")[0]} за {days} дней
                    </h4>
                  </div>
                  <span className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/20 rounded-xl text-xs font-semibold text-rose-600">
                    🏮 {STYLES.find(s => s.id === style)?.label}
                  </span>
                </div>

                {/* Day tabs selection (if multi-day) */}
                {itinerary.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {itinerary.map(dayItem => (
                      <button
                        key={dayItem.day}
                        onClick={() => setSelectedDayTab(dayItem.day)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedDayTab === dayItem.day
                            ? "bg-rose-500 text-white shadow-sm"
                            : "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:bg-zinc-50"
                        }`}
                      >
                        День {dayItem.day}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Timeline of the Active Day */}
                {itinerary
                  .filter(dayItem => dayItem.day === selectedDayTab)
                  .map(dayItem => (
                    <motion.div
                      key={dayItem.day}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Day Theme */}
                      <div className="bg-rose-50/50 dark:bg-rose-950/10 border-l-4 border-rose-500 px-5 py-4 rounded-r-2xl">
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest block">Тема дня</span>
                        <h5 className="font-serif font-bold text-lg text-zinc-800 dark:text-zinc-100 mt-1">
                          {dayItem.theme}
                        </h5>
                      </div>

                      {/* Activities Stack */}
                      <div className="relative pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 ml-4 space-y-8">
                        {dayItem.activities.map((act, index) => (
                          <div key={index} className="relative">
                            {/* Dot element representing emoji or pin */}
                            <span className="absolute -left-[38px] top-0 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-base shadow-sm shrink-0 flex items-center justify-center w-8 h-8 select-none">
                              {act.emoji || "📍"}
                            </span>

                            {/* Activity Header and contents */}
                            <div className="space-y-2">
                              {/* Timing marker & Korean subtitle */}
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="text-xs font-mono font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/35 px-2.5 py-0.5 rounded-full select-none">
                                  ⏱️ {act.time}
                                </span>
                                {act.koreanTitle && (
                                  <button
                                    onClick={() => speakSound(act.koreanTitle)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 hover:text-rose-500 cursor-pointer"
                                    title="Послушать произношение"
                                  >
                                    <span className="font-serif">{act.koreanTitle}</span>
                                    <span className="text-[9px] opacity-70">🔊</span>
                                  </button>
                                )}
                              </div>

                              {/* Russian title */}
                              <h6 className="text-base font-bold text-zinc-800 dark:text-zinc-50 font-serif">
                                {act.title}
                              </h6>

                              {/* Details */}
                              <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-normal">
                                {act.description}
                              </p>

                              {/* Insider tips */}
                              {act.tip && (
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
                                  <Award className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                  <span>
                                    <strong className="text-zinc-600 dark:text-zinc-200">Совет эксперта:</strong> {act.tip}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
