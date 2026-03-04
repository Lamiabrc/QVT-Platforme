import { useEffect, useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, XCircle, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createCalendarEvent,
  fetchCalendarEvents,
  fetchEventParticipants,
  upsertEventParticipant,
} from "@/lib/social";
import type { CalendarEvent, EventParticipant, EventParticipationStatus, ShareLevel } from "@/lib/social";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  bubbleId: string;
  userId: string;
  isAdmin?: boolean;
  members?: { user_id: string; label: string }[];
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
};

const toLocalInputValue = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};

export default function BubbleCalendar({ bubbleId, userId, isAdmin = false, members = [] }: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [participantsByEvent, setParticipantsByEvent] = useState<Record<string, EventParticipant[]>>({});

  // create form
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState(() => toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000)));
  const [endsAt, setEndsAt] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [visibility, setVisibility] = useState<ShareLevel>("bubble");
  const [isQuick, setIsQuick] = useState(false);

  // admin invite
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteEventId, setInviteEventId] = useState("");

  const memberOptions = useMemo(() => members.filter((m) => m.user_id !== userId), [members, userId]);

  const load = async () => {
    setLoading(true);
    try {
      const evts = await fetchCalendarEvents(bubbleId);
      setEvents(evts);

      // participants (small MVP: per event)
      const entries = await Promise.all(
        evts.map(async (e) => {
          const parts = await fetchEventParticipants(e.id).catch(() => []);
          return [e.id, parts] as const;
        })
      );

      const map: Record<string, EventParticipant[]> = {};
      for (const [id, parts] of entries) map[id] = parts;
      setParticipantsByEvent(map);
    } catch (error: any) {
      toast({
        title: "Calendrier indisponible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleId]);

  // Realtime: new/updated events in bubble
  useEffect(() => {
    const channel = supabase
      .channel(`calendar-events-${bubbleId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendar_events", filter: `bubble_id=eq.${bubbleId}` },
        () => load()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleId]);

  const applyQuick = (presetTitle: string, presetTags: string[] = []) => {
    setTitle(presetTitle);
    setIsQuick(true);
    setTags(presetTags.join(", "));
    const start = new Date(Date.now() + 30 * 60 * 1000);
    setStartsAt(toLocalInputValue(start));
    setEndsAt(toLocalInputValue(new Date(start.getTime() + 30 * 60 * 1000)));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Titre requis", description: "Donne un nom à l’activité.", variant: "destructive" });
      return;
    }
    if (!startsAt) {
      toast({ title: "Date requise", description: "Choisis une date de début.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const startsISO = new Date(startsAt).toISOString();
      const endsISO = endsAt ? new Date(endsAt).toISOString() : undefined;

      await createCalendarEvent({
        bubbleId,
        userId,
        title: title.trim(),
        startsAt: startsISO,
        endsAt: endsISO,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: notes.trim() || undefined,
        visibility,
        isQuickActivity: isQuick,
        description: null,
      });

      toast({ title: "Activité ajoutée", description: "Elle apparaît dans le calendrier de la bulle." });

      setTitle("");
      setTags("");
      setNotes("");
      setVisibility("bubble");
      setIsQuick(false);
      setEndsAt("");

      await load();
    } catch (error: any) {
      toast({
        title: "Création impossible",
        description: error?.message ?? "Vérifiez vos accès.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const myStatusFor = (eventId: string) => {
    const parts = participantsByEvent[eventId] ?? [];
    return parts.find((p) => p.user_id === userId)?.status ?? null;
  };

  const rsvp = async (eventId: string, status: EventParticipationStatus) => {
    try {
      await upsertEventParticipant({ eventId, userId, status });
      toast({ title: "Réponse enregistrée", description: "Merci !", });
      await load();
    } catch (error: any) {
      toast({
        title: "Impossible d’enregistrer",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const adminInvite = async () => {
    if (!isAdmin) return;
    if (!inviteEventId || !inviteUserId) return;

    try {
      await upsertEventParticipant({
        eventId: inviteEventId,
        userId: inviteUserId,
        status: "invited",
        invitedBy: userId,
      });
      toast({ title: "Invitation envoyée", description: "Le membre est ajouté en “invité”." });
      setInviteUserId("");
      setInviteEventId("");
      await load();
    } catch (error: any) {
      toast({
        title: "Invitation impossible",
        description: error?.message ?? "Vérifiez vos droits admin.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454]">
        Chargement du calendrier...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create */}
      <div className="rounded-3xl border border-[#E8DCC8] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8B7D67]">Calendrier de bulle</p>
            <h3 className="mt-2 text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Ajouter une activité
            </h3>
            <p className="mt-1 text-sm text-[#6F6454]">
              Planifiez un moment commun. ZÉNA pourra ensuite suggérer des idées à ajouter ici.
            </p>
          </div>

          <div className="rounded-2xl bg-[#CFECE8]/45 p-3">
            <Sparkles className="h-5 w-5 text-[#1B1A18]" />
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => applyQuick("Balade 30 min", ["activité", "plein air"])}
            className="rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] px-4 py-3 text-left hover:border-[#CFECE8]"
          >
            <div className="text-sm font-semibold">Balade</div>
            <div className="text-xs text-[#6F6454]">Activité rapide</div>
          </button>
          <button
            type="button"
            onClick={() => applyQuick("Jeu ensemble", ["famille", "jeu"])}
            className="rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] px-4 py-3 text-left hover:border-[#CFECE8]"
          >
            <div className="text-sm font-semibold">Jeu</div>
            <div className="text-xs text-[#6F6454]">Cohésion</div>
          </button>
          <button
            type="button"
            onClick={() => applyQuick("Défi gratitude", ["rituel", "positif"])}
            className="rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] px-4 py-3 text-left hover:border-[#CFECE8]"
          >
            <div className="text-sm font-semibold">Gratitude</div>
            <div className="text-xs text-[#6F6454]">Rituel</div>
          </button>
          <button
            type="button"
            onClick={() => applyQuick("Session révisions", ["études", "focus"])}
            className="rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] px-4 py-3 text-left hover:border-[#CFECE8]"
          >
            <div className="text-sm font-semibold">Révisions</div>
            <div className="text-xs text-[#6F6454]">Étudiant</div>
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-4 grid gap-3 lg:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l’activité"
            className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm outline-none focus:border-[#8CC7BE]"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
            />
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
              placeholder="Fin (optionnel)"
            />
          </div>

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (ex: famille, sport, détente)"
            className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as ShareLevel)}
              className="rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm bg-white"
            >
              <option value="bubble">Visible à la bulle</option>
              <option value="referent">Référent uniquement</option>
              <option value="private">Privé (moi)</option>
            </select>

            <label className="flex items-center gap-2 rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm text-[#6F6454]">
              <input type="checkbox" checked={isQuick} onChange={(e) => setIsQuick(e.target.checked)} />
              Activité rapide
            </label>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optionnel)"
            className="min-h-20 rounded-2xl border border-[#E8DCC8] px-4 py-3 text-sm lg:col-span-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#1B1A18] px-5 py-3 text-sm font-semibold text-[#FAF6EE] disabled:opacity-60 lg:col-span-2"
          >
            {saving ? "Ajout..." : "Ajouter au calendrier"}
          </button>
        </form>
      </div>

      {/* Events list */}
      <div className="rounded-3xl border border-[#E8DCC8] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> Activités à venir
          </h3>

          {isAdmin && events.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <select
                value={inviteEventId}
                onChange={(e) => setInviteEventId(e.target.value)}
                className="rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm bg-white"
              >
                <option value="">Choisir un événement</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>

              <select
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                className="rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm bg-white"
              >
                <option value="">Inviter un membre</option>
                {memberOptions.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={adminInvite}
                disabled={!inviteEventId || !inviteUserId}
                className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE] disabled:opacity-50"
              >
                Inviter
              </button>
            </div>
          ) : null}
        </div>

        {events.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#DCCEB7] bg-[#FFFCF6] p-6 text-sm text-[#6F6454]">
            Aucun événement pour le moment. Ajoute une première activité !
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {events.map((ev) => {
              const my = myStatusFor(ev.id);
              const parts = participantsByEvent[ev.id] ?? [];

              const count = (s: EventParticipationStatus) => parts.filter((p) => p.status === s).length;

              return (
                <div key={ev.id} className="rounded-2xl bg-[#FAF6EE] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{ev.title}</div>
                      <div className="mt-1 text-xs text-[#6F6454] flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(ev.starts_at)}
                        {ev.ends_at ? ` → ${formatDate(ev.ends_at)}` : ""}
                      </div>
                      {ev.tags?.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ev.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-[#F3E0B9]/55 px-2 py-1 text-[11px] font-semibold text-[#5F4B2E]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {ev.notes ? <p className="mt-2 text-sm text-[#2E2923]">{ev.notes}</p> : null}
                    </div>

                    <div className="text-right text-xs text-[#6F6454]">
                      <div>✅ {count("going")}</div>
                      <div>🤔 {count("maybe")}</div>
                      <div>❌ {count("declined")}</div>
                      <div className="mt-2 text-[11px] text-[#8B7D67]">
                        Mon statut : {my ?? "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => rsvp(ev.id, "going")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        my === "going" ? "bg-[#1B1A18] text-[#FAF6EE]" : "border border-[#E8DCC8] bg-white"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" /> J’y vais
                    </button>
                    <button
                      type="button"
                      onClick={() => rsvp(ev.id, "maybe")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        my === "maybe" ? "bg-[#1B1A18] text-[#FAF6EE]" : "border border-[#E8DCC8] bg-white"
                      }`}
                    >
                      🤔 Peut-être
                    </button>
                    <button
                      type="button"
                      onClick={() => rsvp(ev.id, "declined")}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        my === "declined" ? "bg-[#1B1A18] text-[#FAF6EE]" : "border border-[#E8DCC8] bg-white"
                      }`}
                    >
                      <XCircle className="h-4 w-4" /> Je décline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
