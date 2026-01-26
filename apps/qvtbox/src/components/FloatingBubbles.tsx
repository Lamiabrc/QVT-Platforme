const FloatingBubbles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>
      <div className="bubble bubble-5"></div>
      
      {/* Bulles additionnelles pour plus de poésie */}
      <div className="absolute w-6 h-6 rounded-full bg-gradient-bubble opacity-10 top-[30%] right-[20%] animate-float animate-pulse-soft" style={{ animationDelay: '5s' }}></div>
      <div className="absolute w-10 h-10 rounded-full bg-gradient-bubble opacity-15 bottom-[40%] left-[60%] animate-float animate-glow" style={{ animationDelay: '7s' }}></div>
      <div className="absolute w-14 h-14 rounded-full bg-gradient-bubble opacity-10 top-[70%] right-[40%] animate-float animate-pulse-soft" style={{ animationDelay: '2.5s' }}></div>
      
      {/* Nouvelles bulles avec animations variées */}
      <div className="absolute w-8 h-8 rounded-full bg-gradient-bubble opacity-20 top-[15%] left-[15%] animate-wiggle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-12 h-12 rounded-full bg-gradient-bubble opacity-15 bottom-[20%] right-[25%] animate-pulse-soft" style={{ animationDelay: '3s' }}></div>
      <div className="absolute w-16 h-16 rounded-full bg-gradient-bubble opacity-10 top-[50%] left-[80%] animate-float animate-glow" style={{ animationDelay: '4s' }}></div>
      <div className="absolute w-4 h-4 rounded-full bg-gradient-bubble opacity-25 top-[80%] left-[30%] animate-wiggle" style={{ animationDelay: '6s' }}></div>
    </div>
  );
};

export default FloatingBubbles;