import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Package, Gift, Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import alimentaireImg from '@/assets/products-alimentaire.jpg';
import hygieneImg from '@/assets/products-hygiene.jpg';
import cosmetiqueImg from '@/assets/products-cosmetique.jpg';
import surpriseImg from '@/assets/products-surprise.jpg';

interface BoxPreferences {
  categories: {
    alimentaire: boolean;
    hygiene: boolean;
    cosmetique: boolean;
    surprise: boolean;
  };
  priorities: {
    alimentaire: number;
    hygiene: number;
    cosmetique: number;
    surprise: number;
  };
  budget: number;
  frequency: 'mensuelle' | 'bimestrielle' | 'trimestrielle';
  allergies: string[];
  preferences_notes: string;
}

const CATEGORIES = [
  {
    id: 'alimentaire' as const,
    name: 'Produits Alimentaires',
    description: 'Spécialités locales, produits du terroir français, épicerie fine',
    image: alimentaireImg,
    examples: ['Miel artisanal', 'Confits régionaux', 'Biscuiterie locale', 'Thés et infusions']
  },
  {
    id: 'hygiene' as const,
    name: 'Hygiène & Bien-être',
    description: 'Cosmétiques naturels, savons artisanaux, soins du corps',
    image: hygieneImg,
    examples: ['Savons de Marseille', 'Shampoings solides', 'Dentifrices bio', 'Huiles essentielles']
  },
  {
    id: 'cosmetique' as const,
    name: 'Cosmétiques & Beauté',
    description: 'Soins visage, maquillage français, parfums artisanaux',
    image: cosmetiqueImg,
    examples: ['Crèmes bio', 'Rouge à lèvres français', 'Parfums de Grasse', 'Soins anti-âge']
  },
  {
    id: 'surprise' as const,
    name: 'Surprises & Découvertes',
    description: 'Artisanat français, objets déco, accessoires lifestyle',
    image: surpriseImg,
    examples: ['Accessoires mode', 'Objets déco', 'Livres français', 'Gadgets innovants']
  }
] as const;

const FREQUENCY_OPTIONS = [
  { value: 'mensuelle' as const, label: 'Mensuelle', description: 'Une box chaque mois' },
  { value: 'bimestrielle' as const, label: 'Bimestrielle', description: 'Une box tous les 2 mois' },
  { value: 'trimestrielle' as const, label: 'Trimestrielle', description: 'Une box tous les 3 mois' }
] as const;

const BoxPreferencesCustomizer: React.FC = () => {
  const [preferences, setPreferences] = useState<BoxPreferences>({
    categories: {
      alimentaire: true,
      hygiene: true,
      cosmetique: false,
      surprise: true,
    },
    priorities: {
      alimentaire: 8,
      hygiene: 6,
      cosmetique: 3,
      surprise: 7,
    },
    budget: 35,
    frequency: 'mensuelle',
    allergies: [],
    preferences_notes: ''
  });

  const handleCategoryToggle = (categoryId: keyof BoxPreferences['categories']) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: !prev.categories[categoryId]
      }
    }));
  };

  const handlePriorityChange = (categoryId: keyof BoxPreferences['priorities'], value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [categoryId]: value[0]
      }
    }));
  };

  const handleSavePreferences = () => {
    // Here we would typically save to the backend
    toast.success('Préférences sauvegardées ! Votre prochaine Box Pouvoir d\'Achat sera personnalisée selon vos choix.');
  };

  const getSelectedCategoriesCount = () => {
    return Object.values(preferences.categories).filter(Boolean).length;
  };

  const getEstimatedValue = () => {
    const baseValue = preferences.budget;
    const categoryMultiplier = getSelectedCategoriesCount() * 0.1;
    return Math.round(baseValue * (1 + categoryMultiplier));
  };

  return (
    <Card className="card-professional">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-inter">
          <Package className="w-6 h-6 text-primary" />
          Personnaliser ma Box Pouvoir d'Achat
        </CardTitle>
        <p className="text-foreground/70 font-lato">
          Configurez votre box mensuelle selon vos goûts et besoins. 
          Le contenu est négocié avec l'ensemble des salariés pour garantir la satisfaction de tous.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Budget Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium font-inter">Budget souhaité</Label>
            <Badge variant="outline" className="text-sm">
              {preferences.budget}€ / mois
            </Badge>
          </div>
          <Slider
            value={[preferences.budget]}
            onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value[0] }))}
            max={80}
            min={20}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-foreground/60 mt-2 font-lato">
            <span>20€</span>
            <span>Valeur estimée: {getEstimatedValue()}€</span>
            <span>80€</span>
          </div>
        </div>

        <Separator />

        {/* Frequency Selection */}
        <div>
          <Label className="text-base font-medium font-inter mb-4 block">Fréquence de livraison</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FREQUENCY_OPTIONS.map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all ${
                  preferences.frequency === option.value 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-foreground/5'
                }`}
                onClick={() => setPreferences(prev => ({ ...prev, frequency: option.value }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={preferences.frequency === option.value}
                      onChange={() => {}}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <p className="font-medium font-inter">{option.label}</p>
                      <p className="text-sm text-foreground/70 font-lato">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories Selection */}
        <div>
          <Label className="text-base font-medium font-inter mb-4 block">
            Catégories de produits souhaités ({getSelectedCategoriesCount()}/4)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((category) => {
              const isSelected = preferences.categories[category.id];
              const priority = preferences.priorities[category.id];
              
              return (
                <Card 
                  key={category.id}
                  className={`transition-all ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="bg-white/80 border-white"
                      />
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold font-inter mb-2">{category.name}</h3>
                    <p className="text-sm text-foreground/70 mb-3 font-lato">{category.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <Label className="text-xs font-lato font-medium">Exemples:</Label>
                      <div className="flex flex-wrap gap-1">
                        {category.examples.map((example, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-3 border-t">
                        <Label className="text-sm font-medium font-inter mb-2 block">
                          Priorité: {priority}/10
                        </Label>
                        <Slider
                          value={[priority]}
                          onValueChange={(value) => handlePriorityChange(category.id, value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Summary & Save */}
        <div className="bg-gradient-card p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <Gift className="w-8 h-8 text-primary mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold font-inter mb-2">Récapitulatif de votre Box Pouvoir d'Achat</h3>
              <div className="space-y-2 text-sm font-lato">
                <p><strong>Budget:</strong> {preferences.budget}€/mois • <strong>Fréquence:</strong> {preferences.frequency}</p>
                <p><strong>Catégories sélectionnées:</strong> {getSelectedCategoriesCount()}/4</p>
                <p className="text-primary font-medium">
                  Valeur estimée de votre box: {getEstimatedValue()}€
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium font-lato">Recommandé</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={handleSavePreferences}
            className="btn-primary flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sauvegarder mes préférences
          </Button>
          <Button variant="outline" className="btn-outline">
            Voir un aperçu de ma box
          </Button>
        </div>

        <div className="text-center text-sm text-foreground/60 font-lato">
          <p>
            Vos préférences sont prises en compte lors de la sélection collective des produits.
            <br />
            La composition finale est négociée avec l'ensemble des salariés de votre entreprise.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxPreferencesCustomizer;