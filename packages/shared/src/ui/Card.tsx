import type { HTMLAttributes } from "react";

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border border-border/60 bg-card text-card-foreground shadow-soft ${className || ""}`}
    {...props}
  />
);
