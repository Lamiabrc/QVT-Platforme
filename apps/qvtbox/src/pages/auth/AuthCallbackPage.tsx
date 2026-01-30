import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/FloatingBubbles";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AuthCallbackPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirmAuth } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Clean URL from sensitive params first
        const url = new URL(window.location.href);
        let hasAuthParams = false;

        // Check if we have auth-related parameters
        if (url.hash.includes('access_token') || 
            url.searchParams.get('code') || 
            url.searchParams.get('type') === 'recovery') {
          hasAuthParams = true;
        }

        if (!hasAuthParams) {
          throw new Error('No authentication parameters found');
        }

        // Try to get current session after URL processing
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error('No session could be established');
        }

        // Clean the URL immediately after successful auth
        const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);

        await confirmAuth();
        setStatus('success');
        
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers votre tableau de bord...",
        });

        // Redirect after a short delay to show success state
        setTimeout(() => {
          navigate('/profil');
        }, 1500);

      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        
        // Clean URL even on error
        const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);

        toast({
          title: "Erreur de connexion",
          description: error.message || "Le lien est invalide ou expiré.",
          variant: "destructive"
        });

        // Redirect to login after delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast, confirmAuth]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <FloatingBubbles />
      
      <div className="relative z-10 text-center">
        <div className="card-professional p-8 max-w-md mx-auto">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Connexion en cours...
              </h2>
              <p className="text-foreground/70">
                Vérification de vos informations
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Connexion réussie !
              </h2>
              <p className="text-foreground/70">
                Redirection vers votre espace...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Erreur de connexion
              </h2>
              <p className="text-foreground/70">
                Redirection vers la connexion...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
