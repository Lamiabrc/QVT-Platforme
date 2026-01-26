import { useState } from "react";
import SphereLayout from "@/components/SphereLayout";
import { ZenaChat, ZenaChatMessage } from "@qvt/shared";

const disclaimer =
  "ZENA n'est pas un service d'urgence. En cas de danger immediat, contactez les secours.";

const FamilyChatPage = () => {
  const [messages, setMessages] = useState<ZenaChatMessage[]>([]);

  const sendMessage = async (content: string) => {
    const userMessage: ZenaChatMessage = {
      id: crypto.randomUUID(),
      author: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const apiUrl = import.meta.env.VITE_ZENA_API_URL as string | undefined;
    if (apiUrl) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sphere: "family", message: content }),
        });
        const data = await response.json();
        const reply = String(data?.reply ?? "Je suis la.");
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            author: "zena",
            content: reply,
            createdAt: new Date().toISOString(),
          },
        ]);
        return;
      } catch {
        // fallback below
      }
    }

    const fallback = content.toLowerCase().includes("harce")
      ? "Merci d'en parler. Souhaitez-vous declencher une alerte ou en parler a un guardian ?"
      : "Je t'ecoute. Tu veux decrire ce que tu ressens en ce moment ?";

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: "zena",
        content: fallback,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <SphereLayout
      sphere="family"
      title="Chat ZENA - Famille"
      description="Espace de parole adolescent/parent avec reponses empathiques et actions suggerees."
    >
      <ZenaChat sphere="family" role="guardian/teen" messages={messages} onSend={sendMessage} disclaimer={disclaimer} />
    </SphereLayout>
  );
};

export default FamilyChatPage;
