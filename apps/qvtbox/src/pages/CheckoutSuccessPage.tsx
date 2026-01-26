import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [sessionId] = useState(searchParams.get('session_id'));

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-green-700">
              Commande confirmée !
            </h1>
            <p className="text-xl text-muted-foreground">
              Merci pour votre achat. Votre commande a été traitée avec succès.
            </p>
            {sessionId && (
              <Badge variant="outline" className="mt-4">
                ID: {sessionId.slice(-8).toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Prochaines étapes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Prochaines étapes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Préparation de votre commande</h4>
                    <p className="text-sm text-muted-foreground">
                      Nos artisans préparent soigneusement vos produits
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Expédition</h4>
                    <p className="text-sm text-muted-foreground">
                      Envoi sous 24-48h avec numéro de suivi
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Livraison</h4>
                    <p className="text-sm text-muted-foreground">
                      Réception sous 2-5 jours ouvrés
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Informations importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>📧 Email de confirmation envoyé</strong><br />
                    Vérifiez votre boîte mail pour tous les détails de votre commande.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>📦 Suivi de commande</strong><br />
                    Vous recevrez un lien de suivi dès l'expédition de votre colis.
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>🎁 Emballage cadeau inclus</strong><br />
                    Vos produits sont emballés avec soin dans un packaging éco-responsable.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Garanties et Support */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Nos garanties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-medium mb-2">Qualité artisanale</h4>
                  <p className="text-sm text-muted-foreground">
                    Produits sélectionnés avec soin par nos artisans partenaires
                  </p>
                </div>
                
                <div>
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-medium mb-2">Satisfait ou remboursé</h4>
                  <p className="text-sm text-muted-foreground">
                    30 jours pour changer d'avis, retour gratuit
                  </p>
                </div>
                
                <div>
                  <div className="text-3xl mb-2">🌱</div>
                  <h4 className="font-medium mb-2">Éco-responsable</h4>
                  <p className="text-sm text-muted-foreground">
                    Emballages recyclables et production locale
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/boutique')}
                variant="outline"
                className="flex items-center gap-2"
              >
                Continuer mes achats
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2"
              >
                Nous contacter
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Une question ? Notre équipe est disponible du lundi au vendredi de 9h à 18h.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccessPage;