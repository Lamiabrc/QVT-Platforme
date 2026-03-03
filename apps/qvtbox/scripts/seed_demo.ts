import { createClient, type User } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "QvtboxDemo!2026";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const idFrom = (value: number) => `10000000-0000-4000-8000-${String(value).padStart(12, "0")}`;

type AccountDef = {
  key: string;
  email: string;
  fullName: string;
  segment: "enterprise" | "personal" | "luciole";
};

const CORE_ACCOUNTS: AccountDef[] = [
  { key: "alice", email: "alice.dupont.demo@qvtbox.demo", fullName: "Alice Dupont", segment: "enterprise" },
  { key: "bruno", email: "bruno.martin.demo@qvtbox.demo", fullName: "Bruno Martin", segment: "enterprise" },
  { key: "clara", email: "clara.robert.demo@qvtbox.demo", fullName: "Clara Robert", segment: "enterprise" },
  { key: "david", email: "david.leroy.demo@qvtbox.demo", fullName: "David Leroy", segment: "enterprise" },
  { key: "emma", email: "emma.moreau.demo@qvtbox.demo", fullName: "Emma Moreau", segment: "enterprise" },
  { key: "fanny", email: "fanny.petit.demo@qvtbox.demo", fullName: "Fanny Petit", segment: "personal" },
  { key: "gauthier", email: "gauthier.renaud.demo@qvtbox.demo", fullName: "Gauthier Renaud", segment: "personal" },
  { key: "helene", email: "helene.briand.demo@qvtbox.demo", fullName: "Helene Briand", segment: "personal" },
  { key: "ismael", email: "ismael.caron.demo@qvtbox.demo", fullName: "Ismael Caron", segment: "personal" },
  { key: "julie", email: "julie.noel.demo@qvtbox.demo", fullName: "Julie Noel", segment: "personal" },
];

const LUCIOLE_ACCOUNTS: AccountDef[] = [
  { key: "luciole_a", email: "luciole.a.demo@qvtbox.demo", fullName: "Luciole Aurore", segment: "luciole" },
  { key: "luciole_b", email: "luciole.b.demo@qvtbox.demo", fullName: "Luciole Bastien", segment: "luciole" },
  { key: "luciole_c", email: "luciole.c.demo@qvtbox.demo", fullName: "Luciole Celeste", segment: "luciole" },
  { key: "luciole_d", email: "luciole.d.demo@qvtbox.demo", fullName: "Luciole Diane", segment: "luciole" },
  { key: "luciole_e", email: "luciole.e.demo@qvtbox.demo", fullName: "Luciole Enzo", segment: "luciole" },
];

const ALL_ACCOUNTS = [...CORE_ACCOUNTS, ...LUCIOLE_ACCOUNTS];

const ENTERPRISES = [
  { id: idFrom(1), name: "Novalya Industrie", enterprise_code: "NOVALYA", ownerKey: "alice" },
  { id: idFrom(2), name: "HelioCare Services", enterprise_code: "HELIOCARE", ownerKey: "david" },
];

const BUBBLES = [
  {
    id: idFrom(101),
    name: "Cellule Opérations Novalya",
    bubble_type: "enterprise",
    enterprise: idFrom(1),
    has_minor: false,
    cover_path: "/covers/cover-1.svg",
    createdBy: "alice",
    referent: null,
  },
  {
    id: idFrom(102),
    name: "Equipe Support Novalya",
    bubble_type: "enterprise",
    enterprise: idFrom(1),
    has_minor: false,
    cover_path: "/covers/cover-2.svg",
    createdBy: "alice",
    referent: null,
  },
  {
    id: idFrom(103),
    name: "Cellule RH HelioCare",
    bubble_type: "enterprise",
    enterprise: idFrom(2),
    has_minor: false,
    cover_path: "/covers/cover-3.svg",
    createdBy: "david",
    referent: null,
  },
  {
    id: idFrom(104),
    name: "Famille Petit-Renaud",
    bubble_type: "personal",
    enterprise: null,
    has_minor: true,
    cover_path: "/covers/cover-4.svg",
    createdBy: "fanny",
    referent: "helene",
  },
  {
    id: idFrom(105),
    name: "Proches Caron-Noel",
    bubble_type: "personal",
    enterprise: null,
    has_minor: false,
    cover_path: "/covers/cover-5.svg",
    createdBy: "ismael",
    referent: "julie",
  },
];

