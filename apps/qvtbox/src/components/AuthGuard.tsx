// src/components/AuthGuard.tsx
import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FloatingBubbles from "./FloatingBubbles";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Avoid multiple redirects (React StrictMode / rerenders)
  const redirectedRef = useRef(false);

  const returnUrl = useMemo(() => {
    const current = location.pathname + location.search;
    return encodeURIComponent(current);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) return;

    // ✅ prevent double navigation
    if (redirectedRef.current) return;
    redirectedRef.current = true;

    // ✅ use replace to avoid history loops
    navigate(`/auth/login?returnUrl=${returnUrl}`, { replace: true });
  }, [isAuthenticated, loading, navigate, returnUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <FloatingBubbles />
        <div className="card-professional p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse mx-auto mb-4" />
          <h2 className="text-xl font-kalam text-foreground">
            Vérification de votre connexion...
          </h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // redirection en cours
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
