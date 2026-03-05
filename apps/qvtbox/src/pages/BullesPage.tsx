import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Minus, Plus, Sparkles } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BubbleCover from "@/components/social/BubbleCover";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { createBubble, fetchMyBubbles } from "@/lib/social";
import type { BubbleItem, BubbleType } from "@/lib/social";

const roleLabel = (role?: string) => {
  if (role === "owner") return "Proprietaire";
  if (role === "admin") return "Administrateur";
  if (role === "referent") return "Referent";
  if (role === "luciole") return "Luciole";
  return "Membre";
};

type BubbleTemplate = {
  id: string;
  label: string;
  name: string;
  type: BubbleType;
  hasMinorDefault?: boolean;
};

const PERSONAL_TEMPLATES: BubbleTemplate[] = [
  { id: "solo", label: "Solo", name: "Ma bulle solo", type: "personal" },
  { id: "duo", label: "Duo", name: "Notre bulle duo", type: "personal" },
  { id: "family", label: "Famille", name: "Bulle famille", type: "personal" },
  { id: "extended", label: "Famille elargie", name: "Bulle famille elargie", type: "personal" },
  { id: "tutelle", label: "Tutelle", name: "Bulle tutelle", type: "personal", hasMinorDefault: true },
  { id: "proches", label: "Proches", name: "Bulle proches", type: "personal" },
];

const ENTERPRISE_TEMPLATES: BubbleTemplate[] = [
  { id: "solo_pro", label: "Solo pro", name: "Ma bulle pro", type: "enterprise" },
  { id: "team", label: "Equipe", name: "Bulle equipe", type: "enterprise" },
  { id: "dept", label: "Departement", name: "Bulle departement", type: "enterprise" },
  { id: "unit", label: "Unite", name: "Bulle unite", type: "enterprise" },
  { id: "company", label: "Societe", name: "Bulle entreprise", type: "enterprise" },
];

type UniverseBubbleType = BubbleType | "family" | "support" | "inspiration";

type UniverseNode = {
  id: string;
  label: string;
  subtitle: string;
  type: UniverseBubbleType;
  x: number;
  y: number;
  size: number;
  source: "theme" | "owned" | "center";
  route?: string;
  bubbleId?: string;
  templateId?: string;
};

type UniverseEdge = {
  from: string;
  to: string;
};

const THEME_NODES: UniverseNode[] = [
  {
    id: "wellbeing-work",
    label: "Bien-etre au travail",
    subtitle: "communaute",
    type: "enterprise",
    x: 18,
    y: 23,
    size: 134,
    source: "theme",
    route: "/entreprise",
  },
  {
    id: "parents",
    label: "Parents",
    subtitle: "bulle famille",
    type: "family",
    x: 31,
    y: 72,
    size: 122,
    source: "theme",
    route: "/famille",
  },
  {
    id: "adolescents",
    label: "Adolescents",
    subtitle: "espace ado",
    type: "family",
    x: 73,
    y: 20,
    size: 124,
    source: "theme",
    route: "/ado",
  },
  {
    id: "lucioles",
    label: "Lucioles",
    subtitle: "mentors",
    type: "support",
    x: 82,
    y: 66,
    size: 128,
    source: "theme",
    route: "/lucioles",
  },
  {
    id: "entraide",
    label: "Entraide",
    subtitle: "support",
    type: "support",
    x: 12,
    y: 55,
    size: 112,
    source: "theme",
    templateId: "proches",
  },
  {
    id: "cohesion",
    label: "Cohesion entreprise",
    subtitle: "collectif",
    type: "enterprise",
    x: 62,
    y: 80,
    size: 112,
    source: "theme",
    templateId: "team",
  },
  {
    id: "inspiration",
    label: "Inspiration",
    subtitle: "ressources",
    type: "inspiration",
    x: 90,
    y: 40,
    size: 106,
    source: "theme",
    route: "/box",
  },
  {
    id: "mental",
    label: "Sante mentale",
    subtitle: "cadre bienveillant",
    type: "support",
    x: 45,
    y: 12,
    size: 114,
    source: "theme",
    templateId: "solo",
  },
  {
    id: "challenges",
    label: "Defis bien-etre",
    subtitle: "actions",
    type: "inspiration",
    x: 52,
    y: 89,
    size: 108,
    source: "theme",
    route: "/simulateur",
  },
];

