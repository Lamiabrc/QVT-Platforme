import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, WheelEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
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

type AmbientBubble = {
  id: string;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  opacity: number;
  image: string;
};

const ZOOM_TO_ENTER_BUBBLE = 2.05;

const bubbleMetaByIdFr: Record<string, BubbleMeta> = {
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
  logo: {
    title: "Bulle Logo QVT Box",
    description: "Acces direct a l'accueil QVT Box.",
    actionLabel: "Aller a l'accueil",
    path: "/home",
  },
};

const bubbleMetaByIdEn: Record<string, BubbleMeta> = {
  accueil: {
    title: "Home Bubble",
    description: "Go back to the QVT Box home gateway.",
    actionLabel: "Go to home",
    path: "/home",
  },
  zena: {
    title: "ZENA Bubble",
    description: "Access the ZENA universe and mentoring pathways.",
    actionLabel: "Open ZENA",
    path: "/zena",
  },
  "mon-univers": {
    title: "My Universe Bubble",
    description: "Your main space with your activity and trusted circles.",
    actionLabel: "Enter my universe",
    path: "/dashboard",
  },
  boutique: {
    title: "Shop Bubble",
    description: "Customize your boxes and explore wellness offers.",
    actionLabel: "Customize my boxes",
    path: "/boutique",
  },
  logo: {
    title: "QVT Box Logo Bubble",
    description: "Direct access to the QVT Box home page.",
    actionLabel: "Go to home",
    path: "/home",
  },
};

const quickLinkDefs = [
  { id: "accueil", path: "/home", color: "from-sky-200/70 to-indigo-200/70" },
  { id: "zena", path: "/zena", color: "from-fuchsia-200/70 to-violet-200/70" },
  { id: "mon-univers", path: "/dashboard", color: "from-cyan-200/70 to-blue-200/70" },
  { id: "boutique", path: "/boutique", color: "from-teal-200/70 to-cyan-200/70" },
] as const;

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

const ambientBubbleImages = [
  "/images/zena-portrait.jpg",
  "/images/box-salarie.jpg",
  "/images/box-ado.jpg",
  "/images/box-senior.jpg",
  "/images/box-parent.jpg",
  "/engagements-dark-halo.jpg",
  "/engagements-hero.jpg",
  "/engagements-data-bubble.jpg",
  "/engagements-social-thread.jpg",
  "/hero-cicatrices-lumiere.jpg",
  "/saas-dashboard.jpg",
  "/famille-still.jpg",
];

const ambientBubbles: AmbientBubble[] = Array.from({ length: 18 }, (_, index) => {
  const x = 4 + ((index * 11) % 92);
  const y = 6 + ((index * 17) % 86);
  const size = 68 + (index % 7) * 18 + ((index % 3) * 6);
  const driftX = -20 + (index % 5) * 10;
  const driftY = -24 + (index % 6) * 9;
  const duration = 10 + (index % 7) * 1.5;
  const delay = (index % 10) * 0.5;
  const opacity = 0.18 + (index % 4) * 0.08;
  const image = ambientBubbleImages[index % ambientBubbleImages.length];

  return {
    id: `ambient-bubble-${index}`,
    x,
    y,
    size,
    driftX,
    driftY,
    duration,
    delay,
    opacity,
    image,
  };
});

