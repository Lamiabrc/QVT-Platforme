import { Emotion, SharedJournal, EmotionType } from '@/types/database';

// Générer des émotions aléatoires pour les 7 derniers jours
export function generateDemoEmotions(memberId: string, memberName: string): Emotion[] {
  const emotions: Emotion[] = [];
  const emotionTypes: EmotionType[] = ['calme', 'fatigue', 'joie', 'stress', 'motivation', 'tristesse', 'anxiete'];
  
  // Définir des patterns émotionnels différents selon les membres
  const emotionPatterns: Record<string, EmotionType[]> = {
    'Sophie': ['calme', 'fatigue', 'stress', 'motivation', 'calme', 'joie', 'calme'],
    'Lucas': ['joie', 'motivation', 'stress', 'anxiete', 'joie', 'fatigue', 'motivation'],
    'Emma': ['joie', 'joie', 'calme', 'motivation', 'joie', 'calme', 'joie'],
  };

  const intensityPatterns: Record<string, number[]> = {
    'Sophie': [75, 60, 70, 80, 70, 85, 80],
    'Lucas': [90, 85, 75, 65, 80, 70, 85],
    'Emma': [95, 90, 85, 80, 90, 85, 95],
  };

  const pattern = emotionPatterns[memberName] || emotionTypes;
  const intensities = intensityPatterns[memberName] || [70, 75, 80, 65, 85, 90, 75];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // Du plus ancien au plus récent
    
    const emotionType = pattern[i] || emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
    
    emotions.push({
      id: `demo-emotion-${memberId}-${i}`,
      family_member_id: memberId,
      emotion: emotionType,
      intensity: intensities[i] || Math.floor(Math.random() * 30) + 60,
      note: null,
      color: getEmotionColor(emotionType),
      is_shared: true,
      created_at: date.toISOString(),
    });
  }

  return emotions;
}

function getEmotionColor(emotion: EmotionType): string {
  const colors: Record<EmotionType, string> = {
    calme: '#4ECDC4',
    fatigue: '#95A5A6',
    joie: '#F9D423',
    stress: '#FF6B6B',
    motivation: '#8B5CF6',
    tristesse: '#3498DB',
    colere: '#E74C3C',
    anxiete: '#E67E22',
  };
  return colors[emotion];
}

export function generateDemoJournalEntries(familyId: string, members: any[]): SharedJournal[] {
  const entries: SharedJournal[] = [];
  const contents = [
    { weather: 'soleil' as const, content: "Superbe journée en famille au parc ! Les enfants ont adoré le pique-nique. 🌳☀️", member: 'Sophie' },
    { weather: 'eclaircies' as const, content: "J'ai réussi mon contrôle de maths ! Trop content 😎", member: 'Lucas' },
    { weather: 'soleil' as const, content: "J'ai dessiné un arc-en-ciel aujourd'hui ! 🌈", member: 'Emma' },
    { weather: 'nuages' as const, content: "Journée de télétravail intense, mais productive. Besoin de décompresser ce soir.", member: 'Sophie' },
    { weather: 'pluie' as const, content: "Dispute avec un ami au collège... pas facile 😔", member: 'Lucas' },
  ];

  contents.forEach((entry, index) => {
    const member = members.find(m => m.display_name === entry.member);
    if (!member) return;

    const date = new Date();
    date.setDate(date.getDate() - (contents.length - 1 - index));

    entries.push({
      id: `demo-journal-${index}`,
      family_id: familyId,
      member_id: member.id,
      weather: entry.weather,
      content: entry.content,
      photo_url: null,
      created_at: date.toISOString(),
    });
  });

  return entries;
}

export function useDemoData() {
  return {
    generateDemoEmotions,
    generateDemoJournalEntries,
  };
}
