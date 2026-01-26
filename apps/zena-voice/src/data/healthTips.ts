import { HealthTip } from "@/types/content.types";

/**
 * 💡 Conseils santé express – Tips cards rapides
 * ----------------------------------------------------------
 */
export const healthTips: HealthTip[] = [
  {
    id: "hydration-1",
    title: "Restez hydraté pour rester concentré",
    category: "hydration",
    icon: "Droplets",
    shortDescription: "La déshydratation réduit vos capacités cognitives de 20%",
    actionableTip: "Gardez une bouteille d'eau (1L) sur votre bureau et terminez-la avant 15h. Remplissez-la et finissez-la avant 18h.",
    frequency: "daily"
  },
  {
    id: "posture-1",
    title: "Adoptez la bonne posture",
    category: "posture",
    icon: "MonitorCheck",
    shortDescription: "Une mauvaise posture crée tensions et fatigue",
    actionableTip: "Règle du 90-90-90 : Pieds à plat au sol (90°), genoux à 90°, coudes à 90°. Écran à hauteur des yeux.",
    frequency: "hourly"
  },
  {
    id: "break-1",
    title: "La pause active de 2 minutes",
    category: "break",
    icon: "Timer",
    shortDescription: "Rester assis 8h/jour = risque santé majeur",
    actionableTip: "Toutes les 2 heures : levez-vous, étirez-vous, marchez 2 minutes. Réglez une alarme si nécessaire.",
    frequency: "hourly"
  },
  {
    id: "breathing-1",
    title: "La respiration 4-7-8 anti-stress",
    category: "breathing",
    icon: "Wind",
    shortDescription: "Calmez votre système nerveux en 2 minutes",
    actionableTip: "Inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes. Répétez 4 fois. Parfait avant une réunion stressante.",
    frequency: "daily"
  },
  {
    id: "break-2",
    title: "La règle 20-20-20 pour vos yeux",
    category: "break",
    icon: "Eye",
    shortDescription: "Prévenez la fatigue oculaire numérique",
    actionableTip: "Toutes les 20 minutes, regardez un objet à 20 mètres pendant 20 secondes. Vos yeux vous remercieront.",
    frequency: "hourly"
  },
  {
    id: "posture-2",
    title: "Ajustez votre écran correctement",
    category: "posture",
    icon: "Monitor",
    shortDescription: "La position de l'écran impacte votre nuque et vos yeux",
    actionableTip: "Votre écran doit être à une longueur de bras, le haut de l'écran à hauteur des yeux. Inclinez-le légèrement vers l'arrière.",
    frequency: "daily"
  },
  {
    id: "hydration-2",
    title: "Remplacez le café de l'après-midi",
    category: "hydration",
    icon: "Coffee",
    shortDescription: "Le café après 14h perturbe votre sommeil",
    actionableTip: "Préférez une tisane, un thé vert (moins de caféine) ou de l'eau citronnée. Votre sommeil en bénéficiera.",
    frequency: "daily"
  },
  {
    id: "breathing-2",
    title: "La cohérence cardiaque quotidienne",
    category: "breathing",
    icon: "Heart",
    shortDescription: "5 minutes pour réguler votre stress",
    actionableTip: "Inspirez 5 secondes, expirez 5 secondes, pendant 5 minutes. Idéal le matin, midi et soir (méthode 3-6-5).",
    frequency: "daily"
  },
  {
    id: "break-3",
    title: "La micro-sieste réparatrice",
    category: "break",
    icon: "Moon",
    shortDescription: "10-20 minutes de sieste = boost de productivité",
    actionableTip: "Si votre entreprise le permet, une power nap de 15 minutes après le déjeuner améliore concentration et créativité de 30%.",
    frequency: "daily"
  },
  {
    id: "posture-3",
    title: "Variez vos positions de travail",
    category: "posture",
    icon: "MoveVertical",
    shortDescription: "Alterner assis/debout réduit les douleurs",
    actionableTip: "Si vous avez un bureau assis-debout : alternez toutes les 30-45 min. Sinon, levez-vous régulièrement pour téléphoner ou lire.",
    frequency: "hourly"
  },
  {
    id: "sleep-1",
    title: "Préparez votre sommeil dès le matin",
    category: "sleep",
    icon: "Sun",
    shortDescription: "La lumière naturelle régule votre horloge biologique",
    actionableTip: "Exposez-vous à la lumière naturelle dans les 30 minutes après le réveil. 10 minutes suffisent.",
    frequency: "daily"
  },
  {
    id: "sleep-2",
    title: "Coupez les écrans 1h avant de dormir",
    category: "sleep",
    icon: "MoonStar",
    shortDescription: "La lumière bleue bloque la mélatonine",
    actionableTip: "Remplacez le scrolling par la lecture, la méditation ou une discussion. Votre sommeil sera plus profond.",
    frequency: "daily"
  },
  {
    id: "breathing-3",
    title: "La respiration abdominale express",
    category: "breathing",
    icon: "Activity",
    shortDescription: "1 minute pour apaiser une tension",
    actionableTip: "Main sur le ventre. Inspirez en gonflant le ventre (pas la poitrine). Expirez lentement. 10 respirations = effet immédiat.",
    frequency: "hourly"
  },
  {
    id: "hydration-3",
    title: "Commencez la journée hydraté",
    category: "hydration",
    icon: "GlassWater",
    shortDescription: "Votre corps perd 0,5L d'eau pendant la nuit",
    actionableTip: "Buvez un grand verre d'eau (250-300ml) dès le réveil, avant même le café. Votre cerveau fonctionnera mieux.",
    frequency: "daily"
  },
  {
    id: "break-4",
    title: "La marche digestive post-déjeuner",
    category: "break",
    icon: "Footprints",
    shortDescription: "10 minutes de marche améliorent la digestion",
    actionableTip: "Après le déjeuner, marchez 10 minutes (dehors si possible). Cela évite le coup de barre et améliore votre concentration.",
    frequency: "daily"
  },
  {
    id: "posture-4",
    title: "Soutenez vos poignets",
    category: "posture",
    icon: "Hand",
    shortDescription: "Prévenez le syndrome du canal carpien",
    actionableTip: "Utilisez un repose-poignets pour le clavier et la souris. Vos poignets doivent être alignés avec vos avant-bras (pas pliés).",
    frequency: "daily"
  },
  {
    id: "sleep-3",
    title: "Gardez votre chambre fraîche",
    category: "sleep",
    icon: "Snowflake",
    shortDescription: "La température idéale pour dormir : 18-19°C",
    actionableTip: "Aérez votre chambre avant de dormir. Une température trop élevée perturbe les cycles de sommeil.",
    frequency: "daily"
  },
  {
    id: "breathing-4",
    title: "Le soupir de soulagement",
    category: "breathing",
    icon: "CloudRain",
    shortDescription: "Le soupir naturel régule le stress",
    actionableTip: "Inspirez profondément, puis expirez bruyamment par la bouche (comme un grand soupir). Répétez 3 fois. Libération instantanée.",
    frequency: "hourly"
  },
  {
    id: "break-5",
    title: "Les étirements de bureau essentiels",
    category: "break",
    icon: "Stretch",
    shortDescription: "5 minutes d'étirements = -50% de tensions",
    actionableTip: "Étirez nuque (rotations douces), épaules (roulez-les), dos (torsion assise), poignets (rotations). 30 secondes par zone.",
    frequency: "hourly"
  },
  {
    id: "hydration-4",
    title: "Infusez votre eau pour la rendre attractive",
    category: "hydration",
    icon: "Citrus",
    shortDescription: "L'eau plate vous ennuie ? Ajoutez du goût !",
    actionableTip: "Ajoutez citron, concombre, menthe ou fruits rouges dans votre bouteille. C'est naturel, rafraîchissant et vous boirez plus.",
    frequency: "daily"
  }
];
