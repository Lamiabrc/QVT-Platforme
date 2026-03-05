import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import type { BubbleData } from "@/data/bubbles";

interface BubbleProps {
  bubble: BubbleData;
  onClick: (bubble: BubbleData) => void;
  index: number;
  isCenter?: boolean;
}

const Bubble = ({ bubble, onClick, index, isCenter }: BubbleProps) => {
  const delay = index * 0.08;
  const floatDuration = 6 + (index % 4) * 1.25;

  const size = bubble.size;
  const glowSize = isCenter ? size * 1.35 : size * 1.25;

  const handleClick = () => onClick(bubble);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(bubble);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer group select-none"
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
        animate={{ y: [0, -10, 0, 6, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size }}
        className="relative"
      >
        {/* Glow externe (plus naturel, moins “spotlight”) */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-35 group-hover:opacity-55 transition-opacity duration-500"
          style={{
            width: glowSize,
            height: glowSize,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `
              radial-gradient(circle at 40% 35%, rgba(255,255,255,0.28), transparent 55%),
              radial-gradient(circle at 50% 55%, ${bubble.glowColor} 0%, transparent 62%)
            `,
          }}
        />

        {/* Ombre au “sol” */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl opacity-40"
          style={{
            width: size * 0.95,
            height: size * 0.24,
            bottom: -size * 0.32,
            background: "rgba(0,0,0,0.32)",
          }}
        />

        {/* Bulle (verre/gel réaliste) */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: size,
            height: size,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: `
              0 18px 50px rgba(0,0,0,0.18),
              inset 0 14px 26px rgba(255,255,255,0.16),
              inset 0 -18px 34px rgba(0,0,0,0.16)
            `,
            background: `
              radial-gradient(circle at 28% 22%, rgba(255,255,255,0.60), rgba(255,255,255,0.10) 32%, rgba(255,255,255,0.04) 52%, rgba(0,0,0,0.10) 100%),
              radial-gradient(circle at 74% 84%, rgba(120,208,190,0.16), transparent 58%),
              linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,0.10))
            `,
          }}
          whileHover={{ scale: 1.12, rotateX: -6, rotateY: 7 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          {/* Accent couleur issu de bubble.color (dilué pour éviter l’effet “dessin”) */}
          <div
            className={`absolute inset-0 rounded-full opacity-[0.22] ${bubble.color}`}
            style={{
              mixBlendMode: "overlay",
              maskImage: "radial-gradient(circle at 55% 55%, black 40%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 55% 55%, black 40%, transparent 70%)",
            }}
          />

          {/* Rim light / contour lumineux */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.13)",
              maskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
            }}
          />

          {/* Highlight principal (reflet blanc) */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size * 0.56,
              height: size * 0.56,
              top: size * 0.10,
              left: size * 0.12,
              background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)",
              opacity: 0.48,
              filter: "blur(0.3px)",
            }}
          />

          {/* Highlight fin (trait de lumière) */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: size * 0.34,
              height: size * 0.085,
              top: size * 0.24,
              left: size * 0.20,
              transform: "rotate(-18deg)",
              background: "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0))",
              borderRadius: 9999,
              opacity: 0.55,
              filter: "blur(0.35px)",
            }}
          />

          {/* Micro-noise (anti rendu vector/cartoon) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-overlay opacity-[0.10]"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22 opacity=%220.25%22/%3E%3C/svg%3E')",
              backgroundSize: "220px 220px",
            }}
          />

          {/* Contenu */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-2xl md:text-3xl drop-shadow-sm">{bubble.emoji}</span>

            <span className="px-3 text-[10px] md:text-xs font-semibold text-white/95 leading-tight drop-shadow-md">
              {bubble.name}
            </span>

            {!isCenter ? (
              <span className="text-[9px] text-white/70">{bubble.members} membres</span>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Bubble;

