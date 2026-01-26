import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Filter, 
  Search, 
  X, 
  MapPin, 
  Star, 
  Euro,
  Tag,
  SlidersHorizontal
} from 'lucide-react';

interface FilterState {
  search: string;
  priceRange: [number, number];
  regions: string[];
  categories: string[];
  ratings: number[];
  certifications: string[];
  availability: string;
  sortBy: string;
}

interface AdvancedProductFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
}

export const AdvancedProductFilters = ({ onFiltersChange, productCount }: AdvancedProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, 100],
    regions: [],
    categories: [],
    ratings: [],
    certifications: [],
    availability: 'all',
    sortBy: 'relevance'
  });

  const regions = [
    'Provence-Alpes-Côte d\'Azur',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Auvergne-Rhône-Alpes',
    'Bourgogne-Franche-Comté',
    'Bretagne',
    'Normandie',
    'Grand Est'
  ];

  const categories = [
    'Bien-être',
    'Ergonomie',
    'Énergie',
    'Terroir Local',
    'Aromathérapie',
    'Tisanes & Thés',
    'Accessoires',
    'Gourmandises'
  ];

  const certifications = [
    'Bio',
    'Made in France',
    'Artisanal',
    'Commerce Équitable',
    'Éco-conçu',
    'AOP/IGP',
    'Label Rouge'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'distance', label: 'Proximité' }
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const toggleArrayFilter = (filterType: keyof FilterState, value: string) => {
    const currentArray = filters[filterType] as string[];
    const updated = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [filterType]: updated });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      priceRange: [0, 100],
      regions: [],
      categories: [],
      ratings: [],
      certifications: [],
      availability: 'all',
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || 
    filters.regions.length > 0 || 
    filters.categories.length > 0 || 
    filters.ratings.length > 0 || 
    filters.certifications.length > 0 ||
    filters.availability !== 'all' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100;

  return (
    <Card className="card-professional">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-inter">
            <Filter className="w-5 h-5 text-primary" />
            Filtres avancés
            {hasActiveFilters && (
              <Badge variant="secondary">{productCount} produits</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-inter"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {isExpanded ? 'Réduire' : 'Développer'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recherche */}
        <div>
          <Label className="font-inter mb-2 block">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Produit, artisan, région..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tri */}
        <div className="flex items-center gap-4">
          <Label className="font-inter whitespace-nowrap">Trier par :</Label>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.sortBy === option.value ? "default" : "outline"}
                onClick={() => updateFilters({ sortBy: option.value })}
                size="sm"
                className="font-inter"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Prix */}
            <div>
              <Label className="font-inter mb-3 block">
                <Euro className="inline w-4 h-4 mr-1" />
                Fourchette de prix : {filters.priceRange[0]}€ - {filters.priceRange[1]}€
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Régions */}
            <div>
              <Label className="font-inter mb-3 block">
                <MapPin className="inline w-4 h-4 mr-1" />
                Régions
              </Label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button
                    key={region}
                    variant={filters.regions.includes(region) ? "secondary" : "outline"}
                    onClick={() => toggleArrayFilter('regions', region)}
                    size="sm"
                    className="font-inter text-xs"
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>

            {/* Catégories */}
            <div>
              <Label className="font-inter mb-3 block">
                <Tag className="inline w-4 h-4 mr-1" />
                Catégories
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.categories.includes(category) ? "secondary" : "outline"}
                    onClick={() => toggleArrayFilter('categories', category)}
                    size="sm"
                    className="font-inter"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="font-inter mb-3 block">
                <Star className="inline w-4 h-4 mr-1" />
                Note minimum
              </Label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.ratings.includes(rating) ? "secondary" : "outline"}
                    onClick={() => toggleArrayFilter('ratings', rating.toString())}
                    size="sm"
                    className="font-inter"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <Label className="font-inter mb-3 block">Certifications & Labels</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={filters.certifications.includes(cert)}
                      onCheckedChange={() => toggleArrayFilter('certifications', cert)}
                    />
                    <Label htmlFor={cert} className="text-sm font-lato cursor-pointer">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilité */}
            <div>
              <Label className="font-inter mb-3 block">Disponibilité</Label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'Tous' },
                  { value: 'in-stock', label: 'En stock' },
                  { value: 'pre-order', label: 'Pré-commande' },
                  { value: 'coming-soon', label: 'Bientôt disponible' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.availability === option.value ? "secondary" : "outline"}
                    onClick={() => updateFilters({ availability: option.value })}
                    size="sm"
                    className="font-inter"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-muted-foreground font-inter"
            >
              <X className="w-4 h-4 mr-2" />
              Effacer les filtres
            </Button>
            
            <div className="flex gap-2">
              {filters.regions.length > 0 && (
                <Badge variant="secondary">
                  {filters.regions.length} région{filters.regions.length > 1 ? 's' : ''}
                </Badge>
              )}
              {filters.categories.length > 0 && (
                <Badge variant="secondary">
                  {filters.categories.length} catégorie{filters.categories.length > 1 ? 's' : ''}
                </Badge>
              )}
              {filters.certifications.length > 0 && (
                <Badge variant="secondary">
                  {filters.certifications.length} label{filters.certifications.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};