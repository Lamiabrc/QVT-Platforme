import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import SphereNav from "@/components/SphereNav";

type SphereLayoutProps = {
  sphere: "family" | "company";
  title: string;
  description: string;
  children: ReactNode;
};

const SphereLayout = ({ sphere, title, description, children }: SphereLayoutProps) => (
  <section className={`space-y-6 ${sphere === "company" ? "zena-pro" : ""}`}>
    <div className="zena-stage p-6 md:p-8">
      <header className="space-y-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {sphere === "family" ? "Sphere famille" : "Sphere entreprise"}
            </p>
            <h1 className="text-3xl font-semibold">{title}</h1>
          </div>
          <div className="zena-tabs">
            <NavLink
              to="/company/home"
              className={({ isActive }) =>
                `zena-tab ${isActive ? "is-active" : ""}`
              }
            >
              PRO
            </NavLink>
            <NavLink
              to="/family/home"
              className={({ isActive }) =>
                `zena-tab ${isActive ? "is-active" : ""}`
              }
            >
              FAMILLE
            </NavLink>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="zena-avatar">Z</div>
          <div>
            <div className="zena-brand text-2xl">ZENA</div>
            <p className="text-sm text-muted-foreground">
              L'IA emotionnelle qui ecoute sans juger.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
      </header>
    </div>

    <SphereNav sphere={sphere} />
    {children}
  </section>
);

export default SphereLayout;
