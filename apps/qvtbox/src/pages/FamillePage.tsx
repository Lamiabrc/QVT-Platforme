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
            <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
                  Sphere Famille
                </p>
                <h1 className="text-3xl md:text-5xl font-semibold mt-4">
                  Un accompagnement doux pour le quotidien.
                </h1>
                <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-2xl">
                  Abonnement en ligne, sous-comptes enfants, espace famille et
                  invitations privees pour les proches.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={QVTBOX_ROUTES.familleCreate}
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Creer un compte Famille
                  </Link>
                  <Link
                    to={QVTBOX_ROUTES.familleInvite}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Inviter un proche
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/50 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="qvt-golden-wrap relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/ado.png"
                    alt="Famille accompagnee par ZENA"
                    className="qvt-golden-image h-[360px] w-full object-cover md:h-[420px]"
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
                title: "Abonnement en ligne",
                text: "Une formule simple pour demarrer rapidement.",
              },
              {
                title: "Sous-comptes enfants",
                text: "Un espace securise pour chaque membre de la famille.",
              },
              {
                title: "Espace amis",
                text: "Des invitations privees pour les proches de confiance.",
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
              <div className="qvt-golden-wrap relative overflow-hidden rounded-[28px] border border-white/70 shadow-[0_20px_50px_rgba(27,26,24,0.16)]">
                <img
                  src="/luciole.png"
                  alt="Bulle de soin et soutien"
                  className="qvt-golden-image h-[320px] w-full object-cover md:h-[380px]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Une sphere douce et protegee
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Un espace pour parler, planifier et proteger.
              </h2>
              <p className="text-sm text-[#6F6454]">
                ZENA accompagne les ados et leurs guardians avec des suggestions
                concretes, un planning partage et des alertes transmises a la
                tutelle.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
