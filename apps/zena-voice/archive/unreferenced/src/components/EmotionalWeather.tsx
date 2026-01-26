import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudDrizzle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmotionalWeatherProps {
  score: number;
  mood: "positive" | "negative" | "neutral";
  language?: "fr-FR" | "en-US";
  scoreHistory?: number[]; // 7 derniers jours
}

export function EmotionalWeather({ 
  score, 
  mood, 
  language = "fr-FR",
  scoreHistory = []
}: EmotionalWeatherProps) {
  const isFr = language === "fr-FR";

  // Déterminer l'icône météo selon le score
  const getWeatherIcon = () => {
    if (score > 12) {
      return { Icon: Sun, color: "text-amber-500", label: isFr ? "☀️ Ensoleillé" : "☀️ Sunny" };
    } else if (score > 8) {
      return { Icon: Cloud, color: "text-sky-400", label: isFr ? "⛅ Nuageux" : "⛅ Cloudy" };
    } else if (score > 5) {
      return { Icon: CloudDrizzle, color: "text-slate-500", label: isFr ? "☁️ Gris" : "☁️ Gray" };
    } else {
      return { Icon: CloudRain, color: "text-blue-600", label: isFr ? "🌧️ Pluvieux" : "🌧️ Rainy" };
    }
  };

  const { Icon, color, label } = getWeatherIcon();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card backdrop-blur-sm border-primary/20 shadow-soft">
      {/* Particules dorées pour score élevé */}
      {score > 12 && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </>
      )}

      {/* Gouttes de pluie pour score faible */}
      {score <= 5 && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-3 bg-blue-400/60 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: "-10%",
              }}
              animate={{
                y: [0, 120],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
          
          {/* Arc-en-ciel d'espoir */}
          <motion.div
            className="absolute bottom-0 right-0 w-24 h-24 opacity-60"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Sparkles className="w-full h-full text-secondary" />
          </motion.div>
        </>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {isFr ? "Météo émotionnelle" : "Emotional weather"}
            </p>
            <p className="text-lg font-bold text-foreground">{label}</p>
          </div>
          
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: score > 12 ? [0, 10, -10, 0] : 0,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className={`w-16 h-16 ${color}`} />
          </motion.div>
        </div>

        {/* Score et barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-primary">{score}</span>
            <span className="text-sm text-muted-foreground">/ 15</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(score / 15) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Mini-graphique d'évolution (7 derniers jours) */}
        {scoreHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              {isFr ? "Évolution (7 derniers jours)" : "Trend (last 7 days)"}
            </p>
            <div className="flex items-end justify-between gap-1 h-12">
              {scoreHistory.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary/60 rounded-t-sm min-h-[4px]"
                  style={{ height: `${(s / 15) * 100}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(s / 15) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
