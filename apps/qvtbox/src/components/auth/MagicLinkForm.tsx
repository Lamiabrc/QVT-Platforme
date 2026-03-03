import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MagicLinkForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [armingCount, setArmingCount] = useState(0);
  const [cooldownCount, setCooldownCount] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const startArming = () => {
    setArmingCount(8);
    const interval = setInterval(() => {
      setArmingCount((count) => {
        if (count <= 1) {
          clearInterval(interval);
          return 0;
        }
        return count - 1;
      });
    }, 1000);
  };

  const startCooldown = () => {
    setCooldownCount(60);
    const interval = setInterval(() => {
      setCooldownCount((count) => {
        if (count <= 1) {
          clearInterval(interval);
          return 0;
        }
        return count - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || armingCount > 0 || cooldownCount > 0) return;

    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    startArming();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("rate limit") || error.message.includes("too many")) {
          toast({
            title: "Limite atteinte",
            description: "Trop de demandes rapprochées. Réessayez dans une minute.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message || "Impossible d'envoyer l'email. Réessayez.",
            variant: "destructive",
          });
        }
        return;
      }

      setEmailSent(true);
      startCooldown();
      toast({
        title: "Lien envoyé",
        description: "Ouvrez l'email depuis cet appareil pour vous connecter.",
      });
    } catch {
      toast({
        title: "Erreur réseau",
        description: "Problème de connexion. Vérifiez votre internet.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (armingCount > 0) {
      return (
        <>
          <Clock className="w-4 h-4 animate-spin" />
          Activation... {armingCount}s
        </>
      );
    }

    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Envoi en cours...
        </>
      );
    }

    if (cooldownCount > 0) {
      return (
        <>
          <Clock className="w-4 h-4" />
          Renvoyer dans {cooldownCount}s
        </>
      );
    }

    if (emailSent) {
      return (
        <>
          <Mail className="w-4 h-4" />
          Renvoyer le lien
        </>
      );
    }

    return (
      <>
        <Mail className="w-4 h-4" />
        Recevoir le lien magique
      </>
    );
  };

  const isButtonDisabled = armingCount > 0 || loading || cooldownCount > 0;

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-center">
          {emailSent ? "Email envoyé" : "Connexion par lien magique"}
        </h2>
        <p className="mt-2 text-center text-sm text-[#6F6454]">
          {emailSent
            ? "Vérifiez votre boîte email (et vos spams)."
            : "Pas de mot de passe, juste votre email."}
        </p>

        {emailSent ? (
          <div className="mt-5 rounded-2xl border border-[#D7E9E4] bg-[#F2FAF8] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#2B6D65] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E5A53]">Lien envoyé à {email}</p>
                <p className="text-xs text-[#4E736E] mt-1">
                  Cliquez sur le lien depuis cet appareil pour terminer la connexion.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="h-11 rounded-2xl border-[#E8DCC8] text-center"
          />

          <Button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#1B1A18] hover:bg-[#2A2621] text-[#FAF6EE] font-semibold"
            disabled={isButtonDisabled}
          >
            {getButtonContent()}
          </Button>
        </form>

        {emailSent ? (
          <div className="mt-4 rounded-2xl border border-[#F0DDC0] bg-[#FFF8EE] p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#9A6E2A] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[#7B5A25]">
                <strong>Problème ?</strong> Vérifiez vos spams ou essayez une autre adresse email.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MagicLinkForm;
