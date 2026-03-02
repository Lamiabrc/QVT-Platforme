import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type Luciole = {
  id: string;
  display_name: string;
  city: string | null;
  bio: string | null;
  expertise: string[] | null;
  hourly_rate_cents: number | null;
};

export default function LuciolesPage() {
  const [loading, setLoading] = useState(true);
  const [lucioles, setLucioles] = useState<Luciole[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from("lucioles")
        .select("id, display_name, city, bio, expertise, hourly_rate_cents")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      setLucioles((data ?? []) as Luciole[]);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -right-8 top-20 h-72 w-72 rounded-full bg-[#F3E0B9]/40 blur-3xl" />
          <div className="absolute left-10 top-24 h-64 w-64 rounded-full bg-[#CFECE8]/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Lucioles</p>
            <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Trouver une Luciole.</h1>
            <p className="mt-4 max-w-3xl text-base text-[#6F6454] md:text-lg">
              Une Luciole est un adulte référent rémunéré. L’annuaire affiche uniquement les
              Lucioles approuvées.
            </p>

            <ul className="mt-6 grid gap-2 text-sm text-[#6F6454]">
              <li>Opt-in: on choisit, on arrête quand on veut</li>
              <li>Encadrement: charte, limites, signalement, supervision</li>
              <li>Accès: la Luciole ne voit que ce que l’utilisateur partage</li>
            </ul>

            <div className="mt-8">
              <Link
                to="/devenir-luciole"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
              >
                Devenir Luciole
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F3E0B9]/35 blur-2xl" />
              <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-[#CFECE8]/35 blur-2xl" />

              <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[1.1fr,0.9fr] md:p-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">Engagement Bubble</p>
                  <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                    Un cadre humain, clair et responsable.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#6F6454] md:text-base">
                    Les Lucioles interviennent avec un cadre d'accompagnement concret: opt-in, limites
                    explicites, supervision et partage choisi. L'objectif est d'aider sans imposer.
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-[#6F6454]">
                  <li>Engagement 1: consentement actif a chaque etape</li>
                  <li>Engagement 2: confidentialite par defaut, partage choisi</li>
                  <li>Engagement 3: signalement et urgence accessibles</li>
                  <li>Engagement 4: charte et supervision des Lucioles</li>
                </ul>
              </div>

              <div className="relative z-10 flex flex-wrap gap-3 px-6 pb-6 md:px-8 md:pb-8">
                <Link
                  to="/engagements"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Voir nos engagements
                </Link>
                <Link
                  to="/securite"
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-[#FFFCF6] px-5 py-2.5 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
                >
                  Lire les regles de securite
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E8DCC8] bg-[#FDF9F0] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <article className="rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454]">
                  Chargement des Lucioles...
                </article>
              ) : lucioles.length ? (
                lucioles.map((luciole) => (
                  <article
                    key={luciole.id}
                    className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
                  >
                    <h2 className="text-lg font-semibold">{luciole.display_name}</h2>
                    <p className="mt-1 text-sm text-[#7C725F]">{luciole.city ?? "France"}</p>
                    {luciole.bio ? <p className="mt-3 text-sm text-[#6F6454]">{luciole.bio}</p> : null}
                    {luciole.expertise?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {luciole.expertise.map((item) => (
                          <span
                            key={`${luciole.id}-${item}`}
                            className="rounded-full border border-[#E8DCC8] bg-[#FFFCF6] px-3 py-1 text-xs text-[#6F6454]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {luciole.hourly_rate_cents ? (
                      <p className="mt-4 text-sm font-semibold text-[#1B1A18]">
                        {Math.round(luciole.hourly_rate_cents / 100)} €/h
                      </p>
                    ) : null}
                  </article>
                ))
              ) : (
                <article className="rounded-3xl border border-dashed border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454]">
                  Annuaire en cours de constitution. Revenez bientôt.
                </article>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
