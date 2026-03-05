import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bubble from "@/components/social/Bubble";
import type { BubbleData } from "@/data/bubbles";
import { bubbles as defaultBubbles } from "@/data/bubbles";

type ViewMode = "universe" | "inside";

type Props = {
  bubbles?: BubbleData[];
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function BubbleUniverse({ bubbles = defaultBubbles }: Props) {
  const [selected, setSelected] = useState<BubbleData | null>(null);
  const [mode, setMode] = useState<ViewMode>("universe");

  // “caméra”
  const camera = useMemo(() => {
    if (!selected) {
      return { scale: 1, x: 0, y: 0 };
    }

    // On centre la bulle cliquée : bubble.x / bubble.y sont en %
    // On place l’origine au centre de l’écran (50%,50%) puis on translate
    // Note: on utilise des % pour rester responsive.
    const dx = (50 - selected.x) * 1; // %
    const dy = (50 - selected.y) * 1; // %

    // Zoom : plus la bulle est petite, plus on zoom.
    const targetScale = clamp(2.2 + (120 - selected.size) / 120, 2.0, 3.2);

    return { scale: targetScale, x: dx, y: dy };
  }, [selected]);

  const enterBubble = (b: BubbleData) => {
    setSelected(b);
    // On passe en "inside" après un tout petit délai visuel via onAnimationComplete (plus bas),
    // mais on peut aussi basculer directement si tu veux.
  };

  const exitBubble = () => {
    setMode("universe");
    setSelected(null);
  };

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden rounded-[32px] border border-[#E8DCC8] bg-[#FAF6EE]">
      {/* Fond plus “réaliste” (évite l’effet dessin) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 30% 20%, rgba(120, 208, 190, 0.18), transparent 60%), radial-gradient(900px 500px at 70% 80%, rgba(191, 167, 118, 0.14), transparent 60%), radial-gradient(600px 400px at 80% 25%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.08))",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22 opacity=%220.28%22/%3E%3C/svg%3E')",
          backgroundSize: "240px 240px",
        }}
      />

      {/* UI header */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#9C8D77]">Réseau de bulles</p>
          <h2 className="mt-1 text-lg font-semibold text-[#1B1A18]">
            {mode === "inside" && selected ? `Dans la bulle : ${selected.name}` : "Zoom pour entrer"}
          </h2>
        </div>

        <div className="flex gap-2">
          {selected ? (
            <button
              type="button"
              onClick={exitBubble}
              className="rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
            >
              Retour
            </button>
          ) : (
            <span className="rounded-full border border-[#E8DCC8] bg-white/70 px-4 py-2 text-xs text-[#6F6454]">
              Clique une bulle
            </span>
          )}
        </div>
      </div>

      {/* Zone 3D / caméra */}
      <div
        className="relative h-[60vh] w-full"
        style={{
          perspective: "900px",
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            // translate en % (via CSS transform), scale pour zoom
            // On combine translate + scale
            transform: `translate(${camera.x}%, ${camera.y}%) scale(${camera.scale})`,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          onAnimationComplete={() => {
            if (selected && mode !== "inside") setMode("inside");
          }}
        >
          {/* Un “plan” d’univers plus grand */}
          <div className="absolute inset-0">
            {bubbles.map((b, idx) => (
              <Bubble
                key={b.id ?? `${b.name}-${idx}`}
                bubble={b}
                index={idx}
                isCenter={selected?.name === b.name}
                onClick={enterBubble}
              />
            ))}
          </div>
        </motion.div>

        {/* Panneau “à l’intérieur” */}
        <AnimatePresence>
          {mode === "inside" && selected ? (
            <motion.div
              className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-[#E8DCC8] bg-white/85 p-5 backdrop-blur-md"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#9C8D77]">Page de bulle</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#1B1A18]">{selected.name}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-[#6F6454]">
                    Ici tu affiches les pages : Fil, Membres, Référent/Lucioles, Calendrier, Box…
                    (c’est ton BubbleDetailPage / BullesPage)
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Place ici ta navigation vers la page réelle :
                      // ex: navigate(`/bulle/${selected.id}`) si tu as un router.
                      // Pour l’instant : simple feedback.
                      alert(`Ouvrir la bulle: ${selected.name}`);
                    }}
                    className="rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                  >
                    Ouvrir
                  </button>

                  <button
                    type="button"
                    onClick={exitBubble}
                    className="rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold text-[#1B1A18]"
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

