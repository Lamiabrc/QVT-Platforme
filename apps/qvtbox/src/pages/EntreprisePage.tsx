import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL } from "@qvt/shared";

export default function EntreprisePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#F3E0B9]/35 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
            <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                  Parcours Entreprise
                </p>
                <h1 className="text-3xl md:text-5xl font-semibold mt-4 leading-tight">
                  Prévenir l&rsquo;usure, renforcer l&rsquo;engagement — sans surveillance.
                </h1>
                <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
                  Check-in simple, signaux faibles, recommandations. RH/QVT voit des
                  tendances agrégées, pas des secrets individuels.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Demander une démo
                  </a>
                  <a
                    href="#comment-ca-marche"
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Voir comment ça marche
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/50 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/equipe.png"
                    alt="Prévention QVT en entreprise"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="comment-ca-marche" className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Check-in ‘ça va ?’ en 30 secondes",
                text: "Chaque collaborateur peut exprimer son état sans exposition publique.",
              },
              {
                title: "Bulles d’équipe de confiance",
                text: "Des espaces d’expression protégés, avec partage cadré et utile.",
              },
              {
                title: "Dashboard RH agrégé et actionnable",
                text: "Des tendances collectives pour décider, sans accès aux confidences individuelles.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-[#6F6454] mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="demo" className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Demander une démo</h2>
            <p className="text-sm text-[#6F6454] mt-3">
              Dites-nous votre contexte. Nous revenons vers vous rapidement.
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
                placeholder="Contexte ou besoin"
                rows={4}
                className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Envoyer ma demande
              </button>
            </form>
            <p className="text-xs text-[#9C8D77] mt-4">
              Ou contactez-nous directement : {CONTACT_EMAIL}
            </p>
            <div className="mt-6">
              <Link to="/zena" className="text-sm underline text-[#6F6454]">
                Découvrir ZÉNA
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
