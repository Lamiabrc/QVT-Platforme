import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";

const CGVPage = () => {
  return (
    <>
      <SEOHead 
        title="Conditions Générales de Vente"
        description="Conditions générales de vente et d'utilisation des services QVT Box"
        keywords="CGV, conditions générales, vente, QVT Box, commandes"
      />
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        
        <main className="relative z-10 pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-12 text-center">
              Conditions Générales de <span className="text-primary">Vente</span>
            </h1>

            <div className="space-y-8">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 1 - Objet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Les présentes conditions générales de vente (CGV) s'appliquent à toute commande passée sur le site QVT Box. Elles régissent les relations contractuelles entre QVT Box et ses clients.</p>
                  <p>En passant commande sur notre site, le client accepte sans réserve les présentes conditions générales de vente.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 2 - Produits et Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>QVT Box propose :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Box QVT :</strong> Coffrets bien-être personnalisés pour les entreprises</li>
                    <li><strong>SaaS RH :</strong> Plateforme de gestion du bien-être au travail</li>
                    <li><strong>Boutique :</strong> Produits artisanaux et locaux pour le bien-être</li>
                  </ul>
                  <p>Les caractéristiques des produits sont décrites avec précision sur chaque fiche produit.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 3 - Prix et Paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC) hors frais de livraison.</p>
                  <p>Le paiement s'effectue par carte bancaire via notre partenaire sécurisé Stripe.</p>
                  <p>La commande est confirmée après validation du paiement.</p>
                  <p>En cas de refus d'autorisation de paiement, la commande sera automatiquement annulée.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 4 - Commande et Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>La commande n'est définitive qu'après :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Validation du panier</li>
                    <li>Acceptation des présentes CGV</li>
                    <li>Confirmation du paiement</li>
                  </ul>
                  <p>Une confirmation de commande vous sera envoyée par email dans les 24h suivant votre achat.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 5 - Livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p><strong>Zone de livraison :</strong> France métropolitaine</p>
                  <p><strong>Délais de livraison :</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Produits boutique : 2-5 jours ouvrés</li>
                    <li>Box personnalisées : 7-14 jours ouvrés</li>
                    <li>Services SaaS : Activation immédiate</li>
                  </ul>
                  <p><strong>Frais de livraison :</strong> Calculés selon le poids et la destination, affichés avant validation de la commande.</p>
                  <p>En cas de retard de livraison supérieur à 7 jours, vous pouvez annuler votre commande et être remboursé.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 6 - Droit de Rétractation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation.</p>
                  <p><strong>Exceptions :</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Produits périssables ou personnalisés</li>
                    <li>Services SaaS activés</li>
                    <li>Produits descellés pour des raisons d'hygiène</li>
                  </ul>
                  <p>Pour exercer votre droit de rétractation, contactez-nous à : <strong>contact@qvtbox.com</strong></p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 7 - Garantie et SAV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés.</p>
                  <p>En cas de problème avec votre commande, contactez notre service client :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Email :</strong> contact@qvtbox.com</li>
                    <li><strong>Délai de réponse :</strong> 48h maximum</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 8 - Responsabilité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>QVT Box s'engage à fournir des produits de qualité et des services conformes aux descriptions.</p>
                  <p>Notre responsabilité est limitée au montant de la commande concernée.</p>
                  <p>Nous ne saurions être tenus responsables des dommages indirects ou immatériels.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 9 - Données Personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Vos données personnelles sont traitées conformément à notre <Link to="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link> et au RGPD.</p>
                  <p>Ces données sont nécessaires au traitement de votre commande et peuvent être utilisées pour vous adresser des offres commerciales (avec votre consentement).</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Article 10 - Droit Applicable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Les présentes CGV sont soumises au droit français.</p>
                  <p>En cas de litige, les tribunaux français seront seuls compétents.</p>
                  <p>Avant tout recours contentieux, nous privilégions une résolution amiable des différends.</p>
                  <p><strong>Mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CGVPage;