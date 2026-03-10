import { Link } from "react-router-dom";
import { LegalPageLayout, LegalSectionCard } from "@/components/legal/LegalPageLayout";

const LAST_UPDATED = "7 mars 2026";
const SECTIONS = [
  { id: "editeur", label: "Editeur" },
  { id: "hebergement", label: "Hebergement" },
  { id: "propriete", label: "Propriete" },
  { id: "responsabilite", label: "Responsabilite" },
  { id: "donnees", label: "Donnees" },
] as const;

const MentionsLegalesPage = () => {
  return (
    <LegalPageLayout
      seoTitle="Mentions Légales"
      seoDescription="Mentions legales et informations sur l'editeur du site QVT Box."
      seoKeywords="mentions legales, QVT Box, editeur, responsabilite"
      heading={
        <>
          Mentions <span className="text-primary">Legales</span>
        </>
      }
      subtitle="Retrouvez les informations legales relatives a l'editeur, a l'hebergement et au cadre d'utilisation du site."
      lastUpdated={LAST_UPDATED}
      sections={[...SECTIONS]}
    >
      <LegalSectionCard id="editeur" title="Editeur du site">
        <p>
          <strong>Raison sociale :</strong> QVT Box
        </p>
        <p>
          <strong>Forme juridique :</strong> [A completer]
        </p>
        <p>
          <strong>Capital social :</strong> [A completer]
        </p>
        <p>
          <strong>Siege social :</strong> [A completer]
        </p>
        <p>
          <strong>RCS/RM :</strong> [A completer]
        </p>
        <p>
          <strong>SIRET :</strong> [A completer]
        </p>
        <p>
          <strong>Numero TVA :</strong> [A completer]
        </p>
        <p>
          <strong>Directeur de publication :</strong> [A completer]
        </p>
        <p>
          <strong>Contact :</strong>{" "}
          <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
            contact@qvtbox.com
          </a>
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="hebergement" title="Hebergement">
        <p>
          <strong>Hebergeur :</strong> Vercel Inc.
        </p>
        <p>
          <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, Etats-Unis
        </p>
        <p>Le site est heberge sur une infrastructure cloud securisee operee par Vercel.</p>
      </LegalSectionCard>

      <LegalSectionCard id="propriete" title="Propriete intellectuelle">
        <p>
          L&apos;ensemble du site releve de la legislation francaise et internationale sur le droit d&apos;auteur et la
          propriete intellectuelle. Tous les droits de reproduction sont reserves.
        </p>
        <p>
          La reproduction de tout ou partie du site, sur quelque support que ce soit, est interdite sans autorisation
          expresse prealable.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="responsabilite" title="Responsabilite">
        <p>
          Les informations publiees sur ce site sont fournies a titre indicatif et peuvent etre modifiees ou mises a
          jour a tout moment.
        </p>
        <p>
          Si vous constatez une erreur, une omission ou un dysfonctionnement, vous pouvez l&apos;indiquer a{" "}
          <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
            contact@qvtbox.com
          </a>
          .
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="liens" title="Liens hypertextes">
        <p>
          Les liens hypertextes presentes sur le site vers des ressources externes ne sauraient engager la
          responsabilite de QVT Box.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="donnees" title="Collecte de donnees">
        <p>
          Le site collecte des informations personnelles uniquement dans le cadre de ses services (commandes, contact,
          newsletter, securite et fonctionnement de la plateforme).
        </p>
        <p>
          Pour plus d&apos;informations sur le traitement de vos donnees personnelles, consultez notre{" "}
          <Link to="/politique-confidentialite" className="text-primary hover:underline">
            Politique de confidentialite
          </Link>
          .
        </p>
      </LegalSectionCard>
    </LegalPageLayout>
  );
};

export default MentionsLegalesPage;

