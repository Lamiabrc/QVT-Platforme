import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FloatingBubbles from "@/components/FloatingBubbles";
import { Loader2 } from "lucide-react";

const LogoutPage = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always redirect to home, even if logout fails
        window.location.assign('/');
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <FloatingBubbles />
      
      <div className="relative z-10 text-center">
        <div className="card-professional p-8 max-w-md mx-auto">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
            Déconnexion...
          </h2>
          <p className="text-foreground/70">
            Vous allez être redirigé vers l'accueil
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;