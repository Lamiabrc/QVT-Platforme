// src/pages/auth/LoginPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import FloatingBubbles from "@/components/FloatingBubbles";
import Footer from "@/components/Footer";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const RETURN_URL_KEY = "qvtbox.auth.returnUrl";

function sanitizeReturnUrl(raw: string | null) {
  if (!raw) return "/profil";
  // Only allow same-site paths
  if (!raw.startsWith("/")) return "/profil";
  if (raw.startsWith("//")) return "/profil";
  return raw;
}

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const returnUrl = useMemo(() => {
    const fromQuery = searchParams.get("returnUrl");
    return sanitizeReturnUrl(fromQuery);
  }, [searchParams]);

  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Save returnUrl for the callback step (magic-link comes back without your original query)
    try {
      window.localStorage.setItem(RETURN_URL_KEY, returnUrl);
    } catch {
      // ignore
    }
  }, [returnUrl]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, returnUrl]);

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
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-4">
              Connexion <span className="text-primary">Simple</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
              Recevez un lien magique par email pour vous connecter en toute sécurité.
            </p>
          </div>

          {emailSent ? (
            <div className="card-professional p-8 text-center">
              <h2 className="text-2xl font-kalam font-bold text-foreground mb-2">
                Vérifiez votre email ✉️
              </h2>
              <p className="text-foreground/70">
                Nous venons d’envoyer un lien de connexion. Ouvrez-le depuis votre boîte mail
                (et pensez à vérifier les spams).
              </p>

              <div className="mt-6 rounded-2xl border border-white/30 bg-white/10 p-4 text-sm text-foreground/80">
                Une fois le lien ouvert, vous serez redirigé vers :
                <div className="mt-2 font-semibold">{returnUrl}</div>
              </div>

              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/15 transition"
              >
                Renvoyer un lien / changer d’email
              </button>
            </div>
          ) : (
            <MagicLinkForm
              onSuccess={() => {
                setEmailSent(true);
                toast({
                  title: "Email envoyé",
                  description: "Ouvrez le lien reçu pour finaliser la connexion.",
                });
              }}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
