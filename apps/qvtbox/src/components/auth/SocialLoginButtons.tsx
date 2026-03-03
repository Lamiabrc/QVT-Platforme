import { useState } from "react";
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

const PROVIDERS: ProviderButton[] = [
  { provider: "google", label: "Google", icon: Chrome },
  { provider: "facebook", label: "Facebook", icon: Facebook },
  { provider: "linkedin", label: "LinkedIn", icon: Linkedin },
];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Le provider n'est pas disponible pour le moment.";
};

const SocialLoginButtons = ({ redirectTo, className }: SocialLoginButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const { toast } = useToast();

  const handleProviderLogin = async (provider: OAuthProvider) => {
    if (loadingProvider) return;

    setLoadingProvider(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      toast({
        title: `Connexion ${provider} indisponible`,
        description: getErrorMessage(error),
        variant: "destructive",
      });
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("grid gap-2 sm:grid-cols-3", className)}>
      {PROVIDERS.map(({ provider, label, icon: Icon }) => {
        const isLoading = loadingProvider === provider;

        return (
          <Button
            key={provider}
            type="button"
            variant="outline"
            disabled={Boolean(loadingProvider)}
            onClick={() => handleProviderLogin(provider)}
            className="h-11 rounded-2xl border-[#E8DCC8] bg-white text-[#2B2926] hover:bg-[#F8F2E8]"
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
