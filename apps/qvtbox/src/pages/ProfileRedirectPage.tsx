// src/pages/ProfileRedirectPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

export default function ProfileRedirectPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const resolveDestination = async () => {
      if (loading) return;
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: familyMembership } = await supabase
        .from("family_members")
        .select("family_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (familyMembership?.family_id) {
        navigate("/famille/dashboard");
        return;
      }

      const { data: enterpriseMembership } = await supabase
        .from("enterprise_members")
        .select("enterprise_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (enterpriseMembership?.enterprise_id) {
        navigate("/entreprise/dashboard");
        return;
      }

      navigate("/choisir-ma-sphere");
    };

    resolveDestination().finally(() => setChecking(false));
  }, [user, loading, navigate]);

  if (checking || loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EE]">
        <Navigation />
        <div className="container mx-auto px-6 py-20 text-sm text-[#6F6454]">
          Redirection en cours...
        </div>
      </div>
    );
  }

  return null;
}
