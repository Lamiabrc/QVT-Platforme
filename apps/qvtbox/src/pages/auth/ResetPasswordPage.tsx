import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FloatingBubbles from "@/components/FloatingBubbles";
import Footer from "@/components/Footer";
import ResetRequestForm from "@/components/auth/ResetRequestForm";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useAuth } from "@/hooks/useAuth";

const ResetPasswordPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'request' | 'reset'>('request');

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profil");
      return;
    }

    // Check if we have auth parameters for password reset
    const url = new URL(window.location.href);
    const hasToken = url.hash.includes('access_token') || 
                     (url.searchParams.get('code') && url.searchParams.get('type') === 'recovery');
    
    setMode(hasToken ? 'reset' : 'request');
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <FloatingBubbles />
        <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <FloatingBubbles />
      <Navigation />
      
      <div className="relative z-10 pt-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
              {mode === 'request' ? (
                <>Réinitialisation <span className="text-primary">Mot de passe</span></>
              ) : (
                <>Nouveau <span className="text-primary">Mot de passe</span></>
              )}
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              {mode === 'request' 
                ? "Recevez un lien par email pour créer un nouveau mot de passe"
                : "Définissez votre nouveau mot de passe sécurisé"
              }
            </p>
          </div>
          
          {mode === 'request' ? (
            <ResetRequestForm onSuccess={() => navigate("/auth/login")} />
          ) : (
            <NewPasswordForm onSuccess={() => navigate("/profil")} />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
