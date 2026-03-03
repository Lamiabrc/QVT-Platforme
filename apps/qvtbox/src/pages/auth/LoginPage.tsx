import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import PasswordLoginForm from "@/components/auth/PasswordLoginForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const getSafeReturnUrl = (value: string | null) => {
  if (!value || !value.startsWith("/")) {
    return "/dashboard";
  }
  return value;
};

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));
  const callbackUrl = `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`;

  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

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
              Connectez-vous avec votre mot de passe, un compte social, ou un lien magique.
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-sm text-[#6F6454]">
              Privé par défaut. Partage choisi. Sécurité d’abord.
            </p>
          </div>

          <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCC8] bg-white/90 p-5 md:p-7 shadow-sm">
            <SocialLoginButtons redirectTo={callbackUrl} />

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#A0917A]">
              <span className="h-px flex-1 bg-[#E8DCC8]" />
              ou
              <span className="h-px flex-1 bg-[#E8DCC8]" />
            </div>

            <Tabs defaultValue="password">
              <TabsList className="grid h-11 w-full grid-cols-2 rounded-2xl bg-[#F8F2E8]">
                <TabsTrigger value="password" className="rounded-xl data-[state=active]:bg-white">
                  Email + mot de passe
                </TabsTrigger>
                <TabsTrigger value="magic" className="rounded-xl data-[state=active]:bg-white">
                  Lien magique
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="mt-4 rounded-2xl border border-[#E8DCC8] bg-white p-5">
                <PasswordLoginForm onSuccess={() => navigate(returnUrl)} />
              </TabsContent>

              <TabsContent value="magic" className="mt-4">
                <MagicLinkForm redirectTo={callbackUrl} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
