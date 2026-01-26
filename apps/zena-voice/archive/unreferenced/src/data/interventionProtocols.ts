export interface InterventionAction {
  type: 'conversation' | 'recommendation' | 'resource' | 'check_in' | 'alert_hr' | 'emergency_resources' | 'exploration' | 'alert_manager' | 'daily_check_in';
  script?: string;
  content?: string | string[];
  link?: string;
  frequency?: 'daily' | 'weekly';
  duration?: number; // en jours
  anonymous?: boolean;
  message?: string;
  priority?: 'normal' | 'urgent';
  mandatory?: boolean;
  questions?: string[];
  suggestion?: string;
}

export interface InterventionProtocol {
  level: 'moderate' | 'elevated' | 'critical';
  triggers: string[]; // Conditions de déclenchement
  actions: InterventionAction[];
}

export const interventionProtocols: Record<string, InterventionProtocol> = {
  burnout_prevention: {
    level: 'moderate',
    triggers: ['burnout_risk_score >= 26 AND burnout_risk_score <= 50'],
    actions: [
      {
        type: 'conversation',
        script: "Je remarque que tu sembles fatigué(e) ces derniers temps. Veux-tu qu'on en parle ?"
      },
      {
        type: 'recommendation',
        content: 'Box QVT "Pause Récupération" avec exercices de décompression'
      },
      {
        type: 'resource',
        link: '/wellness-hub?category=burnout'
      },
      {
        type: 'check_in',
        frequency: 'daily',
        duration: 7
      }
    ]
  },
  
  burnout_intervention: {
    level: 'elevated',
    triggers: ['burnout_risk_score >= 51 AND burnout_risk_score <= 70'],
    actions: [
      {
        type: 'conversation',
        script: "Ton bien-être me préoccupe. Les signaux que je détecte sont importants. As-tu pensé à en parler avec quelqu'un ?"
      },
      {
        type: 'recommendation',
        content: 'Je te recommande vivement de faire un test burnout complet et de consulter le médecin du travail'
      },
      {
        type: 'alert_hr',
        anonymous: true,
        message: 'Une personne de votre équipe présente des signaux de burnout élevés'
      },
      {
        type: 'check_in',
        frequency: 'daily',
        duration: 14
      }
    ]
  },
  
  burnout_crisis: {
    level: 'critical',
    triggers: ['burnout_risk_score >= 71'],
    actions: [
      {
        type: 'conversation',
        script: "Je suis inquiet(e) pour toi. Ce que tu vis semble très difficile. Il est essentiel de ne pas rester seul(e). Puis-je te mettre en relation avec ton médecin du travail ou un psychologue ?"
      },
      {
        type: 'emergency_resources',
        content: [
          'Numéro médecin du travail : [à configurer par l\'entreprise]',
          'Plateforme d\'écoute psychologique 24/7 : 3114',
          'Urgences : 15 ou 112'
        ]
      },
      {
        type: 'alert_hr',
        priority: 'urgent',
        anonymous: true,
        message: 'URGENT : Une personne présente un risque de burnout critique'
      },
      {
        type: 'daily_check_in',
        mandatory: true,
        duration: 14
      }
    ]
  },
  
  demotivation_pattern: {
    level: 'moderate',
    triggers: ['motivation_index < 40', 'value_conflicts_score > 60'],
    actions: [
      {
        type: 'conversation',
        script: "Je remarque que tu sembles moins motivé(e) qu'avant. Qu'est-ce qui a changé pour toi ?"
      },
      {
        type: 'exploration',
        questions: [
          "Qu'est-ce qui te donnait de l'énergie avant ?",
          "Qu'est-ce qui te manque aujourd'hui ?",
          "Y a-t-il eu un événement déclencheur ?"
        ]
      },
      {
        type: 'recommendation',
        content: 'Box QVT "Retrouver du Sens" avec coaching motivation'
      },
      {
        type: 'resource',
        link: '/wellness-hub?category=motivation'
      }
    ]
  },
  
  social_isolation: {
    level: 'elevated',
    triggers: ['social_relations_score >= 60', 'pattern: isolement_social'],
    actions: [
      {
        type: 'conversation',
        script: "Tu sembles te sentir seul(e) au travail. Comment se passent tes relations avec l'équipe ?"
      },
      {
        type: 'recommendation',
        content: 'Je te recommande de participer aux prochaines activités d\'équipe, ou de solliciter un moment informel avec tes collègues'
      },
      {
        type: 'alert_manager',
        suggestion: "Organiser un moment d'équipe informel pour renforcer les liens sociaux"
      }
    ]
  },

  work_overload: {
    level: 'elevated',
    triggers: ['intensity_work_score >= 70'],
    actions: [
      {
        type: 'conversation',
        script: "Je détecte une surcharge de travail importante. Parlons de comment mieux organiser ta charge."
      },
      {
        type: 'recommendation',
        content: 'Techniques de priorisation et gestion du temps'
      },
      {
        type: 'alert_manager',
        suggestion: "Revoir la répartition des tâches de cette personne"
      }
    ]
  },

  autonomy_deficit: {
    level: 'moderate',
    triggers: ['autonomy_score >= 65'],
    actions: [
      {
        type: 'conversation',
        script: "Tu sembles manquer de marge de manœuvre dans ton travail. Comment vis-tu cette situation ?"
      },
      {
        type: 'exploration',
        questions: [
          "Dans quels domaines aimerais-tu avoir plus d'autonomie ?",
          "Qu'est-ce qui t'empêche de prendre des initiatives ?"
        ]
      },
      {
        type: 'recommendation',
        content: 'Discuter avec ton manager pour clarifier les zones d\'autonomie'
      }
    ]
  },

  value_conflict: {
    level: 'elevated',
    triggers: ['value_conflicts_score >= 65'],
    actions: [
      {
        type: 'conversation',
        script: "Je sens une tension entre ce qu'on te demande et tes valeurs. C'est difficile à vivre."
      },
      {
        type: 'exploration',
        questions: [
          "Qu'est-ce qui te met le plus mal à l'aise ?",
          "Y a-t-il des compromis possibles ?"
        ]
      },
      {
        type: 'recommendation',
        content: 'Box QVT "Retrouver du Sens" - Alignement valeurs/travail'
      }
    ]
  }
};

