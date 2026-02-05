import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useZenaFamily } from "@/hooks/useZenaFamily";
import FamillePage from "./FamillePage";

type TabKey = "bulle" | "agir" | "messages" | "calendrier" | "soutien";

const tabs: { key: TabKey; label: string }[] = [
  { key: "bulle", label: "Ma bulle" },
  { key: "agir", label: "Agir" },
  { key: "messages", label: "Messages" },
  { key: "calendrier", label: "Calendrier" },
  { key: "soutien", label: "Soutien (Lucioles)" },
];

export default function FamilySpacePage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const {
    getFamilyId,
    analyzeCheckin,
    requestSupport,
    sendMessage,
    fetchSessions,
    fetchMessages,
    fetchSupportRequests,
  } = useZenaFamily();

  const [activeTab, setActiveTab] = useState<TabKey>("bulle");
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState(6);
  const [stressScore, setStressScore] = useState(4);
  const [note, setNote] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [loadingCheckin, setLoadingCheckin] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageDraft, setMessageDraft] = useState("");

  const [supportRequests, setSupportRequests] = useState<any[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);

  const latestRequest = supportRequests[0];

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const famId = await getFamilyId();
        setFamilyId(famId);
        const [sessionsData, requestsData] = await Promise.all([
          fetchSessions(),
          fetchSupportRequests(),
        ]);
        setSessions(sessionsData);
        setSupportRequests(requestsData);
        if (sessionsData?.[0]?.id) {
          setActiveSessionId(sessionsData[0].id);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    load();
  }, [fetchSessions, fetchSupportRequests, getFamilyId, isAuthenticated]);

  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }
    const load = async () => {
      try {
        const data = await fetchMessages(activeSessionId);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [activeSessionId, fetchMessages]);

  const handleCheckin = async () => {
    if (!familyId) {
      toast({
        title: "Famille introuvable",
        description: "Merci de rejoindre une famille avant le check-in.",
        variant: "destructive",
      });
      return;
    }

    setLoadingCheckin(true);
    try {
      const { data, error } = await analyzeCheckin({
        family_id: familyId,
        mood_score: moodScore,
        stress_score: stressScore,
        note: note.trim() || null,
      });
      if (error) throw error;
      setAiResult((data as any)?.analysis ?? null);
      setActiveTab("agir");
      toast({
        title: "Zena a repondu",
        description: "Tes actions prioritaires sont pretes.",
      });
    } catch (error: any) {
      toast({
        title: "Check-in impossible",
        description: error?.message ?? "Reessaie dans un moment.",
        variant: "destructive",
      });
    } finally {
      setLoadingCheckin(false);
    }
  };

  const handleRequestSupport = async () => {
    if (!familyId) return;
    setSupportLoading(true);
    try {
      const { data, error } = await requestSupport({
        family_id: familyId,
        note: aiResult?.summary ?? note ?? null,
      });
      if (error) throw error;
      const result = data as any;
      toast({
        title: result?.session_id
          ? "Luciole trouvee"
          : "Demande enregistree",
        description: result?.session_id
          ? "Une Luciole va te rejoindre dans l'espace messages."
          : "Nous te mettons en relation des que possible.",
      });
      const requestsData = await fetchSupportRequests();
      setSupportRequests(requestsData);
      const sessionsData = await fetchSessions();
      setSessions(sessionsData);
      if (result?.session_id) {
        setActiveSessionId(result.session_id);
        setActiveTab("messages");
      }
    } catch (error: any) {
      toast({
        title: "Demande impossible",
        description: error?.message ?? "Reessaie dans un moment.",
        variant: "destructive",
      });
    } finally {
      setSupportLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeSessionId || !messageDraft.trim()) return;
    try {
      const { data, error } = await sendMessage({
        session_id: activeSessionId,
        content: messageDraft.trim(),
      });
      if (error) throw error;
      if ((data as any)?.blocked) {
        toast({
          title: "Message bloque",
          description: "Les coordonnees personnelles sont interdites.",
          variant: "destructive",
        });
        return;
      }
      setMessageDraft("");
      const refreshed = await fetchMessages(activeSessionId);
      setMessages(refreshed);
    } catch (error: any) {
      toast({
        title: "Message non envoye",
        description: error?.message ?? "Reessaie dans un moment.",
        variant: "destructive",
      });
    }
  };

  const actions = useMemo(() => aiResult?.recommended_actions ?? [], [aiResult]);

  if (!isAuthenticated) {
    return <FamillePage />;
  }

  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">
              Espace Famille
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2">
              FamilySpace
            </h1>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[#E8DCC8] bg-white px-4 py-2 text-sm">
            <div className="h-10 w-10 rounded-full bg-[#F3E0B9] flex items-center justify-center text-sm font-semibold">
              Z
            </div>
            <div>
              <div className="text-xs text-[#9C8D77]">Zena</div>
              <div className="font-semibold">Presence de soutien</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTab === tab.key
                  ? "bg-[#1B1A18] text-[#FAF6EE]"
                  : "border border-[#E8DCC8] bg-white text-[#1B1A18]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "bulle" && (
            <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Check-in emotionnel</h2>
                <p className="text-sm text-[#6F6454] mt-2">
                  Dis a Zena comment tu te sens. Elle repond avec 2-3 actions
                  concretes.
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Humeur</span>
                      <span className="font-semibold">{moodScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={moodScore}
                      onChange={(event) => setMoodScore(Number(event.target.value))}
                      className="mt-2 w-full accent-[#1B1A18]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Stress</span>
                      <span className="font-semibold">{stressScore}/10</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={stressScore}
                      onChange={(event) => setStressScore(Number(event.target.value))}
                      className="mt-2 w-full accent-[#1B1A18]"
                    />
                  </div>

                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="En quelques mots, qu'est-ce qui se passe ?"
                    className="min-h-[120px] w-full rounded-2xl border border-[#E8DCC8] bg-white px-4 py-3 text-sm"
                  />

                  <button
                    type="button"
                    onClick={handleCheckin}
                    disabled={loadingCheckin}
                    className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                  >
                    {loadingCheckin ? "Analyse en cours..." : "Recevoir Zena"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-[#FDF9F0] p-6">
                <h3 className="text-lg font-semibold">Reponse recente</h3>
                <p className="text-sm text-[#6F6454] mt-2">
                  {aiResult?.summary ??
                    "Fais un check-in pour recevoir une reponse personnelle."}
                </p>
                {aiResult?.keywords?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#6F6454]">
                    {aiResult.keywords.map((keyword: string) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-white border border-[#E8DCC8] px-3 py-1"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleRequestSupport}
                    disabled={supportLoading}
                    className="inline-flex items-center justify-center rounded-full border border-[#1B1A18]/20 bg-white px-4 py-2 text-xs font-semibold text-[#1B1A18] hover:border-[#1B1A18]/40 transition disabled:opacity-60"
                  >
                    {supportLoading
                      ? "Connexion..."
                      : "Parler a une Luciole"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agir" && (
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Actions prioritaires</h2>
              <p className="text-sm text-[#6F6454] mt-2">
                Zena propose des gestes simples et realistes.
              </p>
              <div className="mt-6 grid gap-3">
                {actions.length ? (
                  actions.map((action: string, index: number) => (
                    <div
                      key={`${action}-${index}`}
                      className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-3 text-sm"
                    >
                      {action}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                    Fais un check-in pour obtenir des actions personnalisees.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="grid gap-6 md:grid-cols-[0.9fr,1.1fr]">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Sessions Luciole</h2>
                <p className="text-sm text-[#6F6454] mt-2">
                  Les conversations sont 100% in-app et moderees.
                </p>
                <div className="mt-4 grid gap-3">
                  {sessions.length ? (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setActiveSessionId(session.id)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                          activeSessionId === session.id
                            ? "border-[#1B1A18] bg-[#FDF9F0]"
                            : "border-[#E8DCC8] bg-white"
                        }`}
                      >
                        <div className="font-semibold">
                          Session {session.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-[#6F6454]">
                          Statut: {session.status}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                      Aucune session active.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm flex flex-col">
                <h2 className="text-xl font-semibold">Chat securise</h2>
                <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[420px] pr-2">
                  {messages.length ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          message.sender_role === "mentor"
                            ? "bg-[#F3E0B9]"
                            : "bg-[#E8F2EE]"
                        }`}
                      >
                        <div className="text-xs text-[#6F6454]">
                          {message.sender_role} -{" "}
                          {new Date(message.created_at).toLocaleString("fr-FR")}
                        </div>
                        <div className="mt-1">{message.content}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#E8DCC8] px-4 py-6 text-sm text-[#6F6454]">
                      Aucun message pour le moment.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <input
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Ecrire un message..."
                    className="flex-1 rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!activeSessionId}
                    className="rounded-full bg-[#1B1A18] text-[#FAF6EE] px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "calendrier" && (
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Calendrier</h2>
              <p className="text-sm text-[#6F6454] mt-2">
                Bientot: routines, rendez-vous et moments famille.
              </p>
            </div>
          )}

          {activeTab === "soutien" && (
            <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Soutien Lucioles</h2>
              <p className="text-sm text-[#6F6454] mt-2">
                Une Luciole est un jeune adulte forme pour accompagner les ados
                avec bienveillance.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRequestSupport}
                  disabled={supportLoading}
                  className="inline-flex items-center justify-center rounded-full bg-[#1B1A18] text-[#FAF6EE] px-6 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {supportLoading
                    ? "Connexion..."
                    : "Parler a une Luciole"}
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] px-4 py-4 text-sm">
                <div className="font-semibold">Statut demande</div>
                <div className="text-[#6F6454] mt-1">
                  {latestRequest
                    ? `Statut: ${latestRequest.status}`
                    : "Aucune demande active."}
                </div>
              </div>

              <p className="mt-4 text-xs text-[#9C8D77]">
                Zena n'est pas une professionnelle de sante. En cas d'urgence:
                112, 15, 3114.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
