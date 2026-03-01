// src/pages/ZenaFamilyPage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, HeartHandshake, Smile, Home, Sparkles } from "lucide-react";

const ZenaFamilyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#F2F7F6] via-[#FFF3EA] to-[#FFF9F4] text-[#212121]">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-28 pb-16 px-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70 mb-3">
              Zéna · Univers famille & ado
            </p>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-[#5B4B8A] via-[#4FD1C5] to-[#5B4B8A] text-transparent bg-clip-text">
              Zéna Family, une bulle pour parler vraiment
            </h1>

            <p className="text-sm md:text-base text-[#212121]/75 max-w-3xl mb-6 leading-relaxed">
              Zéna Family est un espace sécurisé pour les ados, les parents, les grands-parents et
              les adultes de confiance. On y parle émotions, fatigue, conflits, joie, pression scolaire,
              sans jugement et avec des mots simples.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                💬 Question centrale : “Ça va vraiment ?”
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                🧡 Espaces parent & ado séparés mais reliés
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-[#212121]/80">
                🎁 Box parent / ado pour créer des moments
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="https://zena-family.qvtbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] px-8 py-3 text-sm font-medium text-white shadow-lg hover:scale-[1.03] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Accéder à Zéna Family
                <ArrowRight className="w-4 h-4" />
              </a>

            <p className="text-xs text-[#212121]/60">
                Idéal pour les parents salariés, les ados en plein questionnement et les familles
                qui veulent recréer du lien sans théâtraliser les émotions.
              </p>
            </div>
          </div>
        </section>

        {/* BLOC FAMILLE */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Smile className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Donner des mots aux ados</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                Zéna aide les ados à exprimer ce qu’ils ressentent vraiment, sans pression de
                performance et sans avoir à “faire semblant que tout va bien”.
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <HeartHandshake className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Soutenir les parents</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                Les parents ont leur propre espace pour suivre l’ambiance générale, recevoir des
                pistes de dialogue et se sentir moins seuls dans la tempête.
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-primary/10 p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold mb-2">Créer des moments qui comptent</h2>
              <p className="text-xs text-[#212121]/70 leading-relaxed">
                En lien avec QVT Box, Zéna Family peut déclencher des idées d’activités, des box
                parent/ado ou des petites routines pour apaiser le quotidien.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ZenaFamilyPage;
