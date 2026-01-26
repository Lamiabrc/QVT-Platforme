import { motion } from "framer-motion";

interface MagicAmbianceProps {
  intensity?: "light" | "medium" | "heavy";
}

/**
 * 🪄 Ambiance magique et poétique
 * Bulles flottantes, particules scintillantes, lucioles douces
 */
export default function MagicAmbiance({ intensity = "medium" }: MagicAmbianceProps) {
  const particleCount = intensity === "light" ? 12 : intensity === "medium" ? 20 : 30;
  const bubbleCount = intensity === "light" ? 5 : intensity === "medium" ? 8 : 12;

  return (
    <>
      {/* 🫧 Bulles flottantes douces */}
      {Array.from({ length: bubbleCount }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-gradient-to-br from-[#4FD1C5]/20 via-[#5B4B8A]/10 to-transparent backdrop-blur-sm border border-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            opacity: 0.4 + Math.random() * 0.3,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50, 0],
            x: [0, 10 - Math.random() * 20, 0],
            scale: [1, 1.1 + Math.random() * 0.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ✨ Particules scintillantes (glitter) */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={`glitter-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full shadow-luciole"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: Math.random() > 0.5 
              ? "linear-gradient(135deg, hsl(178, 62%, 68%), hsl(178, 62%, 80%))"
              : "linear-gradient(135deg, hsl(255, 40%, 65%), hsl(255, 50%, 75%))",
            boxShadow: "0 0 10px currentColor",
          }}
          animate={{
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1.2, 0.9, 1.3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🦋 Lucioles magiques */}
      {Array.from({ length: Math.floor(particleCount / 2) }).map((_, i) => (
        <motion.div
          key={`firefly-${i}`}
          className="absolute w-2 h-2 bg-[#4FD1C5] rounded-full shadow-luciole"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5 + Math.random() * 0.3,
            filter: "blur(1px)",
          }}
          animate={{
            y: [0, -15 - Math.random() * 20, 0],
            x: [0, 5 - Math.random() * 10, 0],
            opacity: [0.3, 0.9, 0.4, 0.8, 0.3],
            scale: [1, 1.3, 1.1, 1.4, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🌟 Étoiles filantes occasionnelles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute h-0.5 w-8 bg-gradient-to-r from-transparent via-[#4FD1C5] to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            opacity: 0,
          }}
          animate={{
            x: [-100, 200],
            y: [0, 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 5 + Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}
