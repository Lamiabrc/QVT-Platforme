import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AIModel = 
  | 'google/gemini-2.5-flash'
  | 'google/gemini-2.5-pro'
  | 'google/gemini-2.5-flash-lite'
  | 'openai/gpt-5'
  | 'openai/gpt-5-mini'
  | 'openai/gpt-5-nano';

interface UseZenaChatProps {
  memberRole?: 'parent' | 'ado';
  mode?: 'ai' | 'demo';
  model?: AIModel;
}

export function useZenaChat({ memberRole = 'ado', mode = 'ai', model = 'openai/gpt-5-mini' }: UseZenaChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis ZÉNA, votre compagnonne émotionnelle. Comment te sens-tu aujourd\'hui ? 🌟',
      timestamp: new Date()
    }
  ]);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || sending) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);

    // Mode démo : réponse simulée
    if (mode === 'demo') {
      setTimeout(() => {
        const demoResponses = [
          'Merci de partager tes émotions avec moi. Je comprends ce que tu ressens. 💙',
          'Je suis là pour t\'écouter sans jugement. Continue, je t\'écoute... 🌸',
          'C\'est normal de ressentir cela. Veux-tu en parler davantage ? ✨',
          'Ton ressenti est important. Comment puis-je t\'aider aujourd\'hui ? 💫'
        ];
        const aiMessage: Message = {
          role: 'assistant',
          content: demoResponses[Math.floor(Math.random() * demoResponses.length)],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setSending(false);
      }, 1500);
      return;
    }

    // Mode IA : appel à l'Edge Function avec streaming
    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-zena`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .concat([userMessage])
            .map(m => ({ role: m.role, content: m.content })),
          memberRole,
          model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          toast({
            title: "Trop de requêtes",
            description: "Merci de patienter un moment avant de réessayer.",
            variant: "destructive",
          });
          setSending(false);
          return;
        }
        
        if (response.status === 402) {
          toast({
            title: "Crédits insuffisants",
            description: "Les crédits IA sont épuisés.",
            variant: "destructive",
          });
          setSending(false);
          return;
        }

        const errorText = `${errorData?.error ?? ''} ${errorData?.msg ?? ''}`.toLowerCase();
        if (errorText.includes('unsupported provider') || errorText.includes('provider is not enabled')) {
          throw new Error("Ce modele n'est pas active. Selectionne un modele OpenAI.");
        }

        throw new Error(errorData.error || 'Erreur de connexion à ZÉNA');
      }

      if (!response.body) {
        throw new Error('Pas de réponse du serveur');
      }

      // Créer le message assistant vide qui sera rempli progressivement
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      // Gérer le streaming SSE
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        // Traiter les lignes SSE
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              // Mettre à jour le dernier message assistant
              setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: assistantContent
                  };
                }
                return newMessages;
              });
            }
          } catch (error) {
            // Ligne JSON incomplète, on attend plus de données
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Flush final du buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw || raw.startsWith(':') || !raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: assistantContent
                  };
                }
                return newMessages;
              });
            }
          } catch {
            // Ignorer les erreurs de parsing finales
          }
        }
      }

      setSending(false);

    } catch (error) {
      console.error('Erreur chat ZÉNA:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de contacter ZÉNA",
        variant: "destructive",
      });
      
      // Retirer le message utilisateur en cas d'erreur
      setMessages(prev => prev.slice(0, -2));
      setSending(false);
    }
  }, [messages, sending, memberRole, mode, model, toast]);

  const clearMessages = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: 'Bonjour ! Je suis ZÉNA, votre compagnonne émotionnelle. Comment te sens-tu aujourd\'hui ? 🌟',
      timestamp: new Date()
    }]);
  }, []);

  return {
    messages,
    sending,
    sendMessage,
    clearMessages
  };
}
