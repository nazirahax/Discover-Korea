import { useState, useEffect, useRef, FormEvent } from "react";
import { MapPin, Search, Key, Compass, Globe, Navigation, Eye, Check, AlertCircle, X, ExternalLink, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Landmark {
  id: string;
  title: string;
  title_en: string;
  title_ko: string;
  korean: string;
  lat: number;
  lng: number;
  category: "history" | "nature" | "modern" | "transit";
  desc: string;
  desc_en: string;
  desc_ko: string;
  specialty: string;
  specialty_en: string;
  specialty_ko: string;
  imageUrl: string;
  searchUrl: string;
  kakaoId?: string; // If known
}

const MAP_LANDMARKS: Landmark[] = [
  {
    id: "gyeongbokgung",
    title: "Дворец Кёнбоккун",
    title_en: "Gyeongbokgung Palace",
    title_ko: "경복궁",
    korean: "경복궁",
    lat: 37.5796,
    lng: 126.9770,
    category: "history",
    desc: "Главный королевский дворец династии Чосон, построенный в 1395 году. Настоящий шедевр традиционной деревянной архитектуры.",
    desc_en: "The main royal palace of the Joseon dynasty, built in 1395. A true masterpiece of traditional wooden Korean architecture.",
    desc_ko: "1395년에 창건된 조선 왕조의 법궁으로, 한국 역사와 전통 목조 건축의 정수를 보여주는 찬란한 문화유산입니다.",
    specialty: "Церемония смены караула в ханбоках, павильон Кёнхверу на воде.",
    specialty_en: "Changing of the Royal Guard ceremony, Gyeonghoeru Pavilion on the pond.",
    specialty_ko: "한복 착용 시 무료 입장, 아름다운 경회루 연못, 수문장 교대의식.",
    imageUrl: "https://images.unsplash.com/photo-1508189860359-777d945909ef?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/경복궁"
  },
  {
    id: "seoultower",
    title: "Башня N Seoul Tower",
    title_en: "N Seoul Tower",
    title_ko: "N서울타워",
    korean: "N서울타워",
    lat: 37.5511,
    lng: 126.9882,
    category: "modern",
    desc: "Символичная телебашня Сеула на вершине горы Намсан. Место вечной любви с панорамными видами на сверкающий мегаполис.",
    desc_en: "Iconic communication tower atop Namsan Mountain in central Seoul, famous for locks of love and a breathtaking panoramic city skyline.",
    desc_ko: "서울 남산 정상에 우뚝 솟은 도시의 상징이자 랜드마크. 아름다운 전망과 수많은 '사랑의 자물쇠'로 연인들에게 사랑받는 장소입니다.",
    specialty: "Замочки любви на террасе, канатная дорога Намсан, вечерняя подсветка.",
    specialty_en: "Love locks terrace, Namsan Cable Car, ambient night light show.",
    specialty_ko: "남산 케이블카, 화려한 서울 야경, 연인들의 사랑의 열쇠 테라스.",
    imageUrl: "https://images.unsplash.com/photo-1538669715515-5c37c640a40f?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/N서울타워"
  },
  {
    id: "haeundae",
    title: "Пляж Хэундэ в Пусане",
    title_en: "Haeundae Beach Busan",
    title_ko: "부산 해운대 해수욕장",
    korean: "해운대",
    lat: 35.1587,
    lng: 129.1604,
    category: "nature",
    desc: "Самый известный городской пляж в Южной Корее с золотистым песком и сверкающим силуэтом футуристических небоскребов.",
    desc_en: "South Korea's premier urban beach, blending golden sands with a spectacular modern skyline and vibrant maritime nightlife.",
    desc_ko: "대한민국을 대표하는 명품 해수욕장으로, 고운 모래사장과 함께 화려한 초고층 빌딩 숲이 조화를 이루는 국제적 관광 단지입니다.",
    specialty: "Морская еда, традиционный рынок Хэундэ, прогулочный поезд капсул Haeundae Blueline Park.",
    specialty_en: "Fresh seafood alley, Traditional Market, Haeundae Sky Capsule train.",
    specialty_ko: "신선한 밀면과 국밥, 해운대 블루라인파크 스카이캡슐, 맛있는 포장마차촌.",
    imageUrl: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/해운대해수욕장"
  },
  {
    id: "bulguksa",
    title: "Храм Булгукса",
    title_en: "Bulguksa Temple",
    title_ko: "경주 불국사",
    korean: "불국사",
    lat: 35.7901,
    lng: 129.3321,
    category: "history",
    desc: "Древнейший храм золотого века Силла в Кёнджу (VII век). Великое наследие ЮНЕСКО, символизирующее буддийскую чистую землю.",
    desc_en: "A historic Jogye Buddhist temple in Gyeongju (7th century). A UNESCO World Heritage masterpiece symbolizing Buddha's Pure Land.",
    desc_ko: "신라 불교 문화의 황금기를 이룩한 서기 8세기 경주의 대표 사찰. 세계문화유산이자 다보탑과 석가탑 등 국보가 가득한 문화의 성지입니다.",
    specialty: "Каменные мосты, пагоды Дабобхаб и Соккатхаб, цветущая осенью вишня.",
    specialty_en: "Dabotap and Seokgatap stone pagodas, stunning autumn foliage pathways.",
    specialty_ko: "정교한 석조 기단, 동양의 미를 완성한 다보탑과 석가탑, 천년 역사의 분위기.",
    imageUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/불국사"
  },
  {
    id: "hallasan",
    title: "Гора Халласан (Купол Чеджу)",
    title_en: "Hallasan Mountain Peak",
    title_ko: "한라산 국립공원",
    korean: "한라산",
    lat: 33.3617,
    lng: 126.5292,
    category: "nature",
    desc: "Высшая горная точка Южной Кореи — древний щитовой вулкан на острове Чеджу, увенчанный кратерным озером Бэнноктам.",
    desc_en: "The tallest mountain in South Korea. An ancient shield volcano on Jeju Island, crowned with the crater lake Baengnokdam.",
    desc_ko: "제주도 중앙에 뿜어 오른 남한 최고 높이의 휴화산. 신비로운 백록담 분화구와 계절마다 장관을 이루는 철쭉, 눈꽃이 아름답습니다.",
    specialty: "Кратерное озеро Бэнноктам у облаков, мистические зимние прогулки.",
    specialty_en: "Baengnokdam crater lake, volcanic hiking routes, evergreen nature paths.",
    specialty_ko: "정상의 백록담 백록 호수, 사계절 등산 코스, 봄철 야생화 군락.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/한라산"
  },
  {
    id: "bukchon",
    title: "Деревня Букчон Ханок",
    title_en: "Bukchon Hanok Village",
    title_ko: "북촌한옥마을",
    korean: "북촌한옥마을",
    lat: 37.5829,
    lng: 126.9835,
    category: "history",
    desc: "Живой исторический музей в центре Сеула. Сотни аутентичных старинных дворянских домов 'ханок' эпохи Чосон.",
    desc_en: "A historic neighborhood in Seoul preserved for over 600 years. Home to hundreds of traditional wooden houses ('hanok').",
    desc_ko: "경복궁과 창덕궁 사이에 위치한 한옥 보존지구. 조선 시대 사대부들이 살던 가옥의 멋을 그대로 간직한 도심 속 골목 미술관입니다.",
    specialty: "Чайные дома в традиционном стиле, фотографирование на фоне панорамы Сеула.",
    specialty_en: "Cultural traditional teahouses, scenic viewpoints overlooking modern Seoul.",
    specialty_ko: "조용히 산책하기, 골목길에서 보이는 도심 빌딩 뷰, 전통 공예 체험.",
    imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/북촌한옥마을"
  },
  {
    id: "airport",
    title: "Аэропорт Инчхон (ICN)",
    title_en: "Incheon Intl Airport",
    title_ko: "인천국제공항",
    korean: "인천공항",
    lat: 37.4602,
    lng: 126.4407,
    category: "transit",
    desc: "Один из лучших в мире транзитных узлов. Хайтек-дворец технологий с вечно зелеными лесами, спа-комплексами и робоплатформами.",
    desc_en: "Consistently rated global best airport. A high-tech transit sanctuary hosting vertical green forests, museum spaces, and rapid trains.",
    desc_ko: "세계 초일류 수준을 자랑하는 대한민국의 메인 게이트웨이. 정원과 첨단 무인 교통, 전통박물관 및 고속열차 서비스가 집약되어 있습니다.",
    specialty: "Императорские шествия, роботы-экскурсоводы, бесплатный душ и спа.",
    specialty_en: "Royal Joseon cultural parade, guideway robots, duty free galleries.",
    specialty_ko: "공항철도 연결성, 세계 최고의 면세 편의시설, 조선시대 국왕 왕비 행차 재현 행사.",
    imageUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80",
    searchUrl: "https://map.kakao.com/link/search/인천국제공항"
  }
];

const LOCAL_TRANSLATIONS = {
  ru: {
    metaTitle: "Интерактивная карта Kakao Map",
    subTitle: "Исследуйте ключевые места Страны Утренней Свежести с глубокой интеграцией корейского сервиса.",
    noGoogleReason: "💡 Карта в Южной Корее: Из-за строгих местных законов о безопасности картографии, американские сервисы (вроде Google Maps) не поддерживают точные пешеходные маршруты и пробки. Kakao Map и Naver — незаменимый стандарт для любого путешественника в Корее.",
    keyLabel: "JavaScript API ключ Kakao:",
    keyPlaceholder: "Вставьте ваш Javascript AppKey...",
    keyBtnSave: "Сохранить Ключ",
    keyBtnCleared: "Удалить Ключ",
    keyHelper: "Можно получить бесплатно на developers.kakao.com",
    activeOffline: "Интерактивный холст (Оффлайн-режим • Нажмите на маркер)",
    activeKakaoLive: "Запущен интерактивный Web SDK KakaoMap 🌟",
    searchTitle: "Быстрый поиск в Kakao Map",
    searchPlaceholder: "Например: Hongdae Cafe, Itaewon Food...",
    searchBtn: "Искать",
    btnOpenMap: "Открыть в Kakao Map",
    btnRoadview: "Вид улицы (Roadview)",
    btnDirections: "Проложить маршрут",
    detailsTitle: "Информация о месте",
    badgeHistory: "🏯 История",
    badgeModern: "🏙️ Современность",
    badgeNature: "🌋 Природа",
    badgeTransit: "🚇 Транспорт",
    unselectedLabel: "Выберите маркер на карте или из списка ниже, чтобы увидеть карту, фото, корейские названия, дорожные виды и туристическую информацию.",
    landmarksListHead: "Главные точки туризма Южной Кореи:",
    viewOnKakaoMapApp: "Карта Kakao Map ↗",
    specialSpecialty: "Особенности локации:"
  },
  en: {
    metaTitle: "Kakao Map Explorer Portal",
    subTitle: "Navigate the top treasures of Korea with dynamic maps and outward navigation links.",
    noGoogleReason: "💡 Navigation in Korea: Due to local national security law constraints, Google Maps does not fully function for transit or walking. Kakao Map and Naver are the absolute gold standard for navigation in Korea.",
    keyLabel: "Kakao JavaScript API Key:",
    keyPlaceholder: "Paste your Kakao JavaScript AppKey here...",
    keyBtnSave: "Save API Key",
    keyBtnCleared: "Remove API Key",
    keyHelper: "Get a free developers key at developers.kakao.com",
    activeOffline: "Interactive Graphic Canvas (Offline Mock Mode • Click any landmark)",
    activeKakaoLive: "Live Kakao Map Web SDK active and rendering 🌟",
    searchTitle: "Fast Outward Search on Kakao",
    searchPlaceholder: "E.g., Hongdae Cafe, Gangnam clubs...",
    searchBtn: "Search Map",
    btnOpenMap: "View on Kakao Map",
    btnRoadview: "Kakao Roadview Link",
    btnDirections: "Directions (Kakao To)",
    detailsTitle: "Sights Details",
    badgeHistory: "🏯 History",
    badgeModern: "🏙️ Modern",
    badgeNature: "🌋 Nature",
    badgeTransit: "🚇 Transit",
    unselectedLabel: "Select a landmark on the map or from the quick list below to view deep-linked geographic details, roadviews, and local specialties.",
    landmarksListHead: "South Korea Iconic Landmarks List:",
    viewOnKakaoMapApp: "Kakao Map Info ↗",
    specialSpecialty: "Unique features:"
  },
  ko: {
    metaTitle: "카카오맵 투어 가이드",
    subTitle: "가장 빠르고 정확한 카카오맵 연동을 통해 대한민국의 하이라이트 명소들의 정보를 한눈에 투어해보세요.",
    noGoogleReason: "💡 한국의 지도 가이드: 한국 영토 보안 관련 법률로 인해 해외 기반 플랫폼(구글 지도 등)은 도보 네비게이션이 제한됩니다. 따라서 국내에서는 카카오맵이 절대적인 필수 앱입니다.",
    keyLabel: "카카오 JavaScript API Key 설정:",
    keyPlaceholder: "발급받은 카카오 자바스크립트 앱 키를 입력하세요...",
    keyBtnSave: "키 저장하기",
    keyBtnCleared: "키 삭제하기",
    keyHelper: "developers.kakao.com에서 무료로 발급 가능합니다.",
    activeOffline: "인터랙티브 가상 지도 스크린 (마커를 클릭하세요)",
    activeKakaoLive: "실시간 카카오맵 자바스크립트 SDK 정상 구동 중 🌟",
    searchTitle: "카카오맵 바로 검색기",
    searchPlaceholder: "예: 홍대 맛집, 서면 카페거리, 한강공원...",
    searchBtn: "카카오 검색",
    btnOpenMap: "카카오맵 바로가기",
    btnRoadview: "생생한 로드뷰 보기",
    btnDirections: "실시간 대중교통 길찾기",
    detailsTitle: "선택한 관광지 요약",
    badgeHistory: "🏯 문화재/역사",
    badgeModern: "🏙️ 도심명소",
    badgeNature: "🌋 아름다운 자연",
    badgeTransit: "🚇 관문/터미널",
    unselectedLabel: "지도 내 명소 서클 마커를 누르면, 현 위치의 생생한 지도 연동, 로드뷰 실시간 데이터, 특별 요약 가이드를 이용할 수 있습니다.",
    landmarksListHead: "유적 및 관광 명소 모음:",
    viewOnKakaoMapApp: "카카오맵 연결 ↗",
    specialSpecialty: "현지 체크포인트:"
  }
};

export default function KakaoMap({ lang }: { lang: "ru" | "en" | "ko" }) {
  const t = LOCAL_TRANSLATIONS[lang] || LOCAL_TRANSLATIONS.en;
  
  // States
  const [kakaoKey, setKakaoKey] = useState<string>(() => {
    return localStorage.getItem("kakao_js_key") || "";
  });
  const [keyInput, setKeyInput] = useState<string>(kakaoKey);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark>(MAP_LANDMARKS[0]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sdkStatus, setSdkStatus] = useState<"not_loaded" | "loading" | "loaded" | "error">("not_loaded");
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Local key storage handler
  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    localStorage.setItem("kakao_js_key", trimmed);
    setKakaoKey(trimmed);
    // Reload page or trigger load
    window.location.reload();
  };

  const handleClearKey = () => {
    localStorage.removeItem("kakao_js_key");
    setKakaoKey("");
    setKeyInput("");
    window.location.reload();
  };

  // Dynamically load Kakao Map Script if key exists
  useEffect(() => {
    if (!kakaoKey) {
      setSdkStatus("not_loaded");
      return;
    }

    setSdkStatus("loading");
    // Kakao Map script injection
    const scriptId = "kakao-maps-sdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (script) {
      script.remove(); // Remove existing script to avoid script-collision
    }

    script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      const kakaoGlobal = (window as any).kakao;
      if (kakaoGlobal && kakaoGlobal.maps) {
        kakaoGlobal.maps.load(() => {
          setSdkStatus("loaded");
        });
      } else {
        setSdkStatus("error");
      }
    };

    script.onerror = () => {
      setSdkStatus("error");
    };

    document.head.appendChild(script);

    return () => {
      // cleanups
    };
  }, [kakaoKey]);

  // Handle Map updates when coordinates/sdk state change
  useEffect(() => {
    if (sdkStatus !== "loaded") return;
    const kakaoGlobal = (window as any).kakao;
    if (!kakaoGlobal || !kakaoGlobal.maps || !mapContainerRef.current) return;

    // Clear old markers if map already exists
    if (mapInstanceRef.current) {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      
      const newPos = new kakaoGlobal.maps.LatLng(selectedLandmark.lat, selectedLandmark.lng);
      mapInstanceRef.current.setCenter(newPos);
      mapInstanceRef.current.setLevel(5);

      // Create new marker
      const marker = new kakaoGlobal.maps.Marker({
        position: newPos,
        map: mapInstanceRef.current
      });
      
      // Info window
      const infowindow = new kakaoGlobal.maps.InfoWindow({
        content: `<div style="padding:10px; font-family:sans-serif; font-size:12px; color:#18181b; font-weight:bold; min-width:150px; text-align:center;">
          ${lang === "ko" ? selectedLandmark.title_ko : lang === "en" ? selectedLandmark.title_en : selectedLandmark.title}
          <div style="font-size:10px; font-weight:normal; color:#ea4c89; margin-top:2px;">KST: ${selectedLandmark.korean}</div>
        </div>`
      });
      infowindow.open(mapInstanceRef.current, marker);
      markersRef.current.push(marker);

      return;
    }

    try {
      // Initialize Map
      const centerPos = new kakaoGlobal.maps.LatLng(selectedLandmark.lat, selectedLandmark.lng);
      const mapOptions = {
        center: centerPos,
        level: 5
      };
      
      const map = new kakaoGlobal.maps.Map(mapContainerRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Add Zoom Control & MapTypeControl
      const mapTypeControl = new kakaoGlobal.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakaoGlobal.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new kakaoGlobal.maps.ZoomControl();
      map.addControl(zoomControl, kakaoGlobal.maps.ControlPosition.RIGHT);

      // Create main marker
      const marker = new kakaoGlobal.maps.Marker({
        position: centerPos,
        map: map
      });

      const infowindow = new kakaoGlobal.maps.InfoWindow({
        content: `<div style="padding:10px; font-family:sans-serif; font-size:12px; color:#18181b; font-weight:bold; min-width:150px; text-align:center;">
          ${lang === "ko" ? selectedLandmark.title_ko : lang === "en" ? selectedLandmark.title_en : selectedLandmark.title}
          <div style="font-size:10px; font-weight:normal; color:#ea4c89; margin-top:2px;">KST: ${selectedLandmark.korean}</div>
        </div>`
      });
      
      infowindow.open(map, marker);
      markersRef.current.push(marker);
    } catch (err) {
      console.error("Kakao SDK Map drawing failure", err);
      setSdkStatus("error");
    }
  }, [sdkStatus, selectedLandmark, lang]);

  // Outward search resolver
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const cleanQuery = encodeURIComponent(searchTerm);
    const kakaoUrl = `https://map.kakao.com/link/search/${cleanQuery}`;
    window.open(kakaoUrl, "_blank", "noopener,noreferrer");
  };

  // Helper translations inside cards
  const getLandmarkTitle = (l: Landmark) => {
    if (lang === "ko") return l.title_ko;
    if (lang === "en") return l.title_en;
    return l.title;
  };

  const getLandmarkDesc = (l: Landmark) => {
    if (lang === "ko") return l.desc_ko;
    if (lang === "en") return l.desc_en;
    return l.desc;
  };

  const getLandmarkSpecialty = (l: Landmark) => {
    if (lang === "ko") return l.specialty_ko;
    if (lang === "en") return l.specialty_en;
    return l.specialty;
  };

  return (
    <div id="kakao-map-explorer-layout" className="space-y-8 animate-fade-in text-left">
      
      {/* Informative Header card */}
      <div className="bg-rose-50/50 dark:bg-rose-950/15 border border-rose-100 dark:border-rose-900/40 p-5 rounded-3xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] bg-rose-500/10 dark:bg-rose-500/25 text-rose-600 dark:text-rose-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">
            🗺️ KAKAO MAP COMPRESSION
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-black text-zinc-900 dark:text-zinc-50">
            {t.metaTitle}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
            {t.subTitle}
          </p>
        </div>

        {/* Quick Outbound Search component */}
        <form onSubmit={handleSearchSubmit} className="flex gap-1.5 w-full md:w-auto shrink-0">
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-rose-500 pl-9 pr-3 py-2 text-xs rounded-xl text-zinc-800 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>{t.searchBtn}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* API Key management panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-850 p-4 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-4 space-y-1">
          <h5 className="text-[11px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1.5 font-serif">
            <Key className="w-3.5 h-3.5 animate-pulse" />
            {t.keyLabel}
          </h5>
          <p className="text-[10px] text-zinc-400">
            {t.keyHelper}
          </p>
        </div>
        
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={t.keyPlaceholder}
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-zinc-700 dark:text-zinc-300"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveKey}
              className="flex-1 sm:flex-none px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {t.keyBtnSave}
            </button>
            {kakaoKey && (
              <button
                onClick={handleClearKey}
                className="px-3 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 dark:text-rose-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {t.keyBtnCleared}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core Map Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic or Fallback Map Box (6 columns on lg screen) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-zinc-400 block tracking-widest font-bold uppercase font-mono">
              {kakaoKey ? t.activeKakaoLive : t.activeOffline}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/35 px-2 py-0.5 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${sdkStatus === "loaded" ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`} />
              <span>Status: {sdkStatus === "loaded" ? "SDK LIVE" : "OFFLINE MAP"}</span>
            </div>
          </div>

          <div 
            id="kakao-maps-viewport"
            className="w-full h-[400px] rounded-3xl overflow-hidden border border-zinc-150 dark:border-none shadow-md bg-zinc-100 dark:bg-zinc-950 relative flex items-center justify-center text-center"
          >
            {/* Real Map WebSDK wrapper */}
            <div 
              ref={mapContainerRef} 
              className={`w-full h-full ${sdkStatus === "loaded" ? "block" : "hidden"}`} 
            />

            {/* Offline Vector Falling back interactive aesthetic screen */}
            {sdkStatus !== "loaded" && (
              <div className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden cursor-default select-none">
                
                {/* Simulated Grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white dark:from-zinc-900 via-transparent to-transparent opacity-10 pointer-events-none" />
                <div className="absolute inset-x-0 h-[1px] bg-dashed border-t border-rose-500/10 top-1/4" />
                <div className="absolute inset-x-0 h-[1px] bg-dashed border-t border-rose-500/10 top-2/4" />
                <div className="absolute inset-x-0 h-[1px] bg-dashed border-t border-rose-500/10 top-3/4" />
                <div className="absolute inset-y-0 w-[1px] bg-dashed border-l border-rose-500/10 left-1/4" />
                <div className="absolute inset-y-0 w-[1px] bg-dashed border-l border-rose-500/10 left-2/4" />
                <div className="absolute inset-y-0 w-[1px] bg-dashed border-l border-rose-500/10 left-3/4" />

                {/* Simulated Land Plot for Korea peninsula outline */}
                <div className="absolute inset-0 flex items-center justify-center opacity-15 dark:opacity-[0.06] transform scale-110 select-none pointer-events-none">
                  <div className="text-[340px] font-black font-serif select-none text-zinc-900 leading-none">한</div>
                </div>

                {/* Coordinate Grid Header */}
                <div className="relative flex justify-between items-center text-[9px] text-zinc-400 font-mono font-bold z-10">
                  <span>LAT: 33°N — 38°N</span>
                  <span className="text-center font-serif text-[11px] text-rose-500 tracking-widest font-black uppercase">SOUTH KOREA MAP CANVAS</span>
                  <span>LNG: 125°E — 131°E</span>
                </div>

                {/* Markers plotted proportionally on screen coordinates */}
                <div className="relative w-full h-[280px] bg-rose-500/[0.01]">
                  {MAP_LANDMARKS.map((landmark) => {
                    // Normalize lat coordinate between 33 and 38 back into percentage (top offset)
                    // higher lat = further North (closer to 38) -> lower top %
                    const topPct = 100 - ((landmark.lat - 33.0) / (38.2 - 33.0)) * 100;
                    // Normalize lng coordinate between 125.8 and 129.8 into percentage (left offset)
                    const leftPct = ((landmark.lng - 126.0) / (129.8 - 126.0)) * 100;

                    const isSelected = selectedLandmark.id === landmark.id;

                    return (
                      <button
                        key={landmark.id}
                        type="button"
                        onClick={() => setSelectedLandmark(landmark)}
                        style={{
                          top: `${Math.max(5, Math.min(topPct, 95))}%`,
                          left: `${Math.max(5, Math.min(leftPct, 95))}%`
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer z-20 group transition-all duration-300 ${
                          isSelected ? "scale-125" : "hover:scale-115"
                        }`}
                        title={getLandmarkTitle(landmark)}
                      >
                        <div className="relative flex items-center justify-center">
                          {/* Pulsing selection background */}
                          {isSelected && (
                            <span className="absolute w-10 h-10 bg-rose-500/20 border border-rose-500/40 rounded-full animate-ping pointer-events-none" />
                          )}
                          <span className={`absolute w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-500/10 pointer-events-none`} />
                          
                          <MapPin className={`w-5 h-5 transition-transform duration-300 ${
                            isSelected 
                              ? "text-rose-500 drop-shadow-md scale-110 font-bold" 
                              : "text-zinc-400 group-hover:text-rose-400"
                          }`} />
                          
                          {/* Micro-label for markers */}
                          <div className={`absolute left-6 whitespace-nowrap bg-zinc-950/85 text-[8px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm opacity-60 group-hover:opacity-100 pointer-events-none transition-opacity ${
                            isSelected ? "opacity-100 border border-rose-500/20" : ""
                          }`}>
                            {getLandmarkTitle(landmark).split(" ")[0]}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Compass representation decor */}
                  <div className="absolute right-3 bottom-3 opacity-30 flex flex-col items-center select-none">
                    <Compass className="w-8 h-8 text-rose-500 animate-[spin_12s_linear_infinite]" />
                    <span className="text-[8px] font-mono font-bold mt-1 tracking-widest text-zinc-400 uppercase">MORNING CALM</span>
                  </div>
                </div>

                {/* Lat Lng real time marker tracking Footer */}
                <div className="relative flex justify-between items-end border-t border-zinc-150/50 dark:border-zinc-850/50 pt-2 z-10 text-[9px] text-zinc-400 font-mono">
                  <div>
                    <span>CURRENT PIN: </span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                      {selectedLandmark.lat.toFixed(4)}°N, {selectedLandmark.lng.toFixed(4)}°E
                    </span>
                  </div>
                  <div className="font-sans font-semibold text-rose-500 text-[10px]">
                    {getLandmarkTitle(selectedLandmark)}
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-amber-800 dark:text-amber-400 text-[11px] leading-relaxed font-normal">
            {t.noGoogleReason}
          </div>
        </div>

        {/* Right Side: Informative Card Panel (5 columns on lg screen) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-850 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                  {t.detailsTitle}
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-serif font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                    {getLandmarkTitle(selectedLandmark)}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-rose-450 block">
                  {selectedLandmark.korean} (KST)
                </span>
              </div>

              {/* Tag Category indicators */}
              <span className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-extrabold uppercase rounded-lg border border-zinc-150/45 dark:border-zinc-800/80 text-zinc-650 dark:text-zinc-350 shrink-0">
                {selectedLandmark.category === "history" && t.badgeHistory}
                {selectedLandmark.category === "modern" && t.badgeModern}
                {selectedLandmark.category === "nature" && t.badgeNature}
                {selectedLandmark.category === "transit" && t.badgeTransit}
              </span>
            </div>

            {/* Photo preview inside the card info */}
            <div className="h-40 rounded-2xl overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
              <img
                src={selectedLandmark.imageUrl}
                alt={getLandmarkTitle(selectedLandmark)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="text-[9px] font-mono tracking-wider opacity-80 uppercase font-black">Landmark Identity</span>
                <span className="text-xs block font-semibold">{selectedLandmark.korean} // South Korea</span>
              </div>
            </div>

            {/* Description and Specialty details */}
            <div className="space-y-4 text-xs font-normal text-zinc-650 dark:text-zinc-305 leading-relaxed">
              <p>
                {getLandmarkDesc(selectedLandmark)}
              </p>

              <div className="p-3.5 bg-rose-500/[0.02] dark:bg-rose-950/10 border-l-[3px] border-rose-500 rounded-r-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 leading-none">
                  {t.specialSpecialty}
                </span>
                <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-semibold leading-normal">
                  {getLandmarkSpecialty(selectedLandmark)}
                </p>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono border-t border-zinc-100 dark:border-zinc-850 pt-3">
                <Globe className="w-3.5 h-3.5" />
                <span>COORDINATES: {selectedLandmark.lat.toFixed(5)}N, {selectedLandmark.lng.toFixed(5)}E</span>
              </div>
            </div>

            {/* deep navigation Action grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <a
                href={selectedLandmark.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-2xl text-center shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{t.btnOpenMap}</span>
              </a>
              <a
                href={`https://map.kakao.com/link/roadview/${selectedLandmark.lat},${selectedLandmark.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-105 text-xs font-bold rounded-2xl text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 shrink-0" />
                <span>{t.btnRoadview}</span>
              </a>
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(selectedLandmark.title_ko)},${selectedLandmark.lat},${selectedLandmark.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-2 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 dark:bg-zinc-950 dark:hover:bg-black text-white text-xs font-bold rounded-2xl text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>{t.btnDirections}</span>
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* Quick landmarks drawer selector list at the bottom */}
      <div className="space-y-3 pt-4">
        <h4 className="text-xs font-bold font-serif uppercase tracking-widest text-zinc-500">
          {t.landmarksListHead}
        </h4>
        <div className="flex flex-wrap gap-2">
          {MAP_LANDMARKS.map((landmark) => {
            const isSelected = selectedLandmark.id === landmark.id;
            return (
              <button
                key={landmark.id}
                onClick={() => setSelectedLandmark(landmark)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-rose-500 text-white border-rose-500 shadow-sm scale-102"
                    : "bg-white dark:bg-zinc-900 text-zinc-650 dark:text-zinc-350 border-zinc-100 dark:border-zinc-850 hover:border-rose-400 dark:hover:border-rose-900"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-rose-500"}`} />
                <span>{getLandmarkTitle(landmark)}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