const BUBBLE_MEMBER_MATRIX: Array<{ bubbleId: string; userKey: string; role: string; id: string }> = [
  { bubbleId: idFrom(101), userKey: "alice", role: "owner", id: idFrom(201) },
  { bubbleId: idFrom(101), userKey: "bruno", role: "admin", id: idFrom(202) },
  { bubbleId: idFrom(101), userKey: "clara", role: "member", id: idFrom(203) },
  { bubbleId: idFrom(102), userKey: "alice", role: "owner", id: idFrom(204) },
  { bubbleId: idFrom(102), userKey: "bruno", role: "member", id: idFrom(205) },
  { bubbleId: idFrom(102), userKey: "david", role: "admin", id: idFrom(206) },
  { bubbleId: idFrom(103), userKey: "david", role: "owner", id: idFrom(207) },
  { bubbleId: idFrom(103), userKey: "emma", role: "admin", id: idFrom(208) },
  { bubbleId: idFrom(103), userKey: "clara", role: "member", id: idFrom(209) },
  { bubbleId: idFrom(104), userKey: "fanny", role: "owner", id: idFrom(210) },
  { bubbleId: idFrom(104), userKey: "helene", role: "referent", id: idFrom(211) },
  { bubbleId: idFrom(104), userKey: "gauthier", role: "member", id: idFrom(212) },
  { bubbleId: idFrom(105), userKey: "ismael", role: "owner", id: idFrom(213) },
  { bubbleId: idFrom(105), userKey: "julie", role: "referent", id: idFrom(214) },
];

const BOXES = [
  { id: idFrom(301), slug: "box-apaisement", title: "Box Apaisement", price_cents: 4500, image_path: "/images/box-parent.jpg" },
  { id: idFrom(302), slug: "box-focus", title: "Box Focus Equipe", price_cents: 5200, image_path: "/images/box-salarie.jpg" },
  { id: idFrom(303), slug: "box-cohesion", title: "Box Cohesion", price_cents: 5600, image_path: "/images/box-salarie.jpg" },
  { id: idFrom(304), slug: "box-ado", title: "Box Ado Soutien", price_cents: 4300, image_path: "/images/box-ado.jpg" },
  { id: idFrom(305), slug: "box-resilience", title: "Box Resilience", price_cents: 5900, image_path: "/images/box-senior.jpg" },
  { id: idFrom(306), slug: "box-manager", title: "Box Manager", price_cents: 6100, image_path: "/images/box-senior.jpg" },
];

const BOX_RECOMMENDATIONS = [
  { id: idFrom(401), bubble_id: idFrom(101), box_id: idFrom(302), reason: "Renforcer la concentration collective", by: "alice" },
  { id: idFrom(402), bubble_id: idFrom(102), box_id: idFrom(303), reason: "Soutenir la cohésion support", by: "alice" },
  { id: idFrom(403), bubble_id: idFrom(103), box_id: idFrom(306), reason: "Accompagnement managers RH", by: "david" },
  { id: idFrom(404), bubble_id: idFrom(104), box_id: idFrom(304), reason: "Soutien adolescent et repères", by: "fanny" },
  { id: idFrom(405), bubble_id: idFrom(104), box_id: idFrom(301), reason: "Moments d'apaisement familial", by: "fanny" },
  { id: idFrom(406), bubble_id: idFrom(105), box_id: idFrom(305), reason: "Traverser les périodes sensibles", by: "ismael" },
];

const INVITATIONS = [
  { id: idFrom(501), bubble_id: idFrom(101), token: "QVTDEMOOPS0001", email: "invite.ops.demo@qvtbox.demo", role: "member", invited_by: "alice" },
  { id: idFrom(502), bubble_id: idFrom(103), token: "QVTDEMORH00002", email: "invite.rh.demo@qvtbox.demo", role: "member", invited_by: "david" },
  { id: idFrom(503), bubble_id: idFrom(104), token: "QVTDEMOFAM0003", email: null, role: "member", invited_by: "fanny" },
  { id: idFrom(504), bubble_id: idFrom(105), token: "QVTDEMOPRO0004", email: null, role: "referent", invited_by: "ismael" },
];

function requireUser(usersByKey: Map<string, User>, key: string): User {
  const user = usersByKey.get(key);
  if (!user) {
    throw new Error(`Missing seeded auth user for key: ${key}`);
  }
  return user;
}

