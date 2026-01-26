// src/components/BoxCatalog.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle, Gift, Star, Globe, Package } from "lucide-react";

// ------------------------------------
// ✅ IMPORTS IMAGES (assure-toi qu'elles existent)
// Thématiques
import imgPAA from "@/assets/box-pouvoir-achat.webp";                  // Pouvoir d'Achat (TOP de page)
import imgFocus from "@/assets/box-bien-etre-anti-stress.webp";        // Focus & Reset
import imgMobilite from "@/assets/box-mobilite-terrain.webp";          // Mobilité & Terrain
import imgPenibilite from "@/assets/box-penibilite-recuperation.webp"; // Pénibilité & Récupération

// Événementielles
import imgRetraite from "@/assets/box-evenement-retraite.webp";
import imgNaissance from "@/assets/box-evenement-naissance.webp";
import imgAnniversaire from "@/assets/box-evenement-anniversaire.webp";
import imgPromotion from "@/assets/box-evenement-promotion.webp";
import imgMariage from "@/assets/box-evenement-mariage.webp";

// Export (section dédiée tout en bas)
import imgExport from "@/assets/box-premium-export-packaging.webp";
// ------------------------------------

const BoxCatalog = () => {
  const [catalogRef, catalogVisible] = useScrollReveal();

  // -------------------- BOX THÉMATIQUES (Pouvoir d'Achat en premier) --------------------
  const thematicBoxes = [
    {
      name: "Pouvoir d'Achat",
      price: "34,90 €",
      description: "Produits utiles du quotidien & coups de pouce concrets pour vos équipes.",
      image: imgPAA,
      contents: [
        "Sélection de produits du quotidien",
        "Gourmandises artisanales locales",
        "Carnet astuces budget",
        "Bon/coupon symbolique (option)",
        "Carte message entreprise",
      ],
      benefits: ["Concret et utile", "Valeur perçue forte", "100% Made in France"],
      madeInFrance: true,
      customizable: true,
      premium: false,
    },
    {
      name: "Focus & Reset",
      price: "29,90 €",
      description: "Concentration, gestion du stress et clarté mentale.",
      image: imgFocus,
      contents: [
        "Carnet & stylo éco-conçu",
        "Tisane bio relax premium",
        "Balle anti-stress naturelle",
        "Spray anti-fatigue aux huiles essentielles",
        "Carte rituel focus personnalisée",
      ],
      benefits: ["Améliore la concentration", "Réduit le stress", "Favorise la détente"],
      madeInFrance: true,
      customizable: true,
    },
    {
      name: "Mobilité & Terrain",
      price: "34,90 €",
      description: "Soutien pour les salariés nomades et sur le terrain.",
      image: imgMobilite,
      contents: [
        "Gourde/mug isotherme français",
        "Lingettes biodégradables",
        "Snack sain et énergétique",
        "Crème mains protection",
        "Carte pause mobilité",
      ],
      benefits: ["Confort en déplacement", "Hydratation optimale", "Protection cutanée"],
      madeInFrance: true,
      customizable: true,
    },
    {
      name: "Pénibilité & Récupération",
      price: "34,90 €",
      description: "Récupération après effort, soulagement des tensions.",
      image: imgPenibilite,
      contents: [
        "Patch chauffant naturel",
        "Crème articulations & muscles",
        "Infusion détente bio",
        "Balle de massage ergonomique",
        "Carte rituel récupération",
      ],
      benefits: ["Soulage les tensions", "Accélère la récupération", "Détente musculaire"],
      madeInFrance: true,
      customizable: true,
    },
  ] as const;

  // -------------------- BOX ÉVÉNEMENTIELLES (chacune sa propre image) --------------------
  const eventBoxes = [
    {
      name: "Box Retraite",
      price: "59,90 €",
      description: "Célébrer une carrière et souhaiter le meilleur.",
      image: imgRetraite,
      contents: [
        "Livre d'or personnalisé",
        "Douceurs artisanales françaises",
        "Carte de remerciements",
        "Souvenir gravé",
        "Coffret présentation premium",
      ],
    },
    {
      name: "Box Naissance",
      price: "49,90 €",
      description: "Partager la joie d'une nouvelle vie.",
      image: imgNaissance,
      contents: [
        "Produits bio pour bébé",
        "Carte félicitations",
        "Cadeau symbolique",
        "Douceurs pour les parents",
      ],
    },
    {
      name: "Box Anniversaire",
      price: "39,90 €",
      description: "Marquer une date importante avec élégance.",
      image: imgAnniversaire,
      contents: [
        "Friandises artisanales",
        "Carte personnalisée",
        "Petit cadeau surprise",
        "Emballage festif",
      ],
    },
    {
      name: "Box Promotion/Réussite",
      price: "49,90 €",
      description: "Célébrer les succès et évolutions.",
      image: imgPromotion,
      contents: [
        "Accessoire professionnel",
        "Produit bien-être",
        "Carte de félicitations",
        "Symbole de réussite",
      ],
    },
    {
      name: "Box Mariage/Événement",
      price: "59,90 €",
      description: "Partager les moments de bonheur avec raffinement.",
      image: imgMariage,
      contents: [
        "Chocolats fins & bougie",
        "Thé/infusion premium",
        "Carte de vœux",
        "Présentation élégante",
      ],
    },
  ] as const;

  const customizationOptions = [
    {
      title: "Personnalisation Complète",
      description: "Logo entreprise, couleurs, message personnalisé.",
      icon: Star,
    },
    {
      title: "Produits Locaux",
      description: "Sélection de producteurs de votre région.",
      icon: Package,
    },
    {
      title: "Quantités Flexibles",
      description: "De 10 à 1000+ box selon vos besoins.",
      icon: Package,
    },
    {
      title: "Livraison Internationale",
      description: "Expédition partout dans le monde.",
      icon: Globe,
    },
  ] as const;

  return (
    <section
      className="py-12 px-6"
      ref={catalogRef}
    >
      <div className="container mx-auto">
        <div className={`text-center mb-10 scroll-reveal ${catalogVisible ? "visible" : ""}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-inter">
            Nos <span className="text-primary">Box QVT</span>
          </h2>
          <p className="text-base text-foreground/70 max-w-2xl mx-auto mb-4">
            100% Made in France • Livrées prêtes à offrir
          </p>
        </div>

        {/* ---------- Thématiques (PAA en premier) ---------- */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 font-inter">
            Box <span className="text-primary">Thématiques</span>
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {thematicBoxes.map((box) => (
              <Card
                key={box.name}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={box.image}
                    alt={`Box ${box.name}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-white text-xs">
                      🇫🇷 Made in France
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{box.name}</h4>
                      <p className="text-white/80 text-xs">{box.description}</p>
                    </div>
                    <div className="bg-white/90 px-2 py-1 rounded">
                      <span className="font-bold text-primary text-sm">{box.price}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {box.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild size="sm" className="w-full">
                    <Link to="/contact">Demander un devis</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ---------- Événementielles ---------- */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 font-inter">
            Box <span className="text-secondary">Événementielles</span>
          </h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {eventBoxes.map((box) => (
              <Card
                key={box.name}
                className="text-center hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-white/90 px-2 py-0.5 rounded text-xs">
                      <span className="font-bold text-secondary">{box.price}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-3">
                  <h4 className="font-bold text-sm text-foreground mb-1">{box.name}</h4>
                  <p className="text-foreground/70 text-xs mb-3">{box.description}</p>

                  <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
                    <Link to="/contact">Commander</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ---------- SECTION EXPORT ---------- */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-4 font-inter">
            Box <span className="text-secondary">Premium Export</span>
          </h3>
          <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-6 text-sm">
            Livraison internationale avec packaging renforcé et formalités douanières simplifiées.
          </p>

          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group max-w-4xl mx-auto">
            <div className="relative h-48 overflow-hidden">
              <img
                src={imgExport}
                alt="Box Premium Export"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs">Premium</Badge>
                <Badge className="bg-primary text-white text-xs">🇫🇷 Made in France</Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h4 className="text-xl font-bold text-white mb-1">Export mondial</h4>
                <p className="text-white/85 text-xs">
                  Produits premium • Tracking • Service dédié
                </p>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {["Protection renforcée", "Suivi international", "Douane simplifiée", "Message multilingue"].map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>

              <Button asChild size="sm" className="w-full">
                <Link to="/contact">
                  <Globe className="w-4 h-4 mr-2" />
                  Demander un devis Export
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BoxCatalog;
