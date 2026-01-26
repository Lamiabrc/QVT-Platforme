import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import VoiceControl from '@/components/VoiceControl';

describe('VoiceControl', () => {
  const mockOnToggleListening = vi.fn();

  beforeEach(() => {
    mockOnToggleListening.mockClear();
  });

  it('doit afficher le bouton micro', () => {
    const { container } = render(
      <VoiceControl
        onToggleListening={mockOnToggleListening}
        isListening={false}
        transcript=""
        isSpeaking={false}
      />
    );

    const button = container.querySelector('button');
    expect(button).toBeDefined();
  });

  it('doit afficher le message par défaut quand aucun texte', () => {
    const { container } = render(
      <VoiceControl
        onToggleListening={mockOnToggleListening}
        isListening={false}
        transcript=""
        isSpeaking={false}
      />
    );

    expect(container.textContent).toContain('Votre voix s\'affichera ici');
  });

  it('doit afficher le transcript quand disponible', () => {
    const { container } = render(
      <VoiceControl
        onToggleListening={mockOnToggleListening}
        isListening={false}
        transcript="Bonjour Zena"
        isSpeaking={false}
      />
    );

    expect(container.textContent).toContain('Bonjour Zena');
  });

  it('doit afficher l\'état "ZÉNA parle" quand isSpeaking est true', () => {
    const { container } = render(
      <VoiceControl
        onToggleListening={mockOnToggleListening}
        isListening={false}
        transcript=""
        isSpeaking={true}
      />
    );

    expect(container.textContent).toContain('ZÉNA parle');
  });

  it('doit afficher l\'état "ZÉNA vous écoute" quand isListening est true', () => {
    const { container } = render(
      <VoiceControl
        onToggleListening={mockOnToggleListening}
        isListening={true}
        transcript=""
        isSpeaking={false}
      />
    );

    expect(container.textContent).toContain('ZÉNA vous écoute');
  });
});
