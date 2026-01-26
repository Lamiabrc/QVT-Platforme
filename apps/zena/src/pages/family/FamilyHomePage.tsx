import { Link } from "react-router-dom";
import SphereLayout from "@/components/SphereLayout";

const FamilyHomePage = () => (
  <SphereLayout
    sphere="family"
    title="Hub Famille"
    description="Espace commun pour ados et guardians : planning, alertes et communaute invite-only."
  >
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Planning</h3>
        <p className="text-sm text-muted-foreground">
          Evenements familiaux, routines et rappels partages.
        </p>
        <Link to="/family/planning" className="text-sm text-primary">
          Ouvrir le planning
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Alertes</h3>
        <p className="text-sm text-muted-foreground">
          Detresse, harcelement, addiction : signalement vers la tutelle.
        </p>
        <Link to="/family/alerts" className="text-sm text-primary">
          Declarer une alerte
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Chat ZENA</h3>
        <p className="text-sm text-muted-foreground">
          Parler a ZENA avec un contexte ado/famille.
        </p>
        <Link to="/family/chat" className="text-sm text-primary">
          Ouvrir le chat
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Communaute privee</h3>
        <p className="text-sm text-muted-foreground">
          Amis et groupes, invite-only, sans annuaire public.
        </p>
        <Link to="/family/community" className="text-sm text-primary">
          Voir le feed
        </Link>
      </div>
    </div>
  </SphereLayout>
);

export default FamilyHomePage;
