import { supabase } from "@/integrations/supabase/client";

export type SupabaseOAuthProvider = Parameters<typeof supabase.auth.signInWithOAuth>[0]["provider"];

export type SupportedOAuthProvider = "google" | "facebook" | "linkedin_oidc";

type OAuthProviderDefinition = {
  provider: SupportedOAuthProvider;
  label: string;
};

export const OAUTH_PROVIDERS: OAuthProviderDefinition[] = [
  { provider: "google", label: "Google" },
  { provider: "facebook", label: "Facebook" },
  { provider: "linkedin_oidc", label: "LinkedIn" },
];

const PROVIDER_ALIAS: Record<string, SupportedOAuthProvider> = {
  google: "google",
  facebook: "facebook",
  linkedin: "linkedin_oidc",
  linkedin_oidc: "linkedin_oidc",
};

export const normalizeOAuthProvider = (value: string): SupportedOAuthProvider | null => {
  const normalized = value.trim().toLowerCase();
  return PROVIDER_ALIAS[normalized] ?? null;
};

export const parseEnabledOAuthProviders = (
  raw: string | undefined,
): SupportedOAuthProvider[] | null => {
  if (raw === undefined) return null;

  const values = raw
    .split(",")
    .map((value) => normalizeOAuthProvider(value))
    .filter((value): value is SupportedOAuthProvider => Boolean(value));

  if (values.length === 0) return [];

  const seen = new Set<SupportedOAuthProvider>();
  const deduped: SupportedOAuthProvider[] = [];

  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    deduped.push(value);
  }

  return deduped;
};

export const getOAuthErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object") {
    const withMessage = error as { message?: string; msg?: string; error_description?: string };
    const candidate = withMessage.message ?? withMessage.msg ?? withMessage.error_description;
    if (candidate && candidate.trim()) return candidate;
  }
  if (typeof error === "string" && error.trim()) return error;
  return "Le provider n'est pas disponible pour le moment.";
};

export const isProviderNotEnabledError = (error: unknown): boolean => {
  const message = getOAuthErrorMessage(error).toLowerCase();
  return message.includes("unsupported provider") || message.includes("provider is not enabled");
};

