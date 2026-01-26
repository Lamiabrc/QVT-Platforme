// src/pages/Index.tsx
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import boucheVideo from "@/assets/bouche.mp4";
import { ArrowRight, Mic } from "lucide-react";
import { ZENA_FAMILY_URL, ZENA_VOICE_URL } from "@qvt/shared";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      {/* NAVIGATION TRANSLUCIDE */}
      <Navigation />

      <main>
        {/* HERO IMMERSIF FULLSCREEN — STYLE SANDBAR */}
        <section className="relative h-screen w-full overflow-hidden">
          {/* IMAGE PLEIN ÉCRAN */}
          <img
            src="/hero-cicatrices-lumiere.jpg"
            alt="Lumière dans les cicatrices"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* VOILE TEINTE SABLE (pas noir) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F2E6]/40 via-[#F7F2E6]/10 to-transparent pointer-events-none" />

          {/* TEXTE BOTTOM-LEFT */}
          <div className="relative z-10 h-full flex items-end">
            <div className="px-8 md:px-16 pb-20 max-w-2xl">
              <p className="uppercase tracking-[0.18em] text-[11px] text-[#EDE3D0]/80 mb-4">
                QVT Box · Écouter le quotidien
              </p>

              <h1 className="text-4xl md:text-6xl font-light text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                Le quotidien laisse des traces.
                <br />
                <span className="text-[#F3E0B9]">
                  L'écoute et le réconfort les effacent.
                </span>
              </h1>

              <div className="flex gap-3 mt-8">
                <Link
                  to="/saas"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F3E0B9]/95 text-[#151515] text-sm font-medium hover:bg-[#F8E8C9] transition"
                >
                  Découvrir QVT Box en entreprise
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={ZENA_VOICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 border border-white/30 text-white text-sm hover:bg-white/30 backdrop-blur-sm transition"
                >
                  <Mic className="w-4 h-4" />
                  Parler à ZÉNA
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SCÈNE 2 — VIDÉO IMMERSIVE */}
        <section className="py-24 px-8 md:px-16 bg-[#FAF6EE]">
          <div className="max-w-4xl mx-auto mb-12">
            <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
              La voix qui capte les micro-cicatrices
            </p>

            <h2 className="text-2xl md:text-3xl font-light text-[#1B1A18] mb-4">
              Écouter ce qui ne se dit pas tout haut.
            </h2>

            <p className="max-w-xl text-sm md:text-base text-[#6F6454]">
              ZÉNA, l’IA émotionnelle, entend les nuances : hésitations,
              micro-tensions, silences. Pas pour contrôler. Pour comprendre, aider et soutenir.
            </p>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden border border-[#E2D6C3] shadow-sm">
            <div className="aspect-[16/9] w-full">
              <video
                src={boucheVideo}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </section>

        {/* SCÈNE 3 — TEXTE BRISÉ, STYLE SANDBAR */}
        <section className="py-32 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <p className="max-w-3xl mx-auto px-8 md:px-16 text-center text-lg md:text-xl text-[#4A4134] leading-relaxed">
            Le quotidien va vite.  
            <br className="hidden md:block" />
            Les émotions, moins.
            <br />
            QVT Box crée une lumière dans la fissure.
          </p>
        </section>

        {/* SCÈNE 4 — ÉCOUTER · VOIR · AGIR */}
        <section className="py-28 px-8 md:px-16 bg-[#FAF6EE]">
          <div className="max-w-5xl mx-auto mb-14">
            <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
              Écouter · Comprendre · Agir
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              Une seule plateforme.  
              Trois façons de protéger.
            </h2>
          </div>

          <div className="space-y-24">
            {/* ZÉNA */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl font-light mb-3">Écouter avec ZÉNA</h3>
                <p className="text-[#6F6454] max-w-md">
                  Une IA émotionnelle qui écoute sans jamais juger.  
                  Elle capte ce que les outils classiques ne veulent pas voir.
                </p>

                <a
                  href={ZENA_VOICE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[#1B1A18] hover:underline"
                >
                  Découvrir ZÉNA Voice
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <img
                src="/zena-still.jpg"
                alt="Zéna IA"
                className="w-full rounded-2xl object-cover shadow-sm"
              />
            </div>

            {/* SaaS */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <img
                src="/saas-dashboard.jpg"
                alt="Dashboard QVT Box"
                className="w-full rounded-2xl object-cover shadow-sm"
              />

              <div>
                <h3 className="text-xl font-light mb-3">
                  Voir avec le SaaS QVT Box
                </h3>
                <p className="text-[#6F6454] max-w-md">
                  DUERP, RPS, météo émotionnelle, signaux faibles.  
                  Une vision claire de ce qui tient… et de ce qui fissure.
                </p>

                <Link
                  to="/saas"
                  className="mt-4 inline-flex items-center gap-2 text-[#1B1A18] hover:underline"
                >
                  Explorer la licence SaaS
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Famille + Box */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-xl font-light mb-3">
                  Agir avec les box & la famille
                </h3>
                <p className="text-[#6F6454] max-w-md">
                  Une approche humaine : Le lien entre celui qui souffre et celui qui peut et doit l'aider.  
                  Des box utiles — jamais gadgets.
                </p>

                <div className="mt-4 space-y-1">
                  <Link
                    to="/box"
                    className="inline-flex items-center gap-2 text-[#1B1A18] hover:underline"
                  >
                    Voir les box QVT
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={ZENA_FAMILY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#4B5563] hover:underline"
                  >
                    Ouvrir ZÉNA Famille
                  </a>
                </div>
              </div>

              <img
                src="/famille-still.jpg"
                alt="Zena Family"
                className="w-full rounded-2xl object-cover shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-32 bg-[#151515] text-[#FDF9F0] text-center">
          <div className="max-w-3xl mx-auto px-8 md:px-16">
            <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
              Le coup de pouce QVT Box
            </p>

            <h2 className="text-2xl md:text-3xl font-light mb-6">
             Souvent, ils n’ont pas besoin d’un cadeau.
              <br />
              Ils ont besoin qu’on les entende.
            </h2>

            <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
              Parlez-nous de votre contexte.  
              On construit un dispositif discret, réaliste, qui respecte votre réalité.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F3E0B9] text-[#151515] hover:bg-[#F7E7C5] transition"
              >
                Prendre contact
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/simulateur"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
              >
                Tester « Ma bulle attentionnée »
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
