import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

interface DailyBubble {
  id: string;
  bubble_type: string;
  intensity: number;
  message: string;
  ritual_suggestion: string;
}

interface AIInsight {
  personalized_message: string;
  recommendations: string[];
  confidence: number;
}

const MoodBubbleModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todaysBubbles, setTodaysBubbles] = useState<DailyBubble[]>([]);
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
      question: 'Comment est votre niveau d\'énergie aujourd\'hui ?',
      emoji: '⚡',
      labels: ['Épuisé·e', 'Fatigué·e', 'Stable', 'Énergique', 'Débordant·e']
    },
    {
      key: 'stress_level', 
      question: 'Quel est votre niveau de stress ?',
      emoji: '😌',
      labels: ['Zen', 'Calme', 'Équilibré·e', 'Tendu·e', 'Stressé·e']
    },
    {
      key: 'motivation',
      question: 'Comment décririez-vous votre motivation ?',
      emoji: '🎯',
      labels: ['Démotivé·e', 'En baisse', 'Neutre', 'Motivé·e', 'Très motivé·e']
    },
    {
      key: 'social_connection',
      question: 'Comment vous sentez-vous socialement ?',
      emoji: '🤝',
      labels: ['Isolé·e', 'Distant·e', 'Connecté·e', 'Sociable', 'Épanoui·e']
    },
    {
      key: 'work_satisfaction',
      question: 'Êtes-vous satisfait·e de votre travail aujourd\'hui ?',
      emoji: '💼',
      labels: ['Insatisfait·e', 'Peu satisfait·e', 'Neutre', 'Satisfait·e', 'Très satisfait·e']
    }
  ];

  const bubbleTypeColors = {
    'soin': 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-200',
    'inspiration': 'bg-gradient-to-r from-purple-100 to-violet-100 border-purple-200', 
    'transformation': 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200',
    'connexion': 'bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200'
  };

  useEffect(() => {
    if (user) {
      checkTodaysEntry();
      fetchTodaysBubbles();
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
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking today\'s entry:', error);
      return;
    }

    setHasEntryToday(!!data);
  };

  const fetchTodaysBubbles = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_bubbles')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today);

    if (error) {
      console.error('Error fetching bubbles:', error);
      return;
    }

    setTodaysBubbles(data || []);
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

      // Générer immédiatement une réponse bienveillante et des recommandations
      await generateAIInsight();
      
      await fetchTodaysBubbles();
      setHasEntryToday(true);
      
    } catch (error) {
      console.error('Error submitting mood entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre humeur. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIInsight = async () => {
    if (!user) return;
    
    setIsGeneratingInsight(true);

    try {
      const { data, error } = await supabase.functions.invoke('mood-ai-analysis', {
        body: { userId: user.id }
      });

      if (error) throw error;

      if (data.success) {
        setAiInsight(data.analysis);
        toast({
          title: "✨ Votre réponse personnalisée est prête !",
          description: "Découvrez vos recommandations bienveillantes ci-dessous.",
        });
      } else {
        // Si pas assez de données, on affiche quand même un message bienveillant
        setAiInsight({
          personalized_message: "Merci d'avoir partagé vos ressentis aujourd'hui. 🌱 Chaque jour où vous prenez soin de votre bien-être est un pas vers une vie plus épanouie. Continuez à cultiver cette belle habitude !",
          recommendations: [
            "Prenez quelques minutes pour respirer profondément",
            "Accordez-vous un moment de bienveillance envers vous-même",
            "Continuez à partager vos humeurs quotidiennes pour des conseils plus personnalisés"
          ],
          confidence: 0.8
        });
        toast({
          title: "🫧 Merci pour ce partage !",
          description: "Votre réponse bienveillante vous attend.",
        });
      }
    } catch (error) {
      console.error('Error generating AI insight:', error);
      // Message de fallback bienveillant
      setAiInsight({
        personalized_message: "Merci d'avoir pris le temps de vous connecter à vos émotions aujourd'hui. 🌸 Cette attention que vous portez à votre bien-être est précieuse et courageuse.",
        recommendations: [
          "Félicitez-vous d'avoir pris ce moment pour vous",
          "Observez vos ressentis sans les juger",
          "Pensez à une chose positive de votre journée"
        ],
        confidence: 0.9
      });
      toast({
        title: "💝 Message de bien-être",
        description: "Nous vous accompagnons dans votre parcours.",
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  if (!user) {
    return (
      <Card className="glass-effect">
        <CardContent className="p-8 text-center">
          <p className="text-foreground/70">
            Connectez-vous pour accéder à votre bulle attentionnée
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="font-kalam text-2xl text-center">
            🫧 Ma Bulle Attentionnée
          </CardTitle>
          <p className="text-center text-foreground/70">
            Prenez un moment pour vous. Comment vous sentez-vous aujourd'hui ?
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {!hasEntryToday ? (
            <>
              {/* Mood Questions */}
              {moodQuestions.map((question) => (
                <div key={question.key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{question.emoji}</span>
                    <h4 className="font-medium text-foreground">
                      {question.question}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={moodEntry[question.key as keyof MoodEntry]}
                      onChange={(e) => handleSliderChange(
                        question.key as keyof MoodEntry, 
                        parseInt(e.target.value)
                      )}
                      className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-foreground/60">
                      {question.labels.map((label, index) => (
                        <span 
                          key={index}
                          className={`${moodEntry[question.key as keyof MoodEntry] === index + 1 
                            ? 'text-primary font-medium' 
                            : ''}`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Comment Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  💭 Un mot sur votre journée ? (optionnel)
                </h4>
                <Textarea
                  placeholder="Partagez ce qui vous inspire, vous préoccupe, ou simplement ce que vous ressentez..."
                  value={moodEntry.comment}
                  onChange={(e) => setMoodEntry(prev => ({ ...prev, comment: e.target.value }))}
                  className="glass-effect border-primary/20 focus:border-primary/40"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isGeneratingInsight}
                className="w-full btn-bubble"
              >
                {isSubmitting || isGeneratingInsight 
                  ? '✨ Préparation de votre réponse personnalisée...' 
                  : '🌟 Partager mes ressentis'}
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">🫧</div>
              <h3 className="font-kalam text-lg text-primary mb-2">
                Votre bulle du jour est créée !
              </h3>
              <p className="text-foreground/70 text-sm">
                Découvrez vos bulles personnalisées ci-dessous
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insight - Réponse bienveillante */}
      {aiInsight && (
        <Card className="glass-effect border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-kalam text-xl text-primary flex items-center gap-2">
              ✨ Votre réponse personnalisée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Message bienveillant */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6">
              <p className="text-foreground/90 leading-relaxed font-medium">
                {aiInsight.personalized_message}
              </p>
            </div>

            {/* Recommandations intelligentes */}
            {aiInsight.recommendations && aiInsight.recommendations.length > 0 && (
              <div>
                <h3 className="font-kalam text-lg text-secondary mb-4 flex items-center gap-2">
                  🌟 Nos recommandations bienveillantes pour vous
                </h3>
                <div className="space-y-3">
                  {aiInsight.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-foreground/80 flex-1 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-center pt-4">
              <Button 
                onClick={generateAIInsight}
                disabled={isGeneratingInsight}
                variant="outline"
                className="btn-soft"
              >
                {isGeneratingInsight ? '✨ Génération...' : '🔄 Actualiser mes conseils'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Bubbles */}
      {todaysBubbles.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {todaysBubbles.map((bubble) => (
            <Card 
              key={bubble.id} 
              className={`${bubbleTypeColors[bubble.bubble_type as keyof typeof bubbleTypeColors] || 'glass-effect'} border-2`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="font-kalam text-lg capitalize">
                  🫧 {bubble.bubble_type}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-foreground/80 leading-relaxed">
                  {bubble.message}
                </p>
                {bubble.ritual_suggestion && (
                  <div className="text-sm text-foreground/60 italic">
                    💡 {bubble.ritual_suggestion}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < bubble.intensity ? 'bg-primary' : 'bg-primary/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-foreground/50">
                    Intensité: {bubble.intensity}/5
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodBubbleModule;