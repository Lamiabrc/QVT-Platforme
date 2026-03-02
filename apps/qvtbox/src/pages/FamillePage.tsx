import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type FamilyTheme = "urbain" | "pastel" | "night" | "nature";

const themeClasses: Record<FamilyTheme, string> = {
  urbain: "from-[#FAF6EE] via-[#F6F0E4] to-[#EFE6D7]",
  pastel: "from-[#FFF6F2] via-[#FAF6EE] to-[#F6F3FF]",
  night: "from-[#2A272E] via-[#352F3D] to-[#241F2C]",
  nature: "from-[#F4F7EF] via-[#FAF6EE] to-[#EAF3E7]",
};

export default function FamillePage() {
  const [theme, setTheme] = useState<FamilyTheme>("pastel");

  const rootClasses = useMemo(() => {
    if (theme === "night") {
      return "bg-[#2A272E] text-[#F8F2E8]";
    }
    return "bg-[#FAF6EE] text-[#1B1A18]";
  }, [theme]);

  const mutedText = theme === "night" ? "text-[#D8CCB7]" : "text-[#6F6454]";

  return (
    <div className={`${rootClasses} min-h-screen`}>
      <Navigation />

      <main>
        <section className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${themeClasses[theme]}`} />
          <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#F3E0B9]/30 blur-3xl" />
          <div className="absolute bottom-8 left-1/4 h-40 w-40 rounded-full bg-[#CFECE8]/35 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-32 md:pt-40">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
              <div>
                <p className={`text-xs uppercase tracking-[0.28em] ${mutedText}`}>Vie perso</p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
                  Un espace de confiance pour la vie perso.
                </h1>
                <p className={`mt-4 max-w-2xl text-base md:text-lg ${mutedText}`}>
                  Bulles famille & proches : parler vrai, se soutenir, et agir.
                  <br />
                  Si un mineur est concerné : adulte référent, règles claires, urgence et
                  signalement.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/famille/creer"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] px-6 py-3 text-sm font-semibold text-[#FAF6EE] transition hover:opacity-90"
                  >
                    Créer ma bulle
                  </Link>
                  <Link
                    to="/zena"
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] transition hover:border-[#1B1A18]/40"
                  >
                    Découvrir ZÉNA
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className={mutedText}>Ambiance :</span>
                  {(["urbain", "pastel", "night", "nature"] as FamilyTheme[]).map((entry) => (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => setTheme(entry)}
                      className={`rounded-full border px-3 py-1 uppercase tracking-[0.16em] ${
                        theme === entry
                          ? "border-[#1B1A18] bg-[#1B1A18] text-[#FAF6EE]"
                          : "border-[#1B1A18]/20 bg-white text-[#1B1A18]"
                      }`}
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#F3E0B9]/40 via-transparent to-[#CFECE8]/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(27,26,24,0.18)]">
                  <img
                    src="/famille-still.jpg"
                    alt="Bulles de confiance QVT Box"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
