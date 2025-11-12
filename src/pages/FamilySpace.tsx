import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { EmotionBubble } from "@/components/zena/EmotionBubble";

export default function FamilySpace() {
  const navigate = useNavigate();
  const { user, familyMembers, loading } = useAuth();

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
            <Heart className="h-6 w-6 text-zena-rose" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Family Space</h1>
              <p className="text-sm text-muted-foreground">Météo émotionnelle familiale</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Carte Météo Familiale */}
        <GlowCard>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-zena-rose" />
              Tableau Émotionnel des 7 derniers jours
            </h2>

            {familyMembers && familyMembers.length > 0 ? (
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="bg-background/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-foreground">{member.display_name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {/* Placeholder pour les bulles émotionnelles */}
                      <EmotionBubble emotion="calme" intensity={70} />
                      <EmotionBubble emotion="joie" intensity={85} />
                      <EmotionBubble emotion="motivation" intensity={60} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun membre dans votre famille</p>
                <Button
                  onClick={() => navigate("/onboarding")}
                  className="bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90"
                >
                  Créer ma famille
                </Button>
              </div>
            )}
          </div>
        </GlowCard>

        {/* Message ZÉNA */}
        <GlowCard className="bg-gradient-to-r from-zena-turquoise/10 to-zena-violet/10">
          <div className="p-6 flex gap-4 items-start">
            <ZenaAvatar size="md" />
            <div className="flex-1">
              <p className="text-foreground mb-2">
                💙 Espace de partage familial
              </p>
              <p className="text-sm text-muted-foreground">
                Ici, chaque membre peut visualiser les émotions partagées par la famille.
                C'est un miroir émotionnel bienveillant pour mieux se comprendre.
              </p>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
