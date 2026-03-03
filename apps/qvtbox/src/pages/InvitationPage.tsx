import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { respondInvitation } from "@/lib/social";
import { supabase } from "@/integrations/supabase/client";

type InvitationPreview = {
  id: string;
  bubble_id: string;
  email: string | null;
  role: string;
  status: string;
  expires_at: string;
  bubbles?: { name: string } | null;
};

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!token || !isAuthenticated) {
        setLoading(false);
        return;
      }

      const { data } = await (supabase as any)
        .from("bubble_invitations")
        .select("id, bubble_id, email, role, status, expires_at, bubbles(name)")
        .eq("token", token)
        .maybeSingle();

      setPreview((data ?? null) as InvitationPreview | null);
      setLoading(false);
    };

    load();
  }, [token, isAuthenticated]);

  const handleDecision = async (decision: "accepted" | "rejected") => {
    if (!token) return;
    setWorking(true);
    try {
      const bubbleId = await respondInvitation(token, decision);
      toast({
        title: decision === "accepted" ? "Invitation acceptée" : "Invitation refusée",
        description: decision === "accepted" ? "Vous avez rejoint la bulle." : "Votre décision a été enregistrée.",
      });

      if (decision === "accepted") {
        navigate(`/bulle/${bubbleId}`);
      } else {
        navigate("/bulles");
      }
    } catch (error: any) {
      toast({
        title: "Action impossible",
        description: error?.message ?? "Ce lien est peut-être expiré.",
        variant: "destructive",
      });
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />
      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8DCC8] bg-white p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Invitation</p>
          <h1 className="mt-3 text-2xl font-semibold">Rejoindre une bulle</h1>

          {!isAuthenticated || !user ? (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-[#6F6454]">
                Connectez-vous pour accepter ou refuser cette invitation.
              </p>
              <Link
                to="/auth/login"
                className="inline-flex rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE]"
              >
                Se connecter
              </Link>
            </div>
          ) : loading ? (
            <p className="mt-5 text-sm text-[#6F6454]">Chargement de l'invitation...</p>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#FAF6EE] p-4 text-sm">
                <p>
                  <span className="font-semibold">Bulle:</span>{" "}
                  {preview?.bubbles?.name ?? "Invitation par code"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Rôle:</span> {preview?.role ?? "member"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Statut:</span> {preview?.status ?? "pending"}
                </p>
                {preview?.email ? (
                  <p className="mt-1">
                    <span className="font-semibold">Email ciblé:</span> {preview.email}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={working}
                  onClick={() => handleDecision("accepted")}
                  className="rounded-full bg-[#1B1A18] px-5 py-2 text-sm font-semibold text-[#FAF6EE] disabled:opacity-60"
                >
                  Accepter
                </button>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => handleDecision("rejected")}
                  className="rounded-full border border-[#E8DCC8] px-5 py-2 text-sm font-semibold text-[#1B1A18] disabled:opacity-60"
                >
                  Refuser
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
