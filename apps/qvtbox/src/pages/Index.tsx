// src/pages/Index.tsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { CONTACT_EMAIL, QVTBOX_ROUTES } from "@qvt/shared";
import boucheVideo from "@/assets/bouche.mp4";

const BubbleDivider = () => (
  <div className="flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-2 w-2 rounded-full bg-[#E8DCC8]" />
    <span className="h-3 w-3 rounded-full bg-[#F3E0B9]" />
    <span className="h-2 w-2 rounded-full bg-[#E7D4F1]/70" />
  </div>
);

export default function Index() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoPoster = "/zena-still.jpg";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    updatePreference();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
    } else {
      mediaQuery.addListener(updatePreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updatePreference);
      } else {
        mediaQuery.removeListener(updatePreference);
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const target = videoContainerRef.current;
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="overflow-hidden">
        {/* HERO */}
        <section className="relative min-h-[92vh] bg-[#FAF6EE]">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#F3E0B9]/40 blur-3xl" />
          <div className="absolute top-24 -left-16 h-72 w-72 rounded-full bg-[#CFECE8]/40 blur-3xl" />
          <div className="absolute bottom-10 right-12 h-48 w-48 rounded-full bg-[#E7D4F1]/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16 md:pt-40">
            <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
              <div className="max-w-3xl space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9C8D77]">
                QVT Box - QVT Family & Zena Family
              </p>

              <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-[#1B1A18]">
                Une presence pour les familles,
                <span className="block text-[#6F6454]">des actions qui apaisent.</span>
              </h1>

              <p className="text-base md:text-lg text-[#6F6454] max-w-2xl leading-relaxed">
                QVT Family met au premier plan l'accompagnement des familles.
                Zena Family ecoute, propose des actions, informe et aide a
                planifier. Le volet entreprise reste disponible en second
                plan quand il le faut.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={QVTBOX_ROUTES.famille}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(27,26,24,0.2)] hover:opacity-90 transition"
                >
                  Decouvrir QVT Family
                </Link>
                <Link
                  to="/zena-family-page"
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white/60 px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                >
                  Parler a ZENA Family
                </Link>
              </div>
              <div className="text-xs text-[#9C8D77]">
                Volet entreprise en second plan: {" "}
                <Link to={QVTBOX_ROUTES.entreprise} className="underline">
                  acceder a l'espace entreprise
                </Link>
              </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/60 via-transparent to-[#E7D4F1]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/hero-cicatrices-lumiere.jpg"
                    alt="Lumière dans les cicatrices"
                    className="h-[380px] w-full object-cover md:h-[460px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3 max-w-4xl">
              {[
                {
                  title: "Écoute active",
                  text: "Une IA émotionnelle qui capte les signaux faibles.",
                },
                {
                  title: "Plan d’action",
                  text: "Des suggestions concrètes, un planning simple.",
                },
                {
                  title: "Protection",
                  text: "Alertes sécurisées pour famille, tuteur ou RH/QVT.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E8DCC8] bg-white/70 p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-[#1B1A18]">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#6F6454] mt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MANIFESTE VISUEL */}
        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-5xl px-6 text-center space-y-4">
            <BubbleDivider />
            <p className="text-sm uppercase tracking-[0.28em] text-[#9C8D77]">
              Le quotidien va vite. Les émotions, moins.
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1B1A18]">
              QVT Box crée une lumière dans la fissure.
            </h2>
          </div>
        </section>

                {/* COMMENT CA MARCHE */}
        <section
          id="comment-ca-marche"
          className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl mb-10">
              <BubbleDivider />
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                Comment ça marche
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Un parcours simple, pensé pour la vraie vie.
              </h2>
              <p className="text-sm md:text-base text-[#6F6454] mt-3">
                Trois étapes claires, une présence qui rassure, et une
                protection si la situation l’exige.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold text-[#9C8D77]">Étape 1</div>
                <h3 className="text-xl font-semibold mt-2">Je parle à ZENA</h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Un espace confidentiel pour dire ce qui pèse, sans jugement.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/zena"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-5 py-2.5 text-sm font-semibold shadow-[0_14px_30px_rgba(27,26,24,0.16)] hover:opacity-90 transition"
                  >
                    Parler à ZÉNA
                  </Link>
                  <span className="text-xs text-[#9C8D77] self-center">
                    ZÉNA est là pour écouter, pas pour juger.
                  </span>
                </div>
              </div>

              <div
                ref={videoContainerRef}
                className="relative overflow-hidden rounded-[28px] border border-[#E8DCC8] bg-[#F7F1E4] shadow-[0_24px_60px_rgba(27,26,24,0.16)]"
              >
                <div className="aspect-[5/4] sm:aspect-[4/5] lg:aspect-[5/4] w-full">
                  {prefersReducedMotion || !shouldLoadVideo ? (
                    <img
                      src={videoPoster}
                      alt="ZÉNA en écoute active"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={boucheVideo}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={videoPoster}
                      aria-label="Mini-vidéo de ZÉNA en écoute active"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1A18]/55 via-transparent to-transparent" />
                <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                  <span className="rounded-full bg-[#1B1A18]/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F7F1E4]">
                    ZÉNA • Écoute active
                  </span>
                  <div className="flex items-center gap-1 opacity-80" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-[#F7F1E4] animate-pulse"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-sm text-[#F7F1E4] max-w-xs leading-relaxed">
                    Dites-le à ZÉNA. Même quand ça ne sort pas.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  title: "Je reçois des suggestions + un planning simple",
                  text: "Des actions réalistes, organisées par priorité et par temps.",
                },
                {
                  title: "Si nécessaire, une alerte protège et informe la tutelle",
                  text: "Famille, tuteur, RH/QVT : chacun reçoit uniquement ce qui est prévu.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
                >
                  <div className="text-xs font-semibold text-[#9C8D77]">
                    Étape {index + 2}
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                  <p className="text-sm text-[#6F6454] mt-2">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[#9C8D77]">
              Note sécurité : ZENA ne remplace pas les urgences. En cas de
              danger immédiat, contactez les services d’urgence.
            </p>
          </div>
        </section>


        {/* OFFRES */}
        <section id="offres" className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl mb-12">
              <BubbleDivider />
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                QVT Family en premier plan
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Famille d'abord, entreprise en soutien.
              </h2>
              <p className="text-sm md:text-base text-[#6F6454] mt-3">
                Le monde Famille est prioritaire pour proteger et accompagner.
              </p>
              <p className="text-sm md:text-base text-[#6F6454]">
                Le volet entreprise reste disponible en second plan.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#1B1A18]/30 bg-[#FFF8EC] p-7 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                  Famille
                </p>
                <div className="inline-flex items-center rounded-full border border-[#1B1A18]/30 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#1B1A18]">
                  Priorite QVT Family
                </div>
                <h3 className="text-xl font-semibold mt-3">
                  La sphere perso, pour soutenir le quotidien.
                </h3>
                <div className="mt-4 space-y-3 text-sm text-[#6F6454]">
                  <p>
                    <span className="font-semibold text-[#1B1A18]">
                    Pour qui ?
                    </span>{" "}
                    Familles, parents, proches, tuteurs.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1B1A18]">
                    Objectifs
                    </span>{" "}
                    Ecouter, organiser, soutenir sans alourdir.
                  </p>
                  <div>
                    <span className="font-semibold text-[#1B1A18]">
                    Ce que ca contient
                    </span>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Abonnement en ligne simple et flexible.</li>
                    <li>Sous-comptes enfants et espace famille.</li>
                    <li>Espace amis en acces sur invitation.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={QVTBOX_ROUTES.famille}
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Voir l'offre Famille
                  </Link>
                  <Link
                    to={QVTBOX_ROUTES.familleCreate}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Creer un compte Famille
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white/70 p-7 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                  Entreprise (secondaire)
                </p>
                <h3 className="text-xl font-semibold mt-2">
                  La sphere pro, pensee pour l'interne.
                </h3>
                <div className="mt-4 space-y-3 text-sm text-[#6F6454]">
                  <p>
                    <span className="font-semibold text-[#1B1A18]">
                    Pour qui ?
                    </span>{" "}
                    RH, managers, equipes QVT/QVCT.
                  </p>
                  <p>
                    <span className="font-semibold text-[#1B1A18]">
                    Objectifs
                    </span>{" "}
                    Prevenir, detecter, agir avec un cadre clair.
                  </p>
                  <div>
                    <span className="font-semibold text-[#1B1A18]">
                    Ce que ca contient
                    </span>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Demo / devis et onboarding guide.</li>
                    <li>Code entreprise pour rejoindre en securite.</li>
                    <li>Espace interne pour suivre et agir.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={QVTBOX_ROUTES.entreprise + "#demo"}
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Demander une demo
                  </Link>
                  <Link
                    to={QVTBOX_ROUTES.entrepriseJoin}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-5 py-2.5 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    J'ai un code entreprise
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHOISIR SPHERE */}
        <section
          id="choisir-sphere"
          className="py-16 md:py-20 bg-[#FDF9F0] border-t border-[#E8DCC8]"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl mb-10">
              <BubbleDivider />
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                Choisir ma sphere
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-3">
                Commencez par QVT Family, puis explorez l'entreprise si besoin.
              </h2>
              <p className="text-sm md:text-base text-[#6F6454] mt-3">
                Les deux mondes sont isoles. Vous pourrez basculer plus tard.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to={QVTBOX_ROUTES.famille}
                className="group rounded-3xl border border-[#1B1A18]/25 bg-[#FFF8EC] p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                  Famille
                </p>
                <h3 className="text-lg font-semibold mt-2">
                  Je soutiens un proche au quotidien.
                </h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Abonnement en ligne, sous-comptes et invitations.
                </p>
              </Link>

              <Link
                to={QVTBOX_ROUTES.entreprise}
                className="group rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                  Entreprise (secondaire)
                </p>
                <h3 className="text-lg font-semibold mt-2">
                  Je represente une organisation.
                </h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  Demo, devis, code entreprise, espace interne.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CONFIANCE */}
      <footer className="bg-[#151515] text-[#ECE7DF] border-t border-[#2D2721]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#F3E0B9]">
                QVT Box
              </h3>
              <p className="text-xs text-[#CDBEA9] mt-2">
                Espoir &amp; Hope · Une présence qui rassure.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-xs text-[#F3E0B9] mt-3 inline-block hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#DCCFB9]">
              <Link to="/contact" className="hover:text-[#F3E0B9] transition">
                Contact
              </Link>
              <Link
                to="/politique-confidentialite"
                className="hover:text-[#F3E0B9] transition"
              >
                Confidentialité
              </Link>
              <Link
                to="/mentions-legales"
                className="hover:text-[#F3E0B9] transition"
              >
                Mentions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
