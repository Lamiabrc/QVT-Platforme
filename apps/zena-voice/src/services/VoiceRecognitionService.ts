/**
 * 🎤 VoiceRecognitionService – version mobile-friendly
 * Compatibilité totale Chrome / Safari / Android / iOS (PWA)
 * et meilleure gestion des sessions et permissions.
 */

export type VoiceRecognitionMode = "browser" | "cloud";

export interface VoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface IVoiceRecognitionService {
  isSupported(): boolean;
  start(): Promise<void>;
  stop(): void;
  isListening(): boolean;
}

/**
 * 🧠 Web Speech API (navigateur)
 */
export class BrowserVoiceRecognition implements IVoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private listening = false;
  private options: VoiceRecognitionOptions;

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
    this.initRecognition();
  }

  private initRecognition() {
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️ Web Speech API non supportée sur ce navigateur");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.options.lang || "fr-FR";
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || true;
    // @ts-expect-error: Web Speech API properties not in TS DOM lib
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      if (transcript.trim()) this.options.onResult?.(transcript.trim(), isFinal);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      console.error("❌ SpeechRecognition error:", event.error);
      const messages: Record<string, string> = {
        "not-allowed": "Permission du micro refusée",
        "no-speech": "Aucune parole détectée",
        "audio-capture": "Micro non disponible",
        "network": "Erreur réseau",
        "aborted": "Session interrompue",
      };
      this.options.onError?.(messages[event.error] || event.error);
      this.listening = false;
      this.options.onEnd?.();
    };

    this.recognition.onend = () => {
      this.listening = false;
      this.options.onEnd?.();
    };

    // @ts-expect-error: Web Speech API events not in TS DOM lib
    this.recognition.onstart = () => {
      this.listening = true;
      this.options.onStart?.();
    };
  }

  isSupported(): boolean {
     
    return !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  async start(): Promise<void> {
    if (!this.recognition) throw new Error("Reconnaissance vocale non disponible");

    if (this.listening) {
      console.warn("⚠️ Déjà en écoute, redémarrage propre...");
      this.stop();
      await new Promise((r) => setTimeout(r, 500));
    }

    try {
      console.log("🎤 Demande de permission micro...");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Micro autorisé, lancement écoute...");

      // Safari iOS : nécessite un déclenchement synchronisé avec un clic
      setTimeout(() => {
        try {
          this.recognition?.start();
        } catch (e) {
          console.error("⚠️ Impossible de démarrer recognition.start()", e);
        }
      }, 150);
    } catch (err: any) {
      let msg = "Erreur microphone";
      if (err.name === "NotAllowedError")
        msg = "Permission du micro refusée.";
      else if (err.name === "NotFoundError")
        msg = "Aucun micro détecté.";
      this.options.onError?.(msg);
      throw new Error(msg);
    }
  }

  stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // noop
      }
    }
    this.listening = false;
  }

  isListening(): boolean {
    return this.listening;
  }
}

/**
 * ☁️ Mode cloud (fallback, API STT)
 * – fonctionne sur iOS Safari
 * – à connecter plus tard à ton endpoint Whisper
 */
export class CloudVoiceRecognition implements IVoiceRecognitionService {
  private listening = false;
  private options: VoiceRecognitionOptions;
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
  }

  isSupported(): boolean {
    return typeof MediaRecorder !== "undefined";
  }

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new MediaRecorder(this.stream);
      this.chunks = [];

      this.recorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };
      this.recorder.onstop = async () => {
        const blob = new Blob(this.chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("🎧 Fichier audio prêt pour cloud STT");
          // 👉 à connecter plus tard à Supabase Edge / Whisper
          this.options.onError?.(
            "Mode cloud actif — transcription non encore connectée"
          );
        };
        reader.readAsDataURL(blob);
        this.listening = false;
        this.options.onEnd?.();
      };

      this.recorder.start();
      this.listening = true;
      this.options.onStart?.();
    } catch (err) {
      console.error("❌ CloudVoiceRecognition error:", err);
      this.options.onError?.("Erreur d'accès au micro");
      throw err;
    }
  }

  stop(): void {
    if (this.recorder && this.listening) {
      this.recorder.stop();
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.listening = false;
  }

  isListening(): boolean {
    return this.listening;
  }
}

/**
 * 🧩 Factory intelligente
 */
export class VoiceRecognitionFactory {
  static create(mode: VoiceRecognitionMode, options: VoiceRecognitionOptions) {
    return mode === "cloud"
      ? new CloudVoiceRecognition(options)
      : new BrowserVoiceRecognition(options);
  }

  static getBestAvailableMode(): VoiceRecognitionMode {
    const isIOS = /iPhone|iPad|iPod|CriOS|Safari/.test(navigator.userAgent);
     
    const browserSupported =
      !!(window as any).SpeechRecognition ||
      !!(window as any).webkitSpeechRecognition;
    if (isIOS && !browserSupported) return "cloud";
    return browserSupported ? "browser" : "cloud";
  }
}
