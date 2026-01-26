import { User, UserRound } from 'lucide-react';

interface AvatarGenderSelectorProps {
  gender: 'female' | 'male';
  onGenderChange: (gender: 'female' | 'male') => void;
}

const AvatarGenderSelector = ({ gender, onGenderChange }: AvatarGenderSelectorProps) => {
  const handleChange = (selected: 'female' | 'male') => {
    onGenderChange(selected);

    // Feedback vocal doux à chaque bascule
    const voice = new SpeechSynthesisUtterance(
      selected === 'female'
        ? 'Bonjour, je suis ZENA, votre coach bien-être.'
        : 'Bonjour, je suis ZENO, votre accompagnateur QVT.'
    );
    voice.lang = 'fr-FR';
    voice.rate = 0.95;
    voice.pitch = selected === 'female' ? 1.1 : 0.95;
    voice.volume = 0.9;
    speechSynthesis.speak(voice);
  };

  return (
    <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md rounded-full p-2 border border-border shadow-soft animate-slide-up">
      {/* Bouton ZENA */}
      <button
        onClick={() => handleChange('female')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-bounce relative ${
          gender === 'female'
            ? 'bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white shadow-glow scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
        aria-label="ZENA - Féminin"
      >
        <User className={`w-4 h-4 ${gender === 'female' ? 'animate-luciole' : ''}`} />
        <span className="text-sm font-semibold tracking-wide">ZENA</span>
        {gender === 'female' && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#4FD1C5] animate-breathe">
            active
          </span>
        )}
      </button>

      {/* Séparateur visuel (bulle douce) */}
      <div className="w-[1px] h-8 bg-gradient-to-b from-primary/30 to-secondary/30 mx-1 rounded-full" />

      {/* Bouton ZENO */}
      <button
        onClick={() => handleChange('male')}
        className={`flex items-center gap-2 px-5 py-2 rounded-full transition-bounce relative ${
          gender === 'male'
            ? 'bg-gradient-to-r from-[#4FD1C5] to-[#5B4B8A] text-white shadow-glow scale-105'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
        }`}
        aria-label="ZENO - Masculin"
      >
        <UserRound className={`w-4 h-4 ${gender === 'male' ? 'animate-luciole' : ''}`} />
        <span className="text-sm font-semibold tracking-wide">ZENO</span>
        {gender === 'male' && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#5B4B8A] animate-breathe">
            actif
          </span>
        )}
      </button>
    </div>
  );
};

export default AvatarGenderSelector;
