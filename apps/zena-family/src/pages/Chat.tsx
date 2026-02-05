import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useZenaChat, AIModel } from "@/hooks/useZenaChat";
import { ZenaAvatar } from "@/components/zena/ZenaAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Mic, Sparkles, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModelSelector } from "@/components/chat/ModelSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Chat() {
  const navigate = useNavigate();
  const { user, currentMember, loading } = useAuth();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'ai' | 'demo'>('ai');
  const [model, setModel] = useState<AIModel>('google/gemini-2.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sending, sendMessage } = useZenaChat({
    memberRole: currentMember?.role === 'parent' ? 'parent' : 'ado',
    mode,
    model
  });

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
    await sendMessage(input);
    setInput('');
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
          <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <p className="text-xs text-zena-turquoise">En ligne</p>
                  {mode === 'ai' && (
                    <Badge variant="outline" className="text-xs border-zena-turquoise/30 text-zena-turquoise">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA Active
                    </Badge>
                  )}
                  {mode === 'demo' && (
                    <Badge variant="outline" className="text-xs border-zena-violet/30 text-zena-violet">
                      Mode Démo
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Paramètres ZÉNA</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMode(mode === 'ai' ? 'demo' : 'ai')}>
                  {mode === 'ai' ? '🎭 Passer en mode Démo' : '✨ Activer l\'IA'}
                </DropdownMenuItem>
                {mode === 'ai' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Modèle IA
                    </DropdownMenuLabel>
                    <div className="px-2 py-2">
                      <ModelSelector value={model} onChange={setModel} disabled={sending} />
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
