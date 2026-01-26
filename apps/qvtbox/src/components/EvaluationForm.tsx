import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface Question {
  id: string;
  axis: string;
  text: string;
  question_type: string;
  weight: number;
}

interface Answer {
  question_id: string;
  value?: number;
  text_value?: string;
}

const EvaluationForm = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const axisLabels: Record<string, string> = {
    'charge_rythme': 'Charge de travail & Rythme',
    'penibilite_ergonomie': 'Pénibilité & Ergonomie',
    'climat_reconnaissance': 'Climat & Reconnaissance',
    'deconnexion_tension': 'Déconnexion & Équilibre',
    'humeur_energie': 'Humeur & Énergie'
  };

  const likertLabels = ['Très mal', 'Mal', 'Moyen', 'Bien', 'Très bien'];
  const smileyEmojis = ['😞', '😕', '😐', '🙂', '😊'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('question_bank')
      .select('*')
      .eq('is_active', true)
      .order('axis, created_at');

    if (error) {
      console.error('Error fetching questions:', error);
      toast.error("Erreur lors du chargement des questions");
      return;
    }

    setQuestions(data || []);
    setLoading(false);
  };

  const handleAnswerChange = (questionId: string, value: any, textValue?: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        value: typeof value === 'number' ? value : undefined,
        text_value: textValue
      }
    }));
  };

  const submitEvaluation = async () => {
    if (!user) return;

    setSubmitting(true);

    try {
      const today = new Date();
      const periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 6); // Semaine

      // Créer l'entrée de check
      const { data: checkData, error: checkError } = await supabase
        .from('mood_checks')
        .insert({
          user_id: user.id,
          period_start: periodStart.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0]
        })
        .select()
        .single();

      if (checkError) throw checkError;

      // Insérer les réponses
      const answersToInsert = Object.values(answers).map(answer => ({
        check_id: checkData.id,
        question_id: answer.question_id,
        value: answer.value,
        text_value: answer.text_value
      }));

      const { error: answersError } = await supabase
        .from('mood_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      toast.success("Évaluation enregistrée avec succès!");
      setAnswers({});
      setCurrentPage(0);

    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];

    if (question.question_type === 'likert_5') {
      return (
        <RadioGroup
          value={answer?.value?.toString() || ''}
          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          className="likert-scale"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="likert-item">
              <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
              <Label 
                htmlFor={`${question.id}-${value}`} 
                className="text-xs text-center cursor-pointer"
              >
                {likertLabels[value - 1]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.question_type === 'smiley_5') {
      return (
        <RadioGroup
          value={answer?.value?.toString() || ''}
          onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
          className="likert-scale"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="likert-item">
              <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
              <Label 
                htmlFor={`${question.id}-${value}`} 
                className="text-2xl cursor-pointer"
              >
                {smileyEmojis[value - 1]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.question_type === 'open_text') {
      return (
        <Textarea
          value={answer?.text_value || ''}
          onChange={(e) => handleAnswerChange(question.id, null, e.target.value)}
          placeholder="Votre réponse..."
          className="mt-2"
        />
      );
    }

    return null;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des questions...</div>;
  }

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.axis]) {
      acc[question.axis] = [];
    }
    acc[question.axis].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const axes = Object.keys(groupedQuestions);
  const currentAxis = axes[currentPage];
  const currentQuestions = groupedQuestions[currentAxis] || [];

  const progress = ((currentPage + 1) / axes.length) * 100;
  const isLastPage = currentPage === axes.length - 1;
  const canProceed = currentQuestions.every(q => answers[q.id]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Évaluation bien-être
        </CardTitle>
        <CardDescription>
          {currentAxis ? axisLabels[currentAxis] : 'Chargement...'}
        </CardDescription>
        <div className="w-full bg-muted h-2 rounded-full">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Étape {currentPage + 1} sur {axes.length}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentQuestions.map((question) => (
          <div key={question.id} className="evaluation-form space-y-4">
            <h3 className="font-medium text-lg">{question.text}</h3>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Précédent
          </Button>

          {isLastPage ? (
            <Button
              onClick={submitEvaluation}
              disabled={!canProceed || submitting}
              className="btn-primary"
            >
              {submitting ? 'Enregistrement...' : 'Terminer'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!canProceed}
              className="btn-primary"
            >
              Suivant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationForm;