import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Mic, MicOff, Siren, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createPost, createReport, fetchMyBubbles, type BubbleItem, type ShareLevel } from "@/lib/social";

type AdoTheme = {
  id: string;
  title: string;
  tips: [string, string, string];
  orientation: string;
};

const THEMES: AdoTheme[] = [
  {
    id: "stress-anxiete",
    title: "Stress et anxiété",
    tips: ["Respire 4-4-6 pendant 2 minutes.", "Découpe la tâche en 1 micro-action.", "Éloigne le téléphone 15 minutes."],
    orientation: "Parler à ton référent ou à une Luciole si la pression reste forte.",
  },
  {
    id: "confiance-soi",
    title: "Confiance en soi",
    tips: ["Note 1 réussite du jour.", "Remplace “je suis nul” par “j’apprends”.", "Demande un feedback précis à un adulte de confiance."],
    orientation: "Si ça dure, demande un échange guidé avec une Luciole.",
  },
  {
    id: "amitie-pression",
    title: "Amitiés et pression sociale",
    tips: ["Prends 10 minutes avant de répondre à un conflit.", "Pose une limite claire en 1 phrase.", "Parle à une personne sûre avant d’agir."],
    orientation: "Référent recommandé si tu te sens isolé·e ou forcé·e.",
  },
  {
    id: "harcelement-cyber",
    title: "Harcèlement / cyber",
    tips: ["Conserve des preuves (captures).", "Bloque et signale sur la plateforme.", "Préviens un adulte référent rapidement."],
    orientation: "Utilise le bouton d’aide urgente maintenant si danger.",
  },
  {
    id: "relation-parents",
    title: "Relation parents",
    tips: ["Exprime un besoin concret, pas un reproche global.", "Choisis un moment calme pour parler.", "Propose un compromis simple."],
    orientation: "Demande un échange à 3 (toi + référent + Luciole).",
  },
  {
    id: "ecole-orientation",
    title: "École / charge / orientation",
    tips: ["Classe les priorités: urgent / important.", "Travaille en blocs de 25 minutes.", "Fixe une pause écran avant dormir."],
    orientation: "Un référent peut t’aider à construire un planning réaliste.",
  },
  {
    id: "sommeil-colere-solitude",
    title: "Sommeil / colère / solitude",
    tips: ["Rituel de coucher identique 5 jours d’affilée.", "Quand la colère monte: eau + 2 minutes de pause.", "Écris à un proche avant de t’isoler."],
    orientation: "Si tu te sens en danger, lance la demande d’aide immédiate.",
  },
  {
    id: "reseaux-motivation",
    title: "Réseaux sociaux / motivation",
    tips: ["Désactive 1 notification non utile.", "Fixe un objectif de 10 minutes.", "Commence par la tâche la plus simple."],
    orientation: "Une Luciole peut t’aider à retrouver un rythme.",
  },
];

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ||
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
  return SpeechRecognition ?? null;
};

