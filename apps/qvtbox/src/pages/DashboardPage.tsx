import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, HeartHandshake, Sparkles } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProfessionalDashboard from "@/components/ProfessionalDashboard";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

type DashTab = "personal" | "enterprise";

const DashboardPage = () => {
  const { user } = useAuth() as any;

  const defaultTab: DashTab = useMemo(() => {
    // Si on veut plus tard: détecter via profile / last universe.
    // Pour l’instant: perso par défaut (plus inclusif), entreprise en second onglet.
    return "personal";
  }, []);

  const [tab, setTab] = useState<DashTab>(defaultTab);

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")?.[0] ||
    (user?.email as string | undefined)?.split("@")?.[0] ||
    "là";

  return (
    <AuthGuard>
      <Navigation />

      <main className="min-h-[70vh] bg-[#FAF6EE] px-6 pb-20 pt-28 md:pt-32 text-[#1B1A18]">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8B7D67]">
              Tableau de bord
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-4xl">
              Bonjour {firstName} ✨
            </h1>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-[#6F6454]">
              Ton hub QVT Box : retrouve tes bulles, tes invitations, et les accès rapides.
              Privé par défaut. Partage choisi. Sécurité d’abord.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("personal")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "personal"
                  ? "bg-[#1B1A18] text-[#FAF6EE]"
                  : "border border-[#1B1A18]/15 bg-white text-[#1B1A18] hover:border-[#1B1A18]/30"
              }`}
            >
              <HeartHandshake className="h-4 w-4" />
              Vie perso
            </button>

            <button
              type="button"
              onClick={() => setTab("enterprise")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === "enterprise"
                  ? "bg-[#1B1A18] text-[#FAF6EE]"
                  : "border border-[#1B1A18]/15 bg-white text-[#1B1A18] hover:border-[#1B1A18]/30"
              }`}
            >
              <Building2 className="h-4 w-4" />
              Entreprise
            </button>
          </div>

          {/* Common hub cards (always visible) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mes bulles */}
            <div className="rounded-[28px] border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8B7D67]">
                    Réseau en bulles
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">Mes bulles</h2>
                  <p className="mt-2 text-sm text-[#6F6454]">
                    Crée une bulle (solo, duo, famille, équipe…) et invite les bonnes personnes.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#CFECE8]/45 p-3">
                  <Sparkles className="h-5 w-5 text-[#1B1A18]" />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  to="/bulles"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F3E0B9] px-5 py-2.5 text-sm font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
                >
                  Voir mes bulles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/bulles"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                >
                  Créer une bulle
                </Link>
              </div>
            </div>

            {/* Invitations & notifications */}
            <div className="rounded-[28px] border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8B7D67]">
                Activité
              </p>
              <h2 className="mt-2 text-xl font-semibold">Invitations & notifications</h2>
              <p className="mt-2 text-sm text-[#6F6454]">
                Accepte une invitation de bulle, suis les réponses, et garde le fil.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  to="/notifications"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                >
                  Voir les notifications
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Accès rapides */}
            <div className="rounded-[28px] border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8B7D67]">
                Accès rapides
              </p>
              <h2 className="mt-2 text-xl font-semibold">ZÉNA • Lucioles • Box</h2>
              <p className="mt-2 text-sm text-[#6F6454]">
                Parle à ZÉNA, recrute une Luciole (payant) si besoin, ou découvre la box au bon moment.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                  to="/zena"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  ZÉNA
                </Link>
                <Link
                  to="/lucioles"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                >
                  Lucioles
                </Link>
                <Link
                  to="/box"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                >
                  Box
                </Link>
                <Link
                  to="/securite"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                >
                  Sécurité
                </Link>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="mt-10">
            {tab === "personal" ? (
              <div className="rounded-[28px] border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8B7D67]">
                  Vie perso
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Ton espace personnel</h2>
                <p className="mt-2 text-sm text-[#6F6454]">
                  Ici, tu construis tes bulles (solo, duo, famille, proches). Utilise ZÉNA pour
                  mettre des mots et planifier des activités (calendrier) dans tes bulles.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to="/famille"
                    className="inline-flex items-center gap-2 rounded-full bg-[#F3E0B9] px-5 py-2.5 text-sm font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
                  >
                    Aller à Vie perso
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/ado"
                    className="inline-flex items-center gap-2 rounded-full border border-[#1B1A18]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/30"
                  >
                    Espace ado
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-[#E8DCC8] bg-white shadow-sm">
                {/* On réutilise ton dashboard existant pour l’entreprise */}
                <ProfessionalDashboard />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </AuthGuard>
  );
};

export default DashboardPage;
