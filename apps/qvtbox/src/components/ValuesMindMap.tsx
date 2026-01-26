import { useScrollReveal, useStaggeredReveal } from '@/hooks/useScrollReveal';
import { 
  Package, 
  Heart, 
  Users, 
  Ear, 
  Zap, 
  Eye, 
  User, 
  Building, 
  Target,
  ShoppingBag,
  Handshake,
  Globe,
  Lightbulb,
  Leaf,
  GraduationCap,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Import des vraies images
import heroWorkplaceTeam from "@/assets/hero-workplace-team.jpg";
import purchasingPowerReal from "@/assets/purchasing-power-real.jpg";
import localProductsReal from "@/assets/local-products-real.jpg";
import recognitionReal from "@/assets/recognition-real.jpg";
import listeningReal from "@/assets/listening-real.jpg";
import reactivityReal from "@/assets/reactivity-real.jpg";
import transparencyReal from "@/assets/transparency-real.jpg";
import humanCenteredReal from "@/assets/human-centered-real.jpg";
import buildingTogetherReal from "@/assets/building-together-real.jpg";
import concreteImpactReal from "@/assets/concrete-impact-real.jpg";
import mutualSupportReal from "@/assets/mutual-support-real.jpg";

interface ValueBubble {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'physical' | 'saas' | 'common';
  color: string;
  bgColor: string;
  image: string;
}

const ValuesMindMap = () => {
  const [titleRef, titleVisible] = useScrollReveal();
  const [bubblesRef, bubblesVisible] = useStaggeredReveal(14, 100);

  const values: ValueBubble[] = [
    // Box Physique (4 valeurs) 🟢
    {
      title: "Un petit coup de pouce au pouvoir d'achat",
      description: "la box peut être ce petit cadeau en fin du mois (négociation entreprise, salarié)",
      icon: Heart,
      category: 'physical',
      color: "text-green-700",
      bgColor: "bg-green-100",
      image: purchasingPowerReal
    },
    {
      title: "Réorienter la dépense",
      description: "transformer les budgets cadeaux / consommables en soutien au marché français",
      icon: ShoppingBag,
      category: 'physical',
      color: "text-green-700",
      bgColor: "bg-green-100",
      image: localProductsReal
    },
    {
      title: "Reconnaissance",
      description: "une attention particulière aux salariés (promotion, mariage, deuil, cohésion d'équipe...)",
      icon: Handshake,
      category: 'physical',
      color: "text-green-700", 
      bgColor: "bg-green-100",
      image: recognitionReal
    },
    {
      title: "Durabilité",
      description: "des produits éco-responsables pour un impact environnemental positif",
      icon: Leaf,
      category: 'physical',
      color: "text-green-700", 
      bgColor: "bg-green-100",
      image: localProductsReal
    },
    
    // Application SaaS (4 valeurs) 🔵
    {
      title: "Écoute réelle",
      description: "prendre en compte le ressenti et la parole des salariés",
      icon: Ear,
      category: 'saas',
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      image: listeningReal
    },
    {
      title: "Réactivité",
      description: "détecter rapidement les signaux faibles et agir au bon moment",
      icon: Zap,
      category: 'saas', 
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      image: reactivityReal
    },
    {
      title: "Transparence",
      description: "un suivi clair et partagé, pensé avec et pour les salariés",
      icon: Eye,
      category: 'saas',
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      image: transparencyReal
    },
    {
      title: "Innovation",
      description: "des outils technologiques modernes et intuitifs",
      icon: Lightbulb,
      category: 'saas',
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      image: reactivityReal
    },

    // Valeurs communes (6 bulles) 🫧
    {
      title: "Mettre l'humain au centre",
      description: "attention et respect du quotidien de chacun",
      icon: User,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: humanCenteredReal
    },
    {
      title: "Construire ensemble", 
      description: "solutions co-créées avec les salariés et leurs représentants",
      icon: Building,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: buildingTogetherReal
    },
    {
      title: "Un impact concret",
      description: "des gestes visibles, utiles, qui améliorent réellement le quotidien",
      icon: Target,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: concreteImpactReal
    },
    {
      title: "Se soutenir les uns les autres",
      description: "entraide et solidarité au sein de l'équipe",
      icon: Users,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: mutualSupportReal
    },
    {
      title: "Formation continue",
      description: "développement des compétences et accompagnement personnel",
      icon: GraduationCap,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: buildingTogetherReal
    },
    {
      title: "Sécurité et bien-être",
      description: "protection et prévention pour un environnement de travail sain",
      icon: Shield,
      category: 'common',
      color: "text-primary",
      bgColor: "bg-primary/10",
      image: humanCenteredReal
    }
  ];

  const getCategoryTitle = (category: string) => {
    switch(category) {
      case 'physical': return '🟢 Box Physique';
      case 'saas': return '🔵 Application SaaS'; 
      case 'common': return '🫧 Valeurs Communes';
      default: return '';
    }
  };

  const getGridCols = (category: string) => {
    switch(category) {
      case 'physical': return 'md:grid-cols-4';
      case 'saas': return 'md:grid-cols-4'; 
      case 'common': return 'md:grid-cols-3';
      default: return 'md:grid-cols-3';
    }
  };

  const getCategoryItemCount = (category: string) => {
    switch(category) {
      case 'physical': return 4;
      case 'saas': return 4; 
      case 'common': return 6;
      default: return 3;
    }
  };

  const groupedValues = values.reduce((acc, value) => {
    if (!acc[value.category]) acc[value.category] = [];
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, ValueBubble[]>);

  return (
    <section 
      className="py-20 px-6 section-professional relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroWorkplaceTeam})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto relative z-10">
        <div 
          ref={titleRef}
          className={`text-center mb-16 scroll-reveal ${titleVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-inter">
            Du <span className="text-secondary">local</span>, de l'<span className="text-primary">écoute</span>, du <span className="text-accent-foreground">concret</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto font-lato">
            QVT Box – Une attention particulière, chaque jour
          </p>
        </div>

        <div ref={bubblesRef} className="space-y-12">
          {(['physical', 'saas', 'common'] as const).map((category, categoryIndex) => (
            <div key={category} className="relative">
              <div className={`text-center mb-8 stagger-item ${bubblesVisible.has(categoryIndex * 3) ? 'visible' : ''}`}>
                <h3 className="text-2xl font-bold font-inter mb-2">
                  {getCategoryTitle(category)}
                </h3>
              </div>

              <div className={`grid ${getGridCols(category)} gap-8 max-w-6xl mx-auto`}>
                {groupedValues[category]?.map((value, index) => {
                  const IconComponent = value.icon;
                  const categoryItemCount = getCategoryItemCount(category);
                  const previousCategoriesTotal = category === 'physical' ? 0 : 
                                                 category === 'saas' ? 4 : 8;
                  const bubbleIndex = previousCategoriesTotal + index + 1;
                  
                  return (
                    <Card 
                      key={index}
                      className={`
                        card-professional p-6 text-center relative overflow-hidden
                        transition-all duration-500 hover:scale-105 hover:shadow-floating
                        cursor-pointer group
                        stagger-item ${bubblesVisible.has(bubbleIndex) ? 'visible' : ''}
                      `}
                      style={{
                        animationDelay: `${bubbleIndex * 100}ms`
                      }}
                    >
                      {/* Effet de connexion visuelle */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                      </div>

                      <CardContent className="space-y-6 relative z-10">
                        {/* Image de fond de la carte */}
                        <div 
                          className="w-full h-32 rounded-lg mb-4 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${value.image})` }}
                        >
                          <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                        </div>
                        
                        <div className="flex justify-center mb-4">
                          <div className={`
                            w-20 h-20 ${value.bgColor} rounded-full flex items-center justify-center
                            transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
                            border-4 border-white shadow-lg
                          `}>
                            <IconComponent className={`w-10 h-10 ${value.color}`} />
                          </div>
                        </div>
                        
                        <h4 className="font-inter font-bold text-xl text-foreground leading-tight">
                          {value.title}
                        </h4>
                        
                        <p className="text-foreground/70 text-sm leading-relaxed font-lato">
                          {value.description}
                        </p>

                        {/* Indicateur de catégorie */}
                        <div className={`
                          inline-flex items-center justify-center w-3 h-3 rounded-full mx-auto
                          ${category === 'physical' ? 'bg-green-500' : ''}
                          ${category === 'saas' ? 'bg-blue-500' : ''}
                          ${category === 'common' ? 'bg-primary' : ''}
                        `}></div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Connexions visuelles entre les bulles */}
              {category !== 'common' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bulles décoratives flottantes */}
        <div className="relative mt-12">
          <div className="absolute top-0 left-1/4 w-12 h-12 bg-green-200/30 rounded-full animate-float opacity-60"></div>
          <div className="absolute -top-8 right-1/3 w-8 h-8 bg-blue-200/40 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-primary/20 rounded-full animate-float opacity-70" style={{ animationDelay: '4s' }}></div>
          <div className="absolute -bottom-4 right-1/4 w-10 h-10 bg-secondary/15 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default ValuesMindMap;