import { useMemo, useState } from "react";
import type { CSSProperties, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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

type Firefly = {
  id: string;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  duration: number;
  delay: number;
  blur: number;
  opacity: number;
};

const bubbleMetaById: Record<string, BubbleMeta> = {
  accueil: {
    title: "Bulle Accueil",
    description: "Retour vers la porte d'entree de QVT Box.",
    actionLabel: "Aller a l'accueil",
    path: "/home",
  },
  zena: {
    title: "Bulle ZENA",
    description: "Acces a l'univers ZENA et aux parcours d'accompagnement.",
    actionLabel: "Ouvrir ZENA",
    path: "/zena",
  },
  "mon-univers": {
    title: "Bulle Mon univers",
    description: "Ton espace principal avec ton activite et tes bulles.",
    actionLabel: "Entrer dans mon univers",
    path: "/dashboard",
  },
  boutique: {
    title: "Bulle Boutique",
    description: "Personnalise le contenu de tes box et explore les offres.",
    actionLabel: "Personnaliser mes box",
    path: "/boutique",
  },
};

const quickLinks = [
  { id: "accueil", label: "Accueil", path: "/home", color: "from-sky-200/70 to-indigo-200/70" },
  { id: "zena", label: "ZENA", path: "/zena", color: "from-fuchsia-200/70 to-violet-200/70" },
  { id: "mon-univers", label: "Mon univers", path: "/dashboard", color: "from-cyan-200/70 to-blue-200/70" },
  { id: "boutique", label: "Boutique", path: "/boutique", color: "from-teal-200/70 to-cyan-200/70" },
];

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

const fireflies: Firefly[] = Array.from({ length: 24 }, (_, index) => {
  const x = (index * 17) % 96;
  const y = (index * 31) % 88;
  const size = 3 + (index % 4);
  const dx = -22 + (index % 5) * 11;
  const dy = -18 + (index % 7) * 6;
  const duration = 8 + (index % 6) * 1.6;
  const delay = (index % 8) * 0.4;
  const blur = 1.2 + (index % 3) * 0.8;
  const opacity = 0.28 + (index % 4) * 0.09;

  return {
    id: `firefly-${index}`,
    x,
    y,
    size,
    dx,
    dy,
    duration,
    delay,
    blur,
    opacity,
  };
});

export default function BubbleUniverse({ bubbles = defaultBubbles }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<BubbleData | null>(null);
  const [mode, setMode] = useState<ViewMode>("universe");
  const [manualZoom, setManualZoom] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

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
    const targetScale = clamp(2.08 + (145 - selected.size) / 160, 1.8, 3.05);

    return { scale: targetScale, x: dx, y: dy };
  }, [selected]);

  const finalScale = clamp(camera.scale * manualZoom, 0.62, 4.2);

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const step = event.deltaY < 0 ? 0.09 : -0.09;
    setManualZoom((currentZoom) => clamp(Number((currentZoom + step).toFixed(2)), 0.7, 2.2));
  };

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
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#01040D]"
      onWheel={handleWheelZoom}
      aria-label="Univers des bulles"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1500px 820px at 20% 12%, rgba(40,86,182,0.36), transparent 62%), radial-gradient(1180px 760px at 83% 16%, rgba(130,62,205,0.28), transparent 62%), radial-gradient(980px 680px at 60% 82%, rgba(49,190,170,0.20), transparent 64%), linear-gradient(180deg, #060D23 0%, #020710 62%, #01040D 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 16%, rgba(255,255,255,0.40), transparent), radial-gradient(1.2px 1.2px at 27% 70%, rgba(255,255,255,0.42), transparent), radial-gradient(1.4px 1.4px at 84% 26%, rgba(255,255,255,0.38), transparent), radial-gradient(1.1px 1.1px at 72% 80%, rgba(255,255,255,0.35), transparent), radial-gradient(1.2px 1.2px at 58% 14%, rgba(255,255,255,0.33), transparent), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.32), transparent)",
        }}
      />

      <div className="absolute inset-0">
        {fireflies.map((firefly) => (
          <motion.span
            key={firefly.id}
            className="absolute rounded-full bg-[#F6E7AE]"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              width: firefly.size,
              height: firefly.size,
              filter: `blur(${firefly.blur}px)`,
              opacity: firefly.opacity,
              boxShadow: "0 0 18px rgba(246,231,174,0.58)",
            }}
            animate={{
              x: [0, firefly.dx, -firefly.dx * 0.4, 0],
              y: [0, firefly.dy, -firefly.dy * 0.35, 0],
              opacity: [firefly.opacity * 0.45, firefly.opacity, firefly.opacity * 0.35, firefly.opacity * 0.75],
              scale: [0.8, 1.2, 0.9, 1.05],
            }}
            transition={{
              duration: firefly.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: firefly.delay,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-[#3C5D97]/65 bg-[#061533]/55 px-4 py-2 text-xs text-[#C9D8F6] backdrop-blur-md md:left-8 md:top-8">
        Molette: zoom/dezoom
      </div>

      <div className="absolute right-4 top-4 z-30 md:right-8 md:top-8">
        <motion.button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative h-16 w-16 rounded-full border border-[#6D89C4] bg-[#0C1C3D]/80 text-xs font-semibold text-[#EAF2FF] backdrop-blur-md"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Ouvrir le menu bulles"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/22 to-transparent" />
          <span className="relative">Menu</span>
        </motion.button>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              className="absolute right-0 top-20 flex flex-col gap-2"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              {quickLinks.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`inline-flex items-center justify-center rounded-full border border-[#6D89C4]/80 bg-gradient-to-r px-4 py-2 text-xs font-semibold text-[#EAF2FF] shadow-[0_12px_35px_rgba(3,10,29,0.65)] ${item.color}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="relative h-screen w-full" style={{ perspective: "1200px" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ transform: `translate(${camera.x}%, ${camera.y}%) scale(${finalScale})` }}
          transition={{ type: "spring", stiffness: 118, damping: 20 }}
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
                      className="absolute h-px bg-gradient-to-r from-[#74A0FF]/35 via-[#7FD4E7]/28 to-transparent"
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
              className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-[#3E61A0] bg-[#08132B]/78 p-5 backdrop-blur-xl md:inset-x-8 md:max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.24 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#98B5EB]/90">page de bulle</p>
              <h3 className="mt-1 text-xl font-semibold text-[#EAF2FF]">{selectedMeta.title}</h3>
              <p className="mt-2 text-sm text-[#C6D7F5]">{selectedMeta.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
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
                  Retour univers
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
