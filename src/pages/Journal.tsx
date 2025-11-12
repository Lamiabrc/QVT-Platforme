import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { WEATHER_ICONS, WEATHER_LABELS } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Journal() {
  const navigate = useNavigate();
  const { user, loading, isDemoMode, demoJournalEntries, familyMembers } = useAuth();

  useEffect(() => {
    if (!loading && !user && !isDemoMode) {
      navigate("/auth");
    }
  }, [user, loading, isDemoMode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 flex items-center justify-center">
        <div className="animate-pulse">
          <ZenaAvatar size="lg" />
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode) return null;

  // Utiliser les entrées de démo en mode démo
  const journalEntries = isDemoMode ? demoJournalEntries : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-zena-night/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <BookOpen className="h-6 w-6 text-zena-violet" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Journal Partagé</h1>
                <p className="text-sm text-muted-foreground">Souvenirs de famille</p>
              </div>
              {isDemoMode && (
                <Badge variant="secondary" className="ml-2">
                  🎭 Mode Démo
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Message d'accueil */}
        <GlowCard className="bg-gradient-to-r from-zena-violet/10 to-zena-rose/10">
          <div className="p-6 flex gap-4 items-start">
            <ZenaAvatar size="md" />
            <div className="flex-1">
              <p className="text-foreground mb-2">
                📖 Votre journal familial
              </p>
              <p className="text-sm text-muted-foreground">
                Partagez vos moments, vos photos et vos émotions du jour.
                Chaque semaine, ZÉNA créera un résumé poétique de votre famille.
              </p>
            </div>
          </div>
        </GlowCard>

        {/* Entrées du journal */}
        {journalEntries.length > 0 ? (
          <div className="space-y-4">
            {journalEntries.map((entry) => {
              const member = familyMembers.find(m => m.id === entry.member_id);
              return (
                <GlowCard key={entry.id}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{WEATHER_ICONS[entry.weather]}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">
                            {member?.display_name || 'Membre de la famille'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {WEATHER_LABELS[entry.weather]}
                          </Badge>
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-zena-violet opacity-50" />
            <p className="text-muted-foreground mb-4">Aucune entrée pour le moment</p>
            <Button className="bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Créer ma première entrée
            </Button>
          </div>
        )}

        {/* Info météo du jour */}
        <GlowCard>
          <div className="p-6">
            <h3 className="font-semibold mb-3 text-foreground">Comment te sens-tu aujourd'hui ?</h3>
            <div className="grid grid-cols-4 gap-3">
              {['☀️ Soleil', '☁️ Nuages', '🌧️ Pluie', '⛅ Éclaircies'].map((weather) => (
                <button
                  key={weather}
                  className="p-3 bg-background/50 hover:bg-background rounded-lg border border-border hover:border-zena-turquoise transition-colors text-center"
                >
                  <span className="text-2xl block mb-1">{weather.split(' ')[0]}</span>
                  <span className="text-xs text-muted-foreground">{weather.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
