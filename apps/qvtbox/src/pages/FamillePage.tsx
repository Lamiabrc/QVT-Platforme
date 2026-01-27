// src/pages/FamillePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";

export default function FamillePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden bg-[#FAF6EE]">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
              Sphère Famille
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold mt-4">
              Un accompagnement doux pour le quotidien.
            </h1>
            <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
              Abonnement en ligne, sous-comptes enfants, espace famille et
              invitations privées pour les proches.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={QVTBOX_ROUTES.familleCreate}
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Créer un compte Famille
              </Link>
              <Link
                to={QVTBOX_ROUTES.familleInvite}
                className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
              >
                Inviter un proche
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Abonnement en ligne",
                text: "Une formule simple pour démarrer rapidement.",
              },
              {
                title: "Sous-comptes enfants",
                text: "Un espace sécurisé pour chaque membre de la famille.",
              },
              {
                title: "Espace amis",
                text: "Des invitations privées pour les proches de confiance.",
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
      </main>

      <Footer />
    </div>
  );
}
