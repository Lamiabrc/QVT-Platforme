export type BubbleData = {
  id: string;
  name: string;
  emoji: string;
  members: number;
  x: number;
  y: number;
  size: number;
  glowColor: string;
  color: string;
};

export const bubbles: BubbleData[] = [
  {
    id: "ma-bulle",
    name: "Ma bulle",
    emoji: "🫧",
    members: 1,
    x: 50,
    y: 50,
    size: 126,
    glowColor: "rgba(134, 213, 255, 0.52)",
    color: "from-cyan-200/50 to-sky-100/40",
  },
  {
    id: "bien-etre-travail",
    name: "Bien-être au travail",
    emoji: "💼",
    members: 124,
    x: 20,
    y: 26,
    size: 104,
    glowColor: "rgba(120, 208, 190, 0.55)",
    color: "from-emerald-200/45 to-teal-100/35",
  },
  {
    id: "parents",
    name: "Parents",
    emoji: "👨‍👩‍👧",
    members: 82,
    x: 30,
    y: 72,
    size: 96,
    glowColor: "rgba(196, 178, 255, 0.52)",
    color: "from-violet-200/45 to-indigo-100/35",
  },
  {
    id: "adolescents",
    name: "Adolescents",
    emoji: "🎒",
    members: 69,
    x: 74,
    y: 24,
    size: 98,
    glowColor: "rgba(156, 210, 255, 0.5)",
    color: "from-sky-200/45 to-cyan-100/35",
  },
  {
    id: "lucioles",
    name: "Lucioles",
    emoji: "✨",
    members: 41,
    x: 83,
    y: 64,
    size: 100,
    glowColor: "rgba(255, 208, 136, 0.58)",
    color: "from-amber-200/45 to-orange-100/35",
  },
  {
    id: "entraide",
    name: "Entraide",
    emoji: "🤝",
    members: 95,
    x: 14,
    y: 56,
    size: 90,
    glowColor: "rgba(175, 224, 196, 0.54)",
    color: "from-green-200/45 to-emerald-100/35",
  },
  {
    id: "cohesion-entreprise",
    name: "Cohésion entreprise",
    emoji: "🏢",
    members: 57,
    x: 62,
    y: 82,
    size: 92,
    glowColor: "rgba(172, 226, 214, 0.5)",
    color: "from-teal-200/45 to-emerald-100/35",
  },
  {
    id: "inspiration",
    name: "Inspiration",
    emoji: "💡",
    members: 73,
    x: 90,
    y: 40,
    size: 88,
    glowColor: "rgba(187, 201, 255, 0.52)",
    color: "from-indigo-200/45 to-blue-100/35",
  },
  {
    id: "sante-mentale",
    name: "Santé mentale",
    emoji: "🧠",
    members: 88,
    x: 46,
    y: 14,
    size: 92,
    glowColor: "rgba(197, 227, 255, 0.5)",
    color: "from-blue-200/45 to-sky-100/35",
  },
  {
    id: "defis-bien-etre",
    name: "Défis bien-être",
    emoji: "🏆",
    members: 64,
    x: 54,
    y: 90,
    size: 86,
    glowColor: "rgba(210, 221, 255, 0.48)",
    color: "from-purple-200/45 to-indigo-100/35",
  },
];

