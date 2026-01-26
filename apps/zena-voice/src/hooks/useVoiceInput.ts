// src/hooks/useVoiceInput.ts
import { useEffect, useRef, useState } from "react";

interface UseVoiceInputOptions {
  lang?: "fr-FR" | "en-US" | "auto";
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, detectedLang?: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook vocal multilingue (FR/EN)
 * - Chrome/Edge desktop + Chrome Android: OK
 * - iOS/Safari: SpeechRecognition non supporté (onError sera appelé)
 */
export function useVoiceInput({
  lang = "auto",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState<"fr" | "en" | "unknown">("unknown");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const optionsRef = useRef({ lang, continuous, interimResults });
  const startingRef = useRef(false);
  const manualStopRef = useRef(false);

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { optionsRef.current = { lang, continuous, interimResults }; }, [lang, continuous, interimResults]);

  // Pré-autorise le micro pour éviter "not-allowed" silencieux
  async function ensureMicPermission(): Promise<boolean> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      onErrorRef.current?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SR() as SpeechRecognition;
    recognition.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    recognition.continuous = !!optionsRef.current.continuous;
    recognition.interimResults = !!optionsRef.current.interimResults;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0]?.transcript?.trim?.() ?? "";

      // Détecte FR/EN à partir du texte courant (pas le state)
      const isEnglish = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const isFrench  = /\b(bonjour|salut|merci|oui|non|comment|ça va|ca va)\b/i.test(text);
      const dl: "fr" | "en" | "unknown" = isEnglish ? "en" : isFrench ? "fr" : "unknown";

      setDetectedLang(dl);
      setTranscript(text);

      if (lastResult.isFinal) {
        onResultRef.current?.(text, dl); // <-- utilise la valeur calculée, pas le state
        setTranscript("");
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      const code = event?.error || "speech_error";
      startingRef.current = false;
      setIsListening(false);

      const nice =
        code === "not-allowed"         ? "Permission micro refusée."
      : code === "audio-capture"       ? "Aucun micro détecté."
      : code === "no-speech"           ? "Aucune parole détectée."
      : code === "aborted"             ? "Reconnaissance interrompue."
      : code === "network"             ? "Erreur réseau."
      : code === "service-not-allowed" ? "Service de reconnaissance non autorisé."
      : `Erreur de reconnaissance: ${code}`;

      onErrorRef.current?.(nice);
    };

    recognition.onend = () => {
      startingRef.current = false;
      if (optionsRef.current.continuous && !manualStopRef.current) {
        try {
          recognition.start(); // auto-restart si continuous
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
        manualStopRef.current = false;
      }
    };

    recognitionRef.current = recognition;
    return () => {
      try { 
        recognition.stop(); 
      } catch {
        // noop
      }
      recognitionRef.current = null;
    };
    // IMPORTANT: ne pas dépendre de detectedLang/onResult/onError pour éviter re-instanciation
  }, []); 

  const startListening = async () => {
    const rec = recognitionRef.current;
    if (!rec) {
      onErrorRef.current?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }
    
    // ✅ Vérification renforcée
    if (isListening || startingRef.current) {
      console.warn('[useVoiceInput] Reconnaissance déjà en cours, ignoré');
      return;
    }

    // ✅ Stop propre si déjà actif (safety)
    try {
      rec.stop();
      await new Promise(r => setTimeout(r, 300)); // Attendre la fin propre
    } catch (e) {
      // noop
    }

    manualStopRef.current = false;

    if (!(await ensureMicPermission())) {
      onErrorRef.current?.("Accès au micro refusé. Vérifie les permissions navigateur/OS.");
      return;
    }

    // Applique les options à l'instant du démarrage
    rec.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    rec.continuous = !!optionsRef.current.continuous;
    rec.interimResults = !!optionsRef.current.interimResults;

    try {
      startingRef.current = true;
      rec.start();
      setIsListening(true);
      console.log('✅ [useVoiceInput] Reconnaissance démarrée');
    } catch (err: any) {
      console.error('❌ [useVoiceInput] Erreur start():', err); // ✅ Log l'erreur réelle
      startingRef.current = false;
      setIsListening(false);
      
      // ✅ Message selon le type d'erreur
      const msg = err.message?.includes('already')
        ? "La reconnaissance vocale est déjà active."
        : "Impossible de démarrer la reconnaissance vocale.";
      onErrorRef.current?.(msg);
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    manualStopRef.current = true;
    try { rec.stop(); } finally { setIsListening(false); startingRef.current = false; }
  };

  return {
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  };
}
