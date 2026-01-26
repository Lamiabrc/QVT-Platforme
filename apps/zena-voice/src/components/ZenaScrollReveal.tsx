// src/components/ZenaScrollReveal.tsx

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  image: string;
}

/**
 * 🎇 ZenaScrollReveal
 * Effet premium façon PI.ai / Epiminds :
 * - zoom au scroll
 * - dézoom progressif
 * - flou / glow doré
 * - effet eau vivant
 * - apparition douce du visage
 */
export default function ZenaScrollReveal({ image }: Props) {
  const ref = useRef(null);

  // ---- Scroll progress ----
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // ---- Effets basés sur le scroll ----
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.25, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.3], ["20px", "0px"]);
  const glow = useTransform(scrollYProgress, [0, 1], [0.2, 0.9]);

  return (
    <div ref={ref} className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px]">

      {/* ✨ Halo doré progressif */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          opacity: glow,
          background:
            "radial-gradient(circle at 40% 10%, rgba(255,231,190,0.9), rgba(199,160,100,0.4), transparent 70%)",
        }}
      />

      {/* 🌊 Effet eau interne */}
      <motion.div
        className="absolute inset-0 rounded-full mix-blend-soft-light"
        animate={{
          opacity: [0.3, 0.5, 0.35],
          scale: [1, 1.05, 1],
          x: [0, 4, -3, 0],
          y: [0, -4, 3, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at 75% 85%, rgba(200,160,255,0.4), transparent 60%)",
        }}
      />

      {/* 🟡 Contour lumineux */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/30 shadow-xl"
        style={{
          scale,
          opacity,
          backdropFilter: blur,
        }}
      />

      {/* 🌬 Visage avec effet scroll */}
      <motion.img
        src={image}
        alt="Zena Reveal"
        className="absolute inset-0 w-full h-full object-cover rounded-full"
        style={{
          scale,
          opacity,
          filter: blur,
        }}
      />

    </div>
  );
}
