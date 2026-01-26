// src/lib/tts.ts
// =============================================================
// ZÉNA TTS : ElevenLabs (si dispo) -> sinon Web Speech FR féminine
// - speakWithZena(text, onProgress)  // onProgress: "start" | "tick" | "end"
// - stopSpeaking()
// =============================================================

let currentAudio: HTMLAudioElement | null = null;
let tickTimer: number | null = null;
let usingWebSpeech = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || "";
// Voix féminine FR/Multilingue (remplace par ta préférée si besoin)
const ELEVEN_VOICE_ID =
  import.meta.env.VITE_ELEVENLABS_VOICE_ID || "jVX5RZMRPwoS6ZQp9BOi"; // "Rachel"

const TTS_PROVIDER = (import.meta.env.VITE_TTS_PROVIDER || "").toLowerCase();
// "elevenlabs" | "webspeech" | "" (auto -> elevenlabs si clé, sinon webspeech)

// Priorité aux voix féminines FR (Google/Apple) pour éviter Microsoft
const PREFERRED_FR_FEMALE = [
  "Google français", "Google français (France)", "Google Français", "Google fr-FR",
  "Amélie", "Aurélie", "Virginie", // Apple
  "France Female", "Français Féminin",
];

export function stopSpeaking() {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }
  } catch {
    // noop
  }
  if (tickTimer) {
    window.clearInterval(tickTimer);
    tickTimer = null;
  }
  if (usingWebSpeech && window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export async function speakWithZena(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
): Promise<void> {
  stopSpeaking();

  const preferEleven = (TTS_PROVIDER === "elevenlabs" || TTS_PROVIDER === "") && ELEVEN_API_KEY;
  if (preferEleven) {
    try {
      await speakWithElevenLabs(text, onProgress);
      return;
    } catch (e) {
      console.warn("⚠️ ElevenLabs indisponible, fallback Web Speech :", e);
    }
  }
  await speakWithWebSpeech(text, onProgress);
}

/* ---------------- ElevenLabs ---------------- */
async function speakWithElevenLabs(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}?optimize_streaming_latency=2`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${msg}`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  currentAudio = new Audio(objectUrl);
  currentAudio.onplay = () => {
    onProgress?.("start");
    tickTimer = window.setInterval(() => onProgress?.("tick"), 90);
  };
  const cleanup = () => {
    if (tickTimer) {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }
    onProgress?.("end");
    URL.revokeObjectURL(objectUrl);
    currentAudio = null;
  };
  currentAudio.onended = cleanup;
  currentAudio.onerror = cleanup;

  await currentAudio.play();
}

/* ---------------- Web Speech ---------------- */
async function speakWithWebSpeech(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
) {
  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn("Web Speech non dispo.");
    onProgress?.("end");
    return;
  }
  usingWebSpeech = true;

  const voices = await loadVoices();
  const voice = chooseFemaleFrenchVoice(voices);

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 1;     // parler naturel
  u.pitch = 1.05; // timbre féminin léger
  u.volume = 1;
  if (voice) u.voice = voice;

  currentUtterance = u;
  u.onstart = () => onProgress?.("start");
  u.onend = () => {
    onProgress?.("end");
    currentUtterance = null;
  };
  u.onboundary = () => onProgress?.("tick");
  u.onerror = () => onProgress?.("end");

  synth.speak(u);
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve([]);
  const existing = synth.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const handler = () => {
      const vs = synth.getVoices();
      resolve(vs);
      synth.removeEventListener("voiceschanged", handler);
    };
    synth.addEventListener("voiceschanged", handler);
    setTimeout(() => {
      const vs = synth.getVoices();
      resolve(vs);
      synth.removeEventListener("voiceschanged", handler);
    }, 800);
  });
}

function chooseFemaleFrenchVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices?.length) return null;

  // 1) Voix FR
  const fr = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("fr"));

  // 2) Parmi FR, préférer noms féminins Google/Apple
  for (const pref of PREFERRED_FR_FEMALE) {
    const found = fr.find((v) => v.name.toLowerCase().includes(pref.toLowerCase()));
    if (found) return found;
  }

  // 3) Sinon, première FR
  if (fr.length) return fr[0];

  // 4) Sinon, Google (souvent plus naturel que Microsoft)
  const google = voices.find((v) => v.name.toLowerCase().includes("google"));
  if (google) return google;

  // 5) Dernier recours
  return voices[0] || null;
}
