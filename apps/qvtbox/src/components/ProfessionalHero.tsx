import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Users, FileCheck, Shield } from "lucide-react";
import OnboardingModal from "./OnboardingModal";

const ProfessionalHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowOnboarding(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero pt-20">
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
          {/* Logo - Design original préservé */}
          <div className="mb-12">
            <img 
              src="/logo-qvt.jpeg" 
              alt="QVT Box Logo"
              className="w-32 h-32 mx-auto mb-8 object-contain drop-shadow-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-32 h-32 mx-auto mb-8 flex items-center justify-center bg-primary rounded-full text-white font-inter font-bold text-lg">
              QVT BOX
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-16 space-y-8">
            <h1 className="font-inter text-4xl md:text-6xl font-bold text-foreground leading-tight">
              <span className="text-primary">QVT Box</span>
            </h1>
            
            <div className="card-professional p-8 md:p-12 max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-lato">
                Stress, charge de travail, pénibilité, manque de reconnaissance… 
                Ces réalités du quotidien pèsent sur les salariés. 
              </p>
              <p className="text-xl md:text-2xl text-primary font-medium mt-4 font-lato">
                QVT Box est une solution simple et concrète,
                que les entreprises consacrent uniquement au bien-être des équipes.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate("/box")}
                className="btn-primary text-lg px-10 py-4 font-inter"
              >
                <Users className="w-5 h-5 mr-2" /> 
                Devenir entreprise partenaire
              </Button>
              
              <Button 
                onClick={() => navigate("/boutique")}
                className="btn-secondary text-lg px-8 py-4 font-inter"
              >
                <Shield className="w-5 h-5 mr-2" /> 
                Soutenir mes équipes concrètement
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate("/saas")}
                className="btn-outline text-lg px-8 py-4 font-inter"
              >
                <FileCheck className="w-5 h-5 mr-2" /> 
                Prévenir les risques et respecter mes obligations
              </Button>
            </div>
          </div>
        </div>
      </section>

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
};

export default ProfessionalHero;