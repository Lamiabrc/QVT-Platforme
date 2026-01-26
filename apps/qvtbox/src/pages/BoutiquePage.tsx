// src/pages/BoutiquePage.tsx
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";
import { AdvancedProductFilters } from "@/components/AdvancedProductFilters";
import { AssistantChatBot } from "@/components/AssistantChatBot";

import {
  MapPin,
  Leaf,
  Award,
  ShoppingBag,
  Search,
  Star,
  CheckCircle,
  Truck,
  ArrowRight,
} from "lucide-react";

import localProductsHero from "@/assets/local-products-boutique.jpg";

const BoutiquePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const [heroRef, heroVisible] = useScrollReveal();
  const [productsRef, productsVisible] = useStaggeredReveal(6, 150);
  const [ctaRef, ctaVisible] = useScrollReveal();

  const categories = [
    { id: "all", name: "Tous les produits", icon: ShoppingBag },
    { id: "bien-etre", name: "Bien-être", icon: Leaf },
    { id: "ergonomie", name: "Ergonomie", icon: CheckCircle },
    { id: "energie", name: "Énergie", icon: Star },
    { id: "local", name: "Terroir local", icon: MapPin },
  ];

  const products = [
    {
      id: 1,
      name: "Huile essentielle de lavande bio",
      price: "24€",
      category: "bien-etre",
      origin: "Provence, France",
      producer: "Distillerie des Alpilles",
      rating: 4.8,
      reviews: 127,
      image: "/images/boutique/huile-lavande.jpg",
      labels: ["Bio", "Made in France", "Artisanal"],
      description:
        "Huile essentielle pure de lavande fine AOP, récoltée à la main dans les champs de Provence.",
    },
    {
      id: 2,
      name: "Coussin ergonomique lombaire",
      price: "45€",
      category: "ergonomie",
      origin: "Normandie, France",
      producer: "Ergofrance",
      rating: 4.6,
      reviews: 89,
      image: "/images/boutique/coussin-lombaire.jpg",
      labels: ["Ergonomique", "Conçu par des kinés", "Garantie 2 ans"],
      description:
        "Support lombaire avec mousse à mémoire de forme, conçu avec des kinésithérapeutes français.",
    },
    {
      id: 3,
      name: "Tisane énergisante bio",
      price: "18€",
      category: "energie",
      origin: "Auvergne, France",
      producer: "Herboristerie du Puy",
      rating: 4.7,
      reviews: 203,
      image: "/images/boutique/tisane-energisante.jpg",
      labels: ["Bio", "Plantes françaises", "Sans théine"],
      description:
        "Mélange de plantes tonifiantes cultivées dans le Massif Central, idéal pour les fins de journée.",
    },
    {
      id: 4,
      name: "Miel de tilleul artisanal",
      price: "16€",
      category: "local",
      origin: "Bourgogne, France",
      producer: "Rucher des Coteaux",
      rating: 4.9,
      reviews: 156,
      image: "/images/boutique/miel-tilleul.jpg",
      labels: ["Artisanal", "Récolte 2024", "Apiculteur local"],
      description:
        "Miel crémeux aux notes florales délicates, récolté dans les forêts bourguignonnes.",
    },
    {
      id: 5,
      name: "Balle anti-stress naturelle",
      price: "12€",
      category: "bien-etre",
      origin: "Nouvelle-Aquitaine, France",
      producer: "Ateliers Solidaires",
      rating: 4.4,
      reviews: 74,
      image: "/images/boutique/balle-anti-stress.jpg",
      labels: ["Éco-conçue", "Insertion sociale", "Matériaux naturels"],
      description:
        "Balle de relaxation remplie de graines de lin bio, fabriquée dans des ateliers d’insertion.",
    },
    {
      id: 6,
      name: "Repose-pieds ajustable en bois",
      price: "38€",
      category: "ergonomie",
      origin: "Bretagne, France",
      producer: "Mobilier Pro Bretagne",
      rating: 4.5,
      reviews: 92,
      image: "/images/boutique/repose-pieds.jpg",
      labels: ["Bois français", "Réglable", "Ergonomique"],
      description:
        "Repose-pieds en hêtre massif, hauteur et inclinaison ajustables pour soulager les jambes.",
    },
  ];

  const stats = [
    {
      value: "70%",
      label: "des Français souhaitent des achats locaux",
      source: "ADEME 2023",
    },
    {
      value: "150+",
      label: "artisans partenaires",
      source: "Réseau QVT Box",
    },
    {
      value: "100%",
      label: "produits français",
      source: "Charte qualité",
    },
    {
      value: "48h",
      label: "délai moyen de livraison",
      source: "Circuits courts",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.producer.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <section
        className="pt-24 pb-16 px-6 bg-[#151515] text-[#FDF9F0]"
        ref={heroRef}
      >
        <div
          className={`container mx-auto grid lg:grid-cols-2 gap-10 items-center scroll-reveal ${
            heroVisible ? "visible" : ""
          }`}
        >
          {/* Texte */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-[#F3E0B9]/50 bg-[#1E1A17]">
              <MapPin className="w-4 h-4 text-[#F3E0B9]" />
              Boutique locale & engagée QVT Box
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              La boutique{" "}
              <span className="text-secondary">Made in France</span> qui nourrit
              vos Box QVT
            </h1>

            <p className="text-sm md:text-base text-[#E5D7BF]/90 leading-relaxed">
              Ici, chaque produit raconte une histoire : celle d’un artisan,
              d’un territoire, et d’un geste concret pour le bien-être au
              travail. Vous pouvez alimenter vos Box QVT, vos cadeaux
              collaborateurs ou vos actions RSE avec des produits 100% français.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#F3E0B9] text-[#151515] hover:bg-[#F7E7C5] px-6 py-3 rounded-full text-sm font-semibold">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Parcourir les produits
              </Button>
              <Button
                variant="outline"
                className="border-[#F3E0B9] text-[#F3E0B9] hover:bg-[#F3E0B9]/10 px-6 py-3 rounded-full text-sm"
              >
                Devenir fournisseur local
              </Button>
            </div>
          </div>

          {/* Visuel */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-floating border border-[#F3E0B9]/40">
              <img
                src={localProductsHero}
                alt="Produits locaux français pour QVT Box"
                className="w-full h-[280px] md:h-[340px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-4 left-4 bg-[#1E1A17]/95 border border-[#F3E0B9]/40 rounded-2xl px-4 py-3 text-xs text-[#FDF9F0] shadow-lg">
              🌱 Circuits courts • 🤝 Partenariats durables • 🇫🇷 100% France
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <section className="py-14 px-6 bg-background">
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-professional text-center p-6">
              <CardContent className="space-y-3">
                <div className="text-3xl md:text-4xl font-bold text-secondary">
                  {stat.value}
                </div>
                <p className="text-sm text-foreground/80">{stat.label}</p>
                <span className="inline-block text-[11px] px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {stat.source}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* RECHERCHE + CATEGORIES */}
      <section className="py-8 px-6 bg-background-soft">
        <div className="container mx-auto space-y-6">
          <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] gap-6 items-center">
            {/* Barre de recherche */}
            <div className="max-w-xl">
              <label className="block text-sm font-medium mb-2">
                Rechercher un produit ou un artisan
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ex : lavande, miel, coussin, Bretagne…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs ${
                      isActive
                        ? "bg-secondary text-white"
                        : "border-muted text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Filtres avancés (placeholder logique) */}
          <AdvancedProductFilters
            onFiltersChange={() => {
              // branchement logique ultérieur si besoin
            }}
            productCount={filteredProducts.length}
          />
        </div>
      </section>

      {/* PRODUITS */}
      <section className="py-12 px-6 bg-background" ref={productsRef}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`card-professional overflow-hidden group card-hover stagger-item ${
                  productsVisible.has(index) ? "visible" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {product.labels.slice(0, 2).map((label, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-foreground shadow-sm"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews} avis)
                    </span>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {product.price}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-secondary">
                        <MapPin className="w-3 h-3" />
                        {product.origin}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Par {product.producer}
                    </p>

                    <Button className="w-full mt-2 rounded-full button-hover">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Ajouter à ma sélection QVT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ENGAGEMENTS */}
      <section className="py-20 px-6 bg-background-soft">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos engagements éthiques
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-sm md:text-base">
              La boutique QVT Box n’est pas un simple catalogue : c’est un
              écosystème de partenaires qui partagent une même vision du travail
              et du bien-être.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-professional p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">100% local</h3>
                <p className="text-sm text-foreground/70">
                  Produits fabriqués en France par des artisans et PME
                  sélectionnés pour leur impact et leur transparence.
                </p>
              </CardContent>
            </Card>

            <Card className="card-professional p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Leaf className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Éco-responsable</h3>
                <p className="text-sm text-foreground/70">
                  Circuits courts, emballages recyclables et partenaires engagés
                  dans des démarches environnementales concrètes.
                </p>
              </CardContent>
            </Card>

            <Card className="card-professional p-8 text-center">
              <CardContent className="space-y-4">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Qualité garantie</h3>
                <p className="text-sm text-foreground/70">
                  Sélection rigoureuse, tests et retours d’expérience terrain
                  pour alimenter vos Box QVT avec du concret et du durable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* LIVRAISON */}
      <section className="py-16 px-6 bg-background">
        <div className="container mx-auto">
          <Card className="card-professional p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <Truck className="inline w-6 h-6 mr-2 text-secondary" />
                  Livraison responsable
                </h3>
                <p className="text-sm md:text-base text-foreground/70 mb-4">
                  Nous privilégions des transporteurs engagés et des circuits
                  courts pour limiter l’empreinte carbone de chaque envoi, tout
                  en garantissant des délais raisonnables.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Livraison moyenne en 48h
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Emballages recyclables ou réutilisables
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    Optimisation des regroupements d’envois
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  Gratuit
                </div>
                <p className="text-sm text-foreground/70">
                  Livraison offerte dès 50€ d’achats cumulés
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        className="py-20 px-6 bg-secondary text-white"
        ref={ctaRef}
      >
        <div
          className={`container mx-auto text-center scroll-reveal-scale ${
            ctaVisible ? "visible" : ""
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à remplir vos Box avec du vrai local ?
          </h2>
          <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-8">
            Sélectionnez vos produits, composez vos Box QVT et soutenez les
            savoir-faire français tout en prenant soin de vos équipes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-secondary hover:bg-white/90 rounded-full px-8 py-3">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Commencer ma sélection
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3"
            >
              Découvrir les Box QVT
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Assistant ChatBot */}
      <AssistantChatBot
        isOpen={isChatBotOpen}
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)}
      />
    </div>
  );
};

export default BoutiquePage;
