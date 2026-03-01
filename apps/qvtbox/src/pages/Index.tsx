import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main className="overflow-hidden">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#F3E0B9]/45 blur-3xl" />
          <div className="absolute top-24 -left-20 h-72 w-72 rounded-full bg-[#CFECE8]/45 blur-3xl" />
          <div className="absolute bottom-8 right-10 h-56 w-56 rounded-full bg-[#E7D4F1]/45 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div className="space-y-6 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#9C8D77]">
                  QVT Box
                </p>

                <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-[#1B1A18]">
                  Des bulles de confiance pour dire &lsquo;ça va vraiment ?&rsquo;
                </h1>

                <p className="text-base md:text-lg leading-relaxed text-[#6F6454] max-w-2xl">
                  Salariés, parents, ados : un espace sécurisé pour s&rsquo;exprimer,
                  être guidé par ZÉNA, et agir. Partage choisi. Confidentialité par défaut.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/entreprise"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(27,26,24,0.2)] hover:opacity-90 transition"
                  >
                    Je suis une entreprise
                  </Link>
                  <Link
                    to="/famille"
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white/70 px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
                  >
                    Je suis une famille
                  </Link>
                </div>

                <p className="text-xs text-[#9C8D77]">
                  Vous contrôlez ce qui est partagé, avec qui, et quand.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/60 via-transparent to-[#E7D4F1]/45 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/hero-cicatrices-lumiere.jpg"
                    alt="Bulles de confiance QVT Box"
                    className="h-[380px] w-full object-cover md:h-[460px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#E8DCC8] bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#1B1A18]">Parcours Entreprise</p>
                <p className="text-sm text-[#6F6454] mt-2">
                  Prévenir l&rsquo;usure, repérer les signaux faibles et agir avec une
                  vision agrégée utile aux RH/QVT.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E8DCC8] bg-white/70 p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#1B1A18]">Parcours Famille</p>
                <p className="text-sm text-[#6F6454] mt-2">
                  Aider un ado à parler, organiser la bulle famille et déclencher une
                  alerte en cas de détresse.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
