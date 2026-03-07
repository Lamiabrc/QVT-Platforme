import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import type { BubbleData } from "@/data/bubbles";

interface BubbleProps {
  bubble: BubbleData;
  onClick: (bubble: BubbleData) => void;
  index: number;
  isCenter?: boolean;
  zoomFactor?: number;
}

const imageByBubbleId: Record<string, string> = {
  accueil: "/engagements-hero.jpg",
  zena: "/zena-still.jpg",
  "mon-univers": "/engagements-data-bubble.jpg",
  boutique: "/hero-cicatrices-lumiere.jpg",
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const Bubble = ({ bubble, onClick, index, isCenter, zoomFactor = 1 }: BubbleProps) => {
  const delay = index * 0.08;
  const floatDuration = 6 + (index % 4) * 1.25;
  const baseSize = clamp(bubble.size, 220, 300);
  const baseRenderedSize = isCenter ? Math.max(360, baseSize + 96) : baseSize;
  const scrollGrowth = clamp(1 + (zoomFactor - 1) * 0.18, 1, 1.26);
  const size = baseRenderedSize * scrollGrowth;
  const glowSize = isCenter ? size * 1.38 : size * 1.28;
  const bubbleImage = imageByBubbleId[bubble.id];
  const bubbleSurface = bubbleImage
    ? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.62), rgba(255,255,255,0.11) 40%, rgba(8,14,30,0.56) 100%), url('${bubbleImage}')`
    : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.65), rgba(255,255,255,0.14) 42%, rgba(9,16,34,0.62) 100%)";

  const handleClick = () => onClick(bubble);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(bubble);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.55, type: "spring", stiffness: 140, damping: 14 }}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir la bulle ${bubble.name}`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0, 5, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-opacity duration-500"
          style={{
            width: glowSize,
            height: glowSize,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `
              radial-gradient(circle at 40% 35%, rgba(255,255,255,0.30), transparent 55%),
              radial-gradient(circle at 50% 55%, ${bubble.glowColor} 0%, transparent 62%)
            `,
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl opacity-35"
          style={{
            width: size * 0.92,
            height: size * 0.2,
            bottom: -size * 0.3,
            background: "rgba(0,0,0,0.28)",
          }}
        />

        <motion.div
          className="relative overflow-hidden rounded-full"
          style={{
            width: size,
            height: size,
            border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: `
                0 30px 80px rgba(0,0,0,0.35),
                0 18px 42px rgba(5,10,24,0.24),
                0 0 64px rgba(210,229,255,0.15),
                inset 0 18px 30px rgba(255,255,255,0.25),
                inset 0 -22px 36px rgba(0,0,0,0.26)
              `,
            backgroundImage: bubbleSurface,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          whileHover={{ scale: 1.1, rotateX: -5, rotateY: 7 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          <div
            className={`absolute inset-0 rounded-full opacity-[0.20] ${bubble.color}`}
            style={{
              mixBlendMode: "overlay",
              maskImage: "radial-gradient(circle at 55% 55%, black 40%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 55% 55%, black 40%, transparent 70%)",
            }}
          />

          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.22)",
              maskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
            }}
          />

          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "conic-gradient(from 240deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.10) 80deg, transparent 170deg, rgba(255,255,255,0.07) 238deg, transparent 360deg)",
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size * 0.56,
              height: size * 0.56,
              top: size * 0.09,
              left: size * 0.1,
              background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)",
              opacity: 0.56,
              filter: "blur(0.3px)",
            }}
          />

          <div
            className="absolute pointer-events-none"
            style={{
              width: size * 0.34,
              height: size * 0.085,
              top: size * 0.23,
              left: size * 0.2,
              transform: "rotate(-18deg)",
              background: "linear-gradient(90deg, rgba(255,255,255,0.90), rgba(255,255,255,0))",
              borderRadius: 9999,
              opacity: 0.62,
            }}
          />

          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-[0.09]"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22 opacity=%220.25%22/%3E%3C/svg%3E')",
              backgroundSize: "220px 220px",
            }}
          />

          <div
            className="absolute inset-[6.5%] rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow:
                "inset 0 0 24px rgba(255,255,255,0.16), inset 0 -12px 24px rgba(4,8,18,0.35), 0 0 26px rgba(176,204,246,0.18)",
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center">
            <span className="text-2xl md:text-3xl drop-shadow-sm">{bubble.emoji}</span>
            <span className="rounded-full bg-black/24 px-2.5 py-1 text-[10px] font-semibold leading-tight text-white/95 backdrop-blur-sm md:text-xs">
              {bubble.name}
            </span>
            {!isCenter ? (
              <span className="text-[9px] text-white/80 drop-shadow-sm">{bubble.members} membres</span>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Bubble;
