import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, TrendingUp, Users, Activity, Bell, CheckCircle2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { getAlertLevelColor, getAlertTypeLabel } from "@/utils/alertHelpers";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RiskAlerts } from "@/components/dashboard/RiskAlerts";
import { EmotionalHeatmap } from "@/components/dashboard/EmotionalHeatmap";
import MagicAmbiance from "@/components/MagicAmbiance";

type AlertRecommendation = string[] | string | null;

interface HRAlert {
  id: string;
  alert_level: string;
  alert_type: string;
  anonymous_count: number;
  recommendations: AlertRecommendation;
  acknowledged: boolean;
  created_at: string;
  resolved: boolean;
}

interface AggregatedAnalytics {
  avg_burnout_risk: number;
  avg_motivation_index: number;
  total_users: number;
  at_risk_users: number;
  critical_users: number;
  avg_intensity_work: number;
  avg_emotional_demands: number;
  avg_autonomy: number;
  avg_social_relations: number;
  avg_value_conflicts: number;
  avg_job_insecurity: number;
}

export default function DashboardRH() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<HRAlert[]>([]);
  const [analytics, setAnalytics] = useState<AggregatedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  // Vérification des droits d'accès
  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        toast.error('Vous devez être connecté');
        navigate('/auth');
        return;
      }

      // Vérifier si l'utilisateur a le rôle 'company_admin' ou 'manager'
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['company_admin', 'manager'])
        .maybeSingle();

      if (error || !data) {
        toast.error('Accès réservé aux RH et managers');
        navigate('/dashboard');
        return;
      }

      setHasAccess(true);
    };

    checkAccess();
  }, [user, navigate]);

  // Données mockées pour les nouveaux composants (à remplacer par de vraies données)
  const trendData = [
    { date: "Lun", score: 65 },
    { date: "Mar", score: 58 },
    { date: "Mer", score: 52 },
    { date: "Jeu", score: 48 },
    { date: "Ven", score: 55 },
    { date: "Sam", score: 62 },
    { date: "Dim", score: 60 },
  ];

  const riskAlerts = [
    {
      id: "1",
      department: "Marketing",
      atRiskCount: 3,
      avgScore: 42,
      trend: "decreasing" as const,
    },
    {
      id: "2",
      department: "IT",
      atRiskCount: 2,
      avgScore: 38,
      trend: "stable" as const,
    },
  ];

  const departmentData = [
    { name: "Marketing", avgScore: 42, userCount: 8, trend: "down" as const },
    { name: "IT", avgScore: 38, userCount: 12, trend: "stable" as const },
    { name: "RH", avgScore: 72, userCount: 5, trend: "up" as const },
    { name: "Finance", avgScore: 55, userCount: 7, trend: "stable" as const },
    { name: "Commercial", avgScore: 68, userCount: 15, trend: "up" as const },
    { name: "Logistique", avgScore: 48, userCount: 9, trend: "down" as const },
  ];

  useEffect(() => {
    if (!user || !hasAccess) {
      return;
    }

    fetchDashboardData();
  }, [user, hasAccess]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Récupérer les alertes non résolues
      const { data: alertsData, error: alertsError } = await supabase
        .from('hr_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;
      setAlerts(alertsData || []);

      // Récupérer les analytics agrégées (dernière semaine)
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_aggregated')
        .select('*')
        .eq('aggregation_period', 'weekly')
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (!analyticsError && analyticsData) {
        setAnalytics(analyticsData);
      }

    } catch (error) {
      console.error('[DashboardRH] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('hr_alerts')
      .update({ 
        acknowledged: true, 
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: user?.id 
      })
      .eq('id', alertId);

    if (!error) {
      fetchDashboardData();
    }
  };

  const resolveAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('hr_alerts')
      .update({ 
        resolved: true, 
        resolved_at: new Date().toISOString() 
      })
      .eq('id', alertId);

    if (!error) {
      fetchDashboardData();
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement du dashboard RH...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Ambiance magique douce */}
      <MagicAmbiance intensity="light" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Dashboard RH - Prévention RPS
              </h1>
              <p className="text-muted-foreground">Vue d'ensemble anonymisée du bien-être de vos équipes</p>
            </div>
          </div>
          <Shield className="w-12 h-12 text-primary/20" />
        </div>

        {/* Graphique de tendance */}
        <div className="mb-8">
          <TrendChart data={trendData} />
        </div>

        {/* Alertes préventives */}
        <div className="mb-8">
          <RiskAlerts alerts={riskAlerts} />
        </div>

        {/* Métriques globales */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard 
              title="Utilisateurs Actifs"
              value={analytics.total_users}
              icon={Users}
              description="Cette semaine"
            />
            
            <MetricCard 
              title="Risque Burnout Moyen"
              value={`${Math.round(analytics.avg_burnout_risk)}/100`}
              icon={Activity}
            >
              <Progress value={analytics.avg_burnout_risk} className="mt-2" />
            </MetricCard>
            
            <MetricCard 
              title="Personnes à Risque"
              value={analytics.at_risk_users}
              icon={AlertTriangle}
              description={`${analytics.total_users > 0 ? Math.round((analytics.at_risk_users / analytics.total_users) * 100) : 0}% du total`}
            />
            
            <MetricCard 
              title="Situations Critiques"
              value={analytics.critical_users}
              icon={AlertTriangle}
              description="Nécessitent intervention"
            />
          </div>
        )}

        {/* Alertes actives */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Alertes Actives
                </CardTitle>
                <CardDescription>
                  Situations nécessitant votre attention (données 100% anonymisées)
                </CardDescription>
              </div>
              <Badge variant="outline">{alerts.length} alertes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <p className="font-medium">Aucune alerte active</p>
                <p className="text-sm">Tout semble bien se passer dans vos équipes 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getAlertLevelColor(alert.alert_level)}>
                            {alert.alert_level.toUpperCase()}
                          </Badge>
                          <AlertTitle className="mt-0">
                            {getAlertTypeLabel(alert.alert_type)}
                          </AlertTitle>
                        </div>
                        <AlertDescription>
                          <div className="space-y-2">
                            <p>
                              <strong>{alert.anonymous_count}</strong> personne(s) concernée(s)
                            </p>
                            {alert.recommendations && (
                              <div className="bg-muted/50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Recommandations :</p>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {Array.isArray(alert.recommendations) ? (
                                    alert.recommendations.map((rec: string, index: number) => <li key={index}>{rec}</li>)
                                  ) : (
                                    <li>{alert.recommendations}</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {!alert.acknowledged && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Accuser réception
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Marquer résolu
                        </Button>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Heatmap émotionnelle */}
        <div className="mb-8">
          <EmotionalHeatmap departments={departmentData} />
        </div>

        {/* Analyse des 6 dimensions RPS */}
        {analytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analyse des 6 Dimensions RPS
              </CardTitle>
              <CardDescription>
                Scores moyens de votre organisation (0 = excellent, 100 = risque élevé)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: '⚡ Intensité & Temps de travail', value: analytics.avg_intensity_work },
                  { label: '😰 Exigences émotionnelles', value: analytics.avg_emotional_demands },
                  { label: '🎯 Autonomie', value: analytics.avg_autonomy },
                  { label: '🤝 Rapports sociaux', value: analytics.avg_social_relations },
                  { label: '⚖️ Conflits de valeurs', value: analytics.avg_value_conflicts },
                  { label: '🔐 Insécurité de l\'emploi', value: analytics.avg_job_insecurity },
                ].map((dimension) => (
                  <div key={dimension.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{dimension.label}</span>
                      <span className="text-sm font-bold">
                        {Math.round(dimension.value)}/100
                      </span>
                    </div>
                    <Progress 
                      value={dimension.value}
                      className={
                        dimension.value >= 70 ? 'bg-destructive/20' :
                        dimension.value >= 50 ? 'bg-orange-200' :
                        'bg-green-200'
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
