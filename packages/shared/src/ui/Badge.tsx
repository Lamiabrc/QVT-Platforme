import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClass =
    variant === "outline"
      ? "border border-border/60 text-foreground"
      : "bg-accent text-accent-foreground";

  return <span className={`${base} ${variantClass} ${className || ""}`} {...props} />;
};
