import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ZenaChat from '@/pages/ZenaChat';

// Mock des hooks
vi.mock('@/hooks/useZenaZenoBrain', () => ({
  useZenaZenoBrain: () => ({
    isListening: false,
    speaking: false,
    thinking: false,
    messages: [],
    emotionalState: { mood: 'neutral', score: 8 },
    recommendedBox: null,
    onUserSpeak: vi.fn(),
    transcript: '',
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ZenaChat Integration', () => {
  it('doit afficher la page ZenaChat', () => {
    const { container } = render(
      <BrowserRouter>
        <ZenaChat />
      </BrowserRouter>
    );

    expect(container).toBeDefined();
  });

  it('doit afficher l\'avatar Zena', () => {
    const { container } = render(
      <BrowserRouter>
        <ZenaChat />
      </BrowserRouter>
    );

    expect(container.textContent).toContain('ZÉNA');
  });

  it('doit afficher les sélecteurs de langue', () => {
    const { container } = render(
      <BrowserRouter>
        <ZenaChat />
      </BrowserRouter>
    );

    expect(container.textContent).toContain('FR');
    expect(container.textContent).toContain('EN');
  });
});
