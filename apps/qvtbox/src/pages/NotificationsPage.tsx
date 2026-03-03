import { useEffect, useState } from "react";
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

const labelFromType = (type: NotificationItem["type"]) => {
  if (type === "invitation") return "Invitation";
  if (type === "new_post") return "Nouveau post";
  if (type === "reply") return "Réponse";
  if (type === "help_request") return "Demande d'aide";
  return "Notification";
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);

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
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read_at: new Date().toISOString() } : item)));
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

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />
      <main className="px-6 pb-20 pt-32 md:pt-36">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#9C8D77]">Notifications</p>
              <h1 className="mt-3 text-3xl font-semibold">Cloche de la bulle</h1>
              <p className="mt-2 text-sm text-[#6F6454]">{unread} non lues</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={markAll}
                className="rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold"
              >
                Marquer tout comme lu
              </button>
              <Link to="/bulles" className="rounded-full bg-[#1B1A18] px-4 py-2 text-sm font-semibold text-[#FAF6EE]">
                Mes bulles
              </Link>
            </div>
          </div>

          <section className="mt-6 space-y-3">
            {loading ? (
              <div className="rounded-3xl border border-[#E8DCC8] bg-white p-5 text-sm text-[#6F6454]">
                Chargement...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCCEB7] bg-white p-8 text-center">
                <p className="text-sm text-[#6F6454]">Aucune notification pour le moment.</p>
              </div>
            ) : (
              items.map((item) => (
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
                        name={item.actor?.full_name || item.actor?.email || item.actor_id || "QVT Box"}
                        src={item.actor_id ? `/avatars/avatar-${(item.actor_id.charCodeAt(0) % 12) + 1}.svg` : "/avatars/avatar-1.svg"}
                        size={36}
                      />
                      <div>
                        <p className="text-sm font-semibold">{labelFromType(item.type)}</p>
                        <p className="mt-1 text-xs text-[#6F6454]">
                          {item.actor?.full_name || item.actor?.email || "Système"} • {formatDate(item.created_at)}
                        </p>
                        {item.bubble_id ? (
                          <Link to={`/bulle/${item.bubble_id}`} className="mt-2 inline-flex text-xs font-semibold text-[#1B1A18] underline">
                            Ouvrir la bulle
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    {!item.read_at ? (
                      <button type="button" onClick={() => markOne(item.id)} className="text-xs text-[#9C8D77] hover:text-[#1B1A18]">
                        Marquer lu
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
