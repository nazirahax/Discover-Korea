export interface HangulChar {
  char: string;
  name: string;
  pronunciation: string;
  type: "consonant" | "vowel" | "double_consonant" | "double_vowel";
  example: string;
  exampleTrans: string;
  meaning: string;
}

export interface Phrase {
  korean: string;
  romanization: string;
  translation: string;
  category: "greetings" | "dining" | "shopping" | "transport" | "emergency";
  context?: string;
}

export interface Hotspot {
  id: string;
  title: string;
  koreanTitle: string;
  category: "history" | "nature" | "modern" | "gourmet";
  description: string;
  fullDetails: string;
  recommendedTime: string;
  imageUrl: string;
  culturalInsight: string;
  location: string;
}

export interface ItineraryActivity {
  title: string;
  koreanTitle: string;
  time: string;
  description: string;
  tip: string;
  emoji: string;
}

export interface DailyItinerary {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
}

export interface NameResult {
  koreanNameHangul: string;
  koreanNameRomanized: string;
  hanja: string;
  hanjaMeaning: string;
  overallMeaning: string;
  accentTips: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  info: string;
}
