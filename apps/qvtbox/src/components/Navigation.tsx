import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import LanguageSelector from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const navItems = [
  { label: "Entreprise", path: "/entreprise" },
  { label: "Vie perso", path: "/famille" },
  { label: "ZÉNA", path: "/zena" },
  { label: "Lucioles", path: "/lucioles" },
  { label: "Sécurité", path: "/securite" },
  { label: "Box", path: "/box" },
  { label: "Contact", path: "/contact" },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2520] bg-[#151515]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="relative flex items-center gap-3">
          <div className="absolute -inset-2 rounded-full bg-[#F3E0B9]/20 blur-md" />
          <img
            src="/logo-qvt.jpeg"
            alt="QVT Box"
            className="relative h-11 w-11 rounded-full border border-[#F3E0B9]/40 object-cover shadow"
          />
          <span className="relative text-lg font-semibold tracking-tight text-[#F3E0B9]">
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

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

          {isAuthenticated ? (
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
          ) : (
            <Link
              to="/auth/login"
              className="rounded-full bg-[#F3E0B9] px-4 py-2 text-xs font-semibold text-[#151515] transition hover:bg-[#F7E7C5]"
            >
              Compte
            </Link>
          )}
        </div>

        <button onClick={() => setOpen((prev) => !prev)} className="p-1 md:hidden">
          {open ? (
            <X className="h-7 w-7 text-[#E5D7BF]" />
          ) : (
            <Menu className="h-7 w-7 text-[#E5D7BF]" />
          )}
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-[#2A2520] bg-[#1A1816] px-6 py-6 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-3 text-sm ${
                isActive(item.path)
                  ? "bg-[#F3E0B9] text-[#151515]"
                  : "bg-[#201D19] text-[#E5D7BF]/80 hover:bg-[#2A2520]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

          {isAuthenticated ? (
            <div className="grid gap-2">
              <Link
                to="/profil"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[#F3E0B9] px-4 py-2 text-center text-sm font-medium text-[#151515]"
              >
                Compte
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block rounded-full border border-[#F3E0B9] px-4 py-2 text-center text-sm font-medium text-[#F3E0B9]"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-[#F3E0B9] bg-[#151515] px-4 py-2 text-center text-sm font-medium text-[#F3E0B9]"
            >
              Compte
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
