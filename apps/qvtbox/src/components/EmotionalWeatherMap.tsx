import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Flame, Battery, Zap, Sun } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface DepartmentData {
  name: string;
  emotion: string;
  icon: "sun" | "cloud" | "storm" | "flame" | "battery" | "zap";
  position: { x: number; y: number };
}

const EmotionalWeatherMap = () => {
  const { t, language } = useLanguage();

  // Données simulées des départements avec leur météo émotionnelle
  const departments: DepartmentData[] = [
    { name: language === "en" ? "Management" : "Direction", emotion: language === "en" ? "SERENITY" : "SÉRÉNITÉ", icon: "sun", position: { x: 50, y: 30 } },
    { name: "Finance", emotion: language === "en" ? "ANXIETY" : "ANXIÉTÉ", icon: "storm", position: { x: 15, y: 50 } },
    { name: "IT", emotion: "STRESS", icon: "zap", position: { x: 85, y: 50 } },
    { name: "HR", emotion: language === "en" ? "DEPRESSED" : "DÉPRIMÉ", icon: "cloud", position: { x: 30, y: 75 } },
    { name: "Marketing", emotion: language === "en" ? "DEMOTIVATION" : "DÉMOTIVATION", icon: "flame", position: { x: 50, y: 80 } },
    { name: "IT Support", emotion: language === "en" ? "FATIGUE" : "FBITIGUON", icon: "battery", position: { x: 75, y: 85 } },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="w-8 h-8 text-cyan-400" />;
      case "cloud":
        return <Cloud className="w-8 h-8 text-cyan-400" />;
      case "storm":
        return <CloudRain className="w-8 h-8 text-cyan-400" />;
      case "flame":
        return <Flame className="w-8 h-8 text-purple-400" />;
      case "battery":
        return <Battery className="w-8 h-8 text-cyan-400" />;
      case "zap":
        return <Zap className="w-8 h-8 text-cyan-400" />;
      default:
        return <Sun className="w-8 h-8 text-cyan-400" />;
    }
  };

  const emotionColors = {
    sun: "text-cyan-300",
    cloud: "text-cyan-300",
    storm: "text-cyan-300",
    flame: "text-purple-300",
    battery: "text-cyan-300",
    zap: "text-cyan-300",
  };

  return (
    <Card className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1420] border-cyan-500/20 shadow-xl overflow-hidden">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-wide">
          {language === "en" ? "EMOTIONAL WEATHER" : "MÉTÉO ÉMOTIONNELLE"}
        </CardTitle>
        <CardTitle className="text-xl md:text-2xl font-light text-cyan-400/80 tracking-wider">
          {language === "en" ? "OF THE COMPANY" : "DE L'ENTREPRISE"}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-6">
        {/* Carte de France stylisée */}
        <div className="relative w-full aspect-square max-w-lg mx-auto mb-6">
          {/* Fond étoilé */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-300/40 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          {/* Contour de France stylisé */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 0 20px rgba(79, 209, 197, 0.3))" }}
          >
            <path
              d="M 100 20 L 140 40 L 170 60 L 185 100 L 175 140 L 150 165 L 120 180 L 80 175 L 50 160 L 25 130 L 20 90 L 30 60 L 60 35 Z"
              fill="none"
              stroke="rgba(79, 209, 197, 0.6)"
              strokeWidth="2"
              className="animate-pulse"
            />
          </svg>

          {/* Logo central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-bold text-sm tracking-widest">QVT BOX</p>
            </div>
          </div>

          {/* Départements avec leur météo */}
          {departments.map((dept, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${dept.position.x}%`, top: `${dept.position.y}%` }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/40 transition-all duration-300" />
                
                {/* Icon */}
                <div className="relative transform group-hover:scale-125 transition-all duration-300">
                  {getIcon(dept.icon)}
                </div>
                
                {/* Label */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-cyan-400/30">
                    <p className="text-white font-semibold text-xs">{dept.name}</p>
                    <p className={`text-xs ${emotionColors[dept.icon]}`}>{dept.emotion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-cyan-500/20">
            <Cloud className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-xs">{language === "en" ? "FATIGUE" : "FATIGUE"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-purple-500/20">
            <Flame className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-xs">{language === "en" ? "DEMOTIVATION" : "DÉMOTIVATION"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-cyan-500/20">
            <Battery className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-xs">Production</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 backdrop-blur-sm border border-cyan-500/20">
            <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-xs">Stress</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 bg-cyan-400/5">
            {language === "en" ? "EXHAUSTION — EMOTIONAL BALANCE" : "ÉPUISEMENT — ÉQUILIBRE ÉMOTIONNEL"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalWeatherMap;
