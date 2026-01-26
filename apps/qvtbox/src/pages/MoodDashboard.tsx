import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import FloatingBubbles from "@/components/FloatingBubbles";
import Footer from "@/components/Footer";
import MoodBubbleModule from "@/components/MoodBubbleModule";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import WellbeingHeatmap from "@/components/WellbeingHeatmap";
import RPSAlerts from "@/components/RPSAlerts";
import DUERPExport from "@/components/DUERPExport";

interface Profile {
  user_role: string;
  user_journey: string;
  onboarding_completed: boolean;
}

interface MoodAnalyticsData {
  personalized_message: string;
  recommendations: string[];
  ai_confidence: number;
}

const MoodDashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analytics, setAnalytics] = useState<MoodAnalyticsData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchLatestAnalytics();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('user_role, user_journey, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
  };

  const fetchLatestAnalytics = async () => {
    if (!user) return;

    try {
      // Analytics sera implémenté dans une future version
      // Placeholder pour les fonctionnalités d'analyse avancées
    } catch (error) {
      // Gestion silencieuse des erreurs d'analytics
    }
  };

  const generateAIInsights = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('mood-ai-analysis', {
        body: { userId: user.id }
      });

      if (error) throw error;

      if (data.success) {
        setAnalytics(data.analysis);
        toast({
          title: "🤖 Analyse IA terminée !",
          description: "Découvrez vos insights personnalisés ci-dessous.",
        });
      } else {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer vos insights. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <FloatingBubbles />
        <div className="w-16 h-16 rounded-full bg-gradient-bubble animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <FloatingBubbles />
        <Navigation />
        <div className="relative z-10 pt-24 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-kalam font-bold text-foreground mb-4">
              Accès restreint
            </h1>
            <p className="text-foreground/70">
              Connectez-vous pour accéder à votre tableau de bord émotionnel.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingBubbles />
      <Navigation />
      
      <div className="relative z-10 pt-24 px-6">
        <div className="container mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground">
              Bonjour ! 🫧
            </h1>
            <p className="text-xl text-foreground/70">
              Bienvenue dans votre espace de bien-être personnel
            </p>
            {profile && (
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {profile.user_role}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {profile.user_journey.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>

          {/* Mood Bubble Module */}
          <MoodBubbleModule />

          {/* AI Analytics Section */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-kalam text-xl">
                  🤖 Vos Insights IA Personnalisés
                </CardTitle>
                <Button 
                  onClick={generateAIInsights}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="btn-soft"
                >
                  {isAnalyzing ? '🧠 Analyse en cours...' : '✨ Actualiser l\'analyse'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {analytics ? (
                <div className="space-y-6">
                  {/* Personalized Message */}
                  <div className="bg-gradient-card rounded-2xl p-6">
                    <h3 className="font-kalam text-lg text-primary mb-3">
                      💫 Message personnalisé
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      {analytics.personalized_message}
                    </p>
                    <div className="mt-3 text-xs text-foreground/50">
                      Confiance IA: {Math.round((analytics.ai_confidence || 0) * 100)}%
                    </div>
                  </div>

                  {/* Recommendations */}
                  {analytics.recommendations && analytics.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-kalam text-lg text-secondary mb-4">
                        🌟 Recommandations pour vous
                      </h3>
                      <div className="grid gap-3">
                        {analytics.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-secondary/5 rounded-xl">
                            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-foreground/80 flex-1">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="font-kalam text-xl text-foreground mb-2">
                    Prêt pour votre première analyse IA ?
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    Remplissez quelques bulles d'humeur pour recevoir des insights personnalisés
                  </p>
                  <Button 
                    onClick={generateAIInsights}
                    disabled={isAnalyzing}
                    className="btn-bubble"
                  >
                    {isAnalyzing ? '🧠 Analyse en cours...' : '🚀 Lancer l\'analyse IA'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Features */}
          <WellbeingHeatmap />
          <RPSAlerts />
          <DUERPExport />

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-effect hover:shadow-bubble transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-kalam text-lg mb-2">Historique des humeurs</h3>
                <p className="text-sm text-foreground/70">
                  Visualisez vos tendances émotionnelles
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-bubble transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-kalam text-lg mb-2">Mes Box</h3>
                <p className="text-sm text-foreground/70">
                  Box personnalisées selon vos besoins
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:shadow-bubble transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🛍️</div>
                <h3 className="font-kalam text-lg mb-2">Boutique</h3>
                <p className="text-sm text-foreground/70">
                  Découvrir nos produits bien-être
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MoodDashboard;