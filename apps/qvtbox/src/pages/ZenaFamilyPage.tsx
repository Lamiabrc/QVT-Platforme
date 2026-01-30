// src/pages/ZenaFamilyPage.tsx
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, HeartHandshake, Smile, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ZenaChatPanel from "@/components/ZenaChatPanel";

const ZenaFamilyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [familyId, setFamilyId] = useState<string | null>(null);

  useEffect(() => {
    const loadFamily = async () => {
      if (!isAuthenticated || !user) return;
      const { data } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      setFamilyId(data?.family_id ?? null);
    };

    loadFamily();
  }, [isAuthenticated, user]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F2F7F6] via-[#FFF3EA] to-[#FFF9F4] text-[#212121]">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-28 pb-16 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-3">
                  ZÉNA · Univers famille & ado
                </p>

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-[#5B4B8A] via-[#4FD1C5] to-[#5B4B8A] text-transparent bg-clip-text">
                  ZÉNA Family, une bulle pour parler vraiment
                </h1>

                <p className="text-sm md:text-base text-[#212121]/75 max-w-3xl mb-6 leading-relaxed">
                  ZÉNA Family est un espace sécurisé pour les ados, les parents, les grands-parents
                  et les adultes de confiance. On y parle émotions, fatigue, conflits, joie,
                  pression scolaire, sans jugement et avec des mots simples.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                    Question centrale : "Ça va vraiment ?"
                  </span>
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                    Espaces parent & ado séparés mais reliés
                  </span>
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                    Espace amis invite-only + alertes en cas de détresse
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/famille/creer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] px-8 py-3 text-sm font-medium text-white shadow-lg hover:scale-[1.03] transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Accéder à ZÉNA Family
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-xs text-[#212121]/60">
                    Idéal pour les parents salariés, les ados en plein questionnement et les familles
                    qui veulent recréer du lien sans théâtraliser les émotions.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/40 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/images/zena-portrait.jpg"
                    alt="Visage de ZÉNA"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#5B4B8A]">
                  ZÉNA • Écoute
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="mx-auto max-w-5xl">
            <ZenaChatPanel
              sphere="family"
              familyId={familyId}
              title="Parler à ZÉNA en famille"
              subtitle="Un espace confidentiel pour exprimer ce qui ne sort pas. ZÉNA peut déclencher une alerte si un signal faible apparaît."
            />
          </div>
        </section>

        {/* BLOC FAMILLE */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Smile className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Donner des mots aux ados</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                ZÉNA aide les ados à exprimer ce qu’ils ressentent vraiment, sans pression de
                performance et sans avoir à "faire semblant que tout va bien".
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Soutenir les parents</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                Les parents ont leur propre espace pour suivre l’ambiance générale, recevoir des
                pistes de dialogue et se sentir moins seuls dans la tempête.
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Créer des moments qui comptent</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                En lien avec QVT Box, ZÉNA Family peut déclencher des idées d’activités, des box
                parent/ado ou des routines simples pour apaiser le quotidien.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-[0.9fr,1.1fr] items-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-[#E7D4F1]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(27,26,24,0.16)]">
                <img
                  src="/luciole.png"
                  alt="Bulle de soin et soutien"
                  className="h-[320px] w-full object-cover md:h-[380px]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Parcours ado / parent
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Deux espaces reliés, sans mélange des rôles.
              </h2>
              <p className="text-sm text-[#6F6454]">
                L’ado a son espace pour parler à ZÉNA et organiser ses routines. Les parents ou
                tuteurs voient l’essentiel, avec des règles claires et un cadre protecteur.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-[#6F6454]">
                <div className="rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3">
                  Espace Famille commun + espace Amis invite-only.
                </div>
                <div className="rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3">
                  Planning partagé et suggestions simples par priorité.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-t border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-[1.05fr,0.95fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Alerte détresse / harcèlement
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Une protection active, sans dramatiser.
              </h2>
              <p className="text-sm text-[#6F6454] mt-3">
                Si un signal critique apparaît, une alerte peut être transmise à la tutelle
                (parent/tuteur) selon les règles définies. L’ado reste accompagné, sans
                exposition publique.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/famille/creer"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Démarrer l’essai Famille
                </Link>
                <Link
                  to="/famille/inviter"
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Générer un code d’invitation
                </Link>
              </div>
              <p className="mt-4 text-xs text-[#9C8D77]">
                ZÉNA ne remplace pas les urgences. En cas de danger immédiat, contactez
                les secours.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/40 via-transparent to-[#CFECE8]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                <img
                  src="/parler%20zena.png"
                  alt="ZÉNA accompagne les alertes famille"
                  className="h-[320px] w-full object-cover md:h-[380px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ZenaFamilyPage;
