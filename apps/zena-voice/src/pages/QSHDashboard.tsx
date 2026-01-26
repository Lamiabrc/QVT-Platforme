import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Shield, Users, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { EmotionalAtlasMap } from "@/components/dashboard/EmotionalAtlasMap";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { DepartmentBenchmark } from "@/components/dashboard/DepartmentBenchmark";
import MagicAmbiance from "@/components/MagicAmbiance";

const DEMO_DEPARTMENTS = [
  { name: "Marketing", avgScore: 42, userCount: 8, trend: "down" as const },
  { name: "IT", avgScore: 38, userCount: 12, trend: "stable" as const },
  { name: "RH", avgScore: 72, userCount: 5, trend: "up" as const },
  { name: "Finance", avgScore: 55, userCount: 7, trend: "stable" as const },
  { name: "Commercial", avgScore: 68, userCount: 15, trend: "up" as const },
  { name: "Logistique", avgScore: 48, userCount: 9, trend: "down" as const },
];

const DEMO_TREND = [
  { date: "Lun", score: 65 },
  { date: "Mar", score: 58 },
  { date: "Mer", score: 52 },
  { date: "Jeu", score: 48 },
  { date: "Ven", score: 55 },
  { date: "Sam", score: 62 },
  { date: "Dim", score: 60 },
];

type DepartmentTrend = typeof DEMO_DEPARTMENTS[number];

