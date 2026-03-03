import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PasswordSignUpFormProps {
  redirectTo?: string;
  onSuccess?: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Impossible de creer le compte pour le moment.";
};

const PasswordSignUpForm = ({ redirectTo, onSuccess }: PasswordSignUpFormProps) => {
  const { confirmAuth } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName.trim() || undefined,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        await confirmAuth();
        toast({
          title: "Compte cree",
          description: "Bienvenue dans votre espace QVT Box.",
        });
        onSuccess?.();
        return;
      }

      toast({
        title: "Verification email requise",
        description: "Votre compte est cree. Verifiez votre boite mail pour activer la connexion.",
      });
    } catch (error: unknown) {
      toast({
        title: "Inscription impossible",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="signup-fullname" className="text-[#5E5447]">
          Nom complet
        </Label>
        <Input
          id="signup-fullname"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          disabled={loading}
          placeholder="Votre nom"
          className="h-11 rounded-2xl border-[#E8DCC8] bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-email" className="text-[#5E5447]">
          Adresse email
        </Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
          placeholder="vous@exemple.com"
          className="h-11 rounded-2xl border-[#E8DCC8] bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="signup-password" className="text-[#5E5447]">
          Mot de passe
        </Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          placeholder="Minimum 8 caracteres"
          className="h-11 rounded-2xl border-[#E8DCC8] bg-white"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-2xl bg-[#1B1A18] text-[#FAF6EE] hover:bg-[#2A2621]"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creation...
          </>
        ) : (
          "Creer mon compte"
        )}
      </Button>

      <div className="flex justify-end text-xs text-[#6F6454]">
        <Link to="/auth/login" className="hover:text-[#1B1A18] underline-offset-2 hover:underline">
          Deja un compte ?
        </Link>
      </div>
    </form>
  );
};

export default PasswordSignUpForm;
