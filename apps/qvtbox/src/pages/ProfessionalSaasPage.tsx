// src/pages/ProfessionalSaasPage.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import { BarChart3, Brain, Activity, Shield, Sparkles } from "lucide-react";

import saasDashboard from "@/assets/saas-dashboard-pro.jpg";

/**
 * QVT Box — Page SaaS Professionnel (Version A épurée)
 * - Peu de texte, beaucoup d'air
 * - Focus émotion + bénéfice
 * - 4 blocs : Hero / Piliers / À quoi ça ressemble / CTA
 */

const ProfessionalSaasPage = () => {
  const { user } = useAuth();

  const [heroRef, heroVisible] = useScrollReveal();
  const [pillarsRef, pillarsVisible] = useScrollReveal();
  const [demoRef, demoVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();

  const pillars = [
    {
      icon: Brain,
      title: "Écouter sans juger",
      text: "ZÉNA capte les nuances : fatigue, lassitude, tensions… là où les enquêtes classiques passent à côté.",
    },
    {
      icon: BarChart3,
      title: "Voir ce qui se fissure",
      text: "Tableaux de bord émotionnels par site, métier, équipe. Une vision claire avant les arrêts et les départs.",
    },
    {
      icon: Activity,
      title: "Agir et documenter",
      text: "Plans d’actions QVT, suivi des impacts, préparation DUERP et éléments pour CSSCT et partenaires sociaux.",
    },
  ];

  const ctaTarget = user ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main>
        {/* ================= HERO ================= */}
        <section
          ref={heroRef}
          className={`pt-28 pb-20 px-6 md:px-12 relative overflow-hidden ${
            heroVisible ? "scroll-reveal visible" : "scroll-reveal"
          }`}
        >
          {/* Halo d’ambiance sable + violet */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#5B4B8A]/22 blur-[160px] opacity-70 -z-10" />
          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[420px] h-[420px] bg-[#F3E0B9]/50 blur-[150px] opacity-80 -z-10" />

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Colonne texte */}
            <div>
              <Badge
                variant="outline"
                className="border-[#C2A978]/50 text-[11px] tracking-[0.18em] uppercase text-[#6F6454] mb-4 bg-[#FBF3E4]"
              >
                SaaS QVT · IA émotionnelle · Prévention RPS
              </Badge>

              <h1 className="text-3xl md:text-5xl font-light leading-tight mb-5 text-[#1B1A18]">
                La plateforme qui écoute vos équipes
                <br />
                <span className="text-[#6F6454]">
                  et apaise vos risques RPS.
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#6F6454] mb-7 max-w-xl leading-relaxed">
                ZÉNA écoute les émotions du quotidien.  
                QVT Box transforme ces signaux en décisions concrètes pour les RH, CSE
                et managers — sans trahir la confiance des salariés.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Link to={ctaTarget}>
                  <Button className="px-6 py-3 rounded-full bg-[#1B1A18] text-[#FDF9F0] hover:bg-black flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4" />
                    Demander une démo QVT Box
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="px-6 py-3 rounded-full border-[#C2A978] text-[#4A3F33] hover:bg-[#FBF3E4] text-sm"
                  >
                    Échanger avec notre équipe QVT
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-[#8C7C68] max-w-sm">
                Aucune donnée nominative exposée • Compatible RGPD • Adapté aux équipes
                terrain, distantes et hybrides.
              </p>
            </div>

            {/* Colonne visuel */}
            <div className="relative">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 bg-white/70 backdrop-blur">
                <img
                  src={saasDashboard}
                  alt="Tableau de bord QVT Box SaaS"
                  className="w-full h-[320px] md:h-[360px] object-cover"
                />
              </div>

              {/* Bulle ZÉNA */}
              <div className="absolute -bottom-6 left-4 bg-white/95 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-[#E2D6C3]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5B4B8A] to-[#4FD1C5] flex items-center justify-center text-white text-xs font-bold">
                  ZÉNA
                </div>
                <p className="text-[11px] text-[#4A3F33] leading-snug">
                  « Je veille sur l’ambiance émotionnelle, pas sur les individus. »
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============== PILIERS ============== */}
        <section
          ref={pillarsRef}
          className={`py-18 md:py-20 px-6 md:px-12 bg-[#FDF9F0] border-y border-[#E8DCC8]/70 ${
            pillarsVisible ? "scroll-reveal visible" : "scroll-reveal"
          }`}
        >
          <div className="max-w-5xl mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#1B1A18]">
              Ce que ZÉNA entend, ce que vous pouvez piloter.
            </h2>
            <p className="text-sm md:text-base text-[#6F6454] max-w-3xl mx-auto">
              QVT Box fait la jonction entre le vécu émotionnel des salariés et vos
              responsabilités de prévention, de dialogue social et de conformité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={pillar.title}
                  className="border border-[#E2D6C3] bg-white/90 shadow-sm rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="w-10 h-10 mb-4 rounded-full bg-[#F3E0B9]/60 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#6F6454]" />
                    </div>
                    <h3 className="text-base font-medium mb-2 text-[#1B1A18]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#6F6454] leading-relaxed">
                      {pillar.text}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ============== À QUOI ÇA RESSEMBLE ? ============== */}
        <section
          ref={demoRef}
          className={`py-20 px-6 md:px-12 bg-[#FAF6EE] ${
            demoVisible ? "scroll-reveal visible" : "scroll-reveal"
          }`}
        >
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="uppercase tracking-[0.18em] text-[11px] text-[#9C8D77] mb-3">
                Concret, lisible, actionnable
              </p>
              <h2 className="text-2xl md:text-3xl font-light mb-4 text-[#1B1A18]">
                Une météo émotionnelle simple à lire,
                <br />
                sans mettre vos équipes sous microscope.
              </h2>
              <p className="text-sm md:text-base text-[#6F6454] mb-5 leading-relaxed">
                En un coup d’œil : zones à risque, équipes qui tiennent, signaux faibles
                à surveiller. Vous choisissez où mettre votre énergie, et vous pouvez
                montrer aux CSE et à la Direction ce qui a été fait.
              </p>

              <ul className="space-y-2 text-sm text-[#4A3F33]">
                <li>• Cartes émotionnelles par site / équipe</li>
                <li>• Alertes graduées sur les risques RPS</li>
                <li>• Traces pour DUERP, CSSCT, inspecteurs du travail</li>
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-[#E2D6C3] bg-white shadow-xl p-4">
                <div className="rounded-2xl bg-[#FDF9F0] border border-[#E8DCC8] px-4 py-3 mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#9C8D77]">
                      Météo émotionnelle
                    </p>
                    <p className="text-sm text-[#4A3F33]">
                      3 équipes à surveiller cette semaine
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#8C7C68]">Risque global</p>
                    <p className="text-sm font-medium text-[#B45309]">Modéré ↗</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Plateforme", risk: "Apaisé", tone: "#15803D" },
                    { label: "Support client", risk: "Tendu", tone: "#B45309" },
                    { label: "Terrain", risk: "Fragile", tone: "#991B1B" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-[#FDF9F0] border border-[#E8DCC8] px-3 py-3"
                    >
                      <p className="text-[11px] text-[#8C7C68] mb-1">
                        {item.label}
                      </p>
                      <p
                        className="text-xs font-semibold"
                        style={{ color: item.tone }}
                      >
                        {item.risk}
                      </p>
                      <div className="mt-2 h-1.5 rounded-full bg-[#E8DCC8] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:
                              item.risk === "Apaisé"
                                ? "35%"
                                : item.risk === "Tendu"
                                ? "70%"
                                : "85%",
                            backgroundColor: item.tone,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[11px] text-[#8C7C68]">
                  Exemple visuel. La version finale est adaptée à vos sites, métiers et
                  instances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============== CTA FINAL ============== */}
        <section
          ref={ctaRef}
          className={`py-24 px-6 md:px-12 bg-[#151515] text-[#FDF9F0] text-center ${
            ctaVisible ? "scroll-reveal visible" : "scroll-reveal"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-8 h-8 mx-auto mb-4 text-[#F3E0B9]" />
            <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-4">
              Le coup de pouce QVT Box
            </p>

            <h2 className="text-2xl md:text-3xl font-light mb-5">
              Vos équipes n’ont pas besoin d’un gadget bien-être.
              <br />
              Elles ont besoin qu’on prenne au sérieux ce qu’elles ressentent.
            </h2>

            <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-8">
              Parlez-nous de votre réalité : multi-sites, équipes terrain, télétravail,
              tensions sociales…  
              On construit avec vous un dispositif discret, réaliste, qui respecte vos
              contraintes et celles de vos salariés.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={ctaTarget}>
                <Button className="px-7 py-3 rounded-full bg-[#F3E0B9] text-[#151515] hover:bg-[#F7E7C5] text-sm font-semibold">
                  Demander une démo QVT Box + ZÉNA
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  variant="outline"
                  className="px-7 py-3 rounded-full border-[#E5D7BF] text-[#FDF9F0] hover:bg-white/5 text-sm"
                >
                  Être rappelé par un·e expert·e QVT
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalSaasPage;
