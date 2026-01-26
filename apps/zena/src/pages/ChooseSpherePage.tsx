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
      <h1 className="text-3xl font-semibold">Choisir ma sphere</h1>
      <p className="text-sm text-muted-foreground">
        Famille ou entreprise : deux mondes complets pour parler avec ZENA.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSelect("family")}
          className="rounded-2xl border border-border p-6 text-left hover:border-primary/60"
        >
          <h2 className="text-xl font-semibold">Famille</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Espace ado + parents, communaute invite-only, alertes de detresse.
          </p>
        </button>
        <button
          type="button"
          onClick={() => handleSelect("company")}
          className="rounded-2xl border border-border p-6 text-left hover:border-primary/60"
        >
          <h2 className="text-xl font-semibold">Entreprise</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reseau interne, alertes RH, planning et suggestions actionnables.
          </p>
        </button>
      </div>
    </section>
  );
};

export default ChooseSpherePage;
