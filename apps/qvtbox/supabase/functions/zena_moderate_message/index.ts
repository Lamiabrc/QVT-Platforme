import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ModeratePayload = {
  session_id: string;
  sender_id: string;
  content: string;
};

const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/;
const socialRegex =
  /(instagram|insta|snapchat|tiktok|discord|whatsapp|telegram|signal|facebook|fb\b|ig\b)/i;

const selfHarmRegex =
  /(suicide|me tuer|me faire du mal|automutil|auto[- ]?mutil|self[- ]?harm|je veux mourir|mutiler)/i;
const abuseRegex =
  /(abus|agression|viol\b|violence|inceste|harcel|harc[eè]lement|frapper|menace)/i;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as ModeratePayload;
    const { session_id, sender_id, content } = payload;

    if (!session_id || !sender_id || !content?.trim()) {
      return new Response(
        JSON.stringify({ error: "session_id, sender_id, content are required" }),
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

    if (authData.user.id !== sender_id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: session } = await supabase
      .from("support_sessions")
      .select("id, family_id, mentor_id, requester_id")
      .eq("id", session_id)
      .maybeSingle();

    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isMentor = session.mentor_id === sender_id;
    const isRequester = session.requester_id === sender_id;
    if (!isMentor && !isRequester) {
      return new Response(JSON.stringify({ error: "Not a participant" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hasPii =
      emailRegex.test(content) || phoneRegex.test(content) || socialRegex.test(content);
    const isSelfHarm = selfHarmRegex.test(content);
    const isAbuse = abuseRegex.test(content);

    if (hasPii) {
      await supabase.from("risk_flags").insert({
        family_id: session.family_id,
        session_id,
        reporter_id: sender_id,
        category: "pii",
        risk_level: "medium",
        status: "open",
        details: "PII detected in message (blocked)",
      });

      await supabase.from("alerts").insert({
        user_id: sender_id,
        risk_level: "amber",
        primary_axis: "family",
        status: "pending",
        user_consent: false,
        anonymized_message: true,
        family_id: session.family_id,
        category: "pii",
        severity: "moderate",
        created_by: sender_id,
        message: "Message bloque: tentative de partage de contact.",
      });

      return new Response(
        JSON.stringify({
          success: false,
          blocked: true,
          reason: "Contact info not allowed",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (isSelfHarm || isAbuse) {
      const category = isSelfHarm ? "self_harm" : "abuse_violence";

      const { data: inserted, error: insertError } = await supabase
        .from("session_messages")
        .insert({
          session_id,
          sender_id,
          sender_role: isMentor ? "mentor" : "teen",
          content: "[Message masque pour securite]",
          moderation_status: "flagged",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error inserting masked message:", insertError);
        throw insertError;
      }

      await supabase.from("risk_flags").insert({
        family_id: session.family_id,
        session_id,
        message_id: inserted.id,
        reporter_id: sender_id,
        category,
        risk_level: "high",
        status: "open",
        details: "Message auto-flagge pour risque eleve",
      });

      await supabase.from("alerts").insert({
        user_id: sender_id,
        risk_level: "red",
        primary_axis: "family",
        status: "pending",
        user_consent: false,
        anonymized_message: true,
        family_id: session.family_id,
        category,
        severity: "critical",
        created_by: sender_id,
        message: "Signal critique detecte dans une conversation.",
      });

      return new Response(
        JSON.stringify({
          success: true,
          flagged: true,
          message_id: inserted.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: message, error: messageError } = await supabase
      .from("session_messages")
      .insert({
        session_id,
        sender_id,
        sender_role: isMentor ? "mentor" : "teen",
        content: content.trim(),
        moderation_status: "allowed",
      })
      .select("id")
      .single();

    if (messageError) {
      console.error("Error inserting message:", messageError);
      throw messageError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message_id: message.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in zena_moderate_message:", error);
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
