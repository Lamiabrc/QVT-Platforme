import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingBubbles from '@/components/FloatingBubbles';
import AlertSystem from '@/components/mobile/AlertSystem';
import MobileSimulator from '@/components/mobile/MobileSimulator';
import MobileOnboarding from '@/components/mobile/MobileOnboarding';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  Bell, 
  Play, 
  Settings,
  Sparkles,
  Apple,
  PlayCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mobileAppHero from '@/assets/mobile-app-hero.jpg';

const MobilePage = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { toast } = useToast();

  const handleOnboardingComplete = (data: any) => {
    setOnboardingCompleted(true);
    setShowOnboarding(false);
    toast({
      title: "Configuration terminée !",
      description: "Votre profil mobile QVT Box est maintenant configuré.",
    });
  };

  const handleInstallPWA = () => {
    toast({
      title: "Installation en cours...",
      description: "Suivez les instructions de votre navigateur pour installer l'app",
    });
  };

  const handleiOSDownload = () => {
    toast({
      title: "Bientôt disponible !",
      description: "L'application iOS QVT Box sera bientôt sur l'App Store.",
    });
  };

  const handleAndroidDownload = () => {
    toast({
      title: "Bientôt disponible !",
      description: "L'application Android QVT Box sera bientôt sur Google Play.",
    });
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <FloatingBubbles />
        <div className="relative z-10 w-full">
          <MobileOnboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="App Mobile - QVT Box | Bien-être sur iPhone et Android"
        description="Téléchargez l'application mobile QVT Box. Disponible sur iPhone et Android avec notifications, simulateur et suivi personnalisé."
      />
      <div className="min-h-screen bg-gradient-hero">
        <FloatingBubbles />
        <Navigation />
        
        <main className="pt-24 relative z-10">
          {/* Hero Section Mobile */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                  Application Mobile
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-kalam text-left">
                  QVT Box 
                  <span className="text-gradient"> sur Mobile</span>
                </h1>
                <p className="text-xl text-foreground/80 mb-8 leading-relaxed text-left">
                  Emportez votre bien-être partout avec vous. Application native pour iPhone et Android 
                  avec notifications intelligentes, simulateur avancé et suivi personnalisé.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-start mb-12">
                  <Button onClick={handleiOSDownload} className="bg-black text-white hover:bg-gray-800">
                    <Apple className="w-5 h-5 mr-2" />
                    Télécharger sur App Store
                  </Button>
                  <Button onClick={handleAndroidDownload} className="bg-green-600 text-white hover:bg-green-700">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Obtenir sur Google Play
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={mobileAppHero} 
                  alt="Application mobile QVT Box sur smartphone" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>

            {/* Navigation avec AlertSystem intégré */}
            <div className="flex justify-center mb-8 mt-12">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Notifications en temps réel :</span>
                <AlertSystem />
              </div>
            </div>
          </section>

          {/* Tabs principales */}
          <section className="container mx-auto px-6 py-16">
            <Tabs defaultValue="simulator" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="simulator" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Simulateur</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">Fonctionnalités</span>
                </TabsTrigger>
                <TabsTrigger value="setup" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Configuration</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="simulator" className="mt-8">
                <MobileSimulator />
              </TabsContent>

              <TabsContent value="features" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="card-professional">
                    <CardHeader>
                      <Bell className="w-8 h-8 text-primary mb-2" />
                      <CardTitle>Notifications Intelligentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Recevez des alertes personnalisées basées sur vos habitudes et objectifs de bien-être.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Rappels de pause détente</li>
                        <li>• Alertes niveau de stress</li>
                        <li>• Objectifs atteints</li>
                        <li>• Conseils personnalisés</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-professional">
                    <CardHeader>
                      <Play className="w-8 h-8 text-secondary mb-2" />
                      <CardTitle>Simulateur Avancé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Visualisez l'impact de votre programme QVT sur 12 semaines avec des métriques précises.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Évolution du bien-être</li>
                        <li>• Suivi du stress</li>
                        <li>• Métriques d'engagement</li>
                        <li>• Système de récompenses</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-professional">
                    <CardHeader>
                      <Sparkles className="w-8 h-8 text-accent mb-2" />
                      <CardTitle>Onboarding Personnalisé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Configuration intelligente qui s'adapte à votre profil et vos besoins spécifiques.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Évaluation initiale</li>
                        <li>• Préférences personnelles</li>
                        <li>• Objectifs sur mesure</li>
                        <li>• Profil d'entreprise</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-professional">
                    <CardHeader>
                      <Download className="w-8 h-8 text-primary mb-2" />
                      <CardTitle>Mode Hors Ligne</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Accédez à vos contenus favoris même sans connexion internet.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Exercices de méditation</li>
                        <li>• Guides bien-être</li>
                        <li>• Historique personnel</li>
                        <li>• Synchronisation auto</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-professional">
                    <CardHeader>
                      <Settings className="w-8 h-8 text-secondary mb-2" />
                      <CardTitle>Personnalisation Complète</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Adaptez l'application à vos préférences et habitudes de travail.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Thèmes personnalisés</li>
                        <li>• Horaires adaptatifs</li>
                        <li>• Widgets configurables</li>
                        <li>• Intégrations externes</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-professional">
                    <CardHeader>
                      <Smartphone className="w-8 h-8 text-accent mb-2" />
                      <CardTitle>Performance Native</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Application optimisée pour iOS et Android avec performances native.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li>• Lancement instantané</li>
                        <li>• Faible consommation</li>
                        <li>• Interface fluide</li>
                        <li>• Sécurité avancée</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="setup" className="mt-8">
                <div className="max-w-2xl mx-auto">
                  <Card className="card-professional">
                    <CardHeader className="text-center">
                      <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle>Configuration de votre profil</CardTitle>
                      <p className="text-muted-foreground">
                        {onboardingCompleted 
                          ? "Votre profil est configuré et prêt !" 
                          : "Personnalisez votre expérience QVT Box"}
                      </p>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      {onboardingCompleted ? (
                        <div>
                          <Badge className="bg-green-100 text-green-800 mb-4">
                            Configuration terminée ✓
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-6">
                            Votre profil a été configuré avec succès. Vous pouvez maintenant 
                            profiter pleinement de toutes les fonctionnalités de l'application.
                          </p>
                          <Button 
                            onClick={() => setShowOnboarding(true)}
                            variant="outline"
                          >
                            Reconfigurer le profil
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted-foreground mb-6">
                            Un onboarding personnalisé de 5 étapes pour configurer votre 
                            expérience QVT selon vos besoins et préférences.
                          </p>
                          <Button 
                            onClick={() => setShowOnboarding(true)}
                            className="w-full"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Commencer la configuration
                          </Button>
                        </div>
                      )}

                      <div className="pt-6 border-t border-border">
                        <h3 className="font-medium mb-3">Installation Progressive Web App</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Installez QVT Box comme une application native sur votre appareil.
                        </p>
                        <div className="space-y-3">
                          <div className="text-left space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">1</Badge>
                              <span>Cliquez sur "Partager" dans Safari ou "Menu" dans Chrome</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">2</Badge>
                              <span>Sélectionnez "Ajouter à l'écran d'accueil"</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">3</Badge>
                              <span>Confirmez l'installation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-6 py-16">
            <Card className="card-professional text-center">
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-kalam">
                  Transformez votre bien-être en app mobile
                </h2>
                <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
                  Rejoignez les milliers d'utilisateurs qui améliorent leur qualité de vie 
                  au travail avec QVT Box Mobile.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleInstallPWA} size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Installer l'application
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowOnboarding(true)}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Découvrir l'onboarding
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MobilePage;