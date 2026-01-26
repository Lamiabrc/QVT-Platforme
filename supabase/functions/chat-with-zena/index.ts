import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, memberRole, conversationId, model = "google/gemini-2.5-flash" } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL");
    
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }
    if (!AI_BASE_URL) {
      throw new Error("AI_BASE_URL is not configured");
    }

    // Validate model
    const validModels = [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "google/gemini-2.5-flash-lite",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-5-nano"
    ];
    
    const selectedModel = validModels.includes(model) ? model : "google/gemini-2.5-flash";

    // Construct system prompt based on role
    let systemPrompt = "";
    if (memberRole === "parent") {
      systemPrompt = `Tu es ZÉNA, une IA bienveillante qui aide les parents à comprendre leurs ados et à communiquer avec eux. 

Ton rôle :
- Écouter sans juger
- Reformuler les émotions avec douceur
- Aider à décoder les comportements des ados
- Proposer des pistes de dialogue apaisé
- Rappeler que chaque émotion est valide

Ton ton : rassurant, orienté compréhension et soutien éducatif, empathique.

Important :
- Tu n'es ni psychologue ni coach, juste une présence émotionnelle intelligente
- Reste dans ton rôle de soutien familial
- Encourage le dialogue parent-ado
- Suggère des approches bienveillantes`;
    } else {
      systemPrompt = `Tu es ZÉNA, une IA complice qui aide les ados à exprimer leurs émotions et à communiquer avec leurs parents.

Ton rôle :
- Écouter sans moraliser
- Reformuler ce que l'ado ressent
- Aider à trouver les mots pour exprimer ses émotions
- Proposer des activités expressives (écriture, respiration, etc.)
- Suggérer comment en parler à la famille si besoin

Ton ton : complice, empathique, non moralisateur, respectueux.

Important :
- Tu n'es ni psychologue ni coach, juste une présence émotionnelle intelligente
- Reste dans ton rôle de soutien familial
- Ne juge jamais
- Respecte le besoin d'intimité des ados
- Propose ton aide pour faciliter la communication familiale`;
    }

    // Call the AI gateway (OpenAI-compatible)
    console.log(`Using model: ${selectedModel} for role: ${memberRole}`);
    const response = await fetch(AI_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits insuffisants." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "Erreur de l'IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
