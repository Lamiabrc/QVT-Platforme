import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative min-h-[88vh] overflow-hidden">
          <img
            src="/hero-cicatrices-lumiere.jpg"
            alt="Bulle de confiance QVT Box"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/70 via-[#151515]/35 to-[#151515]/20" />
          <div className="absolute -left-12 top-24 h-72 w-72 rounded-full bg-[#CFECE8]/30 blur-3xl" />
          <div className="absolute -right-16 top-28 h-80 w-80 rounded-full bg-[#F3E0B9]/30 blur-3xl" />

          <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl items-end px-6 pb-20 pt-36">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#F3E0B9] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                QVT Box
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
                Le réseau social responsable.
              </h1>

              <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-relaxed text-[#F3EBDD] md:text-lg">
                QVT Box réinvente le réseau social avec des bulles de confiance : tu choisis qui
                entre (proches, Luciole, ami·e, manager…).
                {"\n"}
                ZÉNA t’aide à mettre des mots, et si tu le veux une Luciole peut t’accompagner.
                {"\n"}
                Privé par défaut. Partage choisi. Sécurité d’abord.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/entreprise"
                  className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-full bg-[#F3E0B9] px-7 py-3 text-sm font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
                >
                  Découvrir pour mon entreprise
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/famille"
                  className="inline-flex min-w-[250px] items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Découvrir pour ma vie perso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-4 text-sm text-[#F3EBDD]">
                Pas de surveillance. Pas de jugement. Tu gardes le contrôle.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FAF6EE] px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8B7D67]">ZÉNA intégrée</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                Le chat et la voix, sur le même site.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#665A4B] md:text-lg">
                Parlez à ZÉNA dans un cadre clair. La voix est en push-to-talk, jamais en écoute
                passive.{" "}
                <span className="text-[#665A4B]/90">ZÉNA n’est pas un dispositif médical.</span>
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/zena"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Découvrir ZÉNA
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/securite"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
                >
                  Voir la sécurité
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-[#E8DCC8] bg-white shadow-[0_24px_60px_rgba(27,26,24,0.16)]">
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/images/about-listen-daily.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151515]/50 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <PlayCircle className="h-4 w-4" />
                Parcours ZÉNA en direct
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#E8DCC8] bg-[#FDF9F0] px-6 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-[#E8DCC8] bg-white shadow-[0_24px_60px_rgba(27,26,24,0.12)]">
              <img
                src="/box-lineup-table.webp"
                alt="Selection de box QVT Box"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151515]/40 via-transparent to-transparent" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8B7D67]">Bubble Box</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                Une box quand ca compte.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#665A4B] md:text-lg">
                La box n'est pas automatique. Elle est proposee au bon moment, selon la tendance
                observee et les besoins reels de la personne ou de l'equipe.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/box"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                >
                  Decouvrir la Box
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/entreprise"
                  className="inline-flex items-center gap-2 rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
                >
                  Voir le parcours entreprise
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
