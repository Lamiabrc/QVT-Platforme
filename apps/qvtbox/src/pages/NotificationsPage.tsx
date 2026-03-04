import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/social";
import type { NotificationItem } from "@/lib/social";
import Avatar from "@/components/social/Avatar";

const formatDate = (value: string) =>
  new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

type FilterKey = "all" | "unread" | "invitation" | "help_request";

const labelFromType = (type: NotificationItem["type"]) => {
  if (type === "invitation") return "Invitation";
  if (type === "new_post") return "Nouveau message";
  if (type === "reply") return "Réponse";
  if (type === "help_request") return "Demande d’aide";
  return "Notification";
};

const describeNotification = (item: NotificationItem) => {
  const actor = item.actor?.full_name || item.actor?.email || (item.actor_id ? item.actor_id.slice(0, 8) : "QVT Box");

  // payload can include anything, keep it defensive
  const payload: any = item.payload ?? {};
  const snippet =
    typeof payload?.content === "string"
      ? payload.content.slice(0, 140)
      : typeof payload?.message === "string"
        ? payload.message.slice(0, 140)
        : null;

  if (item.type === "invitation") {
    return `${actor} vous a invité(e) à rejoindre une bulle.`;
  }
  if (item.type === "help_request") {
    return `🆘 ${actor} a demandé de l’aide.`;
  }
  if (item.type === "reply") {
    return `${actor} a répondu à un message.`;
  }
  if (item.type === "new_post") {
    return `${actor} a publié un nouveau message.`;
  }
  return snippet ? `${actor} : ${snippet}` : `${actor} vous a notifié(e).`;
};

const primaryAction = (item: NotificationItem) => {
  // Best-effort routes. If some IDs are null, we fallback to bubble.
  if (item.type === "invitation" && item.invitation_id) {
    // We don't have the token here (by design). So route to notifications/bubbles.
    // In MVP, we open bubble if available, otherwise bulles.
    if (item.bubble_id) return { label: "Voir la bulle", to: `/bulle/${item.bubble_id}` };
    return { label: "Mes bulles", to: "/bulles" };
  }

  if ((item.type === "new_post" || item.type === "reply" || item.type === "help_request") && item.bubble_id) {
    // We don't have anchor-to-post yet; bubble is still the best action.
    return { label: "Ouvrir la bulle", to: `/bulle/${item.bubble_id}` };
  }

  return { label: "Mes bulles", to: "/bulles" };
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      setItems(await fetchNotifications(user.id));
    } catch (error: any) {
      toast({
        title: "Notifications indisponibles",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const markOne = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read_at: new Date().toISOString() } : item
        )
      );
    } catch {
      // no-op
    }
  };

  const markAll = async () => {
    if (!user?.id) return;
    try {
      await markAllNotificationsAsRead(user.id);
      const nowIso = new Date().toISOString();
      setItems((prev) => prev.map((item) => ({ ...item, read_at: item.read_at ?? nowIso })));
    } catch (error: any) {
      toast({
        title: "Impossible de tout marquer",
        description: error?.message ?? "Réessayez dans quelques instants.",
        variant: "destructive",
      });
    }
  };

  const unread = items.filter((item) => !item.read_at).length;

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((i) => !i.read_at);
    return items.filter((i) => i.type === filter);
  }, [items, filter]);

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Centre d’activité</p>
              <h1 className="mt-3 text-3xl font-semibold">Cloche de la bulle</h1>
              <p className="mt-2 text-sm text-[#6F6454]">{unread} non lues</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={markAll}
                className="rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold"
              >
                Tout marquer comme lu
              </button>
              <Link
                to="/bulles"
                className="rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]"
              >
                Mes bulles
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tout" },
              { key: "unread", label: "Non lues" },
              { key: "invitation", label: "Invitations" },
              { key: "help_request", label: "Aide" },
            ].map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key as FilterKey)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  filter === f.key
                    ? "bg-[#1B1A18] text-[#FAF6EE]"
                    : "border border-[#E8DCC8] bg-white text-[#6F6454]",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>

          <section className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-5 text-sm text-[#6F6454]">
                Chargement...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-8 text-center">
                <p className="text-sm text-[#6F6454]">Aucune notification ici pour le moment.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const actorName =
                  item.actor?.full_name || item.actor?.email || item.actor_id || "QVT Box";
                const action = primaryAction(item);

                return (
                  <article
                    key={item.id}
                    className={[
                      "rounded-3xl border bg-white p-4",
                      item.read_at ? "border-[#E8DCC8]" : "border-[#BFA776]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={actorName}
                          src={
                            item.actor_id
                              ? `/avatars/avatar-${(item.actor_id.charCodeAt(0) % 12) + 1}.svg`
                              : "/avatars/avatar-1.svg"
                          }
                          size={36}
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{labelFromType(item.type)}</p>
                          <p className="mt-1 text-xs text-[#6F6454]">
                            {item.actor?.full_name || item.actor?.email || "Système"} •{" "}
                            {formatDate(item.created_at)}
                          </p>

                          <p className="mt-2 text-sm text-[#2E2923]">
                            {describeNotification(item)}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              to={action.to}
                              className="inline-flex rounded-full bg-[#1B1A18] px-4 py-2 text-xs font-semibold text-[#FAF6EE]"
                              onClick={() => {
                                if (!item.read_at) markOne(item.id);
                              }}
                            >
                              {action.label}
                            </Link>

                            {!item.read_at ? (
                              <button
                                type="button"
                                onClick={() => markOne(item.id)}
                                className="rounded-full border border-[#E8DCC8] px-4 py-2 text-xs font-semibold"
                              >
                                Marquer lu
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {!item.read_at ? (
                        <span className="rounded-full bg-[#F3E0B9]/55 px-2 py-1 text-[11px] font-semibold text-[#5F4B2E]">
                          Nouveau
                        </span>
                      ) : null}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
