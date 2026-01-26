import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Factory,
  Building2,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Leaf,
  Boxes,
  Megaphone,
  CheckCircle, // ✅ ajouté pour corriger l’erreur
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/useLanguage";

import boxPremiumImage from "@/assets/box-premium-export-packaging.webp";
import partnersImage from "@/assets/partners-local-producers.webp";
import boxLineupImage from "@/assets/box-lineup-table.webp";
import localProductsImage from "@/assets/local-products-boutique.jpg";

export default function QVTBoxManifest() {
  const { t } = useLanguage();

  const brand = {
    violet: "#8B5CF6",
    turquoise: "#00B0B9",
    canard: "#005B5F",
    noir: "#212121",
    blancCasse: "#F2F7F6",
  } as const;

  return (
    <>
      <Navigation />
      <div
        className="min-h-screen w-full text-sm antialiased pt-16"
        style={{
          background: `
            radial-gradient(1200px 800px at 10% -10%, rgba(139,92,246,0.16), transparent 60%),
            radial-gradient(900px 600px at 90% 10%, rgba(0,176,185,0.12), transparent 60%),
            linear-gradient(180deg, ${brand.blancCasse}, #ffffff)
          `,
        }}
      >
        {/* HERO */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${brand.turquoise}, transparent 60%)`,
                }}
                initial={{
                  opacity: 0.15,
                  scale: 0.8,
                  x: Math.random() * 1200 - 200,
                  y: Math.random() * 600 - 100,
                }}
                animate={{
                  opacity: [0.15, 0.4, 0.15],
                  scale: [0.8, 1.1, 0.8],
                  x: [Math.random() * 1200 - 200, Math.random() * 1200 - 200],
                  y: [Math.random() * 600 - 100, Math.random() * 600 - 100],
                }}
                transition={{
                  duration: 5 + Math.random() * 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 shadow"
                style={{ backgroundColor: "white", color: brand.canard }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-3 w-3" />
                {t("manifest.hero.badge") ||
                  "Manifeste Entreprises & Partenaires"}
              </motion.div>

              <h2
                className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
                style={{ color: brand.canard }}
              >
                Une IA qui écoute,
                <span className="block" style={{ color: brand.violet }}>
                  des Box qui agissent
                </span>
                <span className="block" style={{ color: brand.turquoise }}>
                  et un impact qui rayonne.
                </span>
              </h2>

              <p className="mt-4 text-sm opacity-90" style={{ color: brand.noir }}>
                QVT Box transforme la prévention en action.  
                Une approche phygitale : l’app détecte les besoins,  
                la Box répond concrètement — pour vos équipes et vos partenaires.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <motion.a
                  href="#entreprise"
                  className="px-4 py-2 text-sm rounded-2xl font-medium shadow hover:shadow-lg transition"
                  style={{ backgroundColor: brand.violet, color: "white" }}
                  whileHover={{ scale: 1.05 }}
                >
                  Pour les entreprises
                </motion.a>
                <motion.a
                  href="#fournisseurs"
                  className="px-4 py-2 text-sm rounded-2xl font-medium border hover:shadow transition"
                  style={{ borderColor: brand.canard, color: brand.canard }}
                  whileHover={{ scale: 1.05 }}
                >
                  Pour les fournisseurs
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img
                src={boxPremiumImage}
                alt="QVT Box Premium"
                className="rounded-3xl shadow-2xl w-full h-64 object-cover"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>
        </section>

        {/* ENTREPRISES */}
        <section
          id="entreprise"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3
                className="text-2xl font-semibold"
                style={{ color: brand.canard }}
              >
                Pour les entreprises
              </h3>
              <p className="text-sm opacity-90" style={{ color: brand.noir }}>
                De la détection au passage à l’action : QVT Box met en place une
                boucle complète d’écoute, d’analyse et d’engagement.
              </p>

              <ul className="space-y-2">
                {[
                  "Score QVT Box (1 à 15) : mesurer la santé émotionnelle collective.",
                  "Alertes précoces et météo émotionnelle par équipe.",
                  "Dashboard RH et CSE avec suivi anonymisé.",
                  "Box bien-être Made in France livrées selon les besoins détectés.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <CheckCircle
                      className="h-4 w-4 mt-0.5"
                      style={{ color: brand.turquoise }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="mailto:contact@qvtbox.com?subject=Démo%20QVT%20Box%20Entreprise"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 text-sm rounded-2xl font-medium shadow hover:shadow-lg transition"
                style={{ backgroundColor: brand.violet, color: "white" }}
                whileHover={{ scale: 1.05 }}
              >
                Demander une démo
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl border bg-white"
              style={{ borderColor: "#e8eef0" }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={boxLineupImage}
                alt="Line-up de Box QVT"
                className="w-full h-64 object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* FOURNISSEURS */}
        <section
          id="fournisseurs"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-200"
        >
          <motion.div
            className="rounded-2xl p-6 shadow-xl bg-white/90 backdrop-blur border"
            style={{ borderColor: "#e8eef0" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Factory className="h-5 w-5" style={{ color: brand.violet }} />
              <h3
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: brand.canard }}
              >
                Pour nos fournisseurs
              </h3>
            </div>
            <p className="mb-5 text-sm" style={{ color: brand.noir }}>
              Nous soutenons les producteurs, artisans et créateurs français.
              Chaque Box valorise leur savoir-faire et leur ancrage territorial.
            </p>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                {
                  title: "Accès aux entreprises partenaires",
                  desc: "Diffusion auprès des CSE et grands comptes.",
                },
                {
                  title: "Co-marque & visibilité",
                  desc: "Mise en avant sur les Box et la plateforme.",
                },
                {
                  title: "Données marché agrégées",
                  desc: "Indicateurs sur les tendances bien-être.",
                },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl border bg-white shadow-sm"
                  style={{ borderColor: "#eef2f4" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: brand.noir }}
                  >
                    {c.title}
                  </p>
                  <p
                    className="text-xs opacity-80"
                    style={{ color: brand.noir }}
                  >
                    {c.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <motion.a
                href="mailto:contact@qvtbox.com?subject=Partenariat%20Fournisseur%20QVT%20Box"
                className="px-4 py-2 text-sm rounded-2xl font-medium shadow hover:shadow-lg transition"
                style={{ backgroundColor: brand.turquoise, color: "white" }}
                whileHover={{ scale: 1.05 }}
              >
                Proposer un produit
              </motion.a>
              <motion.a
                href="/files/guide-fournisseur.pdf"
                className="px-4 py-2 text-sm rounded-2xl font-medium border hover:shadow transition"
                style={{ borderColor: brand.violet, color: brand.violet }}
                whileHover={{ scale: 1.05 }}
              >
                Guide fournisseur (PDF)
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* PARTENAIRES */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-gray-200">
          <motion.div
            className="rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={partnersImage}
              alt="Partenaires QVT Box"
              className="w-full h-[320px] object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="text-xl sm:text-2xl font-semibold mb-3"
              style={{ color: brand.canard }}
            >
              Un écosystème vertueux
            </h3>
            <p
              className="text-sm leading-relaxed mx-auto max-w-3xl"
              style={{ color: brand.noir }}
            >
              Ensemble, nous faisons rayonner l’intelligence émotionnelle,
              l’innovation sociale et le savoir-faire français.  
              QVT Box, c’est un coup de pouce QVT pour vos équipes et pour la société.
            </p>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}