export default function AdoPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [themes] = useState<AdoTheme[]>(THEMES);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(THEMES[0].id);
  const [text, setText] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [shareLevel, setShareLevel] = useState<ShareLevel>("private");
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [bubbleId, setBubbleId] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId) ?? themes[0],
    [selectedThemeId, themes]
  );

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    fetchMyBubbles(user.id)
      .then((rows) => {
        setBubbles(rows);
        if (!bubbleId && rows.length) setBubbleId(rows[0].id);
      })
      .catch(() => {
        setBubbles([]);
      });
  }, [isAuthenticated, user?.id, bubbleId]);

  const startPushToTalk = () => {
    if (!voiceEnabled || isListening) return;
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      toast({
        title: "Voix indisponible",
        description: "La reconnaissance vocale n'est pas disponible sur ce navigateur.",
        variant: "destructive",
      });
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results ?? [])
          .map((result) => result[0]?.transcript ?? "")
          .join(" ")
          .trim();
        if (transcript) {
          setText((prev) => `${prev}${prev ? "\n" : ""}${transcript}`.trim());
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopPushToTalk = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const handleShare = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id || !bubbleId || !text.trim()) {
      toast({
        title: "Partage incomplet",
        description: "Choisis une bulle et écris ce que tu ressens.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await createPost(
        bubbleId,
        user.id,
        `[Ado • ${selectedTheme.title}] ${text.trim()}`,
        shareLevel
      );
      toast({
        title: "Partage envoyé",
        description: "Ton message a été ajouté avec le niveau de partage choisi.",
      });
      setText("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Réessaie dans quelques instants.";
      toast({
        title: "Impossible de partager",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleHelp = async () => {
    if (!user?.id || !bubbleId) {
      toast({
        title: "Aide indisponible",
        description: "Connecte-toi et choisis une bulle pour lancer la demande d’aide.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReport({
        bubbleId,
        reporterId: user.id,
        targetType: "user",
        targetId: user.id,
        reason: `Demande d'aide ado • ${selectedTheme.title} • ${text.trim() || "Sans détail"}`,
      });
      toast({
        title: "Demande d’aide envoyée",
        description: "Le référent/les admins de la bulle ont été notifiés.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Réessaie dans quelques instants.";
      toast({
        title: "Demande d’aide impossible",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Univers ado</p>
            <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Un espace pour en parler sans jugement.</h1>
            <p className="mt-3 max-w-3xl text-sm text-[#6F6454] md:text-base">
              Privé par défaut. Partage choisi. Demande d’aide immédiate en cas de besoin.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedThemeId(theme.id)}
                className={[
                  "rounded-3xl border p-4 text-left transition",
                  selectedThemeId === theme.id
                    ? "border-[#1B1A18] bg-white shadow-sm"
                    : "border-[#E8DCC8] bg-white/80 hover:bg-white",
                ].join(" ")}
              >
                <p className="text-sm font-semibold">{theme.title}</p>
              </button>
            ))}
          </div>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <article className="rounded-3xl border border-[#E8DCC8] bg-white p-5">
              <h2 className="text-lg font-semibold">{selectedTheme.title}</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[#6F6454]">
                {selectedTheme.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ol>
              <p className="mt-4 rounded-2xl bg-[#F8F3E8] px-3 py-2 text-sm text-[#5E5447]">
                Orientation: {selectedTheme.orientation}
              </p>
            </article>

            <form onSubmit={handleShare} className="rounded-3xl border border-[#E8DCC8] bg-white p-5">
              <h2 className="text-lg font-semibold">Partager ce que je ressens</h2>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Écris ce que tu ressens..."
                className="mt-3 min-h-32 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {(["private", "referent", "bubble"] as ShareLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setShareLevel(level)}
                    className={[
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      shareLevel === level
                        ? "bg-[#1B1A18] text-[#FAF6EE]"
                        : "border border-[#E8DCC8] text-[#6F6454]",
                    ].join(" ")}
                  >
                    {level === "private" ? "Privé" : level === "referent" ? "Référent" : "Bulle"}
                  </button>
                ))}
              </div>

              <select
                value={bubbleId}
                onChange={(event) => setBubbleId(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
              >
                <option value="">Choisir une bulle</option>
                {bubbles.map((bubble) => (
                  <option key={bubble.id} value={bubble.id}>
                    {bubble.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE] disabled:opacity-60"
                >
                  <Share2 className="h-4 w-4" />
                  {saving ? "Envoi..." : "Partager"}
                </button>
                <button
                  type="button"
                  onClick={handleHelp}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D89E9E] bg-[#FFF4F4] px-4 py-2 text-sm font-semibold text-[#8A3D3D]"
                >
                  <Siren className="h-4 w-4" />
                  Demander de l’aide
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] p-3 text-xs text-[#6F6454]">
                <div className="flex items-center justify-between gap-2">
                  <p>Voix push-to-talk (jamais écoute passive)</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (voiceEnabled) stopPushToTalk();
                      setVoiceEnabled((prev) => !prev);
                    }}
                    className="rounded-full border border-[#E8DCC8] px-2 py-1 text-[11px]"
                  >
                    {voiceEnabled ? (
                      <span className="inline-flex items-center gap-1">
                        <Mic className="h-3 w-3" /> Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <MicOff className="h-3 w-3" /> Inactif
                      </span>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onMouseDown={startPushToTalk}
                  onMouseUp={stopPushToTalk}
                  onMouseLeave={stopPushToTalk}
                  onTouchStart={startPushToTalk}
                  onTouchEnd={stopPushToTalk}
                  disabled={!voiceEnabled}
                  className="mt-2 rounded-full border border-[#E8DCC8] px-3 py-1 text-[11px] disabled:opacity-50"
                >
                  {isListening ? "Parle maintenant..." : "Maintenir pour parler"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
