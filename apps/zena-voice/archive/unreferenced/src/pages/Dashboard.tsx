import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageCircle, BookOpen, Award, Shield } from "lucide-react";
import MagicAmbiance from "@/components/MagicAmbiance";

/**
 * 📊 Dashboard QVT Personnel
 * ----------------------------------------------------------
 * Vue d'ensemble de l'état de bien-être de l'utilisateur
 */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRhAccess, setHasRhAccess] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['company_admin', 'manager'])
        .maybeSingle();
      
      setHasRhAccess(!!data);
    };
    
    checkRole();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/5 pb-20 md:pb-6 relative overflow-hidden">
      {/* Ambiance magique */}
      <MagicAmbiance intensity="light" />
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mon tableau de bord</h1>
              <p className="text-sm text-muted-foreground">Votre bien-être en un coup d'œil</p>
            </div>
            <div className="flex gap-2">
              {hasRhAccess && (
                <RouterLink to="/dashboard-rh">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard RH</span>
                  </Button>
                </RouterLink>
              )}
              <RouterLink to="/">
                <Button variant="ghost" size="sm">
                  Retour
                </Button>
              </RouterLink>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Salutation personnalisée */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
          <h2 className="text-3xl font-bold mb-2">Bonjour Marie 👋</h2>
          <p className="text-muted-foreground text-lg">
            Voici votre bien-être aujourd'hui
          </p>
        </section>

        {/* Métriques principales */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Score QVT</CardTitle>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">12/15</div>
                <p className="text-sm text-muted-foreground">
                  +2 points cette semaine 📈
                </p>
                <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                  Bon niveau
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-secondary">8</div>
                <p className="text-sm text-muted-foreground">
                  Échanges avec ZÉNA ce mois-ci
                </p>
                <Badge variant="outline">
                  Durée moyenne : 12 min
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Articles lus</CardTitle>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-accent">5</div>
                <p className="text-sm text-muted-foreground">
                  Temps de lecture total : 27 min
                </p>
                <Badge variant="outline">
                  Catégorie préférée : Stress
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Humeur de la semaine */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Évolution de votre humeur</CardTitle>
              <CardDescription>Les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-4">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => {
                  const heights = [60, 75, 45, 80, 70, 85, 90];
                  return (
                    <div key={day} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${heights[index]}%` }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">Tendance positive</Badge>
                <span>Votre humeur s'améliore progressivement cette semaine 🌸</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Insights ZÉNA */}
        <section>
          <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle>Ce que ZÉNA a remarqué</CardTitle>
              <CardDescription>Insights personnalisés basés sur vos échanges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-medium mb-1">Mots-clés récurrents</p>
                  <p className="text-sm text-muted-foreground">
                    Vous avez mentionné "fatigue" et "surcharge" plusieurs fois cette semaine. 
                    Voulez-vous faire le test burnout ?
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Faire le test →
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <span className="text-2xl">🌙</span>
                <div>
                  <p className="font-medium mb-1">Qualité de sommeil</p>
                  <p className="text-sm text-muted-foreground">
                    D'après vos check-ins, vous dormez moins de 6h par nuit. 
                    Consultez notre article sur le sommeil et la performance.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Lire l'article →
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium mb-1">Progression positive</p>
                  <p className="text-sm text-muted-foreground">
                    Votre score QVT a augmenté de 15% ce mois-ci. Continue comme ça ! 
                    Vous prenez soin de vous et ça se voit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges et achievements */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle>Vos badges</CardTitle>
              </div>
              <CardDescription>Célébrez vos progrès bien-être</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { emoji: "🎙️", title: "Premier échange", unlocked: true },
                  { emoji: "📊", title: "7 jours de check-in", unlocked: true },
                  { emoji: "📚", title: "10 articles lus", unlocked: false },
                  { emoji: "🧪", title: "Tous les tests", unlocked: false },
                ].map((badge, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      badge.unlocked 
                        ? "bg-primary/10 border-primary/20 hover:shadow-lg" 
                        : "bg-muted/30 border-muted opacity-50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <p className="text-xs font-medium">{badge.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
