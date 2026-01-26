export type UniverseLink = {
  label: string;
  href: string;
};

export type UniverseConfig = {
  id: "qvtbox" | "zena-family" | "zena-voice";
  name: string;
  tagline: string;
  background: string;
  foreground: string;
  accent: string;
  accentForeground: string;
  primary: string;
  primaryForeground: string;
  footerLinks: UniverseLink[];
  showHeader?: boolean;
  showFooter?: boolean;
};

export const qvtboxUniverse: UniverseConfig = {
  id: "qvtbox",
  name: "QVT Box",
  tagline: "Hub QVT et creation de compte famille",
  background: "0 0% 100%",
  foreground: "240 10% 3.9%",
  accent: "280 75% 65%",
  accentForeground: "280 15% 15%",
  primary: "250 75% 68%",
  primaryForeground: "0 0% 98%",
  footerLinks: [
    { label: "Contact", href: "/contact" },
    { label: "Confidentialite", href: "/politique-confidentialite" },
    { label: "Mentions", href: "/mentions-legales" },
  ],
  showHeader: false,
  showFooter: true,
};

export const zenaFamilyUniverse: UniverseConfig = {
  id: "zena-family",
  name: "ZENA Family",
  tagline: "IA emotionnelle pour adolescents",
  background: "0 0% 100%",
  foreground: "240 10% 3.9%",
  accent: "170 70% 50%",
  accentForeground: "0 0% 100%",
  primary: "270 70% 60%",
  primaryForeground: "0 0% 100%",
  footerLinks: [
    { label: "Contact", href: "mailto:contact@qvtbox.com" },
    { label: "Confidentialite", href: "/politique-confidentialite" },
    { label: "Mentions", href: "/mentions-legales" },
  ],
  showHeader: false,
  showFooter: true,
};

export const zenaVoiceUniverse: UniverseConfig = {
  id: "zena-voice",
  name: "ZENA Voice",
  tagline: "Moteur IA et voix",
  background: "39 45% 95%",
  foreground: "20 20% 12%",
  accent: "38 70% 60%",
  accentForeground: "20 20% 12%",
  primary: "38 72% 52%",
  primaryForeground: "20 20% 12%",
  footerLinks: [
    { label: "Contact", href: "mailto:contact@qvtbox.com" },
    { label: "Confidentialite", href: "/politique-confidentialite" },
    { label: "Mentions", href: "/mentions-legales" },
  ],
  showHeader: false,
  showFooter: true,
};
