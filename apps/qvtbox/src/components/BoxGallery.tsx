import { useState } from "react";
import { Heart, Settings, Users, Star, Package, Sparkles } from "lucide-react";
import boxImage from "@/assets/box-artisanal.jpg";
import boutiqueImage from "@/assets/boutique-artisan.jpg";
import productsImage from "@/assets/qvt-box-products.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BoxGallery = () => {
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);
  const [galleryRef, galleryVisible] = useScrollReveal();

  const boxes = [
    {
      id: 1,
      name: "Box Focus & Reset",
      image: boxImage,
      pillars: ["Santé & Équilibre", "Organisation & Efficacité"],
      colors: ["bg-green-500", "bg-blue-500"],
      icons: [Heart, Settings],
      description: "Retrouvez sérénité et efficacité au quotidien",
      price: "39€"
    },
    {
      id: 2,
      name: "Box Cohésion Team",
      image: boutiqueImage,
      pillars: ["Cohésion & Relations", "Développement & Inspiration"],
      colors: ["bg-orange-500", "bg-purple-500"],
      icons: [Users, Star],
      description: "Renforcez les liens et l'esprit d'équipe",
      price: "45€"
    },
    {
      id: 3,
      name: "Box Équilibre Pro",
      image: productsImage,
      pillars: ["Santé & Équilibre", "Développement & Inspiration"],
      colors: ["bg-green-500", "bg-purple-500"],
      icons: [Heart, Star],
      description: "L'harmonie parfaite entre bien-être et performance",
      price: "42€"
    },
    {
      id: 4,
      name: "Box Innovation",
      image: boxImage,
      pillars: ["Organisation & Efficacité", "Développement & Inspiration"],
      colors: ["bg-blue-500", "bg-purple-500"],
      icons: [Settings, Star],
      description: "Boostez votre créativité et votre productivité",
      price: "48€"
    },
    {
      id: 5,
      name: "Box Énergie Positive",
      image: boutiqueImage,
      pillars: ["Santé & Équilibre", "Cohésion & Relations"],
      colors: ["bg-green-500", "bg-orange-500"],
      icons: [Heart, Users],
      description: "Partagez la bonne humeur et la vitalité",
      price: "36€"
    },
    {
      id: 6,
      name: "Box Leadership",
      image: productsImage,
      pillars: ["Organisation & Efficacité", "Cohésion & Relations", "Développement & Inspiration"],
      colors: ["bg-blue-500", "bg-orange-500", "bg-purple-500"],
      icons: [Settings, Users, Star],
      description: "Développez votre potentiel de leader bienveillant",
      price: "55€"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div 
          ref={galleryRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
            Nos <span className="text-primary">Box Magiques</span> ✨
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Chaque box est soigneusement composée selon vos besoins, avec des produits français artisanaux 
            et des contenus digitaux exclusifs.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">
              Livraison gratuite dès 2 box commandées
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boxes.map((box, index) => (
            <div
              key={box.id}
              className={`card-bubble overflow-hidden hover:shadow-floating transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredBox(box.id)}
              onMouseLeave={() => setHoveredBox(null)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={box.image} 
                  alt={box.name}
                  className={`w-full h-48 object-cover transition-all duration-500 ${
                    hoveredBox === box.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-foreground">{box.price}</span>
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                  hoveredBox === box.id ? 'opacity-100' : 'opacity-0'
                }`}></div>
                {hoveredBox === box.id && (
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-medium">CONTENU PREMIUM</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-kalam font-bold text-foreground mb-2">
                  {box.name}
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  {box.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-foreground/60 uppercase tracking-wide mb-2">
                      Piliers intégrés :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {box.pillars.map((pillar, pillarIndex) => {
                        const Icon = box.icons[pillarIndex];
                        const colorClass = box.colors[pillarIndex];
                        
                        return (
                          <div 
                            key={pillarIndex}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full ${colorClass}/10 border ${colorClass}/20`}
                          >
                            <Icon className={`w-3 h-3 ${colorClass.replace('bg-', 'text-')}`} />
                            <span className={`text-xs font-medium ${colorClass.replace('bg-', 'text-')}`}>
                              {pillar.split(' & ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`transition-all duration-300 ${
                    hoveredBox === box.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}>
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/60">Made in France</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">En stock</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-kalam font-bold text-foreground mb-2">
              🎨 Personnalisation Disponible
            </h3>
            <p className="text-foreground/70 text-sm">
              Toutes nos box peuvent être personnalisées selon vos besoins spécifiques. 
              Contactez-nous pour créer votre box sur mesure !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxGallery;