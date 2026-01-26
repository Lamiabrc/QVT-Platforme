// Keywords pour chaque dimension RPS
export const RPS_KEYWORDS = {
  intensityWork: {
    high: ['surcharge', 'débordé', 'urgence', 'deadline', 'heures sup', 'trop de travail', 'pas le temps', 'speed', 'rush', 'interruptions', 'multitâche'],
    medium: ['beaucoup', 'chargé', 'intense', 'rapide', 'pression'],
    low: ['gérable', 'équilibré', 'rythme']
  },
  emotionalDemands: {
    high: ['clients difficiles', 'tension', 'conflit', 'agressivité', 'colère', 'frustration', 'souffrance', 'émotions', 'pleurs', 'crise'],
    medium: ['stressant', 'compliqué', 'tendu', 'difficile'],
    low: ['calme', 'serein', 'paisible']
  },
  autonomy: {
    high: ['contrôle', 'micromanagement', 'imposé', 'pas de marge', 'surveillance', 'dicté', 'pas mon mot', 'pas décider'],
    medium: ['suivi', 'encadré', 'peu de liberté'],
    low: ['autonome', 'libre', 'décisions', 'initiative']
  },
  socialRelations: {
    high: ['manager toxique', 'collègues', 'harcèlement', 'isolé', 'seul', 'pas de soutien', 'conflits', 'mauvaise ambiance', 'ignoré'],
    medium: ['tensions', 'difficultés relationnelles', 'incompréhension'],
    low: ['équipe', 'soutien', 'reconnaissance', 'bien avec', 'bonne entente']
  },
  valueConflicts: {
    high: ['inutile', 'absurde', 'sens', 'qualité impossible', 'contre mes valeurs', 'compromis', 'mal à l\'aise', 'éthique'],
    medium: ['questionnement', 'doute', 'pertinence'],
    low: ['sens', 'utile', 'fier', 'contribue']
  },
  jobInsecurity: {
    high: ['licenciement', 'précarité', 'réorganisation', 'incertitude', 'peur de perdre', 'instabilité', 'avenir flou'],
    medium: ['changements', 'inquiétude', 'évolutions'],
    low: ['sécurisé', 'stable', 'confiance']
  }
} as const;

// Keywords burnout (3 dimensions Maslach)
export const BURNOUT_KEYWORDS = {
  emotionalExhaustion: ['fatigué', 'épuisé', 'vidé', 'à bout', 'plus d\'énergie', 'sommeil', 'insomnie', 'réveils', 'maux de tête', 'tensions'],
  depersonalization: ['démotivé', 'cynique', 'détaché', 'plus envie', 'me fous', 'plus important', 'désengagé'],
  reducedAccomplishment: ['inefficace', 'nul', 'incapable', 'échec', 'perte de sens', 'pas bon', 'doute']
} as const;
