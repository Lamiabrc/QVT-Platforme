import { useMemo, useState } from "react";
import { Chrome, Facebook, Linkedin, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type OAuthProvider = Parameters<typeof supabase.auth.signInWithOAuth>[0]["provider"];

interface SocialLoginButtonsProps {
  redirectTo: string;
  className?: string;
}

type ProviderButton = {
  provider: OAuthProvider;
  label: string;
  icon: LucideIcon;
};

const ALL_PROVIDERS: ProviderButton[] = [
  { provider: "google", label: "Google", icon: Chrome },
  { provider: "facebook", label: "Facebook", icon: Facebook },
  { provider: "linkedin", label: "LinkedIn", icon: Linkedin },
];

const parseEnabledProviders = (): OAuthProvider[] | null => {
  // Exemple: VITE_OAUTH_PROVIDERS=google,facebook
  const raw = (import.meta as any)?.env?.VITE_OAUTH_PROVIDERS as string | undefined;
  if (!raw) return null;

  const cleaned = raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  // On filtre uniquement les providers connus
  const allowed = new Set<OAuthProvider>(["google", "facebook", "linkedin"]);
  const result = cleaned.filter((p) => allowed.has(p as OAuthProvider)) as OAuthProvider[];

  return result.length ? result : [];
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  return "Le provider n'est pas disponible pour le moment.";
};

const SocialLoginButtons = ({ redirectTo, className }: SocialLoginButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const { toast } = useToast();

  const enabledProviders = useMemo(() => parseEnabledProviders(), []);

  const providersToRender = useMemo(() => {
    // Si pas d'env -> on affiche tout (comportement backward compatible)
    if (enabledProviders === null) return ALL_PROVIDERS;
    // Si env présente mais vide -> on n'affiche rien
    if (enabledProviders.length === 0) return [];
    // Sinon on filtre selon env
    return ALL_PROVIDERS.filter((p) => enabledProviders.includes(p.provider));
  }, [enabledProviders]);

  const handleProviderLogin = async (provider: OAuthProvider) => {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) throw error;

      // En cas de succès, Supabase redirige normalement le navigateur.
      // Si pour une raison quelconque la redirection ne se fait pas, on laisse l'état tel quel.
    } catch (error: unknown) {
      toast({
        title: "Connexion indisponible",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      setLoadingProvider(null);
    }
  };

  // Si l'env est définie mais ne contient aucun provider valide
  if (enabledProviders !== null && providersToRender.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm text-[#6F6454]",
          className
        )}
      >
        Les connexions sociales ne sont pas activées pour le moment.
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
            onClick={() => handleProviderLogin(provider)}
            className="h-11 rounded-2xl border-[#E8DCC8] bg-white text-[#2B2926] hover:bg-[#F8F2E8]"
            aria-label={`Se connecter avec ${label}`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialLoginButtons;
