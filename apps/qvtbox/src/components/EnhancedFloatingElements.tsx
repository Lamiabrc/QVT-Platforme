import React from 'react';

const EnhancedFloatingElements = () => {
  return (
    <>
      {/* Éléments flottants améliorés */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Grandes bulles de fond */}
        <div className="absolute w-96 h-96 rounded-full bg-gradient-bubble opacity-5 top-[10%] right-[-10%] animate-float animate-glow" style={{ animationDelay: '0s' }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-gradient-bubble opacity-5 bottom-[15%] left-[-15%] animate-float animate-pulse-soft" style={{ animationDelay: '4s' }}></div>
        
        {/* Particules magiques */}
        <div className="absolute w-2 h-2 rounded-full bg-primary/30 top-[25%] left-[20%] animate-wiggle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-secondary/40 top-[45%] right-[30%] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-3 h-3 rounded-full bg-accent/25 bottom-[30%] left-[40%] animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute w-2 h-2 rounded-full bg-primary/35 top-[60%] right-[15%] animate-wiggle" style={{ animationDelay: '5s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-secondary/30 bottom-[50%] left-[70%] animate-pulse-soft" style={{ animationDelay: '6s' }}></div>
        
        {/* Cercles de lumière */}
        <div className="absolute w-64 h-64 rounded-full border border-primary/10 top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-48 h-48 rounded-full border border-secondary/10 top-[70%] right-[20%] animate-glow" style={{ animationDelay: '4s' }}></div>
        
        {/* Lignes de connexion subtiles */}
        <div className="absolute top-[30%] left-[10%] w-32 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[40%] right-[25%] w-24 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent animate-glow" style={{ animationDelay: '5s' }}></div>
      </div>
      
      {/* Effet de profondeur avec parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02] animate-pulse-soft"></div>
      </div>
    </>
  );
};

export default EnhancedFloatingElements;