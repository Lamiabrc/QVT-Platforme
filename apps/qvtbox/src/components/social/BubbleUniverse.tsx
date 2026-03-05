import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Bubble from "@/components/social/Bubble";
import type { BubbleData } from "@/data/bubbles";
import { bubbles as defaultBubbles } from "@/data/bubbles";

type ViewMode = "universe" | "inside";

type Props = {
  bubbles?: BubbleData[];
};

type BubbleMeta = {
  title: string;
  description: string;
  actionLabel: string;
  path: string;
};

const bubbleMetaById: Record<string, BubbleMeta> = {
  accueil: {
    title: "Bulle Accueil",
    description: "Retour vers la porte d'entree de QVT Box et les points de depart principaux.",
    actionLabel: "Aller a l'accueil",
    path: "/",
  },
  zena: {
    title: "Bulle ZENA",
    description: "Acces a l'univers ZENA pour l'accompagnement, la voix et les parcours bien-etre.",
    actionLabel: "Ouvrir ZENA",
    path: "/zena",
  },
  "mon-univers": {
    title: "Bulle Mon univers",
    description: "Ton espace personnel avec ton activite, tes bulles et ton suivi quotidien.",
    actionLabel: "Entrer dans mon univers",
    path: "/dashboard",
  },
  boutique: {
    title: "Bulle Boutique",
    description: "Personnalise le contenu de tes box et accede aux offres adaptees a tes besoins.",
    actionLabel: "Personnaliser mes box",
    path: "/boutique",
  },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getLineStyle = (from: BubbleData, to: BubbleData): CSSProperties => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return {
    left: `${from.x}%`,
    top: `${from.y}%`,
    width: `${distance}%`,
    transform: `translateY(-50%) rotate(${angle}deg)`,
    transformOrigin: "0 50%",
  };
};

export default function BubbleUniverse({ bubbles = defaultBubbles }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<BubbleData | null>(null);
  const [mode, setMode] = useState<ViewMode>("universe");

  const centerBubble = useMemo(
    () => bubbles.find((bubble) => bubble.id === "mon-univers") ?? bubbles[0] ?? null,
    [bubbles],
  );

  const selectedMeta = useMemo(
    () => (selected ? bubbleMetaById[selected.id] : null),
    [selected],
  );

  const camera = useMemo(() => {
    if (!selected) return { scale: 1, x: 0, y: 0 };

    const dx = 50 - selected.x;
    const dy = 50 - selected.y;
    const targetScale = clamp(2.1 + (145 - selected.size) / 150, 1.9, 3.1);

    return { scale: targetScale, x: dx, y: dy };
  }, [selected]);

  const enterBubble = (bubble: BubbleData) => {
    setMode("universe");
    setSelected(bubble);
  };

  const exitBubble = () => {
    setMode("universe");
    setSelected(null);
  };

  const openSelectedBubble = () => {
    if (!selected) return;
    const destination = bubbleMetaById[selected.id]?.path ?? `/bulle/${selected.id}`;
    navigate(destination);
  };

  return (
    <div className="relative min-h-[72vh] w-full overflow-hidden rounded-[32px] border border-[#24355A] bg-[#030916] shadow-[0_30px_120px_rgba(1,8,22,0.65)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 18% 12%, rgba(58, 103, 196, 0.34), transparent 60%), radial-gradient(1000px 620px at 84% 24%, rgba(137, 76, 210, 0.24), transparent 62%), radial-gradient(1000px 600px at 60% 80%, rgba(46, 174, 170, 0.20), transparent 64%), linear-gradient(180deg, #07122C 0%, #030916 55%, #020512 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 12% 24%, rgba(255,255,255,0.50), transparent), radial-gradient(1.6px 1.6px at 82% 18%, rgba(255,255,255,0.44), transparent), radial-gradient(1.8px 1.8px at 72% 72%, rgba(255,255,255,0.36), transparent), radial-gradient(1.5px 1.5px at 28% 78%, rgba(255,255,255,0.40), transparent)",
        }}
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-7">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#93AEE5]/80">univers des bulles</p>
          <h2 className="mt-1 text-lg font-semibold text-[#EAF2FF]">
            {mode === "inside" && selected ? `Dans ${selected.name}` : "Clique une bulle pour zoomer"}
          </h2>
        </div>

        {selected ? (
          <button
            type="button"
            onClick={exitBubble}
            className="rounded-full border border-[#6D89C4] bg-[#0C1C3D]/80 px-4 py-2 text-sm font-semibold text-[#EAF2FF] transition hover:bg-[#122B5D]"
          >
            Retour univers
          </button>
        ) : (
          <span className="rounded-full border border-[#355488] bg-[#0A1733]/70 px-4 py-2 text-xs text-[#B9CDF3]">
            Accueil, ZENA, Mon univers, Boutique
          </span>
        )}
      </div>

      <div className="relative h-[62vh] w-full" style={{ perspective: "1100px" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ transform: `translate(${camera.x}%, ${camera.y}%) scale(${camera.scale})` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          onAnimationComplete={() => {
            if (selected && mode !== "inside") {
              setMode("inside");
            }
          }}
        >
          <div className="absolute inset-0">
            {centerBubble
              ? bubbles
                  .filter((bubble) => bubble.id !== centerBubble.id)
                  .map((bubble) => (
                    <div
                      key={`link-${bubble.id}`}
                      className="absolute h-px bg-gradient-to-r from-[#6A90E7]/45 to-[#86E2E6]/25"
                      style={getLineStyle(centerBubble, bubble)}
                    />
                  ))
              : null}

            {bubbles.map((bubble, index) => (
              <Bubble
                key={bubble.id}
                bubble={bubble}
                index={index}
                isCenter={selected ? selected.id === bubble.id : centerBubble?.id === bubble.id}
                onClick={enterBubble}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {mode === "inside" && selected && selectedMeta ? (
            <motion.div
              className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-[#385894] bg-[#08132B]/78 p-5 backdrop-blur-xl md:inset-x-8 md:p-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#98B5EB]/90">page de bulle</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#EAF2FF]">{selectedMeta.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-[#C6D7F5]">{selectedMeta.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={openSelectedBubble}
                    className="rounded-full bg-[#EAF2FF] px-4 py-2 text-sm font-semibold text-[#0A1A3B] transition hover:bg-white"
                  >
                    {selectedMeta.actionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={exitBubble}
                    className="rounded-full border border-[#6D89C4] px-4 py-2 text-sm font-semibold text-[#EAF2FF] transition hover:bg-[#112753]"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
