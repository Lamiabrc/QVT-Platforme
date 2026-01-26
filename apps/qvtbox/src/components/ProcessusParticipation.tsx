import { FileSignature, Users, Package } from "lucide-react";

const ProcessusParticipation = () => {
  const steps = [
    {
      number: "01",
      title: "L'entreprise signe une collaboration simple",
      description: "Un contrat clair et transparent pour démarrer le partenariat",
      icon: FileSignature,
      color: "text-primary"
    },
    {
      number: "02", 
      title: "Les salariés expriment leurs préférences",
      description: "Alimentaire, hygiène, cosmétique, ergonomie, bien-être - chacun fait entendre sa voix",
      icon: Users,
      color: "text-secondary"
    },
    {
      number: "03",
      title: "QVT Box construit les box adaptées",
      description: "En fonction des choix collectifs → utilité immédiate, adhésion garantie",
      icon: Package,
      color: "text-accent-foreground"
    }
  ];

  return (
    <section className="py-20 px-6 section-professional">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
            Un processus <span className="text-primary">clair et participatif</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-4xl mx-auto font-lato leading-relaxed">
            Une démarche simple et transparente qui place les salariés au cœur des décisions
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Numéro et icône */}
                <div className="flex-shrink-0 text-center">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold font-inter mb-4">
                    {step.number}
                  </div>
                  <step.icon className={`w-8 h-8 ${step.color} mx-auto`} />
                </div>

                {/* Contenu */}
                <div className="flex-1 card-professional p-8 text-center md:text-left">
                  <h3 className="font-inter font-bold text-2xl text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-lg leading-relaxed font-lato">
                    {step.description}
                  </p>
                </div>

                {/* Flèche de connexion (sauf pour le dernier) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-8 h-8 text-accent-foreground">
                    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card-professional p-8 max-w-4xl mx-auto">
            <p className="text-lg text-secondary font-medium font-lato">
              Résultat : une solution qui répond vraiment aux attentes des équipes, 
              avec une adhésion forte et des bénéfices immédiats pour tous.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessusParticipation;