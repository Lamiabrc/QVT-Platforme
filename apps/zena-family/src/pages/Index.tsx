import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/zena/GlowCard";
import { Heart, MessageCircle, Users, Sparkles, Star, Zap } from "lucide-react";
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

  // simple switch de thème (urbain / pastel / dark)
  const handleThemeChange = (mode: "urban" | "pastel" | "night") => {
    const root = document.documentElement;
    if (mode === "night") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // si tu veux plus tard un vrai theme pastel: root.classList.toggle("theme-pastel", mode === "pastel");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zena-violet/20 via-zena-rose/20 to-zena-turquoise/20">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="spray-shadow"
        >
          <img src={zenaFace} alt="ZÉNA" className="w-40 h-40 rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zena-night relative overflow-hidden text-foreground">
      {/* Fond animé soft, moins chargé */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-zena-violet/30 to-zena-turquoise/25 blur-3xl"
            style={{
              width: Math.random() * 220 + 120,
              height: Math.random() * 220 + 120,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 80 - 40],
              opacity: [0.15, 0.45, 0.15],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: Math.random() * 14 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* HERO : avatar + message clair parent/ado */}
      <section
        className="container mx-auto px-4 pt-24 pb-16 relative z-10 grid gap-12 md:grid-cols-[1.3fr,1fr] items-center"
        aria-labelledby="zena-family-hero"
      >
        {/* Texte / SEO */}
        <div className="space-y-6 text-center md:text-left">
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground stencil-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IA ÉMOTIONNELLE POUR ADOS & PARENTS
          </motion.p>

          <motion.h1
            id="zena-family-hero"
            className="text-4xl md:text-5xl lg:text-6xl stencil-text tracking-wider spray-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            ZÉNA FAMILLE
          </motion.h1>

          <motion.h2
            className="text-lg md:text-2xl font-semibold text-muted-foreground drip-effect"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            La voix qui aide les ados à s&apos;exprimer… et les parents à mieux
            comprendre.
          </motion.h2>

          <motion.p
            className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            ZÉNA est une application d&apos;IA émotionnelle pensée pour les familles :
            les adolescents peuvent parler librement, déposer ce qu&apos;ils ressentent,
            et les parents reçoivent des éclairages émotionnels simples, bienveillants
            et actionnables pour apaiser la relation parent-ado.
          </motion.p>

          {/* CTA principaux */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/chat">
              <Button className="text-lg md:text-xl px-8 py-6 graffiti-button bg-gradient-to-r from-zena-violet via-zena-rose to-zena-turquoise shadow-2xl">
                💬 Parler à ZÉNA
              </Button>
            </Link>

            <Link to="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="px-7 py-5 stencil-card bg-background/70 backdrop-blur-sm"
              >
                <Zap className="w-5 h-5 mr-2" />
                Créer mon espace famille
              </Button>
            </Link>

            <Link to="/dashboard?demo=true">
              <Button
                size="lg"
                variant="outline"
                className="px-7 py-5 border-2 border-zena-violet/60 stencil-card"
              >
                <Star className="w-5 h-5 mr-2" />
                Voir la démo
              </Button>
            </Link>
          </motion.div>

          {/* Lien vers version entreprise */}
          <motion.p
            className="text-xs text-muted-foreground/80 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Vous cherchez ZÉNA pour les entreprises ?{" "}
            <a
              href={ZENA_VOICE_URL}
              className="underline underline-offset-4 text-zena-turquoise hover:text-zena-rose transition-rough"
            >
              Découvrez ZÉNA au travail
            </a>
            .
          </motion.p>
        </div>

        {/* Avatar dans bulle IA émotionnelle */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          aria-hidden="true"
        >
          <div className="spray-shadow rounded-full p-[6px] bg-gradient-to-br from-zena-violet/70 via-zena-night to-zena-turquoise/70">
            <div className="graffiti-border rounded-full overflow-hidden bg-background w-52 h-52 md:w-64 md:h-64 flex items-center justify-center">
              <img
                src={zenaFace}
                alt="Avatar ZÉNA"
                className="w-[90%] h-[90%] rounded-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section valeurs (SEO : H2 + mots-clés émotions) */}
      <section
        className="container mx-auto px-4 py-16 relative z-10"
        aria-labelledby="zena-family-valeurs"
      >
        <motion.h2
          id="zena-family-valeurs"
          className="text-3xl md:text-4xl font-bold text-center mb-10 stencil-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Nos valeurs pour la relation parent-ado
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: Heart,
              title: "Bienveillance",
              desc: "Un espace émotionnel sans jugement pour chaque ado.",
              color: "turquoise",
              delay: 0,
            },
            {
              icon: MessageCircle,
              title: "Écoute",
              desc: "Aider à dire 'ça ne va pas' sans se sentir en faute.",
              color: "violet",
              delay: 0.1,
            },
            {
              icon: Users,
              title: "Lien",
              desc: "Rapprocher les parents et les ados avec des mots simples.",
              color: "rose",
              delay: 0.2,
            },
            {
              icon: Sparkles,
              title: "Espoir",
              desc: "Rappeler qu'on peut traverser les périodes difficiles ensemble.",
              color: "turquoise",
              delay: 0.3,
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: value.delay }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <GlowCard
                glowColor={value.color}
                className="p-6 text-center h-full stencil-card bg-background/70 backdrop-blur-sm"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon
                    className={`w-10 h-10 mx-auto mb-3 text-zena-${value.color}`}
                  />
                </motion.div>
                <h3 className="font-semibold mb-2 text-foreground stencil-text">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section fonctionnalités / bénéfices */}
      <section
        className="container mx-auto px-4 pb-16 relative z-10"
        aria-labelledby="zena-family-fonctionnalites"
      >
        <motion.h2
          id="zena-family-fonctionnalites"
          className="text-3xl md:text-4xl font-bold text-center mb-10 stencil-text"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ce que ZÉNA apporte à votre famille
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              emoji: "💬",
              title: "Dialogue émotionnel guidé",
              desc: "L’ado parle à ZÉNA, qui reformule ses émotions avec des mots simples et proposera des pistes pour en parler à un parent.",
              delay: 0,
            },
            {
              emoji: "🫧",
              title: "Météo émotionnelle familiale",
              desc: "Un tableau visuel des ressentis (fatigue, stress, joie) pour mieux comprendre l’ambiance à la maison sans exposer les détails intimes.",
              delay: 0.1,
            },
            {
              emoji: "📖",
              title: "Journal partagé",
              desc: "Chacun peut déposer un mot, un emoji ou une image. ZÉNA crée un résumé hebdomadaire pour ouvrir le dialogue au bon moment.",
              delay: 0.2,
            },
            {
              emoji: "✨",
              title: "Coups de pouce & encouragements",
              desc: "Envoyez des petits messages positifs ou symboles d’encouragement. ZÉNA aide à formuler un « je pense à toi » au bon moment.",
              delay: 0.3,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ scale: 1.02 }}
            >
              <GlowCard className="p-7 h-full stencil-card bg-background/75 backdrop-blur-sm">
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.emoji}
                </motion.div>
                <h3 className="text-lg font-semibold mb-3 text-foreground stencil-text">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sélecteur de thème discret */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center z-20">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border text-xs md:text-sm">
          <span className="text-muted-foreground mr-1">🎨 Ambiance :</span>
          <button
            onClick={() => handleThemeChange("urban")}
            className="transition-rough hover:scale-105"
          >
            🖤 Urbaine
          </button>
          <button
            onClick={() => handleThemeChange("pastel")}
            className="transition-rough hover:scale-105"
          >
            🌸 Douce
          </button>
          <button
            onClick={() => handleThemeChange("night")}
            className="transition-rough hover:scale-105"
          >
            🌙 Night
          </button>
        </div>
      </div>

    </div>
  );
};

export default Index;
