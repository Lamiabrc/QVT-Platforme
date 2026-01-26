import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";

const PolitiqueConfidentialitePage = () => {
  return (
    <>
      <SEOHead 
        title="Politique de Confidentialité"
        description="Politique de confidentialité et protection des données personnelles - QVT Box"
        keywords="politique confidentialité, RGPD, protection données, QVT Box"
      />
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        
        <main className="relative z-10 pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-12 text-center">
              Politique de <span className="text-primary">Confidentialité</span>
            </h1>

            <div className="space-y-8">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Introduction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>QVT Box s'engage à protéger votre vie privée et vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD).</p>
                  <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Données collectées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <h3 className="font-semibold text-lg">Données d'identification :</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse postale (pour les livraisons)</li>
                  </ul>

                  <h3 className="font-semibold text-lg">Données de connexion :</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Adresse IP</li>
                    <li>Données de navigation</li>
                    <li>Préférences utilisateur</li>
                  </ul>

                  <h3 className="font-semibold text-lg">Données de commande :</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Historique des commandes</li>
                    <li>Préférences produits</li>
                    <li>Informations de paiement (sécurisées via Stripe)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Finalités du traitement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Vos données sont utilisées pour :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Traiter vos commandes et assurer le service client</li>
                    <li>Personnaliser votre expérience utilisateur</li>
                    <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                    <li>Améliorer nos services et notre site web</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Base légale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Le traitement de vos données repose sur :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Contrat :</strong> Pour l'exécution de nos services</li>
                    <li><strong>Consentement :</strong> Pour les communications marketing</li>
                    <li><strong>Intérêt légitime :</strong> Pour l'amélioration de nos services</li>
                    <li><strong>Obligation légale :</strong> Pour la facturation et comptabilité</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Partage des données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Vos données peuvent être partagées avec :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Prestataires techniques :</strong> Supabase (base de données), Stripe (paiements)</li>
                    <li><strong>Transporteurs :</strong> Pour la livraison de vos commandes</li>
                    <li><strong>Autorités :</strong> Si requis par la loi</li>
                  </ul>
                  <p>Nous ne vendons jamais vos données à des tiers.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Sécurité des données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Chiffrement des données en transit (HTTPS)</li>
                    <li>Authentification sécurisée</li>
                    <li>Contrôles d'accès stricts</li>
                    <li>Sauvegardes régulières</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Vos droits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Droit d'accès :</strong> Consulter vos données</li>
                    <li><strong>Droit de rectification :</strong> Corriger vos données</li>
                    <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
                    <li><strong>Droit de portabilité :</strong> Récupérer vos données</li>
                    <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                    <li><strong>Droit de limitation :</strong> Limiter le traitement</li>
                  </ul>
                  <p>Pour exercer vos droits, contactez-nous à : <strong>contact@qvtbox.com</strong></p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Conservation des données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Nous conservons vos données pendant :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Données client :</strong> 3 ans après la dernière commande</li>
                    <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                    <li><strong>Données de navigation :</strong> 13 mois maximum</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
                  <p><strong>Email :</strong> contact@qvtbox.com</p>
                  <p>Vous avez également le droit de déposer une réclamation auprès de la CNIL si vous estimez que vos droits ne sont pas respectés.</p>
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

export default PolitiqueConfidentialitePage;