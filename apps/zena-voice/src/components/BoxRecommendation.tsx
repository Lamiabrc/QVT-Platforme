import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { QVTBox } from './BoxRecommendation.types';

interface BoxRecommendationProps {
  boxes: QVTBox[];
  onSelectBox?: (box: QVTBox) => void;
}

const BoxRecommendation = ({ boxes, onSelectBox }: BoxRecommendationProps) => {
  if (boxes.length === 0) return null;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Titre section */}
      <div className="flex items-center gap-3 text-foreground">
        <Sparkles className="w-5 h-5 text-secondary animate-luciole" />
        <h3 className="text-lg md:text-xl font-semibold tracking-wide">
          Recommandations QVT Box ✨
        </h3>
      </div>

      {/* Grille des box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boxes.map((box, index) => (
          <Card
            key={box.id}
            onClick={() => onSelectBox?.(box)}
            className={`relative p-6 rounded-2xl border border-border cursor-pointer
                        bg-card/80 backdrop-blur-sm transition-smooth overflow-hidden
                        hover:shadow-glow hover:scale-[1.02] animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Effet halo au survol */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-smooth">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5B4B8A]/10 to-[#4FD1C5]/10 blur-3xl animate-halo" />
            </div>

            {/* Contenu principal */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-float">{box.emoji}</span>
                <div>
                  <h4 className="font-semibold text-lg text-foreground">
                    {box.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">{box.category}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {box.description}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full border-secondary/50 text-secondary font-medium
                           hover:bg-gradient-to-r hover:from-[#5B4B8A] hover:to-[#4FD1C5]
                           hover:text-white transition-bounce"
              >
                En savoir plus
              </Button>
            </div>

            {/* Effet bulle lumineux */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-secondary/30 blur-3xl animate-breathe-slow" />
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-primary/20 blur-3xl animate-breathe-slow" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BoxRecommendation;
