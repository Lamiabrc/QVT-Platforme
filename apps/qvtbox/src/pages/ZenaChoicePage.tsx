import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaChatPanel from "@/components/ZenaChatPanel";

type ZenaMode = "family" | "company";

export default function ZenaChoicePage() {
  const [mode, setMode] = useState<ZenaMode>("family");

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        <section className="relative overflow-hidden pt-32 pb-14 md:pt-40">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF6EE] to-[#F7F1E4]" />
          <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-[#CFECE8]/40 blur-3xl" />
          <div className="absolute top-16 right-0 h-72 w-72 rounded-full bg-[#F3E0B9]/40 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9C8D77]">ZÉNA</p>
            <h1 className="text-4xl md:text-5xl font-semibold mt-4">
              Parlez à ZÉNA.
            </h1>
            <p className="text-base md:text-lg text-[#6F6454] mt-4 max-w-3xl mx-auto">
              Décrivez ce que vous ressentez, ZÉNA vous aide à mettre des mots et
              propose une action concrète.
            </p>
            <p className="text-xs text-[#9C8D77] mt-4">
              Voice arrive ensuite, dans la même expérience.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-5 inline-flex rounded-full border border-[#E8DCC8] bg-white p-1">
              <button
                type="button"
                onClick={() => setMode("family")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "family" ? "bg-[#1B1A18] text-[#FAF6EE]" : "text-[#6F6454]"
                }`}
              >
                Famille
              </button>
              <button
                type="button"
                onClick={() => setMode("company")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "company" ? "bg-[#1B1A18] text-[#FAF6EE]" : "text-[#6F6454]"
                }`}
              >
                Entreprise
              </button>
            </div>

            <ZenaChatPanel
              sphere={mode}
              title={mode === "family" ? "Parler à ZÉNA en famille" : "Parler à ZÉNA en entreprise"}
              subtitle={
                mode === "family"
                  ? "ZÉNA accompagne l’expression ado/parent avec partage choisi."
                  : "ZÉNA aide à capter les signaux faibles et propose des actions simples."
              }
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
