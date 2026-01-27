// src/pages/FamilleCreatePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { QVTBOX_ROUTES } from "@qvt/shared";

export default function FamilleCreatePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
            Sphère Famille
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mt-4">
            Créer un compte Famille
          </h1>
          <p className="text-sm text-[#6F6454] mt-3">
            MVP : démarrez un essai sans paiement pour configurer votre espace.
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
              placeholder="Email"
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Démarrer mon essai
            </button>
          </form>

          <div className="mt-6 text-sm text-[#6F6454]">
            Vous avez déjà un compte ?{" "}
            <Link to={QVTBOX_ROUTES.famille} className="underline">
              Retour à l’offre Famille
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
