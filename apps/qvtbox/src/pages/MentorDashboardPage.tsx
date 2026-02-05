import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useZenaFamily } from "@/hooks/useZenaFamily";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ROUTES = {
  familySpace: "/famille",
  mentorApply: "/famille/mentor/apply",
};

export default function MentorDashboardPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { fetchMentorProfile, fetchMentorRequests, fetchSessions } =
    useZenaFamily();

  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const [profileData, requestsData, sessionsData] = await Promise.all([
          fetchMentorProfile(),
          fetchMentorRequests(),
          fetchSessions(),
        ]);
        setProfile(profileData);
        setRequests(requestsData);
        setSessions(sessionsData);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [fetchMentorProfile, fetchMentorRequests, fetchSessions, isAuthenticated]);

  const handleCloseSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("support_sessions")
        .update({ status: "closed", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
      if (error) throw error;
      const sessionsData = await fetchSessions();
      setSessions(sessionsData);
      toast({ title: "Session cloturee" });
    } catch (error: any) {
      toast({
        title: "Impossible de cloturer",
        description: error?.message ?? "Reessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
          Espace Luciole
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold mt-2">
          Dashboard mentor
        </h1>
        <p className="text-sm text-[#6F6454] mt-3">
          Suis les demandes et accompagne tes sessions actives.
        </p>

        {!isAuthenticated ? (
          <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6">
            <p className="text-sm text-[#6F6454]">
              Connecte-toi pour acceder au dashboard mentor.
            </p>
            <div className="mt-4">
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,1fr]">
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Profil mentor</h2>
              {profile ? (
                <div className="mt-4 text-sm text-[#6F6454] space-y-2">
                  <div>
                    <span className="font-semibold">Nom:</span>{" "}
                    {profile.display_name}
                  </div>
                  <div>
                    <span className="font-semibold">Statut:</span>{" "}
                    {profile.status}
                  </div>
                  <div>
                    <span className="font-semibold">Sessions actives:</span>{" "}
                    {profile.active_sessions}/{profile.max_active_sessions}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-[#6F6454]">
                  Aucun profil mentor trouve. Soumettez une candidature.
                  <div className="mt-3">
                    <Link to={ROUTES.mentorApply} className="underline">
                      Deposer une candidature
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Demandes assignees</h2>
              <div className="mt-4 space-y-3">
                {requests.length ? (
                  requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-3 text-sm"
                    >
                      <div className="font-semibold">
                        Demande {request.id.slice(0, 8)}
                      </div>
                      <div className="text-[#6F6454]">
                        Statut: {request.status}
                      </div>
                      {request.note ? (
                        <div className="text-[#6F6454] mt-2">
                          "{request.note}"
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                    Aucune demande pour le moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-8 rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Sessions actives</h2>
            <div className="mt-4 space-y-3">
              {sessions.length ? (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold">
                        Session {session.id.slice(0, 8)}
                      </div>
                      <div className="text-[#6F6454]">
                        Statut: {session.status}
                      </div>
                    </div>
                    {session.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => handleCloseSession(session.id)}
                        className="rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18]"
                      >
                        Cloturer
                      </button>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                  Aucune session active.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
