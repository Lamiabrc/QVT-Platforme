import { Heart, Settings, Users, Star } from "lucide-react";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";

const PillarsSection = () => {
  const [titleRef, titleVisible] = useScrollReveal();
  const [pillarsRef, visiblePillars] = useStaggeredReveal(4, 200);

  const pillars = [
    {
      title: "Santé & Équilibre",
      description: "Prenez soin de votre corps et de votre esprit avec des produits naturels et des conseils bien-être.",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      icon: Heart,
      examples: ["Tisanes bio", "Huiles essentielles", "Accessoires relaxation"]
    },
    {
      title: "Organisation & Efficacité",
      description: "Optimisez votre quotidien professionnel avec des outils pratiques et des méthodes éprouvées.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      icon: Settings,
      examples: ["Planners & agendas", "Outils ergonomiques", "Applications productivité"]
    },
    {
      title: "Cohésion & Relations",
      description: "Renforcez les liens avec vos collègues et créez un environnement de travail harmonieux.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      icon: Users,
      examples: ["Activités team building", "Jeux collaboratifs", "Ateliers communication"]
    },
    {
      title: "Développement & Inspiration",
      description: "Cultivez votre potentiel et trouvez l'inspiration pour évoluer personnellement et professionnellement.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      icon: Star,
      examples: ["Livres développement", "Formations courtes", "Coaching personnalisé"]
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
            Nos 4 <span className="text-primary">Piliers</span> du Bien-être
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Une approche holistique pour améliorer votre qualité de vie au travail, 
            basée sur les recommandations de l'ANACT.
          </p>
        </div>

        <div 
          ref={pillarsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isVisible = visiblePillars.has(index);
            
            return (
              <div
                key={index}
                className={`card-bubble p-6 hover:shadow-floating transition-all duration-500 transform ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
                } ${pillar.bgColor} ${pillar.borderColor} border group hover:scale-105`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-full ${pillar.bgColor} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${pillar.color}`} />
                </div>
                
                <h3 className={`text-xl font-kalam font-bold ${pillar.color} mb-3 text-center`}>
                  {pillar.title}
                </h3>
                
                <p className="text-foreground/70 text-sm mb-4 text-center leading-relaxed">
                  {pillar.description}
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide text-center">
                    Exemples :
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pillar.examples.map((example, exIndex) => (
                      <span 
                        key={exIndex}
                        className={`text-xs px-2 py-1 rounded-full ${pillar.bgColor} ${pillar.color} font-medium`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-medium text-sm">
              Chaque Box intègre plusieurs piliers pour une approche complète
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;