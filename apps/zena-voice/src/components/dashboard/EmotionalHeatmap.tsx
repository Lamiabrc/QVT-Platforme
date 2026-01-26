import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, TrendingDown, TrendingUp } from "lucide-react";

interface DepartmentData {
  name: string;
  avgScore: number;
  userCount: number;
  trend: "up" | "down" | "stable";
}

interface EmotionalHeatmapProps {
  departments: DepartmentData[];
}

export function EmotionalHeatmap({ departments }: EmotionalHeatmapProps) {
  const getColorClass = (score: number) => {
    if (score >= 60) return "bg-green-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getTextColorClass = (score: number) => {
    if (score >= 60) return "text-green-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  const getBackgroundClass = (score: number) => {
    if (score >= 60) return "from-green-50 to-emerald-50 border-green-200";
    if (score >= 40) return "from-orange-50 to-amber-50 border-orange-200";
    return "from-red-50 to-rose-50 border-red-200";
  };

  const getLabel = (score: number) => {
    if (score >= 60) return "✓ Bon";
    if (score >= 40) return "⚠ Vigilance";
    return "🚨 Alerte";
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Carte Émotionnelle par Département
        </CardTitle>
        <CardDescription>
          Vue d'ensemble du bien-être (min. 5 personnes par équipe pour préserver l'anonymat)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${getBackgroundClass(dept.avgScore)} hover:shadow-lg transition-all`}>
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground mb-1">
                        {dept.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{dept.userCount} personnes</span>
                      </div>
                    </div>
                    
                    {dept.trend !== "stable" && (
                      <div className={dept.trend === "up" ? "text-green-500" : "text-red-500"}>
                        {dept.trend === "up" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold ${getTextColorClass(dept.avgScore)}`}>
                        {Math.round(dept.avgScore)}
                      </span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full ${getColorClass(dept.avgScore)} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${dept.avgScore}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>

                    {/* Status badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTextColorClass(dept.avgScore)} border-current`}
                    >
                      {getLabel(dept.avgScore)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Légende */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Légende :</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Score ≥ 60 : Bien-être satisfaisant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Score 40-59 : Vigilance nécessaire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Score &lt; 40 : Intervention recommandée</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
