// src/pages/FamillePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ROUTES = {
  create: "/famille/creer",
  invite: "/famille/inviter",
  join: "/famille/rejoindre",
  dashboard: "/famille/dashboard",
};

export default function FamillePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden bg-[#FAF6EE]">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
            <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                  Sphère Famille
                </p>

                <h1 className="text-3xl md:text-5xl font-semibold mt-4">
                  ZÉNA Famille, un univers complet pour parler et agir ensemble.
                </h1>

                <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
                  Un espace parent/tuteur, un espace ado, et un espace commun
                  pour organiser la vie familiale. ZÉNA écoute, propose des
                  actions simples et aide à prioriser le quotidien.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={ROUTES.dashboard}
                        className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                      >
                        Accéder à mon espace Famille
                      </Link>
                      <Link
                        to={ROUTES.invite}
                        className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                      >
                        Inviter un membre
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={ROUTES.create}
                        className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                      >
                        Créer un compte Famille
                      </Link>
                      <Link
                        to={ROUTES.join}
                        className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                      >
                        Rejoindre une famille
                      </Link>
                      <Link
                        to={ROUTES.invite}
                        className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                      >
                        Inviter un ado / tuteur
                      </Link>
                    </>
                  )}
                </div>

                <p className="mt-4 text-xs text-[#9C8D77]">
                  Astuce : si tu es déjà membre d’un espace Famille, utilise “Rejoindre une famille”.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/50 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  {/* ✅ Nouvelle image "consolidation famille" */}
                  <img
                    src="/famille-still.jpg"
                    alt="Lien familial, soutien et sécurité"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-xs text-[#9C8D77] text-center">
                  Un lien simple, une présence discrète — la luciole veille.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Univers Famille
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Trois espaces complémentaires, chacun avec son rôle.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Espace Ados</h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Questions, conseils, vie scolaire et soutien discret avec ZÉNA.
                </p>
                <div className="mt-4 grid gap-2 text-xs text-[#9C8D77]">
                  <span>• Journal et signaux faibles</span>
                  <span>• Conseils adaptés à l&apos;ado</span>
                  <span>• Espace amis invite-only</span>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Espace Parents / Tuteurs</h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Charge mentale, conseils d&apos;accompagnement et alertes utiles.
                </p>
                <div className="mt-4 grid gap-2 text-xs text-[#9C8D77]">
                  <span>• Aide à la décision</span>
                  <span>• Alertes ciblées et protégées</span>
                  <span>• Suivi des actions familiales</span>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Espace Commun</h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Activités familiales, messages et planning partagé.
                </p>
                <div className="mt-4 grid gap-2 text-xs text-[#9C8D77]">
                  <span>• Planning commun</span>
                  <span>• Messages et partages autorisés</span>
                  <span>• Actions familiales priorisées</span>
                </div>
              </div>
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
                  loading="lazy"
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
                L&apos;ado a son espace pour parler à ZÉNA et organiser ses routines.
                Les parents ou tuteurs voient l&apos;essentiel, avec des règles
                claires et un cadre protecteur.
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
                Si un signal critique apparaît, une alerte peut être transmise à
                la tutelle (parent/tuteur) selon les règles définies. L&apos;ado reste
                accompagné, sans exposition publique.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={ROUTES.create}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Démarrer l&apos;essai Famille
                </Link>
                <Link
                  to={ROUTES.invite}
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Générer un code d&apos;invitation
                </Link>
              </div>

              <p className="mt-4 text-xs text-[#9C8D77]">
                ZÉNA ne remplace pas les urgences. En cas de danger immédiat,
                contactez les secours.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/40 via-transparent to-[#CFECE8]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                <img
                  src="/parler%20zena.png"
                  alt="ZÉNA accompagne les alertes famille"
                  className="h-[320px] w-full object-cover md:h-[380px]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
