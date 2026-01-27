// src/pages/EntreprisePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QVTBOX_ROUTES } from "@qvt/shared";
import valuesBuildingTogether from "@/assets/values-building-together.jpg";
import valuesConcreteImpact from "@/assets/values-concrete-impact.jpg";

export default function EntreprisePage() {
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
                  Sphere Entreprise
                </p>
                <h1 className="text-3xl md:text-5xl font-semibold mt-4">
                  Une approche structuree pour ecouter, comprendre et agir.
                </h1>
                <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
                  QVT Box accompagne les organisations avec une demo, un devis clair
                  et un espace interne pro securise par code entreprise.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Demander une demo
                  </a>
                  <Link
                    to={QVTBOX_ROUTES.entrepriseJoin}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    J'ai un code entreprise
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/50 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src={valuesConcreteImpact}
                    alt="Impact concret pour les organisations"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Demo & devis",
                text: "Un cadrage rapide pour valider les besoins et la confidentialite.",
              },
              {
                title: "Code entreprise",
                text: "Un acces securise pour vos equipes, sans melange des univers.",
              },
              {
                title: "Espace interne",
                text: "Un pilotage QVT/QVCT avec des alertes respectueuses des regles.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-[#6F6454] mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-[0.9fr,1.1fr] items-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-[#E7D4F1]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(27,26,24,0.16)]">
                <img
                  src={valuesBuildingTogether}
                  alt="Equipe professionnelle en atelier"
                  className="h-[320px] w-full object-cover md:h-[380px]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Une sphere interne securisee
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Un espace pro pour ecouter et agir sans surexposition.
              </h2>
              <p className="text-sm text-[#6F6454]">
                Vos equipes accedent a ZENA via un code entreprise. Les alertes
                RH/QVT restent controlees et les donnees sont isolees des autres
                spheres.
              </p>
            </div>
          </div>
        </section>

        <section id="demo" className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Demander une demo / devis
            </h2>
            <p className="text-sm text-[#6F6454] mt-3">
              Laissez-nous vos informations. Nous revenons vers vous rapidement.
            </p>

            <form
              className="mt-8 grid gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="text"
                placeholder="Nom et prenom"
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
