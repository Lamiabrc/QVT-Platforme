import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Users, 
  Calendar, 
  Heart, 
  Zap, 
  Coffee,
  Gift,
  Sparkles,
  ShoppingCart,
  Eye
} from 'lucide-react';

interface BoxType {
  id: string;
  name: string;
  description: string;
  icon: any;
  basePrice: number;
  themes: string[];
  color: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export const BoxConfigurator = () => {
  const [selectedBox, setSelectedBox] = useState<string>('wellbeing');
  const [teamSize, setTeamSize] = useState(10);
  const [occasion, setOccasion] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const boxTypes: BoxType[] = [
    {
      id: 'wellbeing',
      name: 'Box Bien-être',
      description: 'Détente et sérénité pour vos équipes',
      icon: Heart,
      basePrice: 35,
      themes: ['Relaxation', 'Aromathérapie', 'Tisanes bio', 'Accessoires zen'],
      color: 'text-rose-500'
    },
    {
      id: 'energy',
      name: 'Box Énergie',
      description: 'Dynamisme et vitalité au quotidien',
      icon: Zap,
      basePrice: 32,
      themes: ['Snacks énergétiques', 'Boissons naturelles', 'Compléments', 'Accessoires sport'],
      color: 'text-orange-500'
    },
    {
      id: 'coffee',
      name: 'Box Café & Gourmandise',
      description: 'Moments conviviaux et saveurs authentiques',
      icon: Coffee,
      basePrice: 38,
      themes: ['Cafés d\'artisan', 'Thés premium', 'Biscuits artisanaux', 'Accessoires'],
      color: 'text-amber-600'
    },
    {
      id: 'celebration',
      name: 'Box Événementielle',
      description: 'Célébrez vos succès et moments spéciaux',
      icon: Gift,
      basePrice: 45,
      themes: ['Produits festifs', 'Décoration', 'Animations', 'Souvenirs personnalisés'],
      color: 'text-purple-500'
    }
  ];

  const sampleProducts: Product[] = [
    { id: '1', name: 'Huile essentielle Lavande', price: 12, category: 'wellbeing', image: '/api/placeholder/100/100' },
    { id: '2', name: 'Tisane Relaxation Bio', price: 8, category: 'wellbeing', image: '/api/placeholder/100/100' },
    { id: '3', name: 'Barres énergétiques', price: 15, category: 'energy', image: '/api/placeholder/100/100' },
    { id: '4', name: 'Café Guatemala Bio', price: 18, category: 'coffee', image: '/api/placeholder/100/100' },
    { id: '5', name: 'Thé Earl Grey Premium', price: 14, category: 'coffee', image: '/api/placeholder/100/100' },
    { id: '6', name: 'Chocolats artisanaux', price: 22, category: 'celebration', image: '/api/placeholder/100/100' }
  ];

  const currentBox = boxTypes.find(box => box.id === selectedBox)!;
  const filteredProducts = sampleProducts.filter(p => p.category === selectedBox);
  
  const calculateTotal = () => {
    const baseTotal = currentBox.basePrice * teamSize;
    const productsTotal = selectedProducts.reduce((total, productId) => {
      const product = sampleProducts.find(p => p.id === productId);
      return total + (product ? product.price * teamSize : 0);
    }, 0);
    return baseTotal + productsTotal;
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-inter">
            <Package className="w-6 h-6 text-primary" />
            Configurateur de Box
          </CardTitle>
          <p className="text-muted-foreground font-lato">
            Créez une box personnalisée pour votre équipe
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Type de Box */}
          <div>
            <Label className="text-lg font-medium font-inter mb-4 block">
              Choisissez votre thématique
            </Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {boxTypes.map((box) => {
                const IconComponent = box.icon;
                return (
                  <Card
                    key={box.id}
                    className={`cursor-pointer transition-all border-2 card-hover ${
                      selectedBox === box.id 
                        ? 'border-primary shadow-primary/20' 
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedBox(box.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className={`w-8 h-8 mx-auto mb-2 ${box.color}`} />
                      <h3 className="font-medium text-sm font-inter mb-1">{box.name}</h3>
                      <p className="text-xs text-muted-foreground font-lato mb-2">
                        {box.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        À partir de {box.basePrice}€
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Configuration */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="teamSize" className="font-inter">Taille de l'équipe</Label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="teamSize"
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  min="1"
                  max="500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="occasion" className="font-inter">Occasion (optionnel)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="occasion"
                  placeholder="Ex: Fête de fin d'année, nouvel an..."
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Message personnalisé */}
          <div>
            <Label htmlFor="message" className="font-inter">Message personnalisé</Label>
            <Textarea
              id="message"
              placeholder="Ajoutez un message personnel pour accompagner votre box..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Produits complémentaires */}
          <div>
            <Label className="text-lg font-medium font-inter mb-4 block">
              Produits complémentaires
            </Label>
            <div className="grid md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all border-2 card-hover ${
                    selectedProducts.includes(product.id)
                      ? 'border-secondary shadow-secondary/20'
                      : 'border-transparent hover:border-secondary/50'
                  }`}
                  onClick={() => toggleProduct(product.id)}
                >
                  <CardContent className="p-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm font-inter mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-medium">
                        +{product.price}€
                      </span>
                      {selectedProducts.includes(product.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Ajouté
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="card-professional border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-inter">
            <Eye className="w-5 h-5 text-primary" />
            Aperçu de votre box
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-background-soft rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full bg-primary/10`}>
                <currentBox.icon className={`w-6 h-6 ${currentBox.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-inter">{currentBox.name}</h3>
                <p className="text-muted-foreground font-lato">{currentBox.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-lato">Équipe de {teamSize} personnes</span>
                <Badge variant="outline">{teamSize} × {currentBox.basePrice}€</Badge>
              </div>
              
              {selectedProducts.length > 0 && (
                <div className="space-y-2">
                  <span className="font-medium font-inter">Produits ajoutés :</span>
                  {selectedProducts.map(productId => {
                    const product = sampleProducts.find(p => p.id === productId)!;
                    return (
                      <div key={productId} className="flex justify-between text-sm">
                        <span className="font-lato">{product.name}</span>
                        <span className="text-secondary">{teamSize} × {product.price}€</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {occasion && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-lato">Occasion : {occasion}</span>
                </div>
              )}
              
              {message && (
                <div className="bg-background rounded p-3 border border-accent/20">
                  <p className="text-sm font-lato italic">"{message}"</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-primary font-inter">
                {calculateTotal()}€
              </span>
              <p className="text-sm text-muted-foreground font-lato">
                Livraison incluse
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="font-inter">
                <Sparkles className="w-4 h-4 mr-2" />
                Obtenir un devis
              </Button>
              <Button className="btn-primary font-inter">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Commander maintenant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};