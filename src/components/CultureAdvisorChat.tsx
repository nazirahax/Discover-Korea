import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, HelpCircle, Bot, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Каков чайный этикет в Корее?",
  "Как устроен корейский транспорт?",
  "Что такое Чимек (치맥)?",
  "Как работает подогрев Ондоль?"
];

export default function CultureAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! (Здравствуйте!) Я ваш персональный гид по корейской культуре и традициям. Спросите меня о достопримечательностях, правилах поведения за столом, корейской кухне или о том, как устроен быт в Пусане и Сеуле!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages
        })
      });

      const data = await response.json();
      if (data.success && data.responseText) {
        setMessages(prev => [...prev, { role: "assistant", content: data.responseText }]);
      } else {
        throw new Error(data.error || "Ошибка соединения с ИИ-консультантом.");
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Произошла ошибка: ${err.message || 'Не удалось получить ответ.'}. Пожалуйста, убедитесь, что ваш API-ключ корректно установлен в панели Secrets.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]">
      {/* Sidebar tips */}
      <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex gap-2 items-center text-rose-500">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold text-lg font-serif text-zinc-800 dark:text-zinc-50">Культурный Гуру</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Задавайте вопросы на свободные темы. Наш консультант знает всё о корейском образе жизни, исторических укладах Хянга и этикете поклонов.
          </p>

          <div className="pt-4 border-t border-zinc-50 dark:border-zinc-850">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Рекомендованные темы:
            </span>
            <div className="flex flex-col gap-2">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="p-2.5 text-left text-xs bg-zinc-50 dark:bg-zinc-950 hover:bg-rose-500 hover:text-white rounded-xl border border-zinc-100 dark:border-zinc-900 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer select-none"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-[10px] text-zinc-400">
          <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 fill-rose-500" />
          <span>Разговаривает на вежливом корейском стиле 존댓말 (Чондэмаль).</span>
        </div>
      </div>

      {/* Main Chat Conversation Screen */}
      <div className="lg:col-span-8 bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-3xl flex flex-col justify-between overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
        {/* Messages viewport */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[380px] max-h-[500px]">
          {messages.map((msg, idx) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isBot ? "bg-rose-500 text-white" : "bg-zinc-200 text-zinc-800"
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-wrap ${
                  isBot
                    ? "bg-zinc-50 dark:bg-zinc-950 rounded-tl-none text-zinc-700 dark:text-zinc-250 border border-zinc-100/50 dark:border-zinc-900/40 shadow-sm"
                    : "bg-rose-500 text-white rounded-tr-none font-medium shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-3xl rounded-tl-none font-mono text-[11px] text-zinc-400 flex items-center gap-2 border border-zinc-100">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Гуру формулирует ответ...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Action / Send Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-150/45 dark:border-zinc-850 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Спросите о традициях, еде или путешествиях..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 px-4 py-3 text-xs rounded-2xl focus:outline-none focus:ring-1 focus:ring-rose-500 text-zinc-800 dark:text-zinc-200"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-rose-500 disabled:opacity-30 hover:bg-rose-600 hover:scale-105 active:scale-95 rounded-2xl text-white shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
