// src/pages/EngagementsPage.tsx
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, ShieldCheck, Lock, HeartHandshake, Users } from "lucide-react";

export default function EngagementsPage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        {/* HERO VISUEL AVEC IMAGE */}
        <section className="pt-32 pb-20 px-8 md:px-16 bg-[#FAF6EE]">
          <div className="max-w-6xl mx-auto">
            
            {/* IMAGE HERO CORRECTEMENT LIÉE */}
            <div className="w-full rounded-3xl overflow-hidden shadow-sm mb-10">
              <img
                src="/engagements-hero.jpg"
                alt="Technologie bienveillante"
                className="w-full h-[420px] md:h-[500px] object-cover object-center"
              />
            </div>

            <p className="uppercase tracking-[0.18em] text-[11px] text-[#9C8D77] mb-4">
              QVT Box · Notre engagement
            </p>

            <h1 className="text-3xl md:text-4xl font-light leading-tight mb-5">
              Nous construisons une technologie
              <br />
              qui prend soin des gens.
            </h1>

            <p className="text-sm md:text-base text-[#6F6454] max-w-2xl">
              Beaucoup d’outils mesurent, tracent, analysent.
              QVT Box choisit une autre voie : écouter, protéger, apaiser.
              Les émotions ne sont pas des données à exploiter.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B1A18] text-[#FAF6EE] text-sm font-medium hover:bg-[#2A2722] transition"
              >
                Parler de vos enjeux QVT
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/simulateur"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4C7B3] text-sm text-[#4A4134] hover:bg-white/40 transition"
              >
                Tester « Ma bulle attentionnée »
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION TEXTE STYLE SANDBAR */}
        <section className="py-28 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <p className="max-w-3xl mx-auto px-8 md:px-16 text-center text-lg md:text-xl text-[#4A4134] leading-relaxed">
            La technologie peut fatiguer.
            <br />
            Elle peut aussi réparer.
            <br />
            Tout dépend de ce qu’on en fait.
          </p>
        </section>

        {/* BLOC ENGAGEMENTS AVEC IMAGES */}
        <section className="py-24 px-8 md:px-16 bg-[#FAF6EE]">
          <div className="max-w-5xl mx-auto mb-14">
            <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
              Une boussole éthique
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              Nos engagements guident chaque choix.
            </h2>
            <p className="text-sm md:text-base text-[#6F6454] max-w-2xl">
              Si cela n’aide pas vraiment les personnes, on ne le fait pas.
            </p>
          </div>

          <div className="grid gap-14 md:grid-cols-2">

            {/* 1 — Technologie éthique */}
            <div>
              <img
                src="/engagements-social-thread.jpg"
                alt="Technologie éthique"
                className="rounded-3xl w-full h-64 object-cover border border-[#E8DCC8] mb-5"
              />

              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-[#9C8D77]" />
                <h3 className="text-lg font-medium">Technologie éthique</h3>
              </div>

              <p className="text-sm text-[#6F6454] leading-relaxed">
                ZÉNA ne classe pas et ne juge pas les émotions.
                Elle éclaire ce qui fissure, avec douceur.
              </p>
            </div>

            {/* 2 — Protection des données */}
            <div>
              <img
                src="/engagements-data-bubble.jpg"
                alt="Protection des données"
                className="rounded-3xl w-full h-64 object-cover border border-[#E8DCC8] mb-5"
              />

              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-[#9C8D77]" />
                <h3 className="text-lg font-medium">Protection des données</h3>
              </div>

              <p className="text-sm text-[#6F6454] leading-relaxed">
                Vos émotions restent à vous.
                Données minimisées, protégées, jamais revendues.
              </p>
            </div>

            {/* 3 — Gratuité isolés */}
            <div>
              <img
                src="/engagements-isolation-support.jpg"
                alt="Soutien isolement"
                className="rounded-3xl w-full h-64 object-cover border border-[#E8DCC8] mb-5"
              />

              <div className="flex items-center gap-3 mb-3">
                <HeartHandshake className="w-5 h-5 text-[#9C8D77]" />
                <h3 className="text-lg font-medium">
                  Un accès gratuit pour ceux qui sont seuls
                </h3>
              </div>

              <p className="text-sm text-[#6F6454] leading-relaxed">
                L’écoute émotionnelle ne doit pas être un privilège.
                QVT Box aide ceux que personne ne voit.
              </p>
            </div>

            {/* 4 — Impact social */}
            <div>
              <img
                src="/engagements-social-thread.jpg"
                alt="Impact social"
                className="rounded-3xl w-full h-64 object-cover border border-[#E8DCC8] mb-5"
              />

              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-[#9C8D77]" />
                <h3 className="text-lg font-medium">Réparer les fractures du quotidien</h3>
              </div>

              <p className="text-sm text-[#6F6454] leading-relaxed">
                Salariés, ados, parents, retraités :
                QVT Box sert d’abord ceux qui tiennent tout ensemble en silence.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL AVEC IMAGE SOMBRE */}
        <section className="py-32 bg-[#151515] text-[#FDF9F0] text-center relative">
          <img
            src="/engagements-dark-halo.jpg"
            alt="Halo espoir"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />

          <div className="relative z-10 max-w-3xl mx-auto px-8 md:px-16">
            <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
              Une technologie qui prend soin
            </p>

            <h2 className="text-2xl md:text-3xl font-light mb-6">
              Nous ne surveillons pas les gens.<br />
              Nous les aidons à mieux respirer.
            </h2>

            <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
              Une approche humaine, juste, et utile.  
              Si c’est ce que vous cherchez, travaillons ensemble.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F3E0B9] text-[#151515] hover:bg-[#F7E7C5] transition"
              >
                Échanger sur vos enjeux
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/saas"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
              >
                Voir la solution entreprise
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
