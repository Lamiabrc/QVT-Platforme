import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type CheckinPayload = {
  family_id: string;
  user_id: string;
  profile_id?: string | null;
  mood_score: number;
  stress_score: number;
  note?: string | null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as CheckinPayload;
    const { family_id, user_id, profile_id, mood_score, stress_score, note } =
      payload;

    if (!family_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "family_id and user_id are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(
      token
    );
    if (authError || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (authData.user.id !== user_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: membership } = await supabase
      .from("family_members")
      .select("family_id")
      .eq("family_id", family_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (!membership) {
      return new Response(JSON.stringify({ error: "Not in family" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `
Tu es Zena, une presence de soutien chaleureuse et protectrice pour des ados et leurs familles.
Tu n'es pas une psychologue ni une medecin. Tu ecoutes, tu soutiens, tu proposes 2-3 actions simples.

Contexte check-in:
- humeur: ${mood_score}/10
- stress: ${stress_score}/10
- note: ${note ?? ""}

Tache:
Retourne UNIQUEMENT un JSON valide avec les champs:
- emotion_labels: tableau de 3-6 emotions (strings)
- risk_score: nombre 0-100
- escalation_level: entier 0-3 (0 = ok, 1 = vigilance, 2 = important, 3 = urgent)
- recommended_actions: tableau de 2-3 actions claires et realistes
- summary: resume court (2-3 phrases max), rassurant, sans jargon
- keywords: tableau de mots-cles

Regles:
- Si signes de danger, maltraitance, auto-mutilation, idees suicidaires: escalation_level = 3.
- Si escalation_level >= 2, proposer aussi ressources d'urgence FR (112, 15, 3114).
- Ton: doux, clair, non jugeant, encourageant.
`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tu reponds uniquement en JSON valide, sans markdown ni texte additionnel.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenAI error:", errorText);
      throw new Error(`OpenAI API error: ${aiResponse.status}`);
    }

    const aiPayload = await aiResponse.json();
    const rawContent = aiPayload.choices?.[0]?.message?.content ?? "{}";
    const analysis = JSON.parse(rawContent);

    const riskScore = clamp(Number(analysis.risk_score ?? 0), 0, 100);
    const escalationLevel = clamp(
      Number(analysis.escalation_level ?? 0),
      0,
      3
    );

    const { data: inserted, error: insertError } = await supabase
      .from("checkins")
      .insert({
        family_id,
        user_id,
        profile_id: profile_id ?? null,
        mood_score,
        stress_score,
        note: note ?? null,
        ai_result: analysis,
        risk_score: riskScore,
        escalation_level: escalationLevel,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting checkin:", insertError);
      throw insertError;
    }

    if (escalationLevel >= 2) {
      const riskLevel = escalationLevel >= 3 ? "red" : "amber";
      const summary = String(analysis.summary ?? "").slice(0, 500);

      await supabase.from("alerts").insert({
        user_id,
        risk_level: riskLevel,
        primary_axis: "family",
        status: "pending",
        user_consent: false,
        anonymized_message: true,
        notes: summary || null,
        family_id,
        category: "checkin",
        severity: `level_${escalationLevel}`,
        created_by: user_id,
        message: summary || null,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkin_id: inserted?.id,
        analysis,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in zena_analyze_checkin:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message ?? "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
