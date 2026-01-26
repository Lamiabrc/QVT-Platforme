import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useZenaZenoBrain } from '@/hooks/useZenaZenoBrain';

// Mock de useZenaVoice
vi.mock('@/hooks/useZenaVoice', () => ({
  useZenaVoice: () => ({
    say: vi.fn(),
    isSpeaking: false,
    audioLevel: 0,
  }),
}));

// Mock de Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: 'test-user' } }, error: null })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(async () => ({ data: { id: 'session-123' }, error: null })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(async () => ({ data: [], error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(async () => ({ data: null, error: null })),
      })),
    })),
    functions: {
      invoke: vi.fn(async () => ({
        data: { reply: 'Bonjour! Comment puis-je t\'aider?' },
        error: null,
      })),
    },
  },
}));

// Mock du toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useZenaZenoBrain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit initialiser avec les valeurs par défaut', () => {
    const { result } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena' })
    );

    expect(result.current.messages).toEqual([]);
    expect(result.current.thinking).toBe(false);
    expect(result.current.emotionalState.mood).toBe('neutral');
    expect(result.current.emotionalState.score).toBe(8);
  });

  it('doit exposer les fonctions de contrôle', () => {
    const { result } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena' })
    );

    expect(typeof result.current.onUserSpeak).toBe('function');
    expect(typeof result.current.listen).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('doit avoir un état émotionnel initial neutre', () => {
    const { result } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena' })
    );

    expect(result.current.emotionalState).toEqual({
      mood: 'neutral',
      score: 8,
    });
  });

  it('doit supporter les deux personas', () => {
    const { result: zenaResult } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena' })
    );
    expect(zenaResult.current).toBeDefined();

    const { result: zenoResult } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zeno' })
    );
    expect(zenoResult.current).toBeDefined();
  });

  it('doit supporter différentes langues', () => {
    const { result: frResult } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena', language: 'fr-FR' })
    );
    expect(frResult.current).toBeDefined();

    const { result: enResult } = renderHook(() =>
      useZenaZenoBrain({ persona: 'zena', language: 'en-US' })
    );
    expect(enResult.current).toBeDefined();
  });
});
