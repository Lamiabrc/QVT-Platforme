import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface RPSAlert {
  id: string;
  type: 'stress' | 'workload' | 'relationships' | 'environment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  affected: string;
  suggestions: string[];
  createdAt: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

const RPSAlerts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<RPSAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAlerts();
      // Simuler une nouvelle alerte toutes les 30 secondes en développement
      const interval = setInterval(fetchAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchAlerts = async () => {
    setLoading(true);
    
    // Simuler des alertes RPS pour la démo
    const mockAlerts: RPSAlert[] = [
      {
        id: '1',
        type: 'stress',
        severity: 'high',
        title: 'Pic de stress détecté',
        description: 'Une augmentation significative du niveau de stress a été observée cette semaine',
        affected: 'Équipe Support (6 personnes)',
        suggestions: [
          'Organiser une réunion d\'équipe pour identifier les causes',
          'Proposer des sessions de relaxation',
          'Réajuster la charge de travail temporairement'
        ],
        createdAt: '2024-01-15T14:30:00Z',
        status: 'new'
      },
      {
        id: '2',
        type: 'workload',
        severity: 'medium',
        title: 'Surcharge de travail',
        description: 'Plusieurs collaborateurs signalent une charge de travail excessive',
        affected: 'Équipe Développement (3 personnes)',
        suggestions: [
          'Revoir la planification des sprints',
          'Envisager un renfort temporaire',
          'Prioriser les tâches essentielles'
        ],
        createdAt: '2024-01-15T10:15:00Z',
        status: 'acknowledged'
      },
      {
        id: '3',
        type: 'relationships',
        severity: 'low',
        title: 'Tensions relationnelles',
        description: 'Quelques signaux de tensions interpersonnelles observés',
        affected: 'Service Marketing (2 personnes)',
        suggestions: [
          'Favoriser le dialogue en équipe',
          'Organiser une activité de cohésion',
          'Proposer une médiation si nécessaire'
        ],
        createdAt: '2024-01-14T16:45:00Z',
        status: 'resolved'
      }
    ];
    
    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case 'medium': return 'bg-orange-500/20 text-orange-700 border-orange-300';
      case 'high': return 'bg-red-500/20 text-red-700 border-red-300';
      case 'critical': return 'bg-purple-500/20 text-purple-700 border-purple-300';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-500/20 text-yellow-700';
      case 'acknowledged': return 'bg-blue-500/20 text-blue-700';
      case 'resolved': return 'bg-green-500/20 text-green-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stress': return '😰';
      case 'workload': return '📊';
      case 'relationships': return '🤝';
      case 'environment': return '🏢';
      default: return '⚠️';
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' as const }
        : alert
    ));
    
    toast({
      title: "Alerte prise en compte",
      description: "L'alerte a été marquée comme prise en compte.",
    });
  };

  const handleResolve = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ));
    
    toast({
      title: "Alerte résolue",
      description: "L'alerte a été marquée comme résolue.",
    });
  };

  if (loading) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="font-kalam text-xl">🚨 Alertes RPS Intelligentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-lg animate-pulse"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const newAlerts = alerts.filter(a => a.status === 'new');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-kalam text-xl">🚨 Alertes RPS Intelligentes</CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-red-500/20 text-red-700">
              {newAlerts.length} nouvelles
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-700">
              {acknowledgedAlerts.length} en cours
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-kalam text-lg text-foreground mb-2">
              Tout va bien !
            </h3>
            <p className="text-foreground/70 text-sm">
              Aucune alerte RPS détectée. Vos équipes semblent épanouies.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className="border-white/20 bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-kalam text-lg text-foreground">{alert.title}</h4>
                        <p className="text-sm text-foreground/70 mt-1">{alert.description}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status === 'new' ? 'Nouveau' :
                           alert.status === 'acknowledged' ? 'Pris en compte' : 'Résolu'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-foreground/80">
                      <strong>Concerné:</strong> {alert.affected}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">💡 Suggestions:</div>
                      <ul className="text-sm text-foreground/70 space-y-1">
                        {alert.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/50">
                        {new Date(alert.createdAt).toLocaleString('fr-FR')}
                      </span>
                      
                      {alert.status === 'new' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-xs"
                          >
                            Prendre en compte
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleResolve(alert.id)}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            Marquer résolu
                          </Button>
                        </div>
                      )}
                      
                      {alert.status === 'acknowledged' && (
                        <Button 
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                          className="text-xs bg-green-600 hover:bg-green-700"
                        >
                          Marquer résolu
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RPSAlerts;