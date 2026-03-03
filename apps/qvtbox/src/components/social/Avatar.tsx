import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: number;
  className?: string;
};

const BG = [
  "bg-[#CFECE8] text-[#124D4A]",
  "bg-[#F3E0B9] text-[#5B3C0A]",
  "bg-[#E6F2E2] text-[#245024]",
  "bg-[#FBECDD] text-[#5F4028]",
  "bg-[#E8E7FF] text-[#31336B]",
  "bg-[#F6DDEB] text-[#6A224A]",
];

const initialsFromName = (name?: string | null) => {
  if (!name) return "QB";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "QB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const pickBg = (name?: string | null) => {
  if (!name) return BG[0];
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return BG[hash % BG.length];
};

export default function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const initials = useMemo(() => initialsFromName(name), [name]);
  const bg = useMemo(() => pickBg(name), [name]);

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        width={size}
        height={size}
        onError={() => setBroken(true)}
        className={cn(
          "rounded-full object-cover border border-[#E8DCC8] shadow-sm",
          className
        )}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      aria-label={name || "Avatar"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[#E8DCC8] font-semibold text-xs tracking-wide",
        bg,
        className
      )}
    >
      {initials}
    </div>
  );
}
