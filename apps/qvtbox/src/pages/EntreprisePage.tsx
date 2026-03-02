import { Activity, BarChart3, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function EntreprisePage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-[#CFECE8]/35 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[#F3E0B9]/35 blur-3xl" />

          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Parcours Entreprise</p>
              <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                Prévenir l’usure, renforcer l’engagement — sans surveillance.
              </h1>
              <p className="mt-4 max-w-3xl text-base text-[#6F6454] md:text-lg">
                Check-in simple, signaux faibles, recommandations. RH/QVT voit des tendances
                agrégées, pas des secrets individuels.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Demander une démo
                </a>
                <a
                  href="#comment-ca-marche"
                  className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
                >
                  Voir comment ça marche
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[30px] bg-gradient-to-br from-[#F3E0B9]/45 via-transparent to-[#CFECE8]/45 blur-2xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                <img
                  src="/equipe.png"
                  alt="Équipe entreprise QVT Box"
                  className="h-[360px] w-full object-cover md:h-[440px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="comment-ca-marche" className="border-y border-[#E8DCC8] bg-[#FDF9F0] py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
            {[
              {
                title: "Check-in ‘ça va ?’ en 30 secondes",
                icon: Activity,
                text: "Un geste rapide pour exprimer son état sans exposition publique.",
              },
              {
                title: "Bulles d’équipe de confiance",
                icon: ShieldCheck,
                text: "Des espaces d’expression protégés, avec partage cadré et utile.",
              },
              {
                title: "Dashboard RH agrégé et actionnable",
                icon: BarChart3,
                text: "Des tendances collectives exploitables sans accès aux confidences individuelles.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E0B9]/35 text-[#1B1A18]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-[#6F6454]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="demo" className="bg-[#FAF6EE] py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 lg:grid-cols-[1fr,0.95fr]">
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold md:text-3xl">Demander une démo</h2>
              <p className="mt-3 text-sm text-[#6F6454]">
                Décrivez votre contexte, nous revenons vers vous rapidement.
              </p>

              <form className="mt-8 grid gap-4" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email professionnel"
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Entreprise"
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                />
                <textarea
                  rows={4}
                  placeholder="Contexte ou besoin"
                  className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Envoyer ma demande
                </button>
              </form>

              <div className="mt-6">
                <Link to="/zena" className="text-sm text-[#6F6454] underline">
                  Découvrir ZÉNA
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-[#E8DCC8] bg-white shadow-[0_22px_50px_rgba(27,26,24,0.14)]">
              <img
                src="/saas-dashboard.jpg"
                alt="Dashboard RH QVT Box"
                className="h-full min-h-[380px] w-full object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
