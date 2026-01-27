// src/pages/EntrepriseJoinPage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";

export default function EntrepriseJoinPage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Sphère Entreprise
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Rejoindre avec un code entreprise
          </h1>
          <p className="text-sm text-[#6F6454] mt-3">
            Entrez le code fourni par votre organisation pour accéder à votre
            espace interne sécurisé.
          </p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="text"
              placeholder="Code entreprise"
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Accéder à mon espace
            </button>
          </form>

          <div className="mt-6 text-sm text-[#6F6454]">
            Pas de code ?{" "}
            <Link to={QVTBOX_ROUTES.entreprise} className="underline">
              Demander une démo
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
