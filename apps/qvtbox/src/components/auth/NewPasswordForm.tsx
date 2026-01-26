import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewPasswordFormProps {
  onSuccess?: () => void;
}

const NewPasswordForm = ({ onSuccess }: NewPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Clean URL from sensitive params first
        const url = new URL(window.location.href);
        
        // Check if we have auth-related parameters
        if (!url.hash.includes('access_token') && 
            !(url.searchParams.get('code') && url.searchParams.get('type') === 'recovery')) {
          setSessionValid(false);
          return;
        }

        // Try to get current session after URL processing
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          setSessionValid(true);
          // Clean the URL immediately after successful auth
          const cleanUrl = `${url.protocol}//${url.host}${url.pathname}`;
          window.history.replaceState({}, document.title, cleanUrl);
        } else {
          setSessionValid(false);
        }

      } catch (error) {
        console.error('Session validation error:', error);
        setSessionValid(false);
        
        // Clean URL even on error
        const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    };

    validateSession();
  }, []);

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || sessionValid === false) return;

    if (!password || !confirmPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 8 caractères.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        toast({
          title: "Erreur",
          description: error.message || "Impossible de mettre à jour le mot de passe.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Mot de passe mis à jour !",
        description: "Votre nouveau mot de passe a été enregistré avec succès.",
      });

      onSuccess?.();

    } catch (error: any) {
      toast({
        title: "Erreur réseau",
        description: "Problème de connexion. Vérifiez votre internet.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionValid === null) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="card-professional">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
            <p className="text-foreground/70">Vérification du lien...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionValid === false) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="card-professional">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-kalam text-destructive">
              Lien invalide ou expiré
            </CardTitle>
            <CardDescription>
              Ce lien de réinitialisation n'est plus valide
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Lien invalide ou expiré
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">
                    Demandez un nouveau lien de réinitialisation pour continuer.
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => window.location.href = '/reset-password'}
              className="w-full"
              variant="outline"
            >
              Demander un nouveau lien
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passwordStrength = password.length >= 8 ? 'Fort' : password.length >= 6 ? 'Moyen' : 'Faible';
  const passwordColor = password.length >= 8 ? 'text-secondary' : password.length >= 6 ? 'text-accent-foreground' : 'text-destructive';

  return (
    <div className="max-w-md mx-auto">
      <Card className="card-professional">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-kalam">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription>
            Choisissez un mot de passe sécurisé pour votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {password && (
                <p className={`text-xs ${passwordColor}`}>
                  Force : {passwordStrength} {password.length >= 8 && <CheckCircle className="w-3 h-3 inline ml-1" />}
                </p>
              )}
            </div>
            
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">
                Les mots de passe ne correspondent pas
              </p>
            )}
            
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Mettre à jour le mot de passe
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-xs text-accent-foreground">
              <strong>Conseils :</strong> Utilisez au moins 8 caractères avec un mélange de lettres, chiffres et symboles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPasswordForm;