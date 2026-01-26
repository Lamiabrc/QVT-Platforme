import { useState } from "react";
import { Heart, Shield, Users, ChevronUp, ChevronDown } from "lucide-react";
import { CONTACT_EMAIL, QVTBOX_URL, ZENA_FAMILY_URL } from "@qvt/shared";

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-[#1F1309] text-[#FDF3E0] border-t border-[#C89A53]/20">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-[#F5D091] font-semibold">QVT Box</span>
          <span className="text-[#FDF3E0]/80 hidden sm:inline">
            {CONTACT_EMAIL} · +33 6 76 43 55 51 · Rennes, France
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#F5D091]/40 px-3 py-1 text-xs text-[#FDF3E0] hover:border-[#F5D091]"
            aria-expanded={open}
          >
            <span>Menu</span>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <a href="/zena-chat" className="text-[#F5D091] hover:text-white text-xs">
            Parler à ZÉNA
          </a>
        </div>
      </div>

      {open && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* À propos */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#F5D091]">QVT Box</h3>
              <p className="text-sm text-[#FDF3E0]/80 leading-relaxed">
                ZÉNA est l&apos;IA émotionnelle qui veille sur vos équipes, détecte les signaux faibles et prévient le burn-out.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#F5D091]">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={QVTBOX_URL} className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                    QVT Box
                  </a>
                </li>
                <li>
                  <a href={ZENA_FAMILY_URL} className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                    ZÉNA Famille &amp; Ados
                  </a>
                </li>
                <li>
                  <a href="/zena-chat" className="text-[#FDF3E0]/80 hover:text-[#F5D091] transition-colors">
                    Parler à ZÉNA
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#F5D091]">Contact</h3>
              <ul className="space-y-2 text-sm text-[#FDF3E0]/80">
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#F5D091] transition-colors">
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a href="tel:+33676435551" className="hover:text-[#F5D091] transition-colors">
                    +33 6 76 43 55 51
                  </a>
                </li>
                <li>
                  <span className="block text-[#FDF3E0]/80">Rennes, Bretagne, France</span>
                </li>
              </ul>
            </div>

            {/* Valeurs */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#F5D091]">Nos valeurs</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                  <Heart className="w-4 h-4 text-[#F5D091]" />
                  <span>Empathie</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                  <Shield className="w-4 h-4 text-[#F5D091]" />
                  <span>Confidentialité</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#FDF3E0]/80">
                  <Users className="w-4 h-4 text-[#F5D091]" />
                  <span>Bien-être</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-[#C89A53]/15 text-center text-xs text-[#FDF3E0]/60 py-3">
        &copy; {new Date().getFullYear()} QVT Box. Tous droits réservés.
      </div>
    </footer>
  );
}
