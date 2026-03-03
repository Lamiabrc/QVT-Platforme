import { supabase } from "@/integrations/supabase/client";

export type BubbleRole = "owner" | "admin" | "member" | "referent" | "luciole";
export type BubbleType = "personal" | "enterprise";
export type InviteStatus = "pending" | "accepted" | "rejected" | "expired";
export type ReportStatus = "pending" | "reviewed" | "closed";
export type NotificationType = "invitation" | "new_post" | "reply" | "help_request";

const db = supabase as any;

export type BubbleItem = {
  id: string;
  name: string;
  bubble_type: BubbleType;
  has_minor: boolean;
  referent_user_id: string | null;
  cover_path: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  role?: BubbleRole;
};

export type BubbleMember = {
  bubble_id: string;
  user_id: string;
  role: BubbleRole;
  created_at: string;
  invited_by: string | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
};

export type BubbleInvitation = {
  id: string;
  bubble_id: string;
  token: string;
  email: string | null;
  role: BubbleRole;
  status: InviteStatus;
  expires_at: string;
  created_at: string;
  accepted_by: string | null;
};

export type BubblePost = {
  id: string;
  bubble_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  };
};

export type BubbleComment = {
  id: string;
  post_id: string;
  bubble_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string | null;
  };
};

export type BubbleReport = {
  id: string;
  bubble_id: string;
  reporter_id: string;
  target_type: "post" | "comment" | "user";
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
};

export type LucioleDirectoryItem = {
  id: string;
  user_id: string;
  display_name: string;
  city: string | null;
  bio: string | null;
  expertise: string[] | null;
  status: string;
};

export type BubbleLuciole = {
  bubble_id: string;
  luciole_id: string;
  status: string;
  created_at: string;
  luciole?: LucioleDirectoryItem;
};

export type BoxItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_path: string | null;
  price_cents: number;
  cadence: "one_shot" | "monthly" | "quarterly";
  is_active: boolean;
};

export type BoxRecommendation = {
  id: string;
  bubble_id: string;
  box_id: string;
  reason: string | null;
  created_at: string;
  box?: BoxItem;
};

export type NotificationItem = {
  id: string;
  user_id: string;
  actor_id: string | null;
  bubble_id: string | null;
  post_id: string | null;
  comment_id: string | null;
  invitation_id: string | null;
  type: NotificationType;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  actor?: {
    full_name: string | null;
    email: string | null;
  };
};

const normalizeToken = () =>
  `${crypto.randomUUID().replace(/-/g, "")}${Math.random().toString(36).slice(2, 8)}`;

const mapProfiles = async (userIds: string[]) => {
  if (!userIds.length) return new Map<string, { full_name: string | null; email: string | null }>();

  const { data } = await db
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const mapped = new Map<string, { full_name: string | null; email: string | null }>();
  for (const item of data ?? []) {
    mapped.set(item.id, { full_name: item.full_name ?? null, email: item.email ?? null });
  }
  return mapped;
};

export const fetchMyBubbles = async (userId: string) => {
  const { data: memberRows, error: memberError } = await db
    .from("bubble_members")
    .select("bubble_id, role")
    .eq("user_id", userId);

  if (memberError) throw memberError;

  const memberMap = new Map<string, BubbleRole>();
  for (const row of memberRows ?? []) {
    memberMap.set(row.bubble_id, row.role as BubbleRole);
  }

  const assignedBubbleIds = new Set<string>();
  const { data: myLuciole } = await db
    .from("lucioles")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "approved")
    .maybeSingle();

  if (myLuciole?.id) {
    const { data: assignedRows } = await db
      .from("bubble_lucioles")
      .select("bubble_id")
      .eq("luciole_id", myLuciole.id)
      .eq("status", "active");

    for (const row of assignedRows ?? []) {
      if (!memberMap.has(row.bubble_id)) {
        assignedBubbleIds.add(row.bubble_id);
      }
    }
  }

  const ids = [...memberMap.keys(), ...assignedBubbleIds];
  if (!ids.length) return [] as BubbleItem[];

  const { data: bubbles, error } = await db
    .from("bubbles")
    .select("id, name, bubble_type, has_minor, referent_user_id, cover_path, created_by, created_at, updated_at")
    .in("id", ids)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (bubbles ?? []).map((bubble: BubbleItem) => ({
    ...bubble,
    role: memberMap.get(bubble.id) ?? "luciole",
  })) as BubbleItem[];
};

