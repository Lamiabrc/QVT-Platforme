const WhyQVTBoxSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-8">
            Pourquoi <span className="text-primary">QVT Box</span> ?
          </h2>
          
          <div className="card-bubble p-8 md:p-12 text-left space-y-6">
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
              La France sait s'occuper de ses salariés. Cette exigence sociale est notre <strong className="text-primary">fierté</strong> — 
              et désormais notre <strong className="text-secondary">force exportable</strong>.
            </p>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
              <span className="text-primary font-semibold">QVT Box</span> transforme cette valeur en action concrète :
            </p>
            <ul className="space-y-3 text-base md:text-lg text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Écouter vraiment</strong> les salariés ("Ça va ?" mesuré en score QVT 1→15)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong>Prévenir les RPS</strong> et agir rapidement (alertes, tendances anonymisées)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span><strong>Apporter des réponses concrètes</strong> via des box utiles, Made in France (&lt; 10 €)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary mt-1">•</span>
                <span><strong>Ouvrir un rayonnement international</strong> à nos fournisseurs partenaires</span>
              </li>
            </ul>
            <p className="text-base md:text-lg text-foreground/70 italic pt-4 border-t border-border/50">
              Entreprise par entreprise, box après box, nous faisons grandir une économie de la considération.
            </p>
          </div>
          
          {/* Bulles décoratives */}
          <div className="relative mt-8">
            <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gradient-bubble rounded-full animate-float opacity-20"></div>
            <div className="absolute -bottom-2 right-1/3 w-6 h-6 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-0 right-1/4 w-10 h-10 bg-accent/15 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyQVTBoxSection;