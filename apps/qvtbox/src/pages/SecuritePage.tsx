import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SecuritePage() {
  const points = [
    "Privé par défaut",
    "Partage choisi (Privé / Référent / Bulle)",
    "Mineurs: protections renforcées + adulte référent obligatoire",
    "Urgence + signalement",
    "RH: agrégé uniquement",
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-[#CFECE8]/35 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Sécurité</p>
            <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Sécurité et confidentialité, en clair.</h1>
            <p className="mt-4 text-base text-[#6F6454] md:text-lg">
              Pas de jargon. Des règles simples pour protéger la parole et agir quand il le faut.
            </p>

            <div className="mt-10 grid gap-4">
              {points.map((point) => (
                <article
                  key={point}
                  className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm"
                >
                  <h2 className="text-lg font-semibold">{point}</h2>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
