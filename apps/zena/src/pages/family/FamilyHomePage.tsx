import { Link } from "react-router-dom";
import SphereLayout from "@/components/SphereLayout";

const FamilyHomePage = () => (
  <SphereLayout
    sphere="family"
    title="Salut, ca va ?"
    description="ZENA relie les ados et leurs guardians avec des repaires doux et concrets."
  >
    <div className="zena-grid">
      <div className="zena-card zena-soft space-y-3">
        <div className="flex items-center gap-3">
          <div className="zena-avatar">Z</div>
          <div>
            <p className="text-sm font-semibold">Coucou ! Je t'ecoute.</p>
            <p className="text-xs text-muted-foreground">
              Un souci ou une bonne nouvelle ? Raconte-moi.
            </p>
          </div>
        </div>
        <Link to="/family/chat" className="text-sm text-primary">
          Ouvrir le chat ZENA
        </Link>
      </div>

      <div className="zena-card space-y-3">
        <div className="flex items-center justify-between">
          <p className="zena-section-title">Planning partage</p>
          <Link to="/family/planning" className="text-xs text-primary">
            Voir tout
          </Link>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Lucas - repas</span>
            <span className="text-muted-foreground">19:00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Karate</span>
            <span className="text-muted-foreground">20:00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Temps calme</span>
            <span className="text-muted-foreground">21:00</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="zena-card space-y-3">
          <p className="zena-section-title">Bien-etre</p>
          <p className="text-sm text-muted-foreground">
            Rituel calme pour tous et check-in emotionnel.
          </p>
          <Link to="/family/alerts" className="text-sm text-primary">
            Declarer une alerte detresse
          </Link>
        </div>
        <div className="zena-card space-y-3">
          <p className="zena-section-title">Suggestions de ZENA</p>
          <p className="text-sm text-muted-foreground">
            Temps d'ecran, routines et idees de dialogue.
          </p>
          <Link to="/family/community" className="text-sm text-primary">
            Voir les conseils
          </Link>
        </div>
      </div>

      <div className="zena-footer-nav">
        <button className="active" type="button">
          Accueil
        </button>
        <button type="button">Planning</button>
        <button type="button">SOS</button>
        <button type="button">Conseils</button>
      </div>
    </div>
  </SphereLayout>
);

export default FamilyHomePage;
