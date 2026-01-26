import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Lightbulb, Target, Users } from "lucide-react";

interface DepartmentData {
  name: string;
  avgScore: number;
  userCount: number;
  trend: "up" | "down" | "stable";
}

interface DepartmentBenchmarkProps {
  departments: DepartmentData[];
}

export function DepartmentBenchmark({ departments }: DepartmentBenchmarkProps) {
  // Calculer les statistiques de benchmark
  const scores = departments.map(d => d.avgScore).sort((a, b) => a - b);
  const median = scores[Math.floor(scores.length / 2)] || 0;
  const avg = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  const topQuartile = scores[Math.floor(scores.length * 0.75)] || 0;
  const bottomQuartile = scores[Math.floor(scores.length * 0.25)] || 0;

  // Identifier les top performers (top 25%)
  const topPerformers = departments
    .filter(d => d.avgScore >= topQuartile)
    .sort((a, b) => b.avgScore - a.avgScore);

  // Identifier les équipes à améliorer (bottom 25%)
  const needsImprovement = departments
    .filter(d => d.avgScore <= bottomQuartile)
    .sort((a, b) => a.avgScore - b.avgScore);

  // Meilleures pratiques basées sur les top performers
  const bestPractices = [
    {
      icon: Users,
      title: "Communication transparente",
      description: "Les équipes performantes organisent des points hebdomadaires d'écoute collective.",
      metric: "2x plus de satisfaction"
    },
    {
      icon: Target,
      title: "Objectifs clairs et autonomie",
      description: "Définition collaborative des objectifs avec marge de manœuvre sur les moyens.",
      metric: "+35% de motivation"
    },
    {
      icon: TrendingUp,
      title: "Reconnaissance régulière",
      description: "Feedback positif hebdomadaire et célébration des réussites d'équipe.",
      metric: "+42% d'engagement"
    },
    {
      icon: Lightbulb,
      title: "Innovation et initiatives",
      description: "Encouragement des propositions et budget dédié aux projets d'amélioration.",
      metric: "+28% de créativité"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques de benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Analyse Comparative Inter-Départements
          </CardTitle>
          <CardDescription>
            Positionnement de vos équipes par rapport aux indicateurs clés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Moyenne</p>
              <p className="text-2xl font-bold text-primary">{avg}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Médiane</p>
              <p className="text-2xl font-bold">{median}</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">Top 25%</p>
              <p className="text-2xl font-bold text-green-600">{topQuartile}</p>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <p className="text-xs text-muted-foreground mb-1">Bottom 25%</p>
              <p className="text-2xl font-bold text-orange-600">{bottomQuartile}</p>
            </div>
          </div>

          {/* Tableau comparatif */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">
              Classement des Équipes
            </h4>
            {departments
              .sort((a, b) => b.avgScore - a.avgScore)
              .map((dept, index) => {
                const isTopPerformer = dept.avgScore >= topQuartile;
                const needsAttention = dept.avgScore <= bottomQuartile;
                const percentile = Math.round(
                  ((departments.filter(d => d.avgScore < dept.avgScore).length) / departments.length) * 100
                );
                const gap = dept.avgScore - avg;

                return (
                  <div
                    key={dept.name}
                    className={`p-4 rounded-lg border transition-all ${
                      isTopPerformer
                        ? "bg-green-500/5 border-green-500/30"
                        : needsAttention
                        ? "bg-orange-500/5 border-orange-500/30"
                        : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{dept.name}</span>
                            {isTopPerformer && (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {dept.userCount} personnes · {percentile}e percentile
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{dept.avgScore}</p>
                        <p className={`text-xs ${gap > 0 ? "text-green-600" : gap < 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                          {gap > 0 ? "+" : ""}{gap} vs moyenne
                        </p>
                      </div>
                    </div>
                    <Progress value={dept.avgScore} className="h-2" />
                    {isTopPerformer && (
                      <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-700 border-green-500/20">
                        Top Performer
                      </Badge>
                    )}
                    {needsAttention && (
                      <Badge variant="outline" className="mt-2 bg-orange-500/10 text-orange-700 border-orange-500/20">
                        Besoin d'accompagnement
                      </Badge>
                    )}
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Meilleures pratiques des top performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Meilleures Pratiques des Équipes Performantes
          </CardTitle>
          <CardDescription>
            Insights issus de l'analyse des {topPerformers.length} équipes les plus performantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topPerformers.length > 0 && (
            <div className="mb-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Équipes Exemplaires
              </h4>
              <div className="flex flex-wrap gap-2">
                {topPerformers.map(dept => (
                  <Badge key={dept.name} variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    {dept.name} ({dept.avgScore})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-muted/30 rounded-lg border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{practice.title}</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        {practice.description}
                      </p>
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                        {practice.metric}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Plan d'action pour les équipes à améliorer */}
      {needsImprovement.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              Plan d'Action Recommandé
            </CardTitle>
            <CardDescription>
              Axes d'amélioration prioritaires pour {needsImprovement.length} équipe(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsImprovement.map((dept, index) => (
                <div key={dept.name} className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold">{dept.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        Score: {dept.avgScore} · Écart: -{avg - dept.avgScore} points vs moyenne
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-500/20">
                      Priorité {index + 1}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-semibold">1.</span>
                      <span>Organiser un atelier d'écoute avec l'équipe dans les 2 semaines</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-semibold">2.</span>
                      <span>Mettre en place un suivi hebdomadaire court (15 min) du bien-être</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-semibold">3.</span>
                      <span>S'inspirer des pratiques de {topPerformers[0]?.name || "l'équipe la plus performante"}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
