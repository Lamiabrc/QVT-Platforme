import { useRef, useState } from "react";
import { Mic, MicOff, PlayCircle } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaChatPanel from "@/components/ZenaChatPanel";

type Sphere = "family" | "company";

export default function ZenaChoicePage() {
  const [sphere, setSphere] = useState<Sphere>("family");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef<any>(null);

  const getRecognition = () => {
    if (typeof window === "undefined") return null;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results || [])
          .map((result: any) => result[0]?.transcript ?? "")
          .join(" ")
          .trim();
        if (transcript) setVoiceText(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    return recognitionRef.current;
  };

  const startPushToTalk = () => {
    if (!voiceEnabled || isListening) return;
    const recognition = getRecognition();
    if (!recognition) {
      setVoiceText("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
      return;
    }
    setIsListening(true);
    recognition.start();
  };

  const stopPushToTalk = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F4ECE0]" />
          <div className="absolute -left-12 top-20 h-64 w-64 rounded-full bg-[#CFECE8]/45 blur-3xl" />
          <div className="absolute -right-8 top-24 h-72 w-72 rounded-full bg-[#F3E0B9]/45 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.02fr,0.98fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">ZÉNA</p>
              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Parlez à ZÉNA.</h1>
              <p className="mt-4 max-w-3xl text-base text-[#6F6454] md:text-lg">
                Décrivez ce que vous ressentez. ZÉNA aide à mettre des mots et propose une action
                concrète.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSphere("family")}
                  className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                    sphere === "family"
                      ? "bg-[#1B1A18] text-[#FAF6EE]"
                      : "border border-[#1B1A18]/20 bg-white text-[#1B1A18]"
                  }`}
                >
                  Vie perso
                </button>
                <button
                  type="button"
                  onClick={() => setSphere("company")}
                  className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                    sphere === "company"
                      ? "bg-[#1B1A18] text-[#FAF6EE]"
                      : "border border-[#1B1A18]/20 bg-white text-[#1B1A18]"
                  }`}
                >
                  Entreprise
                </button>
              </div>

              <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white/90 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Voix (push-to-talk)</h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceEnabled) stopPushToTalk();
                      setVoiceEnabled((prev) => !prev);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                      voiceEnabled
                        ? "bg-[#1B1A18] text-[#FAF6EE]"
                        : "border border-[#1B1A18]/20 bg-white text-[#1B1A18]"
                    }`}
                  >
                    {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    {voiceEnabled ? "Voix activée" : "Activer la voix"}
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!voiceEnabled}
                  onMouseDown={startPushToTalk}
                  onMouseUp={stopPushToTalk}
                  onMouseLeave={stopPushToTalk}
                  onTouchStart={startPushToTalk}
                  onTouchEnd={stopPushToTalk}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-[#1B1A18]/20 bg-[#FAF6EE] px-5 py-4 text-sm font-semibold text-[#1B1A18] transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isListening ? "Parlez, ZÉNA écoute..." : "Maintenir pour parler"}
                </button>

                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#6F6454]">
                  <li>
                    Option explicitement activée par l’utilisateur (push-to-talk), jamais en écoute
                    passive.
                  </li>
                  <li>Pas de promesses médicales, pas de diagnostic.</li>
                </ul>

                {voiceText ? (
                  <div className="mt-4 rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] p-4 text-sm text-[#5F5345]">
                    Dernière transcription: {voiceText}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-[0_20px_46px_rgba(27,26,24,0.14)]">
                <img
                  src="/zena-still.jpg"
                  alt="ZÉNA sur QVT Box"
                  className="h-[220px] w-full object-cover sm:h-[250px]"
                />
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-[0_20px_46px_rgba(27,26,24,0.14)]">
                <video
                  src="/images/zena-intro.mp4"
                  className="h-[220px] w-full object-cover sm:h-[250px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <p className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  <PlayCircle className="h-4 w-4" />
                  Démo visuelle ZÉNA
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <ZenaChatPanel
              sphere={sphere}
              title="Parlez à ZÉNA."
              subtitle="Décrivez ce que vous ressentez. ZÉNA aide à mettre des mots et propose une action concrète."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
