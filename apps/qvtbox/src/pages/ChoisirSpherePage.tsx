// src/pages/ChoisirSpherePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";

export default function ChoisirSpherePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Choisir ma sphere
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Choisissez votre univers de depart.
          </h1>
          <p className="text-sm text-[#6F6454] mt-3">
            Les deux mondes sont isoles. Vous pourrez basculer plus tard si vous
            avez un double usage.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Link
              to={QVTBOX_ROUTES.entreprise}
              className="group rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#E8DCC8]">
                <img
                  src="/equipe.png"
                  alt="Espace entreprise"
                  className="h-40 w-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Entreprise
              </p>
              <h2 className="text-lg font-semibold mt-2">
                Organisation, RH, QVT/QVCT
              </h2>
              <p className="text-sm text-[#6F6454] mt-2">
                Demo, code entreprise, espace interne.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#9C8D77]">
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Demo / devis
                </span>
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Espace interne
                </span>
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Alertes RH/QVT
                </span>
              </div>
            </Link>

            <Link
              to={QVTBOX_ROUTES.famille}
              className="group rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#E8DCC8]">
                <img
                  src="/ado.png"
                  alt="Espace famille"
                  className="h-40 w-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[#9C8D77]">
                Famille
              </p>
              <h2 className="text-lg font-semibold mt-2">
                Adolescents, parents, tuteurs
              </h2>
              <p className="text-sm text-[#6F6454] mt-2">
                Abonnement en ligne, sous-comptes et espace amis invite-only.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#9C8D77]">
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Espace Famille
                </span>
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Espace Amis
                </span>
                <span className="rounded-full border border-[#E8DCC8] px-3 py-1">
                  Alertes detresse
                </span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
