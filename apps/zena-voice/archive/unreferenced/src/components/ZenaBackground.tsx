import { motion } from "framer-motion";

export default function ZenaBackground() {
  const bubbles = Array.from({ length: 10 });

  return (
    <div className="absolute inset-0 overflow-hidden -z-10 bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3]">
      {/* 🌈 Halo central respirant */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full blur-3xl bg-gradient-to-br from-[#5B4B8A]/20 to-[#4FD1C5]/20"
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 💭 Bulles flottantes */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/30 rounded-full shadow-sm"
          style={{
            width: `${8 + Math.random() * 24}px`,
            height: `${8 + Math.random() * 24}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 20}px`,
          }}
          animate={{
            y: [0, -800],
            opacity: [0.2, 0.6, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
