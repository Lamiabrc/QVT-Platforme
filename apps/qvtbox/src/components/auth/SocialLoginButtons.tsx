import { useMemo, useState } from "react";
import { Chrome, Facebook, Linkedin, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  OAUTH_PROVIDERS,
  type SupabaseOAuthProvider,
  type SupportedOAuthProvider,
  getOAuthErrorMessage,
  isProviderNotEnabledError,
  parseEnabledOAuthProviders,
} from "@/lib/authProviders";
import { cn } from "@/lib/utils";

interface SocialLoginButtonsProps {
  redirectTo: string;
  className?: string;
}

type ProviderButton = {
  provider: SupportedOAuthProvider;
  label: string;
  icon: LucideIcon;
};

const PROVIDER_ICONS: Record<SupportedOAuthProvider, LucideIcon> = {
  google: Chrome,
  facebook: Facebook,
  linkedin_oidc: Linkedin,
};

const ALL_PROVIDERS: ProviderButton[] = OAUTH_PROVIDERS.map((provider) => ({
  provider: provider.provider,
  label: provider.label,
  icon: PROVIDER_ICONS[provider.provider],
}));

const SocialLoginButtons = ({ redirectTo, className }: SocialLoginButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<SupportedOAuthProvider | null>(null);
  const [runtimeDisabledProviders, setRuntimeDisabledProviders] = useState<Set<SupportedOAuthProvider>>(
    () => new Set(),
  );
  const { toast } = useToast();

  const enabledProviders = useMemo(() => {
    const raw = (import.meta as any)?.env?.VITE_OAUTH_PROVIDERS as string | undefined;
    return parseEnabledOAuthProviders(raw);
  }, []);

  const providersToRender = useMemo(() => {
    const configured =
      enabledProviders === null
        ? ALL_PROVIDERS
        : ALL_PROVIDERS.filter((provider) => enabledProviders.includes(provider.provider));

    return configured.filter((provider) => !runtimeDisabledProviders.has(provider.provider));
  }, [enabledProviders, runtimeDisabledProviders]);

  const handleProviderLogin = async (provider: SupportedOAuthProvider, label: string) => {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as SupabaseOAuthProvider,
        options: { redirectTo },
      });

      if (error) throw error;

      // Supabase should redirect. If it does not, unlock button state after a short timeout.
      window.setTimeout(() => {
        setLoadingProvider((current) => (current === provider ? null : current));
      }, 7000);
    } catch (error: unknown) {
      const message = getOAuthErrorMessage(error);

      if (isProviderNotEnabledError(error)) {
        console.warn("[auth] OAuth provider disabled", { provider, error });
        setRuntimeDisabledProviders((current) => {
          const next = new Set(current);
          next.add(provider);
          return next;
        });

        toast({
          title: "Connexion sociale non activee",
          description: `${label} n'est pas active dans Supabase pour le moment.`,
          variant: "destructive",
        });
      } else {
        console.error("[auth] OAuth login failed", { provider, error });
        toast({
          title: "Connexion indisponible",
          description: message,
          variant: "destructive",
        });
      }

      setLoadingProvider(null);
    }
  };

  if (providersToRender.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm text-[#6F6454]",
          className,
        )}
      >
        Les connexions sociales ne sont pas activees pour le moment.
      </div>
    );
  }

  return (
    <div className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {providersToRender.map(({ provider, label, icon: Icon }) => {
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            disabled={Boolean(loadingProvider)}
            onClick={() => handleProviderLogin(provider, label)}
            className="h-11 rounded-2xl border-[#E8DCC8] bg-white text-[#2B2926] hover:bg-[#F8F2E8]"
            aria-label={`Se connecter avec ${label}`}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialLoginButtons;

