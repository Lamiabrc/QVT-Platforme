import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, AlertTriangle, TrendingUp, Shield, Calendar } from 'lucide-react';

const InteractiveDemo = () => {
  const [selectedMetric, setSelectedMetric] = useState('wellbeing');

  const metrics = {
    wellbeing: {
      title: 'Indice de Bien-être',
      value: 74,
      status: 'Bon',
      color: 'bg-green-500',
      trend: '+5%',
    },
    stress: {
      title: 'Niveau de Stress',
      value: 32,
      status: 'Modéré',
      color: 'bg-yellow-500',
      trend: '-8%',
    },
    engagement: {
      title: 'Engagement',
      value: 86,
      status: 'Excellent',
      color: 'bg-blue-500',
      trend: '+12%',
    },
    burnout: {
      title: 'Risque Burnout',
      value: 18,
      status: 'Faible',
      color: 'bg-red-500',
      trend: '-15%',
    }
  };

  const alerts = [
    { type: 'warning', message: 'Équipe Marketing : Augmentation du stress détectée', priority: 'Moyenne' },
    { type: 'info', message: 'Nouveau sondage bien-être disponible', priority: 'Faible' },
    { type: 'urgent', message: 'Département IT : Signaux de surcharge de travail', priority: 'Haute' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Démo Interactive</h2>
        <p className="text-lg text-muted-foreground">
          Explorez notre tableau de bord intelligent en temps réel
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Alertes RPS
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users size={16} />
            Vue Équipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(metrics).map(([key, metric]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedMetric === key ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedMetric(key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{metric.value}%</span>
                    <Badge variant={metric.status === 'Excellent' ? 'default' : metric.status === 'Bon' ? 'secondary' : 'outline'}>
                      {metric.status}
                    </Badge>
                  </div>
                  <Progress value={metric.value} className="mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">vs mois dernier</span>
                    <span className="text-green-600 font-medium">{metric.trend}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                Analyse Détaillée - {metrics[selectedMetric].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Tendance 30 jours</h4>
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-end justify-center">
                    <span className="text-xs text-muted-foreground">Graphique interactif</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Répartition par service</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Marketing</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IT</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>RH</span>
                      <span className="font-medium">89%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommandations IA</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Organiser un team building</p>
                    <p>• Réduire les réunions de 15%</p>
                    <p>• Proposer du télétravail</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle 
                    className={`${
                      alert.type === 'urgent' ? 'text-red-500' : 
                      alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} 
                    size={20} 
                  />
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <Badge variant={alert.priority === 'Haute' ? 'destructive' : alert.priority === 'Moyenne' ? 'secondary' : 'outline'}>
                  {alert.priority}
                </Badge>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Marketing', 'IT', 'RH', 'Ventes', 'Finance', 'Opérations'].map((team) => (
              <Card key={team} className="p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{team}</CardTitle>
                  <CardDescription>12 collaborateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Bien-être moyen</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <Progress value={76} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Dernière évaluation</span>
                      <span>Il y a 3 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-12">
        <Button size="lg" className="button-hover">
          <Calendar className="mr-2" size={16} />
          Réserver une démo personnalisée
        </Button>
      </div>
    </div>
  );
};

export default InteractiveDemo;