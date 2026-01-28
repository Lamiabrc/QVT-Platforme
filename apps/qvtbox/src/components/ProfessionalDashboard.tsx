import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Package, 
  TrendingUp, 
  Settings, 
  Users, 
  Building2,
  BarChart3,
  Calendar,
  CheckCircle,
  Package2,
  Star,
  ArrowRight,
  MessageCircle,
  Target,
  Award,
  Briefcase
} from 'lucide-react';
import dashboardHero from '@/assets/dashboard-hero.jpg';
import boxManagement from '@/assets/box-management.jpg';
import ModernMoodBubbleModule from './ModernMoodBubbleModule';

interface DashboardView {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiredRoles: ('admin' | 'user' | 'salarié' | 'responsable_qvt' | 'rh')[];
}

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const { role, isAdmin, isResponsableQVT, isRH, isSalarié, hasAnyRole } = useUserRole();
  const [activeView, setActiveView] = useState<string>('salarié');

  const dashboardViews: DashboardView[] = [
    {
      id: 'salarié',
      name: 'Mon Bien-être',
      description: 'Espace personnel de suivi du bien-être',
      icon: <User className="w-4 h-4" />,
      requiredRoles: ['salarié', 'responsable_qvt', 'rh', 'admin']
    },
    {
      id: 'qvt',
      name: 'Équipe QVT',
      description: 'Suivi et analyse des équipes',
      icon: <Users className="w-4 h-4" />,
      requiredRoles: ['responsable_qvt', 'admin']
    },
    {
      id: 'rh',
      name: 'Ressources Humaines',
      description: 'Gestion administrative et conformité',
      icon: <Building2 className="w-4 h-4" />,
      requiredRoles: ['rh', 'admin']
    },
    {
      id: 'admin',
      name: 'Administration',
      description: 'Configuration système',
      icon: <Settings className="w-4 h-4" />,
      requiredRoles: ['admin']
    }
  ];

  const availableViews = dashboardViews.filter(view => 
    hasAnyRole(view.requiredRoles)
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground mb-6">
              Veuillez vous connecter pour accéder à votre espace professionnel
            </p>
            <Button onClick={() => window.location.href = '/auth'} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-gray-900"
        style={{ backgroundImage: `url(${dashboardHero})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Espace Professionnel QVT
            </h1>
            <p className="text-xl text-white/90">
              Bienvenue {user.email}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {role || 'user'}
              </Badge>
              {availableViews.length > 1 && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                  {availableViews.length} espaces disponibles
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        {/* Navigation des vues multiples */}
        {availableViews.length > 1 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Changer de vue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {availableViews.map((view) => (
                  <Button
                    key={view.id}
                    variant={activeView === view.id ? "default" : "outline"}
                    className="justify-start h-auto p-4 flex-col items-start gap-2"
                    onClick={() => setActiveView(view.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {view.icon}
                      <span className="font-medium">{view.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground text-left">
                      {view.description}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
          {/* Vue Salarié - Dashboard personnel */}
          <TabsContent value="salarié" className="space-y-6">
            {/* Module de suivi du bien-être moderne */}
            <ModernMoodBubbleModule />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats personnelles */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Score Bien-être</p>
                        <p className="text-2xl font-bold text-green-600">8.2/10</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Box Reçues</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Jours de suivi</p>
                        <p className="text-2xl font-bold">47</p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Objectifs</p>
                        <p className="text-2xl font-bold text-orange-600">2/3</p>
                      </div>
                      <Target className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conseil du jour avec bulle */}
              <div className="lg:col-span-2">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 animate-pulse" />
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-40" />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Conseil du jour
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-800 leading-relaxed">
                        Prenez 5 minutes pour pratiquer la respiration profonde. 
                        Cette technique simple peut réduire votre stress de 30% et améliorer 
                        votre concentration pour le reste de la journée.
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline" className="text-xs">
                        Généré par IA - Personnalisé
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Nouveau conseil
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Box Management */}
              <Card className="relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10"
                  style={{ backgroundImage: `url(${boxManagement})` }}
                />
                <div className="relative z-10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package2 className="w-5 h-5" />
                      Mes Box
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Box Novembre</span>
                        <Badge className="bg-green-100 text-green-700">Reçue</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Box Décembre</span>
                        <Badge className="bg-orange-100 text-orange-700">En transit</Badge>
                      </div>
                    </div>
                    <div className="pt-2 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier ma Box
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer réception
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Star className="w-4 h-4 mr-2" />
                        Laisser un avis
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Graphique d'historique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Historique du bien-être (30 derniers jours)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-64 bg-cover bg-center rounded-lg flex items-center justify-center"
                  style={{ backgroundImage: 'url(/saas-dashboard.jpg)' }}
                >
                  <div className="bg-white/90 p-4 rounded-lg">
                    <p className="text-gray-600 text-center">
                      Graphiques interactifs à venir<br />
                      <span className="text-sm">Tendance générale: Positive (+12%)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vue Responsable QVT */}
          <TabsContent value="qvt" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Tableau de bord QVT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analytics anonymisées des équipes, alertes RPS, et outils de gestion QVT.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vue RH */}
          <TabsContent value="rh" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Tableau de bord RH</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Gestion administrative, rapports de conformité, et métriques RH.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vue Admin */}
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Administration système</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Configuration technique et gestion des utilisateurs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
