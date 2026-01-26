import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function parseProfileId(url: string) {
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split("/").filter(Boolean);
  return pathParts[pathParts.length - 1] || parsed.searchParams.get("profile_id");
}

function severityScore(value: string | null) {
  if (!value) return 0;
  if (value === "eleve" || value === "critique") return 2;
  if (value === "modere") return 1;
  return 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const profileId = parseProfileId(req.url);
  if (!profileId) {
    return new Response(JSON.stringify({ error: "profile_id missing" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { data, error } = await supabase
      .from("emotional_states")
      .select("score_energie, score_stress, score_isolement, risque_burnout, risque_decrochage, commentaire_libre, date")
      .eq("profile_id", profileId)
      .order("date", { ascending: false })
      .limit(60);

    if (error) throw error;

    const count = data?.length || 0;
    const avg = (key: "score_energie" | "score_stress" | "score_isolement") =>
      count ? Math.round((data?.reduce((sum, row: any) => sum + (row[key] || 0), 0) || 0) / count) : null;

    const latest = data?.[0] || null;
    const alerts = (data || []).filter(
      (row: any) => severityScore(row.risque_burnout) > 1 || severityScore(row.risque_decrochage) > 1
    );

    return new Response(
      JSON.stringify({
        profile_id: profileId,
        samples: count,
        moyennes: {
          energie: avg("score_energie"),
          stress: avg("score_stress"),
          isolement: avg("score_isolement"),
        },
        tendances: {
          derniere_date: latest?.date || null,
          derniers_commentaires: (data || []).slice(0, 3).map((row: any) => row.commentaire_libre).filter(Boolean),
        },
        alertes: alerts.map((row: any) => ({
          date: row.date,
          burnout: row.risque_burnout,
          decrochage: row.risque_decrochage,
          note: row.commentaire_libre,
        })),
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
