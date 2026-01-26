import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';
import { calculateDimensionScore, calculateBurnoutScore, calculateMotivationIndex } from './calculators.ts';
import { detectPatterns, generateRecommendations } from './patterns.ts';
import { RPSAnalysis } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, userId, sessionId } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculer les 6 dimensions RPS
    const intensityWork = calculateDimensionScore(text, 'intensityWork');
    const emotionalDemands = calculateDimensionScore(text, 'emotionalDemands');
    const autonomy = calculateDimensionScore(text, 'autonomy');
    const socialRelations = calculateDimensionScore(text, 'socialRelations');
    const valueConflicts = calculateDimensionScore(text, 'valueConflicts');
    const jobInsecurity = calculateDimensionScore(text, 'jobInsecurity');

    // Calculer score burnout et motivation
    const burnoutRiskScore = calculateBurnoutScore(text);
    const motivationIndex = calculateMotivationIndex(text);

    // Calculer le niveau de risque global
    const avgScore = (
      intensityWork.score +
      emotionalDemands.score +
      autonomy.score +
      socialRelations.score +
      valueConflicts.score +
      jobInsecurity.score
    ) / 6;

    let globalRiskLevel: "faible" | "modéré" | "élevé" | "critique";
    if (burnoutRiskScore >= 71 || avgScore >= 75) {
      globalRiskLevel = "critique";
    } else if (burnoutRiskScore >= 51 || avgScore >= 60) {
      globalRiskLevel = "élevé";
    } else if (burnoutRiskScore >= 26 || avgScore >= 45) {
      globalRiskLevel = "modéré";
    } else {
      globalRiskLevel = "faible";
    }

    const analysis: RPSAnalysis = {
      globalRiskLevel,
      dimensions: {
        intensityWork,
        emotionalDemands,
        autonomy,
        socialRelations,
        valueConflicts,
        jobInsecurity,
      },
      burnoutRiskScore,
      motivationIndex,
      detectedPatterns: [],
      recommendedActions: []
    };

    // Détecter les patterns
    analysis.detectedPatterns = detectPatterns(analysis);
    analysis.recommendedActions = generateRecommendations(analysis);

    // Sauvegarder dans rps_tracking si on a un userId
    if (userId && sessionId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('rps_tracking').insert({
        user_id: userId,
        session_id: sessionId,
        intensity_work_score: intensityWork.score,
        emotional_demands_score: emotionalDemands.score,
        autonomy_score: autonomy.score,
        social_relations_score: socialRelations.score,
        value_conflicts_score: valueConflicts.score,
        job_insecurity_score: jobInsecurity.score,
        burnout_risk_score: burnoutRiskScore,
        motivation_index: motivationIndex,
        global_risk_level: globalRiskLevel,
        detected_patterns: analysis.detectedPatterns,
        keywords_detected: [
          ...intensityWork.keywords,
          ...emotionalDemands.keywords,
          ...autonomy.keywords,
          ...socialRelations.keywords,
          ...valueConflicts.keywords,
          ...jobInsecurity.keywords
        ],
        recommended_actions: analysis.recommendedActions
      });
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[analyze-rps-factors] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
