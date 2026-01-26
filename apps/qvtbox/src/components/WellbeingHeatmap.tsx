import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TeamData {
  id: string;
  name: string;
  wellbeingScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  memberCount: number;
  lastUpdate: string;
}

const WellbeingHeatmap = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    if (user) {
      fetchTeamData();
    }
  }, [user, selectedPeriod]);

  const fetchTeamData = async () => {
    setLoading(true);
    // Simuler des données d'équipes pour la démo
    const mockTeams: TeamData[] = [
      {
        id: '1',
        name: 'Équipe Marketing',
        wellbeingScore: 85,
        riskLevel: 'low',
        memberCount: 12,
        lastUpdate: '2024-01-15'
      },
      {
        id: '2', 
        name: 'Équipe Développement',
        wellbeingScore: 65,
        riskLevel: 'medium',
        memberCount: 8,
        lastUpdate: '2024-01-14'
      },
      {
        id: '3',
        name: 'Équipe Support',
        wellbeingScore: 45,
        riskLevel: 'high',
        memberCount: 6,
        lastUpdate: '2024-01-13'
      },
      {
        id: '4',
        name: 'Équipe RH',
        wellbeingScore: 78,
        riskLevel: 'low',
        memberCount: 4,
        lastUpdate: '2024-01-15'
      }
    ];
    
    setTimeout(() => {
      setTeams(mockTeams);
      setLoading(false);
    }, 800);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500/20 text-green-700 border-green-300';
      case 'medium': return 'bg-orange-500/20 text-orange-700 border-orange-300';
      case 'high': return 'bg-red-500/20 text-red-700 border-red-300';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Bien-être optimal';
      case 'medium': return 'Attention requise';
      case 'high': return 'Intervention nécessaire';
      default: return 'Non évalué';
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="font-kalam text-xl">🗺️ Heatmap du Bien-être</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/10 rounded-lg animate-pulse"></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-kalam text-xl">🗺️ Heatmap du Bien-être</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
              className="text-xs"
            >
              Semaine
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
              className="text-xs"
            >
              Mois
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div 
              key={team.id}
              className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/20 hover:from-white/10 hover:to-white/15 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-kalam text-lg text-foreground">{team.name}</h3>
                <Badge className={`text-xs ${getRiskColor(team.riskLevel)}`}>
                  {getRiskLabel(team.riskLevel)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground/70">Score bien-être:</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        team.wellbeingScore >= 70 ? 'bg-green-500' :
                        team.wellbeingScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${team.wellbeingScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{team.wellbeingScore}%</span>
                </div>
                
                <div className="flex justify-between text-xs text-foreground/70">
                  <span>{team.memberCount} membres</span>
                  <span>Maj: {new Date(team.lastUpdate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="font-kalam text-sm text-foreground mb-2">📊 Vue d'ensemble</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-500">{teams.filter(t => t.riskLevel === 'low').length}</div>
              <div className="text-xs text-foreground/70">Équipes sereines</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-500">{teams.filter(t => t.riskLevel === 'medium').length}</div>
              <div className="text-xs text-foreground/70">À surveiller</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-500">{teams.filter(t => t.riskLevel === 'high').length}</div>
              <div className="text-xs text-foreground/70">Action requise</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellbeingHeatmap;