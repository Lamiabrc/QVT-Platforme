import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* =========================
 * Variants & Styles
 * ========================= */
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm",
        elevated: "border-border shadow-md",
        outline: "border-primary/20",
        ghost: "border-transparent shadow-none bg-transparent",
      },
      interactive: {
        false: "",
        true: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
    },
  }
);

/* =========================
 * Card Root
 * ========================= */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Rend la Card polymorphe (ex. <Link> ou <button>) */
  asChild?: boolean;
  /** Ajoute un role="button" + tabIndex si clickable (accessibilité) */
  clickable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, variant, interactive, clickable, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    const a11yProps =
      clickable || typeof onClick === "function"
        ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              (onClick as any)?.(e as any);
            }
          }}
        : {};

    return (
      <Comp
        ref={ref}
        className={cn(
          cardVariants({ variant, interactive: interactive || !!(clickable || onClick) }),
          className
        )}
        {...a11yProps}
        onClick={onClick as any}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

/* =========================
 * Card Header
 * ========================= */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

/* =========================
 * Card Title
 * ========================= */
const titleVariants = cva("font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h3 ref={ref} className={cn(titleVariants({ size }), className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

/* =========================
 * Card Description
 * ========================= */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

/* =========================
 * Card Content
 * ========================= */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

/* =========================
 * Card Footer
 * ========================= */
const footerVariants = cva("flex items-center p-6 pt-0", {
  variants: {
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
  },
  defaultVariants: {
    justify: "start",
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify, ...props }, ref) => (
    <div ref={ref} className={cn(footerVariants({ justify }), className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

/* =========================
 * Exports
 * ========================= */
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
