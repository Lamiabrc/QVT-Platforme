import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  risk_level: string;
  primary_axis: string;
  status: string;
  user_consent: boolean;
  created_at: string;
  notes?: string;
}

interface RiskScore {
  id: string;
  overall_score: number;
  top_risk_axis: string;
  trend_direction?: string;
  created_at: string;
}

const AlertDashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);

  const axisLabels: Record<string, string> = {
    'charge_rythme': 'Charge de travail',
    'penibilite_ergonomie': 'Pénibilité & Ergonomie',
    'climat_reconnaissance': 'Climat & Reconnaissance',
    'deconnexion_tension': 'Déconnexion',
    'humeur_energie': 'Humeur & Énergie'
  };

  useEffect(() => {
    if (user) {
      fetchAlerts();
      fetchRiskScore();
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }

    setAlerts(data || []);
  };

  const fetchRiskScore = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('risk_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching risk score:', error);
    } else {
      setRiskScore(data);
    }
    setLoading(false);
  };

  const updateAlertConsent = async (alertId: string, consent: boolean) => {
    const { error } = await supabase
      .from('alerts')
      .update({ user_consent: consent })
      .eq('id', alertId);

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }

    toast.success(consent ? "Consentement accordé" : "Consentement retiré");
    fetchAlerts();
  };

  const getScoreColor = (score: number) => {
    if (score <= 39) return "score-green";
    if (score <= 59) return "score-amber";
    return "score-red";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 39) return "Bien";
    if (score <= 59) return "Attention";
    return "Risque";
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Score global */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Score de bien-être
            </CardTitle>
            <CardDescription>
              Votre évaluation globale actuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {riskScore ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className={`score-indicator ${getScoreColor(riskScore.overall_score)} w-16 h-16 text-2xl mb-2`}>
                    {Math.round(riskScore.overall_score)}
                  </div>
                  <p className="text-sm font-medium">{getScoreLabel(riskScore.overall_score)}</p>
                  {riskScore.top_risk_axis && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Axe principal: {axisLabels[riskScore.top_risk_axis] || riskScore.top_risk_axis}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {getTrendIcon(riskScore.trend_direction)}
                  <p className="text-xs text-muted-foreground mt-1">Tendance</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune évaluation récente</p>
            )}
          </CardContent>
        </Card>

        {/* Alertes actives */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes & Suivi</CardTitle>
            <CardDescription>
              Notifications personnalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.risk_level === 'red' ? 'alert-red' : 'alert-amber'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={alert.risk_level === 'red' ? 'destructive' : 'secondary'}>
                        {alert.risk_level === 'red' ? 'Risque élevé' : 'Attention'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">
                      {axisLabels[alert.primary_axis] || alert.primary_axis}
                    </p>
                    {!alert.user_consent ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAlertConsent(alert.id, true)}
                        >
                          Demander de l'aide
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => updateAlertConsent(alert.id, false)}
                        >
                          Non merci
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Suivi en cours</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune alerte active</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ressources recommandées */}
      <Card>
        <CardHeader>
          <CardTitle>Ressources recommandées</CardTitle>
          <CardDescription>
            Basées sur votre profil et vos évaluations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="resource-card">
              <h4 className="font-medium mb-2">Guide ANACT - Gestion de la charge</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Méthodes pour évaluer et réguler la charge de travail
              </p>
              <Badge variant="outline">Guide</Badge>
            </div>
            <div className="resource-card">
              <h4 className="font-medium mb-2">Box QVT Focus & Reset</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Produits pour récupération et gestion du stress
              </p>
              <Badge variant="outline">Produit</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertDashboard;