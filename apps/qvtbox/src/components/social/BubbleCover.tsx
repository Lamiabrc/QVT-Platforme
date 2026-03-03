import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type BubbleCoverProps = {
  title?: string | null;
  src?: string | null;
  className?: string;
};

const titleInitials = (value?: string | null) => {
  if (!value) return "QB";
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "QB";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export default function BubbleCover({ title, src, className }: BubbleCoverProps) {
  const [broken, setBroken] = useState(false);
  const initials = useMemo(() => titleInitials(title), [title]);

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={title || "Cover bulle"}
        onError={() => setBroken(true)}
        className={cn("h-28 w-full rounded-2xl object-cover border border-[#E8DCC8]", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "h-28 w-full rounded-2xl border border-[#E8DCC8]",
        "bg-[radial-gradient(circle_at_10%_20%,rgba(207,236,232,0.95),rgba(207,236,232,0.4)_35%,transparent_65%),radial-gradient(circle_at_85%_70%,rgba(243,224,185,0.95),rgba(243,224,185,0.3)_38%,transparent_65%),linear-gradient(135deg,#F8F3E9,#F2F7F4)]",
        "flex items-center justify-center",
        className
      )}
    >
      <span className="rounded-full bg-white/85 px-3 py-1 text-sm font-semibold text-[#3B3328]">
        {initials}
      </span>
    </div>
  );
}
