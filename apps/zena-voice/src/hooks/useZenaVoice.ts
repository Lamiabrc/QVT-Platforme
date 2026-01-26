// src/hooks/useZenaVoice.ts
import { useCallback, useEffect, useRef } from "react";
import { useVoiceInput } from "./useVoiceInput";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useAudioAnalyzer } from "./useAudioAnalyzer";

type Lang = "fr-FR" | "en-US";
type Gender = "female" | "male";

interface UseZenaVoiceOptions {
  lang?: Lang;                 // langue TTS
  gender?: Gender;             // genre TTS
  sttLang?: "auto" | Lang;     // langue STT
  continuous?: boolean;        // STT: redémarre automatiquement
  interimResults?: boolean;    // STT: résultats intermédiaires
  /** 👇 NOUVEAU: appelé quand le STT produit un résultat FINAL */
  onFinalResult?: (text: string, detected: "fr" | "en" | "unknown") => void;
}

/**
 * 🌿 useZenaVoice — Orchestrateur voix
 * - Pause l'écoute (STT) pendant que ça parle (TTS), puis la relance après.
 * - Retourne le niveau audio simulé pour animer un halo/bouche.
 * - Remonte les résultats finaux du STT via onFinalResult.
 */
export function useZenaVoice({
  lang = "fr-FR",
  gender = "female",
  sttLang = "auto",
  continuous = true,
  interimResults = true,
  onFinalResult,
}: UseZenaVoiceOptions = {}) {
  // STT (écoute micro) — on branche onResult pour remonter les finals
  const {
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  } = useVoiceInput({
    lang: sttLang,
    continuous,
    interimResults,
    onResult: (text, dl) => {
      // <- TEXTE FINAL du micro
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (text && onFinalResult) onFinalResult(text, (dl as any) || "unknown");
    },
  });

  // Vérifier si STT est supporté
  const sttSupported = typeof window !== 'undefined' && 
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) ? true : false;

  // TTS (parole)
  const {
    isSupported: ttsSupported,
    speak,
    stop: stopTTS,
    speaking: isSpeaking,
  } = useSpeechSynthesis();

  // Niveau audio pour anim (bouche/halo)
  const audioLevel = useAudioAnalyzer(isSpeaking);

  // Faut-il relancer l'écoute après la fin du TTS ?
  const resumeAfterSpeak = useRef(false);

  // Cleanup
  useEffect(() => {
    return () => {
      try { 
        stopTTS(); 
      } catch (err) {
        // noop
      }
      try { 
        stopListening(); 
      } catch (err) {
        // noop
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 🔊 Fait parler (TTS) en évitant larsen
   */
  const say = useCallback(
    (text: string, opts?: { lang?: Lang; gender?: Gender }) => {
      if (!ttsSupported || !text) return;

      const wasListening = isListening;
      if (wasListening) stopListening();         // pause micro
      resumeAfterSpeak.current = wasListening;   // relancer après ?

      speak({
        text,
        lang: opts?.lang ?? lang,
        gender: opts?.gender ?? gender,
        onEnd: () => {
          if (resumeAfterSpeak.current) {
            resumeAfterSpeak.current = false;
            setTimeout(() => startListening(), 150);
          }
        },
      });
    },
    [ttsSupported, isListening, stopListening, speak, lang, gender, startListening]
  );

  /**
   * 🎧 Démarre l'écoute (si TTS en cours, on le stoppe)
   */
  const listen = useCallback(() => {
    if (!sttSupported) return;
    if (isSpeaking) stopTTS();
    startListening();
  }, [sttSupported, isSpeaking, stopTTS, startListening]);

  return {
    // actions
    say,
    playText: say, // backward compatibility
    listen,
    stopListening,

    // états
    isSpeaking,
    isListening,
    transcript,
    detectedLang,
    audioLevel,

    // support
    sttSupported,
    ttsSupported,
  };
}
