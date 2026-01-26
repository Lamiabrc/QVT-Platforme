import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingBag, HelpCircle } from 'lucide-react';

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Navigation />
      
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-orange-700">
              Commande annulée
            </h1>
            <p className="text-xl text-muted-foreground">
              Votre paiement a été annulé. Aucun montant n'a été débité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Que s'est-il passé ? */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Que s'est-il passé ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Votre session de paiement a été interrompue. Cela peut arriver pour plusieurs raisons :
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    Vous avez cliqué sur "Retour" ou fermé la fenêtre
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    Problème de connexion internet
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    Session expirée (plus de 24h d'inactivité)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    Problème avec votre méthode de paiement
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Rassurance */}
            <Card>
              <CardHeader>
                <CardTitle>Pas d'inquiétude !</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>✅ Aucun débit</strong><br />
                    Votre carte bancaire n'a pas été débitée.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>🛒 Panier conservé</strong><br />
                    Vos produits sont toujours dans votre panier.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    <strong>🔒 Données sécurisées</strong><br />
                    Vos informations personnelles sont protégées.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solutions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Que pouvez-vous faire maintenant ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-medium mb-2">Reprendre ma commande</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Vos produits vous attendent dans votre panier
                  </p>
                  <Button 
                    onClick={() => navigate('/checkout')}
                    className="w-full"
                  >
                    Finaliser ma commande
                  </Button>
                </div>
                
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <ArrowLeft className="w-8 h-8 mx-auto mb-3 text-secondary" />
                  <h4 className="font-medium mb-2">Continuer mes achats</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Découvrir d'autres produits artisanaux
                  </p>
                  <Button 
                    onClick={() => navigate('/boutique')}
                    variant="outline"
                    className="w-full"
                  >
                    Retour boutique
                  </Button>
                </div>
                
                <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <HelpCircle className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <h4 className="font-medium mb-2">Besoin d'aide ?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Notre équipe est là pour vous aider
                  </p>
                  <Button 
                    onClick={() => navigate('/contact')}
                    variant="outline"
                    className="w-full"
                  >
                    Nous contacter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Si le problème persiste, n'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="text-sm text-muted-foreground">
                  📧 support@qvt-box.fr
                </div>
                <div className="text-sm text-muted-foreground">
                  📞 01 23 45 67 89
                </div>
                <div className="text-sm text-muted-foreground">
                  🕒 Lun-Ven 9h-18h
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutCancelPage;