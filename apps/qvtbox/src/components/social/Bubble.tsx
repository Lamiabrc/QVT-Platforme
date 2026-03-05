import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import type { BubbleData } from "@/data/bubbles";

interface BubbleProps {
  bubble: BubbleData;
  onClick: (bubble: BubbleData) => void;
  index: number;
  isCenter?: boolean;
}

const imageByBubbleId: Record<string, string> = {
  accueil: "/images/hero-boxes.jpg",
  zena: "/images/zena-portrait.jpg",
  "mon-univers": "/engagements-social-thread.jpg",
  boutique: "/images/boutique/repose-pieds.jpg",
};

const Bubble = ({ bubble, onClick, index, isCenter }: BubbleProps) => {
  const delay = index * 0.08;
  const floatDuration = 6 + (index % 4) * 1.25;
  const size = bubble.size;
  const glowSize = isCenter ? size * 1.38 : size * 1.28;
  const bubbleImage = imageByBubbleId[bubble.id];

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
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: `
              0 20px 56px rgba(0,0,0,0.28),
              inset 0 12px 24px rgba(255,255,255,0.22),
              inset 0 -16px 32px rgba(0,0,0,0.22)
            `,
            background:
              "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.72), rgba(255,255,255,0.15) 36%, rgba(255,255,255,0.05) 54%, rgba(0,0,0,0.20) 100%)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          whileHover={{ scale: 1.1, rotateX: -5, rotateY: 7 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          {bubbleImage ? (
            <div className="absolute inset-[7%] overflow-hidden rounded-full">
              <img
                src={bubbleImage}
                alt=""
                aria-hidden="true"
                className="h-full w-full scale-110 object-cover opacity-72 saturate-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/45" />
            </div>
          ) : null}

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
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.14)",
              maskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 70%, transparent 77%)",
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
              opacity: 0.46,
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
              opacity: 0.56,
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
