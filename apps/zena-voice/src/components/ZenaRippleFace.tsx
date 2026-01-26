import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, MotionValue } from "framer-motion";
import useZenaPointillism from "@/hooks/useZenaPointillism";

type Props = {
  imageUrl?: string;
  size?: number;
  targetUrl?: string;
};

export default function ZenaRippleFace({
  imageUrl = "/zena-face-golden.png",
  size = 420,
  targetUrl = "/zena-chat",
}: Props) {
  const { ref, reveal, tiltX, tiltY, isInteracting } = useZenaPointillism<HTMLDivElement>(Math.max(size * 0.9, 360));

  const mv = useMotionValue(reveal) as MotionValue<number>;
  const dotOpacity = useTransform(mv, [0, 1], [0, 1]) as MotionValue<number>;
  const imageBlur = useTransform(mv, [0, 1], [0, 2.2]) as MotionValue<number>;

  const rotateY = tiltX * 8;
  const rotateX = -tiltY * 6;
  const breathe = isInteracting ? 1.02 : 1.0;

  React.useEffect(() => {
    mv.set(reveal);
  }, [reveal, mv]);

  return (
    <Link to={targetUrl} aria-label="Ouvrir ZÉNA" className="group">
      <motion.div
        ref={ref}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: breathe }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Halo */}
        <div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 1.42,
            height: size * 1.42,
            boxShadow: `0 20px 80px rgba(183,142,68,0.18), 0 6px 30px rgba(183,142,68,0.06)`,
            filter: "blur(18px)",
            background: "radial-gradient(closest-side, rgba(183,142,68,0.12), rgba(183,142,68,0.04) 40%, transparent)",
            transform: `translateY(-6px)`,
          }}
        />

        {/* Bubble */}
        <motion.div
          className="relative rounded-full overflow-hidden shadow-2xl"
          style={{
            width: size,
            height: size,
            background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08))",
            backdropFilter: "blur(6px) saturate(110%)",
            transformStyle: "preserve-3d",
            willChange: "transform, filter",
          }}
          animate={{ rotateY, rotateX }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        >
          {/* subtle rotating reflection */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ mixBlendMode: "soft-light" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          {/* face */}
          <motion.img
            src={imageUrl}
            alt="Visage de Zéna"
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.96) 45%, rgba(0,0,0,0.85) 100%)",
              filter: imageBlur.to((v) => `blur(${v}px)`),
              transform: "translateZ(0)",
            }}
            draggable={false}
          />

          {/* dot overlay */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${size} ${size}`}
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: dotOpacity } as React.CSSProperties}
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#B78E44" fillOpacity="0.18" />
                <circle cx="8" cy="8" r="1" fill="#E9DCC0" fillOpacity="0.12" />
              </pattern>
              <radialGradient id="glass" cx="30%" cy="20%" r="70%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.42" />
                <stop offset="40%" stopColor="#fff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#dots)" />
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#glass)" style={{ mixBlendMode: "overlay" }} />
          </motion.svg>

          {/* simple particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-full h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="block absolute bg-gradient-to-br from-[#F6E9C6] to-[#EAD9B0] rounded-full opacity-60"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    transform: "translate3d(0,0,0)",
                    filter: `blur(${Math.random() * 1.6}px)`,
                    animation: `float-${i} 6s ${Math.random() * 3}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes float-0 { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) }}
          @keyframes float-1 { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) }}
          @keyframes float-2 { 0% { transform: translateY(0) } 50% { transform: translateY(-5px) } 100% { transform: translateY(0) }}
          @keyframes float-3 { 0% { transform: translateY(0) } 50% { transform: translateY(-7px) } 100% { transform: translateY(0) }}
        `}</style>
      </motion.div>
    </Link>
  );
}
