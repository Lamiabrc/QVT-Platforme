import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart } from "lucide-react";
import { EmotionBubble } from "@/components/zena/EmotionBubble";

export default function FamilySpace() {
  const navigate = useNavigate();
  const { user, familyMembers, loading, isDemoMode, demoEmotions } = useAuth();

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

  // Obtenir les 7 derniers jours
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Fonction pour obtenir les émotions d'un membre pour une date donnée
  const getEmotionsForMemberAndDate = (memberId: string, date: Date) => {
    if (!isDemoMode) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return demoEmotions.filter(emotion => {
      const emotionDate = new Date(emotion.created_at).toISOString().split('T')[0];
      return emotion.family_member_id === memberId && emotionDate === dateStr;
    });
  };

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
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg font-semibold text-foreground">Family Space</h1>
                <p className="text-sm text-muted-foreground">Météo émotionnelle familiale</p>
              </div>
              {isDemoMode && (
                <Badge variant="outline" className="text-xs border-zena-violet/30 text-zena-violet bg-zena-violet/10">
                  🎭 Mode Démo
                </Badge>
              )}
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

            {/* Timeline des 7 derniers jours */}
            <div className="overflow-x-auto">
              <div className="flex gap-2 mb-4 min-w-max">
                {last7Days.map((day, index) => (
                  <div key={index} className="flex-1 min-w-[100px] text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

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
                    <div className="overflow-x-auto">
                      <div className="flex gap-2 min-w-max">
                        {last7Days.map((day, dayIndex) => {
                          const emotions = getEmotionsForMemberAndDate(member.id, day);
                          return (
                            <div key={dayIndex} className="flex-1 min-w-[100px] flex flex-col gap-2 items-center justify-center p-2">
                              {emotions.length > 0 ? (
                                emotions.map((emotion) => (
                                  <EmotionBubble 
                                    key={emotion.id}
                                    emotion={emotion.emotion} 
                                    intensity={emotion.intensity}
                                  />
                                ))
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">-</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
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