const TYPE_CLASSES: Record<UniverseBubbleType, string> = {
  personal:
    "from-[#D5EEFF]/85 via-[#BCE4FF]/65 to-[#FFFFFF]/65 border-[#D0E8FF] text-[#16324B]",
  family:
    "from-[#E4E0FF]/80 via-[#D8F3F5]/65 to-[#FFFFFF]/70 border-[#D8D2FF] text-[#2E2A58]",
  enterprise:
    "from-[#D8FFF2]/85 via-[#C4F0E2]/65 to-[#FFFFFF]/70 border-[#BEE7D7] text-[#1F4A3E]",
  support:
    "from-[#FFF0D9]/85 via-[#FFE6C9]/65 to-[#FFFFFF]/70 border-[#F3DDC0] text-[#5B3D20]",
  inspiration:
    "from-[#E7F7FF]/80 via-[#E4E8FF]/60 to-[#FFFFFF]/70 border-[#D1DFFF] text-[#2D3C64]",
};

const bubbleTypeLabel = (type: UniverseBubbleType) => {
  if (type === "family") return "family";
  if (type === "support") return "support";
  if (type === "inspiration") return "inspiration";
  return type;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const buildOwnedNodes = (rows: BubbleItem[]): UniverseNode[] => {
  const visible = rows.slice(0, 9);
  const total = Math.max(visible.length, 1);

  return visible.map((bubble, index) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = total > 5 ? 36 : 31;
    const x = clamp(50 + Math.cos(angle) * radius, 8, 92);
    const y = clamp(50 + Math.sin(angle) * radius, 8, 92);

    return {
      id: `owned-${bubble.id}`,
      label: bubble.name,
      subtitle: bubble.bubble_type === "enterprise" ? "bulle entreprise" : "bulle perso",
      type: bubble.bubble_type,
      x,
      y,
      size: 90,
      source: "owned",
      bubbleId: bubble.id,
    } satisfies UniverseNode;
  });
};

