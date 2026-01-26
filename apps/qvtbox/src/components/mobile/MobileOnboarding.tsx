import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Heart,
  Users,
  Target,
  Briefcase,
  Coffee,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  personalInfo: {
    name: string;
    company: string;
    role: string;
    teamSize: string;
  };
  preferences: {
    interests: string[];
    workStyle: string;
    goals: string[];
  };
  currentState: {
    wellbeingLevel: number;
    stressLevel: number;
    challenges: string[];
  };
}

const MobileOnboarding = ({ onComplete }: { onComplete: (data: OnboardingData) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      name: '',
      company: '',
      role: '',
      teamSize: ''
    },
    preferences: {
      interests: [],
      workStyle: '',
      goals: []
    },
    currentState: {
      wellbeingLevel: 5,
      stressLevel: 5,
      challenges: []
    }
  });
  const { toast } = useToast();

  const steps = [
    {
      title: 'Bienvenue',
      icon: Sparkles,
      component: WelcomeStep
    },
    {
      title: 'Informations personnelles',
      icon: Users,
      component: PersonalInfoStep
    },
    {
      title: 'Vos préférences',
      icon: Heart,
      component: PreferencesStep
    },
    {
      title: 'État actuel',
      icon: Brain,
      component: CurrentStateStep
    },
    {
      title: 'Finalisation',
      icon: CheckCircle,
      component: FinalStep
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(data);
    toast({
      title: "Onboarding terminé !",
      description: "Bienvenue dans QVT Box ! Votre profil a été configuré.",
    });
  };

  const updateData = (section: keyof OnboardingData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="min-h-[600px]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              {React.createElement(steps[currentStep].icon, {
                className: "w-8 h-8 text-white"
              })}
            </div>
          </div>
          
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="w-32" />
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          <CurrentStepComponent 
            data={data} 
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            onComplete={handleComplete}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Composants des étapes
function WelcomeStep({ onNext }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Bienvenue dans QVT Box !</h3>
        <p className="text-muted-foreground">
          Nous allons personnaliser votre expérience en quelques étapes simples. 
          Cela ne prendra que 3 minutes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h4 className="font-medium">Bien-être</h4>
          <p className="text-sm text-muted-foreground">Améliorez votre qualité de vie</p>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h4 className="font-medium">Objectifs</h4>
          <p className="text-sm text-muted-foreground">Atteignez vos buts personnels</p>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-medium">Équipe</h4>
          <p className="text-sm text-muted-foreground">Renforcez la cohésion</p>
        </div>
      </div>

      <Button onClick={onNext} className="w-full">
        Commencer
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function PersonalInfoStep({ data, updateData, onNext, onPrev }: any) {
  const isValid = data.personalInfo.name && data.personalInfo.company;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Prénom et nom *</Label>
          <Input
            id="name"
            value={data.personalInfo.name}
            onChange={(e) => updateData('personalInfo', { name: e.target.value })}
            placeholder="Ex: Marie Dupont"
          />
        </div>

        <div>
          <Label htmlFor="company">Entreprise *</Label>
          <Input
            id="company"
            value={data.personalInfo.company}
            onChange={(e) => updateData('personalInfo', { company: e.target.value })}
            placeholder="Ex: Mon Entreprise"
          />
        </div>

        <div>
          <Label htmlFor="role">Poste</Label>
          <Input
            id="role"
            value={data.personalInfo.role}
            onChange={(e) => updateData('personalInfo', { role: e.target.value })}
            placeholder="Ex: Manager, Développeur..."
          />
        </div>

        <div>
          <Label htmlFor="teamSize">Taille de l'équipe</Label>
          <Input
            id="teamSize"
            value={data.personalInfo.teamSize}
            onChange={(e) => updateData('personalInfo', { teamSize: e.target.value })}
            placeholder="Ex: 5-10 personnes"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PreferencesStep({ data, updateData, onNext, onPrev }: any) {
  const interests = [
    'Méditation', 'Sport', 'Créativité', 'Formation', 'Nutrition', 
    'Relaxation', 'Teambuilding', 'Innovation'
  ];

  const toggleInterest = (interest: string) => {
    const current = data.preferences.interests;
    const updated = current.includes(interest) 
      ? current.filter((i: string) => i !== interest)
      : [...current, interest];
    updateData('preferences', { interests: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Vos centres d'intérêt</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Sélectionnez ce qui vous intéresse (plusieurs choix possibles)
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <div
              key={interest}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                data.preferences.interests.includes(interest)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleInterest(interest)}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={data.preferences.interests.includes(interest)}
                />
                <span className="text-sm">{interest}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        <Button onClick={onNext} className="flex-1">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function CurrentStateStep({ data, updateData, onNext, onPrev }: any) {
  const challenges = [
    'Stress élevé', 'Manque de motivation', 'Fatigue', 
    'Tensions dans l\'équipe', 'Surcharge de travail', 'Isolement'
  ];

  const toggleChallenge = (challenge: string) => {
    const current = data.currentState.challenges;
    const updated = current.includes(challenge) 
      ? current.filter((c: string) => c !== challenge)
      : [...current, challenge];
    updateData('currentState', { challenges: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Niveau de bien-être actuel</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Sur une échelle de 1 à 10
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span>Bien-être général</span>
              <Badge>{data.currentState.wellbeingLevel}/10</Badge>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={data.currentState.wellbeingLevel}
              onChange={(e) => updateData('currentState', { wellbeingLevel: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span>Niveau de stress</span>
              <Badge>{data.currentState.stressLevel}/10</Badge>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={data.currentState.stressLevel}
              onChange={(e) => updateData('currentState', { stressLevel: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Défis actuels</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Qu'est-ce qui vous pose problème actuellement ?
        </p>
        
        <div className="grid grid-cols-1 gap-2">
          {challenges.map((challenge) => (
            <div
              key={challenge}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                data.currentState.challenges.includes(challenge)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleChallenge(challenge)}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={data.currentState.challenges.includes(challenge)}
                />
                <span className="text-sm">{challenge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        <Button onClick={onNext} className="flex-1">
          Suivant
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function FinalStep({ data, onComplete, onPrev }: any) {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Profil configuré !</h3>
        <p className="text-muted-foreground">
          Parfait, {data.personalInfo.name} ! Votre profil QVT Box est maintenant prêt.
        </p>
      </div>

      <Card className="text-left">
        <CardContent className="p-4 space-y-3">
          <h4 className="font-medium">Récapitulatif :</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Entreprise :</span>
              <span>{data.personalInfo.company}</span>
            </div>
            <div className="flex justify-between">
              <span>Centres d'intérêt :</span>
              <span>{data.preferences.interests.length} sélectionnés</span>
            </div>
            <div className="flex justify-between">
              <span>Bien-être actuel :</span>
              <Badge>{data.currentState.wellbeingLevel}/10</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>
        <Button onClick={onComplete} className="flex-1">
          <Check className="w-4 h-4 mr-2" />
          Terminer
        </Button>
      </div>
    </div>
  );
}

export default MobileOnboarding;