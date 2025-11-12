import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Users, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, familyMembers, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
            <User className="h-6 w-6 text-zena-turquoise" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Mon Profil</h1>
              <p className="text-sm text-muted-foreground">Paramètres et famille</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        {/* Profil utilisateur */}
        <GlowCard>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-zena-turquoise">
                <AvatarFallback className="bg-gradient-to-r from-zena-turquoise to-zena-violet text-white text-xl">
                  {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-background/50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres du profil
              </Button>
            </div>
          </div>
        </GlowCard>

        {/* Ma Famille */}
        <GlowCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-zena-rose" />
                Ma Famille
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/onboarding")}
                className="border-zena-turquoise/30 text-zena-turquoise hover:bg-zena-turquoise/10"
              >
                Gérer
              </Button>
            </div>

            {familyMembers && familyMembers.length > 0 ? (
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                  >
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarFallback className="bg-muted text-sm">
                        {member.display_name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{member.display_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun membre dans votre famille
              </p>
            )}
          </div>
        </GlowCard>

        {/* Paramètres ZÉNA */}
        <GlowCard>
          <div className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ZenaAvatar size="sm" />
              Paramètres ZÉNA
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-background/50"
              >
                Notifications et alertes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-background/50"
              >
                Préférences de partage
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:bg-background/50"
              >
                Confidentialité
              </Button>
            </div>
          </div>
        </GlowCard>

        {/* Déconnexion */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>

        {/* Message ZÉNA */}
        <GlowCard className="bg-gradient-to-r from-zena-turquoise/10 to-zena-violet/10">
          <div className="p-6 flex gap-4 items-start">
            <ZenaAvatar size="md" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                💡 Besoin d'aide ? N'hésite pas à me parler de tes préoccupations.
                Je suis là pour toi et ta famille.
              </p>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