export const createBubble = async (payload: {
  userId: string;
  name: string;
  bubbleType: BubbleType;
  hasMinor: boolean;
}) => {
  const { data: bubble, error } = await db
    .from("bubbles")
    .insert({
      name: payload.name.trim(),
      bubble_type: payload.bubbleType,
      has_minor: payload.hasMinor,
      referent_user_id: payload.hasMinor ? payload.userId : null,
      created_by: payload.userId,
    })
    .select("id, name, bubble_type, has_minor, referent_user_id, cover_path, created_by, created_at, updated_at")
    .single();

  if (error) throw error;

  const { error: memberError } = await db.from("bubble_members").insert({
    bubble_id: bubble.id,
    user_id: payload.userId,
    role: "owner",
    invited_by: payload.userId,
  });

  if (memberError) throw memberError;
  return bubble as BubbleItem;
};

export const fetchBubbleRole = async (bubbleId: string, userId: string) => {
  const { data, error } = await db
    .from("bubble_members")
    .select("role")
    .eq("bubble_id", bubbleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.role ?? null) as BubbleRole | null;
};

export const fetchBubble = async (bubbleId: string) => {
  const { data, error } = await db
    .from("bubbles")
    .select("id, name, bubble_type, has_minor, referent_user_id, cover_path, created_by, created_at, updated_at")
    .eq("id", bubbleId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as BubbleItem | null;
};

export const fetchBubbleMembers = async (bubbleId: string) => {
  const joined = await db
    .from("bubble_members")
    .select("bubble_id, user_id, role, invited_by, created_at, profiles(full_name,email)")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: true });

  let rows = joined.data ?? [];
  if (joined.error) {
    const fallback = await db
      .from("bubble_members")
      .select("bubble_id, user_id, role, invited_by, created_at")
      .eq("bubble_id", bubbleId)
      .order("created_at", { ascending: true });

    if (fallback.error) throw fallback.error;
    rows = fallback.data ?? [];
  }

  const members = rows as BubbleMember[];

  if (!members.length || (members[0] as any).profiles) {
    return members.map((item: any) => ({
      bubble_id: item.bubble_id,
      user_id: item.user_id,
      role: item.role,
      invited_by: item.invited_by ?? null,
      created_at: item.created_at,
      profile: item.profiles
        ? {
            full_name: item.profiles.full_name ?? null,
            email: item.profiles.email ?? null,
          }
        : undefined,
    })) as BubbleMember[];
  }

  const profileMap = await mapProfiles(members.map((item) => item.user_id));
  return members.map((item) => ({
    ...item,
    profile: profileMap.get(item.user_id),
  }));
};

export const fetchBubbleInvitations = async (bubbleId: string) => {
  const { data, error } = await db
    .from("bubble_invitations")
    .select("id, bubble_id, token, email, role, status, expires_at, created_at, accepted_by")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BubbleInvitation[];
};

