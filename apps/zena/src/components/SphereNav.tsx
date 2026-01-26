import { NavLink } from "react-router-dom";
import { QVTBOX_URL } from "@qvt/shared";

type SphereNavProps = {
  sphere: "family" | "company";
};

const links = {
  family: [
    { label: "Accueil", to: "/family/home" },
    { label: "Chat", to: "/family/chat" },
    { label: "Planning", to: "/family/planning" },
    { label: "Alertes", to: "/family/alerts" },
    { label: "Communaute", to: "/family/community" },
  ],
  company: [
    { label: "Accueil", to: "/company/home" },
    { label: "Chat", to: "/company/chat" },
    { label: "Planning", to: "/company/planning" },
    { label: "Alertes", to: "/company/alerts" },
    { label: "Communaute", to: "/company/community" },
  ],
};

const SphereNav = ({ sphere }: SphereNavProps) => (
  <div className="flex flex-wrap items-center gap-3 text-sm">
    {links[sphere].map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `rounded-full border px-3 py-1 ${
            isActive
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`
        }
      >
        {link.label}
      </NavLink>
    ))}
    <a
      href={QVTBOX_URL}
      className="rounded-full border border-border px-3 py-1 text-muted-foreground hover:text-foreground"
    >
      QVT Box
    </a>
    <NavLink
      to="/choose-sphere"
      className="rounded-full border border-border px-3 py-1 text-muted-foreground hover:text-foreground"
    >
      Changer de sphere
    </NavLink>
  </div>
);

export default SphereNav;
