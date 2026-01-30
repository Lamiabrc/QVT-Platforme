// src/pages/ZenaChoicePage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ZenaChoicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#151515] via-[#1D1B19] to-[#111010] text-[#F3E0B9]">
      <Navigation />

      <main className="flex-1 pt-28 pb-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Halo doux autour du titre */}
          <div className="relative inline-block">
            <div className="absolute -inset-10 bg-[#F3E0B9]/12 blur-2xl rounded-full" />
            <h1 className="relative text-4xl md:text-5xl font-bold tracking-tight">
              Choisissez votre univers Zéna
            </h1>
          </div>

          <p className="mt-4 text-lg text-[#E5D7BF]/80">
            La même voix attentionnée, adaptée à votre réalité : entreprise ou famille.
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              to="/zena-page"
              className="group w-full md:w-auto px-8 py-5 rounded-2xl border border-[#3A332D] bg-[#1D1B19] hover:bg-[#2A2520] text-lg font-semibold flex items-center justify-center gap-3 transition"
            >
              Zéna Entreprise
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/zena-family-page"
              className="group w-full md:w-auto px-8 py-5 rounded-2xl border border-[#3A332D] bg-[#1D1B19] hover:bg-[#2A2520] text-lg font-semibold flex items-center justify-center gap-3 transition"
            >
              Zéna Famille
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
