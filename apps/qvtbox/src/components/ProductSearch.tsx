import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useCategories } from '@/hooks/useProducts';
import { useSearchFilters, type SearchFilters } from '@/hooks/useProductSearch';
import { Search, Filter, X, Star } from 'lucide-react';

interface ProductSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  showAdvancedFilters?: boolean;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onFiltersChange, 
  initialFilters = {},
  showAdvancedFilters = true 
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  
  const { categories } = useCategories();
  const { origins, priceRange, tags, loading: filtersLoading } = useSearchFilters();

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const removeTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addTag = (tag: string) => {
    if (!filters.tags?.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher des produits..."
            value={filters.query || ''}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showAdvancedFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Quick sort */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Trier par:</span>
        <Select value={filters.sortBy || 'newest'} onValueChange={(value) => updateFilter('sortBy', value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="name">Nom A-Z</SelectItem>
            <SelectItem value="price_asc">Prix croissant</SelectItem>
            <SelectItem value="price_desc">Prix décroissant</SelectItem>
            <SelectItem value="rating">Mieux notés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Catégorie: {categories.find(c => c.slug === filters.category)?.name}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('category', undefined)} 
              />
            </Badge>
          )}
          
          {filters.origin && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Origine: {filters.origin}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('origin', undefined)} 
              />
            </Badge>
          )}
          
          {filters.rating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.rating}+ <Star className="w-3 h-3" />
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('rating', undefined)} 
              />
            </Badge>
          )}
          
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Prix: {filters.minPrice || 0}€ - {filters.maxPrice || '∞'}€
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => {
                  updateFilter('minPrice', undefined);
                  updateFilter('maxPrice', undefined);
                }} 
              />
            </Badge>
          )}
          
          {filters.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeTag(tag)} 
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced filters panel */}
      {showAdvancedFilters && showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres avancés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Catégorie</label>
              <Select value={filters.category || ''} onValueChange={(value) => updateFilter('category', value || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Origin filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Origine</label>
              <Select value={filters.origin || ''} onValueChange={(value) => updateFilter('origin', value || undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les origines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les origines</SelectItem>
                  {origins.map((origin) => (
                    <SelectItem key={origin} value={origin}>
                      {origin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price range */}
            {priceRange.max > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Prix: {filters.minPrice || priceRange.min}€ - {filters.maxPrice || priceRange.max}€
                </label>
                <div className="px-2">
                  <Slider
                    min={priceRange.min}
                    max={priceRange.max}
                    step={1}
                    value={[filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]}
                    onValueChange={(values) => {
                      updateFilter('minPrice', values[0]);
                      updateFilter('maxPrice', values[1]);
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Rating filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Note minimum</label>
              <div className="flex gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter('rating', filters.rating === rating ? undefined : rating)}
                    className="flex items-center gap-1"
                  >
                    {rating} <Star className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular tags */}
            {!filtersLoading && tags.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Tags populaires</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={filters.tags?.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (filters.tags?.includes(tag)) {
                          removeTag(tag);
                        } else {
                          addTag(tag);
                        }
                      }}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductSearch;