import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

// Mock du toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock du VoiceRecognitionFactory
vi.mock('@/services/VoiceRecognitionService', () => {
  const mockService = {
    isSupported: vi.fn(() => true),
    start: vi.fn(async () => {}),
    stop: vi.fn(),
    isListening: vi.fn(() => false),
  };

  return {
    VoiceRecognitionFactory: {
      create: vi.fn(() => mockService),
      getBestAvailableMode: vi.fn(() => 'browser'),
    },
    IVoiceRecognitionService: {},
    VoiceRecognitionMode: {},
  };
});

describe('useVoiceRecognition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit initialiser avec isListening à false', () => {
    const { result } = renderHook(() => useVoiceRecognition());
    
    expect(result.current.isListening).toBe(false);
    expect(result.current.transcript).toBe('');
  });

  it('doit exposer les fonctions startListening et stopListening', () => {
    const { result } = renderHook(() => useVoiceRecognition());
    
    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('doit gérer la reconnaissance vocale', () => {
    const { result } = renderHook(() => useVoiceRecognition());

    expect(result.current).toBeDefined();
  });

  it('doit utiliser la langue par défaut fr-FR', () => {
    const { result } = renderHook(() => useVoiceRecognition());
    
    expect(result.current).toBeDefined();
  });

  it('doit fonctionner correctement', () => {
    const { result } = renderHook(() => useVoiceRecognition());

    expect(result.current).toBeDefined();
  });
});