async function listAllUsers(): Promise<User[]> {
  const users: User[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const current = data.users ?? [];
    users.push(...current);
    if (current.length < perPage) break;
    page += 1;
  }
  return users;
}

async function ensureAuthUser(account: AccountDef, cache: Map<string, User>): Promise<User> {
  if (cache.has(account.email)) return cache.get(account.email);

  const existing = (await listAllUsers()).find(
    (item) => item.email?.toLowerCase() === account.email.toLowerCase()
  );

  if (existing) {
    cache.set(account.email, existing);
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: account.fullName, demo_mode: true },
  });

  if (error) throw error;
  const created = data.user;
  if (!created) {
    throw new Error(`Supabase createUser returned no user for ${account.email}`);
  }
  cache.set(account.email, created);
  return created;
}

async function main() {
  console.warn("Seeding QVT Box demo...");
  const userCache = new Map<string, User>();
  const usersByKey = new Map<string, User>();

  for (const account of ALL_ACCOUNTS) {
    const user = await ensureAuthUser(account, userCache);
    usersByKey.set(account.key, user);
  }

  const profilesRows = ALL_ACCOUNTS.map((account) => {
    const user = usersByKey.get(account.key);
    return {
      id: user.id,
      email: account.email,
      full_name: account.fullName,
      role: "user",
      account_type:
        account.segment === "enterprise"
          ? "abonne_salarie"
          : "particulier_travailleur",
    };
  });

  const { error: profilesError } = await supabase
    .from("profiles")
    .upsert(profilesRows, { onConflict: "id" });
  if (profilesError) throw profilesError;

  const enterpriseRows = ENTERPRISES.map((enterprise) => ({
    id: enterprise.id,
    name: enterprise.name,
    enterprise_code: enterprise.enterprise_code,
    created_by: usersByKey.get(enterprise.ownerKey).id,
  }));

  const { error: enterpriseError } = await supabase
    .from("enterprises")
    .upsert(enterpriseRows, { onConflict: "id" });
  if (enterpriseError) throw enterpriseError;

  const enterpriseMembers = [
    { id: idFrom(601), enterprise_id: idFrom(1), user_id: requireUser(usersByKey, "alice").id, role: "admin", is_approved: true },
    { id: idFrom(602), enterprise_id: idFrom(1), user_id: requireUser(usersByKey, "bruno").id, role: "employee", is_approved: true },
    { id: idFrom(603), enterprise_id: idFrom(1), user_id: requireUser(usersByKey, "clara").id, role: "manager", is_approved: true },
    { id: idFrom(604), enterprise_id: idFrom(2), user_id: requireUser(usersByKey, "david").id, role: "admin", is_approved: true },
    { id: idFrom(605), enterprise_id: idFrom(2), user_id: requireUser(usersByKey, "emma").id, role: "hr", is_approved: true },
  ];

  const { error: enterpriseMembersError } = await supabase
    .from("enterprise_members")
    .upsert(enterpriseMembers, { onConflict: "id" });
  if (enterpriseMembersError) throw enterpriseMembersError;

  const bubbleRows = BUBBLES.map((bubble) => ({
    id: bubble.id,
    name: bubble.name,
    bubble_type: bubble.bubble_type,
    enterprise_id: bubble.enterprise,
    has_minor: bubble.has_minor,
    referent_user_id: bubble.referent ? requireUser(usersByKey, bubble.referent).id : null,
    cover_path: bubble.cover_path,
    created_by: requireUser(usersByKey, bubble.createdBy).id,
  }));

  const { error: bubblesError } = await supabase
    .from("bubbles")
    .upsert(bubbleRows, { onConflict: "id" });
  if (bubblesError) throw bubblesError;

  const bubbleMembers = BUBBLE_MEMBER_MATRIX.map((member) => ({
    bubble_id: member.bubbleId,
    user_id: requireUser(usersByKey, member.userKey).id,
    role: member.role,
    invited_by: requireUser(usersByKey, member.userKey).id,
  }));

  const { error: bubbleMembersError } = await supabase
    .from("bubble_members")
    .upsert(bubbleMembers, { onConflict: "bubble_id,user_id" });
  if (bubbleMembersError) throw bubbleMembersError;

  const invitationRows = INVITATIONS.map((invitation) => ({
    id: invitation.id,
    bubble_id: invitation.bubble_id,
    token: invitation.token,
    email: invitation.email,
    role: invitation.role,
    invited_by: requireUser(usersByKey, invitation.invited_by).id,
    status: "pending",
  }));

  const { error: invitationError } = await supabase
    .from("bubble_invitations")
    .upsert(invitationRows, { onConflict: "id" });
  if (invitationError) throw invitationError;

  const lucioleRows = [
    {
      id: idFrom(701),
      user_id: requireUser(usersByKey, "luciole_a").id,
      display_name: "Aurore Claire",
      city: "Lille",
      bio: "Accompagnement parental et équilibre quotidien.",
      expertise: ["famille", "stress", "communication"],
      status: "approved",
      hourly_rate_cents: 4500,
    },
    {
      id: idFrom(702),
      user_id: requireUser(usersByKey, "luciole_b").id,
      display_name: "Bastien Rivet",
      city: "Lyon",
      bio: "Soutien des proches aidants.",
      expertise: ["aidance", "adolescents"],
      status: "approved",
      hourly_rate_cents: 5000,
    },
    {
      id: idFrom(703),
      user_id: requireUser(usersByKey, "luciole_c").id,
      display_name: "Celeste Nova",
      city: "Nantes",
      bio: "Cadre entreprise et prévention RPS.",
      expertise: ["entreprise", "manager"],
      status: "approved",
      hourly_rate_cents: 5500,
    },
    {
      id: idFrom(704),
      user_id: requireUser(usersByKey, "luciole_d").id,
      display_name: "Diane Solis",
      city: "Bordeaux",
      bio: "Candidate en cours d'évaluation.",
      expertise: ["famille"],
      status: "pending",
      hourly_rate_cents: 4000,
    },
    {
      id: idFrom(705),
      user_id: requireUser(usersByKey, "luciole_e").id,
      display_name: "Enzo Marin",
      city: "Toulouse",
      bio: "Candidate en cours d'évaluation.",
      expertise: ["cohesion"],
      status: "pending",
      hourly_rate_cents: 3900,
    },
  ];

  const { error: lucioleError } = await supabase
    .from("lucioles")
    .upsert(lucioleRows, { onConflict: "id" });
  if (lucioleError) throw lucioleError;

  const lucioleApplications = [
    {
      id: idFrom(706),
      user_id: requireUser(usersByKey, "luciole_d").id,
      full_name: "Diane Solis",
      city: "Bordeaux",
      motivation: "Accompagner les familles en difficulté.",
      experience: "5 ans en médiation familiale",
      availability: "Soirs et week-end",
      charter_accepted: true,
      status: "pending",
    },
    {
      id: idFrom(707),
      user_id: requireUser(usersByKey, "luciole_e").id,
      full_name: "Enzo Marin",
      city: "Toulouse",
      motivation: "Créer des espaces de parole sécurisés.",
      experience: "Coach de vie 3 ans",
      availability: "Temps partiel",
      charter_accepted: true,
      status: "pending",
    },
  ];

  const { error: applicationsError } = await supabase
    .from("luciole_applications")
    .upsert(lucioleApplications, { onConflict: "id" });
  if (applicationsError) throw applicationsError;

  const bubbleLucioles = [
    { bubble_id: idFrom(104), luciole_id: idFrom(701), assigned_by: requireUser(usersByKey, "fanny").id, status: "active" },
    { bubble_id: idFrom(105), luciole_id: idFrom(702), assigned_by: requireUser(usersByKey, "ismael").id, status: "active" },
    { bubble_id: idFrom(103), luciole_id: idFrom(703), assigned_by: requireUser(usersByKey, "david").id, status: "active" },
  ];

  const { error: bubbleLuciolesError } = await supabase
    .from("bubble_lucioles")
    .upsert(bubbleLucioles, { onConflict: "bubble_id,luciole_id" });
  if (bubbleLuciolesError) throw bubbleLuciolesError;

  const boxRows = BOXES.map((box) => ({
    ...box,
    description: "Box démo QVT Box pour le mode social.",
    cadence: box.slug === "box-senior" ? "monthly" : "one_shot",
    is_active: true,
  }));

  const { error: boxError } = await supabase
    .from("boxes")
    .upsert(boxRows, { onConflict: "id" });
  if (boxError) throw boxError;

  const recommendationRows = BOX_RECOMMENDATIONS.map((item) => ({
    id: item.id,
    bubble_id: item.bubble_id,
    box_id: item.box_id,
    reason: item.reason,
    created_by: requireUser(usersByKey, item.by).id,
  }));

  const { error: recommendationError } = await supabase
    .from("box_recommendations")
    .upsert(recommendationRows, { onConflict: "id" });
  if (recommendationError) throw recommendationError;

  const bubbleMemberByBubble = new Map<string, string[]>();
  for (const row of bubbleMembers) {
    const bucket = bubbleMemberByBubble.get(row.bubble_id) ?? [];
    bucket.push(row.user_id);
    bubbleMemberByBubble.set(row.bubble_id, bucket);
  }

  const postTemplates = [
    "Point météo de la bulle: comment allez-vous aujourd'hui ?",
    "Petit check-in: une victoire de la semaine ?",
    "On garde le cadre: partage choisi et respect mutuel.",
    "Besoin d'aide ponctuelle, je suis preneur d'un retour.",
    "Rappel bienveillance: on prend soin des mots.",
  ];

  const postRows = Array.from({ length: 30 }).map((_, index) => {
    const bubble = BUBBLES[index % BUBBLES.length];
    const members = bubbleMemberByBubble.get(bubble.id) ?? [];
    const authorId = members[index % members.length];
    return {
      id: idFrom(800 + index),
      bubble_id: bubble.id,
      author_id: authorId,
      content: `${postTemplates[index % postTemplates.length]} (#${index + 1})`,
    };
  });

  const { error: postError } = await supabase
    .from("posts")
    .upsert(postRows, { onConflict: "id" });
  if (postError) throw postError;

  const commentTemplates = [
    "Merci pour le partage.",
    "Je confirme, on avance ensemble.",
    "On peut en parler en privé dans la bulle.",
    "Bien reçu, je suis disponible.",
    "Prenons un temps calme ce soir.",
  ];

  const commentRows = Array.from({ length: 60 }).map((_, index) => {
    const post = postRows[index % postRows.length];
    const members = bubbleMemberByBubble.get(post.bubble_id) ?? [];
    const authorId = members[(index + 1) % members.length];
    return {
      id: idFrom(900 + index),
      post_id: post.id,
      bubble_id: post.bubble_id,
      author_id: authorId,
      content: `${commentTemplates[index % commentTemplates.length]} (c${index + 1})`,
    };
  });

  const { error: commentError } = await supabase
    .from("comments")
    .upsert(commentRows, { onConflict: "id" });
  if (commentError) throw commentError;

  const reportRows = [
    {
      id: idFrom(970),
      bubble_id: idFrom(104),
      reporter_id: requireUser(usersByKey, "gauthier").id,
      target_type: "post",
      target_id: postRows[3].id,
      reason: "Message anxiogène, besoin de modération.",
      status: "pending",
    },
    {
      id: idFrom(971),
      bubble_id: idFrom(103),
      reporter_id: requireUser(usersByKey, "emma").id,
      target_type: "comment",
      target_id: commentRows[10].id,
      reason: "Ton inadapté pour une bulle professionnelle.",
      status: "reviewed",
    },
  ];

  const { error: reportError } = await supabase
    .from("reports")
    .upsert(reportRows, { onConflict: "id" });
  if (reportError) throw reportError;

  const notificationRows = Array.from({ length: 10 }).map((_, index) => {
    const target = CORE_ACCOUNTS[index % CORE_ACCOUNTS.length];
    const actor = CORE_ACCOUNTS[(index + 1) % CORE_ACCOUNTS.length];
    return {
      id: idFrom(980 + index),
      user_id: requireUser(usersByKey, target.key).id,
      actor_id: requireUser(usersByKey, actor.key).id,
      bubble_id: BUBBLES[index % BUBBLES.length].id,
      type: ["invitation", "new_post", "reply", "help_request"][index % 4],
      payload: { demo: true, index: index + 1 },
      read_at: index % 3 === 0 ? new Date().toISOString() : null,
    };
  });

  const { error: notificationError } = await supabase
    .from("notifications")
    .upsert(notificationRows, { onConflict: "id" });
  if (notificationError) throw notificationError;

  console.warn("Seed complete.");
  console.warn(`Demo password: ${DEMO_PASSWORD}`);
  console.warn("Core profiles:");
  for (const account of CORE_ACCOUNTS) {
    console.warn(`- ${account.email}`);
  }
  console.warn("Lucioles:");
  for (const account of LUCIOLE_ACCOUNTS) {
    console.warn(`- ${account.email}`);
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
