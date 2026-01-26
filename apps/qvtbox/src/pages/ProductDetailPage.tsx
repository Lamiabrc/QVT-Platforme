import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import ProductReviews from '@/components/ProductReviews';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { type Product, type ProductVariant } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeft
} from 'lucide-react';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name, slug),
            images:product_images(*),
            variants:product_variants(*),
            reviews:product_reviews(*),
            tags:product_tags(*)
          `)
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (error) throw error;

        const formattedProduct: Product = {
          ...data,
          images: data.images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          variants: data.variants?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          reviews: data.reviews?.filter((r: any) => r.is_approved).sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ) || [],
          tags: data.tags || [],
          category: data.category ? {
            ...data.category,
            id: data.category_id || '',
            description: null,
            image_url: null,
            sort_order: 0
          } : undefined
        };

        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Produit non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const calculatePrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const modifier = selectedVariant?.price_modifier || 0;
    return basePrice + modifier;
  };

  const getCurrentStock = () => {
    if (!product) return 0;
    if (selectedVariant) {
      return selectedVariant.inventory_quantity;
    }
    return product.inventory_quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
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
    
    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier.`,
    });
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

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (!product?.images?.length) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/boutique')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la boutique
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = getCurrentStock() <= 0;
  const isLowStock = getCurrentStock() <= 5 && getCurrentStock() > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/boutique')}
              className="p-0 h-auto font-normal"
            >
              Boutique
            </Button>
            <span>/</span>
            {product.category && (
              <>
                <span>{product.category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img 
                      src={product.images[selectedImageIndex].image_url} 
                      alt={product.images[selectedImageIndex].alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation arrows */}
                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={() => handleImageChange('prev')}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={() => handleImageChange('next')}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
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
                </div>
              </div>

              {/* Image thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === selectedImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground mb-4">{product.origin || 'France'}</p>
                
                {/* Rating */}
                {product.average_rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(product.average_rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.average_rating.toFixed(1)} ({product.review_count} avis)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {calculatePrice().toFixed(2)}€
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {product.compare_at_price.toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>

              {/* Short description */}
              {product.short_description && (
                <p className="text-muted-foreground mb-6">
                  {product.short_description}
                </p>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Options:</label>
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
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        #{tag.tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <Button 
                  className="flex-1" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                </Button>
                
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5" />
                </Button>
                
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Stock info */}
              {isLowStock && (
                <p className="text-orange-600 text-sm mb-6">
                  ⚠️ Plus que {getCurrentStock()} en stock !
                </p>
              )}

              {/* Guarantees */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span>Livraison gratuite dès 80€</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                  <span>Retour sous 30 jours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({product.review_count})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    {product.description ? (
                      <p className="whitespace-pre-line">{product.description}</p>
                    ) : (
                      <p className="text-muted-foreground">
                        Aucune description détaillée disponible pour ce produit.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Informations produit</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Origine:</span>
                          <span>{product.origin || 'France'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Catégorie:</span>
                          <span>{product.category?.name || 'Non spécifiée'}</span>
                        </div>
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Options disponibles:</span>
                            <span>{product.variants.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {product.artisan_info && (
                      <div>
                        <h4 className="font-medium mb-3">Artisan</h4>
                        <p className="text-sm text-muted-foreground">{product.artisan_info}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews || []}
                averageRating={product.average_rating}
                reviewCount={product.review_count}
                onReviewAdded={() => {
                  // Refresh product data
                  window.location.reload();
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CartSidebar />
      <Footer />
    </div>
  );
};

export default ProductDetailPage;