export const createInvitation = async (payload: {
  bubbleId: string;
  invitedBy: string;
  email?: string;
  role: BubbleRole;
  origin: string;
}) => {
  const token = normalizeToken();

  const { data, error } = await db
    .from("bubble_invitations")
    .insert({
      bubble_id: payload.bubbleId,
      token,
      email: payload.email?.trim().toLowerCase() || null,
      role: payload.role,
      invited_by: payload.invitedBy,
      status: "pending",
    })
    .select("id, bubble_id, token, email, role, status, expires_at, created_at, accepted_by")
    .single();

  if (error) throw error;

  if (payload.email) {
    const link = `${payload.origin.replace(/\/$/, "")}/invitation/${token}`;
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: "QVT Box",
        email: "contact@qvtbox.com",
        role: "Invitation bulle",
        message: `Invitation pour rejoindre une bulle: ${link}`,
      }),
    }).catch(() => undefined);
  }

  return data as BubbleInvitation;
};

export const respondInvitation = async (token: string, decision: "accepted" | "rejected") => {
  const { data, error } = await db.rpc("respond_bubble_invitation", {
    p_token: token,
    p_decision: decision,
  });

  if (error) throw error;
  return data as string;
};

export const fetchFeed = async (bubbleId: string) => {
  const { data: posts, error: postsError } = await db
    .from("posts")
    .select("id, bubble_id, author_id, content, created_at, updated_at")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: false });

  if (postsError) throw postsError;

  const { data: comments, error: commentsError } = await db
    .from("comments")
    .select("id, post_id, bubble_id, author_id, content, created_at, updated_at")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: true });

  if (commentsError) throw commentsError;

  const authorIds = [
    ...(posts ?? []).map((item: BubblePost) => item.author_id),
    ...(comments ?? []).map((item: BubbleComment) => item.author_id),
  ];
  const profileMap = await mapProfiles([...new Set(authorIds)]);

  return {
    posts: (posts ?? []).map((post: BubblePost) => ({
      ...post,
      author: profileMap.get(post.author_id),
    })) as BubblePost[],
    comments: (comments ?? []).map((comment: BubbleComment) => ({
      ...comment,
      author: profileMap.get(comment.author_id),
    })) as BubbleComment[],
  };
};

export const createPost = async (bubbleId: string, authorId: string, content: string) => {
  const { data, error } = await db
    .from("posts")
    .insert({
      bubble_id: bubbleId,
      author_id: authorId,
      content: content.trim(),
    })
    .select("id, bubble_id, author_id, content, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as BubblePost;
};

export const createComment = async (postId: string, bubbleId: string, authorId: string, content: string) => {
  const { data, error } = await db
    .from("comments")
    .insert({
      post_id: postId,
      bubble_id: bubbleId,
      author_id: authorId,
      content: content.trim(),
    })
    .select("id, post_id, bubble_id, author_id, content, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as BubbleComment;
};

export const createReport = async (payload: {
  bubbleId: string;
  reporterId: string;
  targetType: "post" | "comment" | "user";
  targetId: string;
  reason: string;
}) => {
  const { error } = await db.from("reports").insert({
    bubble_id: payload.bubbleId,
    reporter_id: payload.reporterId,
    target_type: payload.targetType,
    target_id: payload.targetId,
    reason: payload.reason.trim(),
    status: "pending",
  });

  if (error) throw error;
};

export const fetchReports = async (bubbleId: string) => {
  const { data, error } = await db
    .from("reports")
    .select("id, bubble_id, reporter_id, target_type, target_id, reason, status, created_at, resolved_at")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BubbleReport[];
};

export const updateReportStatus = async (reportId: string, status: ReportStatus) => {
  const { error } = await db.from("reports").update({ status }).eq("id", reportId);
  if (error) throw error;
};

export const blockUser = async (blockerId: string, blockedId: string) => {
  const { error } = await db
    .from("blocks")
    .insert({ blocker_id: blockerId, blocked_id: blockedId });
  if (error && !String(error.message ?? "").toLowerCase().includes("duplicate")) {
    throw error;
  }
};

export const setReferent = async (bubbleId: string, referentUserId: string | null) => {
  const { error } = await db
    .from("bubbles")
    .update({ referent_user_id: referentUserId })
    .eq("id", bubbleId);

  if (error) throw error;
};

export const fetchApprovedLucioles = async () => {
  const { data, error } = await db
    .from("lucioles")
    .select("id, user_id, display_name, city, bio, expertise, status")
    .eq("status", "approved")
    .order("display_name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as LucioleDirectoryItem[];
};

export const fetchBubbleLucioles = async (bubbleId: string) => {
  const { data, error } = await db
    .from("bubble_lucioles")
    .select("bubble_id, luciole_id, status, created_at, lucioles(id,user_id,display_name,city,bio,expertise,status)")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    bubble_id: item.bubble_id,
    luciole_id: item.luciole_id,
    status: item.status,
    created_at: item.created_at,
    luciole: item.lucioles
      ? {
          id: item.lucioles.id,
          user_id: item.lucioles.user_id,
          display_name: item.lucioles.display_name,
          city: item.lucioles.city ?? null,
          bio: item.lucioles.bio ?? null,
          expertise: item.lucioles.expertise ?? null,
          status: item.lucioles.status,
        }
      : undefined,
  })) as BubbleLuciole[];
};

