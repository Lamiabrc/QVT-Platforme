import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ZenaAvatarProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ZenaAvatar({ size = "md", animated = true }: ZenaAvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-zena-turquoise to-zena-violet relative flex items-center justify-center glow-soft`}
      animate={animated ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 20px hsla(var(--zena-turquoise) / 0.3)",
          "0 0 40px hsla(var(--zena-turquoise) / 0.5)",
          "0 0 20px hsla(var(--zena-turquoise) / 0.3)",
        ]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Sparkles className="text-white" size={iconSizes[size]} />
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  );
}
