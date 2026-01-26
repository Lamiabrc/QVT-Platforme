import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, TrendingDown, TrendingUp, MapPin } from "lucide-react";
import { useState } from "react";

interface DepartmentData {
  name: string;
  avgScore: number;
  userCount: number;
  trend: "up" | "down" | "stable";
}

interface EmotionalAtlasMapProps {
  departments: DepartmentData[];
}

export function EmotionalAtlasMap({ departments }: EmotionalAtlasMapProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const getColorFromScore = (score: number) => {
    if (score >= 60) return "hsl(142, 76%, 36%)"; // Green
    if (score >= 40) return "hsl(38, 92%, 50%)"; // Orange
    return "hsl(0, 84%, 60%)"; // Red
  };

  const getLabel = (score: number) => {
    if (score >= 60) return "✓ Bon";
    if (score >= 40) return "⚠ Vigilance";
    return "🚨 Alerte";
  };

  // Générer des positions sur une carte en grille flexible
  const generateMapPositions = (count: number) => {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const positions: { x: number; y: number; width: number; height: number }[] = [];
    
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      positions.push({
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight
      });
    }
    
    return positions;
  };

  const positions = generateMapPositions(departments.length);

  // Créer des paths SVG de régions avec formes organiques
  const generateRegionPath = (x: number, y: number, w: number, h: number, seed: number) => {
    // Générer des formes organiques pseudo-aléatoires basées sur seed
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radiusX = w * 0.4;
    const radiusY = h * 0.4;
    
    const points = 8;
    const angle = (Math.PI * 2) / points;
    
    let path = `M `;
    
    for (let i = 0; i <= points; i++) {
      const currentAngle = angle * i;
      const variation = Math.sin((seed + i) * 1.5) * 0.15 + 1;
      const px = cx + Math.cos(currentAngle) * radiusX * variation;
      const py = cy + Math.sin(currentAngle) * radiusY * variation;
      
      if (i === 0) {
        path += `${px} ${py}`;
      } else {
        // Courbes de Bézier pour adoucir
        const prevAngle = angle * (i - 1);
        const cpx = cx + Math.cos(prevAngle + angle / 2) * radiusX * 1.1;
        const cpy = cy + Math.sin(prevAngle + angle / 2) * radiusY * 1.1;
        path += ` Q ${cpx} ${cpy}, ${px} ${py}`;
      }
    }
    
    path += ` Z`;
    return path;
  };

  const selectedDeptData = selectedDept 
    ? departments.find(d => d.name === selectedDept) 
    : hoveredDept 
    ? departments.find(d => d.name === hoveredDept)
    : null;

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Atlas de la Météo Émotionnelle
        </CardTitle>
        <CardDescription>
          Carte géographique du bien-être par département (cliquez pour sélectionner)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Carte SVG */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border/50 overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
              >
                {/* Grille de fond subtile */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="0.1"
                      opacity="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
                
                {/* Régions départementales */}
                {departments.map((dept, i) => {
                  const pos = positions[i];
                  const path = generateRegionPath(pos.x, pos.y, pos.width, pos.height, i);
                  const color = getColorFromScore(dept.avgScore);
                  const isHovered = hoveredDept === dept.name;
                  const isSelected = selectedDept === dept.name;
                  
                  return (
                    <g key={dept.name}>
                      {/* Région */}
                      <motion.path
                        d={path}
                        fill={color}
                        stroke="white"
                        strokeWidth={isSelected ? "0.4" : isHovered ? "0.3" : "0.2"}
                        opacity={isHovered || isSelected ? 0.9 : 0.7}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: isHovered || isSelected ? 0.9 : 0.7,
                          scale: isHovered || isSelected ? 1.05 : 1
                        }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onMouseEnter={() => setHoveredDept(dept.name)}
                        onMouseLeave={() => setHoveredDept(null)}
                        onClick={() => setSelectedDept(selectedDept === dept.name ? null : dept.name)}
                        style={{ 
                          cursor: "pointer",
                          transformOrigin: `${pos.x + pos.width / 2}% ${pos.y + pos.height / 2}%`
                        }}
                      />
                      
                      {/* Label du département */}
                      <text
                        x={pos.x + pos.width / 2}
                        y={pos.y + pos.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize={departments.length > 9 ? "2" : "2.5"}
                        fontWeight="600"
                        pointerEvents="none"
                        style={{ 
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                          userSelect: "none"
                        }}
                      >
                        {dept.name}
                      </text>
                      
                      {/* Score */}
                      <text
                        x={pos.x + pos.width / 2}
                        y={pos.y + pos.height / 2 + 3}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize={departments.length > 9 ? "1.5" : "2"}
                        fontWeight="700"
                        pointerEvents="none"
                        style={{ 
                          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          userSelect: "none"
                        }}
                      >
                        {Math.round(dept.avgScore)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Panneau de détails */}
          <div className="space-y-4">
            {selectedDeptData ? (
              <motion.div
                key={selectedDeptData.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{selectedDeptData.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Users className="w-4 h-4" />
                          <span>{selectedDeptData.userCount} personnes</span>
                        </div>
                      </div>
                      {selectedDeptData.trend !== "stable" && (
                        <div className={selectedDeptData.trend === "up" ? "text-green-500" : "text-red-500"}>
                          {selectedDeptData.trend === "up" ? (
                            <TrendingUp className="w-6 h-6" />
                          ) : (
                            <TrendingDown className="w-6 h-6" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">
                          {Math.round(selectedDeptData.avgScore)}
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: getColorFromScore(selectedDeptData.avgScore) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedDeptData.avgScore}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>

                      <Badge 
                        variant="outline"
                        className="text-sm"
                      >
                        {getLabel(selectedDeptData.avgScore)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-medium">💡 Interprétation :</p>
                  {selectedDeptData.avgScore >= 60 && (
                    <p>L'équipe montre un bon niveau de bien-être. Continuer à maintenir cet environnement positif.</p>
                  )}
                  {selectedDeptData.avgScore >= 40 && selectedDeptData.avgScore < 60 && (
                    <p>Une vigilance est nécessaire. Identifier les sources potentielles de stress et d'insatisfaction.</p>
                  )}
                  {selectedDeptData.avgScore < 40 && (
                    <p className="text-red-600 font-medium">Intervention recommandée. Des actions concrètes sont nécessaires pour améliorer le bien-être.</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                <div className="space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Survolez ou cliquez sur une région<br />pour voir les détails
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Légende :</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(142, 76%, 36%)" }}></div>
              <span>Score ≥ 60 : Bien-être satisfaisant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(38, 92%, 50%)" }}></div>
              <span>Score 40-59 : Vigilance nécessaire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "hsl(0, 84%, 60%)" }}></div>
              <span>Score &lt; 40 : Intervention recommandée</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
