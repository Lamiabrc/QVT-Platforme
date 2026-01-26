import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain, 
  Zap, 
  Users, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  Sparkles,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimulationData {
  wellbeing: number;
  stress: number;
  productivity: number;
  engagement: number;
  satisfaction: number;
  energy: number;
}

const MobileSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentData, setCurrentData] = useState<SimulationData>({
    wellbeing: 65,
    stress: 45,
    productivity: 70,
    engagement: 60,
    satisfaction: 68,
    energy: 55
  });
  const [simulationWeek, setSimulationWeek] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const { toast } = useToast();

  const startSimulation = () => {
    setIsRunning(true);
    toast({
      title: "Simulation démarrée",
      description: "Votre simulation QVT de 12 semaines a commencé !",
    });
  };

  const pauseSimulation = () => {
    setIsRunning(false);
    toast({
      title: "Simulation en pause",
      description: "La simulation a été mise en pause",
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationWeek(1);
    setCurrentData({
      wellbeing: 65,
      stress: 45,
      productivity: 70,
      engagement: 60,
      satisfaction: 68,
      energy: 55
    });
    setAchievements([]);
    toast({
      title: "Simulation réinitialisée",
      description: "La simulation a été remise à zéro",
    });
  };

  // Simulation automatique
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentData(prev => {
        const newData = { ...prev };
        
        // Amélioration progressive avec variations réalistes
        newData.wellbeing = Math.min(95, prev.wellbeing + Math.random() * 3 - 0.5);
        newData.stress = Math.max(10, prev.stress - Math.random() * 2);
        newData.productivity = Math.min(95, prev.productivity + Math.random() * 2.5 - 0.3);
        newData.engagement = Math.min(95, prev.engagement + Math.random() * 2.2 - 0.2);
        newData.satisfaction = Math.min(95, prev.satisfaction + Math.random() * 2.8 - 0.4);
        newData.energy = Math.min(95, prev.energy + Math.random() * 2.5 - 0.3);

        return newData;
      });

      // Progression des semaines
      setSimulationWeek(prev => {
        const newWeek = prev + 0.1;
        
        // Achievements système
        if (Math.floor(newWeek) !== Math.floor(prev) && Math.floor(newWeek) % 2 === 0) {
          const achievementMessages = [
            "🎯 Objectif bien-être atteint !",
            "🌟 Niveau de satisfaction excellent !",
            "⚡ Productivité optimisée !",
            "💪 Énergie au maximum !",
            "🧘 Stress sous contrôle !"
          ];
          
          const randomAchievement = achievementMessages[Math.floor(Math.random() * achievementMessages.length)];
          setAchievements(prev => [...prev, randomAchievement]);
          
          toast({
            title: "Nouveau succès !",
            description: randomAchievement,
          });
        }

        return Math.min(12, newWeek);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, toast]);

  const getStatusColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number) => {
    if (value >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (value >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Bon</Badge>;
    return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Simulateur QVT - 12 Semaines
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                Semaine {Math.floor(simulationWeek)}/12
              </span>
            </div>
            <Progress value={(simulationWeek / 12) * 100} className="w-32" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-2 mb-6">
            {!isRunning ? (
              <Button onClick={startSimulation} className="bg-green-600 hover:bg-green-700">
                <Target className="w-4 h-4 mr-2" />
                Démarrer la simulation
              </Button>
            ) : (
              <Button onClick={pauseSimulation} variant="secondary">
                Pause
              </Button>
            )}
            <Button onClick={resetSimulation} variant="outline">
              Réinitialiser
            </Button>
          </div>

          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
              <TabsTrigger value="achievements">Succès</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bien-être */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Bien-être</span>
                      </div>
                      {getStatusBadge(currentData.wellbeing)}
                    </div>
                    <div className="space-y-2">
                      <Progress value={currentData.wellbeing} className="h-2" />
                      <span className={`text-2xl font-bold ${getStatusColor(currentData.wellbeing)}`}>
                        {Math.round(currentData.wellbeing)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Stress */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <span className="font-medium">Niveau de stress</span>
                      </div>
                      {getStatusBadge(100 - currentData.stress)}
                    </div>
                    <div className="space-y-2">
                      <Progress value={currentData.stress} className="h-2" />
                      <span className={`text-2xl font-bold ${getStatusColor(100 - currentData.stress)}`}>
                        {Math.round(currentData.stress)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Productivité */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Productivité</span>
                      </div>
                      {getStatusBadge(currentData.productivity)}
                    </div>
                    <div className="space-y-2">
                      <Progress value={currentData.productivity} className="h-2" />
                      <span className={`text-2xl font-bold ${getStatusColor(currentData.productivity)}`}>
                        {Math.round(currentData.productivity)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Engagement</span>
                      </div>
                      {getStatusBadge(currentData.engagement)}
                    </div>
                    <div className="space-y-2">
                      <Progress value={currentData.engagement} className="h-2" />
                      <span className={`text-2xl font-bold ${getStatusColor(currentData.engagement)}`}>
                        {Math.round(currentData.engagement)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Évolution des métriques</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Bien-être global</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">+{Math.round((currentData.wellbeing - 65) * 10) / 10}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Réduction du stress</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">-{Math.round((45 - currentData.stress) * 10) / 10}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Succès débloqués ({achievements.length})
                  </h3>
                  {achievements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Commencez la simulation pour débloquer des succès !</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileSimulator;