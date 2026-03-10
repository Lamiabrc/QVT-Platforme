// src/pages/AboutPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Boxes,
  Globe2,
  ArrowRight,
  Users,
  CheckCircle,
} from "lucide-react";

// --- IMAGES / VIDÉOS ---
import heroTeam from "@/assets/hero-workplace-team.jpg";
import teamPro from "@/assets/professional-team-meeting.jpg";
import partnersLocal from "@/assets/partners-local-producers.webp";
import shippingStation from "@/assets/shipping-station-parcel.webp";
import lamiaPortrait from "@/assets/lamia-portrait.jpg";

// --- NOUVELLES IMAGES BOX ---
import boxEquilibre from "@/assets/box-equilibre.jpg";
import boxCohesion from "@/assets/box-cohesion.jpg";
import boxPouvoirAchat from "@/assets/box-pouvoir-achat.webp";
import boxRelax from "@/assets/box-relax.jpg";

const brand = {
  violet: "#8B5CF6",
  turquoise: "#00B0B9",
  canard: "#005B5F",
};

// --- Titre tricolore ---
function HeadingFR({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <Tag
        className="font-bold leading-tight tracking-tight text-3xl md:text-4xl"
        style={{
          background:
            "linear-gradient(90deg, #2563EB 0%, #ffffff 50%, #DC2626 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {children}
      </Tag>
      <div className="mt-3 h-1.5 w-28 rounded-full overflow-hidden flex">
        <span className="flex-1 bg-blue-600" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-red-600" />
      </div>
    </div>
  );
}

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={t("about.seo.title")}
        description={t("about.seo.description")}
        ogImage="/og-image.png"
        type="article"
      />
      <Navigation />

      {/* HERO */}
      <section className="relative overflow-hidden pb-20 pt-24 sm:pt-28">
        <img
          src={heroTeam}
          alt={t("about.hero.imageAlt")}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,91,95,0.85)] via-[rgba(0,91,95,0.55)] to-transparent" />
        <div className="absolute -top-10 right-10 w-48 h-48 bg-white/15 rounded-full blur-3xl animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5 shadow bg-white/90 text-[color:#005B5F]">
              <Sparkles className="h-4 w-4" />
              {t("about.hero.badge")}
            </div>
            <HeadingFR as="h1" className="mb-2">
              {t("about.hero.title")}
            </HeadingFR>
            <p className="mt-2 text-white/80 italic">
              {t("about.hero.subtitle")}
            </p>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl">
              {t("about.hero.description")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="px-5 py-3 rounded-2xl font-medium shadow hover:shadow-lg transition bg-white text-primary"
              >
                {t("about.hero.cta1")}
              </Link>
              <Link
                to="/auth"
                className="px-5 py-3 rounded-2xl font-medium border hover:shadow transition text-white border-white"
              >
                {t("about.hero.cta2")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ÉCOUTER, PRÉVENIR, AGIR */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F6] via-white to-[#E9FAF8] px-4 py-20 sm:px-6">
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl top-20 left-10" />
          <div className="absolute w-80 h-80 bg-[#00B0B9]/10 rounded-full blur-3xl bottom-10 right-10" />
        </div>

        <div className="relative container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <HeadingFR>{t("about.promises.title")}</HeadingFR>

            <p className="text-foreground/80 mb-4 text-lg">
              QVT Box repose sur une conviction : la qualité de vie au travail ne
              se décrète pas, elle se cultive. Notre solution associe intelligence
              émotionnelle et actions concrètes pour un mieux-être durable.
            </p>

            <p className="text-foreground/80 mb-6 italic">
              Notre approche phygitale : l’app détecte les besoins, la Box répond.
              Simple, lisible et responsabilisante — pour salariés, managers, RH
              et CSE.
            </p>

            <p className="text-lg text-[color:#005B5F] font-semibold mb-4">
              Chaque émotion compte. L’IA écoute, la Box agit, l’entreprise évolue.
            </p>

            <div className="grid gap-3">
              {[
                {
                  icon: <HeartHandshake className="h-5 w-5" />,
                  text: "💬 Une écoute continue grâce à Zéna, IA émotionnelle qui mesure les ressentis sans intrusion.",
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  text: "🧠 Une prévention proactive : détection des signaux faibles et météo émotionnelle de l’entreprise.",
                },
                {
                  icon: <Boxes className="h-5 w-5" />,
                  text: "🎁 Des réponses concrètes via les Box Made in France : bien-être, cohésion, pouvoir d’achat et équilibre.",
                },
                {
                  icon: <Globe2 className="h-5 w-5" />,
                  text: "🌍 Une démarche durable et humaine qui soutient artisans, territoires et santé mentale au travail.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-transparent hover:border-[#00B0B9]/50 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1"
                >
                  <span className="mt-0.5 text-[color:#00B0B9]">
                    {item.icon}
                  </span>
                  <p className="leading-relaxed text-foreground/90">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vidéos / visuels des trois piliers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "/images/about-listen-daily.mp4",
              "/images/about-prevention-ai.jpg",
              boxEquilibre,
              boxRelax,
            ].map((src, i) =>
              src.endsWith(".mp4") ? (
                <video
                  key={i}
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-48 w-full rounded-2xl object-cover shadow-lg ring-1 ring-black/5 md:h-56"
                />
              ) : (
                <img
                  key={i}
                  src={src}
                  alt="QVT Box visuel"
                  className="h-48 w-full rounded-2xl object-cover shadow-lg ring-1 ring-black/5 md:h-56"
                  loading="lazy"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* FONDATRICE */}
      <section className="relative overflow-hidden bg-muted/40 px-4 py-20 sm:px-6">
        <div className="absolute inset-0">
          <div className="absolute w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl top-10 left-10" />
          <div className="absolute w-80 h-80 bg-[#00B0B9]/10 rounded-full blur-3xl bottom-10 right-10" />
        </div>

        <div className="relative container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
            <img
              src={lamiaPortrait}
              alt="Portrait de Lamia Bréchet"
              className="h-[280px] w-full object-cover sm:h-[360px] md:h-[420px]"
              loading="lazy"
            />
          </div>

          <div>
            <HeadingFR>La fondatrice</HeadingFR>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Fondatrice de QVT Box, Lamia Bréchet incarne une vision simple :
              <strong> replacer l’humain et l’émotion au cœur de la performance.</strong>
              Après plus de dix ans de salariat, elle crée une solution qui allie
              IA émotionnelle, impact social et soutien aux salariés.
            </p>

            <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border-l-4 border-[color:#00B0B9] shadow-inner mb-6">
              <p className="text-[color:#005B5F] italic">
                « Je crois profondément qu’écouter, c’est déjà agir. QVT Box est
                née de ce besoin : aider les entreprises à mieux comprendre ce que
                leurs collaborateurs ne disent pas toujours. »
              </p>
            </div>

            <p className="font-semibold text-[color:#005B5F] mb-8">
              – Lamia Bréchet, Fondatrice de QVT Box
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  t: "Innovation sociale",
                  d: "Allier IA et bien-être au service du collectif.",
                },
                {
                  t: "Ancrage local",
                  d: "Produits Made in France et partenariats éthiques.",
                },
                {
                  t: "Prévention",
                  d: "Agir avant que la fatigue morale ne s’installe.",
                },
                {
                  t: "Espoir",
                  d: "Redonner du sens, de la confiance et de la lumière.",
                },
              ].map((c) => (
                <Card
                  key={c.t}
                  className="bg-white shadow-sm border hover:shadow-md transition"
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-[color:#005B5F]">{c.t}</p>
                    <p className="text-sm text-foreground/70">{c.d}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ZÉNA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#8B5CF6]/10 via-[#00B0B9]/10 to-[#8B5CF6]/10 px-4 py-20 backdrop-blur-lg sm:px-6">
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-96 h-96 bg-white/20 rounded-full blur-3xl top-20 left-1/3 animate-pulse" />
        </div>

        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/zena-avatar.mp4"
              className="h-[280px] w-full object-cover sm:h-[360px] md:h-[420px]"
            >
              <source src="/images/zena-intro.mp4" type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture vidéo.
            </video>
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-sm text-[color:#005B5F] shadow">
              👂 Votre voix compte
            </div>
          </div>

          <div>
            <HeadingFR>Parlez à Zéna</HeadingFR>
            <p className="text-foreground/80 mb-4 text-lg">
              Zéna est bien plus qu’une IA : c’est une présence bienveillante, un
              miroir émotionnel pour les salariés et un allié stratégique pour les
              entreprises.
            </p>

            <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border-l-4 border-[color:#00B0B9] shadow-inner mb-6">
              <p className="italic text-[color:#005B5F]">
                Elle écoute chaque collaborateur avec empathie, recueille ses
                ressentis au fil des jours et génère une météo émotionnelle
                vivante de votre organisation.
              </p>
            </div>

            <ul className="space-y-3 mb-8 text-foreground/80">
              {[
                "Suivi émotionnel quotidien et personnalisé.",
                "Détection précoce du stress, de la démotivation ou du désengagement.",
                "Météo émotionnelle d’entreprise visualisée en temps réel.",
                "Suggestions de Box et d’actions bien-être adaptées aux besoins détectés.",
              ].map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[color:#00B0B9] mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/zena"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium shadow hover:shadow-lg transition"
                style={{ backgroundColor: brand.violet, color: "#fff" }}
              >
                Découvrir Zéna
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium border hover:shadow transition"
                style={{ borderColor: brand.canard, color: brand.canard }}
              >
                Demander une démonstration
                <Users className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="px-4 py-10 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <HeadingFR>Nos partenaires</HeadingFR>
          </div>
          <div className="rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-md">
            <img
              src={partnersLocal}
              alt="Partenaires locaux"
              className="w-full h-[260px] md:h-[320px] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
