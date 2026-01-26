import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { type Product, type ProductVariant } from '@/hooks/useProducts';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  showWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showQuickView = false, 
  showWishlist = false 
}) => {
  const { addItem, setIsOpen } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );

  const calculatePrice = () => {
    const basePrice = product.price;
    const modifier = selectedVariant?.price_modifier || 0;
    return basePrice + modifier;
  };

  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.inventory_quantity;
    }
    return product.inventory_quantity;
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePrice();
    const variantName = selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : '';
    
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      name: product.name + (variantName ? ` (${variantName})` : ''),
      price: `${finalPrice.toFixed(2)}€`,
      origin: product.origin || 'France',
      category: product.category?.name || 'Produit'
    });
    setIsOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i === Math.floor(rating) && rating % 1 >= 0.5
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const isOutOfStock = getCurrentStock() <= 0;
  const isLowStock = getCurrentStock() <= 5 && getCurrentStock() > 0;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Quick actions overlay */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-2">
          {showWishlist && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          )}
          {showQuickView && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Product image */}
      <Link to={`/boutique/produit/${product.slug}`} className="block">
        <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].image_url} 
              alt={product.images[0].alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🎁
            </div>
          )}
          
          {/* Status badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-accent text-white">
                ⭐ Coup de cœur
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive">
                Rupture de stock
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-orange-500 text-white">
                Stock limité
              </Badge>
            )}
            {product.compare_at_price && product.compare_at_price > product.price && (
              <Badge className="bg-red-500 text-white">
                -{Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%
              </Badge>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link to={`/boutique/produit/${product.slug}`}>
              <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {product.origin || 'France'}
            </p>
          </div>
          <div className="text-right ml-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-primary">
                {calculatePrice().toFixed(2)}€
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-muted-foreground line-through ml-1">
                  {product.compare_at_price.toFixed(2)}€
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rating and reviews */}
        {product.average_rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {renderStars(product.average_rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.average_rating.toFixed(1)} ({product.review_count} avis)
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {product.short_description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Product variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <Select 
              value={selectedVariant?.id || ''} 
              onValueChange={(value) => {
                const variant = product.variants?.find(v => v.id === value);
                setSelectedVariant(variant || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une option" />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.name}: {variant.value}
                    {variant.price_modifier !== 0 && (
                      <span className="ml-2 text-sm">
                        ({variant.price_modifier > 0 ? '+' : ''}{variant.price_modifier.toFixed(2)}€)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{product.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
        </Button>

        {/* Stock indicator */}
        {isLowStock && (
          <p className="text-xs text-orange-600 mt-2 text-center">
            Plus que {getCurrentStock()} en stock !
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;