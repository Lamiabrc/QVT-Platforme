// src/pages/EntreprisePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QVTBOX_ROUTES } from "@qvt/shared";

export default function EntreprisePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden bg-[#FAF6EE]">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
              Sphère Entreprise
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold mt-4">
              Une approche structurée pour écouter, comprendre et agir.
            </h1>
            <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
              QVT Box accompagne les organisations avec une démo, un devis clair
              et un espace interne pro sécurisé par code entreprise.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Demander une démo
              </a>
              <Link
                to={QVTBOX_ROUTES.entrepriseJoin}
                className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
              >
                J’ai un code entreprise
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Démo & devis",
                text: "Un cadrage rapide pour valider les besoins et la confidentialité.",
              },
              {
                title: "Code entreprise",
                text: "Un accès sécurisé pour vos équipes, sans mélange des univers.",
              },
              {
                title: "Espace interne",
                text: "Un pilotage QVT/QVCT avec des alertes respectueuses des règles.",
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

        <section id="demo" className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Demander une démo / devis
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
