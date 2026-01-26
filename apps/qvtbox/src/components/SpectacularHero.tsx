import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Package, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-spectacular-impact.jpg";
import qvtBoxLogo from "@/assets/qvt-box-logo.png";
import { useEffect, useRef } from "react";

const SpectacularHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}`);
      heroRef.current.style.setProperty('--mouse-y', `${y}`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20"
      style={{
        background: `
          radial-gradient(circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), 
            hsl(var(--primary) / 0.15) 0%, 
            transparent 50%),
          linear-gradient(135deg, 
            hsl(var(--background)) 0%, 
            hsl(var(--primary) / 0.05) 50%, 
            hsl(var(--secondary) / 0.05) 100%)
        `
      }}
    >
      {/* Particules flottantes spectaculaires */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Sparkles 
              className="text-primary" 
              size={Math.random() * 20 + 16}
            />
          </div>
        ))}
      </div>

      {/* Bulles géantes animées */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-bubble opacity-10 rounded-full -top-48 -left-48 animate-pulse-soft"></div>
        <div className="absolute w-80 h-80 bg-gradient-bubble opacity-15 -bottom-40 -right-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-60 h-60 bg-gradient-bubble opacity-20 top-1/4 right-1/3 animate-wiggle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Contenu textuel avec effets */}
          <div className="space-y-8 animate-fade-in">
            {/* Logo avec effet spectaculaire */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse-soft group-hover:blur-3xl transition-all duration-700 scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-accent/30 blur-xl animate-glow scale-105"></div>
              <div className="w-36 h-36 mx-auto lg:mx-0 mb-8 flex items-center justify-center rounded-full shadow-floating hover:shadow-bubble transition-all duration-700 group-hover:scale-110 animate-float relative overflow-hidden">
                <img 
                  src={qvtBoxLogo} 
                  alt="QVT Box Logo"
                  className="relative z-10 w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="relative z-10 text-white font-inter font-bold text-xl">QVT BOX</span>';
                      parent.className += ' bg-gradient-to-br from-primary via-secondary to-accent';
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-center lg:text-left">
                <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse-soft">
                  Box + App
                </span>
                <br />
                <span className="text-3xl lg:text-4xl font-light text-foreground">
                  Le duo gagnant
                </span>
              </h1>
              
              <div className="glass-effect p-8 rounded-3xl shadow-floating backdrop-blur-xl border border-white/20">
                <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-lato">
                  <span className="text-primary font-semibold">Prenez des nouvelles</span> de vos équipes
                  <br />
                  <span className="text-secondary font-semibold">ET offrez-leur</span> un coup de pouce financier
                </p>
              </div>

              <p className="text-lg text-foreground/80 font-light leading-relaxed text-center lg:text-left">
                Notre <span className="text-primary font-medium">app suit le bien-être</span> en temps réel, tandis que nos 
                <span className="text-secondary font-medium"> box apportent un soutien concret</span> avec du pouvoir d'achat personnalisé.
              </p>
            </div>

            {/* Boutons avec effets impressionnants */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/box" className="group">
                <Button className="btn-primary text-lg px-10 py-6 font-inter shadow-floating hover:shadow-bubble transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <Users className="w-6 h-6 mr-3" /> 
                  Découvrir le duo Box + App
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/saas" className="group">
                <Button className="btn-secondary text-lg px-8 py-6 font-inter shadow-floating hover:shadow-bubble transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <BarChart3 className="w-6 h-6 mr-3" /> 
                  Voir une démo complète
                </Button>
              </Link>
            </div>

            {/* Badge avec animation */}
            <div className="flex justify-center lg:justify-start pt-6">
              <div className="glass-effect px-6 py-3 rounded-full border border-primary/30 animate-pulse-soft">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-foreground">+200 entreprises nous font confiance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image spectaculaire avec effets */}
          <div className="relative group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Effets de background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-accent/10 via-transparent to-primary/10 rounded-3xl transform -rotate-2 group-hover:-rotate-4 transition-transform duration-700"></div>
            
            {/* Container de l'image */}
            <div className="relative overflow-hidden rounded-3xl shadow-floating group-hover:shadow-bubble transform group-hover:scale-105 transition-all duration-700">
              {/* Overlay avec effet glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent z-10 backdrop-blur-[1px]"></div>
              
              {/* Image principale */}
              <img 
                src={heroImage} 
                alt="Équipe épanouie dans un environnement de travail moderne et bienveillant" 
                className="w-full h-[500px] lg:h-[600px] object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Effets de lumière */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 via-transparent to-transparent rounded-full blur-2xl animate-pulse-soft"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/30 via-transparent to-transparent rounded-full blur-2xl animate-glow"></div>
              
              {/* Particules sur l'image */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-float"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Statistiques flottantes */}
            <div className="absolute -bottom-6 -left-6 glass-effect p-4 rounded-2xl border border-white/30 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-foreground/70">Satisfaction</div>
            </div>
            
            <div className="absolute -top-6 -right-6 glass-effect p-4 rounded-2xl border border-white/30 animate-wiggle" style={{ animationDelay: '2s' }}>
              <div className="text-2xl font-bold text-secondary">+40%</div>
              <div className="text-sm text-foreground/70">Bien-être</div>
            </div>
          </div>
        </div>

        {/* Call-to-action avec effet scroll */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center gap-2 text-foreground/60 text-sm animate-bounce">
            <span>Découvrez l'impact</span>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      </div>

      {/* Effet de scroll parallax */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default SpectacularHero;
