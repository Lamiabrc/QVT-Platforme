import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Gift, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-workplace.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center pt-24 px-6 overflow-hidden">
      {/* Background image + gradient */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={heroImage}
          alt="Collaborateurs en situation de travail sereine"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      </div>

      {/* Halo de lucioles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-secondary rounded-full animate-firefly"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <Badge variant="secondary" className="whitespace-nowrap">
              Né en 2024
            </Badge>
            <span className="text-sm text-foreground/70">
              après 15 ans de salariat — par <span className="font-semibold">Lamia</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-inter text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
            S'occuper des salariés :
            <br className="hidden md:block" />
            <span className="text-primary">notre fierté française</span>
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-breathe">
              notre force exportable
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-lg md:text-xl text-foreground/80 font-light max-w-3xl mx-auto leading-relaxed">
            QVT Box transforme l'excellence sociale française en avantage compétitif. 
            Nous allions une application d'IA émotionnelle et des box utiles, fabriquées en France, 
            pour <strong>écouter</strong>, <strong>prévenir</strong> et <strong>agir concrètement</strong> au bénéfice des salariés.
          </p>

          {/* CTA principale */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="whitespace-nowrap shadow-lg hover:scale-[1.02] transition-transform">
              <Link to="/saas">
                <BarChart3 className="w-5 h-5" />
                <span>Demander une démo SaaS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="whitespace-nowrap">
              <Link to="/box">
                <Gift className="w-5 h-5" />
                <span>Découvrir les Box</span>
              </Link>
            </Button>
          </div>

          {/* ZENA Voice CTA */}
          <div className="mt-10">
            <Link
              to="https://zena.qvtbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full 
                         bg-gradient-to-r from-primary/90 to-secondary/90 text-white 
                         font-medium shadow-lg hover:scale-[1.05] transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Parler à <strong>ZENA Voice</strong></span>
            </Link>
          </div>

          {/* Trust Row */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="rounded-xl border bg-background/70 p-4">
              <div className="text-sm text-foreground/60">Score QVCT</div>
              <div className="text-lg font-semibold text-primary">Lisible 1–15</div>
            </div>
            <div className="rounded-xl border bg-background/70 p-4">
              <div className="text-sm text-foreground/60">Prévention RPS</div>
              <div className="text-lg font-semibold text-secondary">Alertes bienveillantes</div>
            </div>
            <div className="rounded-xl border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Made in France
              </div>
              <div className="text-lg font-semibold">Reconnaissance concrète</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
