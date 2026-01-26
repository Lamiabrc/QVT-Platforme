import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors";
  const variantClass =
    variant === "secondary"
      ? "bg-muted text-foreground hover:bg-muted/80"
      : variant === "ghost"
        ? "bg-transparent text-foreground hover:bg-muted/60"
        : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <button className={`${base} ${variantClass} ${className || ""}`} {...props} />
  );
};
