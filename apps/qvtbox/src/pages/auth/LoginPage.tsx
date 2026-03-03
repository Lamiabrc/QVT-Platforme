import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#F3E0B9]/60 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-36">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
        <div className="absolute left-10 top-24 h-64 w-64 rounded-full bg-[#CFECE8]/45 blur-3xl" />
        <div className="absolute -right-8 top-20 h-72 w-72 rounded-full bg-[#F3E0B9]/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Connexion</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold">Votre espace QVT Box</h1>
            <p className="mt-4 max-w-3xl mx-auto text-base md:text-lg text-[#6F6454]">
              Recevez un lien magique par email pour vous connecter en toute sécurité.
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-sm text-[#6F6454]">
              Privé par défaut. Partage choisi. Sécurité d’abord.
            </p>
          </div>

          <MagicLinkForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
