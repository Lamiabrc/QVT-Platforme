import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  analyzeInput,
  generateEmpathicResponse,
  generateRecommendations,
  safetyMessage,
  type EmotionalAnalysis,
} from "../_shared/emotionalEngine.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function getProfile(profileId?: string | null) {
  if (!profileId) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();
  return data;
}

async function storeRecommendations(profileId: string | null, emotionalStateId: string | null, recs: any[]) {
  if (!profileId || recs.length === 0) return;
  await supabase.from("recommendations").insert(
    recs.map((rec) => ({
      profile_id: profileId,
      emotional_state_id: emotionalStateId,
      title: rec.title,
      description: rec.description,
      category: rec.category,
      priority: rec.priority,
      source: rec.source,
    }))
  );
}

function mapRisk(value: EmotionalAnalysis["burnoutRisk"]) {
  if (value === "eleve") return "eleve";
  if (value === "modere") return "modere";
  return "faible";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { profile_id = null, text = "", scores = {}, commentaire_libre = null, source = "emotional-checkin" } = body || {};

    const profile = await getProfile(profile_id);
    const analysis = analyzeInput(text || "", scores);

    const { data: state, error } = await supabase
      .from("emotional_states")
      .insert({
        profile_id,
        date: new Date().toISOString().slice(0, 10),
        score_energie: typeof scores.energie === "number" ? scores.energie : null,
        score_stress: typeof scores.stress === "number" ? scores.stress : analysis.scores.stress ?? null,
        score_isolement: typeof scores.isolement === "number" ? scores.isolement : analysis.scores.isolement ?? null,
        risque_burnout: mapRisk(analysis.burnoutRisk),
        risque_decrochage: mapRisk(analysis.dropoutRisk),
        commentaire_libre,
        source,
      })
      .select("*")
      .maybeSingle();

    if (error) throw error;

    const recommendations = generateRecommendations(profile, analysis);
    await storeRecommendations(profile_id, state?.id ?? null, recommendations);

    const response = generateEmpathicResponse(profile, analysis);

    return new Response(
      JSON.stringify({
        analysis,
        emotional_state: state,
        response,
        recommendations,
        safety: analysis.redFlags.length > 0 ? safetyMessage : null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    const message = err?.message || "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
