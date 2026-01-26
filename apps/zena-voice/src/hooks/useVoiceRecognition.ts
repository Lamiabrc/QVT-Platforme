import { useEffect, useState } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);

    if (isListening) {
      try {
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      try {
        recognition.stop();
      } catch (err) {
        // noop
      }
    }

    return () => {
      try {
        recognition.abort();
      } catch (err) {
        // noop
      }
    };
  }, [isListening]);

  return { isListening, transcript, startListening: () => setIsListening(true), stopListening: () => setIsListening(false) };
}
