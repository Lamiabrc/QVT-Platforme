import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";

const MentionsLegalesPage = () => {
  return (
    <>
      <SEOHead 
        title="Mentions Légales"
        description="Mentions légales et informations sur l'éditeur du site QVT Box - Solutions de bien-être au travail"
        keywords="mentions légales, QVT Box, éditeur, responsabilité"
      />
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        
        <main className="relative z-10 pt-24 pb-12 px-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-kalam font-bold text-foreground mb-12 text-center">
              Mentions <span className="text-primary">Légales</span>
            </h1>

            <div className="space-y-8">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Éditeur du site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p><strong>Raison sociale :</strong> QVT Box</p>
                  <p><strong>Forme juridique :</strong> [À compléter]</p>
                  <p><strong>Capital social :</strong> [À compléter]</p>
                  <p><strong>Siège social :</strong> [À compléter]</p>
                  <p><strong>RCS/RM :</strong> [À compléter]</p>
                  <p><strong>SIRET :</strong> [À compléter]</p>
                  <p><strong>Numéro TVA :</strong> [À compléter]</p>
                  <p><strong>Directeur de publication :</strong> [À compléter]</p>
                  <p><strong>Contact :</strong> contact@qvtbox.com</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Hébergement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p><strong>Hébergeur :</strong> Lovable</p>
                  <p><strong>Adresse :</strong> Platform hébergée sur l'infrastructure Lovable</p>
                  <p>Le site est hébergé sur la plateforme Lovable qui utilise une infrastructure cloud sécurisée.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                  <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Responsabilité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Les informations contenues sur ce site sont aussi précises que possibles et le site remis à jour à différentes périodes de l'année, mais peut toutefois contenir des inexactitudes ou des omissions.</p>
                  <p>Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email, à l'adresse contact@qvtbox.com, en décrivant le problème de la façon la plus précise possible.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Liens hypertextes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de QVT Box.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl font-inter text-primary">Collecte de données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Le site collecte des informations personnelles uniquement dans le cadre de ses services (commandes, contact, newsletter). Ces données sont traitées conformément au RGPD.</p>
                  <p>Pour plus d'informations sur le traitement de vos données personnelles, consultez notre <Link to="/politique-confidentialite" className="text-primary hover:underline">Politique de Confidentialité</Link>.</p>
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

export default MentionsLegalesPage;