import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { ProductReview } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Star, ThumbsUp, MessageSquare, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductReviewsProps {
  productId: string;
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
  onReviewAdded?: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  averageRating,
  reviewCount,
  onReviewAdded
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClass} ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i === Math.floor(rating) && rating % 1 >= 0.5
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour laisser un avis.",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Commentaire requis",
        description: "Veuillez saisir un commentaire.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          title: newReview.title.trim() || null,
          comment: newReview.comment.trim(),
        });

      if (error) throw error;

      toast({
        title: "Avis ajouté",
        description: "Votre avis a été publié avec succès.",
      });

      setNewReview({ rating: 5, title: '', comment: '' });
      setIsDialogOpen(false);
      onReviewAdded?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre avis. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Ratings overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avis clients ({reviewCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(averageRating, 'lg')}
              </div>
              <p className="text-muted-foreground">Basé sur {reviewCount} avis</p>
            </div>

            {/* Rating distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ 
                        width: `${reviewCount > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviewCount) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add review button */}
          <div className="mt-6 text-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Laisser un avis
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Laisser un avis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Rating stars */}
                  <div>
                    <Label>Note</Label>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              i < newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="review-title">Titre (optionnel)</Label>
                    <Input
                      id="review-title"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Résumez votre expérience..."
                      maxLength={100}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <Label htmlFor="review-comment">Commentaire *</Label>
                    <Textarea
                      id="review-comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Partagez votre expérience avec ce produit..."
                      maxLength={1000}
                      rows={4}
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Publication...' : 'Publier'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Derniers avis</h3>
          {reviews.slice(0, 5).map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {review.user_id.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {renderStars(review.rating, 'sm')}
                        </div>
                        {review.is_verified_purchase && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Achat vérifié
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium mb-2">{review.title}</h4>
                )}

                <p className="text-muted-foreground mb-3">{review.comment}</p>

                {review.helpful_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-auto p-0"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Utile ({review.helpful_count})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {reviews.length > 5 && (
            <Button variant="outline" className="w-full">
              Voir tous les avis ({reviews.length})
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;