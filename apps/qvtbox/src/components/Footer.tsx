// src/components/Footer.tsx
import { Link } from "react-router-dom";
import {
  Heart,
  Linkedin,
  Youtube,
  Instagram,
  Twitch,
  Facebook,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#151515] text-[#ECE7DF] border-t border-[#2D2721]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* TOP: LOGO + TAGLINE + NAV */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* BRAND */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#F3E0B9]/30 blur-lg" />
              <img
                src="/logo-qvt.jpeg"
                alt="QVT Box"
                className="relative h-14 w-14 rounded-full object-cover border border-[#F3E0B9]/40 shadow-md"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[#F3E0B9]">
                QVT Box
              </h3>
              <p className="text-xs text-[#CDBEA9] mt-1">
                Santé émotionnelle & QVCT
              </p>
              <p className="text-[11px] text-[#AFA292]">
                « Sortez de votre bulle, on veille sur vous. »
              </p>
            </div>
          </div>

          {/* MAIN NAV — aligné avec Navigation & App.tsx */}
          <nav className="text-sm">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[#DCCFB9]">
              <li>
                <Link to="/" className="hover:text-[#F3E0B9] transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/saas" className="hover:text-[#F3E0B9] transition">
                  Entreprise (Licence SaaS)
                </Link>
              </li>
              <li>
                <Link to="/box" className="hover:text-[#F3E0B9] transition">
                  Box QVT
                </Link>
              </li>
              <li>
                <Link to="/boutique" className="hover:text-[#F3E0B9] transition">
                  Boutique
                </Link>
              </li>
              <li>
                <Link
                  to="/simulateur"
                  className="hover:text-[#F3E0B9] transition"
                >
                  Ma Bulle Attentionnée
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F3E0B9] transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F3E0B9] transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/zena" className="hover:text-[#F3E0B9] transition">
                  ZÉNA Entreprise
                </Link>
              </li>
              <li>
                <Link
                  to="/zena-family"
                  className="hover:text-[#F3E0B9] transition"
                >
                  ZÉNA Family
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* SEPARATOR */}
        <div className="border-t border-[#2A2520] mt-10" />

        {/* BOTTOM: LEGAL + SOCIALS */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* LEGAL */}
          <div className="space-y-2 text-xs text-[#CFC4B1]">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/mentions-legales"
                className="hover:text-[#F3E0B9] transition"
              >
                Mentions légales
              </Link>
              <Link
                to="/politique-confidentialite"
                className="hover:text-[#F3E0B9] transition"
              >
                Politique de confidentialité
              </Link>
              <Link to="/cgv" className="hover:text-[#F3E0B9] transition">
                CGV
              </Link>
            </div>

            <p className="text-[11px] text-[#AFA292]">
              © {year} QVT Box — Conçu avec{" "}
              <Heart className="inline-block w-3 h-3 text-red-400" /> et
              beaucoup d’espoir.
            </p>
          </div>

          {/* SOCIALS */}
          <div className="flex flex-wrap gap-3">
            {[
              {
                name: "LinkedIn",
                icon: Linkedin,
                href: "https://www.linkedin.com/company/qvt-box",
              },
              {
                name: "YouTube",
                icon: Youtube,
                href: "https://www.youtube.com/@qvtbox",
              },
              {
                name: "Instagram",
                icon: Instagram,
                href: "https://www.instagram.com/qvtbox",
              },
              {
                name: "Facebook",
                icon: Facebook,
                href: "https://www.facebook.com/QVTBOX/",
              },
              {
                name: "Twitch",
                icon: Twitch,
                href: "https://www.twitch.tv/lamiazaina",
              },
            ].map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] rounded-full border border-[#2F2923] bg-[#1B1916] px-3.5 py-1.5 text-[#E5D7BF]/85 hover:text-[#F3E0B9] hover:border-[#F3E0B9]/60 transition"
              >
                <Icon className="h-3.5 w-3.5" />
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
