// src/pages/ZenaChatPage.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Mic, SendHorizonal, Volume2, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";

type Message = {
  id: number;
  from: "user" | "zena";
  text: string;
  emotion?: "positive" | "neutral" | "negative";
};

export default function ZenaChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "zena",
      text: "Bonjour, je suis ZENA. Je suis la pour toi. Comment tu te sens vraiment aujourd'hui, entre 0 et 10 ?",
      emotion: "neutral",
    },
  ]);
  const [input, setInput] = useState("");
  const [listeningTranscript, setListeningTranscript] = useState("");
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const emotionLabels: Record<NonNullable<Message["emotion"]>, string> = {
    positive: "apaisee",
    neutral: "neutre",
    negative: "sous tension",
  };

  const emotionClasses: Record<NonNullable<Message["emotion"]>, string> = {
    positive: "text-emerald-200",
    neutral: "text-[#f1d6a0]",
    negative: "text-rose-200",
  };

  const handleFinalResult = useCallback(
    (transcript: string) => {
      setListeningTranscript(transcript);
      if (transcript) {
        setInput(transcript);
        setTimeout(() => {
          const userMsg: Message = {
            id: nextId.current++,
            from: "user",
            text: transcript,
            emotion: "neutral",
          };
          setMessages((prev) => [...prev, userMsg]);
          setInput("");
          addZenaReply(transcript);
        }, 300);
      }
    },
    [] // nextId is ref, addZenaReply defined below via hoisting
  );

  const { isListening, isSpeaking, audioLevel, listen, stopListening, say } = useZenaVoice({ onFinalResult: handleFinalResult });

  const { emotion, isProcessing, handleUserMessage } = useZenaZenoBrain();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function addZenaReply(userText: string) {
    const response = await handleUserMessage(userText);

    const newMsg: Message = {
      id: nextId.current++,
      from: "zena",
      text: response || "Merci de me le confier. On peut respirer un instant ensemble. Qu'est-ce qui te pese le plus, la tout de suite ?",
      emotion: emotion || "neutral",
    };
    setMessages((prev) => [...prev, newMsg]);

    say(newMsg.text);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSpeaking || isProcessing) return;

    const userMsg: Message = {
      id: nextId.current++,
      from: "user",
      text: trimmed,
      emotion: "neutral",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    addZenaReply(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleMicClick() {
    if (isListening) {
      stopListening();
    } else {
      listen();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0b0806] via-[#1b140f] to-[#2d231c] text-[#f7ede0] relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,238,214,0.12),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(255,214,186,0.1),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(207,164,104,0.16),transparent_55%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(255, 214, 160, 0.18) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      </div>

      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 text-[#f7ede0] hover:text-[#f1d6a0] transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold text-[#f7ede0] heading-chic tracking-[0.18em]">ZENA</h1>
        <div className="w-20" />
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        <motion.div
          className="lg:w-[340px] flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-xs rounded-3xl bg-[#120d0a]/80 backdrop-blur-xl border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.45)] p-6">
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#f1d6a0]">Presence</p>
              <h2 className="heading-chic text-xl text-[#fff0d9]">ZENA</h2>
              <p className="text-sm text-[#c9b495]">Je suis la pour t'ecouter, sans jugement.</p>
            </div>

            <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden shadow-2xl">
              <div className="absolute inset-0 rounded-full ring-2 ring-[#f1d6a0]/50" />
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#f1d6a0]/40 via-transparent to-[#7b5fd8]/30 opacity-70 blur-2xl" />
              <ZenaAvatar
                emotion={emotion || "neutral"}
                mouthLevel={audioLevel}
                isListening={isListening}
                isSpeaking={isSpeaking}
                gender="female"
              />
            </div>

            <div className="flex flex-col gap-2 items-center mt-5">
              {isSpeaking && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-400/20 text-emerald-100 rounded-full text-xs font-semibold tracking-wide"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Je te reponds</span>
                </motion.div>
              )}
              {isListening && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-blue-400/20 text-blue-100 rounded-full text-xs font-semibold tracking-wide"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic className="w-4 h-4" />
                  <span>Je t'ecoute</span>
                </motion.div>
              )}
              {listeningTranscript && (
                <p className="text-xs text-[#e9dcc5] italic text-center bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  "{listeningTranscript}"
                </p>
              )}
            </div>

            {emotion && (
              <div className="text-center mt-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[#c9b495]">Ce que je percois</p>
                <p className={`text-lg font-semibold capitalize ${emotionClasses[emotion]}`}>
                  {emotionLabels[emotion]}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex flex-col bg-[#120d0a]/70 backdrop-blur-xl rounded-[32px] border border-white/10 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#f1d6a0]">Conversation</p>
            <h2 className="heading-chic text-xl text-[#fff0d9]">Un espace pour deposer ce qui pese, sans pression</h2>
            <p className="text-sm text-[#c9b495] mt-1">
              Ici, tu peux parler librement. Je suis la pour t'accompagner, a ton rythme.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl border ${
                      msg.from === "user"
                        ? "bg-gradient-to-br from-[#f1d6a0] via-[#e6c28b] to-[#d8ad6f] text-[#1b130e] border-transparent shadow-[0_10px_25px_rgba(241,214,160,0.25)]"
                        : msg.emotion === "positive"
                        ? "bg-emerald-900/40 text-emerald-100 border-emerald-400/30"
                        : msg.emotion === "negative"
                        ? "bg-rose-900/40 text-rose-100 border-rose-400/30"
                        : "bg-[#1c140f] text-[#f7ede0] border-white/10"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-[#1c140f] text-[#f7ede0] px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Je prends un instant pour te repondre...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-sm">
            <div className="flex gap-3">
              <button
                onClick={handleMicClick}
                disabled={isSpeaking || isProcessing}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
                  isListening ? "bg-blue-500 text-white" : "bg-white/10 text-[#f7ede0] hover:bg-white/20 disabled:opacity-50"
                }`}
                aria-label={isListening ? "Arreter l'ecoute" : "Demarrer l'ecoute"}
              >
                <Mic className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSpeaking || isProcessing}
                placeholder="Dis-moi ce qui te preoccupe..."
                className="flex-1 px-4 py-2 bg-white/10 rounded-full text-[#f7ede0] placeholder-[#c9b495] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#f1d6a0] resize-none disabled:opacity-50"
                rows={1}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isSpeaking || isProcessing}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f1d6a0] text-[#1b130e] flex items-center justify-center hover:brightness-110 transition disabled:opacity-50"
                aria-label="Envoyer le message"
              >
                <SendHorizonal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {["Je me sens epuise(e)", "Je suis stresse(e)", "J'ai besoin d'en parler"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setInput(chip)}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#e9dcc5] hover:text-white hover:border-[#f1d6a0]/60 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
