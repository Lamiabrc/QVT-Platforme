// src/pages/ZenaEntreprisePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Brain, ShieldCheck, Users, Sparkles } from "lucide-react";

export default function ZenaEntreprisePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3EFE7] text-[#2E2E2E]">
      <Navigation />

      <main className="flex-1 relative">
        {/* HALO DE FOND */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#C9E8F0]/40 via-[#E9DFFA]/40 to-transparent blur-2xl" />

        {/* HERO */}
        <section className="pt-28 pb-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#00A5A8]/70 mb-3 font-semibold">
              IA émotionnelle • Univers entreprise
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5B4B8A] via-[#00A5A8] to-[#5B4B8A]">
              Zéna : l’IA émotionnelle qui écoute vos équipes
            </h1>

            <p className="text-base md:text-lg text-[#3A3A3A]/80 max-w-3xl mb-8 leading-relaxed">
              Zéna crée un espace d’écoute continue pour les collaborateurs : check-ins
              vocaux, signaux faibles, météo émotionnelle, alertes anonymisées et
              insights pour les RH et les managers. Une écoute douce, quotidienne, sans
              jamais trahir la confiance.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                "🎧 Check-ins vocaux / écrits quotidiens",
                "🧠 Détection des signaux faibles",
                "📊 Météo émotionnelle anonymisée",
                "🔒 Respect RGPD et seuils minimum",
              ].map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-white/60 backdrop-blur border border-[#00A5A8]/20 text-[#2E2E2E]/80"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://zena.qvtbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5B4B8A] to-[#00A5A8] rounded-full text-white text-sm font-medium shadow-lg hover:scale-[1.03] transition-transform"
              >
                <Sparkles className="w-4 h-4" />
                Accéder à Zéna Entreprise
                <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-xs text-[#5A5A5A]/70 max-w-xs">
                Vous souhaitez un pilote Zéna + QVT Box dans votre organisation ? Nous
                vous accompagnons.
              </p>
            </div>
          </div>
        </section>

        {/* PILIERS */}
        <section className="pb-24 px-6">
          <div className="container mx-auto max-w-5xl grid gap-8 md:grid-cols-3">
            {/* Comprendre */}
            <div className="bg-white/70 backdrop-blur-xl border border-[#00A5A8]/10 shadow-lg rounded-3xl p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#00A5A8]/10 mb-3">
                <Brain className="w-5 h-5 text-[#00A5A8]" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Comprendre les émotions</h2>
              <p className="text-sm text-[#3A3A3A]/70 leading-relaxed">
                Check-ins réguliers, émotions contextualisées, perception des équipes :
                Zéna crée une météo émotionnelle vivante, au plus près du terrain.
              </p>
            </div>

            {/* Prévenir */}
            <div className="bg-white/70 backdrop-blur-xl border border-[#00A5A8]/10 shadow-lg rounded-3xl p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#00A5A8]/10 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#00A5A8]" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Prévenir plutôt que réparer</h2>
              <p className="text-sm text-[#3A3A3A]/70 leading-relaxed">
                Détection précoce des signaux faibles : surcharge, tensions, baisse
                d’énergie… Zéna aide à agir avant que les situations ne deviennent des
                crises.
              </p>
            </div>

            {/* Donner une voix */}
            <div className="bg-white/70 backdrop-blur-xl border border-[#00A5A8]/10 shadow-lg rounded-3xl p-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#00A5A8]/10 mb-3">
                <Users className="w-5 h-5 text-[#00A5A8]" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Donner une vraie voix aux équipes</h2>
              <p className="text-sm text-[#3A3A3A]/70 leading-relaxed">
                Zéna n’analyse pas pour juger : elle crée un espace d’expression
                confidentiel, protégé, où chaque collaborateur peut dire « ça ne va pas »
                sans crainte.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
