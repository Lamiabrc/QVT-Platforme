import type { ReactNode } from "react";
import SphereNav from "@/components/SphereNav";

type SphereLayoutProps = {
  sphere: "family" | "company";
  title: string;
  description: string;
  children: ReactNode;
};

const SphereLayout = ({ sphere, title, description, children }: SphereLayoutProps) => (
  <section className="space-y-6">
    <header className="space-y-3">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {sphere === "family" ? "Sphere famille" : "Sphere entreprise"}
      </p>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
      <SphereNav sphere={sphere} />
    </header>
    {children}
  </section>
);

export default SphereLayout;
