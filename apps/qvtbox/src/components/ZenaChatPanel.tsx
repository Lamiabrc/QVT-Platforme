import { useEffect, useMemo, useState } from "react";
import { ZenaChat, type ZenaChatMessage } from "@qvt/shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type ZenaChatPanelProps = {
  sphere: "family" | "company";
  title?: string;
  subtitle?: string;
  familyId?: string | null;
  companyId?: string | null;
};

const mapMessage = (message: any): ZenaChatMessage => ({
  id: message.id,
  author: message.author,
  content: message.content,
  createdAt: message.created_at,
});

export default function ZenaChatPanel({
  sphere,
  title = "Parlez à ZÉNA",
  subtitle = "ZÉNA écoute, reformule, et déclenche des signaux faibles si besoin.",
  familyId,
  companyId,
}: ZenaChatPanelProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ZenaChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canPersist = isAuthenticated && !!user;

  const placeholder = useMemo(() => {
    if (!canPersist) return "Mode invité : vos messages ne seront pas sauvegardés.";
    return "Parlez à ZÉNA...";
  }, [canPersist]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!canPersist || !user) return;
      const { data: convo } = await (supabase as any)
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("sphere", sphere)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (convo?.id) {
        setConversationId(convo.id);
        const { data: msgs } = await (supabase as any)
          .from("messages")
          .select("id, author, content, created_at")
          .eq("conversation_id", convo.id)
          .order("created_at", { ascending: true });
        setMessages((msgs || []).map(mapMessage));
      }
    };

    loadConversation();
  }, [canPersist, user, sphere]);

  const handleSend = async (content: string) => {
    const now = new Date().toISOString();
    const localMessage: ZenaChatMessage = {
      id: `${now}-user`,
      author: "user",
      content,
      createdAt: now,
    };

    setMessages((prev) => [...prev, localMessage]);

    if (!canPersist || !user) {
      const fallbackReply: ZenaChatMessage = {
        id: `${now}-zena`,
        author: "zena",
        content:
          "Je suis là. En mode invité, je t’écoute sans sauvegarder. Si tu veux garder l’historique, connecte-toi.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/zena/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          sphere,
          userId: user.id,
          conversationId,
          familyId: familyId ?? null,
          companyId: companyId ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre ZÉNA pour le moment.");
      }

      const data = await response.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const replyMessage: ZenaChatMessage = {
        id: data.replyId ?? `${Date.now()}-zena`,
        author: "zena",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, replyMessage]);

      if (data.risk?.score >= 0.6) {
        toast({
          title: "Signal faible détecté",
          description: "ZÉNA a détecté un signal faible et a enregistré une alerte.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message ?? "ZÉNA est indisponible.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ZenaChat
        sphere={sphere}
        role={sphere === "family" ? "parent" : "employee"}
        messages={messages}
        onSend={handleSend}
        placeholder={placeholder}
        disclaimer={
          loading
            ? "ZÉNA réfléchit..."
            : "ZÉNA ne remplace pas les urgences. En cas de danger immédiat, contactez les secours."
        }
      />
    </div>
  );
}
