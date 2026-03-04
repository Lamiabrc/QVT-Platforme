import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/social/Avatar";
import BubbleCover from "@/components/social/BubbleCover";
import {
  assignLuciole,
  blockUser,
  createComment,
  createInvitation,
  createOrderStub,
  createPost,
  createReport,
  fetchApprovedLucioles,
  fetchBoxes,
  fetchBubble,
  fetchBubbleInvitations,
  fetchBubbleLucioles,
  fetchBubbleMembers,
  fetchBubbleRecommendations,
  fetchBubbleRole,
  fetchFeed,
  fetchReports,
  setReferent,
  updateReportStatus,
} from "@/lib/social";
import type {
  BoxItem,
  BoxRecommendation,
  BubbleComment,
  BubbleInvitation,
  BubbleItem,
  BubbleMember,
  BubblePost,
  BubbleReport,
  BubbleRole,
} from "@/lib/social";
import { supabase } from "@/integrations/supabase/client";

type TabKey = "feed" | "members" | "referent" | "calendar" | "box";

const roleLabel = (role?: string | null) => {
  if (role === "owner") return "Propriétaire";
  if (role === "admin") return "Administrateur";
  if (role === "referent") return "Référent";
  if (role === "luciole") return "Luciole";
  return "Membre";
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
};

const makeInviteLink = (token: string) =>
  `${window.location.origin.replace(/\/$/, "")}/invitation/${token}`;

