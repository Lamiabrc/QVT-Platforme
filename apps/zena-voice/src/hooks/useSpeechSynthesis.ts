// src/hooks/useSpeechSynthesis.ts
import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "fr-FR" | "en-US";
type Gender = "female" | "male";

interface SpeakOptions {
  text: string;
  lang?: Lang;
  gender?: Gender;
  rate?: number;   // 0.1 – 10
  pitch?: number;  // 0 – 2
  volume?: number; // 0 – 1
  onEnd?: () => void;
  mode?: "replace" | "queue"; // replace = cancel avant de parler, queue = ajoute
}

interface UseSpeechSynthesis {
  speak: (options: SpeakOptions) => void;
  stop: () => void;
  speaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const isSupported =
    typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined";

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Chargement fiable des voix (event + petit polling si liste vide)
  useEffect(() => {
    if (!isSupported) return;

    const load = () => setAvailableVoices(window.speechSynthesis.getVoices() || []);
    load();

    const onVoices = () => load();
    // certains navigateurs utilisent encore onvoiceschanged=fn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.speechSynthesis as any).onvoiceschanged = onVoices;
    // d’autres préfèrent addEventListener
    window.speechSynthesis.addEventListener?.("voiceschanged", onVoices);

    // fallback: si la liste est vide au 1er render, on repoll quelques fois
    let tries = 0;
    const id = setInterval(() => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
        clearInterval(id);
      } else if (++tries > 10) {
        clearInterval(id);
      }
    }, 250);

    return () => {
      try {
        window.speechSynthesis.removeEventListener?.("voiceschanged", onVoices);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.speechSynthesis as any).onvoiceschanged = null;
      } catch (err) {
        // noop
      }
      clearInterval(id);
    };
  }, [isSupported]);

  // Sélection de voix robuste (langue → même famille → genre)
  const pickVoice = useMemo(() => {
    return (lang: Lang, gender: Gender) => {
      if (!availableVoices.length) return null;

      const base = lang.slice(0, 2).toLowerCase();
      const exact = availableVoices.filter((v) => v.lang?.toLowerCase() === lang.toLowerCase());
      const sameBase = availableVoices.filter((v) => v.lang?.slice(0, 2).toLowerCase() === base);
      const pool = exact.length ? exact : sameBase.length ? sameBase : availableVoices;

      console.log(`[useSpeechSynthesis] Sélection voix pour ${lang} ${gender}:`, {
        availableCount: availableVoices.length,
        poolCount: pool.length,
        poolNames: pool.map(v => `${v.name} (${v.lang})`),
      });

      // Regex amélioré pour détecter les voix françaises féminines
      const genderRe =
        gender === "female"
          ? /(female|woman|fem|fémin|Femme|Girl|Hortense|Julie|Celine|Denise|Audrey|Léa|Amelie|Virginie|Wavenet-[A|C|F]|Neural.*Female|Google.*(Female|Femme)|fr-FR-.*Female|Microsoft.*FR.*Female)/i
          : /(male|man|masc|Homme|Boy|Thomas|Paul|Henri|Claude|Alain|Wavenet-[B|D]|Neural.*Male|Google.*(Male|Homme)|fr-FR-.*Male|Microsoft.*FR.*Male)/i;

      const byGender = pool.find((v) => genderRe.test(v.name));
      const selected = byGender || pool[0] || null;
      
      console.log(`[useSpeechSynthesis] Voix sélectionnée:`, selected ? `${selected.name} (${selected.lang})` : 'AUCUNE');
      return selected;
    };
  }, [availableVoices]);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const speak = ({
    text,
    lang = "fr-FR",
    gender = "female",
    rate = 1,
    pitch = 1,
    volume = 1,
    onEnd,
    mode = "replace",
  }: SpeakOptions) => {
    if (!isSupported || !text) return;

    // iOS/Safari exigent souvent un "user gesture" (click/tap) préalable.
    // Si besoin, appelle speak depuis un handler de clic.

    if (mode === "replace") window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = clamp(rate, 0.1, 2);     // valeurs extrêmes souvent instables
    u.pitch = clamp(pitch, 0, 2);
    u.volume = clamp(volume, 0, 1);

    u.voice = pickVoice(lang, gender);

    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };
    u.onerror = () => setSpeaking(false);

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } finally {
      setSpeaking(false);
      utteranceRef.current = null;
    }
  };

  return { speak, stop, speaking, availableVoices, isSupported };
}
