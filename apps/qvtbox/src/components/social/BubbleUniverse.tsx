import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Bubble from "@/components/social/Bubble";
import type { BubbleData } from "@/data/bubbles";
import { bubbles as defaultBubbles } from "@/data/bubbles";

type Props = {
  bubbles?: BubbleData[];
};

type BubbleMeta = {
  title: string;
  description: string;
  actionLabel: string;
  path: string;
};

type CameraState = {
  x: number;
  y: number;
  zoom: number;
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
  const stageRef = useRef<HTMLDivElement | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const [selected, setSelected] = useState<BubbleData | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });
  const [wheelZoom, setWheelZoom] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const spacedBubbles = useMemo(() => {
    const anchorX = 50;
    const anchorY = 54;

    return bubbles.map((bubble) => {
      if (bubble.id === "mon-univers") {
        return { ...bubble, x: anchorX, y: anchorY };
      }

      return {
        ...bubble,
        x: clamp(anchorX + (bubble.x - anchorX) * 1.22, 8, 92),
        y: clamp(anchorY + (bubble.y - anchorY) * 1.18, 10, 92),
      };
    });
  }, [bubbles]);

  const centerBubble = useMemo(
    () => spacedBubbles.find((bubble) => bubble.id === "mon-univers") ?? spacedBubbles[0] ?? null,
    [spacedBubbles],
  );

  const selectedMeta = useMemo(
    () => (selected ? bubbleMetaById[selected.id] : null),
    [selected],
  );

  const effectiveZoom = clamp(camera.zoom * wheelZoom, 0.6, 2.8);
  const canZoomOut =
    selected !== null ||
    Math.abs(wheelZoom - 1) > 0.02 ||
    Math.abs(camera.x) > 0.5 ||
    Math.abs(camera.y) > 0.5 ||
    Math.abs(camera.zoom - 1) > 0.02;

  const clearNavigationTimer = () => {
    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
  };

  useEffect(() => {
    const updateSize = () => {
      const node = stageRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    return () => clearNavigationTimer();
  }, []);

  const resetCamera = () => {
    clearNavigationTimer();
    setIsEntering(false);
    setSelected(null);
    setCamera({ x: 0, y: 0, zoom: 1 });
    setWheelZoom(1);
  };

  const resolveBubblePath = (bubble: BubbleData) => {
    return bubbleMetaById[bubble.id]?.path ?? `/bulle/${bubble.id}`;
  };

  const enterBubble = (bubble: BubbleData) => {
    const width = stageSize.width || stageRef.current?.clientWidth || window.innerWidth;
    const height = stageSize.height || stageRef.current?.clientHeight || window.innerHeight;

    const bubbleX = (bubble.x / 100) * width;
    const bubbleY = (bubble.y / 100) * height;

    const translateX = width / 2 - bubbleX;
    const translateY = height / 2 - bubbleY;

    clearNavigationTimer();
    setSelected(bubble);
    setIsEntering(true);
    setCamera({ x: translateX, y: translateY, zoom: 2.2 });

    navigationTimerRef.current = window.setTimeout(() => {
      navigate(resolveBubblePath(bubble));
    }, 450);
  };

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = -event.deltaY;
    setWheelZoom((currentZoom) => clamp(currentZoom * (1 + delta * 0.001), 0.6, 2.8));

    const width = stageSize.width || stageRef.current?.clientWidth || window.innerWidth;
    const height = stageSize.height || stageRef.current?.clientHeight || window.innerHeight;
    const xOffset = (event.clientX / width - 0.5) * delta * 0.06;
    const yOffset = (event.clientY / height - 0.5) * delta * 0.06;

    setCamera((current) => ({
      ...current,
      x: clamp(current.x + xOffset, -220, 220),
      y: clamp(current.y + yOffset, -220, 220),
    }));
  };

  const starfieldParallaxTransform = `translate3d(${camera.x * 0.06}px, ${camera.y * 0.06}px, 0) scale(${1 +
    (effectiveZoom - 1) * 0.08})`;
  const stardustParallaxTransform = `translate3d(${camera.x * 0.12}px, ${camera.y * 0.12}px, 0) scale(${1 +
    (effectiveZoom - 1) * 0.11})`;
  const fireflyParallaxTransform = `translate3d(${camera.x * -0.12}px, ${camera.y * -0.12}px, 0) scale(${1 +
    (effectiveZoom - 1) * 0.04})`;
  const stageTransform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${effectiveZoom}) rotateX(${camera.y *
    -0.008}deg) rotateY(${camera.x * 0.008}deg)`;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#01040D]"
      onWheel={handleWheelZoom}
      aria-label="Univers des bulles"
    >
      <div
        className="absolute inset-0 bg-[#020611]"
        style={{
          backgroundImage: "url('/images/bubbles/starfield-4k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-80"
        animate={{ transform: starfieldParallaxTransform }}
        transition={{ type: "spring", stiffness: 26, damping: 24 }}
        style={{
          backgroundImage: "url('/images/bubbles/starfield-4k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1700px 960px at 18% 8%, rgba(144,180,245,0.20), transparent 63%), radial-gradient(1320px 860px at 85% 14%, rgba(182,168,231,0.15), transparent 64%), radial-gradient(1120px 760px at 56% 86%, rgba(147,214,218,0.11), transparent 68%), linear-gradient(180deg, rgba(4,8,20,0.62) 0%, rgba(3,7,16,0.76) 62%, rgba(2,4,10,0.88) 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-70"
        animate={{ transform: stardustParallaxTransform }}
        transition={{ type: "spring", stiffness: 30, damping: 22 }}
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 16%, rgba(255,255,255,0.35), transparent), radial-gradient(1.2px 1.2px at 27% 70%, rgba(255,255,255,0.34), transparent), radial-gradient(1.4px 1.4px at 84% 26%, rgba(255,255,255,0.31), transparent), radial-gradient(1.1px 1.1px at 72% 80%, rgba(255,255,255,0.28), transparent), radial-gradient(1.2px 1.2px at 58% 14%, rgba(255,255,255,0.27), transparent), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.24), transparent)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ transform: fireflyParallaxTransform }}
        transition={{ type: "spring", stiffness: 24, damping: 20 }}
      >
        {fireflies.map((firefly) => (
          <motion.span
            key={firefly.id}
            className="absolute block rounded-full"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              width: firefly.size * 5.2,
              height: firefly.size * 5.2,
              backgroundColor: "rgba(246,231,174,0.72)",
              backgroundImage: "url('/images/bubbles/luciole.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: `blur(${firefly.blur}px)`,
              opacity: firefly.opacity * 0.95,
              boxShadow: "0 0 22px rgba(242,225,152,0.45)",
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
      </motion.div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-[#3C5D97]/65 bg-[#061533]/55 px-4 py-2 text-xs text-[#C9D8F6] backdrop-blur-md md:left-8 md:top-8">
        Molette: zoom/dezoom camera
      </div>

      {canZoomOut ? (
        <button
          type="button"
          onClick={resetCamera}
          className="absolute left-4 top-16 z-30 rounded-full border border-[#6D89C4] bg-[#0C1C3D]/80 px-4 py-2 text-xs font-semibold text-[#EAF2FF] backdrop-blur-md transition hover:bg-[#122B5D] md:left-8 md:top-20"
        >
          Retour / zoom out
        </button>
      ) : null}

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

      <div ref={stageRef} className="relative h-screen w-full" style={{ perspective: "1000px" }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            transform: stageTransform,
          }}
          transition={{ type: "spring", stiffness: 106, damping: 22 }}
        >
          <div className="absolute inset-0">
            {centerBubble
              ? spacedBubbles
                  .filter((bubble) => bubble.id !== centerBubble.id)
                  .map((bubble) => (
                    <div
                      key={`link-${bubble.id}`}
                      className="absolute h-px bg-gradient-to-r from-[#BDD5FF]/15 via-[#C9E4FF]/15 to-transparent"
                      style={getLineStyle(centerBubble, bubble)}
                    />
                  ))
              : null}

            {spacedBubbles.map((bubble, index) => (
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
          {isEntering && selected && selectedMeta ? (
            <motion.div
              className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-[#3E61A0] bg-[#08132B]/78 p-5 backdrop-blur-xl md:left-8 md:right-auto md:w-[460px]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#98B5EB]/90">entree dans la bulle</p>
              <h3 className="mt-1 text-xl font-semibold text-[#EAF2FF]">{selectedMeta.title}</h3>
              <p className="mt-2 text-sm text-[#C6D7F5]">{selectedMeta.description}</p>
              <p className="mt-3 text-xs text-[#C6D7F5]">Ouverture automatique...</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearNavigationTimer();
                    setIsEntering(false);
                  }}
                  className="rounded-full border border-[#6D89C4] px-4 py-2 text-xs font-semibold text-[#EAF2FF] transition hover:bg-[#112753]"
                >
                  Annuler l'ouverture
                </button>
                <button
                  type="button"
                  onClick={() => navigate(resolveBubblePath(selected))}
                  className="rounded-full bg-[#EAF2FF] px-4 py-2 text-xs font-semibold text-[#0A1A3B] transition hover:bg-white"
                >
                  {selectedMeta.actionLabel}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
