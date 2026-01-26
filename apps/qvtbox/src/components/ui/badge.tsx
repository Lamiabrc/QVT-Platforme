import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-input text-foreground",
        subtle: "border-transparent bg-muted text-foreground",
        success: "border-transparent bg-emerald-600/90 text-white",
        warning: "border-transparent bg-amber-500/90 text-white",
        info: "border-transparent bg-sky-600/90 text-white",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
      clickable: {
        false: "",
        true: "cursor-pointer hover:opacity-95 active:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      clickable: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Rend le badge polymorphe (ex. <Link>, <button>, etc.) */
  asChild?: boolean;
  /** Icône à gauche (lucide-react ou autre) */
  leftIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Icône à droite */
  rightIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Petit point de statut (couleur via tailwind class) */
  dotClassName?: string; // ex: "bg-emerald-500"
  /** Rendre dismissible (croix) */
  dismissible?: boolean;
  /** Callback quand on ferme le badge */
  onDismiss?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      clickable,
      asChild,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      dotClassName,
      dismissible,
      onDismiss,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    const a11yProps =
      clickable || typeof onClick === "function"
        ? {
            role: "button",
            tabIndex: 0,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                (onClick as any)?.(e);
              }
            },
          }
        : {};

    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant, size, clickable }), "gap-1", className)}
        onClick={onClick as any}
        {...a11yProps}
        {...props}
      >
        {dotClassName && (
          <span
            className={cn("inline-block h-2 w-2 rounded-full", dotClassName)}
            aria-hidden="true"
          />
        )}
        {LeftIcon && <LeftIcon className="h-3.5 w-3.5" aria-hidden="true" />}
        <span className="inline-block">{props.children}</span>
        {RightIcon && <RightIcon className="h-3.5 w-3.5" aria-hidden="true" />}

        {dismissible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="ml-1 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </Comp>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