export default function QSHDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [departments, setDepartments] = useState<DepartmentTrend[]>(DEMO_DEPARTMENTS);
  const [trendData, setTrendData] = useState(DEMO_TREND);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!user);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadRealData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: employee } = await supabase
        .from("employees")
        .select("company_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!employee?.company_id) {
        setLoading(false);
        return;
      }

      const companyId = employee.company_id;

      const { data: depts } = await supabase
        .from("departments")
        .select("id, name")
        .eq("company_id", companyId);

      if (!depts || depts.length === 0) {
        setLoading(false);
        return;
      }

      const { data: latestAnalytics } = await supabase
        .from("analytics_aggregated")
        .select("*")
        .eq("company_id", companyId)
        .eq("aggregation_period", "daily")
        .order("period_start", { ascending: false })
        .limit(14);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentRPS } = await supabase
        .from("rps_tracking")
        .select("timestamp, motivation_index")
        .gte("timestamp", sevenDaysAgo.toISOString())
        .order("timestamp", { ascending: true });

      if (recentRPS && recentRPS.length > 0) {
        const trendByDay = new Map<string, { sum: number; count: number }>();

        recentRPS.forEach((rps) => {
          const dayKey = rps.timestamp.split("T")[0];
          if (!trendByDay.has(dayKey)) trendByDay.set(dayKey, { sum: 0, count: 0 });
          const bucket = trendByDay.get(dayKey)!;
          bucket.sum += rps.motivation_index ?? 50;
          bucket.count += 1;
        });

        const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        const trend = Array.from(trendByDay.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .slice(-7)
          .map(([dateStr, stats]) => {
            const date = new Date(dateStr);
            return {
              date: days[date.getDay()],
              score: Math.round(stats.sum / stats.count),
            };
          });

        if (trend.length > 0) setTrendData(trend);
      }

      const deptStats = new Map<
        string,
        { name: string; scores: number[]; userCount: number; recentScores: number[] }
      >();

      depts.forEach((dept) => {
        deptStats.set(dept.id, { name: dept.name, scores: [], userCount: 0, recentScores: [] });
      });

      latestAnalytics?.forEach((analytics, index) => {
        if (!analytics.department_id) return;
        const stats = deptStats.get(analytics.department_id);
        if (!stats) return;

        const motivationScore = analytics.avg_motivation_index ?? 50;
        const burnoutScore = 100 - (analytics.avg_burnout_risk ?? 50);
        const avgScore = (motivationScore + burnoutScore) / 2;
        stats.scores.push(avgScore);

        if (index < 7) {
          stats.recentScores.push(avgScore);
        }

        if (analytics.total_users) {
          stats.userCount = Math.max(stats.userCount, analytics.total_users);
        }
      });

      const formattedDepartments = Array.from(deptStats.values())
        .filter((stats) => stats.scores.length > 0 && stats.userCount >= 5)
        .map((stats) => {
          const avgScore = Math.round(stats.scores.reduce((sum, s) => sum + s, 0) / stats.scores.length);
          let trend: DepartmentTrend["trend"] = "stable";

          if (stats.recentScores.length >= 2) {
            const diff = stats.recentScores[0] - stats.recentScores[stats.recentScores.length - 1];
            if (diff > 5) trend = "up";
            else if (diff < -5) trend = "down";
          }

          return {
            name: stats.name,
            avgScore,
            userCount: stats.userCount,
            trend,
          };
        })
        .sort((a, b) => a.avgScore - b.avgScore);

      if (formattedDepartments.length > 0) {
        setDepartments(formattedDepartments);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("[QSH] Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setIsDemo(!user);

    if (user) {
      loadRealData();
      const interval = setInterval(() => {
        loadRealData();
      }, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }

    setLoading(false);
  }, [user, loadRealData]);

  const globalAverage = Math.round(departments.reduce((sum, d) => sum + d.avgScore, 0) / departments.length);
  const atRiskCount = departments.filter((d) => d.avgScore < 50).length;
  const criticalCount = departments.filter((d) => d.avgScore < 40).length;

  if (loading && user && !lastUpdate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de la météo émotionnelle...</p>
          <p className="text-sm text-muted-foreground mt-2">Analyse en cours des données de votre organisation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden pb-20 md:pb-6">
      <MagicAmbiance intensity="light" />

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                QSH - Météo émotionnelle
              </h1>
              <p className="text-muted-foreground">
                {isDemo ? "Mode démonstration - Données illustratives" : "Données anonymisées de votre organisation"}
              </p>
              {lastUpdate && !isDemo && (
                <p className="text-xs text-muted-foreground mt-1">Dernière mise à jour : {lastUpdate.toLocaleTimeString("fr-FR")}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isDemo && (
              <Button variant="outline" size="sm" onClick={loadRealData} disabled={loading}>
                {loading ? <Activity className="w-4 h-4 animate-spin" /> : "Actualiser"}
              </Button>
            )}
            {isDemo && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                Mode Démo
              </Badge>
            )}
            <Shield className="w-12 h-12 text-primary/20" />
          </div>
        </div>

        {isDemo && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Découvrez le QSH de votre entreprise</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connectez-vous pour accéder à la météo émotionnelle réelle de vos équipes, avec des données 100% anonymisées et conformes RGPD.
                  </p>
                  <Button onClick={() => navigate("/auth")} size="sm">
                    Se connecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Score moyen global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{globalAverage}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress value={globalAverage} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Équipes suivies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{departments.length}</span>
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {departments.reduce((sum, d) => sum + d.userCount, 0)} personnes
              </p>
            </CardContent>
          </Card>

          <Card className={atRiskCount > 0 ? "border-orange-500/30 bg-orange-500/5" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Équipes en vigilance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">{atRiskCount}</span>
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Score entre 40 et 60</p>
            </CardContent>
          </Card>

          <Card className={criticalCount > 0 ? "border-red-500/30 bg-red-500/5" : ""}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Équipes en alerte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-600">{criticalCount}</span>
                  <Activity className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Score &lt; 40 - Action requise</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <TrendChart data={trendData} title="Évolution du bien-être global" description="Moyenne glissante sur 7 jours" />
        </div>

        <div className="mb-8">
          <EmotionalAtlasMap departments={departments} />
        </div>

        <div className="mb-8">
          <DepartmentBenchmark departments={departments} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Insights & Recommandations
            </CardTitle>
            <CardDescription>Analyse automatique des signaux faibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments
                .filter((d) => d.avgScore < 60)
                .sort((a, b) => a.avgScore - b.avgScore)
                .slice(0, 3)
                .map((dept) => (
                  <div key={dept.name} className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{dept.name}</h4>
                        <Badge variant={dept.avgScore < 40 ? "destructive" : "outline"} className="mt-1">
                          Score: {dept.avgScore}/100
                        </Badge>
                      </div>
                      {dept.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dept.avgScore < 40
                        ? "Situation critique détectée. Recommandation : organiser un point d’écoute collectif dans les 48h."
                        : "Vigilance recommandée. Prévoir un point mensuel de suivi du bien-être."}
                    </p>
                  </div>
                ))}

              {departments.every((d) => d.avgScore >= 60) && (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="font-medium text-green-700">Toutes vos équipes sont dans le vert !</p>
                  <p className="text-sm text-muted-foreground mt-2">Continuez à entretenir ce climat positif.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-sm">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium mb-2">Confidentialité & Anonymat garantis</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Aucune donnée individuelle n'est accessible</li>
                  <li>Aggrégation minimale de 5 personnes par département</li>
                  <li>Conformité RGPD et respect du secret médical</li>
                  <li>Données chiffrées et stockées en Europe</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
