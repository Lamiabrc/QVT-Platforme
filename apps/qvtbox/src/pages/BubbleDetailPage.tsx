import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/social/Avatar";
import BubbleCover from "@/components/social/BubbleCover";
import BubbleCalendar from "@/components/social/BubbleCalendar";
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
  fetchReactions,
  fetchReports,
  setReferent,
  toggleReaction,
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
  ReactionItem,
  ShareLevel,
} from "@/lib/social";
import { supabase } from "@/integrations/supabase/client";

type TabKey = "feed" | "discussions" | "members" | "help" | "events" | "resources";
type PostKind = "text" | "photo" | "video" | "poll" | "emotion";

type StructuredPostPayload = {
  kind: PostKind;
  text: string;
  mediaUrl?: string;
  pollQuestion?: string;
  pollOptions?: string[];
  emotion?: string;
  isHelp?: boolean;
  isDiscussion?: boolean;
};

const STRUCTURED_PREFIX = "ZENA_POST::";
const REACTION_EMOJIS = ["👍", "❤️", "🤝", "🙏"];

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

const encodeStructuredPost = (payload: StructuredPostPayload) =>
  `${STRUCTURED_PREFIX}${JSON.stringify(payload)}`;

const decodeStructuredPost = (content: string): StructuredPostPayload => {
  if (content.startsWith(STRUCTURED_PREFIX)) {
    try {
      const parsed = JSON.parse(content.slice(STRUCTURED_PREFIX.length)) as StructuredPostPayload;
      return {
        kind: parsed.kind ?? "text",
        text: parsed.text ?? "",
        mediaUrl: parsed.mediaUrl,
        pollQuestion: parsed.pollQuestion,
        pollOptions: parsed.pollOptions ?? [],
        emotion: parsed.emotion,
        isHelp: Boolean(parsed.isHelp),
        isDiscussion: Boolean(parsed.isDiscussion),
      };
    } catch {
      return { kind: "text", text: content };
    }
  }

  return { kind: "text", text: content };
};

