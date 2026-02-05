import { motion } from "framer-motion";
import { EmotionType, EMOTION_COLORS, EMOTION_LABELS } from "@/types/database";

interface EmotionBubbleProps {
  emotion: EmotionType;
  intensity: number;
  note?: string;
  onClick?: () => void;
}

export function EmotionBubble({ emotion, intensity, note, onClick }: EmotionBubbleProps) {
  const size = 40 + intensity * 4; // Size based on intensity (1-15)
  
  return (
    <motion.div
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div
        className="rounded-full flex items-center justify-center font-semibold text-white shadow-lg transition-smooth"
        style={{
          width: size,
          height: size,
          backgroundColor: EMOTION_COLORS[emotion],
          boxShadow: `0 0 20px ${EMOTION_COLORS[emotion]}40`,
        }}
      >
        <span className="text-xs">{intensity}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <p className="font-semibold text-sm">{EMOTION_LABELS[emotion]}</p>
        <p className="text-xs text-muted-foreground">Intensité: {intensity}/15</p>
        {note && <p className="text-xs mt-1 max-w-xs">{note}</p>}
      </div>
    </motion.div>
  );
}
