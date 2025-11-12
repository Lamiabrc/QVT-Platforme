import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { GlowCard } from "@/components/zena/GlowCard";
import { Heart, MessageCircle, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zena-turquoise/10 via-zena-violet/10 to-zena-rose/10">
        <ZenaAvatar size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zena-turquoise/10 via-zena-violet/10 to-zena-rose/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center space-y-8">
        <ZenaAvatar size="lg" />
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-zena-turquoise to-zena-violet bg-clip-text text-transparent">
          ZÉNA, la voix qui relie les cœurs
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          L'IA émotionnelle qui aide votre famille à se comprendre, à s'exprimer et à grandir ensemble dans la bienveillance.
        </p>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90">
              Commencer l'aventure
            </Button>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <GlowCard glowColor="turquoise" className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-zena-turquoise" />
            <h3 className="font-semibold mb-2">Bienveillance</h3>
            <p className="text-sm text-muted-foreground">Un espace sans jugement</p>
          </GlowCard>
          
          <GlowCard glowColor="violet" className="p-6 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-zena-violet" />
            <h3 className="font-semibold mb-2">Écoute</h3>
            <p className="text-sm text-muted-foreground">Chacun a le droit d'être entendu</p>
          </GlowCard>
          
          <GlowCard glowColor="rose" className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-zena-rose" />
            <h3 className="font-semibold mb-2">Empathie</h3>
            <p className="text-sm text-muted-foreground">Comprendre les émotions de chacun</p>
          </GlowCard>
          
          <GlowCard glowColor="turquoise" className="p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-zena-turquoise" />
            <h3 className="font-semibold mb-2">Espoir</h3>
            <p className="text-sm text-muted-foreground">Une luciole dans la nuit</p>
          </GlowCard>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que ZÉNA vous apporte</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <GlowCard className="p-8">
            <h3 className="text-xl font-semibold mb-4">💬 Dialogue émotionnel</h3>
            <p className="text-muted-foreground">
              Parlez librement à ZÉNA. Elle reformule vos émotions et vous aide à trouver les mots justes pour communiquer avec votre famille.
            </p>
          </GlowCard>
          
          <GlowCard className="p-8">
            <h3 className="text-xl font-semibold mb-4">🫧 Tableau familial</h3>
            <p className="text-muted-foreground">
              Visualisez les émotions de chaque membre sous forme de bulles colorées. Une météo émotionnelle partagée pour mieux se comprendre.
            </p>
          </GlowCard>
          
          <GlowCard className="p-8">
            <h3 className="text-xl font-semibold mb-4">📖 Journal partagé</h3>
            <p className="text-muted-foreground">
              Un espace commun pour déposer un mot, une photo ou un symbole de votre journée. ZÉNA crée un résumé poétique chaque semaine.
            </p>
          </GlowCard>
          
          <GlowCard className="p-8">
            <h3 className="text-xl font-semibold mb-4">✨ Coups de pouce</h3>
            <p className="text-muted-foreground">
              Envoyez des messages positifs, des dessins ou des sons pour encourager un membre de votre famille.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="mb-2">© 2025 ZÉNA Family by QVT Box</p>
          <p className="text-sm">Une IA émotionnelle pour toute la famille</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