export default function BubbleUniverse({ bubbles = defaultBubbles }: Props) {
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const [selected, setSelected] = useState<BubbleData | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, zoom: 1 });
  const [wheelZoom, setWheelZoom] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const bubbleMetaById = isEnglish ? bubbleMetaByIdEn : bubbleMetaByIdFr;
  const quickLinks = useMemo(
    () =>
      quickLinkDefs.map((item) => ({
        ...item,
        label:
          item.id === "accueil"
            ? isEnglish
              ? "Home"
              : "Accueil"
            : item.id === "mon-univers"
              ? isEnglish
                ? "My Universe"
                : "Mon univers"
              : item.id === "boutique"
                ? isEnglish
                  ? "Shop"
                  : "Boutique"
                : "ZENA",
      })),
    [isEnglish],
  );

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
    [selected, bubbleMetaById],
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

  useEffect(() => {
    if (!selected || isEntering || effectiveZoom < ZOOM_TO_ENTER_BUBBLE) return;

    setIsEntering(true);
    clearNavigationTimer();
    navigationTimerRef.current = window.setTimeout(() => {
      navigate(resolveBubblePath(selected));
    }, 420);
  }, [selected, isEntering, effectiveZoom, navigate]);

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
    setIsEntering(false);
    setCamera({ x: translateX, y: translateY, zoom: 1.42 });
    setWheelZoom((currentZoom) => clamp(currentZoom, 1, 2.8));
  };

  const handleWheelZoom = (event: WheelEvent<HTMLDivElement>) => {
    const delta = -event.deltaY;
    setWheelZoom((currentZoom) => clamp(currentZoom * (1 + delta * 0.001), 0.6, 2.8));

    const width = stageSize.width || stageRef.current?.clientWidth || window.innerWidth;
    const height = stageSize.height || stageRef.current?.clientHeight || window.innerHeight;
    const cameraDrift = selected ? 0.2 : 1;
    const xOffset = (event.clientX / width - 0.5) * delta * 0.06 * cameraDrift;
    const yOffset = (event.clientY / height - 0.5) * delta * 0.06 * cameraDrift;

    setCamera((current) => ({
      ...current,
      x: clamp(current.x + xOffset, -220, 220),
      y: clamp(current.y + yOffset, -220, 220),
    }));
  };

  const starfieldParallaxX = camera.x * 0.06;
  const starfieldParallaxY = camera.y * 0.06;
  const starfieldParallaxScale = 1 + (effectiveZoom - 1) * 0.08;

  const stardustParallaxX = camera.x * 0.12;
  const stardustParallaxY = camera.y * 0.12;
  const stardustParallaxScale = 1 + (effectiveZoom - 1) * 0.11;

  const ambientParallaxX = camera.x * -0.05;
  const ambientParallaxY = camera.y * -0.05;
  const ambientParallaxScale = 1 + (effectiveZoom - 1) * 0.03;

  const fireflyParallaxX = camera.x * -0.12;
  const fireflyParallaxY = camera.y * -0.12;
  const fireflyParallaxScale = 1 + (effectiveZoom - 1) * 0.04;

  const stageRotateX = camera.y * -0.008;
  const stageRotateY = camera.x * 0.008;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#01040D]"
      onWheel={handleWheelZoom}
      aria-label="Univers des bulles"
    >
      <div
        className="absolute inset-0 bg-[#020611]"
        style={{
          backgroundImage: "url('/engagements-dark-halo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-80"
        animate={{ x: starfieldParallaxX, y: starfieldParallaxY, scale: starfieldParallaxScale }}
        transition={{ type: "spring", stiffness: 26, damping: 24 }}
        style={{
          backgroundImage: "url('/engagements-dark-halo.jpg')",
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
        animate={{ x: stardustParallaxX, y: stardustParallaxY, scale: stardustParallaxScale }}
        transition={{ type: "spring", stiffness: 30, damping: 22 }}
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 16%, rgba(255,255,255,0.35), transparent), radial-gradient(1.2px 1.2px at 27% 70%, rgba(255,255,255,0.34), transparent), radial-gradient(1.4px 1.4px at 84% 26%, rgba(255,255,255,0.31), transparent), radial-gradient(1.1px 1.1px at 72% 80%, rgba(255,255,255,0.28), transparent), radial-gradient(1.2px 1.2px at 58% 14%, rgba(255,255,255,0.27), transparent), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.24), transparent)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ x: ambientParallaxX, y: ambientParallaxY, scale: ambientParallaxScale }}
        transition={{ type: "spring", stiffness: 24, damping: 24 }}
        aria-hidden="true"
      >
        {ambientBubbles.map((ambient) => (
          <motion.div
            key={ambient.id}
            className="absolute overflow-hidden rounded-full"
            style={{
              left: `${ambient.x}%`,
              top: `${ambient.y}%`,
              width: ambient.size,
              height: ambient.size,
              transform: "translate(-50%, -50%)",
              opacity: ambient.opacity,
              border: "1px solid rgba(255,255,255,0.26)",
              boxShadow:
                "0 14px 34px rgba(2,6,16,0.42), 0 0 30px rgba(186,210,255,0.12), inset 0 8px 20px rgba(255,255,255,0.18), inset 0 -10px 18px rgba(0,0,0,0.22)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            animate={{
              x: [0, ambient.driftX, -ambient.driftX * 0.5, 0],
              y: [0, ambient.driftY, -ambient.driftY * 0.4, 0],
              scale: [0.95, 1.06, 0.98, 1.03],
              opacity: [ambient.opacity * 0.75, ambient.opacity, ambient.opacity * 0.85, ambient.opacity],
            }}
            transition={{
              duration: ambient.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: ambient.delay,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.58), rgba(255,255,255,0.10) 38%, rgba(7,12,24,0.52) 100%), url('${ambient.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 210deg at 52% 50%, transparent 0deg, rgba(255,255,255,0.09) 90deg, transparent 180deg, rgba(255,255,255,0.06) 250deg, transparent 360deg)",
                mixBlendMode: "screen",
              }}
            />
            <div
              className="absolute inset-[8%] rounded-full"
              style={{
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "inset 0 0 16px rgba(255,255,255,0.14)",
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: fireflyParallaxX, y: fireflyParallaxY, scale: fireflyParallaxScale }}
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
              backgroundImage: "url('/luciole.png')",
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
        {isEnglish ? "Scroll: grow bubbles and zoom camera" : "Scroll: agrandir les bulles et zoom camera"}
      </div>

      <div className="pointer-events-none absolute left-1/2 top-6 z-20 w-[min(92vw,640px)] -translate-x-1/2 rounded-2xl border border-[#6585BE]/55 bg-[#081B3B]/62 px-4 py-3 text-center text-[#E8F1FF] backdrop-blur-xl md:top-8 md:px-6">
        <p className="text-sm font-semibold md:text-base">
          {isEnglish ? "Welcome to your Bubble Universe" : "Bienvenue dans votre Univers de Bulles"}
        </p>
        <p className="mt-1 text-[11px] text-[#C5D8FA] md:text-xs">
          {isEnglish
            ? "Solo, teen, senior and family spaces are all around you."
            : "Les espaces solo, ado, senior et famille gravitent autour de vous."}
        </p>
      </div>

      {canZoomOut ? (
        <button
          type="button"
          onClick={resetCamera}
          className="absolute left-4 top-16 z-30 rounded-full border border-[#6D89C4] bg-[#0C1C3D]/80 px-4 py-2 text-xs font-semibold text-[#EAF2FF] backdrop-blur-md transition hover:bg-[#122B5D] md:left-8 md:top-20"
        >
          {isEnglish ? "Back / zoom out" : "Retour / zoom out"}
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
            x: camera.x,
            y: camera.y,
            scale: effectiveZoom,
            rotateX: stageRotateX,
            rotateY: stageRotateY,
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
                zoomFactor={effectiveZoom}
                isCenter={selected ? selected.id === bubble.id : centerBubble?.id === bubble.id}
                onClick={enterBubble}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selected && selectedMeta ? (
            <motion.div
              className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-[#3E61A0] bg-[#08132B]/78 p-5 backdrop-blur-xl md:left-8 md:right-auto md:w-[460px]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#98B5EB]/90">
                {isEnglish ? "entering bubble" : "entree dans la bulle"}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#EAF2FF]">{selectedMeta.title}</h3>
              <p className="mt-2 text-sm text-[#C6D7F5]">{selectedMeta.description}</p>
              <p className="mt-3 text-xs text-[#C6D7F5]">
                {isEntering
                  ? isEnglish
                    ? "Opening automatically..."
                    : "Ouverture automatique..."
                  : isEnglish
                    ? `Keep zooming (${effectiveZoom.toFixed(2)} / ${ZOOM_TO_ENTER_BUBBLE.toFixed(
                        2,
                      )}) to open the page`
                    : `Continue a zoomer (${effectiveZoom.toFixed(2)} / ${ZOOM_TO_ENTER_BUBBLE.toFixed(
                        2,
                      )}) pour ouvrir la page`}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearNavigationTimer();
                    setIsEntering(false);
                  }}
                  className="rounded-full border border-[#6D89C4] px-4 py-2 text-xs font-semibold text-[#EAF2FF] transition hover:bg-[#112753]"
                >
                  {isEnglish ? "Cancel opening" : "Annuler l'ouverture"}
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
