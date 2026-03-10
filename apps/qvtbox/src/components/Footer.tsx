import { Link } from "react-router-dom";
import { Heart, Linkedin, Youtube, Instagram, Twitch, Facebook } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#2D2721] bg-[#151515] text-[#ECE7DF]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#F3E0B9]/30 blur-lg" />
              <img
                src="/logo-qvt.jpeg"
                alt="QVT Box"
                className="relative h-12 w-12 rounded-full border border-[#F3E0B9]/40 object-cover shadow-md sm:h-14 sm:w-14"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[#F3E0B9] sm:text-xl">QVT Box</h3>
              <p className="mt-1 text-xs text-[#CDBEA9]">Réseau social responsable</p>
              <p className="text-[11px] text-[#AFA292]">Privé par défaut. Partage choisi.</p>
            </div>
          </div>

          <nav className="text-sm">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[#DCCFB9] md:justify-end md:gap-x-6">
              <li>
                <Link to="/" className="transition hover:text-[#F3E0B9]">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/entreprise" className="transition hover:text-[#F3E0B9]">
                  Entreprise
                </Link>
              </li>
              <li>
                <Link to="/famille" className="transition hover:text-[#F3E0B9]">
                  Vie perso
                </Link>
              </li>
              <li>
                <Link to="/zena" className="transition hover:text-[#F3E0B9]">
                  ZÉNA
                </Link>
              </li>
              <li>
                <Link to="/lucioles" className="transition hover:text-[#F3E0B9]">
                  Lucioles
                </Link>
              </li>
              <li>
                <Link to="/securite" className="transition hover:text-[#F3E0B9]">
                  Sécurité
                </Link>
              </li>
              <li>
                <Link to="/box" className="transition hover:text-[#F3E0B9]">
                  Box
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-[#F3E0B9]">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-[#2A2520]" />

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-center text-xs text-[#CFC4B1] md:text-left">
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Link to="/mentions-legales" className="transition hover:text-[#F3E0B9]">
                Mentions légales
              </Link>
              <Link to="/politique-confidentialite" className="transition hover:text-[#F3E0B9]">
                Politique de confidentialité
              </Link>
              <Link to="/cgv" className="transition hover:text-[#F3E0B9]">
                CGV
              </Link>
            </div>

            <p className="text-[11px] text-[#AFA292]">
              © {year} QVT Box - Conçu avec <Heart className="inline-block h-3 w-3 text-red-400" /> et
              beaucoup d&apos;espoir.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
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
                className="flex items-center gap-2 rounded-full border border-[#2F2923] bg-[#1B1916] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[#E5D7BF]/85 transition hover:border-[#F3E0B9]/60 hover:text-[#F3E0B9] sm:px-3.5 sm:text-[11px]"
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
