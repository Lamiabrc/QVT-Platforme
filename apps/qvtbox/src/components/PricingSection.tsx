import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Zap, Crown, Shield } from "lucide-react";

type Plan = {
  name: "Starter" | "Professional" | "Enterprise";
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number | "Illimité";
  features: string[];
  popular?: boolean;
  ctaTo?: string; // optionnel: route pour le CTA
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    description: "Parfait pour les petites équipes",
    icon: Zap,
    monthlyPrice: 29,
    annualPrice: 290, // ~2 mois off
    maxUsers: 25,
    features: [
      "Tableau de bord basique",
      "Sondages bien-être mensuels",
      "Alertes email simples",
      "Rapports standards",
      "Support email",
    ],
  },
  {
    name: "Professional",
    description: "Pour les entreprises en croissance",
    icon: Star,
    monthlyPrice: 79,
    annualPrice: 790, // ~2 mois off
    maxUsers: 100,
    features: [
      "Tableau de bord avancé",
      "IA prédictive",
      "Alertes RPS en temps réel",
      "Analyse par département",
      "Plans d'action automatisés",
      "Intégrations HR",
      "Support prioritaire",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Solution complète pour grandes organisations",
    icon: Crown,
    monthlyPrice: 199,
    annualPrice: 1990, // ~2 mois off
    maxUsers: "Illimité",
    features: [
      "Toutes les fonctionnalités Pro",
      "IA prédictive avancée",
      "Tableaux de bord personnalisés",
      "API complète",
      "Conformité RGPD renforcée",
      "Formation équipes",
      "Support dédié 24/7",
      "Déploiement on-premise",
    ],
    ctaTo: "/contact",
  },
];

function formatPriceEUR(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSavingsPercent(monthly: number, annual: number) {
  const monthlyTotal = monthly * 12;
  if (annual >= monthlyTotal) return 0;
  const pct = Math.round(((monthlyTotal - annual) / monthlyTotal) * 100);
  return Math.max(0, Math.min(100, pct));
}

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  const displayPlans = useMemo(() => {
    // Mettre le plan populaire au centre sans casser l’ordre sémantique
    const proIndex = PLANS.findIndex((p) => p.popular);
    if (proIndex === -1) return PLANS;
    const arr = [...PLANS];
    const [pro] = arr.splice(proIndex, 1);
    // place au milieu si md:grid-cols-3
    arr.splice(1, 0, pro);
    return arr;
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Tarifs transparents</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Choisissez le plan adapté à la taille de votre organisation
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span
            className={`${
              !isAnnual ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            Mensuel
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
            aria-label="Basculer mensuel/annuel"
          />
          <span
            className={`${
              isAnnual ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            Annuel
          </span>
          {isAnnual && (
            <Badge variant="secondary" className="ml-2">
              Jusqu’à 20% d’économie
            </Badge>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayPlans.map((plan) => {
          const Icon = plan.icon;
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          const savings = getSavingsPercent(plan.monthlyPrice, plan.annualPrice);

          return (
            <Card
              key={plan.name}
              className={`relative h-full ${
                plan.popular ? "border-primary shadow-lg md:scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="text-primary w-6 h-6" />
                        </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="mt-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">
                      {formatPriceEUR(price)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{isAnnual ? "an" : "mois"}
                    </span>
                  </div>
                  {isAnnual && savings > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Économisez {savings}% vs mensuel
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    Jusqu’à {plan.maxUsers} utilisateurs
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* CTA */}
                {plan.name === "Enterprise" ? (
                  <Button
                    asChild
                    size="lg"
                    className="w-full mb-6 whitespace-nowrap"
                  >
                    <Link to={plan.ctaTo || "/contact"}>Nous contacter</Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className={`w-full mb-6 whitespace-nowrap ${
                      plan.popular ? "bg-primary hover:bg-primary/90" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Essai gratuit 14 jours
                  </Button>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check
                        className="text-green-600 mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Guarantees */}
      <div className="mt-16 text-center">
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield className="text-primary" size={24} />
            <h3 className="text-xl font-semibold">Garanties & Sécurité</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="font-medium mb-1">Essai gratuit</div>
              <div className="text-muted-foreground">14 jours sans engagement</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">Conformité RGPD</div>
              <div className="text-muted-foreground">Données hébergées en France</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">Support inclus</div>
              <div className="text-muted-foreground">Formation & accompagnement</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom CTAs */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Besoin d’un devis personnalisé ou d’une démonstration ?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg" className="whitespace-nowrap">
            <Link to="/roi">Calculer mon ROI</Link>
          </Button>
          <Button asChild size="lg" className="whitespace-nowrap">
            <Link to="/contact">Parler à un expert</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
