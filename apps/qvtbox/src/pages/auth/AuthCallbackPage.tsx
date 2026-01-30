// src/pages/auth/AuthCallbackPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/FloatingBubbles";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type Status = "loading" | "success" | "error";

function parseHashParams(hash: string) {
  // hash is like: "#access_token=...&refresh_token=...&type=recovery"
  const clean = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(clean);
}

const AuthCallbackPage = () => {
  const [status, setStatus] = useState<Status>("loading");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirmAuth } = useAuth();

  // ✅ Avoid double execution in React StrictMode (dev)
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleAuthCallback = async () => {
      try {
        setStatus("loading");

        const url = new URL(window.location.href);

        const code = url.searchParams.get("code");
        const typeQuery = url.searchParams.get("type"); // sometimes "recovery"
        const hashParams = parseHashParams(url.hash);

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const typeHash = hashParams.get("type");

        const isRecovery = typeQuery === "recovery" || typeHash === "recovery";

        const hasAuthParams = Boolean(code || accessToken || refreshToken || isRecovery);

        if (!hasAuthParams) {
          throw new Error("Aucun paramètre d'authentification trouvé (lien invalide).");
        }

        // ✅ 1) PKCE flow: ?code=...
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // ✅ 2) Implicit flow: #access_token=...&refresh_token=...
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        // ✅ verify session
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!data.session) {
          throw new Error("Aucune session n'a pu être établie. Le lien est peut-être expiré.");
        }

        // ✅ confirm app-level auth (localStorage flag + sync user)
        await confirmAuth();

        // ✅ Clean URL (remove query + hash tokens)
        const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);

        setStatus("success");

        toast({
          title: "Connexion réussie !",
          description: isRecovery
            ? "Redirection vers la réinitialisation du mot de passe..."
            : "Redirection vers votre espace...",
        });

        // Redirect after short delay (nice UX)
        setTimeout(() => {
          navigate(isRecovery ? "/reset-password" : "/profil", { replace: true });
        }, 900);
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setStatus("error");

        // ✅ Clean URL even on error
        const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);

        toast({
          title: "Erreur de connexion",
          description: error?.message || "Le lien est invalide ou expiré.",
          variant: "destructive",
        });

        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 1600);
      }
    };

    handleAuthCallback();
  }, [navigate, toast, confirmAuth]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <FloatingBubbles />

      <div className="relative z-10 text-center">
        <div className="card-professional p-8 max-w-md mx-auto">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Connexion en cours...
              </h2>
              <p className="text-foreground/70">Vérification de vos informations</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Connexion réussie !
              </h2>
              <p className="text-foreground/70">Redirection vers votre espace...</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Erreur de connexion
              </h2>
              <p className="text-foreground/70">Redirection vers la connexion...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
