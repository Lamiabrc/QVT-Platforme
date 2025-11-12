import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

export default function Calendar() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 flex items-center justify-center">
        <div className="animate-pulse">
          <ZenaAvatar size="lg" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-zena-night/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CalendarIcon className="h-6 w-6 text-zena-turquoise" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Calendrier</h1>
              <p className="text-sm text-muted-foreground">Événements et anniversaires</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Message d'accueil */}
        <GlowCard className="bg-gradient-to-r from-zena-turquoise/10 to-zena-violet/10">
          <div className="p-6 flex gap-4 items-start">
            <ZenaAvatar size="md" />
            <div className="flex-1">
              <p className="text-foreground mb-2">
                📅 Ton calendrier familial
              </p>
              <p className="text-sm text-muted-foreground">
                Garde un œil sur les événements importants de ta famille : anniversaires, 
                rendez-vous, moments spéciaux...
              </p>
            </div>
          </div>
        </GlowCard>

        {/* Placeholder calendrier */}
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-zena-turquoise opacity-50" />
          <p className="text-muted-foreground mb-4">Calendrier à venir</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Bientôt, tu pourras synchroniser tes événements familiaux et recevoir 
            des rappels bienveillants de ZÉNA.
          </p>
        </div>
      </div>
    </div>
  );
}
