import { useState } from "react";

export type ZenaChatMessage = {
  id: string;
  author: "user" | "zena";
  content: string;
  createdAt: string;
};

export type ZenaChatProps = {
  sphere: "family" | "company";
  role: string;
  messages: ZenaChatMessage[];
  onSend: (message: string) => void;
  placeholder?: string;
  disclaimer?: string;
};

export const ZenaChat = ({
  sphere,
  role,
  messages,
  onSend,
  placeholder = "Parlez à ZÉNA...",
  disclaimer,
}: ZenaChatProps) => {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
      <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Sphère: {sphere} · Rôle: {role}
      </div>
      <div className="space-y-3 max-h-[45vh] overflow-auto pr-2">
        {messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            ZÉNA est prête à écouter.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl px-4 py-2 text-sm ${
                message.author === "user"
                  ? "bg-primary/10 text-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Envoyer
        </button>
      </form>
      {disclaimer ? (
        <p className="mt-3 text-[11px] text-muted-foreground">{disclaimer}</p>
      ) : null}
    </div>
  );
};
