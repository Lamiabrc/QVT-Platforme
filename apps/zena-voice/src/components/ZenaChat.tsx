import { useState } from "react";
import { Mic, Volume2, Send } from "lucide-react";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";

export default function ZenaChat() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function send() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    // Appel IA Zena (à relier à ton backend / openai)
    const response = {
      role: "assistant",
      content: "Je t’écoute. Dis-moi ce que tu ressens, je suis là."
    };

    setMessages((prev) => [...prev, response]);
  }

  return (
    <div className="h-screen bg-[#FAF6EE] flex flex-col items-center pt-24 px-4">
      <div className="mb-6">
        <ZenaFaceParticles />
      </div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 flex flex-col gap-4">
        <div className="h-[300px] overflow-y-auto pr-2 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-[#C3A878] text-[#1B1A18] self-end"
                  : "bg-[#F1E9D8] text-[#3C352A] self-start"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-[#E8D9BD] rounded-full" aria-label="Activer le micro" title="Activer le micro">
            <Mic className="w-5 h-5" />
          </button>

          <input
            className="flex-1 p-3 border border-[#C3A878]/40 rounded-full bg-white"
            placeholder="Parlez-moi…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={send}
            className="p-2 bg-[#C3A878] text-[#1B1A18] rounded-full"
            aria-label="Envoyer le message"
            title="Envoyer le message"
          >
            <Send className="w-4 h-4" />
          </button>

          <button className="p-2 bg-[#E8D9BD] rounded-full" aria-label="Activer le haut-parleur" title="Activer le haut-parleur">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
