import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function SecuritePage() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main>
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-20 left-0 h-64 w-64 rounded-full bg-[#CFECE8]/35 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Sécurité</p>
            <h1 className="text-3xl md:text-5xl font-semibold mt-4">
              Sécurité et confidentialité, en clair.
            </h1>
            <p className="text-base md:text-lg text-[#6F6454] mt-4">
              Pas de jargon. Des règles simples pour protéger la parole et agir
              quand il le faut.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Partage choisi</h2>
                <p className="text-sm text-[#6F6454] mt-2">
                  privé / adulte référent / bulle
                </p>
              </div>
              <div className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Confidentialité par défaut</h2>
              </div>
              <div className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Mineurs : adulte référent + règles</h2>
              </div>
              <div className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Signalement & urgence</h2>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
