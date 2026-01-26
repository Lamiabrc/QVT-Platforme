import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QVTBOX_URL, ZENA_FAMILY_URL, ZENA_VOICE_URL } from "@qvt/shared";

const LandingPage = () => (
  <section className="space-y-10">
    <div className="rounded-3xl border border-border bg-background/90 p-8 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">ZENA</p>
      <h1 className="mt-3 text-4xl font-semibold">L'IA emotionnelle a qui on parle.</h1>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        ZENA accompagne les familles et les organisations avec une IA empathique,
        des alertes de detresse et des outils concrets pour agir.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/choose-sphere"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Choisir ma sphere
        </Link>
        <a
          href={QVTBOX_URL}
          className="rounded-full border border-border px-5 py-2 text-sm text-muted-foreground"
        >
          QVT Box
        </a>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold">Sphere Famille</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Espace securise pour adolescents et parents : planning, alertes, suggestions et communaute invite-only.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/family/onboarding" className="text-sm font-semibold text-primary">
            Activer la famille
          </Link>
          <a href={ZENA_FAMILY_URL} className="text-sm text-muted-foreground">
            Acces web existant
          </a>
        </div>
      </div>
      <div className="rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold">Sphere Entreprise</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reseau interne et accompagnement RH : planning, alertes, suggestions et communaute pro.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/company/onboarding" className="text-sm font-semibold text-primary">
            Demander une demo
          </Link>
          <a href={ZENA_VOICE_URL} className="text-sm text-muted-foreground">
            ZENA Voice
          </a>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
      Contact: <a className="text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </div>
  </section>
);

export default LandingPage;
