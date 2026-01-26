/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserVoiceRecognition, VoiceRecognitionFactory } from "@/services/VoiceRecognitionService";

describe("BrowserVoiceRecognition", () => {
  beforeEach(() => {
    // Mock de l'API Web Speech
    global.window = {
      SpeechRecognition: vi.fn().mockImplementation(() => ({
        lang: "",
        continuous: false,
        interimResults: false,
        maxAlternatives: 1,
        start: vi.fn(),
        stop: vi.fn(),
        onresult: null,
        onerror: null,
        onend: null,
        onstart: null,
      })),
    } as any;
  });

  it("doit être supporté quand Web Speech API est disponible", () => {
    const service = new BrowserVoiceRecognition({});
    expect(service.isSupported()).toBe(true);
  });

  it("doit initialiser avec les options par défaut", () => {
    const service = new BrowserVoiceRecognition({
      lang: "fr-FR",
      continuous: false,
      interimResults: true,
    });

    expect(service).toBeDefined();
    expect(service.isListening()).toBe(false);
  });

  it("doit exposer les méthodes de contrôle", () => {
    const service = new BrowserVoiceRecognition({});

    expect(typeof service.start).toBe("function");
    expect(typeof service.stop).toBe("function");
    expect(typeof service.isListening).toBe("function");
    expect(typeof service.isSupported).toBe("function");
  });
});

describe("VoiceRecognitionFactory", () => {
  it("doit créer un service browser", () => {
    const service = VoiceRecognitionFactory.create("browser", {});
    expect(service).toBeInstanceOf(BrowserVoiceRecognition);
  });

  it("doit retourner le meilleur mode disponible", () => {
    global.window = {
      SpeechRecognition: vi.fn(),
    } as any;

    const mode = VoiceRecognitionFactory.getBestAvailableMode();
    expect(mode).toBe("browser");
  });
});
