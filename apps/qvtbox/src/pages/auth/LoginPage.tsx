import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import PasswordLoginForm from "@/components/auth/PasswordLoginForm";
import PasswordSignUpForm from "@/components/auth/PasswordSignUpForm";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

type LoginTab = "login" | "signup" | "magic";

const getSafeReturnUrl = (value: string | null) => {
  if (!value || !value.startsWith("/")) {
    // ✅ Par défaut on guide vers le choix d’univers (plus clair qu’un simple /dashboard)
    return "/choisir-sphere";
  }
  return value;
};

const getInitialTab = (value: string | null): LoginTab => {
  if (value === "signup") return "signup";
  if (value === "magic") return "magic";
  return "login";
};

const DESTINATIONS = [
  { key: "bulles", label: "Mes bulles", path: "/dashboard" },
  { key: "perso", label: "Vie perso", path: "/famille" },
  { key: "pro", label: "Entreprise", path: "/entreprise" },
] as const;

const getDestinationLabel = (returnUrl: string) => {
  if (returnUrl.startsWith("/famille")) return "Vie perso";
  if (returnUrl.startsWith("/entreprise")) return "Entreprise";
  if (returnUrl.startsWith("/bulles") || returnUrl.startsWith("/bulle") || returnUrl.startsWith("/dashboard"))
    return "Mes bulles";
  if (returnUrl.startsWith("/invitation")) return "Invitation";
  if (returnUrl.startsWith("/choisir-sphere")) return "Choisir mon univers";
  return "Mon espace";
};

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));
  const callbackUrl = `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`;

  const initialTab = useMemo(() => getInitialTab(searchParams.get("mode")), [searchParams]);
  const [activeTab, setActiveTab] = useState<LoginTab>(initialTab);

  const destinationLabel = useMemo(() => getDestinationLabel(returnUrl), [returnUrl]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  const handleTabChange = (next: string) => {
    const nextTab = (next as LoginTab) || "login";
    setActiveTab(nextTab);

    const params = new URLSearchParams(searchParams);
    if (nextTab === "login") {
      params.delete("mode");
    } else {
      params.set("mode", nextTab);
    }
    setSearchParams(params, { replace: true });
  };

  const setReturnUrl = (path: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("returnUrl", path);
    setSearchParams(params, { replace: true });
  };

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
              Connectez-vous pour accéder à vos bulles de confiance (vie perso ou entreprise).
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-sm text-[#6F6454]">
              Privé par défaut. Partage choisi. Sécurité d’abord.
            </p>

            {/* ✅ Guidance réseau social */}
            <div className="mt-5 mx-auto max-w-2xl rounded-2xl border border-[#E8DCC8] bg-white/70 px-4 py-3 text-sm text-[#6F6454]">
              Après connexion, vous serez redirigé vers :{" "}
              <span className="font-semibold text-[#1B1A18]">{destinationLabel}</span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCC8] bg-white/90 p-5 md:p-7 shadow-sm">
            {/* ✅ Je viens pour... */}
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#9C8D77]">Je viens pour</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DESTINATIONS.map((d) => {
                  const active = returnUrl.startsWith(d.path);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setReturnUrl(d.path)}
                      className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition",
                        active
                          ? "bg-[#1B1A18] text-[#FAF6EE]"
                          : "border border-[#E8DCC8] bg-white text-[#6F6454] hover:text-[#1B1A18]",
                      ].join(" ")}
                    >
                      {d.label}
                    </button>
                  );
                })}
                <Link
                  to="/bulles"
                  className="rounded-full border border-[#E8DCC8] bg-white px-4 py-2 text-sm font-semibold text-[#6F6454] hover:text-[#1B1A18]"
                >
                  Créer ma première bulle
                </Link>
              </div>
            </div>

            <SocialLoginButtons redirectTo={callbackUrl} />

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#A0917A]">
              <span className="h-px flex-1 bg-[#E8DCC8]" />
              ou
              <span className="h-px flex-1 bg-[#E8DCC8]" />
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid h-11 w-full grid-cols-3 rounded-2xl bg-[#F8F2E8]">
                <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-white">
                  Inscription
                </TabsTrigger>
                <TabsTrigger value="magic" className="rounded-xl data-[state=active]:bg-white">
                  Lien magique
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4 rounded-2xl border border-[#E8DCC8] bg-white p-5">
                <PasswordLoginForm onSuccess={() => navigate(returnUrl)} />
              </TabsContent>

              <TabsContent value="signup" className="mt-4 rounded-2xl border border-[#E8DCC8] bg-white p-5">
                <PasswordSignUpForm redirectTo={callbackUrl} onSuccess={() => navigate(returnUrl)} />
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
