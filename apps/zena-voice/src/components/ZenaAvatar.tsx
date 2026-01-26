import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ZenaAvatarProps {
  textToSpeak?: string;
  emotion?: "positive" | "neutral" | "negative";
  mouthLevel?: number; // intensité du mouvement de la bouche
  overlay?: boolean; // mode superposition (pour ZenaChat)
  isListening?: boolean;
  isSpeaking?: boolean;
  gender?: "female" | "male" | "nonbinary";
}

/**
 * Avatar animé de ZÉNA
 * - Halo émotionnel respirant
 * - Bouche animée selon mouthLevel
 * - Lucioles symbolisant la veille bienveillante
 * - Mode overlay (superposition sur image/vidéo)
 */
export default function ZenaAvatar({
  textToSpeak = "",
  emotion = "neutral",
  mouthLevel = 0,
  overlay = false,
}: ZenaAvatarProps) {
  const mouthRef = useRef<HTMLDivElement>(null);

  // Couleur du halo selon l'émotion
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  // Animation labiale selon mouthLevel
  useEffect(() => {
    if (!mouthRef.current) return;
    const mouth = mouthRef.current;
    mouth.style.transform = `scaleY(${1 + mouthLevel * 0.3})`;
    mouth.style.opacity = `${0.5 + mouthLevel * 0.5}`;
  }, [mouthLevel]);

  return (
    <div
      className={`relative ${overlay ? "pointer-events-none" : "flex flex-col items-center justify-center w-full mx-auto"} select-none text-center overflow-visible`}
      style={{ maxHeight: overlay ? undefined : "min(56vh, 520px)" }}
    >
      {/* Halo émotionnel */}
      <motion.div
        className={`absolute ${overlay ? "inset-0 mx-auto my-auto w-72 h-72 md:w-96 md:h-96" : "w-72 h-72 md:w-96 md:h-96"} rounded-full blur-3xl bg-gradient-to-br ${auraColor} mix-blend-soft-light`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.75, 0.4],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Lucioles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#4FD1C5] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.5,
          }}
          animate={{
            y: [0, -8, 0],
            x: [0, 2 - Math.random() * 4, 0],
            opacity: [0.2, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Image de Zéna */}
      {!overlay && (
        <motion.div
          className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#5B4B8A] to-[#4FD1C5]"
          animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 10px 30px rgba(91, 75, 138, 0.3)",
              "0 15px 40px rgba(79, 209, 197, 0.5)",
              "0 10px 30px rgba(91, 75, 138, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/zena-face.png" alt="Zéna" className="w-full h-full object-cover opacity-95" />
        </motion.div>
      )}

      {/* Bouche animée */}
      <motion.div
        ref={mouthRef}
        className={`absolute ${overlay ? "bottom-[25%]" : "bottom-[28%]"} left-1/2 -translate-x-1/2 w-[30%] h-[6%] bg-white/80 rounded-full origin-center transition-transform duration-150`}
      />

      {/* Texte sous l’avatar (si non overlay) */}
      {!overlay && (
        <motion.div className="mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-widest">
            ZÉNA
          </h2>
          <p className="text-sm text-[#212121]/80">La voix qui veille sur vos émotions</p>
        </motion.div>
      )}
    </div>
  );
}
