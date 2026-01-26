import { Link } from "react-router-dom";
import saasImage from "@/assets/saas-dashboard.jpg";

const SaasSection = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-inter font-bold text-foreground mb-6">
                SaaS <span className="text-primary">Prévention des Risques</span>
              </h2>
              <p className="text-xl text-primary font-medium mb-8 leading-relaxed font-lato">
                Prévenir les risques, ce n'est pas une option mais une obligation.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed font-lato">
                QVT Box donne aux RH, CSE et managers des outils fiables : 
                tableaux de bord anonymisés, alertes précoces, export DUERP. 
                Simples à déployer, pensés pour agir.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">Tableaux de bord anonymisés</h3>
                  <p className="text-foreground/70 font-lato">Surveillance collective respectueuse de la confidentialité</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-secondary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">Alertes précoces</h3>
                  <p className="text-foreground/70 font-lato">Détection des signaux de risques psychosociaux</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-accent-foreground rounded-full mt-2"></div>
                <div>
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">Export DUERP</h3>
                  <p className="text-foreground/70 font-lato">Conformité automatisée avec les obligations légales</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-inter font-semibold text-lg text-foreground mb-2">Déploiement simple</h3>
                  <p className="text-foreground/70 font-lato">Interface intuitive, formation minimum requise</p>
                </div>
              </div>
            </div>

            <Link to="/saas" className="btn-primary inline-block font-inter">
              Découvrir nos outils de prévention
            </Link>
          </div>

          <div className="relative">
            <img 
              src={saasImage} 
              alt="Interface SaaS QVT Box - Prévention des risques" 
              className="rounded-lg shadow-floating w-full"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaasSection;