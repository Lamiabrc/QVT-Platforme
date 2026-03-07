import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";

const LAST_UPDATED = "7 mars 2026";

const PolitiqueConfidentialitePage = () => {
  return (
    <>
      <SEOHead
        title="Politique de Confidentialité"
        description="Politique de confidentialité et protection des données personnelles de QVT Box (RGPD)."
        keywords="politique de confidentialite, RGPD, donnees personnelles, QVT Box, vie privee"
      />

      <div className="min-h-screen bg-gradient-hero">
        <Navigation />

        <main className="relative z-10 px-6 pb-12 pt-24">
          <div className="container mx-auto max-w-4xl">
            <h1 className="mb-12 text-center font-kalam text-4xl font-bold text-foreground md:text-5xl">
              Politique de <span className="text-primary">Confidentialite</span>
            </h1>

            <div className="space-y-8">
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">1. Introduction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    QVT Box s&apos;engage a proteger vos donnees personnelles et votre vie privee, conformement
                    au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et
                    Libertes.
                  </p>
                  <p>
                    Cette politique vous explique quelles donnees sont collectees, pour quelles finalites, sur
                    quelles bases legales, pendant combien de temps, et quels sont vos droits.
                  </p>
                  <p>
                    <strong>Derniere mise a jour :</strong> {LAST_UPDATED}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">
                    2. Responsable du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    <strong>Responsable du traitement :</strong> QVT Box
                  </p>
                  <p>
                    <strong>Email de contact :</strong> <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">contact@qvtbox.com</a>
                  </p>
                  <p>
                    Les informations legales detaillees de l&apos;editeur sont disponibles dans les{" "}
                    <Link to="/mentions-legales" className="text-primary hover:underline">
                      Mentions legales
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">3. Donnees collectees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Selon votre usage de la plateforme, nous pouvons collecter :</p>

                  <h3 className="text-lg font-semibold">Donnees de compte et d&apos;identification</h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Nom, prenom, adresse email</li>
                    <li>Informations de profil et preferences utilisateur</li>
                    <li>Identifiants techniques de compte</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Donnees transactionnelles</h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Historique de commandes et abonnements</li>
                    <li>Adresse de livraison et informations de facturation</li>
                    <li>Informations de paiement via Stripe (QVT Box ne stocke pas le numero complet de carte)</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Donnees techniques et de navigation</h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Adresse IP, journaux de connexion, donnees de securite</li>
                    <li>Donnees de navigation et de performance</li>
                    <li>Cookies et traceurs (voir section 9)</li>
                  </ul>

                  <h3 className="text-lg font-semibold">Donnees de relation client</h3>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Demandes envoyees au support</li>
                    <li>Messages et reponses associes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">
                    4. Finalites et bases legales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <ul className="list-disc space-y-2 pl-6">
                    <li>
                      <strong>Execution du contrat :</strong> creation de compte, gestion des commandes,
                      livraison, acces aux services et assistance.
                    </li>
                    <li>
                      <strong>Obligations legales :</strong> facturation, comptabilite, prevention de la fraude,
                      conservation de certaines donnees.
                    </li>
                    <li>
                      <strong>Interet legitime :</strong> securisation de la plateforme, amelioration continue
                      des services, statistiques d&apos;usage internes.
                    </li>
                    <li>
                      <strong>Consentement :</strong> envoi de communications marketing et utilisation de
                      certains cookies non essentiels.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">
                    5. Destinataires et sous-traitants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Vos donnees sont accessibles uniquement aux personnes habilitees et, si necessaire, a nos prestataires :</p>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Supabase (hebergement de donnees et services backend)</li>
                    <li>Stripe (traitement des paiements)</li>
                    <li>Vercel (hebergement applicatif)</li>
                    <li>Prestataires logistiques (livraison)</li>
                    <li>Prestataires techniques strictement necessaires au fonctionnement du service</li>
                  </ul>
                  <p>Nous ne vendons pas vos donnees personnelles a des tiers.</p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">
                    6. Transferts hors Union europeenne
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    Certains de nos prestataires peuvent traiter des donnees en dehors de l&apos;Union europeenne.
                    Dans ce cas, des garanties appropriees sont mises en place (notamment clauses contractuelles
                    types, mesures de securite complementaires et controles contractuels).
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">7. Duree de conservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Nous conservons les donnees pour des durees proportionnees aux finalites :</p>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>
                      <strong>Donnees de compte :</strong> pendant la relation contractuelle, puis suppression ou
                      anonymisation selon les obligations applicables.
                    </li>
                    <li>
                      <strong>Donnees de facturation :</strong> jusqu&apos;a 10 ans (obligation legale).
                    </li>
                    <li>
                      <strong>Prospection commerciale :</strong> jusqu&apos;a 3 ans apres le dernier contact actif
                      ou jusqu&apos;au retrait du consentement.
                    </li>
                    <li>
                      <strong>Journaux techniques :</strong> duree limitee necessaire a la securite et a
                      l&apos;exploitation.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">8. Securite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    Nous mettons en place des mesures techniques et organisationnelles adaptees pour proteger vos
                    donnees :
                  </p>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Chiffrement des flux (HTTPS/TLS)</li>
                    <li>Gestion des acces et principe du moindre privilege</li>
                    <li>Journalisation et mecanismes de surveillance</li>
                    <li>Sauvegardes et plans de reprise</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">9. Cookies et traceurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    Le site peut utiliser des cookies necessaires au fonctionnement, ainsi que des cookies de
                    mesure d&apos;audience ou de personnalisation selon vos choix.
                  </p>
                  <p>
                    Vous pouvez parametrer vos preferences depuis votre navigateur et, le cas echeant, via le
                    module de consentement affiche sur le site.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">10. Vos droits RGPD</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>Vous disposez des droits suivants :</p>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Droit d&apos;acces</li>
                    <li>Droit de rectification</li>
                    <li>Droit a l&apos;effacement</li>
                    <li>Droit a la limitation</li>
                    <li>Droit d&apos;opposition</li>
                    <li>Droit a la portabilite</li>
                    <li>Droit de retirer votre consentement a tout moment</li>
                  </ul>
                  <p>
                    Pour exercer vos droits :{" "}
                    <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
                      contact@qvtbox.com
                    </a>
                  </p>
                  <p>
                    Si vous estimez, apres nous avoir contactes, que vos droits ne sont pas respectes, vous pouvez
                    adresser une reclamation a la CNIL.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">
                    11. Suppression des donnees utilisateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    Vous pouvez demander la suppression de votre compte et de vos donnees personnelles en ecrivant a{" "}
                    <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
                      contact@qvtbox.com
                    </a>
                    .
                  </p>
                  <ul className="list-disc space-y-1 pl-6">
                    <li>Objet recommande : "Demande de suppression des donnees".</li>
                    <li>Verification d&apos;identite possible pour securiser la demande.</li>
                    <li>Traitement sous 30 jours, prolongeable a 2 mois pour les demandes complexes.</li>
                    <li>
                      Certaines donnees peuvent etre conservees temporairement si la loi l&apos;impose
                      (ex: facturation, obligations comptables, defense de droits en justice).
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">12. Donnees des mineurs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    QVT Box applique des mesures renforcees de protection lorsqu&apos;un service implique des
                    mineurs. Le traitement des donnees est limite a ce qui est strictement necessaire aux finalites
                    du service et a sa securite.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">13. Evolution de la politique</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-foreground/80">
                  <p>
                    Cette politique peut etre mise a jour pour refleter les evolutions legales, techniques ou
                    fonctionnelles de nos services.
                  </p>
                  <p>
                    Date de reference actuelle : <strong>{LAST_UPDATED}</strong>
                  </p>
                </CardContent>
              </Card>

              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="font-inter text-2xl text-primary">14. Liens utiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-foreground/80">
                  <p>
                    <Link to="/mentions-legales" className="text-primary hover:underline">
                      Mentions legales
                    </Link>
                  </p>
                  <p>
                    <Link to="/cgv" className="text-primary hover:underline">
                      Conditions generales de vente
                    </Link>
                  </p>
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
