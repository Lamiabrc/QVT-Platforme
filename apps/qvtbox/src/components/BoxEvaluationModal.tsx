import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, Settings, Users, Star, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface BoxEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BoxEvaluationModal = ({ isOpen, onClose }: BoxEvaluationModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const questions = [
    {
      id: "stress",
      title: "Gestion du stress",
      question: "Comment évaluez-vous votre niveau de stress au travail ?",
      icon: Heart,
      color: "text-green-500",
      pillar: "Santé & Équilibre",
      options: [
        { value: "low", label: "Faible - Je me sens serein(e) au quotidien" },
        { value: "medium", label: "Modéré - Quelques moments de tension" },
        { value: "high", label: "Élevé - Je ressens souvent du stress" },
        { value: "very-high", label: "Très élevé - Le stress m'impacte beaucoup" }
      ]
    },
    {
      id: "organization",
      title: "Organisation & Productivité",
      question: "Comment vous sentez-vous par rapport à votre organisation au travail ?",
      icon: Settings,
      color: "text-blue-500",
      pillar: "Organisation & Efficacité",
      options: [
        { value: "excellent", label: "Excellente - Je maîtrise parfaitement" },
        { value: "good", label: "Bonne - Quelques améliorations possibles" },
        { value: "average", label: "Moyenne - J'ai besoin d'aide" },
        { value: "poor", label: "Difficile - Je me sens débordé(e)" }
      ]
    },
    {
      id: "team",
      title: "Relations d'équipe",
      question: "Comment qualifiez-vous les relations avec vos collègues ?",
      icon: Users,
      color: "text-orange-500",
      pillar: "Cohésion & Relations",
      options: [
        { value: "excellent", label: "Excellentes - Ambiance très positive" },
        { value: "good", label: "Bonnes - Quelques tensions ponctuelles" },
        { value: "average", label: "Correctes - Relations professionnelles" },
        { value: "poor", label: "Difficiles - Conflits ou isolement" }
      ]
    },
    {
      id: "development",
      title: "Développement personnel",
      question: "Où en êtes-vous dans votre développement professionnel ?",
      icon: Star,
      color: "text-purple-500",
      pillar: "Développement & Inspiration",
      options: [
        { value: "motivated", label: "Très motivé(e) - Plein de projets" },
        { value: "interested", label: "Intéressé(e) - Ouvert(e) aux opportunités" },
        { value: "neutral", label: "Neutre - Pas de priorité particulière" },
        { value: "stuck", label: "Bloqué(e) - Manque d'inspiration" }
      ]
    }
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowResults(true);
  };

  const getRecommendedBox = () => {
    const scores = {
      stress: answers.stress === 'very-high' ? 4 : answers.stress === 'high' ? 3 : answers.stress === 'medium' ? 2 : 1,
      organization: answers.organization === 'poor' ? 4 : answers.organization === 'average' ? 3 : answers.organization === 'good' ? 2 : 1,
      team: answers.team === 'poor' ? 4 : answers.team === 'average' ? 3 : answers.team === 'good' ? 2 : 1,
      development: answers.development === 'stuck' ? 4 : answers.development === 'neutral' ? 3 : answers.development === 'interested' ? 2 : 1
    };

    const maxScore = Math.max(...Object.values(scores));
    const maxKeys = Object.keys(scores).filter(key => scores[key as keyof typeof scores] === maxScore);

    const recommendations = {
      stress: {
        name: "Box Focus & Reset",
        description: "Parfaite pour retrouver sérénité et équilibre au quotidien",
        color: "bg-green-500",
        products: ["Tisanes relaxantes", "Huiles essentielles", "Guide méditation", "Accessoires bien-être"]
      },
      organization: {
        name: "Box Efficacité Pro",
        description: "Les outils indispensables pour optimiser votre organisation",
        color: "bg-blue-500",
        products: ["Planner personnalisé", "Outils ergonomiques", "Guide productivité", "Apps recommandées"]
      },
      team: {
        name: "Box Cohésion",
        description: "Renforcez les liens et améliorez la communication d'équipe",
        color: "bg-orange-500",
        products: ["Jeux d'équipe", "Guide communication", "Activités collaboratives", "Goodies partagés"]
      },
      development: {
        name: "Box Inspiration",
        description: "Trouvez motivation et nouvelles perspectives pour évoluer",
        color: "bg-purple-500",
        products: ["Livre développement", "Carnet de réflexion", "Podcasts inspirants", "Coaching digital"]
      }
    };

    return recommendations[maxKeys[0] as keyof typeof recommendations];
  };

  const handleGoToDashboard = async () => {
    const recommendation = getRecommendedBox();
    
    // Calculate scores based on answers
    const scores = {
      stress: answers.stress === 'very-high' ? 4 : answers.stress === 'high' ? 3 : answers.stress === 'medium' ? 2 : 1,
      organization: answers.organization === 'poor' ? 4 : answers.organization === 'average' ? 3 : answers.organization === 'good' ? 2 : 1,
      team: answers.team === 'poor' ? 4 : answers.team === 'average' ? 3 : answers.team === 'good' ? 2 : 1,
      development: answers.development === 'stuck' ? 4 : answers.development === 'neutral' ? 3 : answers.development === 'interested' ? 2 : 1
    };

    const globalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) * 25 / 4);

    try {
      const { error } = await supabase
        .from('needs_assessments')
        .insert([{
          scores_sante: scores.stress * 25,
          scores_orga: scores.organization * 25,
          scores_cohesion: scores.team * 25,
          scores_devperso: scores.development * 25,
          box_recommandee: recommendation.name,
          note_globale: globalScore,
          source: 'simulateur_box'
        }]);

      if (error) throw error;

      toast({
        title: "Évaluation sauvegardée",
        description: "Vos résultats ont été ajoutés à votre profil.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder vos résultats. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }

    onClose();
    navigate("/dashboard");
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];
  const Icon = currentQuestion?.icon;

  if (showResults) {
    const recommendation = getRecommendedBox();
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-kalam text-center">
              🎉 Votre Box Recommandée
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-20 h-20 ${recommendation.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-kalam font-bold text-foreground mb-2">
                {recommendation.name}
              </h3>
              <p className="text-foreground/70 text-lg">
                {recommendation.description}
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-3">
                🎁 Contenu de votre box :
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {recommendation.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground/80">{product}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleGoToDashboard}
                className="flex-1"
              >
                Voir mon tableau de bord
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/box")}
                className="flex-1"
              >
                Explorer toutes les box
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-kalam text-center">
            Évaluez vos besoins QVT
          </DialogTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-center text-foreground/60">
              Question {currentStep + 1} sur {questions.length}
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-8 h-8 ${currentQuestion.color}`} />
            </div>
            <h3 className="text-xl font-kalam font-bold text-foreground mb-2">
              {currentQuestion.title}
            </h3>
            <p className="text-foreground/70">
              {currentQuestion.question}
            </p>
          </div>

          <RadioGroup
            value={answers[currentQuestion.id] || ""}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              {currentStep === questions.length - 1 ? "Voir ma recommandation" : "Suivant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoxEvaluationModal;