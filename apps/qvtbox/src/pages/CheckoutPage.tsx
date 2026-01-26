import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import DemoMode from '@/components/DemoMode';

const CheckoutPage = () => {
  const { items, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Informations personnelles
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Adresse de livraison
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'France',
    
    // Adresse de facturation
    sameAsShipping: true,
    billingAddress: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'France',
  });

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('€', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shippingCost = total >= 80 ? 0 : 6.95;
  const finalTotal = total + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier avant de continuer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.shippingAddress,
        city: formData.shippingCity,
        postalCode: formData.shippingPostalCode,
        country: formData.shippingCountry,
        phone: formData.phone,
      };

      const billingAddress = formData.sameAsShipping ? shippingAddress : {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.billingAddress,
        city: formData.billingCity,
        postalCode: formData.billingPostalCode,
        country: formData.billingCountry,
        phone: formData.phone,
        email: formData.email,
      };

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
        },
      });

      if (error) throw error;

      if (data.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error('URL de checkout non reçue');
      }

    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Navigation />
        <div className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="mx-auto mb-6 text-6xl text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8">
              Découvrez nos produits artisanaux français dans notre boutique.
            </p>
            <Button onClick={() => navigate('/boutique')}>
              Découvrir la boutique
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Finaliser votre commande</h1>
            <p className="text-muted-foreground">
              Quelques informations pour livrer vos produits artisanaux
            </p>
          </div>

          <DemoMode />

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire de commande */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Adresse de livraison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="shippingAddress">Adresse *</Label>
                      <Input
                        id="shippingAddress"
                        required
                        value={formData.shippingAddress}
                        onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingCity">Ville *</Label>
                        <Input
                          id="shippingCity"
                          required
                          value={formData.shippingCity}
                          onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingPostalCode">Code postal *</Label>
                        <Input
                          id="shippingPostalCode"
                          required
                          value={formData.shippingPostalCode}
                          onChange={(e) => handleInputChange('shippingPostalCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full text-lg py-6" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirection vers le paiement...
                    </>
                  ) : (
                    `Payer ${finalTotal.toFixed(2)}€`
                  )}
                </Button>
              </form>
            </div>

            {/* Résumé de commande */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-2 border-b border-border/20">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.origin}</p>
                        <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(parseFloat(item.price.replace('€', '')) * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>
                        {shippingCost === 0 ? (
                          <Badge variant="secondary">Gratuite</Badge>
                        ) : (
                          `${shippingCost.toFixed(2)}€`
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{finalTotal.toFixed(2)}€</span>
                    </div>
                  </div>
                  
                  {total < 80 && (
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-accent">
                        💡 Plus que {(80 - total).toFixed(2)}€ pour la livraison gratuite !
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🔒</span>
                    <span>Paiement sécurisé par Stripe</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <span>🚚</span>
                    <span>Livraison sous 2-5 jours ouvrés</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <span>🎁</span>
                    <span>Emballage cadeau offert</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;