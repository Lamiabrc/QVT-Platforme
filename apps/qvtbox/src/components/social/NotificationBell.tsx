import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchUnreadNotificationsCount } from "@/lib/social";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type NotificationBellProps = {
  className?: string;
  compact?: boolean;
};

export default function NotificationBell({ className, compact = false }: NotificationBellProps) {
  const { user, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated || !user?.id) {
      setCount(0);
      return;
    }

    const refresh = async () => {
      try {
        const unread = await fetchUnreadNotificationsCount(user.id);
        if (!cancelled) setCount(unread);
      } catch {
        if (!cancelled) setCount(0);
      }
    };

    refresh();

    const channel = supabase
      .channel(`notifications-count-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        refresh
      )
      .subscribe();

    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [isAuthenticated, user?.id]);

  const label = useMemo(() => {
    if (count <= 0) return "Notifications";
    if (count > 99) return "99+";
    return String(count);
  }, [count]);

  return (
    <Link
      to="/notifications"
      className={cn(
        "relative inline-flex items-center justify-center rounded-full border border-[#3A332D] px-3 py-2 text-[#E5D7BF] transition hover:border-[#F3E0B9] hover:text-[#F3E0B9]",
        className
      )}
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      {!compact && <span className="ml-2 text-xs">Notifications</span>}
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#F3E0B9] px-1 text-[11px] font-semibold text-[#151515]">
          {label}
        </span>
      ) : null}
    </Link>
  );
}
