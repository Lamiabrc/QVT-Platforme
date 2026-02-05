import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type SupportRequestPayload = {
  family_id: string;
  user_id: string;
  profile_id?: string | null;
  note?: string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as SupportRequestPayload;
    const { family_id, user_id, profile_id, note } = payload;

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

    const { data: request, error: insertError } = await supabase
      .from("support_requests")
      .insert({
        family_id,
        requester_id: user_id,
        profile_id: profile_id ?? null,
        note: note ?? null,
        status: "queued",
      })
      .select("id, status")
      .single();

    if (insertError) {
      console.error("Error creating support request:", insertError);
      throw insertError;
    }

    const { data: assignment, error: assignError } = await supabase.rpc(
      "assign_mentor_to_request",
      { request_id: request.id }
    );

    if (assignError) {
      console.error("Error assigning mentor:", assignError);
    }

    const assignmentRow = Array.isArray(assignment) ? assignment[0] : assignment;

    return new Response(
      JSON.stringify({
        success: true,
        request_id: request.id,
        status: assignmentRow?.session_id ? "assigned" : request.status,
        mentor_id: assignmentRow?.mentor_id ?? null,
        session_id: assignmentRow?.session_id ?? null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in zena_request_support:", error);
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
