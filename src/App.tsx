import { useState, useEffect, useRef } from "react";
import { 
  Compass, 
  BookOpen, 
  MessageSquare, 
  User, 
  MapPin, 
  Award, 
  HelpCircle, 
  Music, 
  Sun, 
  Moon, 
  VolumeX, 
  Volume2, 
  Clock, 
  Heart,
  Globe,
  X,
  ZoomIn,
  Send,
  Loader2,
  Sparkles,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Sub-components
import CulturalGuide from "./components/CulturalGuide";
import KoreanAlphabets from "./components/KoreanAlphabets";
import Phrasebook from "./components/Phrasebook";
import ItineraryGenerator from "./components/ItineraryGenerator";
import KoreanNameGenerator from "./components/KoreanNameGenerator";
import CultureQuiz from "./components/CultureQuiz";
import CultureAdvisorChat from "./components/CultureAdvisorChat";
import KakaoMap from "./components/KakaoMap";

type TabId = "guide" | "alphabet" | "phrases" | "itinerary" | "name" | "quiz" | "chat" | "map";

const BANNER_IMAGES = [
  {
    id: "palace",
    title: "Императорский Дворец Кёнбоккун",
    title_en: "Gyeongbokgung Imperial Palace",
    title_ko: "경복궁 (景福宮)",
    korean: "경복궁 (景福宮)",
    desc: "Главный дворец династии Чосон, возведенный в 1395 году. Название переводится как 'Дворец сияющего счастья'.",
    desc_en: "The main palace of the Joseon Dynasty, built in 1395. Its name translates to 'Palace of Shining Happiness'.",
    desc_ko: "1395년에 창건된 조선 왕조의 법궁(정궁)으로, 이름에는 '새 왕조가 큰 복을 누려 번영할 것'이라는 염원이 담겨 있습니다.",
    url: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    insight: "Построен по канонам Пхунсу (геомантии) — спиной к горе Бугаксан и лицом к реке.",
    insight_en: "Built according to Pungsu (feng shui) principles — with Mt. Bugaksan behind and the river in front.",
    insight_ko: "백악산(북악산)을 뒤로 하고 한강물줄기를 바라보는 배산임수(背山臨水)의 풍수지리 명당에 입지해 있습니다."
  },
  {
    id: "hanok",
    title: "Улочки Букчхон Ханок",
    title_en: "Bukchon Hanok Village streets",
    title_ko: "북촌 한옥마을",
    korean: "북촌한옥ма을",
    desc: "Живописный квартал Сеула с аутентичными глиняно-деревянными домиками с загнутыми крышами.",
    desc_en: "A picturesque neighborhood in Seoul filled with authentic clay-and-wood traditional homes with curved tile roofs.",
    desc_ko: "구불구불한 골목길 사이로 유려한 아름다움을 지닌 기와 친환경 목조 한옥들이 모여 있는 서울의 대표적 명소입니다.",
    url: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
    insight: "Дома обогревались системой Ондоль — дымовыми газами под полом комнат.",
    insight_en: "These classic multi-generational homes were heated by Ondol — hot smoke moving through sub-floor channels.",
    insight_ko: "방바닥 아래 구들장에 불을 지펴 구들장 전체를 따뜻하게 데우는 한국 고유의 온돌 난방 방식으로 겨울을 났습니다."
  },
  {
    id: "gyeongju",
    title: "Весенние сады Кёнджу",
    title_en: "Spring Gardens of Gyeongju",
    title_ko: "신라의 고도 경주",
    korean: "경주 (慶州)",
    desc: "Древнейшая столица царства Силла, утопающая весной в нежно-розовом цвету сакуры.",
    desc_en: "The ancient capital of the Silla Kingdom, beautifully covered in soft pink cherry blossoms in spring.",
    desc_ko: "찬란했던 천년 신라 왕조의 고도로서, 매년 봄철이면 찬란한 연분홍빛 벚꽃 눈망울로 온 시내가 물듭니다.",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
    insight: "Кёнджу часто называют 'музеем под открытым небом' благодаря обилию наследия ЮНЕСКО.",
    insight_en: "Gyeongju is known as the 'museum without walls' due to its incredible number of UNESCO World Heritage treasures.",
    insight_ko: "도시전체가 유네스코 세계문화유산 유적지 및 무덤, 석탑이 가득하여 '노천 박물관'이라는 수식어를 가지고 있습니다."
  },
  {
    id: "jeju",
    title: "Вулканический остров Чеджу",
    title_en: "Volcanic Jeju Island",
    title_ko: "환상의 섬 제주도",
    korean: "제주도 (濟州島)",
    desc: "Остров ветров, причудливых лавовых скал и знаменитых ныряльщиц Хэнё.",
    desc_en: "A volcanic island famous for strong winds, unique black basalt lava formations, and legendary Haenyeo female divers.",
    desc_ko: "화산 폭발로 만들어진 신비로운 풍광과 에메랄드빛 바다, 기암괴석, 그리고 산소통 없이 거친 바да로 향하는 해녀들이 공존하는 평화로운 휴양의 섬입니다.",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    insight: "Знаменит каменными дедушками 'Харыбанами', оберегающими местных жителей от невзгор.",
    insight_en: "Jeju is protected by basalt 'Dol Hareubang' stone grandfather statues carved to ward off negative spirits.",
    insight_ko: "제주도 곳곳에는 구멍이 숭숭 뚫린 화산석을 깎아 만든 수호신 '돌하르방'이 마을 입구를 지키며 액운을 막아줍니다."
  }
];

const TRANSLATIONS = {
  ru: {
    tagline: "✨ Погрузитесь в страну восходящей гармонии",
    title: "Откройте Для Себя ",
    titleHighlight: "Южную Корею",
    description: "Интерактивный портал со всеми сокровищами Страны утренней свежести: от алфавита Хангыль и озвученного разговорника до умного планировщика путешествий, генератора корейских имен и ИИ-советника по культуре.",
    picturesTitle: "Картины и пейзажи Кореи",
    picturesSub: "нажмите для погружения в культуру",
    culturalContext: "Культурный Контекст",
    scenicDescription: "Пояснение пейзажа",
    btnVoice: "Озвучить имя KST",
    btnClose: "Закрыть",
    clockSeoul: "Сеул KST",
    portalSubtitle: "Интерактивный культурно-языковой портал",
    fluteBtn: "Дэгым флейта",
    madeWithLove: "Сделано с любовью",
    andAi: "и интеллектом на базе Gemini 3.5",
    tabGuide: "Места и Наследие",
    tabAlphabet: "Азбука Хангыль",
    tabPhrases: "Разговорник + Музыка",
    tabItinerary: "ИИ-Маршруты",
    tabName: "Корейское Имя",
    tabQuiz: "Викторина",
    tabAdvisor: "ИИ-Советник",
    tabMap: "Карта Kakao Map",
    musicTitle: "Включить успокаивающую традиционную флейту Дэгым",
  },
  en: {
    tagline: "✨ Immerse yourself in the land of rising harmony",
    title: "Discover ",
    titleHighlight: "South Korea",
    description: "An interactive portal featuring all the treasures of the Land of the Morning Calm: from the Hangul alphabet and spoken phrasebook to an AI itinerary planner, Korean name generator, and AI cultural guide.",
    picturesTitle: "Scenic Paintings & Landscapes of Korea",
    picturesSub: "click to immerse in the culture",
    culturalContext: "Cultural Context",
    scenicDescription: "Scenery Description",
    btnVoice: "TTS Pronounce Name",
    btnClose: "Close",
    clockSeoul: "Seoul KST",
    portalSubtitle: "Interactive Cultural & Language Portal",
    fluteBtn: "Daegeum Flute",
    madeWithLove: "Made with love",
    andAi: "and intelligence powered by Gemini 3.5",
    tabGuide: "Sights & Heritage",
    tabAlphabet: "Hangul Alphabet",
    tabPhrases: "Phrasebook & Music",
    tabItinerary: "AI Itineraries",
    tabName: "Korean Name",
    tabQuiz: "Culture Quiz",
    tabAdvisor: "AI Advisor",
    tabMap: "Kakao Map",
    musicTitle: "Turn on calming traditional master Daegeum flute",
  },
  ko: {
    tagline: "✨ 조화와 활력이 넘치는 나라로 여러분을 초대합니다",
    title: "아름다운 ",
    titleHighlight: "대한민국 발견하기",
    description: "한글 자모음 학습과 생생한 발음의 회화첩, 스마트 AI 여행 일정 생성기, 한국식 이름 짓기, AI 문화 컨설턴트까지 '고요한 아침의 나라' 한국의 모든 보물을 담은 인터랙티브 포털입니다.",
    picturesTitle: "한국의 아름다운 풍경과 명화",
    picturesSub: "클릭하여 한국의 풍경과 문화를 체험해보세요",
    culturalContext: "문화적 배경",
    scenicDescription: "풍경 설명",
    btnVoice: "한국어 발음 듣기",
    btnClose: "닫기",
    clockSeoul: "서울 표준시 KST",
    portalSubtitle: "상호작용형 문화 및 언어 지식 포털",
    fluteBtn: "대금 연주",
    madeWithLove: "정성을 담아 제작됨",
    andAi: "및 Gemini 3.5 기반 인공지능",
    tabGuide: "명소 및 문화유산",
    tabAlphabet: "한글 배움터",
    tabPhrases: "서바이벌 회화방",
    tabItinerary: "AI 특별일정",
    tabName: "한국 고유이름",
    tabQuiz: "궁금증 퀴즈",
    tabAdvisor: "AI 문화지킴이",
    tabMap: "카카오맵 투어",
    musicTitle: "차분하고 은은한 전통 대금 대나무 피리 소리를 켭니다",
  }
};

const BANNER_CHIP_PROMPTS = {
  ru: [
    { label: "🥘 K-Food", query: "Расскажи про корейскую кухню и культуру Чимек." },
    { label: "🎎 " + "Этикет за столом", query: "Каковы основные правила этикета за столом в Корее?" },
    { label: "🚇 Сабвей Сеула", query: "Как устроен общественный транспорт и метро в Сеуле?" },
    { label: "🏛️ Королевские дворцы", query: "Какие дворцы Сеула стоит посетить в первую очередь?" }
  ],
  en: [
    { label: "🥘 K-Food", query: "Tell me about traditional Korean cuisine and Chimaek culture." },
    { label: "🎎 Dining Etiquette", query: "What are the core dining etiquette rules in Korea?" },
    { label: "🚇 Seoul Subway", query: "How does the metro and transit system work in Seoul?" },
    { label: "🏛️ Royal Palaces", query: "Which royal palaces in Seoul are a must-visit and why?" }
  ],
  ko: [
    { label: "🥘 전통음식", query: "한국의 전통 음식과 치맥 문화에 대해 알려줘." },
    { label: "🎎 식사 예절", query: "한국에서의 올바른 식사 예절과 주의할 점은 무엇인가요?" },
    { label: "🚇 대중교통", query: "서울의 대중교통 및 지하철 환승 시스템에 대해 알려줘." },
    { label: "🏛️ 조선 궁궐", query: "서울의 조선시대 주요 궁궐들과 방문 팁은 무엇인가요?" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("guide");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [seoulTime, setSeoulTime] = useState<string>("");
  const [isPlayingSynth, setIsPlayingSynth] = useState<boolean>(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [synthTimerId, setSynthTimerId] = useState<any>(null);
  const [activeImageModal, setActiveImageModal] = useState<typeof BANNER_IMAGES[0] | null>(null);
  const [lang, setLang] = useState<"ru" | "en" | "ko">("ru");

  // Banner Chatbot states
  const [bannerChatMessages, setBannerChatMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Привет! Я ваш ИИ-консультант. Спросите меня о корейских обычаях, K-Food, транспорте или традициях!"
    }
  ]);
  const [bannerInput, setBannerInput] = useState("");
  const [bannerChatLoading, setBannerChatLoading] = useState(false);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  // Sync banner default message when lang changes
  useEffect(() => {
    setBannerChatMessages([
      {
        role: "assistant",
        content: lang === "ko" 
          ? "안녕하세요! 한국의 역사, 문화, 음식에 대해 무엇이든 물어보세요." 
          : lang === "en" 
            ? "Hello! I am your AI Culture Advisor. Ask me anything about Korean traditions, foods, or transport!" 
            : "Привет! Я ваш ИИ-консультант. Спросите меня о корейских обычаях, K-Food, транспорте или традициях!"
      }
    ]);
  }, [lang]);

  // Scroll to bottom on message updates
  useEffect(() => {
    bannerScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bannerChatMessages]);

  const sendBannerMessage = async (text: string) => {
    if (!text.trim() || bannerChatLoading) return;
    
    // Add user message
    const updatedMessages = [...bannerChatMessages, { role: "user", content: text }];
    setBannerChatMessages(updatedMessages);
    setBannerInput("");
    setBannerChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: bannerChatMessages
        })
      });

      const data = await response.json();
      if (data.success && data.responseText) {
        setBannerChatMessages(prev => [...prev, { role: "assistant", content: data.responseText }]);
      } else {
        throw new Error(data.error || "Ошибка подключения.");
      }
    } catch (err: any) {
      console.error(err);
      setBannerChatMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: lang === "ko"
            ? "⚠️ 응답을 가져오지 못했습니다. API 키 구성을 확인하십시오."
            : lang === "en"
              ? "⚠️ Failed to get reply. Please make sure your API key is correctly configured."
              : `⚠️ Ошибка: ${err.message || 'не удалось получить ответ.'}. Проверьте ключ API.`
        }
      ]);
    } finally {
      setBannerChatLoading(false);
    }
  };

  // 1. Seoul Local Clock (KST is UTC+9)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate Seoul time by getting UTC time and adding +9 hours
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const seoul = new Date(utc + (3600000 * 9));
      
      const hours = String(seoul.getHours()).padStart(2, "0");
      const minutes = String(seoul.getMinutes()).padStart(2, "0");
      const seconds = String(seoul.getSeconds()).padStart(2, "0");
      setSeoulTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Beautiful Traditional Pentatonic Flute (Daegeum-style) Synthesizer using Web Audio API
  const toggleAmbientMusic = () => {
    if (isPlayingSynth) {
      // Turn off
      if (synthTimerId) {
        clearInterval(synthTimerId);
        setSynthTimerId(null);
      }
      setIsPlayingSynth(false);
      return;
    }

    // Turn on
    let ctx = audioCtx;
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
    }

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    setIsPlayingSynth(true);

    // Traditional Pentatonic Scale (A4, C5, D5, E5, G5)
    const pitches = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

    // Soft melody note triggers
    const playNote = () => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // We also add a simple lowpass filter to replicate the warm woodwind color
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Random pitch from the scale
      const randomFreq = pitches[Math.floor(Math.random() * pitches.length)];
      osc.frequency.setValueAtTime(randomFreq, ctx.currentTime);

      // Add a tiny vibrato to mimic bamboo breath control
      osc.frequency.linearRampToValueAtTime(randomFreq + 4, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(randomFreq - 3, ctx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(randomFreq, ctx.currentTime + 1.2);

      // Daegeum flute wind sound approximation
      osc.type = "sine";

      // Gentle envelope attack, sustain, decay
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.4); // volume scale
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.6);
    };

    // Play immediately, then loop every 3.2 seconds
    playNote();
    const timer = setInterval(() => {
      playNote();
    }, 3200);

    setSynthTimerId(timer);
  };

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (synthTimerId) {
        clearInterval(synthTimerId);
      }
    };
  }, [synthTimerId]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-850"
    }`}>
      
      {/* 1. Global Navigation Head Rail */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo with Traditional Taegeuk Embem */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 via-rose-500 to-rose-600 p-0.5 flex items-center justify-center shadow-md overflow-hidden select-none">
              {/* Symbolic Taegeuk curved divider line */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-rose-600 opacity-80" />
              <Globe className="w-5 h-5 text-white/95 relative animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                  Discover Korea
                </span>
                <span className="text-[10px] bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-md font-serif">
                  한류
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">{TRANSLATIONS[lang].portalSubtitle}</p>
            </div>
          </div>

          {/* Quick Stats: Seoul local Time clock + Flute Music Zen synth */}
          <div className="flex items-center gap-4">
            
            {/* Quick mini switcher */}
            <div className="hidden md:flex bg-zinc-50 dark:bg-zinc-900/80 p-0.5 rounded-xl border border-zinc-150/45 dark:border-zinc-850 gap-0.5">
              {[
                { code: "ru", flag: "🇷🇺", label: "RU" },
                { code: "en", flag: "🇺🇸", label: "EN" },
                { code: "ko", flag: "🇰🇷", label: "KO" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as any)}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                    lang === l.code
                      ? "bg-rose-500 text-white shadow-xs"
                      : "text-zinc-450 hover:text-zinc-700 dark:hover:text-zinc-200"
                  }`}
                  title={l.label}
                >
                  <span>{l.flag}</span>
                  <span className="font-mono text-[10px]">{l.label}</span>
                </button>
              ))}
            </div>

            {/* Ambient Flute */}
            <button
              onClick={toggleAmbientMusic}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                isPlayingSynth
                  ? "bg-rose-500/10 border-rose-300 text-rose-600 dark:text-rose-400 font-bold shadow-xs animate-pulse"
                  : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-850 text-zinc-400 hover:text-zinc-700"
              }`}
              title={TRANSLATIONS[lang].musicTitle}
            >
              <Music className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{TRANSLATIONS[lang].fluteBtn}</span>
              {isPlayingSynth ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Local Clock */}
            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-150/45 dark:border-zinc-850 flex items-center gap-2 select-none">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider block leading-none font-bold">{TRANSLATIONS[lang].clockSeoul}</span>
                <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100 mr-1 block mt-0.5">{seoulTime || "00:00:00"}</span>
              </div>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Elegant Core Visual Intro Banner */}
      <section className="relative overflow-hidden pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side: Intro, Language select, and scenic images */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left flex flex-col justify-center">
              
              <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 bg-white/40 dark:bg-zinc-900/40 rounded-full border border-zinc-200/40 dark:border-zinc-800/40 text-[10px] font-bold tracking-widest uppercase text-rose-600 dark:text-rose-400">
                <span>{TRANSLATIONS[lang].tagline}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                {TRANSLATIONS[lang].title}
                <span className="text-rose-500 underline decoration-rose-250 decoration-wavy underline-offset-8">
                  {TRANSLATIONS[lang].titleHighlight}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {TRANSLATIONS[lang].description}
              </p>

              {/* Master Interactive Core Banner Language Switcher Buttons with customized state feedback */}
              <div className="flex justify-center lg:justify-start items-center gap-3 pt-2">
                {[
                  { code: "ko", name: "한국어", flag: "🇰🇷" },
                  { code: "en", name: "English", flag: "🇺🇸" },
                  { code: "ru", name: "Русский", flag: "🇷🇺" }
                ].map((bt) => (
                  <motion.button
                    key={bt.code}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLang(bt.code as any)}
                    className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                      lang === bt.code
                        ? "bg-rose-500 text-white border-rose-500 shadow-md scale-102"
                        : "bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-200/60 dark:border-zinc-800/80 hover:border-rose-400/60 hover:text-rose-555 dark:hover:text-rose-400"
                    }`}
                  >
                    <span className="text-sm">{bt.flag}</span>
                    <span>{bt.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Interactive Scenic Scenic Images Grid */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3 px-1">
                  <span className="text-[10px] uppercase tracking-widest font-black text-rose-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {TRANSLATIONS[lang].picturesTitle}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium font-mono">{TRANSLATIONS[lang].picturesSub}</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BANNER_IMAGES.map((img) => {
                    const localizedTitle = lang === "ko" ? img.title_ko : lang === "en" ? img.title_en : img.title;
                    const localizedDesc = lang === "ko" ? img.desc_ko : lang === "en" ? img.desc_en : img.desc;
                    return (
                      <motion.div
                        key={img.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveImageModal(img);
                          if (window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                            const utterance = new SpeechSynthesisUtterance(img.korean.split(" ")[0]);
                            utterance.lang = "ko-KR";
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="group relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md border border-zinc-100 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-900 transition-all duration-300"
                      >
                        <img
                          src={img.url}
                          alt={localizedTitle}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                        
                        {/* Decorative frame corners */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 border border-white/5 rounded-lg pointer-events-none group-hover:border-rose-400/20 transition-all" />
                        
                        {/* Text Details overlay */}
                        <div className="absolute bottom-2 left-2 right-2 text-left">
                          <span className="text-[8px] font-mono font-bold text-rose-450 tracking-wide block mb-0.5">
                            {img.korean}
                          </span>
                          <h3 className="text-[10px] font-serif font-black text-white leading-tight group-hover:text-rose-100 transition-colors line-clamp-1">
                            {localizedTitle}
                          </h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right side: Interactive, Live Cultural Chatbot Card */}
            <div className="lg:col-span-5 h-full flex flex-col justify-center w-full">
              <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-3xl shadow-lg flex flex-col overflow-hidden max-h-[480px] backdrop-blur-md">
                
                {/* Chatbox Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-850">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full animate-ping" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold font-serif text-zinc-800 dark:text-zinc-50 flex items-center gap-1">
                        {lang === "ko" ? "AI 문화 컨설턴트" : lang === "en" ? "AI Culture Advisor" : "ИИ-Консультант"}
                        <Sparkles className="w-3 h-3 text-rose-500 animate-pulse" />
                      </h4>
                      <span className="text-[9px] text-zinc-400 block font-mono">
                        {lang === "ko" ? "실시간 답변 제공" : lang === "en" ? "Online • Powered by Gemini" : "Онлайн • на базе Gemini"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Small link to full chat tab with nice hover */}
                  <button 
                    onClick={() => setActiveTab("chat")}
                    className="text-[10px] text-rose-500 hover:text-white hover:bg-rose-500 font-semibold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    <span>{lang === "ko" ? "전체 보기" : lang === "en" ? "Full Chat" : "Режим чата"}</span>
                  </button>
                </div>

                {/* Message Viewport */}
                <div className="flex-1 my-3 overflow-y-auto space-y-3 pr-1 py-1 text-left min-h-[160px] max-h-[220px] scrollbar-thin">
                  {bannerChatMessages.map((msg, idx) => {
                    const isBot = msg.role === "assistant";
                    return (
                      <div key={idx} className={`flex gap-2.5 max-w-[90%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                          isBot ? "bg-rose-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                        }`}>
                          {isBot ? "🤖" : "👤"}
                        </div>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                          isBot 
                            ? "bg-zinc-50 dark:bg-zinc-950 rounded-tl-none border border-zinc-100/60 dark:border-zinc-900/50 text-zinc-700 dark:text-zinc-350 shadow-xs" 
                            : "bg-rose-500 text-white rounded-tr-none font-medium shadow-xs"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  {bannerChatLoading && (
                    <div className="flex gap-2.5 max-w-[85%] mr-auto">
                      <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 animate-pulse text-[10px]">
                        🤖
                      </div>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl rounded-tl-none text-[11px] text-zinc-400 flex items-center gap-1.5 border border-zinc-100 dark:border-zinc-900">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                        <span>{lang === "ko" ? "생성 중..." : lang === "en" ? "Typing..." : "Думает..."}</span>
                      </div>
                    </div>
                  )}
                  <div ref={bannerScrollRef} />
                </div>

                {/* Quick Chips Tags */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850 text-left">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    {lang === "ko" ? "추천 질문:" : lang === "en" ? "Suggested questions:" : "Рекомендуемые темы:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto no-scrollbar pb-1">
                    {BANNER_CHIP_PROMPTS[lang]?.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendBannerMessage(chip.query)}
                        disabled={bannerChatLoading}
                        className="py-1 px-2.5 text-[10px] text-zinc-650 dark:text-zinc-350 bg-zinc-50 dark:bg-zinc-950 hover:bg-rose-500 hover:text-white rounded-lg border border-zinc-150/45 dark:border-zinc-850 hover:border-rose-500 transition-all cursor-pointer truncate"
                        title={chip.query}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Form Grid */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendBannerMessage(bannerInput);
                  }}
                  className="mt-2 pt-1 border-t border-zinc-100 dark:border-zinc-850 flex gap-1.5 items-center justify-between"
                >
                  <input
                    type="text"
                    value={bannerInput}
                    onChange={(e) => setBannerInput(e.target.value)}
                    disabled={bannerChatLoading}
                    placeholder={lang === "ko" ? "질문을 입력하세요..." : lang === "en" ? "Ask something..." : "Задайте вопрос..."}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 px-3 py-2 text-[11px] rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-200"
                  />
                  <button
                    type="submit"
                    disabled={!bannerInput.trim() || bannerChatLoading}
                    className="p-2.5 bg-rose-500 disabled:opacity-30 hover:bg-rose-600 rounded-xl text-white shadow-md transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            </div>

          </div>

        </div>

        {/* Traditional decorative corner borders background decors */}
        <div className="absolute left-6 top-12 opacity-[0.03] select-none pointer-events-none hidden md:block">
          <div className="text-[180px] font-bold font-serif">한국</div>
        </div>
        <div className="absolute right-6 top-12 opacity-[0.03] select-none pointer-events-none hidden md:block">
          <div className="text-[180px] font-bold font-serif">문화</div>
        </div>
      </section>

      {/* 3. Horizontal Core Subsections Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 shrink-0">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 p-2 rounded-3xl shadow-sm flex flex-wrap gap-1 md:justify-center overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "guide"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabGuide}</span>
          </button>

          <button
            onClick={() => setActiveTab("alphabet")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "alphabet"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabAlphabet}</span>
          </button>

          <button
            onClick={() => setActiveTab("phrases")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "phrases"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabPhrases}</span>
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "itinerary"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabItinerary}</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "map"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabMap}</span>
          </button>

          <button
            onClick={() => setActiveTab("name")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "name"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabName}</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "quiz"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>{TRANSLATIONS[lang].tabQuiz}</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "chat"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{TRANSLATIONS[lang].tabAdvisor}</span>
          </button>

        </div>
      </nav>

      {/* 4. Core Rendered Area with AnimatePresence Page Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "guide" && <CulturalGuide lang={lang} />}
            {activeTab === "alphabet" && <KoreanAlphabets />}
            {activeTab === "phrases" && <Phrasebook />}
            {activeTab === "itinerary" && <ItineraryGenerator />}
            {activeTab === "name" && <KoreanNameGenerator />}
            {activeTab === "quiz" && <CultureQuiz />}
            {activeTab === "chat" && <CultureAdvisorChat />}
            {activeTab === "map" && <KakaoMap lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Imperial Minimal Footer */}
      <footer className="border-t border-zinc-150/45 dark:border-zinc-900 bg-white dark:bg-zinc-950 py-10 tracking-tight transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-serif font-bold text-zinc-700 dark:text-zinc-300">
            <span>Discover Korea Portal</span>
            <span>•</span>
            <span className="font-normal font-sans text-[11px] text-zinc-450 dark:text-zinc-500">
              {lang === "ko" ? "© 2026. 한류의 즐거움. 판권 소유." : lang === "en" ? "© 2026. Hallyu Joy. All rights reserved." : "© 2026. 한류의 즐거움. Все права сохранены."}
            </span>
          </div>

          <div className="flex gap-1.5 items-center">
            <span className="text-zinc-300">{TRANSLATIONS[lang].madeWithLove}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
            <span className="text-zinc-300">{TRANSLATIONS[lang].andAi}</span>
          </div>
        </div>
      </footer>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {activeImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden max-w-lg w-full border border-zinc-150 dark:border-zinc-805 shadow-2xl relative"
            >
              {/* Image Banner */}
              <div className="h-56 relative bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={activeImageModal.url}
                  alt={lang === "ko" ? activeImageModal.title_ko : lang === "en" ? activeImageModal.title_en : activeImageModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveImageModal(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono tracking-widest text-rose-450 block font-bold uppercase mb-1">
                    {activeImageModal.korean}
                  </span>
                  <h3 className="text-xl font-serif font-black text-white">
                    {lang === "ko" ? activeImageModal.title_ko : lang === "en" ? activeImageModal.title_en : activeImageModal.title}
                  </h3>
                </div>
              </div>

              {/* Body insights */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                    {TRANSLATIONS[lang].scenicDescription}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {lang === "ko" ? activeImageModal.desc_ko : lang === "en" ? activeImageModal.desc_en : activeImageModal.desc}
                  </p>
                </div>

                <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100/50 dark:border-rose-950/30 rounded-2xl flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 text-sm">
                    🌸
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block mb-0.5">
                      {TRANSLATIONS[lang].culturalContext}
                    </span>
                    <p className="text-[11px] text-zinc-650 dark:text-zinc-300 leading-normal">
                      {lang === "ko" ? activeImageModal.insight_ko : lang === "en" ? activeImageModal.insight_en : activeImageModal.insight}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(activeImageModal.korean.split(" ")[0]);
                        utterance.lang = "ko-KR";
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{TRANSLATIONS[lang].btnVoice}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageModal(null)}
                    className="px-5 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold transition-transform cursor-pointer hover:bg-rose-600 active:scale-95"
                  >
                    {TRANSLATIONS[lang].btnClose}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
