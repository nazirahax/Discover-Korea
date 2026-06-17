import { useState } from "react";
import { HOTSPOTS } from "../data";
import { Hotspot } from "../types";
import { MapPin, Compass, Clock, Award, BookOpen, ChevronRight, X, Play, Film, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CAT_LABELS = {
  all: "Все места",
  history: "История и Дворцы",
  nature: "Природа Чеджу",
  modern: "Современный Мегаполис"
};

const KOREA_VIDEOS = [
  {
    id: "seoul-4k",
    title: "Сеул — Сердце Азии в 4K",
    desc: "Захватывающее кинематографическое путешествие по футуристическим небоскребам Каннама, неоновым улицам Мёндона и древним дворцам утренней свежести.",
    embedUrl: "https://www.youtube.com/embed/2vLhCH_u9Rk",
    badge: "Кинематографический тур",
    duration: "10:15",
    previewUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cuisine-seoul",
    title: "Кулинарная Корея: Уличная Еда",
    desc: "Ароматный гид по знаменитому рынку Кванджан (Gwangjang Market). Острые клецки Токпокки, сытный Кимпап и традиционные хрустящие блины Биндетток.",
    embedUrl: "https://www.youtube.com/embed/76Y-sczB4mU",
    badge: "Гастрономия",
    duration: "15:40",
    previewUrl: "https://images.unsplash.com/photo-1553163147-622be57be1a7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "traditional-daegeum",
    title: "Звуки Чосон: Музыка Древности",
    desc: "Умиротворяющая гармония традиционного корейского двора Чосон у подножия императорского пруда. Перкуссия Самульнори и медитация Каягыма.",
    embedUrl: "https://www.youtube.com/embed/t8iA83a_H68",
    badge: "Наследие & Звуки",
    duration: "24:00",
    previewUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&q=80"
  }
];

export default function CulturalGuide() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  const filteredHotspots = HOTSPOTS.filter(hot => 
    selectedCat === "all" || hot.category === selectedCat
  );

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar justify-start md:justify-center border-b border-zinc-100 dark:border-zinc-850">
        {Object.entries(CAT_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCat(key)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              selectedCat === key
                ? "border-rose-500 text-rose-600 dark:text-rose-400 font-extrabold"
                : "border-transparent text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotspots.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-750 flex flex-col justify-between transition-all"
          >
            <div>
              {/* Image Frame */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute left-4 top-4 px-3 py-1 bg-white/95 backdrop-blur-sm dark:bg-zinc-900/95 text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase rounded-lg shadow-sm">
                  {item.category === "history" && "🏯 Культура"}
                  {item.category === "nature" && "🌋 Остров"}
                  {item.category === "modern" && "🏙️ Мегаполис"}
                </span>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-wide opacity-80">{item.koreanTitle}</span>
                  <h4 className="text-lg font-serif font-black truncate">{item.title}</h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-normal">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="px-5 pb-5 pt-2">
              <button
                onClick={() => setSelectedHotspot(item)}
                className="w-full py-2.5 bg-zinc-50 dark:bg-zinc-950 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 text-zinc-700 dark:text-zinc-350 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 group/btn"
              >
                <span>Узнать больше о культуре</span>
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Elegant Immersive Video Section */}
      <div className="pt-10 border-t border-zinc-150/50 dark:border-zinc-850/50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-widest uppercase rounded-full">
              <Film className="w-3 h-3" />
              Видео-экскурсии
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-black text-zinc-900 dark:text-zinc-50">
              Погрузитесь в атмосферу Кореи визуально
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Отобранные высококачественные видеоролики о современной и традиционной жизни в Южной Корее — еда, музыка, сакура и небоскребы.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Interactive Video Player */}
            <div className="lg:col-span-8 bg-zinc-900 dark:bg-zinc-950 rounded-3xl overflow-hidden aspect-video relative shadow-xl border border-zinc-100 dark:border-zinc-850 flex items-center justify-center">
              {isVideoPlaying ? (
                <iframe
                  src={`${KOREA_VIDEOS[activeVideoIdx].embedUrl}?autoplay=1&mute=0`}
                  title={KOREA_VIDEOS[activeVideoIdx].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-left">
                  <img
                    src={KOREA_VIDEOS[activeVideoIdx].previewUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/45 to-transparent pointer-events-none" />
                  
                  {/* Play Trigger */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </button>
                  </div>

                  <div className="relative space-y-1 max-w-md">
                    <span className="text-[10px] font-bold text-rose-450 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded">
                      {KOREA_VIDEOS[activeVideoIdx].badge} • {KOREA_VIDEOS[activeVideoIdx].duration}
                    </span>
                    <h4 className="text-lg md:text-xl font-serif font-black text-white">
                      {KOREA_VIDEOS[activeVideoIdx].title}
                    </h4>
                    <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-2">
                      {KOREA_VIDEOS[activeVideoIdx].desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Selector list */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {KOREA_VIDEOS.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    setActiveVideoIdx(idx);
                    setIsVideoPlaying(false);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex gap-3.5 items-start ${
                    activeVideoIdx === idx
                      ? "bg-rose-500/5 border-rose-400 text-rose-700 dark:text-rose-400"
                      : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-250 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-100 relative">
                    <img
                      src={vid.previewUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[10px]">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                      activeVideoIdx === idx ? "text-rose-500" : "text-zinc-400"
                    }`}>
                      {vid.badge}
                    </span>
                    <h5 className="text-xs font-bold leading-snug truncate">
                      {vid.title}
                    </h5>
                    <p className="text-[10px] text-zinc-400 truncate">
                      Длительность: {vid.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal Drawer for Hotspots */}
      <AnimatePresence>
        {selectedHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHotspot(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden w-full max-w-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              {/* Image banner inside modal */}
              <div className="h-64 relative shrink-0">
                <img
                  src={selectedHotspot.imageUrl}
                  alt={selectedHotspot.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="absolute right-4 top-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer active:scale-95 transition-transform z-20"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Visual titles inside image */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-xs opacity-80">
                    <span>{selectedHotspot.koreanTitle}</span>
                    <span>•</span>
                    <span>{selectedHotspot.location}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif font-black">{selectedHotspot.title}</h3>
                </div>
              </div>

              {/* Scrollable Contents inside Modal */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">Описание достопримечательности</h4>
                  <p className="text-sm text-zinc-700 dark:text-zinc-250 leading-relaxed font-normal">
                    {selectedHotspot.fullDetails}
                  </p>
                </div>

                {/* Practical Advice grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100/40 dark:border-zinc-850/40 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Оптимальное время визита</span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {selectedHotspot.recommendedTime}
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100/40 dark:border-zinc-850/40 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">Расположение на карте</span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {selectedHotspot.location}
                    </span>
                  </div>
                </div>

                {/* Poetic/Cultural Insight box */}
                <div className="p-4 bg-rose-500/[0.04] dark:bg-rose-950/10 border-l-4 border-rose-500 rounded-r-2xl space-y-1">
                  <span className="text-[10px] text-rose-500 font-extrabold tracking-widest uppercase block flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Культурная философия (Энциклопедия)
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-normal pl-0.5">
                    {selectedHotspot.culturalInsight}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