const postTypeLabel = (kind: PostKind) => {
  if (kind === "photo") return "Photo";
  if (kind === "video") return "Video";
  if (kind === "poll") return "Sondage";
  if (kind === "emotion") return "Emotion";
  return "Texte";
};

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
  const [reactions, setReactions] = useState<ReactionItem[]>([]);
  const [reports, setReports] = useState<BubbleReport[]>([]);
  const [approvedLucioles, setApprovedLucioles] = useState<any[]>([]);
  const [assignedLucioles, setAssignedLucioles] = useState<any[]>([]);
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [recommendations, setRecommendations] = useState<BoxRecommendation[]>([]);

  const [postKind, setPostKind] = useState<PostKind>("text");
  const [shareLevel, setShareLevel] = useState<ShareLevel>("bubble");
  const [postText, setPostText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("Option 1\nOption 2");
  const [emotionValue, setEmotionValue] = useState("🙂");
  const [discussionDraft, setDiscussionDraft] = useState("");
  const [helpDraft, setHelpDraft] = useState("Je me sens depasse aujourd'hui.");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<BubbleRole>("member");
  const [selectedReferent, setSelectedReferent] = useState<string>("");
  const [selectedLuciole, setSelectedLuciole] = useState<string>("");

  const canManageMembers = role === "owner" || role === "admin";
  const canSetReferent = canManageMembers || role === "referent";
  const canPost = role !== null && role !== "luciole";
  const canModerate = canManageMembers || role === "referent";

  const groupedComments = useMemo(() => {
    const map = new Map<string, BubbleComment[]>();
    for (const comment of comments) {
      const bucket = map.get(comment.post_id) ?? [];
      bucket.push(comment);
      map.set(comment.post_id, bucket);
    }
    return map;
  }, [comments]);

  const parsedPosts = useMemo(
    () =>
      posts.map((post) => ({
        post,
        parsed: decodeStructuredPost(post.content),
      })),
    [posts]
  );

  const helpPosts = useMemo(
    () =>
      parsedPosts.filter(
        ({ post, parsed }) => parsed.isHelp || post.share_level === "referent"
      ),
    [parsedPosts]
  );

  const discussionPosts = useMemo(() => {
    const explicit = parsedPosts.filter(({ parsed }) => parsed.isDiscussion);
    if (explicit.length > 0) return explicit;
    return parsedPosts.filter(({ post }) => (groupedComments.get(post.id) ?? []).length > 0);
  }, [groupedComments, parsedPosts]);

  const reactionsByPost = useMemo(() => {
    const map = new Map<string, ReactionItem[]>();
    for (const reaction of reactions) {
      if (!reaction.post_id) continue;
      const bucket = map.get(reaction.post_id) ?? [];
      bucket.push(reaction);
      map.set(reaction.post_id, bucket);
    }
    return map;
  }, [reactions]);

  const load = async () => {
    if (!id || !user?.id) return;
    setLoading(true);
    try {
      const [bubbleData, roleData, membersData, feedData, reactionData, boxesData, recData, lucioleData] =
        await Promise.all([
          fetchBubble(id),
          fetchBubbleRole(id, user.id),
          fetchBubbleMembers(id),
          fetchFeed(id),
          fetchReactions(id).catch(() => []),
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
      setReactions(reactionData);
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
      Promise.all([fetchFeed(id), fetchReactions(id).catch(() => [])])
        .then(([data, reactionData]) => {
          setPosts(data.posts);
          setComments(data.comments);
          setReactions(reactionData);
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reactions", filter: `bubble_id=eq.${id}` },
        refreshFeed
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const handlePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !user?.id || !canPost) return;

    const buildContent = () => {
      if (postKind === "photo") {
        if (!mediaUrl.trim()) throw new Error("Ajoutez l'URL de la photo.");
        return encodeStructuredPost({ kind: "photo", text: postText.trim(), mediaUrl: mediaUrl.trim() });
      }

      if (postKind === "video") {
        if (!mediaUrl.trim()) throw new Error("Ajoutez l'URL de la video.");
        return encodeStructuredPost({ kind: "video", text: postText.trim(), mediaUrl: mediaUrl.trim() });
      }

      if (postKind === "poll") {
        const options = pollOptions
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
        if (!pollQuestion.trim()) throw new Error("Ajoutez la question du sondage.");
        if (options.length < 2) throw new Error("Ajoutez au moins 2 options.");
        return encodeStructuredPost({
          kind: "poll",
          text: postText.trim(),
          pollQuestion: pollQuestion.trim(),
          pollOptions: options,
        });
      }

      if (postKind === "emotion") {
        return encodeStructuredPost({
          kind: "emotion",
          text: postText.trim(),
          emotion: emotionValue.trim() || "🙂",
        });
      }

      if (!postText.trim()) throw new Error("Le message ne peut pas etre vide.");
      return encodeStructuredPost({ kind: "text", text: postText.trim() });
    };

    try {
      await createPost(id, user.id, buildContent(), shareLevel);
      setPostText("");
      setMediaUrl("");
      setPollQuestion("");
      setPollOptions("Option 1\nOption 2");
      setEmotionValue("🙂");
      setPostKind("text");
      setShareLevel("bubble");
    } catch (error: any) {
      toast({
        title: "Publication impossible",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleHelpRequest = async () => {
    if (!id || !user?.id || !canPost) return;
    const draft = helpDraft.trim() || "Je me sens depasse aujourd'hui et j'ai besoin d'aide.";
    try {
      await createPost(
        id,
        user.id,
        encodeStructuredPost({ kind: "text", text: draft, isHelp: true }),
        "referent"
      );
      setHelpDraft("Je me sens depasse aujourd'hui.");
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

  const handleDiscussion = async () => {
    if (!id || !user?.id || !canPost) return;
    const draft = discussionDraft.trim();
    if (!draft) return;
    try {
      await createPost(
        id,
        user.id,
        encodeStructuredPost({ kind: "text", text: draft, isDiscussion: true }),
        "bubble"
      );
      setDiscussionDraft("");
      toast({
        title: "Discussion lancee",
        description: "Le message est ajoute au fil de discussion.",
      });
    } catch (error: any) {
      toast({
        title: "Discussion impossible",
        description: error?.message ?? "Reessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const handleToggleReaction = async (postId: string, emoji: string) => {
    if (!id || !user?.id) return;
    try {
      await toggleReaction({ bubbleId: id, postId, userId: user.id, emoji });
      setReactions(await fetchReactions(id).catch(() => []));
    } catch {
      toast({
        title: "Reaction impossible",
        description: "Reessayez dans quelques instants.",
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
      toast({
        title: "Copie impossible",
        description: "Copiez manuellement le lien.",
        variant: "destructive",
      });
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
        <main className="px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
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
        <main className="px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
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

      <main className="px-4 pb-20 pt-24 sm:px-6 md:pt-36">
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[240px,1fr]">
            <aside className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
            {[
              { key: "feed", label: "Fil d'actualite" },
              { key: "discussions", label: "Discussions" },
              { key: "events", label: "Evenements" },
              { key: "resources", label: "Ressources" },
              { key: "help", label: "Demandes d'aide" },
              { key: "members", label: "Membres" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key as TabKey)}
                className={[
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  tab === item.key
                    ? "bg-[#1B1A18] text-[#FAF6EE]"
                    : "border border-[#E8DCC8] bg-white text-[#6F6454]",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
            </aside>

            <div>

          {/* FEED */}
          {tab === "feed" ? (
            <section className="mt-6 space-y-4">
              {canPost ? (
                <form onSubmit={handlePost} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={postKind}
                      onChange={(event) => setPostKind(event.target.value as PostKind)}
                      className="rounded-2xl border border-[#E8DCC8] bg-white px-3 py-2 text-sm"
                    >
                      <option value="text">Texte</option>
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="poll">Sondage</option>
                      <option value="emotion">Emotion</option>
                    </select>
                    <select
                      value={shareLevel}
                      onChange={(event) => setShareLevel(event.target.value as ShareLevel)}
                      className="rounded-2xl border border-[#E8DCC8] bg-white px-3 py-2 text-sm"
                    >
                      <option value="private">Prive</option>
                      <option value="referent">Referent</option>
                      <option value="bubble">Bulle</option>
                    </select>
                  </div>

                  {(postKind === "photo" || postKind === "video") ? (
                    <input
                      value={mediaUrl}
                      onChange={(event) => setMediaUrl(event.target.value)}
                      placeholder={postKind === "photo" ? "URL photo" : "URL video"}
                      className="mt-2 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    />
                  ) : null}

                  {postKind === "poll" ? (
                    <div className="mt-2 grid gap-2">
                      <input
                        value={pollQuestion}
                        onChange={(event) => setPollQuestion(event.target.value)}
                        placeholder="Question du sondage"
                        className="rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                      />
                      <textarea
                        value={pollOptions}
                        onChange={(event) => setPollOptions(event.target.value)}
                        placeholder={"Option 1\nOption 2\nOption 3"}
                        className="min-h-20 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                      />
                    </div>
                  ) : null}

                  {postKind === "emotion" ? (
                    <input
                      value={emotionValue}
                      onChange={(event) => setEmotionValue(event.target.value)}
                      placeholder="Emoji / emotion"
                      className="mt-2 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    />
                  ) : null}

                  <textarea
                    value={postText}
                    onChange={(event) => setPostText(event.target.value)}
                    placeholder="Partager un message dans la bulle..."
                    className="mt-2 min-h-24 w-full rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
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
                      J'ai besoin d'aide
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-[#E8DCC8] bg-white p-4 text-sm text-[#6F6454]">
                  En tant que Luciole assignée, vous consultez ce qui est partagé dans la bulle.
                </div>
              )}

              {parsedPosts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-6 text-sm text-[#6F6454]">
                  Aucun message pour le moment.
                </div>
              ) : (
                parsedPosts.map(({ post, parsed }) => {
                  const postReactions = reactionsByPost.get(post.id) ?? [];
                  const reactionCounts = postReactions.reduce<Record<string, number>>((acc, reaction) => {
                    acc[reaction.emoji] = (acc[reaction.emoji] ?? 0) + 1;
                    return acc;
                  }, {});
                  return (
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

                    <div className="mt-3 space-y-2">
                      {parsed.isHelp || post.share_level === "referent" ? (
                        <span className="inline-flex rounded-full bg-[#FFF4E7] px-2 py-1 text-[11px] font-semibold text-[#7A4B25]">
                          Demande d'aide
                        </span>
                      ) : null}
                      {parsed.isDiscussion ? (
                        <span className="ml-2 inline-flex rounded-full bg-[#EEF4FF] px-2 py-1 text-[11px] font-semibold text-[#2D4D84]">
                          Discussion
                        </span>
                      ) : null}
                      <span className="inline-flex rounded-full border border-[#E8DCC8] bg-[#FDF9F0] px-2 py-1 text-[11px] text-[#6F6454]">
                        Type: {postTypeLabel(parsed.kind)}
                      </span>

                      {parsed.kind === "photo" ? (
                        <div className="space-y-2">
                          {parsed.mediaUrl ? (
                            <img
                              src={parsed.mediaUrl}
                              alt="Post photo"
                              className="max-h-96 w-full rounded-2xl border border-[#E8DCC8] object-cover"
                            />
                          ) : null}
                          {parsed.text ? (
                            <p className="whitespace-pre-wrap text-sm text-[#2E2923]">{parsed.text}</p>
                          ) : null}
                        </div>
                      ) : parsed.kind === "video" ? (
                        <div className="space-y-2">
                          {parsed.mediaUrl ? (
                            <video
                              controls
                              src={parsed.mediaUrl}
                              className="max-h-96 w-full rounded-2xl border border-[#E8DCC8] bg-black"
                            />
                          ) : null}
                          {parsed.text ? (
                            <p className="whitespace-pre-wrap text-sm text-[#2E2923]">{parsed.text}</p>
                          ) : null}
                        </div>
                      ) : parsed.kind === "poll" ? (
                        <div className="space-y-2 rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] p-3">
                          <p className="text-sm font-semibold">{parsed.pollQuestion || "Sondage"}</p>
                          {(parsed.pollOptions ?? []).map((option) => (
                            <button
                              key={`${post.id}-${option}`}
                              type="button"
                              className="w-full rounded-xl border border-[#E8DCC8] bg-white px-3 py-2 text-left text-xs"
                            >
                              {option}
                            </button>
                          ))}
                          {parsed.text ? <p className="text-xs text-[#6F6454]">{parsed.text}</p> : null}
                        </div>
                      ) : parsed.kind === "emotion" ? (
                        <div className="rounded-2xl border border-[#E8DCC8] bg-[#FDF9F0] p-3">
                          <p className="text-2xl">{parsed.emotion || "🙂"}</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-[#2E2923]">{parsed.text}</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm text-[#2E2923]">{parsed.text}</p>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {REACTION_EMOJIS.map((emoji) => {
                        const active = postReactions.some(
                          (reaction) => reaction.user_id === user?.id && reaction.emoji === emoji
                        );
                        return (
                          <button
                            key={`${post.id}-${emoji}`}
                            type="button"
                            onClick={() => handleToggleReaction(post.id, emoji)}
                            className={[
                              "rounded-full border px-2 py-1 text-xs",
                              active
                                ? "border-[#9DB7E5] bg-[#EEF4FF] text-[#2D4D84]"
                                : "border-[#E8DCC8] bg-white text-[#6F6454]",
                            ].join(" ")}
                          >
                            {emoji} {reactionCounts[emoji] ?? 0}
                          </button>
                        );
                      })}
                    </div>

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
                  );
                })
              )}
            </section>
          ) : null}

          {/* MEMBERS */}
          {tab === "discussions" ? (
            <section className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">Discussions</h2>
                <p className="mt-1 text-sm text-[#6F6454]">
                  Espace conversation pour les messages collectifs de la bulle.
                </p>
                {canPost ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={discussionDraft}
                      onChange={(event) => setDiscussionDraft(event.target.value)}
                      placeholder="Lancer une discussion..."
                      className="flex-1 rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleDiscussion}
                      className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Publier
                    </button>
                  </div>
                ) : null}
              </div>

              {discussionPosts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-6 text-sm text-[#6F6454]">
                  Aucune discussion ouverte.
                </div>
              ) : (
                discussionPosts.map(({ post, parsed }) => (
                  <article key={post.id} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {post.author?.full_name || post.author?.email || post.author_id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-[#9C8D77]">{formatDate(post.created_at)}</p>
                    </div>
                    <p className="mt-2 text-sm text-[#2E2923]">{parsed.text}</p>
                    <p className="mt-2 text-xs text-[#9C8D77]">
                      {(groupedComments.get(post.id) ?? []).length} commentaire(s)
                    </p>
                  </article>
                ))
              )}
            </section>
          ) : null}

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
          {tab === "help" ? (
            <section className="mt-6 space-y-4">
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                <h2 className="text-lg font-semibold">J'ai besoin d'aide</h2>
                <p className="mt-2 text-sm text-[#6F6454]">
                  Les lucioles et referents repondent aux demandes sensibles dans un cadre bienveillant.
                </p>
                {canPost ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      value={helpDraft}
                      onChange={(event) => setHelpDraft(event.target.value)}
                      placeholder="Ex: Je me sens depasse par mon travail aujourd'hui."
                      className="flex-1 rounded-2xl border border-[#E8DCC8] px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleHelpRequest}
                      className="rounded-2xl bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
                    >
                      Envoyer
                    </button>
                  </div>
                ) : null}

                <div className="mt-3 space-y-2">
                  {helpPosts.length === 0 ? (
                    <p className="text-sm text-[#6F6454]">Aucune demande active.</p>
                  ) : (
                    helpPosts.slice(0, 4).map(({ post, parsed }) => (
                      <div key={post.id} className="rounded-2xl bg-[#FAF6EE] px-3 py-2 text-sm">
                        <p className="text-xs text-[#9C8D77]">{formatDate(post.created_at)}</p>
                        <p className="mt-1 text-[#2E2923]">{parsed.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
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
              </div>
            </section>
          ) : null}

          {/* CALENDAR (NOW LIVE) */}
          {tab === "events" ? (
            <section className="mt-6">
              <BubbleCalendar
                bubbleId={bubble.id}
                userId={user?.id as string}
                isAdmin={canManageMembers}
                members={members.map((m) => ({
                  user_id: m.user_id,
                  label: m.profile?.full_name || m.profile?.email || m.user_id.slice(0, 8),
                }))}
              />
            </section>
          ) : null}

          {/* BOX */}
          {tab === "resources" ? (
            <section className="mt-6 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: "Pause respiration", description: "Routine guidee de 5 minutes contre la surcharge." },
                  { title: "Communication apaisee", description: "Mini guide pour parler sans escalade." },
                  { title: "Defi bien-etre", description: "Action collective simple a lancer cette semaine." },
                ].map((resource) => (
                  <article key={resource.title} className="rounded-3xl border border-[#E8DCC8] bg-white p-4">
                    <h3 className="text-sm font-semibold">{resource.title}</h3>
                    <p className="mt-2 text-xs text-[#6F6454]">{resource.description}</p>
                  </article>
                ))}
              </div>

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

