import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes & tailles (identiques à ta version)
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-white shadow-primary hover:scale-105 hover:shadow-floating hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-primary bg-white/50 backdrop-blur-sm text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-primary hover:scale-105 hover:-translate-y-0.5",
        secondary:
          "bg-gradient-secondary text-white shadow-secondary hover:scale-105 hover:shadow-floating hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        premium:
          "bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-glow hover:shadow-xl hover:scale-105 hover:-translate-y-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      loading: {
        true: "relative cursor-progress",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Polymorphisme : si true, on essaie de rendre l’unique enfant (ex: <Link>)
   * en lui injectant les classes & props du bouton.
   * Si l’enfant n’est pas un élément React valide unique => fallback <button>.
   */
  asChild?: boolean;
  /** Affiche un spinner, met aria-busy et désactive le bouton */
  loading?: boolean;
  /** Force la largeur à 100% */
  fullWidth?: boolean;
  /** Icône à gauche (lucide-react, etc.) */
  leftIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Icône à droite */
  rightIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/** Petit spinner */
const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn("animate-spin", className)} viewBox="0 0 24 24" aria-hidden="true">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/**
 * Helper : vérifie si on a exactement 1 enfant élément React valide.
 */
function getSingleValidChild(children: React.ReactNode) {
  if (React.Children.count(children) !== 1) return null;
  const child = React.Children.only(children);
  return React.isValidElement(child) ? (child as React.ReactElement) : null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      fullWidth = false,
      asChild = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      disabled,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size, loading, fullWidth }), className);
    const isDisabled = disabled || loading;

    // Mode “asChild” SAFE : on clone si et seulement si un enfant valide unique est présent.
    if (asChild) {
      const onlyChild = getSingleValidChild(children);

      if (onlyChild) {
        // Fusion des className & props sur l’enfant
        const childProps: any = {
          className: cn(onlyChild.props.className, classes),
          "aria-busy": loading || undefined,
          "aria-disabled": isDisabled || undefined,
          onKeyDown: (e: React.KeyboardEvent) => {
            // Permet Space/Enter d’activer les éléments non-button
            if (onKeyDown) onKeyDown(e as any);
            const el = e.currentTarget as HTMLElement;
            const tag = el.tagName.toLowerCase();
            const isButtonLike = tag === "button" || el.getAttribute("role") === "button";
            if (!isButtonLike && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              el.click?.();
            }
          },
        };

        // Si désactivé et que l’enfant est un <a>, on empêche l’action
        if (isDisabled) {
          childProps.onClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
          };
          childProps.tabIndex = -1;
        }

        // On place le contenu (icônes, spinner) À L’INTÉRIEUR de l’enfant.
        const content = (
          <>
            {loading && variant !== "link" && <Spinner className="h-4 w-4" />}
            {!loading && LeftIcon && <LeftIcon aria-hidden="true" />}
            <span className="inline-flex items-center">{onlyChild.props.children}</span>
            {!loading && RightIcon && <RightIcon aria-hidden="true" />}
          </>
        );

        return React.cloneElement(onlyChild, childProps, content);
      }

      // Fallback (sécurisé) : on repasse en <button> classique si l’enfant n’est pas valide/unique
      // pour éviter l’erreur React.Children.only.
    }

    // Rendu bouton standard
    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onKeyDown={onKeyDown}
        {...props}
      >
        {loading && variant !== "link" && <Spinner className="h-4 w-4" />}
        {!loading && LeftIcon && <LeftIcon aria-hidden="true" />}
        <span className="inline-flex items-center">{children}</span>
        {!loading && RightIcon && <RightIcon aria-hidden="true" />}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
