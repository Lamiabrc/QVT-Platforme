import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type FamilyTheme = "urbain" | "pastel" | "night" | "nature";

const themeClasses: Record<FamilyTheme, string> = {
  urbain: "from-[#FAF6EE] via-[#F6F0E4] to-[#EFE6D7]",
  pastel: "from-[#FFF6F2] via-[#FAF6EE] to-[#F6F3FF]",
  night: "from-[#2A272E] via-[#352F3D] to-[#241F2C]",
  nature: "from-[#F4F7EF] via-[#FAF6EE] to-[#EAF3E7]",
};

export default function FamillePage() {
  const { isAuthenticated } = useAuth();
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
          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-16">
            <div className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] items-center">
              <div>
                <p className={`text-xs uppercase tracking-[0.28em] ${mutedText}`}>
                  Parcours Famille
                </p>
                <h1 className="text-3xl md:text-5xl font-semibold mt-4 leading-tight">
                  Aider un ado à parler… sans le forcer.
                </h1>
                <p className={`text-base md:text-lg mt-4 max-w-2xl ${mutedText}`}>
                  Un espace sécurisé pour les ados, des bulles famille/amis, et des
                  alertes en cas de détresse ou harcèlement.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/famille/creer"
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Créer ma bulle famille
                  </Link>
                  <Link
                    to="/zena"
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-6 py-3 text-sm font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition"
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
                    alt="Bulle famille QVT Box"
                    className="h-[360px] w-full object-cover md:h-[420px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FDF9F0] border-y border-[#E8DCC8]">
          <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Expression libre et respectueuse",
                text: "L’ado peut dire ce qu’il ressent dans un espace protégé et sans jugement.",
              },
              {
                title: "Adulte référent + partage choisi",
                text: "Parents et tuteurs voient l’essentiel selon des règles claires définies à l’avance.",
              },
              {
                title: "Urgence / signalement",
                text: "En cas de détresse, le système peut déclencher un signalement cadré et immédiat.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-[#1B1A18]">{item.title}</h2>
                <p className="text-sm text-[#6F6454] mt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#FAF6EE]">
          <div className="mx-auto max-w-6xl px-6 grid gap-4 md:grid-cols-3">
            <Link
              to="/famille/rejoindre"
              className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm text-sm font-semibold text-[#1B1A18]"
            >
              Rejoindre une bulle famille
            </Link>
            <Link
              to="/famille/inviter"
              className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm text-sm font-semibold text-[#1B1A18]"
            >
              Inviter un proche
            </Link>
            <Link
              to={isAuthenticated ? "/famille/dashboard" : "/auth/login"}
              className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm text-sm font-semibold text-[#1B1A18]"
            >
              {isAuthenticated ? "Accéder à mon dashboard" : "Se connecter à mon compte"}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
