import { Link } from "react-router-dom";
import { LegalPageLayout, LegalSectionCard } from "@/components/legal/LegalPageLayout";

const LAST_UPDATED = "7 mars 2026";
const SECTIONS = [
  { id: "objet", label: "Objet" },
  { id: "produits", label: "Produits" },
  { id: "prix", label: "Prix" },
  { id: "commande", label: "Commande" },
  { id: "livraison", label: "Livraison" },
  { id: "retractation", label: "Retractation" },
  { id: "garantie", label: "SAV" },
  { id: "responsabilite", label: "Responsabilite" },
] as const;

const CGVPage = () => {
  return (
    <LegalPageLayout
      seoTitle="Conditions Générales de Vente"
      seoDescription="Conditions générales de vente et d'utilisation des services QVT Box."
      seoKeywords="CGV, conditions generales, vente, QVT Box, commandes"
      heading={
        <>
          Conditions Generales de <span className="text-primary">Vente</span>
        </>
      }
      subtitle="Consultez les regles contractuelles applicables aux commandes, aux livraisons et a l'utilisation des services QVT Box."
      lastUpdated={LAST_UPDATED}
      sections={[...SECTIONS]}
    >
      <LegalSectionCard id="objet" title="Article 1 - Objet">
        <p>
          Les presentes conditions generales de vente (CGV) s&apos;appliquent a toute commande passee sur le site
          QVT Box. Elles regissent les relations contractuelles entre QVT Box et ses clients.
        </p>
        <p>En passant commande sur notre site, le client accepte sans reserve les presentes CGV.</p>
      </LegalSectionCard>

      <LegalSectionCard id="produits" title="Article 2 - Produits et services">
        <p>QVT Box propose :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>
            <strong>Box QVT :</strong> coffrets bien-etre personnalises pour les entreprises
          </li>
          <li>
            <strong>SaaS RH :</strong> plateforme de gestion du bien-etre au travail
          </li>
          <li>
            <strong>Boutique :</strong> produits artisanaux et locaux pour le bien-etre
          </li>
        </ul>
        <p>Les caracteristiques des produits sont decrites sur chaque fiche produit.</p>
      </LegalSectionCard>

      <LegalSectionCard id="prix" title="Article 3 - Prix et paiement">
        <p>Les prix sont indiques en euros, toutes taxes comprises (TTC), hors frais de livraison si applicables.</p>
        <p>Le paiement s&apos;effectue par carte bancaire via notre partenaire securise Stripe.</p>
        <p>La commande est confirmee apres validation du paiement.</p>
        <p>En cas de refus d&apos;autorisation de paiement, la commande est automatiquement annulee.</p>
      </LegalSectionCard>

      <LegalSectionCard id="commande" title="Article 4 - Commande et confirmation">
        <p>La commande n&apos;est definitive qu&apos;apres :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>validation du panier</li>
          <li>acceptation des presentes CGV</li>
          <li>confirmation du paiement</li>
        </ul>
        <p>Une confirmation de commande est envoyee par email apres validation.</p>
      </LegalSectionCard>

      <LegalSectionCard id="livraison" title="Article 5 - Livraison">
        <p>
          <strong>Zone de livraison :</strong> France metropolitaine, sauf indication contraire sur la fiche produit
          ou lors du parcours de commande.
        </p>
        <p>
          <strong>Delais de livraison :</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>Produits boutique : 2 a 5 jours ouvres</li>
          <li>Box personnalisees : 7 a 14 jours ouvres</li>
          <li>Services SaaS : activation apres validation du compte ou du paiement</li>
        </ul>
        <p>
          <strong>Frais de livraison :</strong> calcules selon le poids et la destination, puis affiches avant
          validation de la commande.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="retractation" title="Article 6 - Droit de retractation">
        <p>
          Conformement a la legislation en vigueur, vous disposez d&apos;un delai de 14 jours a compter de la
          reception de votre commande pour exercer votre droit de retractation, sauf exception legale.
        </p>
        <p>
          <strong>Exceptions :</strong>
        </p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>produits perissables ou personnalises</li>
          <li>services SaaS deja actives</li>
          <li>produits descelles pour des raisons d&apos;hygiene</li>
        </ul>
        <p>
          Pour exercer votre droit de retractation, contactez-nous a{" "}
          <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
            contact@qvtbox.com
          </a>
          .
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="garantie" title="Article 7 - Garantie et SAV">
        <p>
          Tous nos produits beneficient de la garantie legale de conformite et de la garantie contre les vices caches,
          selon la legislation applicable.
        </p>
        <p>En cas de probleme avec votre commande, contactez notre service client :</p>
        <ul className="list-disc space-y-1 pl-5 sm:pl-6">
          <li>
            <strong>Email :</strong>{" "}
            <a className="text-primary hover:underline" href="mailto:contact@qvtbox.com">
              contact@qvtbox.com
            </a>
          </li>
          <li>
            <strong>Delai de reponse cible :</strong> 48 h ouvrees
          </li>
        </ul>
      </LegalSectionCard>

      <LegalSectionCard id="responsabilite" title="Article 8 - Responsabilite">
        <p>QVT Box s&apos;engage a fournir des produits et services conformes a leur description.</p>
        <p>Notre responsabilite est limitee au montant de la commande concernee, sauf dispositions legales contraires.</p>
        <p>Nous ne saurions etre tenus responsables des dommages indirects ou immateriels.</p>
      </LegalSectionCard>

      <LegalSectionCard id="donnees-personnelles" title="Article 9 - Donnees personnelles">
        <p>
          Vos donnees personnelles sont traitees conformement a notre{" "}
          <Link to="/politique-confidentialite" className="text-primary hover:underline">
            Politique de confidentialite
          </Link>{" "}
          et au RGPD.
        </p>
        <p>
          Ces donnees sont necessaires au traitement de votre commande et peuvent etre utilisees pour vous adresser des
          offres commerciales lorsque la base legale le permet.
        </p>
      </LegalSectionCard>

      <LegalSectionCard id="droit-applicable" title="Article 10 - Droit applicable">
        <p>Les presentes CGV sont soumises au droit francais.</p>
        <p>Avant tout recours contentieux, nous privilegions une resolution amiable des differends.</p>
        <p>En cas de litige, les juridictions competentes seront determinees conformement au droit applicable.</p>
      </LegalSectionCard>
    </LegalPageLayout>
  );
};

export default CGVPage;

