import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { confirmAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        await confirmAuth();

        toast({
          title: "Connexion réussie !",
          description: "Bienvenue dans votre espace QVT Box",
        });
        onSuccess?.();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;

        if (!data.session) {
          setPendingEmail(email);
          toast({
            title: "Vérification email requise",
            description: "Votre compte est créé. Vérifiez votre email pour finaliser l'inscription.",
          });
        } else {
          await confirmAuth();
          onSuccess?.();
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
      });
      if (error) throw error;
      toast({
        title: "Email renvoyé",
        description: "Vérifiez votre boîte de réception (et vos spams).",
      });
    } catch (error: any) {
      toast({
        title: "Impossible de renvoyer",
        description: error?.message ?? "Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
        <h2 className="text-2xl font-kalam font-bold text-center mb-6 text-foreground">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName" className="text-foreground">
                Nom complet
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-foreground placeholder:text-foreground/60"
                placeholder="Votre nom complet"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-foreground placeholder:text-foreground/60"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-foreground">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/20 border-white/30 text-foreground placeholder:text-foreground/60"
              placeholder="••••••••"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium"
          >
            {loading ? "..." : (isLogin ? "Se connecter" : "S'inscrire")}
          </Button>
        </form>

        {pendingEmail ? (
          <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-xs text-foreground/80">
            <div className="font-semibold">Vérification email requise</div>
            <p className="mt-1">
              Votre compte est créé. Vérifiez votre email pour finaliser l'inscription.
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-white/40 px-3 py-1 text-[11px] font-semibold text-foreground/90 hover:border-white/70"
            >
              {resendLoading ? "Envoi..." : "Renvoyer l'email"}
            </button>
          </div>
        ) : null}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary/80 font-medium"
          >
            {isLogin ? "Créer un compte" : "Déjà inscrit ?"}
          </button>
        </div>
      </div>
    </div>
  );
}
