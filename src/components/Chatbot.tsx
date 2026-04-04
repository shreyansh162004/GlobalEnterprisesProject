import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "@/data/products";

type Step = "lang" | "usage" | "brand" | "budget" | "done";

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

const usages = ["🎮 Gaming", "📚 Study", "💼 Office", "🎬 Editing"];
const brandsList = ["HP", "Dell", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Any"];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lang");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = (en: string, hi: string) => (lang === "hi" ? hi : en);

  // Generate dynamic price ranges from product data
  const dynamicBudgets = useMemo(() => {
    const products = getProducts();
    if (products.length === 0) return [{ label: "Any Price", min: 0, max: 999999 }];

    const prices = products.map((p) => p.price).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];

    // Create smart ranges based on actual stock
    const ranges: { label: string; min: number; max: number }[] = [];
    const step = Math.ceil((maxPrice - minPrice) / 4 / 5000) * 5000; // round to 5K increments

    let current = Math.floor(minPrice / 5000) * 5000;
    for (let i = 0; i < 4; i++) {
      const rangeMin = current;
      const rangeMax = i === 3 ? 999999 : current + step;
      const count = products.filter((p) => p.price >= rangeMin && p.price < rangeMax).length;

      if (count > 0 || i === 3) {
        const formatPrice = (v: number) => {
          if (v >= 100000) return `₹${(v / 100000).toFixed(v % 100000 === 0 ? 0 : 1)}L`;
          if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
          return `₹${v}`;
        };
        const label = i === 3 ? `${formatPrice(rangeMin)}+` : `${formatPrice(rangeMin)} – ${formatPrice(rangeMax)}`;
        ranges.push({ label: `${label} (${count})`, min: rangeMin, max: rangeMax });
      }
      current += step;
    }
    return ranges.length > 0 ? ranges : [{ label: "Any Price", min: 0, max: 999999 }];
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    const interval = setInterval(() => setBubbleVisible((v) => !v), 4000);
    return () => clearInterval(interval);
  }, []);

  const addBotMsg = (text: string, callback?: () => void) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text }]);
      callback?.();
    }, 800);
  };

  const addUserMsg = (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const reset = () => {
    setStep("lang");
    setMessages([]);
    setSelectedBrand(null);
    setTyping(false);
  };

  const handleOpen = () => {
    setOpen(true);
    reset();
    setTimeout(() => {
      addBotMsg("👋 Hi! I'll help you find the perfect laptop.\nChoose your language:");
    }, 200);
  };

  const chooseLang = (l: "en" | "hi") => {
    setLang(l);
    addUserMsg(l === "en" ? "English" : "हिंदी");
    setTimeout(() => {
      addBotMsg(
        l === "en" ? "What will you use it for? 🤔" : "आप इसे किसलिए इस्तेमाल करेंगे? 🤔",
        () => setStep("usage")
      );
    }, 300);
  };

  const chooseUsage = (u: string) => {
    addUserMsg(u);
    setTimeout(() => {
      addBotMsg(
        t("Any brand preference? 🏷️", "कोई ब्रांड पसंद? 🏷️"),
        () => setStep("brand")
      );
    }, 300);
  };

  const chooseBrand = (brand: string) => {
    setSelectedBrand(brand === "Any" ? null : brand);
    addUserMsg(brand);
    setTimeout(() => {
      addBotMsg(
        t("What's your budget range? 💰\n(Based on our current stock)", "आपका बजट क्या है? 💰\n(हमारे मौजूदा स्टॉक के आधार पर)"),
        () => setStep("budget")
      );
    }, 300);
  };

  const chooseBudget = (b: { min: number; max: number; label: string }) => {
    addUserMsg(b.label);
    setTimeout(() => {
      addBotMsg(
        t("Perfect! Finding the best options for you! 🚀", "बढ़िया! आपके लिए बेस्ट ऑप्शन ढूंढता हूँ! 🚀"),
        () => {
          setStep("done");
          setTimeout(() => {
            const params = new URLSearchParams();
            params.set("minPrice", b.min.toString());
            params.set("maxPrice", b.max.toString());
            if (selectedBrand) params.set("brand", selectedBrand);
            navigate(`/products?${params.toString()}`);
            setOpen(false);
          }, 1200);
        }
      );
    }, 300);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {!open && bubbleVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              className="bg-card border border-border rounded-2xl rounded-br-md px-4 py-2 shadow-xl max-w-[200px]"
              style={{ animation: "float-bubble 3s ease-in-out infinite" }}
            >
              <p className="text-xs font-medium">Find your perfect laptop 💻</p>
              <div className="absolute -bottom-1 right-4 w-3 h-3 bg-card border-r border-b border-border rotate-45 transform" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleOpen}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-primary text-primary-foreground font-bold shadow-2xl group"
          style={{ animation: "chatbot-pulse 2s ease-in-out infinite" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🤖</span>
          <span className="hidden sm:flex items-center gap-1 text-sm font-heading">
            Ask Me
            <span className="inline-block origin-bottom-right animate-wave text-lg">👋</span>
          </span>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className="fixed bottom-0 right-0 md:bottom-24 md:right-6 z-50 w-full md:w-[380px] h-[85vh] md:h-auto md:max-h-[520px] rounded-t-3xl md:rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-primary/10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary to-[hsl(180,70%,50%)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <p className="font-heading font-bold text-sm text-primary-foreground">Global Enterprises</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <p className="text-xs text-primary-foreground/80">Online now</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors">
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.from === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce-subtle" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce-subtle" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce-subtle" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              <div className="p-4 border-t border-border space-y-2 bg-card/95">
                {step === "lang" && !typing && messages.length > 0 && (
                  <div className="flex gap-2">
                    <QuickReplyBtn label="🇬🇧 English" onClick={() => chooseLang("en")} />
                    <QuickReplyBtn label="🇮🇳 हिंदी" onClick={() => chooseLang("hi")} />
                  </div>
                )}
                {step === "usage" && !typing && (
                  <div className="grid grid-cols-2 gap-2">
                    {usages.map((u) => (
                      <QuickReplyBtn key={u} label={u} onClick={() => chooseUsage(u)} />
                    ))}
                  </div>
                )}
                {step === "brand" && !typing && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {brandsList.map((b) => (
                      <QuickReplyBtn key={b} label={b} onClick={() => chooseBrand(b)} small />
                    ))}
                  </div>
                )}
                {step === "budget" && !typing && (
                  <div className="grid grid-cols-2 gap-2">
                    {dynamicBudgets.map((b) => (
                      <QuickReplyBtn key={b.label} label={b.label} onClick={() => chooseBudget(b)} />
                    ))}
                  </div>
                )}
                {step === "done" && (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-primary">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                    <span className="font-medium">{t("Finding products...", "प्रोडक्ट्स ढूंढ रहा हूँ...")}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

function QuickReplyBtn({ label, onClick, small }: { label: string; onClick: () => void; small?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/15 hover:border-primary/40 transition-all text-center font-medium ${
        small ? "px-2 py-2 text-xs" : "px-3 py-2.5 text-sm"
      }`}
    >
      {label}
    </motion.button>
  );
}

export default Chatbot;
