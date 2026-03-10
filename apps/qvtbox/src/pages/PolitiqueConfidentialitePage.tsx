import { Link } from "react-router-dom";
import { LegalPageLayout, LegalSectionCard } from "@/components/legal/LegalPageLayout";

const LAST_UPDATED = "7 mars 2026";
const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "responsable", label: "Responsable" },
  { id: "donnees", label: "Donnees" },
  { id: "bases-legales", label: "Bases legales" },
  { id: "destinataires", label: "Sous-traitants" },
  { id: "conservation", label: "Conservation" },
  { id: "droits", label: "Vos droits" },
  { id: "suppression", label: "Suppression" },
] as const;

const PolitiqueConfidentialitePage = () => {
  return (
    <LegalPageLayout
      seoTitle="Politique de Confidentialité"
      seoDescription="Politique de confidentialité et protection des données personnelles de QVT Box (RGPD)."
      seoKeywords="politique de confidentialite, RGPD, donnees personnelles, QVT Box, vie privee"
      heading={
        <>
          Politique de <span className="text-primary">Confidentialite</span>
        </>
      }
      subtitle="Consultez les regles de traitement, de conservation et de suppression de vos donnees personnelles sur QVT Box."
      lastUpdated={LAST_UPDATED}
      sections={[...SECTIONS]}
    >
      <LegalSectionCard id="introduction" title="1. Introduction">
        <p>
          QVT Box s&apos;engage a proteger vos donnees personnelles et votre vie privee, conformement au Reglement
          General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes.
        </p>
        <p>
          Cette politique vous explique quelles donnees sont collectees, pour quelles finalites, sur quelles bases
          legales, pendant combien de temps, et quels sont vos droits.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="responsable" title="2. Responsable du traitement">
        <p>
          <strong>Responsable du traitement :</strong> QVT Box
        </p>
        <p>
          <strong>Email de contact :</strong>{" "}
          <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
            contact@qvtbox.com
          </a>
        </p>
        <p>
          Les informations legales detaillees de l&apos;editeur sont disponibles dans les{" "}
          <Link to="/mentions-legales" className="text-primary hover:underline">
            Mentions legales
          </Link>
          .
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="donnees" title="3. Donnees collectees">
        <p>Selon votre usage de la plateforme, nous pouvons collecter :</p>

        <h3 className="text-base font-semibold sm:text-lg">Donnees de compte et d&apos;identification</h3>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Nom, prenom, adresse email</li>
          <li>Informations de profil et preferences utilisateur</li>
          <li>Identifiants techniques de compte</li>
        </ul>

        <h3 className="text-base font-semibold sm:text-lg">Donnees transactionnelles</h3>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Historique de commandes et abonnements</li>
          <li>Adresse de livraison et informations de facturation</li>
          <li>Informations de paiement via Stripe (QVT Box ne stocke pas le numero complet de carte)</li>
        </ul>

        <h3 className="text-base font-semibold sm:text-lg">Donnees techniques et de navigation</h3>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Adresse IP, journaux de connexion, donnees de securite</li>
          <li>Donnees de navigation et de performance</li>
          <li>Cookies et traceurs (voir section 9)</li>
        </ul>

        <h3 className="text-base font-semibold sm:text-lg">Donnees de relation client</h3>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Demandes envoyees au support</li>
          <li>Messages et reponses associes</li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="bases-legales" title="4. Finalites et bases legales">
        <ul className="list-disc space-y-2 pl-5 sm:pl-6">
          <li>
            <strong>Execution du contrat :</strong> creation de compte, gestion des commandes, livraison, acces aux
            services et assistance.
          </li>
          <li>
            <strong>Obligations legales :</strong> facturation, comptabilite, prevention de la fraude, conservation
            de certaines donnees.
          </li>
          <li>
            <strong>Interet legitime :</strong> securisation de la plateforme, amelioration continue des services,
            statistiques d&apos;usage internes.
          </li>
          <li>
            <strong>Consentement :</strong> envoi de communications marketing et utilisation de certains cookies non
            essentiels.
          </li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="destinataires" title="5. Destinataires et sous-traitants">
        <p>Vos donnees sont accessibles uniquement aux personnes habilitees et, si necessaire, a nos prestataires :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Supabase (hebergement de donnees et services backend)</li>
          <li>Stripe (traitement des paiements)</li>
          <li>Vercel (hebergement applicatif)</li>
          <li>Prestataires logistiques (livraison)</li>
          <li>Prestataires techniques strictement necessaires au fonctionnement du service</li>
        </ul>
        <p>Nous ne vendons pas vos donnees personnelles a des tiers.</p>
      </LegalSectionCard>

      <LegalSectionCard id="transferts" title="6. Transferts hors Union europeenne">
        <p>
          Certains de nos prestataires peuvent traiter des donnees en dehors de l&apos;Union europeenne. Dans ce cas,
          des garanties appropriees sont mises en place (notamment clauses contractuelles types, mesures de securite
          complementaires et controles contractuels).
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="conservation" title="7. Duree de conservation">
        <p>Nous conservons les donnees pour des durees proportionnees aux finalites :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>
            <strong>Donnees de compte :</strong> pendant la relation contractuelle, puis suppression ou anonymisation
            selon les obligations applicables.
          </li>
          <li>
            <strong>Donnees de facturation :</strong> jusqu&apos;a 10 ans (obligation legale).
          </li>
          <li>
            <strong>Prospection commerciale :</strong> jusqu&apos;a 3 ans apres le dernier contact actif ou
            jusqu&apos;au retrait du consentement.
          </li>
          <li>
            <strong>Journaux techniques :</strong> duree limitee necessaire a la securite et a l&apos;exploitation.
          </li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="securite" title="8. Securite">
        <p>Nous mettons en place des mesures techniques et organisationnelles adaptees pour proteger vos donnees :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Chiffrement des flux (HTTPS/TLS)</li>
          <li>Gestion des acces et principe du moindre privilege</li>
          <li>Journalisation et mecanismes de surveillance</li>
          <li>Sauvegardes et plans de reprise</li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="cookies" title="9. Cookies et traceurs">
        <p>
          Le site peut utiliser des cookies necessaires au fonctionnement, ainsi que des cookies de mesure
          d&apos;audience ou de personnalisation selon vos choix.
        </p>
        <p>
          Vous pouvez parametrer vos preferences depuis votre navigateur et, le cas echeant, via le module de
          consentement affiche sur le site.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="droits" title="10. Vos droits RGPD">
        <p>Vous disposez des droits suivants :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
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
          Si vous estimez, apres nous avoir contactes, que vos droits ne sont pas respectes, vous pouvez adresser une
          reclamation a la CNIL.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="suppression" title="11. Suppression des donnees utilisateur">
        <p>
          Vous pouvez demander la suppression de votre compte et de vos donnees personnelles en ecrivant a{" "}
          <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
            contact@qvtbox.com
          </a>
          .
        </p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Objet recommande : "Demande de suppression des donnees".</li>
          <li>Verification d&apos;identite possible pour securiser la demande.</li>
          <li>Traitement sous 30 jours, prolongeable a 2 mois pour les demandes complexes.</li>
          <li>
            Certaines donnees peuvent etre conservees temporairement si la loi l&apos;impose (ex: facturation,
            obligations comptables, defense de droits en justice).
          </li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="mineurs" title="12. Donnees des mineurs">
        <p>
          QVT Box applique des mesures renforcees de protection lorsqu&apos;un service implique des mineurs. Le
          traitement des donnees est limite a ce qui est strictement necessaire aux finalites du service et a sa
          securite.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="evolution" title="13. Evolution de la politique">
        <p>
          Cette politique peut etre mise a jour pour refleter les evolutions legales, techniques ou fonctionnelles de
          nos services.
        </p>
        <p>
          Date de reference actuelle : <strong>{LAST_UPDATED}</strong>
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="liens-utiles" title="14. Liens utiles">
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
      </LegalSectionCard>
    </LegalPageLayout>
  );
};

export default PolitiqueConfidentialitePage;
