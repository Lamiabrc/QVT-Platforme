import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/zena/GlowCard";
import {
  Heart,
  MessageCircle,
  Users,
  Sparkles,
  Shield,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import zenaFace from "@/assets/zena-face.png";
import { ZENA_VOICE_URL } from "@qvt/shared";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zena-cream via-white to-zena-cream">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="spray-shadow"
        >
          <img src={zenaFace} alt="ZENA" className="w-32 h-32 rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-cream via-white to-zena-cream/70 text-foreground relative overflow-hidden">
      {/* Soft background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-zena-rose/25 via-zena-cream/40 to-zena-violet/20 blur-3xl"
            style={{
              width: Math.random() * 240 + 140,
              height: Math.random() * 240 + 140,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: Math.random() * 14 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* HERO */}
      <section className="container mx-auto px-4 pt-24 pb-12 relative z-10 grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-center">
        <div className="space-y-6">
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ZENA Famille & Ado
          </motion.p>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Une IA emotionnelle pour apaiser la relation parent-ado.
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            ZENA aide les adolescents a exprimer ce qu'ils ressentent, et les
            parents a mieux comprendre. Un espace doux, protege, avec un parcours
            clair et des alertes encadrees si la situation l'exige.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link to="/auth">
              <Button className="text-base px-7 py-6 rounded-full graffiti-button">
                Creer mon espace famille
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="px-7 py-6 rounded-full">
                Parler a ZENA
              </Button>
            </Link>
            <Link to="/dashboard?demo=true">
              <Button variant="secondary" className="px-7 py-6 rounded-full">
                Voir la demo
              </Button>
            </Link>
          </motion.div>

          <p className="text-xs text-muted-foreground">
            Vous cherchez ZENA pour les entreprises ?{" "}
            <a
              href={ZENA_VOICE_URL}
              className="underline underline-offset-4 hover:text-zena-violet transition-rough"
            >
              ZENA au travail
            </a>
            .
          </p>
        </div>

        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          aria-hidden="true"
        >
          <div className="rounded-[38px] bg-white/70 p-4 shadow-[0_30px_80px_rgba(64,48,32,0.18)]">
            <div className="rounded-[30px] bg-gradient-to-br from-zena-cream via-white to-zena-cream/60 p-6">
              <div className="flex items-center gap-4">
                <div className="spray-shadow rounded-full p-[6px] bg-gradient-to-br from-zena-rose/50 via-white to-zena-violet/30">
                  <div className="graffiti-border rounded-full overflow-hidden bg-white w-28 h-28 flex items-center justify-center">
                    <img
                      src={zenaFace}
                      alt="Avatar ZENA"
                      className="w-[90%] h-[90%] rounded-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Presence ZENA</p>
                  <p className="text-lg font-semibold">Douce, rassurante, claire</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Espace famille + espace amis invite-only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Parcours */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Un parcours simple pour toute la famille
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageCircle,
              title: "Je parle a ZENA",
              desc: "L'ado depose ce qui pese, sans jugement, quand il veut.",
            },
            {
              icon: CalendarDays,
              title: "On organise ensemble",
              desc: "Planning simple, routines douces et suggestions utiles.",
            },
            {
              icon: Shield,
              title: "On protege sans exposer",
              desc: "Alertes encadrees pour la tutelle en cas de detresse.",
            },
          ].map((step) => (
            <GlowCard
              key={step.title}
              className="p-6 text-left h-full stencil-card bg-white/80"
            >
              <step.icon className="w-8 h-8 text-zena-violet" />
              <h3 className="text-lg font-semibold mt-4">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Espaces */}
      <section className="container mx-auto px-4 pb-16 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Deux espaces relies, sans melanger les roles
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <GlowCard className="p-7 h-full stencil-card bg-white/80">
            <div className="flex items-center gap-3">
              <Heart className="w-7 h-7 text-zena-rose" />
              <h3 className="text-xl font-semibold">Espace Ado</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Un lieu pour parler a ZENA, comprendre ses emotions et avancer a
              son rythme. Aucun annuaire public, pas de recherche globale.
            </p>
            <ul className="mt-4 text-sm text-muted-foreground space-y-2">
              <li>• Journal emotionnel et messages rassurants</li>
              <li>• Suggestions d'actions simples et bienveillantes</li>
              <li>• Espace amis invite-only (ferme)</li>
            </ul>
          </GlowCard>

          <GlowCard className="p-7 h-full stencil-card bg-white/80">
            <div className="flex items-center gap-3">
              <Users className="w-7 h-7 text-zena-violet" />
              <h3 className="text-xl font-semibold">Espace Parents / Tuteurs</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Une vision claire pour accompagner sans sur-exposer. Les alertes
              sont encadrees par des regles definies en amont.
            </p>
            <ul className="mt-4 text-sm text-muted-foreground space-y-2">
              <li>• Espace famille commun + planning partage</li>
              <li>• Alertes detresse / harcelement si necessaire</li>
              <li>• Conseils actionnables pour apaiser les tensions</li>
            </ul>
          </GlowCard>
        </div>
      </section>

      {/* Protection */}
      <section className="container mx-auto px-4 pb-20 relative z-10">
        <div className="rounded-[32px] border border-border bg-white/85 p-8 md:p-10 shadow-[0_30px_70px_rgba(64,48,32,0.12)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-zena-rose" />
                Protection by design
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mt-3">
                ZENA ne remplace pas les urgences.
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                En cas de danger immediat, contactez les secours. ZENA vous aide
                a exprimer, comprendre et agir, avec un cadre protecteur.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth">
                <Button className="rounded-full px-6">Activer mon espace</Button>
              </Link>
              <Link to="/onboarding">
                <Button variant="outline" className="rounded-full px-6">
                  Demarrer l'onboarding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