export const assignLuciole = async (bubbleId: string, lucioleId: string, userId: string) => {
  const { error } = await db
    .from("bubble_lucioles")
    .upsert({
      bubble_id: bubbleId,
      luciole_id: lucioleId,
      assigned_by: userId,
      status: "active",
    });

  if (error) throw error;
};

export const fetchBoxes = async () => {
  const { data, error } = await db
    .from("boxes")
    .select("id, slug, title, description, image_path, price_cents, cadence, is_active")
    .eq("is_active", true)
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BoxItem[];
};

export const fetchBubbleRecommendations = async (bubbleId: string) => {
  const { data, error } = await db
    .from("box_recommendations")
    .select("id, bubble_id, box_id, reason, created_at, boxes(id,slug,title,description,image_path,price_cents,cadence,is_active)")
    .eq("bubble_id", bubbleId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    id: item.id,
    bubble_id: item.bubble_id,
    box_id: item.box_id,
    reason: item.reason ?? null,
    created_at: item.created_at,
    box: item.boxes
      ? {
          id: item.boxes.id,
          slug: item.boxes.slug,
          title: item.boxes.title,
          description: item.boxes.description ?? null,
          image_path: item.boxes.image_path ?? null,
          price_cents: item.boxes.price_cents,
          cadence: item.boxes.cadence,
          is_active: item.boxes.is_active,
        }
      : undefined,
  })) as BoxRecommendation[];
};

export const createOrderStub = async (payload: {
  userId: string;
  bubbleId: string;
  box: BoxItem;
  kind: "gift" | "subscription";
  giftForEmail?: string;
}) => {
  const { error } = await db.from("orders").insert({
    user_id: payload.userId,
    status: "pending",
    currency: "eur",
    total_amount: payload.box.price_cents,
    items: [{ box_id: payload.box.id, title: payload.box.title, kind: payload.kind }],
    bubble_id: payload.bubbleId,
    box_id: payload.box.id,
    order_kind: payload.kind,
    gift_for_email: payload.giftForEmail?.trim() || null,
    subscription_interval: payload.kind === "subscription" ? "monthly" : null,
  });

  if (error) throw error;
};

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await db
    .from("notifications")
    .select("id, user_id, actor_id, bubble_id, post_id, comment_id, invitation_id, type, payload, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const notifications = (data ?? []) as NotificationItem[];
  const actorIds = [...new Set(notifications.map((item) => item.actor_id).filter(Boolean))] as string[];
  const profileMap = await mapProfiles(actorIds);

  return notifications.map((item) => ({
    ...item,
    actor: item.actor_id ? profileMap.get(item.actor_id) : undefined,
  }));
};

export const fetchUnreadNotificationsCount = async (userId: string) => {
  const { count, error } = await db
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
  return count ?? 0;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await db
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);

  if (error) throw error;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const { error } = await db
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw error;
};
