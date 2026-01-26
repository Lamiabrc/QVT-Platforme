import { Link } from "react-router-dom";
import SphereLayout from "@/components/SphereLayout";

const CompanyHomePage = () => (
  <SphereLayout
    sphere="company"
    title="Hub Entreprise"
    description="Reseau interne pour equipes, alerts RH/QVT et plan d'action." 
  >
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Planning</h3>
        <p className="text-sm text-muted-foreground">Rituels d'equipe et actions QVT.</p>
        <Link to="/company/planning" className="text-sm text-primary">
          Ouvrir le planning
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Alertes</h3>
        <p className="text-sm text-muted-foreground">Detresse, harcelement, addiction, fatigue.</p>
        <Link to="/company/alerts" className="text-sm text-primary">
          Declarer une alerte
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Chat ZENA</h3>
        <p className="text-sm text-muted-foreground">Espace de dialogue professionnel.</p>
        <Link to="/company/chat" className="text-sm text-primary">
          Ouvrir le chat
        </Link>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold">Communaute interne</h3>
        <p className="text-sm text-muted-foreground">Feed interne sans exposition publique.</p>
        <Link to="/company/community" className="text-sm text-primary">
          Voir le feed
        </Link>
      </div>
    </div>
  </SphereLayout>
);

export default CompanyHomePage;
