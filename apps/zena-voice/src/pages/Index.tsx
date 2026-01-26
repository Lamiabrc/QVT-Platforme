import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaHeroUnified from "@/components/ZenaHeroUnified";

const cards = [
  {
    title: "Elle ecoute",
    text: "Capture vos nuances vocales et vos silences pour ressentir vos micro-emotions.",
  },
  {
    title: "Elle protege",
    text: "Analyse emotionnelle et contexte RAG pour repondre avec bienveillance et discretion.",
  },
  {
    title: "Elle eclaire",
    text: "Recommandations concretes, ressources RH, et suivi QVT - sans friction.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0806] via-[#1b140f] to-[#2d231c] text-[#f7ede0] flex flex-col">
      <Navigation />

      <main className="flex-1 relative">
        <ZenaHeroUnified />

        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-8 pt-3 md:px-5 md:pb-10 md:pt-5 lg:pt-8">
          <motion.h2
            className="text-center text-xl md:text-2xl font-semibold text-[#f4e6d3] mb-4 md:mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Comment elle agit
          </motion.h2>
          <div className="grid gap-2.5 md:gap-4 md:grid-cols-3 bg-[radial-gradient(circle_at_50%_0%,rgba(255,234,200,0.08),transparent_65%)] p-3 md:p-4 rounded-2xl border border-white/5">
            {cards.map((card, idx) => (
              <motion.article
                key={card.title}
                className="rounded-2xl bg-[#120d0a]/72 border border-white/15 backdrop-blur-md p-3 md:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * idx }}
              >
                <h3 className="text-base md:text-lg font-semibold text-[#f7e1b8] drop-shadow-sm mb-1.5">{card.title}</h3>
                <p className="text-[13px] md:text-sm text-[#e4d4be] leading-relaxed">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
