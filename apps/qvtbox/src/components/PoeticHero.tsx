import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Circle, Package, Brain, ShoppingBag } from "lucide-react";
import FloatingBubbles from "./FloatingBubbles";
import OnboardingModal from "./OnboardingModal";

const PoeticHero = () => {
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <FloatingBubbles />
        
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-hero"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Logo Animation - Design original préservé */}
          <div className="mb-12 animate-slide-in-up relative group">
            <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse-soft group-hover:blur-2xl transition-all duration-500 scale-110"></div>
            <img 
              src="/logo-qvt.jpeg" 
              alt="QVT Box - Logo professionnel"
              className="relative w-40 h-40 mx-auto mb-8 animate-float drop-shadow-2xl hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-500 group-hover:scale-105 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden relative w-40 h-40 mx-auto mb-8 flex items-center justify-center bg-gradient-bubble rounded-full text-foreground font-dancing font-bold text-2xl animate-float shadow-floating">
              QVT BOX
            </div>
          </div>

          {/* Main Question */}
          <div className="mb-12 space-y-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="font-kalam text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-light block text-white/90 mb-6">
              Salut, ça va ?
            </span>
            <span className="text-gradient block mb-2">QVT Box</span>
            <span className="text-xl md:text-2xl lg:text-3xl font-montserrat font-light block text-white/90 mt-4">
              La question qui change tout au travail
            </span>
          </h1>
          </div>

          {/* Professional Description */}
          <div className="mb-16 space-y-6 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto hover:scale-105 transition-all duration-500">
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-inter font-light">
                La Qualité de Vie et les Conditions de Travail, ça se construit ensemble. 
                <span className="text-gradient font-dancing font-semibold text-2xl"> QVT Box </span>
                est un outil que les entreprises consacrent uniquement au bien-être de leurs salariés, 
                transformant les défis du quotidien – stress, pénibilité, surcharge, manque de reconnaissance – 
                en <span className="text-secondary font-medium animate-pulse-soft">solutions concrètes et bienveillantes</span> <Sparkles className="inline w-5 h-5 text-secondary animate-pulse-soft" />
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleStartJourney}
                className="btn-bubble text-lg px-10 py-4 shadow-floating hover:shadow-bubble transform hover:scale-110 transition-all duration-300 animate-pulse-soft font-poppins font-medium"
              >
                <Circle className="w-5 h-5 mr-2" /> Commencer ma bulle
              </Button>
              
              <Button 
                onClick={() => navigate("/box")}
                className="btn-soft text-lg px-8 py-4 hover:scale-105 transition-all duration-300 font-poppins"
                variant="outline"
              >
                <Package className="w-5 h-5 mr-2" /> Offrir une solution de bien-être à mes équipes
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate("/saas")}
                className="bg-gradient-card border border-secondary/20 text-foreground px-8 py-4 rounded-full hover:bg-secondary/10 hover:scale-105 transition-all duration-300 font-inter"
                variant="outline"
              >
                <Brain className="w-5 h-5 mr-2" /> Piloter la QVCT avec simplicité
              </Button>
              
              <Button 
                onClick={() => navigate("/boutique")}
                className="bg-accent/20 border border-accent/30 text-foreground px-8 py-4 rounded-full hover:bg-accent/30 hover:scale-105 transition-all duration-300 font-inter"
                variant="outline"
              >
                <ShoppingBag className="w-5 h-5 mr-2" /> Soutenir mes collaborateurs
              </Button>
            </div>
          </div>

          {/* Subtle Animation Text */}
          <div className="mt-16 animate-fade-in">
            <p className="text-foreground/50 font-light text-sm">
              Votre bien-être mérite toute l'attention du monde
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <div className="w-32 h-32 rounded-full bg-gradient-bubble animate-float"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-24 h-24 rounded-full bg-gradient-bubble animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
};

export default PoeticHero;