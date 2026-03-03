import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PasswordLoginFormProps {
  onSuccess?: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Impossible de se connecter pour le moment.";
};

const PasswordLoginForm = ({ onSuccess }: PasswordLoginFormProps) => {
  const { confirmAuth } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      await confirmAuth();
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace QVT Box.",
      });
      onSuccess?.();
    } catch (error: unknown) {
      toast({
        title: "Connexion impossible",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-[#5E5447]">
          Adresse email
        </Label>
        <Input
          id="login-email"
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
        <Label htmlFor="login-password" className="text-[#5E5447]">
          Mot de passe
        </Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          placeholder="••••••••"
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
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>

      <div className="flex items-center justify-between text-xs text-[#6F6454]">
        <Link to="/reset-password" className="hover:text-[#1B1A18] underline-offset-2 hover:underline">
          Mot de passe oublié ?
        </Link>
        <Link to="/auth" className="hover:text-[#1B1A18] underline-offset-2 hover:underline">
          Créer un compte
        </Link>
      </div>
    </form>
  );
};

export default PasswordLoginForm;