// Fonction pour évaluer si un protocole doit être déclenché
export function evaluateProtocolTriggers(
  protocolKey: string,
  rpsAnalysis: {
    burnoutRiskScore: number;
    motivationIndex: number;
    dimensions: {
      intensityWork: { score: number };
      emotionalDemands: { score: number };
      autonomy: { score: number };
      socialRelations: { score: number };
      valueConflicts: { score: number };
      jobInsecurity: { score: number };
    };
    detectedPatterns: string[];
  }
): boolean {
  const protocol = interventionProtocols[protocolKey];
  if (!protocol) return false;

  return protocol.triggers.every(trigger => {
    // Parse le trigger (ex: "burnout_risk_score >= 51")
    const match = trigger.match(/(\w+)\s*(>=|<=|>|<|==)\s*(\d+)/);
    if (match) {
      const [, field, operator, valueStr] = match;
      const value = parseInt(valueStr);
      
      let actualValue: number;
      if (field === 'burnout_risk_score') {
        actualValue = rpsAnalysis.burnoutRiskScore;
      } else if (field === 'motivation_index') {
        actualValue = rpsAnalysis.motivationIndex;
      } else if (field.endsWith('_score')) {
        const dimName = field.replace('_score', '');
        const dimKey = Object.keys(rpsAnalysis.dimensions).find(
          k => k.toLowerCase() === dimName.toLowerCase()
        );
        if (dimKey) {
          actualValue = rpsAnalysis.dimensions[dimKey as keyof typeof rpsAnalysis.dimensions].score;
        } else {
          return false;
        }
      } else {
        return false;
      }

      switch (operator) {
        case '>=': return actualValue >= value;
        case '<=': return actualValue <= value;
        case '>': return actualValue > value;
        case '<': return actualValue < value;
        case '==': return actualValue === value;
        default: return false;
      }
    }

    // Check pattern
    if (trigger.startsWith('pattern:')) {
      const patternName = trigger.replace('pattern:', '').trim();
      return rpsAnalysis.detectedPatterns.includes(patternName);
    }

    return false;
  });
}

// Fonction pour obtenir le protocole le plus prioritaire
export function selectMostUrgentProtocol(
  rpsAnalysis: {
    burnoutRiskScore: number;
    motivationIndex: number;
    dimensions: {
      intensityWork: { score: number };
      emotionalDemands: { score: number };
      autonomy: { score: number };
      socialRelations: { score: number };
      valueConflicts: { score: number };
      jobInsecurity: { score: number };
    };
    detectedPatterns: string[];
  }
): { protocolKey: string; protocol: InterventionProtocol } | null {
  const matchingProtocols = Object.entries(interventionProtocols)
    .filter(([key, protocol]) => evaluateProtocolTriggers(key, rpsAnalysis))
    .sort((a, b) => {
      const priorityOrder = { critical: 0, elevated: 1, moderate: 2 };
      return priorityOrder[a[1].level] - priorityOrder[b[1].level];
    });

  if (matchingProtocols.length > 0) {
    const [protocolKey, protocol] = matchingProtocols[0];
    return { protocolKey, protocol };
  }

  return null;
}
