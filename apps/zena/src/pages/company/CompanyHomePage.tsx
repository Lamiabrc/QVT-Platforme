import { Link } from "react-router-dom";
import SphereLayout from "@/components/SphereLayout";

const CompanyHomePage = () => (
  <SphereLayout
    sphere="company"
    title="Bonjour, comment va l'equipe ?"
    description="ZENA pro suit les signaux faibles et propose des actions RH/QVT."
  >
    <div className="zena-grid">
      <div className="zena-card zena-soft space-y-3">
        <div className="flex items-center gap-3">
          <div className="zena-avatar">Z</div>
          <div>
            <p className="text-sm font-semibold">Point d'ecoute pro</p>
            <p className="text-xs text-muted-foreground">
              Posez le contexte et ZENA suggere des actions concretes.
            </p>
          </div>
        </div>
        <Link to="/company/chat" className="text-sm text-primary">
          Ouvrir le chat ZENA Pro
        </Link>
      </div>

      <div className="zena-card space-y-3">
        <div className="flex items-center justify-between">
          <p className="zena-section-title">Planning QVT</p>
          <Link to="/company/planning" className="text-xs text-primary">
            Voir tout
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Check-in equipe</span>
            <span className="text-muted-foreground">09:00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Atelier respiration</span>
            <span className="text-muted-foreground">12:30</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Debrief manager</span>
            <span className="text-muted-foreground">17:00</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="zena-card space-y-3">
          <p className="zena-section-title">Alertes RH/QVT</p>
          <p className="text-sm text-muted-foreground">
            Detresse, harcelement, surcharge : signalement vers l'admin.
          </p>
          <Link to="/company/alerts" className="text-sm text-primary">
            Declarer une alerte
          </Link>
        </div>
        <div className="zena-card space-y-3">
          <p className="zena-section-title">Suggestions</p>
          <p className="text-sm text-muted-foreground">
            Idees d'actions, rituels d'equipe, ressources pro.
          </p>
          <Link to="/company/community" className="text-sm text-primary">
            Voir les ressources
          </Link>
        </div>
      </div>

      <div className="zena-footer-nav">
        <button className="active" type="button">
          Accueil
        </button>
        <button type="button">Planning</button>
        <button type="button">Alertes</button>
        <button type="button">Ressources</button>
      </div>
    </div>
  </SphereLayout>
);

export default CompanyHomePage;
