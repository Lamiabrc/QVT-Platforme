import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F4ECE0]" />
          <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-[#CFECE8]/50 blur-3xl" />
          <div className="absolute -right-16 top-28 h-80 w-80 rounded-full bg-[#F3E0B9]/55 blur-3xl" />
          <div className="absolute bottom-12 left-1/3 h-44 w-44 rounded-full bg-[#E2D7F8]/45 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E8DCC8] bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.18em] text-[#8A7D69]">
              <Sparkles className="h-3.5 w-3.5" />
              QVT Box
            </p>

            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">
              Le réseau social responsable.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-[#5F5345] md:text-lg">
              {"QVT Box réinvente le réseau social avec des bulles de confiance : tu choisis qui entre (proches, Luciole, ami·e, manager…).\nZÉNA t’aide à mettre des mots, et si tu le veux une Luciole peut t’accompagner.\nPrivé par défaut. Partage choisi. Sécurité d’abord."}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/entreprise"
                className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-full bg-[#1B1A18] px-7 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
              >
                Découvrir pour mon entreprise
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/famille"
                className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-full border border-[#1B1A18]/20 bg-white px-7 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
              >
                Découvrir pour ma vie perso
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-[#6F6454]">
              Pas de surveillance. Pas de jugement. Tu gardes le contrôle.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
