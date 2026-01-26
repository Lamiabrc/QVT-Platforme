import { useNavigate } from "react-router-dom";
import { setStoredSphere } from "@/lib/sphere";

const ChooseSpherePage = () => {
  const navigate = useNavigate();

  const handleSelect = (sphere: "family" | "company") => {
    setStoredSphere(sphere);
    navigate(`/${sphere}/onboarding`);
  };

  return (
    <section className="space-y-8">
      <div className="zena-stage p-6 md:p-8">
        <div className="relative z-10 space-y-5">
          <div className="zena-brand text-3xl">ZENA</div>
          <p className="text-sm text-muted-foreground">L'IA emotionnelle de la famille et du pro.</p>
          <div className="zena-chatline text-sm">Salut, ca va ?</div>
          <div className="zena-tabs">
            <button className="zena-tab is-active" type="button">
              FAMILLE
            </button>
            <button className="zena-tab" type="button">
              PRO
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSelect("family")}
          className="zena-card text-left hover:border-primary/60"
        >
          <h2 className="text-xl font-semibold">Famille</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Planning partage, alertes detresse, communaute invite-only, conseils bien-etre.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="zena-pill">Planning</span>
            <span className="zena-pill">Alertes</span>
            <span className="zena-pill">Communaute</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("company")}
          className="zena-card text-left hover:border-primary/60"
        >
          <h2 className="text-xl font-semibold">Entreprise</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reseau interne, alertes RH/QVT, planning d'actions et suggestions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="zena-pill">Actions</span>
            <span className="zena-pill">Alertes</span>
            <span className="zena-pill">Ressources</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ChooseSpherePage;
