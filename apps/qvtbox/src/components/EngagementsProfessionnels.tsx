import { Wrench, AlertTriangle, Wifi, Award } from "lucide-react";

const EngagementsProfessionnels = () => {
  const engagements = [
    {
      title: "Soulager la pénibilité",
      description: "Par des produits adaptés (ergonomie, récupération)",
      icon: Wrench,
      color: "text-secondary"
    },
    {
      title: "Prévenir les risques psychosociaux", 
      description: "Grâce à des alertes simples et un suivi collectif",
      icon: AlertTriangle,
      color: "text-primary"
    },
    {
      title: "Respecter le droit à la déconnexion",
      description: "Avec des outils bienveillants",
      icon: Wifi,
      color: "text-accent-foreground"
    },
    {
      title: "Reconnaître et valoriser les salariés",
      description: "Par des gestes visibles et concrets",
      icon: Award,
      color: "text-secondary"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background-soft">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
            Nos engagements pour <span className="text-primary">les salariés</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {engagements.map((engagement, index) => {
            const IconComponent = engagement.icon;
            return (
              <div key={index} className="card-professional p-6 text-center hover:shadow-floating transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <IconComponent className={`w-12 h-12 ${engagement.color}`} />
                </div>
                <h3 className="font-inter font-bold text-xl text-foreground mb-3">
                  {engagement.title}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed font-lato">
                  {engagement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EngagementsProfessionnels;