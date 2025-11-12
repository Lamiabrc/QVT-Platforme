import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar, BookOpen, Users } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, currentMember, loading } = useAuth();

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

  const firstName = profile?.full_name?.split(' ')[0] || currentMember?.display_name || 'vous';

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 pb-20 md:pb-8">
      {/* Header */}
      <header className="bg-zena-night/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ZenaAvatar size="sm" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Bonjour {firstName} ✨</h1>
                <p className="text-sm text-muted-foreground">Comment te sens-tu aujourd'hui ?</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-zena-turquoise hover:bg-zena-turquoise/10"
            >
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div onClick={() => navigate("/chat")} className="cursor-pointer hover:scale-105 transition-transform">
            <GlowCard>
              <div className="text-center p-4">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-zena-turquoise" />
                <p className="text-sm font-medium">Parler à ZÉNA</p>
              </div>
            </GlowCard>
          </div>

          <div onClick={() => navigate("/family")} className="cursor-pointer hover:scale-105 transition-transform">
            <GlowCard>
              <div className="text-center p-4">
                <Heart className="h-8 w-8 mx-auto mb-2 text-zena-rose" />
                <p className="text-sm font-medium">Ma Famille</p>
              </div>
            </GlowCard>
          </div>

          <div onClick={() => navigate("/journal")} className="cursor-pointer hover:scale-105 transition-transform">
            <GlowCard>
              <div className="text-center p-4">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-zena-violet" />
                <p className="text-sm font-medium">Journal</p>
              </div>
            </GlowCard>
          </div>

          <div onClick={() => navigate("/calendar")} className="cursor-pointer hover:scale-105 transition-transform">
            <GlowCard>
              <div className="text-center p-4">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-zena-turquoise" />
                <p className="text-sm font-medium">Calendrier</p>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Météo Émotionnelle */}
        <GlowCard>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Météo Émotionnelle</h2>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune émotion partagée aujourd'hui</p>
              <Button
                onClick={() => navigate("/chat")}
                className="mt-4 bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90"
              >
                Partager mon humeur
              </Button>
            </div>
          </div>
        </GlowCard>

        {/* Message ZÉNA */}
        <GlowCard className="bg-gradient-to-r from-zena-turquoise/10 to-zena-violet/10">
          <div className="p-6 flex gap-4 items-start">
            <ZenaAvatar size="md" />
            <div className="flex-1">
              <p className="text-foreground mb-2">
                Bienvenue dans votre espace ZÉNA Family ! 🌟
              </p>
              <p className="text-sm text-muted-foreground">
                Je suis là pour vous accompagner, vous écouter et créer des liens entre tous les membres de votre famille.
                N'hésitez pas à me parler de vos émotions, je suis là pour vous.
              </p>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
