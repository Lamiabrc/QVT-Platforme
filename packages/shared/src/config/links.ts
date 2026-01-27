type LinkEnv = {
  VITE_QVTBOX_URL?: string;
  VITE_ZENA_FAMILY_URL?: string;
  VITE_ZENA_VOICE_URL?: string;
  VITE_CONTACT_EMAIL?: string;
};

const env = (import.meta.env as LinkEnv | undefined) ?? {};

export const QVTBOX_URL = env.VITE_QVTBOX_URL ?? "https://www.qvtbox.com";
export const ZENA_FAMILY_URL =
  env.VITE_ZENA_FAMILY_URL ?? "https://zena-family.qvtbox.com";
export const ZENA_VOICE_URL = env.VITE_ZENA_VOICE_URL ?? "https://zena.qvtbox.com";
export const CONTACT_EMAIL = env.VITE_CONTACT_EMAIL ?? "contact@qvtbox.com";

export const QVTBOX_ROUTES = {
  home: "/",
  entreprise: "/entreprise",
  entrepriseJoin: "/entreprise/rejoindre",
  famille: "/famille",
  familleCreate: "/famille/creer",
  familleInvite: "/famille/inviter",
  choisirSphere: "/choisir-sphere",
} as const;
