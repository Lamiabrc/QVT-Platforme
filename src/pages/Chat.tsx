import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, currentMember, loading } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis ZÉNA, votre compagnonne émotionnelle. Comment te sens-tu aujourd\'hui ? 🌟',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    // Simuler une réponse de ZÉNA (à remplacer par l'appel à l'edge function)
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: 'Merci de partager tes émotions avec moi. Je comprends ce que tu ressens. Comment puis-je t\'aider aujourd\'hui ? 💙',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setSending(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 flex items-center justify-center">
        <div className="animate-pulse">
          <ZenaAvatar size="lg" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zena-night to-zena-night/80 flex flex-col pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-zena-night/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <ZenaAvatar size="sm" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">ZÉNA</h1>
              <p className="text-xs text-zena-turquoise">En ligne</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-4 max-w-3xl">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {message.role === 'assistant' && (
                <ZenaAvatar size="sm" />
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-zena-turquoise to-zena-violet text-white ml-auto'
                    : 'bg-card text-foreground border border-border'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <ZenaAvatar size="sm" />
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-zena-turquoise rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-zena-turquoise rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-zena-turquoise rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-zena-night/50 backdrop-blur-lg border-t border-white/10 sticky bottom-0">
        <div className="container mx-auto px-4 py-4 max-w-3xl">
          <div className="flex gap-2 items-end">
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0 border-zena-turquoise/30 text-zena-turquoise hover:bg-zena-turquoise/10"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Parle-moi de tes émotions..."
              className="resize-none bg-card border-border"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex-shrink-0 bg-gradient-to-r from-zena-turquoise to-zena-violet hover:opacity-90"
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
