// src/components/ZenaChatDock.tsx
import React, { useEffect, useState } from "react";
import { Mic, Send, Sparkles } from "lucide-react";

type Message = {
  id: number;
  from: "user" | "zena";
  text: string;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition?: any;
  }
}

function synthSpeak(text: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.98;
  utterance.pitch = 1.02;
  utterance.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function buildZenaReply(input: string): string {
  const cleaned = input.trim();
  if (!cleaned) {
    return "Je suis là. Dis-moi simplement comment tu te sens en ce moment.";
  }

  return (
    "Merci de me le confier. " +
    "Si je résume, tu exprimes : « " +
    cleaned +
    " ». " +
    "Sur une échelle de 1 à 10, à combien est-ce que tu situerais ton niveau d’énergie aujourd’hui ?"
  );
}

export default function ZenaChatDock() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "zena",
      text: "Bonjour, je suis ZÉNA. On prend une minute ensemble ? Comment ça va vraiment aujourd’hui au travail ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any | null>(null);

  // Initialise la reconnaissance vocale si dispo
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = "fr-FR";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (event: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = (event as any).results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
  }, []);

  // Fait parler ZÉNA pour chaque nouveau message venant d’elle
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.from === "zena") {
      synthSpeak(last.text);
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: trimmed },
    ]);

    const reply = buildZenaReply(trimmed);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: "zena", text: reply },
      ]);
    }, 600);

    setInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      alert(
        "La reconnaissance vocale n’est pas disponible sur ce navigateur. Tu peux taper ton message au clavier."
      );
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <section
      id="tester-zena"
      className="mt-10 rounded-3xl border border-[#F9E3C1]/70 bg-[#FFF8EE]/60 shadow-[0_18px_45px_rgba(145,112,54,0.25)] backdrop-blur-md px-4 py-4 md:px-6 md:py-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#F8D9A4] to-[#C79BE8]">
          <Sparkles className="h-4 w-4 text-[#4A3520]" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#A4875D]">
            Tester en direct
          </p>
          <p className="text-sm text-[#4A3520]">
            Écris une phrase comme si tu étais un salarié, ZÉNA te répondra à voix
            haute.
          </p>
        </div>
      </div>

      {/* Fil de discussion */}
      <div className="mb-4 max-h-64 overflow-y-auto rounded-2xl bg-[#FFF2E3]/70 px-3 py-3 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-[#F3D19E] text-[#3A2714]"
                  : "bg-[#2B221D] text-[#FCEFD9]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="« Honnêtement… je me sens épuisé mais j’ai peur de le dire à mon manager. »"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-full border border-[#F0D0A0]/80 bg-white/80 px-4 py-2 pr-10 text-sm text-[#3A2714] placeholder:text-[#C0A57F]"
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
              isListening
                ? "border-[#C0794C] bg-[#FEE4D6] text-[#8A3F22]"
                : "border-transparent bg-[#F5E4CF] text-[#5A4228]"
            }`}
            aria-label="Activer ou désactiver l'écoute"
            title="Activer ou désactiver l'écoute"
          >
            <Mic className="h-3 w-3" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center gap-1 rounded-full bg-[#C58B3B] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#D79A45] transition-colors"
          aria-label="Envoyer le message"
          title="Envoyer le message"
        >
          Envoyer
          <Send className="h-3 w-3" />
        </button>
      </div>
    </section>
  );
}
