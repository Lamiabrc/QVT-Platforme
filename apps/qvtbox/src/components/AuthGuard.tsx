import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FloatingBubbles from "./FloatingBubbles";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with current path as return url
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth/login?returnUrl=${returnUrl}`);
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <FloatingBubbles />
        <div className="card-professional p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse mx-auto mb-4"></div>
          <h2 className="text-xl font-kalam text-foreground">
            Vérification de votre connexion...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Navigation will be handled by useEffect
  }

  return <>{children}</>;
};

export default AuthGuard;