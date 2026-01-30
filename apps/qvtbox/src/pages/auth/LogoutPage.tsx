import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/FloatingBubbles";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const handleLogout = async () => {
      try {
        // ✅ Déconnexion via le provider (nettoie aussi l'état local + localStorage)
        await signOut();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        if (!cancelled) {
          // ✅ Redirection douce côté SPA
          navigate("/", { replace: true });
        }
      }
    };

    handleLogout();

    return () => {
      cancelled = true;
    };
  }, [navigate, signOut]);

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
