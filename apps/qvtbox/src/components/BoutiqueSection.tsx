import { Link } from "react-router-dom";
import boutiqueImage from "@/assets/boutique-artisan.jpg";

const BoutiqueSection = () => {
  const themes = [
    { name: "Bien-être", description: "Tisanes, huiles essentielles, coussins" },
    { name: "Ergonomie", description: "Supports, repose-pieds, accessoires" },
    { name: "Énergie", description: "Encas bio, thés dynamisants" },
    { name: "Local", description: "Artisanat de nos régions françaises" }
  ];

  return (
    <section className="section-gradient py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-6">
            La <span className="text-accent">Boutique</span> du cœur
          </h2>
          <p className="text-primary font-medium mb-6 text-sm uppercase tracking-wide">
            → Découvrir le savoir-faire local
          </p>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-light leading-relaxed">
            Chaque produit a été sélectionné chez nos artisans partenaires. 
            Parce que prendre soin de soi et de ses équipes, 
            c'est aussi soutenir le savoir-faire français.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6 mb-8">
              {themes.map((theme, index) => (
                <div key={index} className="card-bubble p-6 text-center hover:shadow-floating transition-all duration-300">
                  <h4 className="font-kalam font-bold text-lg text-accent mb-3">{theme.name}</h4>
                  <p className="text-sm text-foreground/70">{theme.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center lg:text-left">
              <p className="text-lg text-foreground/70 mb-6 font-light">
                Des carnets reliés à la main aux tisanes de nos montagnes, 
                en passant par les coussins brodés de nos grands-mères... 
                Découvrez une sélection authentique et chaleureuse.
              </p>
              
              <Link to="/boutique" className="btn-bubble">
                Découvrir le savoir-faire local
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="relative">
              <img 
                src={boutiqueImage} 
                alt="Atelier artisanal français avec produits wellness naturels" 
                className="w-full rounded-2xl shadow-bubble"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-sm font-medium text-accent">🇫🇷 Made in France</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueSection;