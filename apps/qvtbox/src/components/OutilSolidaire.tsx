import { MapPin, Handshake, TrendingUp } from "lucide-react";

const OutilSolidaire = () => {
  const values = [
    {
      title: "Produits 100% français et locaux",
      description: "Soutien direct aux artisans et producteurs de nos régions",
      icon: MapPin
    },
    {
      title: "Soutien à l'économie artisanale",
      description: "Promotion des circuits courts et du savoir-faire local",
      icon: Handshake
    },
    {
      title: "Orientation responsable des dépenses",
      description: "Chaque euro investi profite aux salariés et au tissu économique local",
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
            Un outil <span className="text-secondary">solidaire et responsable</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto font-lato leading-relaxed">
            QVT Box s'engage pour une économie responsable qui bénéficie 
            directement aux salariés et au tissu économique français.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="card-professional p-8 text-center hover:shadow-floating transition-all duration-300">
                <div className="flex justify-center mb-6">
                  <IconComponent className="w-16 h-16 text-secondary" />
                </div>
                <h3 className="font-inter font-bold text-xl text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed font-lato">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="card-professional p-8 max-w-4xl mx-auto">
            <p className="text-lg text-foreground font-lato leading-relaxed">
              <span className="text-primary font-medium">Une orientation responsable des dépenses des CSE et des entreprises :</span> 
              {" "}chaque euro investi profite aux salariés et au tissu économique local.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutilSolidaire;