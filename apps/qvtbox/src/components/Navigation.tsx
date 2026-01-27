// src/components/Navigation.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import { Menu, X, Settings } from "lucide-react";
import { QVTBOX_ROUTES } from "@qvt/shared";

export default function Navigation() {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { language, setLanguage } = useLanguage();

  const [open, setOpen] = useState(false);

  /** 🔥 Version simplifiée + premium */
  const navItems = [
    { label: "Accueil", path: "/" },
    { label: "Entreprise", path: QVTBOX_ROUTES.entreprise },
    { label: "Famille", path: QVTBOX_ROUTES.famille },
    { label: "Box QVT", path: "/box" },
    { label: "Engagements", path: "/engagements" },  // 🆕 AJOUT ICI
    { label: "Contact", path: "/contact" },
    { label: "Choisir ma sphère", path: QVTBOX_ROUTES.choisirSphere },
  ];

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#151515]/95 backdrop-blur-xl border-b border-[#2A2520]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* LOGO + HALO */}
        <Link to="/" className="relative flex items-center gap-3">
          <div className="absolute -inset-2 bg-[#F3E0B9]/20 blur-md rounded-full" />
          <img
            src="/logo-qvt.jpeg"
            alt="QVT Box"
            className="relative w-11 h-11 rounded-full object-cover border border-[#F3E0B9]/40 shadow"
          />
          <span className="relative text-lg font-semibold text-[#F3E0B9] tracking-tight">
            QVT Box
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? "text-[#F3E0B9] font-medium"
                    : "text-[#E5D7BF]/75 hover:text-[#F3E0B9]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4">

          {/* CTA ZÉNA */}
          <Link
            to="/zena"
            className="px-4 py-1.5 rounded-full border border-[#3A332D] text-[11px] uppercase tracking-[0.16em] text-[#E5D7BF]/90 hover:border-[#F3E0B9]/70 hover:text-[#F3E0B9] transition"
          >
            ZÉNA
          </Link>

          {/* LANGUE */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />

          {/* COMPTE */}
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="px-4 py-2 rounded-full bg-[#F3E0B9] text-[#151515] text-xs font-semibold hover:bg-[#F7E7C5] transition"
          >
            {user ? "Dashboard" : "Connexion"}
          </Link>

          {/* ADMIN */}
          {user && isAdmin && (
            <Link
              to="/admin"
              className="p-2 rounded-full border border-[#3A332D] text-[#E5D7BF] hover:border-[#F3E0B9] transition"
            >
              <Settings className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-1">
          {open ? (
            <X className="w-7 h-7 text-[#E5D7BF]" />
          ) : (
            <Menu className="w-7 h-7 text-[#E5D7BF]" />
          )}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="md:hidden bg-[#1A1816] border-t border-[#2A2520] px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-3 py-3 rounded-lg text-sm ${
                isActive(item.path)
                  ? "bg-[#F3E0B9] text-[#151515]"
                  : "text-[#E5D7BF]/80 bg-[#201D19] hover:bg-[#2A2520]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* ZÉNA */}
          <Link
            to="/zena"
            className="block text-center px-4 py-2 rounded-full bg-[#F3E0B9] text-[#151515] text-sm font-medium"
          >
            ZÉNA
          </Link>

          {/* LANGUE */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
          />

          {/* COMPTE */}
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="block text-center px-4 py-2 rounded-full bg-[#151515] border border-[#F3E0B9] text-[#F3E0B9] text-sm font-medium"
          >
            {user ? "Dashboard" : "Connexion"}
          </Link>
        </div>
      )}
    </nav>
  );
}