export default function BubbleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<TabKey>("feed");
  const [loading, setLoading] = useState(true);

  const [bubble, setBubble] = useState<BubbleItem | null>(null);
  const [role, setRole] = useState<BubbleRole | null>(null);
  const [members, setMembers] = useState<BubbleMember[]>([]);
  const [invitations, setInvitations] = useState<BubbleInvitation[]>([]);
  const [posts, setPosts] = useState<BubblePost[]>([]);
  const [comments, setComments] = useState<BubbleComment[]>([]);
  const [reports, setReports] = useState<BubbleReport[]>([]);
  const [approvedLucioles, setApprovedLucioles] = useState<any[]>([]);
  const [assignedLucioles, setAssignedLucioles] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [recommendations, setRecommendations] = useState<BoxRecommendation[]>([]);

  const [postText, setPostText] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<BubbleRole>("member");
  const [selectedReferent, setSelectedReferent] = useState<string>("");
  const [selectedLuciole, setSelectedLuciole] = useState<string>("");

  const canManageMembers = role === "owner" || role === "admin";
  const canSetReferent = canManageMembers || role === "referent";
  const canPost = role !== null && role !== "luciole";
  const canModerate = canManageMembers;

  const groupedComments = useMemo(() => {
    const map = new Map<string, BubbleComment[]>();
    for (const comment of comments) {
      const bucket = map.get(comment.post_id) ?? [];
      bucket.push(comment);
      map.set(comment.post_id, bucket);
    }
    return map;
  }, [comments]);

  const load = async () => {
    if (!id || !user?.id) return;
    setLoading(true);
    try {
      const [bubbleData, roleData, membersData, feedData, boxesData, recData, lucioleData] =
        await Promise.all([
          fetchBubble(id),
          fetchBubbleRole(id, user.id),
          fetchBubbleMembers(id),
          fetchFeed(id),
          fetchBoxes().catch(() => []),
          fetchBubbleRecommendations(id).catch(() => []),
          fetchBubbleLucioles(id).catch(() => []),
        ]);

      const nextRole = roleData ?? (bubbleData ? "luciole" : null);

      setBubble(bubbleData);
      setRole(nextRole);
      setMembers(membersData);
      setPosts(feedData.posts);
      setComments(feedData.comments);
      setBoxes(boxesData);
      setRecommendations(recData);
      setAssignedLucioles(lucioleData);
      setSelectedReferent(bubbleData?.referent_user_id ?? "");

      if (nextRole === "owner" || nextRole === "admin") {
        const invites = await fetchBubbleInvitations(id).catch(() => []);
        setInvitations(invites);
      } else {
        setInvitations([]);
      }

      if (nextRole === "owner" || nextRole === "admin") {
        const reportRows = await fetchReports(id).catch(() => []);
        setReports(reportRows);
      } else {
        setReports([]);
      }

      const directory = await fetchApprovedLucioles().catch(() => []);
      setApprovedLucioles(directory);
    } catch (error: any) {
      toast({
        title: "Impossible de charger la bulle",
        description: error?.message ?? "Vérifiez vos accès.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  useEffect(() => {
    if (!id) return;

    const refreshFeed = () =>
      fetchFeed(id)
        .then((data) => {
          setPosts(data.posts);
          setComments(data.comments);
        })
        .catch(() => undefined);

    const channel = supabase
      .channel(`bubble-feed-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts", filter: `bubble_id=eq.${id}` },
        refreshFeed
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `bubble_id=eq.${id}` },
        refreshFeed
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const handlePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !user?.id || !postText.trim()) return;
    try {
      await createPost(id, user.id, postText);
      setPostText("");
    } catch (error: any) {
      toast({
        title: "Publication impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleHelpRequest = async () => {
    if (!id || !user?.id) return;
    try {
      await createPost(
        id,
        user.id,
        "🆘 Je demande de l’aide. J’ai besoin qu’on m’écoute / qu’on me conseille.",
        "referent"
      );
      toast({
        title: "Demande d’aide envoyée",
        description: "Le message est partagé au niveau référent (cadre de confiance).",
      });
    } catch (error: any) {
      toast({
        title: "Impossible d’envoyer la demande",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (postId: string) => {
    if (!id || !user?.id) return;
    const draft = (commentDrafts[postId] ?? "").trim();
    if (!draft) return;
    try {
      await createComment(postId, id, user.id, draft);
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch (error: any) {
      toast({
        title: "Commentaire impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleInvite = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !user?.id) return;
    try {
      await createInvitation({
        bubbleId: id,
        invitedBy: user.id,
        email: inviteEmail || undefined,
        role: inviteRole,
        origin: window.location.origin,
      });
      setInviteEmail("");
      setInviteRole("member");
      setInvitations(await fetchBubbleInvitations(id));
      toast({
        title: "Invitation créée",
        description: "Lien prêt. Vous pouvez le partager.",
      });
    } catch (error: any) {
      toast({
        title: "Invitation impossible",
        description: error?.message ?? "Vérifiez vos permissions.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copié", description: "Lien copié dans le presse-papiers." });
    } catch {
      toast({ title: "Copie impossible", description: "Copiez manuellement le lien.", variant: "destructive" });
    }
  };

  const handleReport = async (targetType: "post" | "comment" | "user", targetId: string) => {
    if (!id || !user?.id) return;
    const reason = window.prompt("Raison du signalement");
    if (!reason?.trim()) return;

    try {
      await createReport({
        bubbleId: id,
        reporterId: user.id,
        targetType,
        targetId,
        reason,
      });
      toast({
        title: "Signalement envoyé",
        description: "Merci. Les admins de la bulle peuvent traiter le signalement.",
      });
      if (canModerate) {
        setReports(await fetchReports(id));
      }
    } catch (error: any) {
      toast({
        title: "Signalement impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleBlock = async (blockedId: string) => {
    if (!user?.id) return;
    try {
      await blockUser(user.id, blockedId);
      toast({
        title: "Utilisateur bloqué",
        description: "Vous ne verrez plus ses nouvelles publications.",
      });
    } catch (error: any) {
      toast({
        title: "Blocage impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleSetReferent = async () => {
    if (!id) return;
    try {
      await setReferent(id, selectedReferent || null);
      setBubble((prev) => (prev ? { ...prev, referent_user_id: selectedReferent || null } : prev));
      toast({
        title: "Référent mis à jour",
        description: "Le cadre de la bulle est à jour.",
      });
    } catch (error: any) {
      toast({
        title: "Mise à jour impossible",
        description: error?.message ?? "Vérifiez les permissions.",
        variant: "destructive",
      });
    }
  };

  const handleAssignLuciole = async () => {
    if (!id || !user?.id || !selectedLuciole) return;
    try {
      await assignLuciole(id, selectedLuciole, user.id);
      setAssignedLucioles(await fetchBubbleLucioles(id));
      setSelectedLuciole("");
      toast({
        title: "Luciole ajoutée",
        description: "La Luciole est assignée à cette bulle.",
      });
    } catch (error: any) {
      toast({
        title: "Assignation impossible",
        description: error?.message ?? "Vérifiez les permissions.",
        variant: "destructive",
      });
    }
  };

  const handleOrder = async (box: BoxItem, kind: "gift" | "subscription") => {
    if (!id || !user?.id) return;
    const giftForEmail = kind === "gift" ? window.prompt("Email du destinataire (optionnel)") || "" : "";

    try {
      await createOrderStub({
        userId: user.id,
        bubbleId: id,
        box,
        kind,
        giftForEmail: giftForEmail || undefined,
      });
      toast({
        title: kind === "gift" ? "Offre enregistrée" : "Abonnement enregistré",
        description: "Commande créée en statut pending (MVP sans paiement).",
      });
    } catch (error: any) {
      toast({
        title: "Action impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
        <Navigation />
        <main className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-6xl rounded-3xl border border-[#E8DCC8] bg-white p-6 text-sm text-[#6F6454]">
            Chargement de la bulle...
          </div>
        </main>
      </div>
    );
  }

  if (!bubble) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
        <Navigation />
        <main className="px-6 pb-20 pt-32">
          <div className="mx-auto max-w-6xl rounded-3xl border border-[#E8DCC8] bg-white p-6">
            <h1 className="text-xl font-semibold">Bulle introuvable</h1>
            <Link
              to="/bulles"
              className="mt-4 inline-flex rounded-full bg-[#1B1A18] px-5 py-2 text-sm font-semibold text-[#FAF6EE]"
            >
              Retour à mes bulles
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const referent = members.find((member) => member.user_id === bubble.referent_user_id);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <BubbleCover title={bubble.name} src={bubble.cover_path || "/covers/cover-1.svg"} />

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#9C8D77]">
                {bubble.bubble_type === "enterprise" ? "Entreprise" : "Vie perso"}
              </p>
              <h1 className="mt-2 text-3xl font-semibold">{bubble.name}</h1>
              <p className="mt-1 text-sm text-[#6F6454]">Votre rôle : {roleLabel(role)}</p>
            </div>

            <Link
              to="/bulles"
              className="rounded-full border border-[#1B1A18]/20 px-4 py-2 text-sm font-semibold text-[#1B1A18]"
            >
              Retour
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: "feed", label: "Fil" },
              { key: "members", label: "Membres" },
              { key: "referent", label: "Référent & Lucioles" },
              { key: "calendar", label: "Calendrier" },
              { key: "box", label: "Box" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key as TabKey)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  tab === item.key
                    ? "bg-[#1B1A18] text-[#FAF6EE]"
                    : "border border-[#E8DCC8] bg-white text-[#6F6454]",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* FEED */}
          {tab === "feed" ? (
            <section className="mt-6 space-y-4">
              {canPost ? (
                <form onSubmit={handlePost} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                  <textarea
                    value={postText}
                    onChange={(event) => setPostText(event.target.value)}
                    placeholder="Partager un message dans la bulle..."
                    className="min-h-24 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Publier
                    </button>
                    <button
                      type="button"
                      onClick={handleHelpRequest}
                      className="rounded-full border border-[#E8DCC8] px-4 py-2 text-sm"
                    >
                      Demander de l’aide (référent)
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-[#E8DCC8] bg-white p-4 text-sm text-[#6F6454]">
                  En tant que Luciole assignée, vous consultez ce qui est partagé dans la bulle.
                </div>
              )}

              {posts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-6 text-sm text-[#6F6454]">
                  Aucun message pour le moment.
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={post.author?.full_name || post.author?.email || post.author_id}
                          src={`/avatars/avatar-${(post.author_id.charCodeAt(0) % 12) + 1}.svg`}
                          size={36}
                        />
                        <div>
                          <div className="text-sm font-semibold">
                            {post.author?.full_name || post.author?.email || post.author_id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-[#9C8D77]">{formatDate(post.created_at)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleReport("post", post.id)}
                        className="text-xs text-[#9C8D77] hover:text-[#1B1A18]"
                      >
                        Signaler
                      </button>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm text-[#2E2923]">{post.content}</p>

                    <div className="mt-4 space-y-2">
                      {(groupedComments.get(post.id) ?? []).map((comment) => (
                        <div key={comment.id} className="rounded-2xl bg-[#FAF6EE] px-3 py-2 text-sm">
                          <div className="flex items-center justify-between gap-3 text-xs text-[#9C8D77]">
                            <span>
                              {comment.author?.full_name || comment.author?.email || comment.author_id.slice(0, 8)}
                            </span>
                            <button type="button" onClick={() => handleReport("comment", comment.id)}>
                              Signaler
                            </button>
                          </div>
                          <p className="mt-1 text-[#2E2923]">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    {canPost ? (
                      <div className="mt-3 flex gap-2">
                        <input
                          value={commentDrafts[post.id] ?? ""}
                          onChange={(event) =>
                            setCommentDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                          }
                          placeholder="Ajouter un commentaire..."
                          className="flex-1 rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleComment(post.id)}
                          className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                        >
                          Envoyer
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </section>
          ) : null}

          {/* MEMBERS */}
          {tab === "members" ? (
            <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Membres</h2>
                <div className="mt-3 space-y-2">
                  {members.map((member) => (
                    <div
                      key={`${member.bubble_id}-${member.user_id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-[#FAF6EE] px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={member.profile?.full_name || member.profile?.email || member.user_id}
                          src={`/avatars/avatar-${(member.user_id.charCodeAt(0) % 12) + 1}.svg`}
                          size={34}
                        />
                        <div>
                          <div className="text-sm font-semibold">
                            {member.profile?.full_name || member.profile?.email || member.user_id.slice(0, 8)}
                          </div>
                          <div className="text-xs text-[#9C8D77]">{roleLabel(member.role)}</div>
                        </div>
                      </div>

                      {member.user_id !== user?.id ? (
                        <button
                          type="button"
                          onClick={() => handleBlock(member.user_id)}
                          className="text-xs text-[#9C8D77] hover:text-[#1B1A18]"
                        >
                          Bloquer
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {canManageMembers ? (
                  <form onSubmit={handleInvite} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                    <h3 className="text-sm font-semibold">Inviter</h3>
                    <input
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      placeholder="Email (optionnel)"
                      className="mt-3 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    />
                    <select
                      value={inviteRole}
                      onChange={(event) => setInviteRole(event.target.value as BubbleRole)}
                      className="mt-2 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    >
                      <option value="member">Membre</option>
                      <option value="admin">Administrateur</option>
                      <option value="referent">Référent</option>
                    </select>
                    <button
                      type="submit"
                      className="mt-3 rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Créer l’invitation
                    </button>
                  </form>
                ) : null}

                <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                  <h3 className="text-sm font-semibold">Invitations</h3>
                  <div className="mt-3 space-y-2">
                    {invitations.length === 0 ? (
                      <p className="text-sm text-[#6F6454]">Aucune invitation active.</p>
                    ) : (
                      invitations.map((invite) => {
                        const link = makeInviteLink(invite.token);
                        return (
                          <div key={invite.id} className="rounded-2xl bg-[#FAF6EE] px-3 py-2 text-sm">
                            <p className="text-xs text-[#6F6454]">
                              {invite.email || "Lien public"} • {roleLabel(invite.role)} • {invite.status}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <a
                                href={link}
                                className="text-[12px] font-mono text-[#1B1A18] underline break-all"
                              >
                                {link}
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopy(link)}
                                className="rounded-full border border-[#E8DCC8] px-3 py-1 text-xs"
                              >
                                Copier
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {canModerate ? (
                  <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                    <h3 className="text-sm font-semibold">Signalements</h3>
                    <div className="mt-3 space-y-2">
                      {reports.length === 0 ? (
                        <p className="text-sm text-[#6F6454]">Aucun signalement.</p>
                      ) : (
                        reports.map((report) => (
                          <div key={report.id} className="rounded-2xl bg-[#FAF6EE] px-3 py-2 text-xs">
                            <p className="font-semibold">{report.target_type}</p>
                            <p className="mt-1 text-[#6F6454]">{report.reason}</p>
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => updateReportStatus(report.id, "reviewed").then(load)}
                                className="rounded-full border border-[#E8DCC8] px-2 py-1"
                              >
                                Traiter
                              </button>
                              <button
                                type="button"
                                onClick={() => updateReportStatus(report.id, "closed").then(load)}
                                className="rounded-full border border-[#E8DCC8] px-2 py-1"
                              >
                                Clôturer
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* REFERENT & LUCIOLES */}
          {tab === "referent" ? (
            <section className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Référent</h2>
                <p className="mt-2 text-sm text-[#6F6454]">
                  {referent
                    ? `Référent actuel : ${
                        referent.profile?.full_name || referent.profile?.email || referent.user_id.slice(0, 8)
                      }`
                    : "Aucun référent défini."}
                </p>

                {bubble.has_minor && !bubble.referent_user_id ? (
                  <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                    Mineur concerné : référent obligatoire.
                  </p>
                ) : null}

                {canSetReferent ? (
                  <div className="mt-4 flex gap-2">
                    <select
                      value={selectedReferent}
                      onChange={(event) => setSelectedReferent(event.target.value)}
                      className="flex-1 rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    >
                      <option value="">— Aucun —</option>
                      {members.map((member) => (
                        <option key={member.user_id} value={member.user_id}>
                          {member.profile?.full_name || member.profile?.email || member.user_id.slice(0, 8)} (
                          {roleLabel(member.role)})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleSetReferent}
                      className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Valider
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Lucioles</h2>
                <p className="mt-2 text-sm text-[#6F6454]">
                  Recruter une Luciole est un soutien <strong>payant</strong> (abonnement). Elle ne voit que ce qui est
                  partagé dans cette bulle.
                </p>

                <div className="mt-3 space-y-2">
                  {assignedLucioles.length === 0 ? (
                    <p className="text-sm text-[#6F6454]">Aucune Luciole assignée.</p>
                  ) : (
                    assignedLucioles.map((item: any) => (
                      <div
                        key={`${item.bubble_id}-${item.luciole_id}`}
                        className="rounded-2xl bg-[#FAF6EE] px-3 py-2 text-sm"
                      >
                        {item.luciole?.display_name || item.luciole_id}
                      </div>
                    ))
                  )}
                </div>

                {canManageMembers ? (
                  <div className="mt-4 flex gap-2">
                    <select
                      value={selectedLuciole}
                      onChange={(event) => setSelectedLuciole(event.target.value)}
                      className="flex-1 rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    >
                      <option value="">Ajouter une Luciole (approved)</option>
                      {approvedLucioles.map((luciole: any) => (
                        <option key={luciole.id} value={luciole.id}>
                          {luciole.display_name} {luciole.city ? `(${luciole.city})` : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAssignLuciole}
                      className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Ajouter
                    </button>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* CALENDAR (teaser now; we implement next file) */}
          {tab === "calendar" ? (
            <section className="mt-6 rounded-3xl border border-[#E8DCC8] bg-white p-6">
              <h2 className="text-lg font-semibold">Calendrier de bulle</h2>
              <p className="mt-2 text-sm text-[#6F6454]">
                Activités communes, invitations, rappels… (module en cours d’intégration).
              </p>
              <p className="mt-4 text-sm text-[#6F6454]">
                Prochaine étape : ajout des événements + participants directement ici.
              </p>
            </section>
          ) : null}

          {/* BOX */}
          {tab === "box" ? (
            <section className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Box recommandées</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {recommendations.length === 0 ? (
                    <p className="text-sm text-[#6F6454]">Aucune recommandation pour cette bulle.</p>
                  ) : (
                    recommendations.map((item) => (
                      <div key={item.id} className="rounded-2xl bg-[#FAF6EE] p-3">
                        <p className="text-sm font-semibold">{item.box?.title || item.box_id}</p>
                        <p className="mt-1 text-xs text-[#6F6454]">{item.reason || "Suggestion par la bulle."}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Mini-catalogue</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {boxes.map((box) => (
                    <article key={box.id} className="rounded-2xl border border-[#E8DCC8] bg-[#FFFCF6] p-3">
                      <p className="text-sm font-semibold">{box.title}</p>
                      <p className="mt-1 text-xs text-[#6F6454]">{box.description || "Une box quand ça compte."}</p>
                      <p className="mt-2 text-sm font-semibold">{Math.round(box.price_cents / 100)} €</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOrder(box, "gift")}
                          className="rounded-full border border-[#E8DCC8] px-3 py-1 text-xs font-semibold"
                        >
                          Offrir
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOrder(box, "subscription")}
                          className="rounded-full bg-[#1B1A18] px-3 py-1 text-xs font-semibold text-[#FAF6EE]"
                        >
                          S’abonner
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
