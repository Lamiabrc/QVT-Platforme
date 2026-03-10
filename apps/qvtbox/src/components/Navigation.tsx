import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationBell from "@/components/social/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const BASE_NAV_ITEMS = [
  { label: "Entreprise", path: "/entreprise" },
  { label: "Vie perso", path: "/famille" },
  { label: "ZÉNA", path: "/zena" },
  { label: "Lucioles", path: "/lucioles" },
  { label: "Sécurité", path: "/securite" },
  { label: "Box", path: "/box" },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  // Ferme le menu mobile quand on change de page
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navItems = useMemo(() => {
    if (!isAuthenticated) return BASE_NAV_ITEMS;

    // Priorité après login : retour dashboard + bulles
    return [
      { label: "Tableau de bord", path: "/dashboard" },
      { label: "Mes bulles", path: "/bulles" },
      ...BASE_NAV_ITEMS,
    ];
  }, [isAuthenticated]);

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const homeTarget = isAuthenticated ? "/dashboard" : "/";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#2A2520] bg-[#151515]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to={homeTarget} className="relative flex items-center gap-3">
          <div className="absolute -inset-2 rounded-full bg-[#F3E0B9]/20 blur-md" />
          <img
            src="/logo-qvt.jpeg"
            alt="QVT Box"
            className="relative h-10 w-10 rounded-full border border-[#F3E0B9]/40 object-cover shadow sm:h-11 sm:w-11"
          />
          <span className="relative text-base font-semibold tracking-tight text-[#F3E0B9] sm:text-lg">
            QVT Box
          </span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? "font-medium text-[#F3E0B9]"
                    : "text-[#E5D7BF]/75 hover:text-[#F3E0B9]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

          {isAuthenticated ? (
            <>
              <NotificationBell className="px-3 py-2 text-xs" />

              <div className="flex items-center gap-2">
                <Link
                  to="/profil"
                  className="rounded-full bg-[#F3E0B9] px-4 py-2 text-xs font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
                >
                  Compte
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-[#3A332D] px-4 py-2 text-xs text-[#E5D7BF] transition hover:border-[#F3E0B9] hover:text-[#F3E0B9]"
                >
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="rounded-full bg-[#F3E0B9] px-4 py-2 text-xs font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
            >
              Compte
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-[#2F2923] bg-[#1B1916] p-2 md:hidden"
        >
          {open ? (
            <X className="h-5 w-5 text-[#E5D7BF]" />
          ) : (
            <Menu className="h-5 w-5 text-[#E5D7BF]" />
          )}
        </button>
      </div>

      {open ? (
        <div className="max-h-[calc(100vh-72px)] space-y-4 overflow-y-auto border-t border-[#2A2520] bg-[#1A1816] px-4 py-5 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-2xl px-4 py-3 text-sm ${
                isActive(item.path)
                  ? "bg-[#F3E0B9] text-[#151515]"
                  : "bg-[#201D19] text-[#E5D7BF]/80 hover:bg-[#2A2520]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <Link
              to="/notifications"
              className={`block rounded-2xl px-4 py-3 text-sm ${
                isActive("/notifications")
                  ? "bg-[#F3E0B9] text-[#151515]"
                  : "bg-[#201D19] text-[#E5D7BF]/80 hover:bg-[#2A2520]"
              }`}
            >
              Notifications
            </Link>
          ) : null}

          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

          {isAuthenticated ? (
            <div className="grid gap-2">
              <Link
                to="/profil"
                className="block rounded-full bg-[#F3E0B9] px-4 py-3 text-center text-sm font-medium text-[#151515]"
              >
                Compte
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await handleLogout();
                  setOpen(false);
                }}
                className="block rounded-full border border-[#F3E0B9] px-4 py-3 text-center text-sm font-medium text-[#F3E0B9]"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="block rounded-full border border-[#F3E0B9] bg-[#151515] px-4 py-3 text-center text-sm font-medium text-[#F3E0B9]"
            >
              Compte
            </Link>
          )}
        </div>
      ) : null}
    </nav>
  );
}
