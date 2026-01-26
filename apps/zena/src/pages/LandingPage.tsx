import { Link } from "react-router-dom";
import { CONTACT_EMAIL, QVTBOX_URL, ZENA_FAMILY_URL, ZENA_VOICE_URL } from "@qvt/shared";
import ZenaHeroLanding from "@/components/ZenaHeroLanding";

const LandingPage = () => (
  <section className="space-y-12 -mx-4 w-screen">
    <ZenaHeroLanding />

    <div id="hub" className="mx-auto w-full max-w-5xl px-6 space-y-8">
      <div className="zena-card space-y-3">
        <p className="zena-section-title">Le projet ZENA en trois univers</p>
        <p className="text-sm text-muted-foreground">
          Le zoom vous amène vers un hub clair : concept (QVT Box), ZENA Pro et ZENA Famille.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="zena-card space-y-3">
          <h2 className="text-lg font-semibold">Concept</h2>
          <p className="text-sm text-muted-foreground">
            QVT Box porte la vision : IA emotionnelle + actions concretes.
          </p>
          <a href={QVTBOX_URL} className="text-sm text-primary">
            Aller vers QVT Box
          </a>
        </div>
        <div className="zena-card space-y-3">
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="text-sm text-muted-foreground">
            ZENA entreprise pour les equipes et les reseaux internes.
          </p>
          <Link to="/company/home" className="text-sm text-primary">
            Ouvrir ZENA Pro
          </Link>
          <a href={ZENA_VOICE_URL} className="text-xs text-muted-foreground">
            Site ZENA Voice
          </a>
        </div>
        <div className="zena-card space-y-3">
          <h2 className="text-lg font-semibold">Perso</h2>
          <p className="text-sm text-muted-foreground">
            ZENA famille pour les ados, guardians et amis invites.
          </p>
          <Link to="/family/home" className="text-sm text-primary">
            Ouvrir ZENA Famille
          </Link>
          <a href={ZENA_FAMILY_URL} className="text-xs text-muted-foreground">
            Site ZENA Family
          </a>
        </div>
      </div>

      <div className="zena-card text-sm text-muted-foreground">
        Contact:{" "}
        <a className="text-primary" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </div>
    </div>
  </section>
);

export default LandingPage;
