export type AppRole = 'parent' | 'ado';
export type FamilyRole = 'parent' | 'ado' | 'enfant' | 'parrain' | 'tuteur' | 'autre';
export type EmotionType = 'calme' | 'fatigue' | 'joie' | 'stress' | 'motivation' | 'tristesse' | 'colere' | 'anxiete';
export type WeatherType = 'soleil' | 'nuages' | 'pluie' | 'eclaircies';
export type NudgeType = 'message' | 'drawing' | 'sound';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  profile_id: string | null;
  role: FamilyRole;
  display_name: string;
  age_range: string | null;
  is_account_holder: boolean;
  created_at: string;
}

export interface Emotion {
  id: string;
  family_member_id: string;
  emotion: EmotionType;
  intensity: number;
  note: string | null;
  color: string;
  is_shared: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  family_member_id: string;
  title: string | null;
  started_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion_detected: string | null;
  created_at: string;
}

export interface FamilyNudge {
  id: string;
  from_member_id: string;
  to_member_id: string;
  type: NudgeType;
  content: string;
  media_url: string | null;
  read_at: string | null;
  created_at: string;
}

export interface SharedJournal {
  id: string;
  family_id: string;
  member_id: string;
  weather: WeatherType;
  content: string | null;
  photo_url: string | null;
  created_at: string;
}

export const EMOTION_COLORS: Record<EmotionType, string> = {
  calme: 'hsl(var(--emotion-calme))',
  fatigue: 'hsl(var(--emotion-fatigue))',
  joie: 'hsl(var(--emotion-joie))',
  stress: 'hsl(var(--emotion-stress))',
  motivation: 'hsl(var(--emotion-motivation))',
  tristesse: 'hsl(var(--emotion-tristesse))',
  colere: 'hsl(var(--emotion-colere))',
  anxiete: 'hsl(var(--emotion-anxiete))',
};

export const EMOTION_LABELS: Record<EmotionType, string> = {
  calme: 'Calme',
  fatigue: 'Fatigue',
  joie: 'Joie',
  stress: 'Stress',
  motivation: 'Motivation',
  tristesse: 'Tristesse',
  colere: 'Colère',
  anxiete: 'Anxiété',
};

export const WEATHER_ICONS: Record<WeatherType, string> = {
  soleil: '☀️',
  nuages: '☁️',
  pluie: '🌧️',
  eclaircies: '⛅',
};

export const WEATHER_LABELS: Record<WeatherType, string> = {
  soleil: 'Soleil',
  nuages: 'Nuages',
  pluie: 'Pluie',
  eclaircies: 'Éclaircies',
};
