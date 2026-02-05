import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useZenaFamily = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const getFamilyId = useCallback(async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("family_id")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return (data as any)?.family_id ?? null;
  }, [userId]);

  const analyzeCheckin = useCallback(
    async (payload: {
      family_id?: string | null;
      profile_id?: string | null;
      mood_score: number;
      stress_score: number;
      note?: string | null;
    }) => {
      if (!userId) throw new Error("Not authenticated");
      const family_id = payload.family_id ?? (await getFamilyId());
      if (!family_id) throw new Error("Missing family_id");

      return supabase.functions.invoke("zena_analyze_checkin", {
        body: {
          family_id,
          user_id: userId,
          profile_id: payload.profile_id ?? null,
          mood_score: payload.mood_score,
          stress_score: payload.stress_score,
          note: payload.note ?? null,
        },
      });
    },
    [getFamilyId, userId]
  );

  const requestSupport = useCallback(
    async (payload: { family_id?: string | null; note?: string | null }) => {
      if (!userId) throw new Error("Not authenticated");
      const family_id = payload.family_id ?? (await getFamilyId());
      if (!family_id) throw new Error("Missing family_id");

      return supabase.functions.invoke("zena_request_support", {
        body: {
          family_id,
          user_id: userId,
          note: payload.note ?? null,
        },
      });
    },
    [getFamilyId, userId]
  );

  const sendMessage = useCallback(
    async (payload: { session_id: string; content: string }) => {
      if (!userId) throw new Error("Not authenticated");
      return supabase.functions.invoke("zena_moderate_message", {
        body: {
          session_id: payload.session_id,
          sender_id: userId,
          content: payload.content,
        },
      });
    },
    [userId]
  );

  const fetchSessions = useCallback(async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("support_sessions")
      .select("*")
      .or(`requester_id.eq.${userId},mentor_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, [userId]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    const { data, error } = await supabase
      .from("session_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }, []);

  const fetchSupportRequests = useCallback(async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("requester_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, [userId]);

  const applyMentor = useCallback(
    async (payload: {
      full_name: string;
      age?: number | null;
      city?: string | null;
      motivation?: string | null;
      experience?: string | null;
      availability?: string | null;
    }) => {
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("mentor_applications").insert({
        user_id: userId,
        full_name: payload.full_name,
        age: payload.age ?? null,
        city: payload.city ?? null,
        motivation: payload.motivation ?? null,
        experience: payload.experience ?? null,
        availability: payload.availability ?? null,
      });

      if (error) throw error;
      return data;
    },
    [userId]
  );

  const fetchMentorProfile = useCallback(async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("mentor_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }, [userId]);

  const fetchMentorRequests = useCallback(async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("assigned_mentor_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, [userId]);

  const fetchAlerts = useCallback(async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  }, []);

  const fetchRiskFlags = useCallback(async () => {
    const { data, error } = await supabase
      .from("risk_flags")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  }, []);

  const isAppAdmin = useCallback(async () => {
    if (!userId) return false;
    const { data, error } = await supabase
      .from("app_admins")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return false;
    return Boolean(data);
  }, [userId]);

  return {
    userId,
    getFamilyId,
    analyzeCheckin,
    requestSupport,
    sendMessage,
    fetchSessions,
    fetchMessages,
    fetchSupportRequests,
    applyMentor,
    fetchMentorProfile,
    fetchMentorRequests,
    fetchAlerts,
    fetchRiskFlags,
    isAppAdmin,
  };
};
