// src/components/Navigation.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { QVTBOX_URL } from "@qvt/shared";

export default function Navigation() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // On change de page, on referme le menu mobile
    setOpenMobile(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-[#C3A878]"
      : "text-[#2D2620]/80 hover:text-[#C3A878]";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className={`mt-4 w-[94%] max-w-5xl rounded-2xl border border-white/40 bg-gradient-to-r from-[#FDF5E9]/90 via-[#FAF0E0]/80 to-[#F4E3CF]/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(30,15,5,0.35)] transition-all duration-300 pointer-events-auto px-4 md:px-6 py-2.5 flex items-center justify-between ${
          scrolled ? "translate-y-0 opacity-100" : "translate-y-0 opacity-100"
        }`}
      >
        {/* Logo + marque */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[#F6D38D] via-[#FBE6B5] to-[#E4C28F] shadow-md flex items-center justify-center overflow-hidden">
            <span className="text-[11px] font-semibold tracking-[0.16em] text-[#3A2617]">Z</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.9),transparent_55%)] opacity-80" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#8C7B61]">QVT BOX</span>
            <span className="text-sm font-medium text-[#221814]">ZÉNA · IA émotionnelle</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-7 text-[13px]">
          <Link to="/zena-chat" className={isActive("/zena-chat")}>
            Conversation ZÉNA
          </Link>
          <Link to="/onboarding-company" className={isActive("/onboarding-company")}>
            Espace RH
          </Link>
          <a
            href={QVTBOX_URL}
            className="text-[#2D2620]/70 hover:text-[#C3A878] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            QVT Box
          </a>
        </nav>

        {/* CTA + état en ligne */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-black/5 px-2 py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#6A5A4A]">
              ZÉNA est en ligne
            </span>
          </div>

          <Link
            to="/zena-chat"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#20130C] text-[12px] text-[#FDF5E7] px-4 py-2 shadow-[0_10px_30px_rgba(25,10,2,0.55)] hover:bg-black transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tester ZÉNA</span>
          </Link>
        </div>

        {/* Burger mobile */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 bg-white/70 shadow-sm"
          onClick={() => setOpenMobile((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          <span className="flex flex-col gap-[3px]">
            <span className="w-4 h-[1.5px] bg-[#20130C] rounded-full" />
            <span className="w-4 h-[1.5px] bg-[#20130C] rounded-full" />
          </span>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {openMobile && (
        <div className="fixed top-0 left-0 right-0 pt-20 px-4 pb-6 z-30 md:hidden">
          <div className="mx-auto w-full max-w-5xl rounded-3xl bg-[rgba(15,10,6,0.86)] backdrop-blur-2xl border border-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.65)] p-5 space-y-4 text-sm text-[#FDF2DE]">
            <Link to="/zena-chat" className="block py-1">
              Conversation ZÉNA
            </Link>
            <Link to="/onboarding-company" className="block py-1">
              Créer mon espace RH
            </Link>
            <a
              href={QVTBOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1"
            >
              Voir QVT Box
            </a>
            <hr className="border-white/10 my-2" />
            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#F6D38D] text-[#20130C] px-4 py-2 text-[12px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lui parler maintenant</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
