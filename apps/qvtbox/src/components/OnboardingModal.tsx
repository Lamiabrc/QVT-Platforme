import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "./AuthForm";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserRoleQVT = "salarié" | "responsable_qvt" | "rh" | "admin";
type UserJourneyQVT = "physique_only" | "saas_box";
type ToneClassKey = "primary" | "secondary" | "accent" | "muted";

const ROLES: Array<{
  id: UserRoleQVT;
  title: string;
  emoji: string;
  description: string;
  tone: ToneClassKey;
}> = [
  { id: "salarié", title: "Salarié", emoji: "👤", description: "Je souhaite prendre soin de mon bien-être au quotidien", tone: "primary" },
  { id: "responsable_qvt", title: "Manager", emoji: "👥", description: "Je veux accompagner le bien-être de mon équipe", tone: "secondary" },
  { id: "rh", title: "RH", emoji: "🤝", description: "Je pilote la stratégie QVT de l'entreprise", tone: "accent" },
  { id: "admin", title: "Admin", emoji: "⚙️", description: "Je gère la plateforme et les utilisateurs", tone: "muted" },
];

const JOURNEYS: Array<{
  id: UserJourneyQVT;
  title: string;
  emoji: string;
  description: string;
  benefits: string[];
}> = [
  {
    id: "physique_only",
    title: "Box Physique Only",
    emoji: "📦",
    description: "Je préfère recevoir uniquement des box physiques avec des produits sélectionnés",
    benefits: ["Box mensuelles personnalisées", "Produits artisanaux français", "Rituels bien-être"],
  },
  {
    id: "saas_box",
    title: "SaaS + Box",
    emoji: "💻📦",
    description: "Je veux l'expérience complète : suivi digital + box physiques",
    benefits: ["Dashboard personnel", "Analyse IA des humeurs", "Box adaptées aux tendances", "Insights équipe"],
  },
];

const toneClasses = {
  primary: { border: "border-primary", bg: "bg-primary/5" },
  secondary: { border: "border-secondary", bg: "bg-secondary/5" },
  accent: { border: "border-accent", bg: "bg-accent/5" },
  muted: { border: "border-border", bg: "bg-muted/20" },
};

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRoleQVT | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<UserJourneyQVT | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLogged(!!data.user));
  }, []);

  const selectedRoleObj = useMemo(() => ROLES.find(r => r.id === selectedRole), [selectedRole]);
  const selectedJourneyObj = useMemo(() => JOURNEYS.find(j => j.id === selectedJourney), [selectedJourney]);

  const handleRoleSelect = (role: UserRoleQVT) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleJourneySelect = (journey: UserJourneyQVT) => {
    setSelectedJourney(journey);
    setStep(3);
  };

  const handleFamilyProjectClick = () => {
    navigate("/famille");
  };

  const handleAuthSuccess = async () => {
    setAuthOpen(false);
    await handleCompleteOnboarding();
  };

  const handleCompleteOnboarding = async () => {
    if (!selectedRole || !selectedJourney) {
      toast({
        title: "Choix incomplet",
        description: "Merci de sélectionner votre rôle et votre parcours.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAuthOpen(true);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          user_role: selectedRole,
          user_journey: selectedJourney,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Bienvenue dans votre bulle ! 🫧",
        description: "Votre parcours personnalisé est maintenant configuré.",
      });

      onClose();
      navigate("/dashboard");
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de finaliser votre inscription.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-kalam text-3xl text-primary">
            ✨ Créons votre bulle personnalisée
          </DialogTitle>
        </DialogHeader>

        {authOpen ? (
          <div className="max-w-md mx-auto w-full">
            <h3 className="text-center font-kalam text-2xl mb-3">🫧 Créer votre bulle</h3>
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        ) : (
          <>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-center text-lg text-foreground/70">
                  Dites-nous qui vous êtes pour personnaliser votre expérience
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {ROLES.map((role) => {
                    const active = role.id === selectedRole;
                    const tone = toneClasses[role.tone];

                    return (
                      <Card
                        key={role.id}
                        className={cn(
                          "p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-floating",
                          active ? `${tone.border} ${tone.bg}` : "border-border hover:border-primary/30"
                        )}
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <div className="text-center space-y-3">
                          <div className="text-4xl">{role.emoji}</div>
                          <h3 className="font-kalam text-xl font-semibold">{role.title}</h3>
                          <p className="text-sm text-foreground/70">{role.description}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-lg text-foreground/70">
                    Maintenant, choisissez votre parcours bien-être
                  </p>
                  <p className="text-sm text-foreground/50">
                    Vous êtes : <span className="text-primary font-medium">{selectedRoleObj.title}</span>
                  </p>
                </div>

                <div className="grid gap-6">
                  {JOURNEYS.map((journey) => {
                    const active = selectedJourney === journey.id;
                    return (
                      <Card
                        key={journey.id}
                        className={cn(
                          "p-6 cursor-pointer transition-all duration-300 border-2 hover:shadow-floating",
                          active ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/30"
                        )}
                        onClick={() => handleJourneySelect(journey.id)}
                      >
                        <div className="flex gap-4">
                          <div className="text-3xl">{journey.emoji}</div>
                          <div>
                            <h3 className="font-kalam text-xl mb-2">{journey.title}</h3>
                            <p className="text-sm text-foreground/70 mb-2">{journey.description}</p>

                            {journey.benefits.map((b, i) => (
                              <div key={i} className="text-xs text-foreground/60 flex gap-2 items-center">
                                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                                {b}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* PROJET FAMILLE */}
                <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4 space-y-2">
                  <p className="text-sm text-foreground/80">
                    Vous souhaitez aussi prendre soin de votre foyer   
                    Découvrez le <span className="font-semibold">Projet Famille – Bulle</span>.
                  </p>

                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-bubble"
                    onClick={handleFamilyProjectClick}
                  >
                    🫧 Accéder au portail Famille
                  </Button>

                  <p className="text-xs text-foreground/50">
                    Vous serez redirigé vers : /famille
                  </p>
                </div>

                <Button onClick={() => setStep(1)} variant="outline" className="btn-soft mx-auto block">
                  ← Retour
                </Button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="font-kalam text-2xl font-semibold">Votre bulle est presque prête !</h3>
                </div>

                <div className="glass-effect rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Rôle : </span>
                    <span className="font-semibold text-primary">{selectedRoleObj.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Parcours : </span>
                    <span className="font-semibold text-secondary">{selectedJourneyObj.title}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setStep(2)} variant="outline" className="btn-soft">
                    ← Modifier
                  </Button>
                  <Button onClick={handleCompleteOnboarding} disabled={saving} className="btn-bubble">
                    {saving ? "Configuration..." : "Finaliser ma bulle"}
                  </Button>
                </div>

                {isLogged === false && (
                  <p className="text-center text-xs text-foreground/60">
                    Vous devrez créer un compte pour sauvegarder votre configuration.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;


