import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
        
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue dans votre espace QVT Box",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Inscription réussie !",
          description: "Vérifiez vos emails pour confirmer votre compte",
        });
      }
      
      onSuccess?.();
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