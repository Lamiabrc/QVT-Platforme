import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  analyzeInput,
  generateEmpathicResponse,
  generateRecommendations,
  safetyMessage,
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { text = "", profile_id = null } = body || {};

    const { data: profile } = profile_id
      ? await supabase.from("profiles").select("*").eq("id", profile_id).maybeSingle()
      : { data: null };

    const analysis = analyzeInput(text || "", {});
    const message = generateEmpathicResponse(profile, analysis);
    const suggestions = generateRecommendations(profile, analysis);

    return new Response(
      JSON.stringify({
        emotion: analysis.dominantEmotion,
        risque: analysis.riskLevel,
        message_empathique: message,
        suggestions,
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