export default function BullesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [name, setName] = useState("");
  const [bubbleType, setBubbleType] = useState<BubbleType>("personal");
  const [hasMinor, setHasMinor] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState("my-bubble");

  const templateById = useMemo(
    () =>
      new Map<string, BubbleTemplate>(
        [...PERSONAL_TEMPLATES, ...ENTERPRISE_TEMPLATES].map((template) => [template.id, template])
      ),
    []
  );

  const sorted = useMemo(
    () =>
      [...bubbles].sort(
        (a, b) =>
          new Date((b.updated_at ?? b.created_at) as string).getTime() -
          new Date((a.updated_at ?? a.created_at) as string).getTime()
      ),
    [bubbles]
  );

  const ownedNodes = useMemo(() => buildOwnedNodes(sorted), [sorted]);

  const universeNodes = useMemo(() => {
    const center: UniverseNode = {
      id: "my-bubble",
      label: "Ma bulle",
      subtitle: "hub personnel",
      type: "personal",
      x: 50,
      y: 50,
      size: 156,
      source: "center",
      route: "/dashboard",
    };

    return [center, ...THEME_NODES, ...ownedNodes];
  }, [ownedNodes]);

  const nodeMap = useMemo(() => new Map(universeNodes.map((node) => [node.id, node])), [universeNodes]);

  const universeEdges = useMemo(() => {
    const edges: UniverseEdge[] = [];
    for (const node of [...THEME_NODES, ...ownedNodes]) {
      edges.push({ from: "my-bubble", to: node.id });
    }

    const chained = ["parents", "adolescents", "lucioles", "cohesion", "wellbeing-work"];
    for (let index = 0; index < chained.length - 1; index += 1) {
      edges.push({ from: chained[index], to: chained[index + 1] });
    }

    return edges;
  }, [ownedNodes]);

  const selectedNode = nodeMap.get(selectedNodeId) ?? universeNodes[0];

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchMyBubbles(user.id);
      setBubbles(data);
    } catch (error: any) {
      toast({
        title: "Impossible de charger vos bulles",
        description: error?.message ?? "Reessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const applyTemplate = (template: BubbleTemplate) => {
    setBubbleType(template.type);
    setName(template.name);
    setHasMinor(Boolean(template.hasMinorDefault));
    setShowCreate(true);
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id) return;

    if (!name.trim()) {
      toast({
        title: "Nom requis",
        description: "Ajoutez un nom de bulle.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const created = await createBubble({
        userId: user.id,
        name,
        bubbleType,
        hasMinor: bubbleType === "personal" ? hasMinor : false,
      });

      toast({
        title: "Bulle creee",
        description: "Votre bulle est prete. Vous pouvez inviter des membres.",
      });

      setName("");
      setBubbleType("personal");
      setHasMinor(false);
      setShowCreate(false);

      await load();
      navigate(`/bulle/${created.id}`);
    } catch (error: any) {
      toast({
        title: "Creation impossible",
        description: error?.message ?? "Reessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openNode = (node: UniverseNode) => {
    setSelectedNodeId(node.id);

    if (node.bubbleId) {
      navigate(`/bulle/${node.bubbleId}`);
      return;
    }

    if (node.route) {
      navigate(node.route);
      return;
    }

    if (node.templateId) {
      const template = templateById.get(node.templateId);
      if (template) {
        applyTemplate(template);
        return;
      }
    }

    toast({
      title: "Bulle de demonstration",
      description: "Cette bulle vous aide a creer votre propre espace.",
    });
  };

  const zoomIn = () => setZoom((value) => clamp(Number((value + 0.14).toFixed(2)), 0.66, 1.42));
  const zoomOut = () => setZoom((value) => clamp(Number((value - 0.14).toFixed(2)), 0.66, 1.42));
  const resetZoom = () => setZoom(1);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.deltaY < 0) zoomIn();
    if (event.deltaY > 0) zoomOut();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#EAF7FF_0%,#F8F6FF_35%,#F4FAF9_65%,#FAF6EE_100%)] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#7C84B2]">Univers des Bulles</p>
              <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Naviguez dans l'univers ZENA</h1>
              <p className="mt-3 max-w-3xl text-sm text-[#586176] md:text-base">
                Zoomez, dezoomez, puis entrez dans une bulle. Chaque bulle est une communaute de confiance
                pour partager, demander de l'aide, et avancer ensemble.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-[#D8DEF0] bg-white/80 px-3 py-2 backdrop-blur">
              <button
                type="button"
                onClick={zoomOut}
                className="rounded-xl border border-[#D8DEF0] bg-white px-3 py-2 text-xs font-semibold text-[#2F3A57]"
                aria-label="Zoom out"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="min-w-14 text-center text-xs font-semibold text-[#425174]">{Math.round(zoom * 100)}%</div>
              <button
                type="button"
                onClick={zoomIn}
                className="rounded-xl border border-[#D8DEF0] bg-white px-3 py-2 text-xs font-semibold text-[#2F3A57]"
                aria-label="Zoom in"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="rounded-xl border border-[#D8DEF0] bg-white px-3 py-2 text-xs font-semibold text-[#2F3A57]"
              >
                Reset
              </button>
            </div>
          </div>

          <section className="mt-6 rounded-[36px] border border-[#D8DEF0] bg-white/65 p-4 shadow-[0_30px_80px_rgba(72,104,183,0.15)] backdrop-blur">
            <div
              className="relative h-[560px] w-full overflow-hidden rounded-[28px] border border-white/50 bg-[radial-gradient(circle_at_20%_20%,rgba(143,214,255,0.35),rgba(221,228,255,0.16)_40%,rgba(255,255,255,0.22)_75%),linear-gradient(145deg,rgba(249,252,255,0.8),rgba(236,248,244,0.8))]"
              onWheel={handleWheel}
            >
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#BEEBFF]/35 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#E7DFFF]/35 blur-3xl" />
              <div className="pointer-events-none absolute left-1/3 top-1/4 h-56 w-56 rounded-full bg-[#D5FFF0]/25 blur-3xl" />

              <motion.div
                className="absolute inset-0 origin-center"
                animate={{ scale: zoom }}
                transition={{ type: "spring", stiffness: 130, damping: 18, mass: 0.9 }}
              >
                <svg className="absolute inset-0 h-full w-full">
                  {universeEdges.map((edge) => {
                    const from = nodeMap.get(edge.from);
                    const to = nodeMap.get(edge.to);
                    if (!from || !to) return null;
                    return (
                      <line
                        key={`${edge.from}-${edge.to}`}
                        x1={`${from.x}%`}
                        y1={`${from.y}%`}
                        x2={`${to.x}%`}
                        y2={`${to.y}%`}
                        stroke="rgba(106,129,190,0.34)"
                        strokeWidth={1.3}
                        strokeDasharray="4 6"
                      />
                    );
                  })}
                </svg>

                {universeNodes.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  const isCenter = node.source === "center";
                  const isOwned = node.source === "owned";

                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      onMouseEnter={() => setSelectedNodeId(node.id)}
                      onFocus={() => setSelectedNodeId(node.id)}
                      onClick={() => openNode(node)}
                      className={[
                        "group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-center shadow-[0_20px_60px_rgba(65,84,122,0.2)] backdrop-blur-xl transition",
                        "bg-gradient-to-br",
                        TYPE_CLASSES[node.type],
                        isSelected ? "ring-4 ring-[#D9E8FF]" : "",
                        isCenter ? "border-2" : "border",
                        isOwned ? "border-[#8FC9BE]" : "",
                      ].join(" ")}
                      style={{ left: `${node.x}%`, top: `${node.y}%`, width: node.size, height: node.size }}
                      initial={{ opacity: 0, scale: 0.86 }}
                      animate={{
                        opacity: 1,
                        scale: isSelected ? 1.06 : 1,
                        y: [0, -6, 0],
                      }}
                      transition={{
                        opacity: { duration: 0.35, delay: index * 0.03 },
                        scale: { duration: 0.18 },
                        y: { duration: 6.4 + (index % 5), repeat: Infinity, ease: "easeInOut" },
                      }}
                    >
                      <span className="absolute inset-[10%] rounded-full border border-white/40" />
                      <span className="absolute inset-0 flex flex-col items-center justify-center px-3">
                        <span
                          className={[
                            "line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.12em]",
                            isCenter ? "text-xs" : "",
                          ].join(" ")}
                        >
                          {node.label}
                        </span>
                        <span className="mt-1 text-[10px] font-medium opacity-70">{node.subtitle}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr,auto]">
              <div className="rounded-2xl border border-[#D8DEF0] bg-white/80 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#6D739E]">Bulle selectionnee</p>
                <p className="mt-1 text-base font-semibold text-[#23304A]">{selectedNode.label}</p>
                <p className="mt-1 text-xs text-[#5B6781]">
                  Type: {bubbleTypeLabel(selectedNode.type)} · Source:{" "}
                  {selectedNode.source === "owned" ? "mes bulles" : selectedNode.source === "center" ? "hub" : "theme"}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#D8DEF0] bg-white/80 px-3 py-2">
                <Sparkles className="h-4 w-4 text-[#5674C1]" />
                <p className="text-xs text-[#4C5A79]">
                  Slogan: <strong>"Sortez de votre bulle, on veille sur vous."</strong>
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-3xl border border-[#D8DEF0] bg-white/85 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#7A84AD]">Creation rapide</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#23304A]">Creer une nouvelle bulle</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreate((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#23304A] px-4 py-2 text-xs font-semibold text-white"
                >
                  <Compass className="h-4 w-4" />
                  {showCreate ? "Fermer" : "Nouveau"}
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {PERSONAL_TEMPLATES.slice(0, 3).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="rounded-2xl border border-[#D8DEF0] bg-[#F7FBFF] px-4 py-3 text-left transition hover:border-[#AFC8F1]"
                  >
                    <div className="text-sm font-semibold text-[#2D3C64]">{template.label}</div>
                    <div className="mt-1 text-xs text-[#617093]">vie perso</div>
                  </button>
                ))}
                {ENTERPRISE_TEMPLATES.slice(0, 3).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="rounded-2xl border border-[#D8DEF0] bg-[#F7FBFF] px-4 py-3 text-left transition hover:border-[#AFC8F1]"
                  >
                    <div className="text-sm font-semibold text-[#2D3C64]">{template.label}</div>
                    <div className="mt-1 text-xs text-[#617093]">entreprise</div>
                  </button>
                ))}
              </div>

              {showCreate ? (
                <form
                  onSubmit={handleCreate}
                  className="mt-4 grid gap-3 rounded-2xl border border-[#D8DEF0] bg-[#FCFEFF] p-4 md:grid-cols-[1.6fr,1fr,auto]"
                >
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nom de la bulle"
                    autoFocus
                    className="rounded-2xl border border-[#D8DEF0] px-4 py-3 text-sm outline-none focus:border-[#8AAEE2]"
                  />

                  <div className="flex gap-2 rounded-2xl border border-[#D8DEF0] bg-white p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setBubbleType("personal");
                        setHasMinor(false);
                      }}
                      className={[
                        "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
                        bubbleType === "personal"
                          ? "bg-[#23304A] text-white"
                          : "text-[#5A6581] hover:bg-[#EEF4FF]",
                      ].join(" ")}
                    >
                      Perso
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBubbleType("enterprise");
                        setHasMinor(false);
                      }}
                      className={[
                        "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition",
                        bubbleType === "enterprise"
                          ? "bg-[#23304A] text-white"
                          : "text-[#5A6581] hover:bg-[#EEF4FF]",
                      ].join(" ")}
                    >
                      Entreprise
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-2xl bg-[#23304A] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "Creation..." : "Valider"}
                  </button>

                  <label className="md:col-span-3 flex items-center gap-2 text-sm text-[#55647F]">
                    <input
                      type="checkbox"
                      checked={hasMinor}
                      disabled={bubbleType === "enterprise"}
                      onChange={(event) => setHasMinor(event.target.checked)}
                    />
                    <span>
                      Mineur concerne ?{" "}
                      {bubbleType === "enterprise" ? (
                        <span className="text-xs text-[#7F88A3]">(uniquement vie perso)</span>
                      ) : null}
                    </span>
                  </label>
                </form>
              ) : null}
            </div>

            <div className="rounded-3xl border border-[#D8DEF0] bg-white/85 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-[#7A84AD]">Legendes</p>
              <div className="mt-3 grid gap-2 text-xs">
                {([
                  ["personal", "Bulle personnelle"],
                  ["family", "Bulle famille"],
                  ["enterprise", "Bulle entreprise"],
                  ["support", "Entraide et mentorat"],
                  ["inspiration", "Inspiration et ressources"],
                ] as [UniverseBubbleType, string][]).map(([kind, label]) => (
                  <div key={kind} className="flex items-center gap-2">
                    <span
                      className={[
                        "h-4 w-4 rounded-full border bg-gradient-to-br",
                        TYPE_CLASSES[kind].split(" ").slice(0, 3).join(" "),
                      ].join(" ")}
                    />
                    <span className="text-[#4E5A76]">
                      {kind} · {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-[#D8DEF0] bg-[#F8FBFF] p-4 text-xs text-[#55647F]">
                <p className="font-semibold text-[#2D3C64]">Navigation rapide</p>
                <p className="mt-2">
                  1. Zoom out pour voir toutes les bulles. 2. Zoom in pour lire le detail. 3. Cliquez sur une
                  bulle pour entrer dans son espace social.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="rounded-3xl border border-[#D8DEF0] bg-white p-6 text-sm text-[#5A6581]">
                Chargement des bulles...
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#C8D4EE] bg-white p-10 text-center">
                <h2 className="text-xl font-semibold text-[#2D3C64]">Aucune bulle active pour le moment</h2>
                <p className="mt-2 text-sm text-[#5A6581]">
                  Creez votre premiere bulle pour acceder au fil social, aux membres, aux evenements et aux
                  demandes d'aide.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="mt-5 rounded-full bg-[#23304A] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Creer ma bulle
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sorted.map((bubble, index) => (
                  <Link
                    key={bubble.id}
                    to={`/bulle/${bubble.id}`}
                    className="rounded-3xl border border-[#D8DEF0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <BubbleCover
                      title={bubble.name}
                      src={bubble.cover_path || `/covers/cover-${(index % 6) + 1}.svg`}
                    />

                    <div className="mt-3">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-[#24324B]">{bubble.name}</h2>
                        <span className="rounded-full bg-[#E7F0FF] px-2 py-1 text-[11px] font-semibold text-[#405984]">
                          {roleLabel(bubble.role)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7A84AD]">
                        {bubble.bubble_type === "enterprise" ? "Entreprise" : "Vie perso"}
                      </p>
                      {bubble.has_minor ? (
                        <p className="mt-3 rounded-xl bg-[#FFF4E7] px-3 py-2 text-xs text-[#7E5B2E]">
                          Mineur concerne : referent requis.
                        </p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

