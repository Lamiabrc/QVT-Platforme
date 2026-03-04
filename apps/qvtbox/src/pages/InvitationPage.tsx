import { useEffect, useMemo, useState } from "react";
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

const isExpired = (expiresAt?: string | null) => {
  if (!expiresAt) return false;
  const d = new Date(expiresAt);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
};

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth() as any;
  const { toast } = useToast();

  const invitationPath = useMemo(
    () => (token ? `/invitation/${token}` : "/invitation"),
    [token]
  );

  const [loadingPreview, setLoadingPreview] = useState(true);
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [working, setWorking] = useState(false);

  const userEmail = String(user?.email ?? "").trim().toLowerCase();
  const targetedEmail = String(preview?.email ?? "").trim().toLowerCase();
  const isTargetMismatch = Boolean(targetedEmail && userEmail && targetedEmail !== userEmail);

  // ✅ Auto-redirect to login if not authenticated (and auth loading finished)
  useEffect(() => {
    if (!token) return;
    if (loading) return;

    if (!isAuthenticated) {
      navigate(`/auth/login?returnUrl=${encodeURIComponent(invitationPath)}`, { replace: true });
    }
  }, [token, loading, isAuthenticated, invitationPath, navigate]);

  // Preview best-effort (RLS may block it). Accept/Reject should still work via RPC.
  useEffect(() => {
    const loadPreview = async () => {
      if (!token) {
        setLoadingPreview(false);
        return;
      }

      // If not authenticated, we’ll redirect anyway; but keep UI stable.
      if (!isAuthenticated) {
        setLoadingPreview(false);
        return;
      }

      setLoadingPreview(true);

      try {
        const { data, error } = await (supabase as any)
          .from("bubble_invitations")
          .select("id, bubble_id, email, role, status, expires_at, bubbles(name)")
          .eq("token", token)
          .maybeSingle();

        if (error) {
          // Preview blocked or unavailable -> still allow respondInvitation
          setPreview(null);
        } else {
          setPreview((data ?? null) as InvitationPreview | null);
        }
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPreview();
  }, [token, isAuthenticated]);

  const decisionDisabled =
    working ||
    !token ||
    (preview ? preview.status !== "pending" : false) ||
    (preview ? isExpired(preview.expires_at) : false) ||
    isTargetMismatch;

  const handleDecision = async (decision: "accepted" | "rejected") => {
    if (!token) return;

    // Guard UI
    if (preview?.status && preview.status !== "pending") {
      toast({
        title: "Invitation déjà traitée",
        description: "Ce lien a déjà été utilisé.",
        variant: "destructive",
      });
      return;
    }

    if (preview?.expires_at && isExpired(preview.expires_at)) {
      toast({
        title: "Invitation expirée",
        description: "Ce lien n’est plus valide.",
        variant: "destructive",
      });
      return;
    }

    if (isTargetMismatch) {
      toast({
        title: "Email non autorisé",
        description: "Cette invitation est liée à un autre email.",
        variant: "destructive",
      });
      return;
    }

    setWorking(true);
    try {
      const bubbleId = await respondInvitation(token, decision);

      toast({
        title: decision === "accepted" ? "Invitation acceptée" : "Invitation refusée",
        description:
          decision === "accepted"
            ? "Vous avez rejoint la bulle."
            : "Votre décision a été enregistrée.",
      });

      if (decision === "accepted") {
        navigate(`/bulle/${bubbleId}`, { replace: true });
      } else {
        navigate("/bulles", { replace: true });
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

          {/* While auth is loading */}
          {loading ? (
            <p className="mt-5 text-sm text-[#6F6454]">Vérification de votre session...</p>
          ) : !isAuthenticated || !user ? (
            // Normally auto-redirect happens, but keep a fallback UI
            <div className="mt-5 space-y-3">
              <p className="text-sm text-[#6F6454]">Redirection vers la connexion…</p>
              <Link
                to={`/auth/login?returnUrl=${encodeURIComponent(invitationPath)}`}
                className="inline-flex rounded-full bg-[#1B1A18] px-5 py-2.5 text-sm font-semibold text-[#FAF6EE]"
              >
                Se connecter
              </Link>
            </div>
          ) : loadingPreview ? (
            <p className="mt-5 text-sm text-[#6F6454]">Chargement de l’invitation...</p>
          ) : (
            <div className="mt-5 space-y-4">
              {/* Preview card (best-effort) */}
              <div className="rounded-2xl bg-[#FAF6EE] p-4 text-sm">
                <p>
                  <span className="font-semibold">Bulle :</span>{" "}
                  {preview?.bubbles?.name ?? "Invitation par code"}
                </p>

                <p className="mt-1">
                  <span className="font-semibold">Rôle :</span>{" "}
                  {preview?.role ?? "member"}
                </p>

                {preview?.status ? (
                  <p className="mt-1">
                    <span className="font-semibold">Statut :</span>{" "}
                    {preview.status}
                  </p>
                ) : null}

                {preview?.expires_at ? (
                  <p className="mt-1">
                    <span className="font-semibold">Expire le :</span>{" "}
                    {new Date(preview.expires_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                ) : null}

                {preview?.email ? (
                  <p className="mt-1">
                    <span className="font-semibold">Email ciblé :</span> {preview.email}
                  </p>
                ) : null}

                {isTargetMismatch ? (
                  <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                    Cette invitation est liée à un autre email. Connectez-vous avec le bon compte.
                  </p>
                ) : null}

                {preview?.expires_at && isExpired(preview.expires_at) ? (
                  <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                    Cette invitation est expirée.
                  </p>
                ) : null}

                {preview?.status && preview.status !== "pending" ? (
                  <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                    Cette invitation a déjà été traitée.
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={decisionDisabled}
                  onClick={() => handleDecision("accepted")}
                  className="rounded-full bg-[#1B1A18] px-5 py-2 text-sm font-semibold text-[#FAF6EE] disabled:opacity-60"
                >
                  Accepter
                </button>

                <button
                  type="button"
                  disabled={decisionDisabled}
                  onClick={() => handleDecision("rejected")}
                  className="rounded-full border border-[#E8DCC8] px-5 py-2 text-sm font-semibold text-[#1B1A18] disabled:opacity-60"
                >
                  Refuser
                </button>

                <Link
                  to="/bulles"
                  className="rounded-full border border-[#E8DCC8] px-5 py-2 text-sm font-semibold text-[#1B1A18]"
                >
                  Mes bulles
                </Link>
              </div>

              {/* Extra hint if preview is blocked */}
              {!preview ? (
                <p className="text-xs text-[#8B7D67]">
                  Note : certains détails de l’invitation peuvent être masqués pour des raisons de confidentialité. Vous pouvez quand même accepter/refuser.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
