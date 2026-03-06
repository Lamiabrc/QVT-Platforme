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
    id: "accueil",
    name: "Accueil",
    emoji: "\uD83C\uDFE0",
    members: 1,
    x: 21,
    y: 24,
    size: 232,
    glowColor: "rgba(183, 206, 255, 0.52)",
    color: "from-indigo-200/45 to-sky-100/35",
  },
  {
    id: "zena",
    name: "ZENA",
    emoji: "\u2728",
    members: 1,
    x: 79,
    y: 22,
    size: 238,
    glowColor: "rgba(195, 156, 255, 0.55)",
    color: "from-violet-200/45 to-fuchsia-100/35",
  },
  {
    id: "mon-univers",
    name: "Mon univers",
    emoji: "\uD83C\uDF0C",
    members: 1,
    x: 50,
    y: 54,
    size: 292,
    glowColor: "rgba(135, 194, 255, 0.58)",
    color: "from-cyan-200/45 to-blue-100/35",
  },
  {
    id: "boutique",
    name: "Boutique",
    emoji: "\uD83D\uDED2",
    members: 1,
    x: 83,
    y: 83,
    size: 236,
    glowColor: "rgba(157, 236, 226, 0.55)",
    color: "from-teal-200/45 to-cyan-100/35",
  },
];
