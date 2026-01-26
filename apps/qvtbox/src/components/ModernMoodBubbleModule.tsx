import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart, 
  Zap, 
  Users, 
  Briefcase,
  MessageCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  energy_level: number;
  stress_level: number;
  motivation: number;
  social_connection: number;
  work_satisfaction: number;
  comment: string;
}

interface AIInsight {
  personalized_message: string;
  recommendations: string[];
  confidence: number;
}

const ModernMoodBubbleModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    energy_level: 3,
    stress_level: 3,
    motivation: 3,
    social_connection: 3,
    work_satisfaction: 3,
    comment: ''
  });

  const moodQuestions = [
    {
      key: 'energy_level',
      question: 'Niveau d\'énergie aujourd\'hui',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      labels: ['Épuisé', 'Fatigué', 'Stable', 'Énergique', 'Débordant']
    },
    {
      key: 'stress_level', 
      question: 'Niveau de stress ressenti',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      labels: ['Zen', 'Calme', 'Équilibré', 'Tendu', 'Stressé']
    },
    {
      key: 'motivation',
      question: 'Motivation professionnelle',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      labels: ['Démotivé', 'En baisse', 'Neutre', 'Motivé', 'Très motivé']
    },
    {
      key: 'social_connection',
      question: 'Connexion sociale',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      labels: ['Isolé', 'Distant', 'Connecté', 'Sociable', 'Épanoui']
    },
    {
      key: 'work_satisfaction',
      question: 'Satisfaction du travail',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      labels: ['Insatisfait', 'Peu satisfait', 'Neutre', 'Satisfait', 'Très satisfait']
    }
  ];

  useEffect(() => {
    if (user) {
      checkTodaysEntry();
    }
  }, [user]);

  const checkTodaysEntry = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking today\'s entry:', error);
      return;
    }

    setHasEntryToday(!!data);
  };

  const handleSliderChange = (key: keyof MoodEntry, value: number) => {
    setMoodEntry(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          date: today,
          ...moodEntry
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;

      await generateAIInsight();
      setHasEntryToday(true);
      
      toast({
        title: "Suivi enregistré",
        description: "Vos données de bien-être ont été sauvegardées avec succès.",
      });
      
    } catch (error) {
      console.error('Error submitting mood entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer vos données. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIInsight = async () => {
    setIsGeneratingInsight(true);

    try {
      // Simulation d'une analyse IA intelligente
      const avgScore = (moodEntry.energy_level + (6 - moodEntry.stress_level) + 
                       moodEntry.motivation + moodEntry.social_connection + 
                       moodEntry.work_satisfaction) / 5;

      let message = "";
      let recommendations: string[] = [];

      if (avgScore >= 4) {
        message = "Excellente dynamique aujourd'hui ! Votre équilibre professionnel semble optimal. Cette énergie positive est un atout précieux pour vous et votre équipe.";
        recommendations = [
          "Partagez votre énergie positive avec vos collègues",
          "Profitez de ce momentum pour aborder des projets ambitieux",
          "Prenez note de ce qui fonctionne bien pour reproduire ces conditions"
        ];
      } else if (avgScore >= 3) {
        message = "Votre état de bien-être est dans la moyenne, avec des aspects à valoriser. Il y a des opportunités d'amélioration pour optimiser votre épanouissement professionnel.";
        recommendations = [
          "Identifiez les moments de la journée où vous vous sentez le mieux",
          "Planifiez des pauses régulières pour maintenir votre énergie",
          "Considérez des activités qui renforcent votre motivation"
        ];
      } else {
        message = "Nous percevons quelques défis dans votre bien-être aujourd'hui. C'est normal et temporaire. Votre attention à ces signaux montre votre engagement envers votre mieux-être.";
        recommendations = [
          "Accordez-vous des moments de respiration dans la journée",
          "N'hésitez pas à solliciter le soutien de vos collègues ou manager",
          "Explorez les ressources QVT disponibles dans votre entreprise"
        ];
      }

      setAiInsight({
        personalized_message: message,
        recommendations,
        confidence: 0.85
      });

    } catch (error) {
      console.error('Error generating AI insight:', error);
      setAiInsight({
        personalized_message: "Merci d'avoir partagé vos ressentis. Chaque jour de suivi contribue à mieux comprendre votre bien-être professionnel.",
        recommendations: [
          "Continuez ce suivi quotidien pour des analyses plus précises",
          "Explorez les ressources disponibles sur votre plateforme QVT",
          "Partagez vos besoins avec votre référent bien-être"
        ],
        confidence: 0.7
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreProgress = (score: number) => {
    return (score / 5) * 100;
  };

  if (!user) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à votre suivi de bien-être professionnel
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Suivi quotidien du bien-être</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Évaluez votre état professionnel aujourd'hui
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!hasEntryToday ? (
            <>
              {/* Mood Questions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {moodQuestions.map((question) => (
                  <Card key={question.key} className={`${question.bgColor} border`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={question.color}>
                          {question.icon}
                        </div>
                        <h4 className="font-medium text-foreground">
                          {question.question}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={moodEntry[question.key as keyof MoodEntry] as number}
                          onChange={(e) => handleSliderChange(
                            question.key as keyof MoodEntry, 
                            parseInt(e.target.value)
                          )}
                          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer"
                        />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {question.labels[0]}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {question.labels[(moodEntry[question.key as keyof MoodEntry] as number) - 1]}
                            </Badge>
                            <Progress 
                              value={getScoreProgress(moodEntry[question.key as keyof MoodEntry] as number)} 
                              className="w-16 h-2"
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {question.labels[4]}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comment Section */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <h4 className="font-medium text-foreground">
                      Commentaire libre (optionnel)
                    </h4>
                  </div>
                  <Textarea
                    placeholder="Partagez vos réflexions sur votre journée, vos défis ou vos réussites..."
                    value={moodEntry.comment}
                    onChange={(e) => setMoodEntry(prev => ({ ...prev, comment: e.target.value }))}
                    className="border-muted-foreground/20"
                    rows={3}
                  />
                </CardContent>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isGeneratingInsight}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isSubmitting || isGeneratingInsight ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enregistrer et obtenir mes recommandations
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Suivi du jour terminé
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Merci d'avoir pris le temps d'évaluer votre bien-être aujourd'hui
              </p>
              <Button 
                variant="outline" 
                onClick={() => setHasEntryToday(false)}
                className="text-sm"
              >
                Modifier mon évaluation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insight */}
      {aiInsight && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-5 h-5" />
              Analyse personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white/80 rounded-lg border border-blue-200">
              <p className="text-gray-800 leading-relaxed">
                {aiInsight.personalized_message}
              </p>
            </div>

            {aiInsight.recommendations && aiInsight.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Recommandations personnalisées
                </h3>
                <div className="space-y-2">
                  {aiInsight.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <Badge variant="outline" className="text-xs">
                Confiance: {Math.round(aiInsight.confidence * 100)}%
              </Badge>
              <Button 
                onClick={generateAIInsight}
                disabled={isGeneratingInsight}
                variant="ghost"
                size="sm"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModernMoodBubbleModule;