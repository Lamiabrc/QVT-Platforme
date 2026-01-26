import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  HelpCircle,
  Package,
  ShoppingCart
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AssistantChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AssistantChatBot = ({ isOpen, onToggle }: AssistantChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant QVT Box. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
      suggestions: [
        'Recommander des produits',
        'Configurer une box',
        'Informations livraison',
        'Support technique'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    produits: [
      'Voici nos catégories principales : Bien-être, Ergonomie, Énergie, et Terroir Local. Quelle catégorie vous intéresse ?',
      'Pour des recommandations personnalisées, pouvez-vous me dire la taille de votre équipe et vos préférences ?'
    ],
    box: [
      'Nos box thématiques sont parfaites pour créer du lien d\'équipe ! Souhaitez-vous une box Bien-être, Énergie, Café & Gourmandise, ou Événementielle ?',
      'Je peux vous aider à configurer une box sur mesure. Combien êtes-vous dans l\'équipe ?'
    ],
    livraison: [
      'Nous livrons en 48h en moyenne partout en France métropolitaine. Livraison gratuite dès 50€ d\'achat !',
      'Nos partenaires logistiques privilégient les circuits courts et les modes de transport décarbonés.'
    ],
    prix: [
      'Nos produits vont de 8€ à 45€. Les box commencent à 32€ par personne. Souhaitez-vous un devis personnalisé ?',
      'Pour une estimation précise, utilisez notre configurateur de box ou demandez-moi des recommandations spécifiques.'
    ],
    support: [
      'Pour un support technique immédiat, vous pouvez me poser votre question ici ou contacter notre équipe au 01 23 45 67 89.',
      'Quel type de problème rencontrez-vous ? Je peux vous orienter vers la bonne solution.'
    ],
    default: [
      'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ?',
      'Voici ce que je peux vous aider à faire : recommander des produits, configurer une box, informations sur la livraison, ou support technique.',
      'N\'hésitez pas à être plus spécifique dans votre demande !'
    ]
  };

  const generateBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    if (message.includes('produit') || message.includes('recommand')) {
      response = botResponses.produits[Math.floor(Math.random() * botResponses.produits.length)];
      suggestions = ['Bien-être', 'Ergonomie', 'Énergie', 'Terroir Local'];
    } else if (message.includes('box') || message.includes('configur')) {
      response = botResponses.box[Math.floor(Math.random() * botResponses.box.length)];
      suggestions = ['Box Bien-être', 'Box Énergie', 'Box Café', 'Box Événementielle'];
    } else if (message.includes('livr') || message.includes('délai')) {
      response = botResponses.livraison[Math.floor(Math.random() * botResponses.livraison.length)];
      suggestions = ['Zones de livraison', 'Frais de port', 'Suivi commande'];
    } else if (message.includes('prix') || message.includes('coût') || message.includes('tarif')) {
      response = botResponses.prix[Math.floor(Math.random() * botResponses.prix.length)];
      suggestions = ['Devis personnalisé', 'Remises équipes', 'Options paiement'];
    } else if (message.includes('aide') || message.includes('support') || message.includes('problème')) {
      response = botResponses.support[Math.floor(Math.random() * botResponses.support.length)];
      suggestions = ['Contact téléphone', 'Email support', 'FAQ'];
    } else {
      response = botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
      suggestions = ['Recommander des produits', 'Configurer une box', 'Informations livraison', 'Support technique'];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botMessage = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-primary shadow-floating z-50 hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`card-professional w-96 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <CardTitle className="flex items-center gap-2 text-lg font-inter">
            <Bot className="w-5 h-5 text-primary" />
            Assistant QVT Box
            <Badge variant="secondary" className="text-xs">En ligne</Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-y-auto p-4 h-80">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg font-lato text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background-soft border border-accent/20'
                      }`}
                    >
                      <p>{message.content}</p>
                      {message.suggestions && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-auto py-1 px-2 font-lato"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-background-soft border border-accent/20 p-3 rounded-lg">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 font-lato"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex justify-center gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick('Recommander des produits')}
                  className="text-xs font-lato"
                >
                  <Package className="w-3 h-3 mr-1" />
                  Produits
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick('Configurer une box')}
                  className="text-xs font-lato"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Box
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick('Support technique')}
                  className="text-xs font-lato"
                >
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Aide
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .typing-indicator {
            display: flex;
            gap: 2px;
          }
          .typing-indicator span {
            width: 4px;
            height: 4px;
            background: hsl(var(--muted-foreground));
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
          }
          .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
          .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
          .typing-indicator span:nth-child(3) { animation-delay: 0s; }
          
          @keyframes typing {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `
      }} />
    </div>
  );
};