import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Users, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RiskAlert {
  id: string;
  department: string;
  atRiskCount: number;
  avgScore: number;
  trend: "increasing" | "stable" | "decreasing";
}

interface RiskAlertsProps {
  alerts: RiskAlert[];
}

export function RiskAlerts({ alerts }: RiskAlertsProps) {
  const getSuggestions = (department: string, count: number) => {
    return [
      `Organiser un point d'équipe informel avec ${department}`,
      `Proposer une pause collective ou un moment de décompression`,
      `Analyser la charge de travail et redistribuer si nécessaire`,
      `Envisager un entretien individuel avec les managers`,
    ];
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case "increasing": return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "decreasing": return <TrendingDown className="w-4 h-4 text-green-500 rotate-180" />;
      default: return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch(trend) {
      case "increasing": return "En dégradation";
      case "decreasing": return "En amélioration";
      default: return "Stable";
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Aucune alerte préventive</h3>
            <p className="text-sm text-green-700">
              Tous vos départements maintiennent un niveau de bien-être satisfaisant 🎉
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertes Préventives
            </CardTitle>
            <CardDescription>
              Situations nécessitant votre attention cette semaine
            </CardDescription>
          </div>
          <Badge variant="destructive">{alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Alert className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <AlertDescription>
                <div className="space-y-3">
                  {/* En-tête */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">
                          🏢 {alert.department}
                        </h4>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(alert.trend)}
                          <span className="text-xs text-muted-foreground">
                            {getTrendLabel(alert.trend)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-orange-700">
                          <strong>{alert.atRiskCount}</strong> personne(s) en difficulté
                        </span>
                        <span className="text-muted-foreground">
                          Score moyen: <strong>{Math.round(alert.avgScore)}/100</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <p className="text-xs font-medium text-amber-900">
                        Actions suggérées :
                      </p>
                    </div>
                    <ul className="text-xs space-y-1.5 text-muted-foreground">
                      {getSuggestions(alert.department, alert.atRiskCount).slice(0, 2).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-xs"
                    >
                      Voir les tendances
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      className="flex-1 text-xs"
                    >
                      Marquer comme traité
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
